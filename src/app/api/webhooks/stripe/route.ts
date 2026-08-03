import Stripe from "stripe";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeWebhookSecret } from "@/lib/env";
import { createStripeClient } from "@/lib/stripe";
import { getRequestId, readLimitedText, RequestBodyTooLargeError, safeLog } from "@/lib/security";
import { createAccessToken, hashAccessToken } from "@/lib/sow-security";
import { provisionClientWorkspace } from "@/lib/provision-client-workspace";

function toIsoTimestamp(timestamp: number | null | undefined) {
  return typeof timestamp === "number" ? new Date(timestamp * 1000).toISOString() : null;
}

function getSubscriptionPeriod(subscription: Stripe.Subscription | null) {
  if (!subscription) return { currentPeriodStart: null, currentPeriodEnd: null };
  const items = subscription.items.data;
  const starts = items.map((item) => item.current_period_start).filter(Number.isFinite);
  const ends = items.map((item) => item.current_period_end).filter(Number.isFinite);

  // Stripe's current API stores periods on subscription items. If a future
  // subscription has mixed billing periods, use the latest start and earliest
  // end so access is never represented as extending beyond a paid item.
  return {
    currentPeriodStart: starts.length ? toIsoTimestamp(Math.max(...starts)) : null,
    currentPeriodEnd: ends.length ? toIsoTimestamp(Math.min(...ends)) : null,
  };
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing Stripe signature." }, { status: 400 });

  try {
    const payload = await readLimitedText(request, 1_048_576);
    const stripe = createStripeClient();
    const event = stripe.webhooks.constructEvent(payload, signature, getStripeWebhookSecret());

    if (process.env.SUPABASE_SECRET_KEY) {
      const supabase = createAdminClient();
      const { error } = await supabase.from("stripe_events").insert({ id: event.id, event_type: event.type, payload: event });
      if (error?.code === "23505") return Response.json({ received: true, duplicate: true });
      if (error) throw error;

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email ?? session.customer_email;
        const stripeSubscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
        const stripeSubscription = stripeSubscriptionId ? await stripe.subscriptions.retrieve(stripeSubscriptionId) : null;
        const { currentPeriodStart, currentPeriodEnd } = getSubscriptionPeriod(stripeSubscription);
        const sowId = session.metadata?.sow_id;
        if (sowId && (session.metadata?.plan === "weekly" || session.metadata?.plan === "monthly") && session.payment_status === "paid") {
          const { data: sow, error: sowLookupError } = await supabase.from("service_sows").select("*").eq("id", sowId).maybeSingle();
          if (sowLookupError || !sow) throw sowLookupError ?? new Error("Checkout references an unknown SOW.");
          if (sow.sow_version !== session.metadata.sow_version || sow.document_hash !== session.metadata.sow_hash || sow.plan !== session.metadata.plan) throw new Error("Checkout SOW metadata does not match the signed record.");

          const signingToken = createAccessToken();
          const signingExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          const { data: updatedSow, error: sowUpdateError } = await supabase.from("service_sows").update({
            status: "payment_confirmed",
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
            stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : session.subscription?.id,
            payment_confirmed_at: new Date().toISOString(),
            jason_signing_token_hash: hashAccessToken(signingToken),
            jason_signing_token_expires_at: signingExpiresAt,
          }).eq("id", sowId).eq("status", "client_signed_checkout_pending").select("id").maybeSingle();
          if (sowUpdateError) throw sowUpdateError;

          if (updatedSow && process.env.RESEND_API_KEY) {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://automatemejay.com";
            const signingUrl = `${siteUrl}/sow/${sowId}/countersign?token=${encodeURIComponent(signingToken)}`;
            const resend = new Resend(process.env.RESEND_API_KEY);
            try {
              const { data: signingEmail, error: signingEmailError } = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL ?? "Jason Sirotin <hello@automatemejay.com>",
                to: process.env.JASON_NOTIFICATION_EMAIL ?? "jason@simplsolutions.app",
                replyTo: process.env.RESEND_REPLY_TO ?? "hello@automatemejay.com",
                subject: `Counter-sign ${sow.plan === "weekly" ? "Weekly" : "Monthly"} Partner SOW — ${sow.company_name}`,
                text: `${sow.client_name} signed the ${sow.plan} SOW for ${sow.company_name}, and Stripe confirmed payment. Review and counter-sign the exact document here:\n\n${signingUrl}\n\nThis private signing link expires in 30 days.`,
              });
              if (signingEmailError) throw signingEmailError;
              const { error: deliveryUpdateError } = await supabase.from("service_sows").update({
                jason_signing_email_id: signingEmail?.id ?? null,
                jason_signing_email_sent_at: new Date().toISOString(),
              }).eq("id", sowId);
              if (deliveryUpdateError) throw deliveryUpdateError;
            } catch (emailError) {
              safeLog("error", "sow.jason_signing_email_failed", { requestId, error: emailError });
            }
          }
        }
        if (session.metadata?.plan === "first-week" && session.payment_status === "paid") {
          if (!customerEmail) throw new Error("Guaranteed-week checkout has no customer email.");
          const { error: engagementError } = await supabase.from("guaranteed_engagements").upsert({
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
            customer_email: customerEmail.toLowerCase(),
            customer_name: session.metadata?.client_name ?? session.customer_details?.name,
            company_name: session.metadata?.company_name,
            status: "paid_pending_activation",
          }, { onConflict: "stripe_checkout_session_id", ignoreDuplicates: true });
          if (engagementError) throw engagementError;

          const { data: intake } = await supabase.from("intake_requests")
            .select("full_name,company_name,process_to_automate,desired_result,systems_involved")
            .eq("email", customerEmail.toLowerCase())
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          await provisionClientWorkspace({
            supabase,
            email: customerEmail,
            fullName: intake?.full_name ?? session.metadata?.client_name ?? session.customer_details?.name,
            companyName: intake?.company_name ?? session.metadata?.company_name,
            problem: intake?.process_to_automate,
            desiredOutcome: intake?.desired_result,
            systemsInvolved: intake?.systems_involved,
          });

          if (process.env.RESEND_API_KEY) {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://automatemejay.com";
            const decisionUrl = `${siteUrl}/guarantee?session_id=${encodeURIComponent(session.id)}`;
            const resend = new Resend(process.env.RESEND_API_KEY);
            try {
              const { error: confirmationEmailError } = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL ?? "Jason Sirotin <hello@automatemejay.com>",
                to: customerEmail,
                replyTo: process.env.RESEND_REPLY_TO ?? "hello@automatemejay.com",
                subject: "Your guaranteed first week with Jason",
                text: `Your $350 payment is confirmed. Jason will review your intake and confirm when the seven-day working period is activated.\n\nThe first week does not renew automatically. Save this private link so you can continue monthly or request your full $350 service-fee refund before the guarantee period ends:\n${decisionUrl}\n\nApproved third-party expenses are separate from the service-fee guarantee.`,
              });
              if (confirmationEmailError) throw confirmationEmailError;
            } catch (emailError) {
              safeLog("error", "stripe.guaranteed_week_email_failed", { requestId, error: emailError });
            }
          }
        }
        const organizationId = session.metadata?.organization_id;
        if (organizationId) {
          const plan = session.metadata?.plan;
          await supabase.from("subscriptions").update({
            stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id,
            stripe_subscription_id: stripeSubscriptionId,
            plan: plan === "weekly" ? "weekly" : "monthly",
            status: plan === "weekly" ? "weekly_active" : plan === "monthly" ? "monthly_active" : "payment_required",
            started_at: new Date().toISOString(),
            current_period_start: currentPeriodStart,
            current_period_end: currentPeriodEnd,
          }).eq("organization_id", organizationId);
          if (customerEmail && (plan === "weekly" || plan === "monthly")) await provisionClientWorkspace({
            supabase,
            email: customerEmail,
            fullName: session.metadata?.client_name ?? session.customer_details?.name,
            companyName: session.metadata?.company_name,
            organizationId,
          });
        } else if ((session.metadata?.plan === "weekly" || session.metadata?.plan === "monthly") && session.subscription) {
          const plan = session.metadata.plan;
          const stripeSubscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
          const stripeCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
          const { data: existingSubscription, error: lookupError } = await supabase
            .from("subscriptions")
            .select("organization_id")
            .eq("stripe_subscription_id", stripeSubscriptionId)
            .maybeSingle();
          if (lookupError) throw lookupError;

          let membershipOrganizationId = existingSubscription?.organization_id;
          if (!existingSubscription) {
            const { data: organization, error: organizationError } = await supabase
              .from("organizations")
              .insert({ name: session.metadata?.company_name ?? customerEmail ?? `New ${plan} client` })
              .select("id")
              .single();
            if (organizationError) throw organizationError;
            membershipOrganizationId = organization.id;

            const { error: subscriptionError } = await supabase.from("subscriptions").insert({
              organization_id: organization.id,
              plan,
              stripe_customer_id: stripeCustomerId,
              stripe_subscription_id: stripeSubscriptionId,
              status: plan === "weekly" ? "weekly_active" : "monthly_active",
              started_at: new Date().toISOString(),
              current_period_start: currentPeriodStart,
              current_period_end: currentPeriodEnd,
            });
            if (subscriptionError) {
              await supabase.from("organizations").delete().eq("id", organization.id);
              throw subscriptionError;
            }
          }
          if (customerEmail && membershipOrganizationId) await provisionClientWorkspace({
            supabase,
            email: customerEmail,
            fullName: session.metadata?.client_name ?? session.customer_details?.name,
            companyName: session.metadata?.company_name,
            organizationId: membershipOrganizationId,
          });
        }
      }

      if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;
        const plan = subscription.metadata.plan === "weekly" ? "weekly" : "monthly";
        const deleted = event.type === "customer.subscription.deleted";
        const canceling = !deleted && (subscription.cancel_at_period_end || typeof subscription.cancel_at === "number");
        const { currentPeriodStart, currentPeriodEnd } = getSubscriptionPeriod(subscription);
        const cancellationEffectiveAt = toIsoTimestamp(subscription.cancel_at) ?? (canceling ? currentPeriodEnd : null);
        const { error: subscriptionUpdateError } = await supabase.from("subscriptions").update({
          plan,
          status: deleted ? "canceled" : canceling ? "cancellation_notice" : plan === "weekly" ? "weekly_active" : "monthly_active",
          current_period_start: currentPeriodStart,
          current_period_end: currentPeriodEnd,
          cancellation_requested_at: deleted || canceling ? toIsoTimestamp(event.created) : null,
          cancellation_effective_at: deleted ? new Date().toISOString() : cancellationEffectiveAt,
        }).eq("stripe_subscription_id", subscription.id);
        if (subscriptionUpdateError) throw subscriptionUpdateError;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    const status = error instanceof RequestBodyTooLargeError ? 413 : 400;
    safeLog("warn", "stripe.webhook_rejected", { requestId, error });
    return Response.json({ error: error instanceof RequestBodyTooLargeError ? error.message : "Invalid or unprocessable webhook." }, { status });
  }
}
