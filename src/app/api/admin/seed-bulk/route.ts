import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseBulk } from "../../../../../prisma/bulk-listings";
import {
  gallery,
  luxuryScore,
  COORDS,
  CITY_COORDS,
  amenitiesFor,
  describe,
  featuredFor,
  scoringPriceFor,
} from "../../../../../prisma/seedShared";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * One-off admin utility: (re)seeds every listing in prisma/bulk-listings.ts
 * into the live database, using the app's own already-configured
 * DATABASE_URL — no separate DB credential needed to trigger this.
 * Upserts by (source, externalId), so it's safe to call more than once.
 * Triggered manually with `Authorization: Bearer <SEED_SECRET>`.
 */
async function handle(req: Request) {
  const header = req.headers.get("authorization") ?? "";
  const secret = process.env.SEED_SECRET;

  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  try {
    const bulk = parseBulk();
    let sale = 0;
    let rent = 0;

    // A stable offset so gallery images don't collide with the curated
    // seed-data.ts listings (which use indices starting at 0).
    let bi = 1000;
    for (const b of bulk) {
      const amenities = amenitiesFor(b);
      const [lat, lng] = COORDS[b.district] ?? CITY_COORDS[b.city] ?? [7.89, 98.37];
      const usd = Math.round(b.priceAmount / 34.5);
      const featured = featuredFor(b);
      const scoringPrice = scoringPriceFor(b);

      await prisma.listing.upsert({
        where: {
          source_externalId: { source: "seed", externalId: `bulk-${b.externalId}` },
        },
        update: {
          agencyName: b.agencyName,
          agencyUrl: b.agencyUrl,
          title: b.title,
          description: describe(b, amenities),
          propertyType: b.propertyType,
          listingType: b.listingType,
          priceAmount: b.priceAmount,
          priceCurrency: "THB",
          priceUsd: usd,
          bedrooms: b.bedrooms,
          bathrooms: b.bathrooms,
          areaSqm: b.areaSqm,
          province: b.province,
          city: b.city,
          district: b.district,
          addressText: `${b.district}, ${b.city}, ${b.province}`,
          lat,
          lng,
          amenities: JSON.stringify(amenities),
          luxuryScore: luxuryScore(scoringPrice, amenities),
          featured,
          status: "active",
        },
        create: {
          source: "seed",
          externalId: `bulk-${b.externalId}`,
          sourceUrl: b.agencyUrl,
          agencyName: b.agencyName,
          agencyUrl: b.agencyUrl,
          title: b.title,
          description: describe(b, amenities),
          propertyType: b.propertyType,
          listingType: b.listingType,
          priceAmount: b.priceAmount,
          priceCurrency: "THB",
          priceUsd: usd,
          bedrooms: b.bedrooms,
          bathrooms: b.bathrooms,
          areaSqm: b.areaSqm,
          landSqm: null,
          province: b.province,
          city: b.city,
          district: b.district,
          addressText: `${b.district}, ${b.city}, ${b.province}`,
          lat,
          lng,
          images: JSON.stringify(gallery(bi, 6)),
          amenities: JSON.stringify(amenities),
          furnished: true,
          luxuryScore: luxuryScore(scoringPrice, amenities),
          featured,
          status: "active",
        },
      });

      if (b.listingType === "rent") rent++;
      else sale++;
      bi++;
    }

    const total = await prisma.listing.count({ where: { status: "active" } });
    return NextResponse.json({
      ok: true,
      sale,
      rent,
      totalWritten: sale + rent,
      totalActiveInDb: total,
      ms: Date.now() - started,
    });
  } catch (err) {
    console.error("seed-bulk failed:", err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}

export const GET = handle;
export const POST = handle;
