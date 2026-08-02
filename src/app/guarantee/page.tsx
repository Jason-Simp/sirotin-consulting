import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";
import { GuaranteeForm } from "./guarantee-form";

export const metadata: Metadata = { title: "Your First-Week Choice", robots: { index: false, follow: false } };

export default async function GuaranteePage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  if (!sessionId?.startsWith("cs_")) notFound();
  return <main className="subpage"><SubpageHeader /><div className="checkout-layout guarantee-layout"><section><p className="section-label">/ Your first-week choice</p><h1>Keep the momentum—or get your money back.</h1><p>The guaranteed week does not renew automatically. Choose the $1,000 monthly relationship only if it is valuable to you.</p><div className="checkout-summary"><span><Check size={15} /> Continue through a new monthly Stripe checkout</span><span><Check size={15} /> Or request the full $350 service-fee refund</span><span><Check size={15} /> Approved third-party costs remain separate</span></div></section><aside><GuaranteeForm sessionId={sessionId} /></aside></div></main>;
}
