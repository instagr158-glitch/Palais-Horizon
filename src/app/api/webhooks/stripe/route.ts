import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import type Stripe from "stripe";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { planForPriceId } from "@/lib/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const userId = await resolveUserIdForCheckout(s);
        if (s.subscription && typeof s.subscription === "string") {
          const sub = await stripe.subscriptions.retrieve(s.subscription);
          await syncSubscription(sub, userId, s.customer as string);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const metaUserId = (sub.metadata?.userId as string | undefined) || null;
        await syncSubscription(sub, metaUserId, sub.customer as string);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/**
 * Who is this checkout for?
 * - Signed-in checkout: `client_reference_id` is the user id — use it.
 * - Guest checkout: no user yet. Look up by the email Stripe collected; create
 *   a fresh account (random, unusable password — claimed on /subscribe/success)
 *   if none exists yet. An existing account is left untouched.
 */
async function resolveUserIdForCheckout(s: Stripe.Checkout.Session): Promise<string | null> {
  if (s.client_reference_id) return s.client_reference_id;

  const email = s.customer_details?.email?.toLowerCase().trim();
  if (!email) return null;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing.id;

  const randomPassword = randomBytes(24).toString("hex");
  const passwordHash = await bcrypt.hash(randomPassword, 10);
  const created = await prisma.user.create({
    data: {
      email,
      name: s.customer_details?.name ?? null,
      passwordHash,
      needsPasswordSetup: true,
    },
  });
  return created.id;
}

async function syncSubscription(
  sub: Stripe.Subscription,
  userId: string | null,
  customerId: string,
) {
  const priceId = sub.items.data[0]?.price?.id ?? null;
  const plan = planForPriceId(priceId);
  // `current_period_end` is top-level on older API versions and on the first
  // subscription item on newer ones — read whichever is present.
  const item = sub.items?.data?.[0] as
    | (Stripe.SubscriptionItem & { current_period_end?: number })
    | undefined;
  const periodEndUnix =
    (sub as Stripe.Subscription & { current_period_end?: number })
      .current_period_end ??
    item?.current_period_end ??
    null;
  const periodEnd = periodEndUnix ? new Date(periodEndUnix * 1000) : null;

  const data = {
    stripeCustomerId: customerId,
    stripeSubscriptionId: sub.id,
    subscriptionStatus: sub.status, // active | trialing | past_due | canceled | ...
    plan: plan ?? undefined,
    currentPeriodEnd: periodEnd,
  };

  // Prefer the explicit userId; fall back to matching by customer id.
  const user =
    (userId && (await prisma.user.findUnique({ where: { id: userId } }))) ||
    (await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })) ||
    (await prisma.user.findFirst({ where: { stripeSubscriptionId: sub.id } }));

  if (!user) {
    console.warn("Webhook: no matching user for customer", customerId);
    return;
  }

  await prisma.user.update({ where: { id: user.id }, data });
}
