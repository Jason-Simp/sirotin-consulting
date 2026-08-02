import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Check } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Choose a Plan", robots: { index: false, follow: false } };

const planData = {
  "first-week": { name: "Guaranteed First Week", price: "$350", cadence: "one time", notice: "Full $350 service-fee money-back guarantee" },
  monthly: { name: "Monthly Partner", price: "$1,000", cadence: "each month", notice: "Thirty days’ written cancellation notice" },
} as const;

export default async function CheckoutPage({ params }: { params: Promise<{ plan: string }> }) {
  const { plan } = await params;
  if (plan === "weekly") redirect("/checkout/first-week");
  if (!(plan in planData)) notFound();
  const selectedPlan = plan as keyof typeof planData;
  const selected = planData[selectedPlan];
  const testMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ?? true;

  return <main className="subpage"><SubpageHeader /><div className="checkout-layout"><section><p className="section-label">/ {selected.name}</p>{testMode && <span className="test-badge">Stripe sandbox · No real charge</span>}<h1>{selected.price}<span>{selected.cadence}</span></h1><p>{selectedPlan === "first-week" ? "A paid seven-day introduction with a straightforward full money-back guarantee. Continue monthly only if you choose to." : "An ongoing AI automation relationship with clear capacity and priorities."}</p><div className="checkout-summary"><span><Check size={15} /> One primary directing stakeholder</span><span><Check size={15} /> One active workstream</span><span><Check size={15} /> {selected.notice}</span>{selectedPlan === "first-week" && <span><Check size={15} /> No automatic monthly conversion</span>}</div></section><aside><CheckoutForm plan={selectedPlan} /></aside></div></main>;
}
