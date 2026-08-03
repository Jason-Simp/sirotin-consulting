import "server-only";

import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { createAccessToken, hashAccessToken } from "@/lib/sow-security";

export const NEWSLETTER_CONSENT_VERSION = "2026-08-03";

const lessons = [
  {
    subject: "AI automation basics: start with the work, not the tool",
    heading: "Lesson 1: Find the repeatable decision",
    body: "Write down one task that happens at least weekly. Record what starts it, the information required, the decision a person makes, the systems touched, and what a correct finish looks like. That map is more valuable than choosing an AI product first.",
    action: "Use this five-line process map: trigger → inputs → decision → action → evidence.",
    link: "/blog/how-to-automate-repetitive-business-tasks-with-ai",
  },
  {
    subject: "AI automation basics: choose a safe first workflow",
    heading: "Lesson 2: Score value and risk separately",
    body: "A good first automation is frequent, understandable, easy to review, and reversible. High-value work is not automatically a good first project when mistakes are expensive or difficult to undo.",
    action: "Score frequency, time saved, input consistency, reviewability, reversibility, and consequence from 1–5. Start with high value and low consequence.",
    link: "/blog/best-business-processes-to-automate-with-ai",
  },
  {
    subject: "AI automation basics: design the human checkpoint",
    heading: "Lesson 3: Decide where a person stays in control",
    body: "Separate drafting from acting. AI can extract, summarize, classify, or prepare a change. A person should approve consequential messages, money movement, access changes, employment decisions, and production releases until the workflow has earned more authority.",
    action: "Label every step: automatic, human review, or human-only. Add an owner and a recovery path to every automatic step.",
    link: "/blog/ai-agents-vs-chatbots-for-business",
  },
  {
    subject: "AI automation basics: test the exceptions",
    heading: "Lesson 4: Test what happens when reality is messy",
    body: "The normal path is rarely the hard part. Test missing fields, duplicate requests, stale records, conflicting instructions, provider outages, low-confidence output, and permission failures before production use.",
    action: "Create a ten-case test sheet with expected result, actual result, reviewer, and next change. Keep the workflow in draft mode until the failure paths are understandable.",
    link: "/blog/ai-automation-mistakes-small-business",
  },
  {
    subject: "Ready to turn one process into a working automation?",
    heading: "Lesson 5: Build the smallest useful end-to-end version",
    body: "You now have the foundation: a process map, a responsible first target, human checkpoints, and an exception test. The next step is a small working iteration using representative data—not a giant transformation project.",
    action: "If you want help, Jason offers a protected $350 first week and a $1,000 monthly partner option. The first conversation is free, and nothing starts until the scope is clear.",
    link: "/book",
  },
] as const;

export function getNewsletterLesson(step: number) {
  return lessons[step - 1];
}

export async function sendNewsletterLesson(input: {
  subscriberId: string;
  email: string;
  fullName?: string | null;
  step: number;
  unsubscribeToken?: string;
  scheduledFor?: string;
}) {
  const lesson = getNewsletterLesson(input.step);
  if (!lesson) throw new Error("Unknown newsletter lesson.");
  if (!process.env.RESEND_API_KEY) throw new Error("Resend is not configured.");

  const token = input.unsubscribeToken ?? createAccessToken();
  const tokenHash = hashAccessToken(token);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://automatemejay.com";
  const articleUrl = `${siteUrl}${lesson.link}`;
  const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
  const greeting = input.fullName?.trim().split(/\s+/)[0] ? `Hi ${input.fullName.trim().split(/\s+/)[0]},` : "Hi,";
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Jason Sirotin <hello@automatemejay.com>",
    to: input.email,
    replyTo: process.env.RESEND_REPLY_TO ?? "hello@automatemejay.com",
    subject: lesson.subject,
    text: `${greeting}\n\n${lesson.heading}\n\n${lesson.body}\n\nTRY THIS TODAY\n${lesson.action}\n\nRead the practical guide:\n${articleUrl}\n\n—Jason\n\nYou requested AI Automation Basics from AutomateMeJay. Unsubscribe: ${unsubscribeUrl}`,
    ...(input.scheduledFor ? { scheduledAt: input.scheduledFor } : {}),
  });
  if (error) throw error;

  const sentAt = new Date();
  const supabase = createAdminClient();
  const subscriberUpdate = input.scheduledFor ? { unsubscribe_token_hash: tokenHash } : {
    current_step: input.step,
    last_sent_at: sentAt.toISOString(),
    next_send_at: null,
    unsubscribe_token_hash: tokenHash,
  };
  const { error: updateError } = await supabase.from("newsletter_subscribers").update(subscriberUpdate).eq("id", input.subscriberId).eq("status", "active");
  if (updateError) throw updateError;

  const { error: deliveryError } = await supabase.from("newsletter_deliveries").upsert({
    subscriber_id: input.subscriberId,
    campaign_step: input.step,
    resend_email_id: data?.id ?? null,
    subject: lesson.subject,
    status: input.scheduledFor ? "scheduled" : "accepted",
    error_code: null,
    sent_at: sentAt.toISOString(),
    scheduled_for: input.scheduledFor ?? null,
  }, { onConflict: "subscriber_id,campaign_step" });
  if (deliveryError) throw deliveryError;
}

export async function scheduleNewsletterSeries(input: { subscriberId: string; email: string; fullName?: string | null }) {
  const token = createAccessToken();
  const startedAt = Date.now();
  for (let step = 1; step <= lessons.length; step += 1) {
    const scheduledFor = step === 1 ? undefined : new Date(startedAt + (step - 1) * 24 * 60 * 60 * 1000).toISOString();
    await sendNewsletterLesson({ ...input, step, unsubscribeToken: token, scheduledFor });
  }
}
