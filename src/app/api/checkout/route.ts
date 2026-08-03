import { z } from "zod";
import { getStripeCheckoutConfig } from "@/lib/env";
import { createStripeClient } from "@/lib/stripe";
import { enforceRateLimit, getRequestId, isSameOriginRequest, rateLimitResponse, readLimitedJson, RequestBodyTooLargeError, safeLog } from "@/lib/security";

const schema = z.object({
  plan: z.enum(["first-week", "weekly", "monthly"]),
  fullName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(254),
  acceptedPolicies: z.literal("yes"),
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
        policy_version: "2026-08-02-service-agreement",
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
    return Response.json({ url: session.url }, { headers: { "Cache-Control": "no-store", "x-request-id": requestId } });
  } catch (error) {
    safeLog("error", "checkout.create_failed", { requestId, error });
    return Response.json({ error: "Secure checkout is temporarily unavailable." }, { status: 503 });
  }
}
