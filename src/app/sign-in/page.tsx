import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";
import { sendMagicLink } from "./actions";

export const metadata: Metadata = { title: "Client Sign In", robots: { index: false, follow: false } };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const params = await searchParams;
  return <main className="subpage"><SubpageHeader /><section className="simple-state"><p className="section-label">/ Private client workspace</p><h1>Sign in without another password.</h1><p>Enter the email connected to your client account. I’ll send a secure, single-use sign-in link.</p>
    {params.sent ? <div className="login-message"><Mail size={22} /><strong>Check your email.</strong><span>The link can take a minute to arrive.</span></div> : <form className="login-form" action={sendMagicLink}><input type="email" name="email" placeholder="you@company.com" aria-label="Email address" required /><button className="button button-primary" type="submit">Email my sign-in link</button></form>}
    {params.error && <p className="form-error">{params.error === "unavailable" ? "Sign-in is being connected. Please try again later." : "Enter a valid email address."}</p>}
  </section></main>;
}
