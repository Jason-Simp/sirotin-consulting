"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

type FormState = "idle" | "submitting" | "success" | "error";

export function StartForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setState("submitting");
    setMessage("");
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok) throw new Error(result.error || "Could not submit your request.");
      formElement.reset();
      setState("success");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Could not submit your request.");
    }
  }

  if (state === "success") {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={38} />
        <h2>Your request is in.</h2>
        <p>Your intake is ready. Complete the one-time $350 payment to reserve the guaranteed first week. The seven-day period does not begin until Jason confirms activation.</p>
        <Link className="button button-primary" href="/checkout/first-week">Continue to secure checkout <ArrowRight size={18} /></Link>
      </div>
    );
  }

  return (
    <form className="intake-form" onSubmit={submit}>
      <div className="field-grid">
        <label>Full name<input name="fullName" autoComplete="name" required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Company name<input name="companyName" autoComplete="organization" required /></label>
        <label>Job title <small>Optional</small><input name="jobTitle" autoComplete="organization-title" /></label>
        <label>Phone <small>Optional</small><input name="phone" type="tel" autoComplete="tel" /></label>
        <label>Company website <small>Optional</small><input name="website" type="url" autoComplete="url" placeholder="https://" /></label>
      </div>
      <label>What process would you like to automate? <small>At least 10 characters</small><textarea name="process" rows={4} minLength={10} required /></label>
      <label>What currently happens? <small>At least 10 characters</small><textarea name="currentProcess" rows={4} minLength={10} required /></label>
      <label>What result would be useful? <small>At least 10 characters</small><textarea name="desiredResult" rows={4} minLength={10} required /></label>
      <label>What systems are involved? <small>At least 2 characters</small><textarea name="systems" rows={3} minLength={2} required /></label>
      <fieldset>
        <legend>Does this process involve sensitive or regulated information?</legend>
        <label className="radio-label"><input type="radio" name="sensitiveData" value="yes" required /> Yes</label>
        <label className="radio-label"><input type="radio" name="sensitiveData" value="no" required /> No</label>
        <label className="radio-label"><input type="radio" name="sensitiveData" value="unsure" required /> Unsure</label>
      </fieldset>
      <label className="honeypot" aria-hidden="true">Leave this empty<input name="companyFax" tabIndex={-1} autoComplete="off" /></label>
      <label className="consent"><input type="checkbox" name="acceptedPolicies" value="yes" required /><span>I accept the <a href="/legal/terms" target="_blank">Terms and Consulting Agreement</a>, <a href="/legal/privacy" target="_blank">Privacy Policy</a>, and <a href="/legal/security" target="_blank">Data and Security Notice</a>.</span></label>
      {state === "error" && <p className="form-error" role="alert">{message} You can also email <a href="mailto:hello@automatemejay.com">hello@automatemejay.com</a>.</p>}
      <button className="button button-primary submit-button" type="submit" disabled={state === "submitting"}>{state === "submitting" ? "Sending…" : "Continue to the guaranteed week"}<ArrowRight size={18} /></button>
      <p className="form-note">Payment details are collected securely by Stripe after this step. Do not include passwords, financial account numbers, health information, or other sensitive data in this form.</p>
    </form>
  );
}
