import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe, stripeConfigured, priceIdForPlan } from "@/lib/stripe";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export async function POST(req: Request) {
  if (!stripe || !stripeConfigured) {
    return NextResponse.json(
      { error: "Payment is not configured on this site yet." },
      { status: 503 },
    );
  }

  const { plan } = (await req.json().catch(() => ({}))) as { plan?: string };
  const priceId = priceIdForPlan(plan);
  if (!priceId) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  // Signed-in visitors reuse their account; everyone else checks out as a
  // guest — Stripe collects the email and the webhook creates the Palais
  // Horizon account once payment succeeds (see /subscribe/success).
  const session = await auth();

  try {
    let customerId: string | null = null;
    let clientReferenceId: string | undefined;

    if (session?.user?.id) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user) {
        return NextResponse.json({ error: "Account not found." }, { status: 404 });
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
      ...(clientReferenceId ? { client_reference_id: clientReferenceId } : {}),
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { userId: clientReferenceId ?? "", plan: plan ?? "" },
      },
      success_url: `${APP_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/pricing?canceled=1`,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
