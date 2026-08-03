import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type Stripe from "stripe";
import { Check } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";
import { createStripeClient } from "@/lib/stripe";
import { OneOffCheckoutForm } from "./one-off-checkout-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "One-Off Service Checkout", robots: { index: false, follow: false }, alternates: { canonical: "/checkout/one-off" } };

export default async function OneOffCheckoutPage({ searchParams }: { searchParams: Promise<{ price?: string }> }) {
  const { price: priceId } = await searchParams;
  if (!priceId?.startsWith("price_")) notFound();
  let price: Stripe.Price;
  try {
    price = await createStripeClient().prices.retrieve(priceId, { expand: ["product"] });
  } catch {
    notFound();
  }
  const product = price.product;
  if (!price.active || price.type !== "one_time" || typeof product === "string" || product.deleted || !product.active || product.metadata.application !== "sirotin-consulting" || product.metadata.public_catalog !== "true") notFound();
  const amount = price.unit_amount === null ? "One-time service" : new Intl.NumberFormat("en-US", { style: "currency", currency: price.currency }).format(price.unit_amount / 100);

  return <main className="subpage"><SubpageHeader /><div className="checkout-layout"><section><p className="section-label">/ One-off work</p><h1>{amount}<span>one time</span></h1><h2>{product.name}</h2><p>{product.description ?? "A clearly scoped, one-time automation deliverable."}</p><div className="checkout-summary"><span><Check size={15} /> Defined product and price</span><span><Check size={15} /> No recurring subscription</span><span><Check size={15} /> Secure Stripe checkout</span><span><Check size={15} /> Additional work requires separate approval</span></div></section><aside><OneOffCheckoutForm priceId={price.id} /></aside></div></main>;
}
