import { NextResponse } from "next/server";
import { z } from "zod";
import { sendCheckoutEmail, emailConfigured } from "@/lib/email";
import { getLocale } from "@/i18n/server";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

const schema = z.object({
  email: z.string().email(),
});

/**
 * For visitors stuck in an in-app browser (TikTok, Instagram, Facebook)
 * that blocks navigation straight to Stripe: emails a link back to our own
 * /pricing page instead of a direct Stripe URL, so the visitor lands on
 * familiar Palais Horizon branding first and clicks "Continue" themselves —
 * reassuring, and by then they're in a real mail-app browser, not the
 * restricted in-app one, so the normal Stripe redirect works fine.
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

  try {
    const locale = await getLocale();
    await sendCheckoutEmail({
      to: parsed.data.email,
      siteUrl: `${APP_URL}/pricing`,
      locale,
    });
  } catch (err) {
    console.error("Failed to send checkout email:", err);
    return NextResponse.json(
      { error: "Could not send the email. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
