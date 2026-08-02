import { z } from "zod";

const optionalUrl = z.string().url().optional();

export const publicEnv = {
  siteUrl: optionalUrl.parse(process.env.NEXT_PUBLIC_SITE_URL || "https://automatemejay.com"),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
};

export function hasSupabaseConfig() {
  return Boolean(publicEnv.supabaseUrl && publicEnv.supabasePublishableKey);
}

export function getSupabasePublicConfig() {
  if (!publicEnv.supabaseUrl || !publicEnv.supabasePublishableKey) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }
  return { url: publicEnv.supabaseUrl, publishableKey: publicEnv.supabasePublishableKey };
}

export function getSupabaseAdminConfig() {
  const publicConfig = getSupabasePublicConfig();
  const secretKey = z.string().min(1).parse(process.env.SUPABASE_SECRET_KEY);
  return { ...publicConfig, secretKey };
}

export function getStripeCheckoutConfig() {
  const parsed = z.object({
    secretKey: z.string().min(1),
    guaranteedFirstWeekPriceId: z.string().startsWith("price_"),
    monthlyPriceId: z.string().startsWith("price_"),
  }).safeParse({
    secretKey: process.env.STRIPE_SECRET_KEY,
    guaranteedFirstWeekPriceId: process.env.STRIPE_GUARANTEED_WEEK_PRICE_ID,
    monthlyPriceId: process.env.STRIPE_MONTHLY_PRICE_ID,
  });

  if (!parsed.success) throw new Error("Stripe is not fully configured.");
  return parsed.data;
}

export function getGoogleCalendarConfig() {
  const parsed = z.object({
    clientId: z.string().min(1),
    clientSecret: z.string().min(1),
    simplSolutionsRefreshToken: z.string().min(1),
    ecgRefreshToken: z.string().min(1),
    simplSolutionsCalendarId: z.string().min(1),
    ecgCalendarId: z.string().min(1),
    bookingCalendarId: z.string().min(1),
    toolSecret: z.string().min(24),
  }).safeParse({
    clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    simplSolutionsRefreshToken: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN_SIMPLSOLUTIONS,
    ecgRefreshToken: process.env.GOOGLE_CALENDAR_REFRESH_TOKEN_ECG,
    simplSolutionsCalendarId: process.env.GOOGLE_CALENDAR_ID_SIMPLSOLUTIONS ?? "jason@simplsolutions.app",
    ecgCalendarId: process.env.GOOGLE_CALENDAR_ID_ECG ?? "sirotin@ecgprod.com",
    bookingCalendarId: process.env.GOOGLE_CALENDAR_BOOKING_ID ?? "jason@simplsolutions.app",
    toolSecret: process.env.AGENT_TOOL_SECRET,
  });

  if (!parsed.success) throw new Error("Google Calendar actions are not fully configured.");
  return parsed.data;
}

export function hasGoogleCalendarConfig() {
  try {
    getGoogleCalendarConfig();
    return true;
  } catch {
    return false;
  }
}

export function getStripeWebhookSecret() {
  return z.string().startsWith("whsec_").parse(process.env.STRIPE_WEBHOOK_SECRET);
}

export function getResendConfig() {
  const parsed = z.object({
    apiKey: z.string().min(1),
    webhookSecret: z.string().min(1),
    from: z.string().min(1),
    replyTo: z.string().email(),
    notify: z.string().email(),
  }).safeParse({
    apiKey: process.env.RESEND_API_KEY,
    webhookSecret: process.env.RESEND_WEBHOOK_SECRET,
    from: process.env.RESEND_FROM_EMAIL,
    replyTo: process.env.RESEND_REPLY_TO,
    notify: process.env.JASON_NOTIFICATION_EMAIL,
  });

  if (!parsed.success) throw new Error("Resend is not fully configured.");
  return parsed.data;
}
