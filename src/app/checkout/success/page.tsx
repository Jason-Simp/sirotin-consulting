import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { createStripeClient } from "@/lib/stripe";
import { SubpageHeader } from "@/components/subpage-header";

export const metadata: Metadata = { title: "Payment Received", robots: { index: false, follow: false } };

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  let confirmed = false;
  let guaranteedWeek = false;
  if (sessionId?.startsWith("cs_")) {
    try {
      const session = await createStripeClient().checkout.sessions.retrieve(sessionId);
      confirmed = session.status === "complete";
      guaranteedWeek = session.metadata?.plan === "first-week";
    } catch {
      confirmed = false;
    }
  }
  return <main className="subpage"><SubpageHeader /><section className="simple-state"><CheckCircle2 className="success-icon" size={42} /><p className="section-label">/ {confirmed ? "Payment received" : "Checkout status"}</p><h1>{confirmed ? "You’re in." : "We’re confirming your checkout."}</h1><p>{confirmed ? guaranteedWeek ? "Your $350 payment is confirmed. Jason will review the intake and confirm when your seven-day guarantee period begins. Your email includes a private link for your end-of-week choice." : "Your payment was confirmed by Stripe. You’ll receive account access and the next step by email." : "If you completed payment, confirmation should arrive shortly. No browser redirect alone activates service."}</p><div className="button-row"><Link className="button button-dark" href="/">Return home</Link>{confirmed && guaranteedWeek && sessionId ? <Link className="button button-primary" href={`/guarantee?session_id=${encodeURIComponent(sessionId)}`}>View your guarantee options</Link> : <Link className="button button-primary" href="/sign-in">Client sign in</Link>}</div></section></main>;
}
