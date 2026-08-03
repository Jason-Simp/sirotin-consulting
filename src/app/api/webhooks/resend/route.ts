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
    const eventData = event.data as { email_id?: string };
    const deliveryStatus = ({
      "email.sent": "sent",
      "email.delivered": "delivered",
      "email.bounced": "bounced",
      "email.complained": "complained",
      "email.failed": "failed",
    } as Record<string, string>)[event.type];
    if (eventData.email_id && deliveryStatus) {
      const { data: delivery } = await supabase.from("newsletter_deliveries")
        .update({ status: deliveryStatus })
        .eq("resend_email_id", eventData.email_id)
        .select("subscriber_id,campaign_step")
        .maybeSingle();
      if (delivery && (deliveryStatus === "sent" || deliveryStatus === "delivered")) {
        const { data: subscriber } = await supabase.from("newsletter_subscribers").select("current_step").eq("id", delivery.subscriber_id).maybeSingle();
        if ((subscriber?.current_step ?? 0) < delivery.campaign_step) await supabase.from("newsletter_subscribers").update({
          current_step: delivery.campaign_step,
          last_sent_at: new Date().toISOString(),
        }).eq("id", delivery.subscriber_id).eq("status", "active");
      }
      if (delivery && (deliveryStatus === "bounced" || deliveryStatus === "complained")) {
        await supabase.from("newsletter_subscribers").update({ status: deliveryStatus }).eq("id", delivery.subscriber_id);
        const { data: pending } = await supabase.from("newsletter_deliveries").select("id,resend_email_id").eq("subscriber_id", delivery.subscriber_id).eq("status", "scheduled");
        for (const item of pending ?? []) {
          if (!item.resend_email_id) continue;
          const { error: cancelError } = await resend.emails.cancel(item.resend_email_id);
          if (!cancelError) await supabase.from("newsletter_deliveries").update({ status: "canceled" }).eq("id", item.id);
        }
      }
    }
    return Response.json({ ok: true, processed: 1 });
  } catch (error) {
    safeLog("warn", "resend.webhook_rejected", { requestId, error });
    return Response.json({ error: "Invalid or unprocessable webhook." }, { status: 400 });
  }
}
