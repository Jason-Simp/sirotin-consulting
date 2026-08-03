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
    if (!error) {
      const response = NextResponse.redirect(new URL(next, siteUrl));
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }
  }

  // Admin invitations currently return an implicit-flow session in the URL
  // fragment. Fragments never reach this route, so hand the browser off to a
  // dedicated client page that can securely persist the session in SSR cookies.
  const completionUrl = new URL("/auth/complete", siteUrl);
  completionUrl.searchParams.set("next", next);
  const response = NextResponse.redirect(completionUrl);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
