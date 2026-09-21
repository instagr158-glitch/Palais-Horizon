import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * One-off admin utility: once the real ingestion pipeline (source
 * "generic-jsonld") has re-fetched a bulk-seeded listing's own real URL and
 * created a fresh row with genuine photos, this deactivates the original
 * stock-photo row (source "seed") for that same URL so the catalogue shows
 * each property only once. Matches by sourceUrl, which is identical between
 * the two rows since both point at the listing's real live page.
 * Triggered manually with `Authorization: Bearer <INGEST_SECRET>` (reuses
 * the same admin secret as /api/ingest, since SEED_SECRET isn't guaranteed
 * to be configured on every deployment).
 */
async function handle(req: Request) {
  const header = req.headers.get("authorization") ?? "";
  const secret = process.env.INGEST_SECRET;

  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reIngested = await prisma.listing.findMany({
      where: { source: "generic-jsonld" },
      select: { sourceUrl: true },
    });
    const urls = reIngested.map((r) => r.sourceUrl);

    const result = await prisma.listing.updateMany({
      where: { source: "seed", status: "active", sourceUrl: { in: urls } },
      data: { status: "inactive" },
    });

    return NextResponse.json({
      ok: true,
      reIngestedCount: urls.length,
      deactivated: result.count,
    });
  } catch (err) {
    console.error("retire-bulk-seed failed:", err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}

export const GET = handle;
export const POST = handle;
