import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) return Response.json({ error: "Webhook is not configured." }, { status: 503 });

  const payload = await request.text();
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
    console.error("resend_webhook_failed", error);
    return Response.json({ error: "Invalid or unprocessable webhook." }, { status: 400 });
  }
}
