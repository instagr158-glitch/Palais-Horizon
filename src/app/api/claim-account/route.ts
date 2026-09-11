import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

const schema = z.object({
  sessionId: z.string().min(10),
  password: z.string().min(8).max(200),
});

/**
 * Lets someone who paid as a guest set a password for the account the
 * webhook created for them. Guarded by a real, verified Stripe Checkout
 * Session id (proof a payment just completed) — and only works once, because
 * `needsPasswordSetup` flips to false the moment a password is set. An
 * account that already had a real password (pre-existing member) is never
 * touched here.
 */
export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Payment is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a password of at least 8 characters." },
      { status: 400 },
    );
  }

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>;
  try {
    session = await stripe.checkout.sessions.retrieve(parsed.data.sessionId);
  } catch {
    return NextResponse.json({ error: "Checkout session not found." }, { status: 404 });
  }

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ error: "This checkout has not completed." }, { status: 400 });
  }

  const email = session.customer_details?.email?.toLowerCase().trim();
  if (!email) {
    return NextResponse.json({ error: "No account found for this checkout." }, { status: 404 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "No account found for this checkout." }, { status: 404 });
  }
  if (!user.needsPasswordSetup) {
    // Existing account (had a real password already) — don't let this route
    // reset it. They should sign in normally instead.
    return NextResponse.json(
      { error: "This account already has a password. Please sign in.", email },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, needsPasswordSetup: false },
  });

  return NextResponse.json({ ok: true, email: user.email });
}
