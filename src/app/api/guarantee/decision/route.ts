import { z } from "zod";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { createStripeClient } from "@/lib/stripe";
import { enforceRateLimit, getRequestId, isSameOriginRequest, rateLimitResponse, readLimitedJson, RequestBodyTooLargeError, safeLog } from "@/lib/security";

const schema = z.object({
  sessionId: z.string().startsWith("cs_").max(255),
  email: z.string().trim().email().max(254),
  decision: z.enum(["continue_monthly", "request_refund"]),
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
  if (!parsed.success) return Response.json({ error: "Enter the email used at checkout and choose an option." }, { status: 400 });

  try {
    const rate = await enforceRateLimit({ request, requestId, route: "guarantee.decision", limit: 8, windowSeconds: 3600, subject: parsed.data.email });
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
    const stripe = createStripeClient();
    const session = await stripe.checkout.sessions.retrieve(parsed.data.sessionId);
    const checkoutEmail = session.customer_details?.email ?? session.customer_email;
    const isEligible = session.status === "complete"
      && session.payment_status === "paid"
      && session.metadata?.plan === "first-week"
      && checkoutEmail?.toLowerCase() === parsed.data.email.toLowerCase();
    if (!isEligible) return Response.json({ error: "We could not verify that guaranteed-week purchase." }, { status: 403 });

    const supabase = createAdminClient();
    let { data: engagement, error: engagementError } = await supabase
      .from("guaranteed_engagements")
      .select("id,status,guarantee_ends_at")
      .eq("stripe_checkout_session_id", session.id)
      .maybeSingle();
    if (!engagement && !engagementError) {
      const created = await supabase.from("guaranteed_engagements").upsert({
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
        customer_email: checkoutEmail!.toLowerCase(),
        customer_name: session.metadata?.client_name ?? session.customer_details?.name,
        company_name: session.metadata?.company_name,
        status: "paid_pending_activation",
      }, { onConflict: "stripe_checkout_session_id" }).select("id,status,guarantee_ends_at").single();
      engagement = created.data;
      engagementError = created.error;
    }
    if (engagementError || !engagement) throw engagementError ?? new Error("Guaranteed engagement was not recorded.");

    if (engagement.guarantee_ends_at && new Date(engagement.guarantee_ends_at).getTime() < Date.now()) {
      return Response.json({ error: "The guarantee period has ended. Email hello@automatemejay.com so Jason can review the timeline." }, { status: 409 });
    }

    let monthlyUrl: string | null = null;
    if (parsed.data.decision === "continue_monthly") {
      const priceId = process.env.STRIPE_MONTHLY_PRICE_ID;
      if (!priceId?.startsWith("price_")) throw new Error("Monthly Stripe price is not configured.");
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://automatemejay.com";
      const monthly = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: checkoutEmail ?? undefined,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/guarantee?session_id=${encodeURIComponent(session.id)}`,
        metadata: { application: "sirotin-consulting", plan: "monthly", converted_from: session.id },
        subscription_data: { metadata: { application: "sirotin-consulting", plan: "monthly", converted_from: session.id } },
      });
      monthlyUrl = monthly.url;
      if (!monthlyUrl) throw new Error("Stripe did not return a monthly checkout URL.");
    }

    const { error: decisionError } = await supabase.from("guarantee_decisions").insert({
      engagement_id: engagement.id,
      decision: parsed.data.decision,
      customer_email: parsed.data.email.toLowerCase(),
      request_ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      user_agent: request.headers.get("user-agent"),
    });
    if (decisionError?.code === "23505") return Response.json({ error: "A decision has already been recorded for this engagement." }, { status: 409 });
    if (decisionError) throw decisionError;

    await supabase.from("guaranteed_engagements").update({
      status: parsed.data.decision === "continue_monthly" ? "monthly_selected" : "refund_requested",
      decision_at: new Date().toISOString(),
    }).eq("id", engagement.id);

    if (monthlyUrl) return Response.json({ ok: true, url: monthlyUrl });

    if (process.env.RESEND_API_KEY && process.env.JASON_NOTIFICATION_EMAIL) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "Jason Sirotin <hello@automatemejay.com>",
          to: process.env.JASON_NOTIFICATION_EMAIL,
          replyTo: parsed.data.email,
          subject: "Guaranteed-week refund requested",
          text: `A verified customer requested the full $350 first-week service-fee refund.\n\nEmail: ${parsed.data.email}\nStripe checkout session: ${session.id}\n\nProcess the refund to the original payment method.`,
        });
      } catch (emailError) {
        safeLog("error", "guarantee.refund_notification_failed", { requestId, error: emailError });
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    safeLog("error", "guarantee.decision_failed", { requestId, error });
    return Response.json({ error: "We could not record your choice. Email hello@automatemejay.com and your guarantee request will be honored based on the time you contacted us." }, { status: 503 });
  }
}
