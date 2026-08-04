import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim().split(":")[0];
  const host = forwardedHost ?? request.headers.get("host")?.split(":")[0];
  if (host === "aimejay.com" || host === "www.aimejay.com" || host === "www.automatemejay.com") {
    const destination = request.nextUrl.clone();
    destination.hostname = "automatemejay.com";
    destination.protocol = "https:";
    destination.port = "";
    const response = NextResponse.redirect(destination, 308);
    response.headers.set("x-request-id", requestId);
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);
  const pathname = request.nextUrl.pathname;
  const sessionSensitivePath = ["/api", "/auth", "/checkout", "/guarantee", "/legal/sow", "/portal", "/sign-in", "/sow"]
    .some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const hasSupabaseSession = request.cookies.getAll().some(({ name }) => /^sb-.*-auth-token(?:\.\d+)?$/.test(name));

  if (sessionSensitivePath || hasSupabaseSession) return updateSession(request, requestId);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
