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

  const requiresSow = plan === "weekly" || plan === "monthly";
  const planName = plan === "weekly" ? "Weekly Partner" : "Monthly Partner";

  return <form className="checkout-form" onSubmit={submit}>
    <label>Full name<input name="fullName" autoComplete="name" required /></label>
    <label>Company name<input name="companyName" autoComplete="organization" required /></label>
    <label>Email<input name="email" type="email" autoComplete="email" required /></label>
    {requiresSow && <div className="sow-checkout-block">
      <div><strong>{planName} Statement of Work</strong><a href={`/legal/sow/${plan}`} target="_blank" rel="noreferrer">Review and save the SOW</a></div>
      <p>The client signs now. After payment, Jason reviews and counter-signs the same version. Both parties receive access to the executed copy.</p>
      <label>Signer title or capacity<input name="signerTitle" autoComplete="organization-title" placeholder="Owner, President, authorized representative…" required /></label>
      <label>Type your full legal name to sign<input name="clientSignature" autoComplete="name" required /></label>
      <label className="consent"><input type="checkbox" name="acceptedSow" value="yes" required /><span>I have reviewed and agree to the <a href={`/legal/sow/${plan}`} target="_blank" rel="noreferrer">{planName} Statement of Work</a>.</span></label>
      <label className="consent"><input type="checkbox" name="authorityConsent" value="yes" required /><span>I confirm that I am authorized to sign this SOW for the client named above.</span></label>
      <label className="consent"><input type="checkbox" name="electronicSignatureConsent" value="yes" required /><span>I consent to electronic records and intend my typed name to be my legal signature for this SOW. I can print or save a copy before continuing.</span></label>
    </div>}
    <label className="consent"><input type="checkbox" name="acceptedPolicies" value="yes" required /><span>I accept the <a href="/legal/terms" target="_blank">Terms and Consulting Agreement</a> and <a href="/legal/privacy" target="_blank">Privacy Policy</a>{plan === "first-week" ? ", including the guaranteed-first-week terms" : plan === "weekly" ? ", including the one-week service terms and no automatic renewal" : ", including recurring monthly billing and cancel-anytime terms"}.</span></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-primary" type="submit" disabled={submitting}>{submitting ? "Opening secure checkout…" : requiresSow ? "Sign SOW and continue to Stripe" : "Continue to Stripe"}<ArrowRight size={17} /></button>
    <p><LockKeyhole size={13} /> Payment details are collected by Stripe and never stored on this site.</p>
  </form>;
}
