"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
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
    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const isOwnerTestAccount = email === "jason@simplsolutions.app" || email === "sirotin@ecgprod.com";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${siteUrl}/auth/callback?next=/portal`, shouldCreateUser: isOwnerTestAccount },
    });
    if (error) safeLog("warn", "auth.magic_link_not_sent", { requestId, error });
  } catch (error) {
    safeLog("error", "auth.magic_link_failed", { requestId, error });
  }
  redirect("/sign-in?sent=1");
}
