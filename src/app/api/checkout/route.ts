import { z } from "zod";
import { getStripeCheckoutConfig } from "@/lib/env";
import { createStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sowDocuments } from "@/lib/sow";
import { hashSow } from "@/lib/sow-security";
import { enforceRateLimit, getRequestFingerprint, getRequestId, isSameOriginRequest, rateLimitResponse, readLimitedJson, RequestBodyTooLargeError, safeLog } from "@/lib/security";

const schema = z.object({
  plan: z.enum(["first-week", "weekly", "monthly"]),
  fullName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(254),
  acceptedPolicies: z.literal("yes"),
  signerTitle: z.string().trim().max(120).optional(),
  clientSignature: z.string().trim().max(120).optional(),
  acceptedSow: z.literal("yes").optional(),
  authorityConsent: z.literal("yes").optional(),
  electronicSignatureConsent: z.literal("yes").optional(),
});

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  if (!isSameOriginRequest(request)) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  let body: unknown;
  try {
    body = await readLimitedJson(request);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return Response.json({ error: error.message }, { status: 413 });
    throw error;
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Complete every required field before continuing." }, { status: 400 });

  const requiresSow = parsed.data.plan === "weekly" || parsed.data.plan === "monthly";
  if (requiresSow && (
    !parsed.data.signerTitle
    || parsed.data.signerTitle.length < 2
    || !parsed.data.clientSignature
    || parsed.data.clientSignature.length < 2
    || parsed.data.acceptedSow !== "yes"
    || parsed.data.authorityConsent !== "yes"
    || parsed.data.electronicSignatureConsent !== "yes"
  )) return Response.json({ error: "Review and sign the Statement of Work before continuing." }, { status: 400 });

  let sowId: string | null = null;
  try {
    const rate = await enforceRateLimit({ request, requestId, route: "checkout.create", limit: 10, windowSeconds: 3600, subject: parsed.data.email });
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
    const config = getStripeCheckoutConfig();
    const stripe = createStripeClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://automatemejay.com";
    const isGuaranteedWeek = parsed.data.plan === "first-week";
    const isWeekly = parsed.data.plan === "weekly";
    const lineItems = isWeekly ? [{
      price_data: {
        currency: "usd",
        unit_amount: 35000,
        product_data: {
          name: "One Week of AI Automation Partner Access",
          description: "One paid seven-day service period with no automatic renewal.",
          metadata: { application: "sirotin-consulting", plan: "weekly" },
        },
      },
      quantity: 1,
    }] : [{ price: isGuaranteedWeek ? config.guaranteedFirstWeekPriceId : config.monthlyPriceId, quantity: 1 }];

    let sowVersion: string | undefined;
    let sowHash: string | undefined;
    if (requiresSow) {
      const document = sowDocuments[parsed.data.plan as "weekly" | "monthly"];
      sowVersion = document.version;
      sowHash = hashSow(document);
      const supabase = createAdminClient();
      const { data: sow, error: sowError } = await supabase.from("service_sows").insert({
        plan: parsed.data.plan,
        sow_version: sowVersion,
        document_hash: sowHash,
        document_snapshot: document,
        client_name: parsed.data.fullName,
        client_email: parsed.data.email.toLowerCase(),
        company_name: parsed.data.companyName,
        signer_title: parsed.data.signerTitle,
        client_signature: parsed.data.clientSignature,
        client_authority_confirmed: true,
        electronic_signature_consent: true,
        client_request_key_hash: getRequestFingerprint(request, parsed.data.email),
        client_user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      }).select("id").single();
      if (sowError || !sow) throw sowError ?? new Error("SOW record was not created.");
      sowId = sow.id;
    }
    const session = await stripe.checkout.sessions.create({
      mode: isGuaranteedWeek || isWeekly ? "payment" : "subscription",
      customer_email: parsed.data.email.toLowerCase(),
      line_items: lineItems,
      billing_address_collection: "auto",
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/${parsed.data.plan}?canceled=1`,
      metadata: {
        application: "sirotin-consulting",
        plan: parsed.data.plan,
        client_name: parsed.data.fullName,
        company_name: parsed.data.companyName,
        policy_version: "2026-08-03-service-agreement",
        ...(sowId && sowVersion && sowHash ? { sow_id: sowId, sow_version: sowVersion, sow_hash: sowHash } : {}),
      },
      ...(isGuaranteedWeek || isWeekly ? {} : { subscription_data: {
        metadata: {
          application: "sirotin-consulting",
          plan: parsed.data.plan,
          client_name: parsed.data.fullName,
          company_name: parsed.data.companyName,
        },
      } }),
    });
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    if (sowId) {
      const supabase = createAdminClient();
      const { error: sowUpdateError } = await supabase.from("service_sows").update({ stripe_checkout_session_id: session.id }).eq("id", sowId);
      if (sowUpdateError) throw sowUpdateError;
    }
    return Response.json({ url: session.url }, { headers: { "Cache-Control": "no-store", "x-request-id": requestId } });
  } catch (error) {
    if (sowId) {
      try {
        await createAdminClient().from("service_sows").update({ status: "void" }).eq("id", sowId).eq("status", "client_signed_checkout_pending");
      } catch {
        // The original failure is logged below; never replace it with cleanup noise.
      }
    }
    safeLog("error", "checkout.create_failed", { requestId, error });
    return Response.json({ error: "Secure checkout is temporarily unavailable." }, { status: 503 });
  }
}
