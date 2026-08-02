"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createStripeClient } from "@/lib/stripe";

async function getPortalConfiguration() {
  const stripe = createStripeClient();
  const configurations = await stripe.billingPortal.configurations.list({ active: true, limit: 100 });
  const existing = configurations.data.find((configuration) => configuration.name === "Sirotin Consulting Membership");
  if (existing) return existing.id;

  const configuration = await stripe.billingPortal.configurations.create({
    name: "Sirotin Consulting Membership",
    business_profile: {
      headline: "Manage your Jason Sirotin AI Automation Partner membership.",
      privacy_policy_url: "https://automatemejay.com/legal/privacy",
      terms_of_service_url: "https://automatemejay.com/legal/terms",
    },
    features: {
      customer_update: { enabled: true, allowed_updates: ["email"] },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
        proration_behavior: "none",
        cancellation_reason: {
          enabled: true,
          options: ["too_expensive", "missing_features", "switched_service", "unused", "other"],
        },
      },
    },
  });
  return configuration.id;
}

export async function openBillingPortal() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;
  if (!userId) redirect("/sign-in");

  const { data: membership } = await supabase
    .from("organization_members")
    .select("organization_id, can_view_billing, member_role")
    .eq("user_id", userId)
    .eq("active", true)
    .in("member_role", ["primary_contact", "billing_contact"])
    .limit(1)
    .maybeSingle();

  if (!membership || (!membership.can_view_billing && membership.member_role !== "primary_contact")) {
    redirect("/portal?billing=unavailable");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("organization_id", membership.organization_id)
    .not("stripe_customer_id", "is", null)
    .limit(1)
    .maybeSingle();
  if (!subscription?.stripe_customer_id) redirect("/portal?billing=unavailable");

  const stripe = createStripeClient();
  const configuration = await getPortalConfiguration();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://automatemejay.com";
  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    configuration,
    return_url: `${siteUrl}/portal`,
  });
  redirect(session.url);
}
