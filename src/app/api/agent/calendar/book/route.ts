import { z } from "zod";
import { isAuthorizedAgentToolRequest } from "@/lib/agent-auth";
import { auditAgentAction } from "@/lib/agent-audit";
import { bookJasonIntroduction, checkJasonAvailability } from "@/lib/google-calendar";

const schema = z.object({
  start_iso: z.string().datetime({ offset: true }),
  end_iso: z.string().datetime({ offset: true }),
  timezone: z.string().min(1).max(80),
  guest_name: z.string().trim().min(2).max(120),
  guest_email: z.string().trim().email().max(254),
  company_name: z.string().trim().max(160).optional(),
  conversation_id: z.string().max(255).optional(),
  guest_confirmed: z.literal(true),
});

export async function POST(request: Request) {
  if (!isAuthorizedAgentToolRequest(request)) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Booking requires the guest's confirmed name, email, timezone, and exact 30-minute slot." }, { status: 400 });
  const start = new Date(parsed.data.start_iso);
  const end = new Date(parsed.data.end_iso);
  if (start.getTime() <= Date.now() || end.getTime() - start.getTime() !== 30 * 60 * 1000) {
    return Response.json({ error: "Introduction meetings must be exactly 30 minutes and in the future." }, { status: 400 });
  }

  const auditRequest = { ...parsed.data, guest_email: parsed.data.guest_email.toLowerCase() };
  try {
    await auditAgentAction({ conversationId: parsed.data.conversation_id, action: "calendar.book_introduction", status: "requested", requestData: auditRequest });
    const availability = await checkJasonAvailability(start.toISOString(), end.toISOString());
    if (!availability.available) {
      await auditAgentAction({ conversationId: parsed.data.conversation_id, action: "calendar.book_introduction", status: "rejected", requestData: auditRequest, responseData: { reason: "slot_no_longer_available" } });
      return Response.json({ error: "That time was just taken. Check availability again and offer a different slot." }, { status: 409 });
    }
    const event = await bookJasonIntroduction({
      start: parsed.data.start_iso,
      end: parsed.data.end_iso,
      timeZone: parsed.data.timezone,
      guestName: parsed.data.guest_name,
      guestEmail: parsed.data.guest_email.toLowerCase(),
      companyName: parsed.data.company_name,
    });
    await auditAgentAction({ conversationId: parsed.data.conversation_id, action: "calendar.book_introduction", status: "completed", requestData: auditRequest, responseData: { event_id: event.id, start: event.start, end: event.end } });
    return Response.json({ booked: true, event_id: event.id, start_iso: event.start?.dateTime, end_iso: event.end?.dateTime, meeting_url: event.hangoutLink, calendar_url: event.htmlLink });
  } catch (error) {
    console.error("agent_booking_failed", error);
    try { await auditAgentAction({ conversationId: parsed.data.conversation_id, action: "calendar.book_introduction", status: "failed", requestData: auditRequest }); } catch {}
    return Response.json({ error: "The meeting could not be scheduled. Do not claim it is booked; offer to connect the visitor with Jason by email." }, { status: 503 });
  }
}
