import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe, stripeConfigured, priceIdForPlan } from "@/lib/stripe";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export type CheckoutSessionResult =
  | { url: string }
  | { error: string; status: number };

/**
 * Builds a Stripe Checkout Session for a plan. Signed-in visitors reuse
 * their account; everyone else checks out as a guest. When `customerEmail`
 * is given (the email-link flow, for visitors we can't send straight to
 * Stripe from inside an in-app browser), it pre-fills Stripe's own email
 * field so the webhook can still match the resulting account by email.
 */
export async function buildCheckoutSession(
  plan: string | undefined,
  opts?: { customerEmail?: string },
): Promise<CheckoutSessionResult> {
  if (!stripe || !stripeConfigured) {
    return { error: "Payment is not configured on this site yet.", status: 503 };
  }

  const priceId = priceIdForPlan(plan);
  if (!priceId) {
    return { error: "Unknown plan.", status: 400 };
  }

  const session = await auth();

  try {
    let customerId: string | null = null;
    let clientReferenceId: string | undefined;

    if (session?.user?.id) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user) {
        return { error: "Account not found.", status: 404 };
      }
      clientReferenceId = user.id;

      // Reuse the stored customer only if it still exists on this Stripe
      // account/mode (a leftover test-mode id would break a live checkout).
      if (user.stripeCustomerId) {
        try {
          const existing = await stripe.customers.retrieve(user.stripeCustomerId);
          if (!("deleted" in existing && existing.deleted)) customerId = existing.id;
        } catch {
          customerId = null;
        }
      }
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name ?? undefined,
          metadata: { userId: user.id },
        });
        customerId = customer.id;
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        });
      }
    }

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      ...(customerId ? { customer: customerId } : {}),
      ...(!customerId && opts?.customerEmail
        ? { customer_email: opts.customerEmail }
        : {}),
      ...(clientReferenceId ? { client_reference_id: clientReferenceId } : {}),
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { userId: clientReferenceId ?? "", plan: plan ?? "" },
      },
      success_url: `${APP_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/pricing?canceled=1`,
    });

    if (!checkout.url) {
      return { error: "Could not start checkout. Please try again.", status: 500 };
    }
    return { url: checkout.url };
  } catch (err) {
    console.error("Checkout error:", err);
    return { error: "Could not start checkout. Please try again.", status: 500 };
  }
}
