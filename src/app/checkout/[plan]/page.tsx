import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";

export const metadata: Metadata = { title: "Choose a Plan", robots: { index: false, follow: false } };

const planData = {
  weekly: { name: "Weekly Partner", price: "$350", cadence: "each week", notice: "Seven days’ written cancellation notice" },
  monthly: { name: "Monthly Partner", price: "$1,000", cadence: "each month", notice: "Thirty days’ written cancellation notice" },
};

export default async function CheckoutPage({ params }: { params: Promise<{ plan: string }> }) {
  const { plan } = await params;
  if (!(plan in planData)) notFound();
  const selected = planData[plan as keyof typeof planData];
  return <main className="subpage"><SubpageHeader /><section className="simple-state"><p className="section-label">/ {selected.name}</p><h1>{selected.price} <span className="checkout-cadence">{selected.cadence}</span></h1><p>Secure Stripe checkout is the final account connection still required. No charge can occur from this page while it is in setup mode.</p><div className="checkout-summary"><span><Check size={15} /> One primary directing stakeholder</span><span><Check size={15} /> One active workstream</span><span><Check size={15} /> {selected.notice}</span></div><div className="button-row"><Link className="button button-primary" href="/start">Start free instead</Link><a className="button button-dark" href={`mailto:hello@automatemejay.com?subject=${encodeURIComponent(selected.name + " request")}`}>Request this plan</a></div></section></main>;
}
