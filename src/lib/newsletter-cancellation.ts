import "server-only";

import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { safeLog } from "@/lib/security";

type ScheduledDelivery = {
  id: string;
  resend_email_id: string | null;
};

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function cancelScheduledNewsletterDeliveries(input: {
  subscriberId: string;
  requestId: string;
}) {
  const supabase = createAdminClient();
  const { data, error: lookupError } = await supabase.from("newsletter_deliveries")
    .select("id,resend_email_id")
    .eq("subscriber_id", input.subscriberId)
    .eq("status", "scheduled");
  if (lookupError) {
    safeLog("error", "newsletter.cancel_lookup_failed", { requestId: input.requestId, error: lookupError });
    return false;
  }

  const deliveries = (data ?? []) as ScheduledDelivery[];
  if (deliveries.length === 0) return true;
  if (!process.env.RESEND_API_KEY) {
    safeLog("error", "newsletter.cancel_not_configured", {
      requestId: input.requestId,
      detail: { subscriberId: input.subscriberId, deliveryCount: deliveries.length },
    });
    return false;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  let allCanceled = true;

  for (const delivery of deliveries) {
    if (!delivery.resend_email_id) {
      allCanceled = false;
      safeLog("error", "newsletter.cancel_missing_provider_id", {
        requestId: input.requestId,
        detail: { deliveryId: delivery.id },
      });
      continue;
    }

    let canceled = false;
    let lastError: unknown;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const result = await resend.emails.cancel(delivery.resend_email_id);
        if (!result.error) {
          canceled = true;
          break;
        }
        lastError = result.error;
      } catch (error) {
        lastError = error;
      }
      if (attempt < 3) await wait(attempt * 150);
    }

    if (!canceled) {
      allCanceled = false;
      safeLog("error", "newsletter.cancel_provider_failed", {
        requestId: input.requestId,
        error: lastError,
        detail: { deliveryId: delivery.id },
      });
      continue;
    }

    const { error: updateError } = await supabase.from("newsletter_deliveries")
      .update({ status: "canceled", error_code: null })
      .eq("id", delivery.id)
      .eq("status", "scheduled");
    if (updateError) {
      allCanceled = false;
      safeLog("error", "newsletter.cancel_record_failed", {
        requestId: input.requestId,
        error: updateError,
        detail: { deliveryId: delivery.id },
      });
    }
  }

  return allCanceled;
}
