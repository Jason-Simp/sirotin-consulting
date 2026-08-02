import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRequestId, readLimitedText, RequestBodyTooLargeError, safeLog } from "@/lib/security";

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) return Response.json({ error: "Webhook is not configured." }, { status: 503 });

  let payload: string;
  try {
    payload = await readLimitedText(request, 1_048_576);
  } catch (error) {
    safeLog("warn", "resend.webhook_body_rejected", { requestId, error });
    return Response.json({ error: error instanceof RequestBodyTooLargeError ? error.message : "Invalid webhook body." }, { status: error instanceof RequestBodyTooLargeError ? 413 : 400 });
  }
  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");
  if (!id || !timestamp || !signature) return Response.json({ error: "Missing signature headers." }, { status: 400 });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const event = resend.webhooks.verify({ payload, webhookSecret, headers: { id, timestamp, signature } });
    const supabase = createAdminClient();
    const { error } = await supabase.from("resend_events").insert({ id, event_type: event.type, payload: event });
    if (error?.code === "23505") return Response.json({ ok: true, duplicate: true });
    if (error) throw error;
    return Response.json({ ok: true, processed: 1 });
  } catch (error) {
    safeLog("warn", "resend.webhook_rejected", { requestId, error });
    return Response.json({ error: "Invalid or unprocessable webhook." }, { status: 400 });
  }
}
