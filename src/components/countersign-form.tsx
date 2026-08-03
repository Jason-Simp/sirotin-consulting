"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function CountersignForm({ sowId, token }: { sowId: string; token: string }) {
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch("/api/sow/countersign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, sowId, token }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "The SOW could not be signed.");
      setComplete(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The SOW could not be signed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (complete) return <div className="sow-sign-panel sow-sign-complete"><ShieldCheck /><h2>SOW fully executed</h2><p>The client has been emailed secure access to the signed copy.</p></div>;

  return <form className="sow-sign-panel" onSubmit={submit}>
    <p className="section-label">/ Consultant counter-signature</p>
    <h2>Sign as Jason Sirotin</h2>
    <p>Confirm the payment and client signature record above, then type your legal name.</p>
    <label>Typed legal signature<input name="jasonSignature" defaultValue="Jason Sirotin" required /></label>
    <label className="consent"><input type="checkbox" name="electronicSignatureConsent" value="yes" required /><span>I have reviewed this SOW and intend my typed name to be my electronic signature.</span></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-primary" type="submit" disabled={submitting}>{submitting ? "Signing…" : "Counter-sign SOW"}<ArrowRight size={16} /></button>
  </form>;
}
