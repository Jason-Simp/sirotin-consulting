"use client";

import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

export function NewsletterSignup() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("sending");
    setMessage("");
    const form = new FormData(formElement);
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName: form.get("fullName"),
        email: form.get("email"),
        consent: form.get("consent") ? "yes" : "no",
        companyFax: form.get("companyFax"),
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus("error");
      setMessage(payload.error ?? "The signup could not be completed right now.");
      return;
    }
    setStatus("sent");
    formElement.reset();
  }

  if (status === "sent") return <div className="newsletter-success" role="status"><CheckCircle2 size={25} /><div><strong>Lesson one is on its way.</strong><span>Check your inbox for AI Automation Basics.</span></div></div>;

  return <form className="newsletter-form" onSubmit={submit}>
    <div className="newsletter-fields">
      <label><span>First name <small>optional</small></span><input name="fullName" autoComplete="given-name" maxLength={120} /></label>
      <label><span>Email address</span><input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    </div>
    <label className="newsletter-consent"><input name="consent" type="checkbox" required /> <span>Send me the five-part AI Automation Basics series and occasional practical news. I can unsubscribe anytime.</span></label>
    <input className="honeypot" name="companyFax" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    {status === "error" && <p className="form-error" role="alert">{message}</p>}
    <button className="button button-primary" type="submit" disabled={status === "sending"}><Mail size={17} /> {status === "sending" ? "Joining…" : "Start the free series"} <ArrowRight size={17} /></button>
  </form>;
}
