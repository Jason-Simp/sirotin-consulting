import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";
import { CheckoutForm } from "./checkout-form";

export async function generateMetadata({ params }: { params: Promise<{ plan: string }> }): Promise<Metadata> {
  const { plan } = await params;
  return {
    title: "Choose a Plan",
    robots: { index: false, follow: false },
    alternates: { canonical: `/checkout/${encodeURIComponent(plan)}` },
  };
}

const planData = {
  "first-week": { name: "Risk-Free First Week", price: "$350", cadence: "one time", notice: "Full $350 service-fee money-back guarantee" },
  weekly: { name: "Weekly Partner", price: "$350", cadence: "one paid week", notice: "No automatic weekly renewal" },
  monthly: { name: "Monthly Partner", price: "$1,000", cadence: "every 30 days", notice: "Cancel anytime—even during the first week" },
} as const;

export default async function CheckoutPage({ params }: { params: Promise<{ plan: string }> }) {
  const { plan } = await params;
  if (!(plan in planData)) notFound();
  const selectedPlan = plan as keyof typeof planData;
  const selected = planData[selectedPlan];
  const testMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? true;

  const description = selectedPlan === "first-week" ? "A paid, risk-free one-week trial. Review the simple SOW, work together for seven days, and continue only if you choose to." : selectedPlan === "weekly" ? "One week of AI automation partner access. Purchase another week only when you want to continue." : "One $1,000 payment covers 30 days. Cancel anytime to stop the next renewal while keeping access through the current paid period.";

  return <main className="subpage"><SubpageHeader /><div className="checkout-layout"><section><p className="section-label">/ {selected.name}</p>{testMode && <span className="test-badge">Stripe sandbox · No real charge</span>}<h1>{selected.price}<span>{selected.cadence}</span></h1><p>{description}</p><div className="checkout-summary"><span><Check size={15} /> One primary directing stakeholder</span><span><Check size={15} /> One active workstream</span><span><Check size={15} /> {selected.notice}</span>{selectedPlan === "first-week" ? <span><Check size={15} /> No automatic conversion</span> : selectedPlan === "weekly" ? <span><Check size={15} /> Access for the paid seven-day period</span> : <><span><Check size={15} /> Access through the paid 30 days</span><span><Check size={15} /> Current payment is not prorated or refunded</span></>}</div></section><aside><CheckoutForm plan={selectedPlan} /></aside></div></main>;
}
