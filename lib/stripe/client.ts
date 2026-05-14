// Stripe server-side client (Node runtime only).
// Never import from a Client Component — the secret key would leak.

import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Configure it in .env.local — see docs/DEPLOYMENT.md",
      );
    }
    stripeInstance = new Stripe(key, {
      // Pin API version to keep webhooks deterministic. Bump intentionally.
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
      appInfo: {
        name: "TradieMatch",
        version: "1.0.0",
        url: "https://tradiematch.com.au",
      },
    });
  }
  return stripeInstance;
}

export const STRIPE_API_VERSION = "2026-04-22.dahlia";
