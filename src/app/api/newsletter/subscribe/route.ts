import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { NEWSLETTER_CONSENT_VERSION, scheduleNewsletterSeries } from "@/lib/newsletter";
import { enforceRateLimit, getRequestId, isSameOriginRequest, rateLimitResponse, readLimitedJson, RequestBodyTooLargeError, safeLog } from "@/lib/security";

const schema = z.object({
  fullName: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(254),
  consent: z.literal("yes"),
  companyFax: z.string().max(0).optional().default(""),
});

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  if (!isSameOriginRequest(request)) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  let body: unknown;
  try { body = await readLimitedJson(request, 16_384); }
  catch (error) {
    if (error instanceof RequestBodyTooLargeError) return Response.json({ error: error.message }, { status: 413 });
    throw error;
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Enter a valid email and confirm your subscription." }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  try {
    const rate = await enforceRateLimit({ request, requestId, route: "newsletter.subscribe", limit: 5, windowSeconds: 3600, subject: email });
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
    const supabase = createAdminClient();
    const { data: existing, error: lookupError } = await supabase.from("newsletter_subscribers").select("id,status,current_step").eq("email", email).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing?.status === "active" && existing.current_step > 0) return Response.json({ ok: true, alreadySubscribed: true });

    const { data: subscriber, error: upsertError } = await supabase.from("newsletter_subscribers").upsert({
      email,
      full_name: parsed.data.fullName || null,
      status: "active",
      source: "news_page",
      consent_version: NEWSLETTER_CONSENT_VERSION,
      current_step: 0,
      next_send_at: new Date().toISOString(),
      unsubscribed_at: null,
    }, { onConflict: "email" }).select("id,email,full_name").single();
    if (upsertError) throw upsertError;
    await scheduleNewsletterSeries({ subscriberId: subscriber.id, email: subscriber.email, fullName: subscriber.full_name });
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store", "x-request-id": requestId } });
  } catch (error) {
    safeLog("error", "newsletter.subscribe_failed", { requestId, error });
    return Response.json({ error: "The email series is temporarily unavailable." }, { status: 503 });
  }
}
