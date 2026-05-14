// Subscription tier definitions — single source of truth.
// Stripe Price IDs come from env vars (created once in the Stripe dashboard).

export type Tier = "basic" | "pro" | "elite";

export interface TierConfig {
  id: Tier;
  name: string;
  priceMonthlyAUD: number;
  matchesQuota: number;
  /** Stripe Price ID, populated from env at runtime */
  stripePriceEnv: "STRIPE_PRICE_BASIC" | "STRIPE_PRICE_PRO" | "STRIPE_PRICE_ELITE";
  highlights: string[];
}

export const TIERS: Record<Tier, TierConfig> = {
  basic: {
    id: "basic",
    name: "Basic",
    priceMonthlyAUD: 49,
    matchesQuota: 5,
    stripePriceEnv: "STRIPE_PRICE_BASIC",
    highlights: [
      "5 matches per month",
      "Basic profile",
      "Standard support (48h)",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthlyAUD: 89,
    matchesQuota: 25,
    stripePriceEnv: "STRIPE_PRICE_PRO",
    highlights: [
      "25 matches per month",
      "Verified pro badge",
      "Priority placement",
      "Job analytics",
      "Quote &amp; invoice tools",
    ],
  },
  elite: {
    id: "elite",
    name: "Elite",
    priceMonthlyAUD: 149,
    matchesQuota: 999, // effectively unlimited
    stripePriceEnv: "STRIPE_PRICE_ELITE",
    highlights: [
      "Unlimited matches",
      "Top placement",
      "Lead exclusivity (60 min)",
      "Dedicated success manager",
      "Priority support (4h)",
    ],
  },
};

export function tierFromPriceId(priceId: string | null | undefined): Tier | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_BASIC) return "basic";
  if (priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  if (priceId === process.env.STRIPE_PRICE_ELITE) return "elite";
  return null;
}

export function quotaForTier(tier: Tier): number {
  return TIERS[tier].matchesQuota;
}

export function stripePriceIdForTier(tier: Tier): string | null {
  return process.env[TIERS[tier].stripePriceEnv] ?? null;
}
