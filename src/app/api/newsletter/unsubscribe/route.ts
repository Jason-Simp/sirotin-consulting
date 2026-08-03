import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashAccessToken } from "@/lib/sow-security";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (token.length < 32 || token.length > 200) return Response.redirect(new URL("/blog?unsubscribe=invalid", request.url));
  const supabase = createAdminClient();
  const { data: subscriber, error: lookupError } = await supabase.from("newsletter_subscribers")
    .select("id")
    .eq("unsubscribe_token_hash", hashAccessToken(token))
    .eq("status", "active")
    .maybeSingle();
  if (lookupError || !subscriber) return Response.redirect(new URL(lookupError ? "/blog?unsubscribe=error" : "/blog?unsubscribe=success", request.url));
  const { data: scheduled } = await supabase.from("newsletter_deliveries")
    .select("id,resend_email_id")
    .eq("subscriber_id", subscriber.id)
    .eq("status", "scheduled");
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  for (const delivery of scheduled ?? []) {
    if (!resend || !delivery.resend_email_id) continue;
    const { error: cancelError } = await resend.emails.cancel(delivery.resend_email_id);
    if (!cancelError) await supabase.from("newsletter_deliveries").update({ status: "canceled" }).eq("id", delivery.id);
  }
  const { error } = await supabase.from("newsletter_subscribers").update({
    status: "unsubscribed",
    unsubscribed_at: new Date().toISOString(),
    next_send_at: null,
    unsubscribe_token_hash: null,
  }).eq("id", subscriber.id);
  return Response.redirect(new URL(error ? "/blog?unsubscribe=error" : "/blog?unsubscribe=success", request.url));
}
