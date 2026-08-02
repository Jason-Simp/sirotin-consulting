import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const host = request.headers.get("host")?.split(":")[0];
  if (host === "aimejay.com" || host === "www.aimejay.com" || host === "www.automatemejay.com") {
    const destination = request.nextUrl.clone();
    destination.hostname = "automatemejay.com";
    destination.protocol = "https:";
    destination.port = "";
    const response = NextResponse.redirect(destination, 308);
    response.headers.set("x-request-id", requestId);
    return response;
  }
  return updateSession(request, requestId);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
