import { z } from "zod";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/env";

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
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Please review the form and complete every required field." }, { status: 400 });

  try {
    const { url, publishableKey } = getSupabasePublicConfig();
    const supabase = createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
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
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "Jason Sirotin <hello@automatemejay.com>",
        to: process.env.JASON_NOTIFICATION_EMAIL,
        replyTo: parsed.data.email,
        subject: `Guaranteed-week intake from ${parsed.data.fullName}`,
        text: `A new guaranteed-first-week intake was submitted.\n\nName: ${parsed.data.fullName}\nCompany: ${parsed.data.companyName}\nEmail: ${parsed.data.email}\nSensitive data: ${parsed.data.sensitiveData}\n\nProcess:\n${parsed.data.process}`,
      });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("intake_submission_failed", error);
    return Response.json({ error: "The intake service is not available yet." }, { status: 503 });
  }
}
