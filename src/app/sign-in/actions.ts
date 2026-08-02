"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) redirect("/sign-in?error=invalid-email");

  try {
    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${siteUrl}/auth/callback?next=/portal`, shouldCreateUser: false },
    });
    if (error) throw error;
  } catch (error) {
    console.error("magic_link_failed", error);
    redirect("/sign-in?error=unavailable");
  }
  redirect("/sign-in?sent=1");
}
