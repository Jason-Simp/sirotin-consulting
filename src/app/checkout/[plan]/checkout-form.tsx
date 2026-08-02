"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";

export function CheckoutForm({ plan }: { plan: "first-week" | "weekly" | "monthly" }) {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, plan }),
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? "Checkout is not available.");
      window.location.assign(result.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Checkout is not available.");
      setSubmitting(false);
    }
  }

  return <form className="checkout-form" onSubmit={submit}>
    <label>Full name<input name="fullName" autoComplete="name" required /></label>
    <label>Company name<input name="companyName" autoComplete="organization" required /></label>
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    <label className="consent"><input type="checkbox" name="acceptedPolicies" value="yes" required /><span>I accept the <a href="/legal/terms" target="_blank">Terms and Consulting Agreement</a> and <a href="/legal/privacy" target="_blank">Privacy Policy</a>{plan === "first-week" ? ", including the guaranteed-first-week terms" : `, including recurring ${plan} billing and cancel-anytime terms`}.</span></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-primary" type="submit" disabled={submitting}>{submitting ? "Opening secure checkout…" : "Continue to Stripe"}<ArrowRight size={17} /></button>
    <p><LockKeyhole size={13} /> Payment details are collected by Stripe and never stored on this site.</p>
  </form>;
}
