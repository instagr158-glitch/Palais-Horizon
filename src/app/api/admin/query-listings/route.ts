import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * One-off admin utility to inspect real inventory (price range, photo count)
 * for a given province/listingType before hand-picking showcase items, since
 * the catalogue itself is behind a paid-membership wall. Triggered manually
 * with `Authorization: Bearer <INGEST_SECRET>`.
 */
async function handle(req: Request) {
  const header = req.headers.get("authorization") ?? "";
  const secret = process.env.INGEST_SECRET;

  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const province = searchParams.get("province") ?? undefined;
  const listingType = searchParams.get("listingType") ?? undefined;
  const propertyType = searchParams.get("propertyType") ?? undefined;

  const rows = await prisma.listing.findMany({
    where: {
      status: "active",
      ...(province ? { province } : {}),
      ...(listingType ? { listingType } : {}),
      ...(propertyType ? { propertyType } : {}),
    },
    orderBy: { priceUsd: "asc" },
    select: {
      id: true,
      title: true,
      propertyType: true,
      listingType: true,
      priceUsd: true,
      bedrooms: true,
      city: true,
      images: true,
      sourceUrl: true,
    },
  });

  return NextResponse.json({
    ok: true,
    count: rows.length,
    rows: rows.map((r) => ({
      ...r,
      images: undefined,
      imageCount: (() => {
        try {
          return JSON.parse(r.images).length;
        } catch {
          return 0;
        }
      })(),
      firstImage: (() => {
        try {
          return JSON.parse(r.images)[0] ?? null;
        } catch {
          return null;
        }
      })(),
    })),
  });
}

export const GET = handle;
export const POST = handle;
