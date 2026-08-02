import { z } from "zod";
import { getStripeCheckoutConfig } from "@/lib/env";
import { createStripeClient } from "@/lib/stripe";

const schema = z.object({
  plan: z.enum(["weekly", "monthly"]),
  fullName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(254),
  acceptedPolicies: z.literal("yes"),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Complete every required field before continuing." }, { status: 400 });

  try {
    const config = getStripeCheckoutConfig();
    const stripe = createStripeClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const price = parsed.data.plan === "weekly" ? config.weeklyPriceId : config.monthlyPriceId;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: parsed.data.email.toLowerCase(),
      line_items: [{ price, quantity: 1 }],
      billing_address_collection: "auto",
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/${parsed.data.plan}?canceled=1`,
      metadata: {
        application: "sirotin-consulting",
        plan: parsed.data.plan,
        client_name: parsed.data.fullName,
        company_name: parsed.data.companyName,
        policy_version: "2026-08-02",
      },
      subscription_data: {
        metadata: {
          application: "sirotin-consulting",
          plan: parsed.data.plan,
          client_name: parsed.data.fullName,
          company_name: parsed.data.companyName,
        },
      },
    });
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    return Response.json({ url: session.url });
  } catch (error) {
    console.error("stripe_checkout_failed", error);
    return Response.json({ error: "Secure checkout is temporarily unavailable." }, { status: 503 });
  }
}
