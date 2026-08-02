import Stripe from "stripe";
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
        const organizationId = session.metadata?.organization_id;
        if (organizationId) {
          const plan = session.metadata?.plan;
          await supabase.from("subscriptions").update({
            stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id,
            stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
            status: plan === "weekly" ? "weekly_active" : "monthly_active",
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
