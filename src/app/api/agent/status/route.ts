import { hasGoogleCalendarConfig } from "@/lib/env";

import { AUTOMATEMEJAY_AGENT_ID } from "@/lib/agent-config";

export async function GET() {
  return Response.json({
    agent_configured: Boolean(AUTOMATEMEJAY_AGENT_ID),
    calendar_actions_configured: hasGoogleCalendarConfig(),
  }, { headers: { "cache-control": "no-store" } });
}
