import { NextResponse } from "next/server";
import { buildCheckoutSession, type CheckoutPreferences } from "@/lib/checkoutSession";

export async function POST(req: Request) {
  const { plan, preferences } = (await req.json().catch(() => ({}))) as {
    plan?: string;
    preferences?: CheckoutPreferences;
  };
  const result = await buildCheckoutSession(plan, preferences);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ url: result.url });
}
