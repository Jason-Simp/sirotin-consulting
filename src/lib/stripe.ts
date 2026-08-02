import "server-only";

import Stripe from "stripe";
import { getStripeCheckoutConfig } from "@/lib/env";

export function createStripeClient() {
  const { secretKey } = getStripeCheckoutConfig();
  return new Stripe(secretKey, { appInfo: { name: "Sirotin Consulting", version: "0.1.0" } });
}
