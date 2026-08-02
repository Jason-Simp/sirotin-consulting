"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";

export function GuaranteeForm({ sessionId }: { sessionId: string }) {
  const [error, setError] = useState("");
  const [done, setDone] = useState<"continue_monthly" | "request_refund" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function decide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const decision = submitter?.value === "request_refund" ? "request_refund" : "continue_monthly";
    setError("");
    setSubmitting(true);
    const email = new FormData(event.currentTarget).get("email");
    try {
      const response = await fetch("/api/guarantee/decision", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, email, decision }),
      });
      const result = await response.json() as { ok?: boolean; url?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Your choice could not be recorded.");
      if (result.url) {
        window.location.assign(result.url);
        return;
      }
      setDone(decision);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your choice could not be recorded.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done === "request_refund") return <div className="form-success"><CheckCircle2 size={38} /><h2>Your refund request is recorded.</h2><p>Jason’s team will return the $350 service fee to the original payment method. You’ll receive confirmation by email.</p></div>;

  return <form className="checkout-form guarantee-form" onSubmit={(event) => void decide(event)}>
    <label>Email used at checkout<input name="email" type="email" autoComplete="email" required /></label>
    <p>For your security, this must match the email attached to the Stripe purchase.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-primary" type="submit" name="decision" value="continue_monthly" disabled={submitting}>Continue monthly <ArrowRight size={17} /></button>
    <button className="button button-dark" type="submit" name="decision" value="request_refund" disabled={submitting}><RotateCcw size={16} /> Request full $350 refund</button>
  </form>;
}
