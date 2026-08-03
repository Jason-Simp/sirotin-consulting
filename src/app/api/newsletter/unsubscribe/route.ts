import { createAdminClient } from "@/lib/supabase/admin";
import { publicEnv } from "@/lib/env";
import { cancelScheduledNewsletterDeliveries } from "@/lib/newsletter-cancellation";
import { getRequestId, safeLog } from "@/lib/security";
import { hashAccessToken } from "@/lib/sow-security";

function newsletterRedirect(result: "success" | "invalid" | "error") {
  const siteUrl = publicEnv.siteUrl ?? "https://automatemejay.com";
  return Response.redirect(new URL(`/blog?unsubscribe=${result}`, siteUrl));
}

export async function GET(request: Request) {
  const requestId = getRequestId(request);
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (token.length < 32 || token.length > 200) return newsletterRedirect("invalid");
  const supabase = createAdminClient();
  const { data: subscriber, error: lookupError } = await supabase.from("newsletter_subscribers")
    .select("id,status")
    .eq("unsubscribe_token_hash", hashAccessToken(token))
    .in("status", ["active", "unsubscribed"])
    .maybeSingle();
  if (lookupError) {
    safeLog("error", "newsletter.unsubscribe_lookup_failed", { requestId, error: lookupError });
    return newsletterRedirect("error");
  }
  if (!subscriber) return newsletterRedirect("success");

  const { error: unsubscribeError } = await supabase.from("newsletter_subscribers").update({
    status: "unsubscribed",
    unsubscribed_at: new Date().toISOString(),
    next_send_at: null,
  }).eq("id", subscriber.id);
  if (unsubscribeError) {
    safeLog("error", "newsletter.unsubscribe_record_failed", { requestId, error: unsubscribeError });
    return newsletterRedirect("error");
  }

  const allCanceled = await cancelScheduledNewsletterDeliveries({ subscriberId: subscriber.id, requestId });
  if (!allCanceled) return newsletterRedirect("error");

  const { error: tokenError } = await supabase.from("newsletter_subscribers")
    .update({ unsubscribe_token_hash: null })
    .eq("id", subscriber.id);
  if (tokenError) {
    safeLog("error", "newsletter.unsubscribe_token_clear_failed", { requestId, error: tokenError });
    return newsletterRedirect("error");
  }
  return newsletterRedirect("success");
}
