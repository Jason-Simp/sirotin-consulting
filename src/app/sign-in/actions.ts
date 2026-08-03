"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { enforceRateLimit, getRequestId, safeLog } from "@/lib/security";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) redirect("/sign-in?error=invalid-email");

  const request = { headers: new Headers(await headers()) };
  const requestId = getRequestId(request);
  let allowed = false;
  try {
    const rate = await enforceRateLimit({ request, requestId, route: "auth.magic_link", limit: 5, windowSeconds: 3600, subject: email });
    allowed = rate.allowed;
    if (!allowed) safeLog("warn", "auth.magic_link_rate_limited", { requestId });
  } catch (error) {
    safeLog("error", "auth.magic_link_security_check_failed", { requestId, error });
  }

  if (!allowed) redirect("/sign-in?sent=1");

  try {
    const supabase = createAdminClient();
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (profileError) throw profileError;

    // Keep the response identical for unknown addresses while never creating
    // an account from this public form.
    if (profile) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://automatemejay.com";
      const { data, error } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo: `${siteUrl}/auth/callback?next=/portal` },
      });
      if (error || !data.properties?.action_link) throw error ?? new Error("Supabase did not generate a sign-in link.");
      if (!process.env.RESEND_API_KEY) throw new Error("Resend is not configured.");

      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error: emailError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "Jason Sirotin <hello@automatemejay.com>",
        to: email,
        replyTo: process.env.RESEND_REPLY_TO ?? "hello@automatemejay.com",
        subject: "Your secure AutomateMeJay sign-in link",
        text: `Use this single-use link to open your private client workspace:\n\n${data.properties.action_link}\n\nIf you did not request this link, you can safely ignore this email.`,
      });
      if (emailError) throw emailError;
    }
  } catch (error) {
    safeLog("error", "auth.magic_link_failed", { requestId, error });
  }
  redirect("/sign-in?sent=1");
}
