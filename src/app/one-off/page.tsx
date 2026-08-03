import Link from "next/link";
import { ArrowRight, PackagePlus, Sparkles } from "lucide-react";
import type Stripe from "stripe";
import { SubpageHeader } from "@/components/subpage-header";
import { hasStripeCheckoutConfig } from "@/lib/env";
import { createStripeClient } from "@/lib/stripe";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = createPageMetadata({
  title: "One-Off AI Automation Services",
  description: "Purchase a clearly scoped, non-renewing AI automation service or add-on from Jason Sirotin.",
  path: "/one-off",
});

function isPublicProduct(product: string | Stripe.Product | Stripe.DeletedProduct): product is Stripe.Product {
  return typeof product !== "string" && !product.deleted && product.active && product.metadata.application === "sirotin-consulting" && product.metadata.public_catalog === "true";
}

function formatPrice(price: Stripe.Price) {
  if (price.unit_amount === null) return "Custom price";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: price.currency }).format(price.unit_amount / 100);
}

export default async function OneOffPage() {
  let products: Array<{ price: Stripe.Price; product: Stripe.Product }> = [];
  try {
    if (!hasStripeCheckoutConfig()) throw new Error("Stripe is not configured.");
    const stripe = createStripeClient();
    const prices = await stripe.prices.list({ active: true, type: "one_time", expand: ["data.product"], limit: 100 });
    products = prices.data
      .filter((price): price is Stripe.Price & { product: Stripe.Product } => isPublicProduct(price.product))
      .map((price) => ({ price, product: price.product }));
  } catch {}

  return <main className="subpage"><SubpageHeader /><section className="one-off-hero"><p className="section-label">/ One-off additions</p><Sparkles size={28} /><h1>Buy the extra work you need—without starting a subscription.</h1><p>Each item has a defined scope and one-time price. It does not renew or change an existing weekly or monthly membership.</p></section><section className="one-off-catalog" aria-label="Available one-off services">{products.length ? products.map(({ price, product }) => <article className="one-off-card" key={price.id}><PackagePlus size={21} /><div><p className="eyebrow">One-time service</p><h2>{product.name}</h2><p>{product.description ?? "A clearly scoped automation deliverable."}</p></div><div className="one-off-buy"><strong>{formatPrice(price)}</strong><Link className="button button-primary" href={`/checkout/one-off?price=${encodeURIComponent(price.id)}`}>Choose this item <ArrowRight size={16} /></Link></div></article>) : <article className="one-off-card one-off-empty"><PackagePlus size={24} /><div><h2>One-off products are added after scope is approved.</h2><p>Tell me what you need. I will define the deliverable and price before anything is charged.</p></div><Link className="button button-primary" href="/start">Request a one-off item <ArrowRight size={16} /></Link></article>}</section></main>;
}
