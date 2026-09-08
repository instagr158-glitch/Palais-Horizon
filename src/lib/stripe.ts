import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

// Checkout is enabled as soon as the secret key + the monthly price exist.
// The annual price is optional — set STRIPE_PRICE_ANNUAL later to show that plan.
export const stripeConfigured = !!key && !!process.env.STRIPE_PRICE_MONTHLY;

// Let the SDK use its pinned API version — avoids a brittle literal-type mismatch.
export const stripe = key ? new Stripe(key) : null;

export const PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_MONTHLY ?? "",
  annual: process.env.STRIPE_PRICE_ANNUAL ?? "",
} as const;

export function priceIdForPlan(plan: string | null | undefined): string | null {
  if (plan === "monthly") return PRICE_IDS.monthly || null;
  if (plan === "annual") return PRICE_IDS.annual || null;
  return null;
}

export function planForPriceId(priceId: string | null | undefined): "monthly" | "annual" | null {
  if (!priceId) return null;
  if (priceId === PRICE_IDS.monthly) return "monthly";
  if (priceId === PRICE_IDS.annual) return "annual";
  return null;
}
