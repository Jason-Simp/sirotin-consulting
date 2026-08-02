import { hasGoogleCalendarConfig } from "@/lib/env";

export async function GET() {
  return Response.json({
    agent_configured: Boolean(process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID),
    calendar_actions_configured: hasGoogleCalendarConfig(),
  }, { headers: { "cache-control": "no-store" } });
}
