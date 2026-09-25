import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Temporary lookup utility, deleted again once its job is done. */
async function handle(req: Request) {
  const header = req.headers.get("authorization") ?? "";
  const secret = process.env.INGEST_SECRET;

  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const province = searchParams.get("province") ?? undefined;
  const listingType = searchParams.get("listingType") ?? undefined;
  const take = Number(searchParams.get("take") ?? "20");

  const rows = await prisma.listing.findMany({
    where: {
      status: "active",
      ...(province ? { province } : {}),
      ...(listingType ? { listingType } : {}),
    },
    orderBy: { priceUsd: "desc" },
    take,
    select: {
      id: true,
      title: true,
      listingType: true,
      propertyType: true,
      priceUsd: true,
      city: true,
      district: true,
      bedrooms: true,
      bathrooms: true,
      areaSqm: true,
      furnished: true,
      images: true,
      sourceUrl: true,
      agencyName: true,
    },
  });

  return NextResponse.json({ count: rows.length, rows });
}

export const GET = handle;
