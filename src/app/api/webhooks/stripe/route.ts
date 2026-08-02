import Stripe from "stripe";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeWebhookSecret } from "@/lib/env";
import { createStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing Stripe signature." }, { status: 400 });

  try {
    const payload = await request.text();
    const stripe = createStripeClient();
    const event = stripe.webhooks.constructEvent(payload, signature, getStripeWebhookSecret());

    if (process.env.SUPABASE_SECRET_KEY) {
      const supabase = createAdminClient();
      const { error } = await supabase.from("stripe_events").insert({ id: event.id, event_type: event.type, payload: event });
      if (error?.code === "23505") return Response.json({ received: true, duplicate: true });
      if (error) throw error;

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.plan === "first-week" && session.payment_status === "paid") {
          const customerEmail = session.customer_details?.email ?? session.customer_email;
          if (!customerEmail) throw new Error("Guaranteed-week checkout has no customer email.");
          const { error: engagementError } = await supabase.from("guaranteed_engagements").upsert({
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
            customer_email: customerEmail.toLowerCase(),
            customer_name: session.metadata?.client_name ?? session.customer_details?.name,
            company_name: session.metadata?.company_name,
            status: "paid_pending_activation",
          }, { onConflict: "stripe_checkout_session_id", ignoreDuplicates: true });
          if (engagementError) throw engagementError;

          if (process.env.RESEND_API_KEY) {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://automatemejay.com";
            const decisionUrl = `${siteUrl}/guarantee?session_id=${encodeURIComponent(session.id)}`;
            const resend = new Resend(process.env.RESEND_API_KEY);
            try {
              await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL ?? "Jason Sirotin <hello@automatemejay.com>",
                to: customerEmail,
                replyTo: process.env.RESEND_REPLY_TO ?? "hello@automatemejay.com",
                subject: "Your guaranteed first week with Jason",
                text: `Your $350 payment is confirmed. Jason will review your intake and confirm when the seven-day working period is activated.\n\nThe first week does not renew automatically. Save this private link so you can continue monthly or request your full $350 service-fee refund before the guarantee period ends:\n${decisionUrl}\n\nApproved third-party expenses are separate from the service-fee guarantee.`,
              });
            } catch (emailError) {
              console.error("guaranteed_week_email_failed", emailError);
            }
          }
        }
        const organizationId = session.metadata?.organization_id;
        if (organizationId) {
          const plan = session.metadata?.plan;
          await supabase.from("subscriptions").update({
            stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id,
            stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
            status: plan === "monthly" ? "monthly_active" : "payment_required",
            started_at: new Date().toISOString(),
          }).eq("organization_id", organizationId);
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("stripe_webhook_failed", error);
    return Response.json({ error: "Invalid or unprocessable webhook." }, { status: 400 });
  }
}
