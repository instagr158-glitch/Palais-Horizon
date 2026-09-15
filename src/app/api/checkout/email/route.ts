import { NextResponse } from "next/server";
import { z } from "zod";
import { buildCheckoutSession } from "@/lib/checkoutSession";
import { sendCheckoutEmail, emailConfigured } from "@/lib/email";
import { getLocale } from "@/i18n/server";

const schema = z.object({
  plan: z.string().min(1),
  email: z.string().email(),
});

/**
 * For visitors stuck in an in-app browser (TikTok, Instagram, Facebook)
 * that blocks navigation straight to Stripe: creates the same Checkout
 * Session as /api/checkout, but emails the link instead of returning it for
 * an immediate redirect. Opening that email in a real mail app breaks the
 * visitor out of the in-app browser entirely, so the link works normally.
 */
export async function POST(req: Request) {
  if (!emailConfigured) {
    return NextResponse.json(
      { error: "Email is not configured on this site yet." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const result = await buildCheckoutSession(parsed.data.plan, {
    customerEmail: parsed.data.email,
  });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  try {
    const locale = await getLocale();
    await sendCheckoutEmail({ to: parsed.data.email, checkoutUrl: result.url, locale });
  } catch (err) {
    console.error("Failed to send checkout email:", err);
    return NextResponse.json(
      { error: "Could not send the email. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
