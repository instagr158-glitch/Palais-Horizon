import { NextResponse } from "next/server";
import { buildCheckoutSession } from "@/lib/checkoutSession";

export async function POST(req: Request) {
  const { plan } = (await req.json().catch(() => ({}))) as { plan?: string };
  const result = await buildCheckoutSession(plan);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ url: result.url });
}
