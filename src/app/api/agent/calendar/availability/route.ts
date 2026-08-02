import { z } from "zod";
import { isAuthorizedAgentToolRequest } from "@/lib/agent-auth";
import { auditAgentAction } from "@/lib/agent-audit";
import { checkJasonAvailability } from "@/lib/google-calendar";
import { enforceRateLimit, getRequestId, rateLimitResponse, readLimitedJson, RequestBodyTooLargeError, safeLog } from "@/lib/security";

const schema = z.object({
  start_iso: z.string().datetime({ offset: true }),
  end_iso: z.string().datetime({ offset: true }),
  conversation_id: z.string().max(255).optional(),
});

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  if (!isAuthorizedAgentToolRequest(request)) {
    safeLog("warn", "agent.availability_unauthorized", { requestId });
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }
  let body: unknown;
  try { body = await readLimitedJson(request); }
  catch (error) { if (error instanceof RequestBodyTooLargeError) return Response.json({ error: error.message }, { status: 413 }); throw error; }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Provide an exact start and end time with UTC offsets." }, { status: 400 });
  const start = new Date(parsed.data.start_iso);
  const end = new Date(parsed.data.end_iso);
  if (start.getTime() <= Date.now() || end.getTime() - start.getTime() !== 30 * 60 * 1000) {
    return Response.json({ error: "Availability checks must be for one future 30-minute slot." }, { status: 400 });
  }

  try {
    const rate = await enforceRateLimit({ request, requestId, route: "agent.availability", limit: 120, windowSeconds: 3600 });
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
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
    safeLog("error", "agent.availability_failed", { requestId, error });
    return Response.json({ error: "Calendar availability is temporarily unavailable. Offer to connect the visitor with Jason by email instead." }, { status: 503 });
  }
}
