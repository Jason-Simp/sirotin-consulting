import { z } from "zod";
import type Stripe from "stripe";
import { createStripeClient } from "@/lib/stripe";

const schema = z.object({
  priceId: z.string().startsWith("price_"),
  fullName: z.string().trim().min(2).max(120),
  companyName: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(254),
  acceptedPolicies: z.literal("yes"),
});

function isAllowedProduct(product: string | Stripe.Product | Stripe.DeletedProduct): product is Stripe.Product {
  return typeof product !== "string" && !product.deleted && product.active && product.metadata.application === "sirotin-consulting" && product.metadata.public_catalog === "true";
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Complete every required field before continuing." }, { status: 400 });

  try {
    const stripe = createStripeClient();
    const price = await stripe.prices.retrieve(parsed.data.priceId, { expand: ["product"] });
    if (!price.active || price.type !== "one_time" || !isAllowedProduct(price.product)) {
      return Response.json({ error: "This one-off service is not currently available." }, { status: 404 });
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.data.email.toLowerCase(),
      line_items: [{ price: price.id, quantity: 1 }],
      billing_address_collection: "auto",
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/one-off?price=${encodeURIComponent(price.id)}&canceled=1`,
      metadata: {
        application: "sirotin-consulting",
        plan: "one-off",
        product_name: price.product.name,
        client_name: parsed.data.fullName,
        company_name: parsed.data.companyName,
        policy_version: "2026-08-02-service-agreement",
      },
    });
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    return Response.json({ url: session.url });
  } catch (error) {
    console.error("one_off_checkout_failed", error);
    return Response.json({ error: "Secure checkout is temporarily unavailable." }, { status: 503 });
  }
}
