import { z } from "zod";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  enforceRateLimit,
  getRequestId,
  isSameOriginRequest,
  rateLimitResponse,
  readLimitedJson,
  RequestBodyTooLargeError,
  safeLog,
} from "@/lib/security";

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  companyName: z.string().trim().min(1).max(160),
  jobTitle: z.string().trim().max(120).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  website: z.union([z.literal(""), z.string().url().max(500)]).optional().default(""),
  process: z.string().trim().min(10).max(5000),
  currentProcess: z.string().trim().min(10).max(5000),
  desiredResult: z.string().trim().min(10).max(5000),
  systems: z.string().trim().min(2).max(3000),
  sensitiveData: z.enum(["yes", "no", "unsure"]),
  acceptedPolicies: z.literal("yes"),
  companyFax: z.string().max(0).optional().default(""),
});

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  if (!isSameOriginRequest(request)) {
    safeLog("warn", "intake.origin_rejected", { requestId });
    return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await readLimitedJson(request);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return Response.json({ error: error.message }, { status: 413 });
    throw error;
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Please review the form and complete every required field." }, { status: 400 });

  try {
    const rate = await enforceRateLimit({
      request,
      requestId,
      route: "intake.submit",
      limit: 5,
      windowSeconds: 3600,
      subject: parsed.data.email,
    });
    if (!rate.allowed) return rateLimitResponse(rate.retryAfter);

    const supabase = createAdminClient();
    const { error } = await supabase.from("intake_requests").insert({
      full_name: parsed.data.fullName,
      email: parsed.data.email.toLowerCase(),
      company_name: parsed.data.companyName,
      job_title: parsed.data.jobTitle || null,
      phone: parsed.data.phone || null,
      website: parsed.data.website || null,
      process_to_automate: parsed.data.process,
      current_process: parsed.data.currentProcess,
      desired_result: parsed.data.desiredResult,
      systems_involved: parsed.data.systems,
      sensitive_data: parsed.data.sensitiveData,
      policy_version: "2026-08-02",
      request_ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      user_agent: request.headers.get("user-agent"),
    });
    if (error) throw error;

    if (process.env.RESEND_API_KEY && process.env.JASON_NOTIFICATION_EMAIL) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error: emailError } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "Jason Sirotin <hello@automatemejay.com>",
          to: process.env.JASON_NOTIFICATION_EMAIL,
          replyTo: parsed.data.email,
          subject: `Guaranteed-week intake from ${parsed.data.fullName}`,
          text: `A new risk-free first-week intake was submitted.\n\nName: ${parsed.data.fullName}\nCompany: ${parsed.data.companyName}\nEmail: ${parsed.data.email}\nSensitive data: ${parsed.data.sensitiveData}\n\nProcess:\n${parsed.data.process}`,
        });

        if (emailError) safeLog("error", "intake.notification_failed", { requestId, error: emailError });
      } catch (emailError) {
        safeLog("error", "intake.notification_failed", { requestId, error: emailError });
      }
    }

    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store", "x-request-id": requestId } });
  } catch (error) {
    safeLog("error", "intake.submission_failed", { requestId, error });
    return Response.json({ error: "The intake service is not available yet." }, { status: 503 });
  }
}
