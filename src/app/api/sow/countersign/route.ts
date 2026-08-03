import { Resend } from "resend";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAccessToken, hashAccessToken, tokensMatch } from "@/lib/sow-security";
import { enforceRateLimit, getRequestFingerprint, getRequestId, isSameOriginRequest, rateLimitResponse, readLimitedJson, RequestBodyTooLargeError, safeLog } from "@/lib/security";

const schema = z.object({
  sowId: z.string().uuid(),
  token: z.string().min(32).max(200),
  jasonSignature: z.string().trim().min(2).max(120),
  electronicSignatureConsent: z.literal("yes"),
});

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  if (!isSameOriginRequest(request)) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  let body: unknown;
  try { body = await readLimitedJson(request); }
  catch (error) {
    if (error instanceof RequestBodyTooLargeError) return Response.json({ error: error.message }, { status: 413 });
    throw error;
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success || parsed.data.jasonSignature.toLowerCase() !== "jason sirotin") return Response.json({ error: "Type Jason Sirotin exactly to sign." }, { status: 400 });

  try {
    const rate = await enforceRateLimit({ request, requestId, route: "sow.countersign", limit: 10, windowSeconds: 3600, subject: parsed.data.sowId });
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter);
    const supabase = createAdminClient();
    const { data: sow, error: lookupError } = await supabase.from("service_sows").select("*").eq("id", parsed.data.sowId).maybeSingle();
    if (lookupError || !sow || sow.status !== "payment_confirmed" || !sow.jason_signing_token_hash || !sow.jason_signing_token_expires_at || new Date(sow.jason_signing_token_expires_at) < new Date() || !tokensMatch(parsed.data.token, sow.jason_signing_token_hash)) return Response.json({ error: "This private signing link is invalid, expired, or already used." }, { status: 403 });

    const clientToken = createAccessToken();
    const signedAt = new Date().toISOString();
    const { data: updated, error: updateError } = await supabase.from("service_sows").update({
      status: "fully_executed",
      jason_signature: "Jason Sirotin",
      jason_signed_at: signedAt,
      jason_request_key_hash: getRequestFingerprint(request, parsed.data.sowId),
      jason_user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      jason_signing_token_hash: null,
      jason_signing_token_expires_at: null,
      client_access_token_hash: hashAccessToken(clientToken),
    }).eq("id", parsed.data.sowId).eq("status", "payment_confirmed").select("id").maybeSingle();
    if (updateError || !updated) throw updateError ?? new Error("SOW state changed before signature.");

    if (process.env.RESEND_API_KEY) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://automatemejay.com";
      const accessUrl = `${siteUrl}/sow/${sow.id}?token=${encodeURIComponent(clientToken)}`;
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error: emailError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "Jason Sirotin <hello@automatemejay.com>",
        to: sow.client_email,
        replyTo: process.env.RESEND_REPLY_TO ?? "hello@automatemejay.com",
        subject: `Your executed ${sow.plan === "weekly" ? "Weekly" : "Monthly"} Partner SOW`,
        text: `Your Statement of Work has now been signed by both parties. View, print, or save your executed copy using this private link:\n\n${accessUrl}\n\nFor your security, do not share this link publicly.`,
      });
      if (emailError) safeLog("error", "sow.client_copy_email_failed", { requestId, error: emailError });
    }
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store", "x-request-id": requestId } });
  } catch (error) {
    safeLog("error", "sow.countersign_failed", { requestId, error });
    return Response.json({ error: "The SOW could not be counter-signed right now." }, { status: 503 });
  }
}
