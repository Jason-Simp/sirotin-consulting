import { hasSupabaseConfig } from "@/lib/env";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    ok: true,
    service: "sirotin-consulting",
    providers: {
      supabase: hasSupabaseConfig() ? "configured" : "pending",
      stripe: process.env.STRIPE_SECRET_KEY ? "configured" : "pending",
      resend: process.env.RESEND_API_KEY ? "configured" : "pending",
    },
    timestamp: new Date().toISOString(),
  });
}
