import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { publicEnv } from "@/lib/env";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requestedNext = url.searchParams.get("next") ?? "/portal";
  const next = requestedNext === "/portal" ? requestedNext : "/portal";
  const siteUrl = publicEnv.siteUrl ?? "https://automatemejay.com";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, siteUrl));
  }
  return NextResponse.redirect(new URL("/sign-in?error=invalid-link", siteUrl));
}
