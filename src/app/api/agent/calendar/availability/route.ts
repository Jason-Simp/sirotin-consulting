import { z } from "zod";
import { isAuthorizedAgentToolRequest } from "@/lib/agent-auth";
import { auditAgentAction } from "@/lib/agent-audit";
import { checkJasonAvailability } from "@/lib/google-calendar";

const schema = z.object({
  start_iso: z.string().datetime({ offset: true }),
  end_iso: z.string().datetime({ offset: true }),
  conversation_id: z.string().max(255).optional(),
});

export async function POST(request: Request) {
  if (!isAuthorizedAgentToolRequest(request)) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Provide an exact start and end time with UTC offsets." }, { status: 400 });
  const start = new Date(parsed.data.start_iso);
  const end = new Date(parsed.data.end_iso);
  if (start.getTime() <= Date.now() || end.getTime() - start.getTime() !== 30 * 60 * 1000) {
    return Response.json({ error: "Availability checks must be for one future 30-minute slot." }, { status: 400 });
  }

  try {
    const result = await checkJasonAvailability(start.toISOString(), end.toISOString());
    await auditAgentAction({
      conversationId: parsed.data.conversation_id,
      action: "calendar.check_availability",
      status: "completed",
      requestData: { start_iso: parsed.data.start_iso, end_iso: parsed.data.end_iso },
      responseData: { available: result.available, calendars_checked: result.calendarsChecked },
    });
    return Response.json({ available: result.available, start_iso: parsed.data.start_iso, end_iso: parsed.data.end_iso, calendars_checked: result.calendarsChecked });
  } catch (error) {
    console.error("agent_availability_failed", error);
    return Response.json({ error: "Calendar availability is temporarily unavailable. Offer to connect the visitor with Jason by email instead." }, { status: 503 });
  }
}
