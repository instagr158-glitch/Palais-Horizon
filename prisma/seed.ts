import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { LISTINGS } from "./seed-data";
import { parseBulk } from "./bulk-listings";
import {
  gallery,
  luxuryScore,
  COORDS,
  CITY_COORDS,
  amenitiesFor,
  describe,
  featuredFor,
  scoringPriceFor,
} from "./seedShared";

function resolveDbUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  if (url.includes("-pooler.") && !/[?&]pgbouncer=/.test(url)) {
    return url + (url.includes("?") ? "&" : "?") + "pgbouncer=true";
  }
  return url;
}

const prisma = new PrismaClient({ datasourceUrl: resolveDbUrl() });

// ---------- main ------------------------------------------------------

async function upsertListing(
  data: Parameters<typeof prisma.listing.upsert>[0]["create"],
) {
  await prisma.listing.upsert({
    where: {
      source_externalId: {
        source: data.source as string,
        externalId: data.externalId as string,
      },
    },
    update: data,
    create: data,
  });
}

async function main() {
  const demoPass = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "member@palaishorizon.com" },
    update: {},
    create: {
      email: "member@palaishorizon.com",
      name: "Demo Member",
      passwordHash: demoPass,
      subscriptionStatus: "active",
      plan: "annual",
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.user.upsert({
    where: { email: "visitor@palaishorizon.com" },
    update: {},
    create: {
      email: "visitor@palaishorizon.com",
      name: "Demo Visitor",
      passwordHash: demoPass,
      subscriptionStatus: "none",
    },
  });

  const usedUrls = new Set<string>();
  let n = 0;

  // --- curated rich listings ------------------------------------------
  for (let i = 0; i < LISTINGS.length; i++) {
    const l = LISTINGS[i];
    usedUrls.add(l.agencyUrl);
    await upsertListing({
      source: "seed",
      externalId: l.externalId,
      sourceUrl: l.agencyUrl,
      agencyName: l.agencyName,
      agencyUrl: l.agencyUrl,
      title: l.title,
      description: l.description,
      propertyType: l.propertyType,
      listingType: l.listingType ?? "sale",
      priceAmount: l.priceAmount,
      priceCurrency: "THB",
      priceUsd: l.priceUsd ?? Math.round(l.priceAmount / 34.5),
      bedrooms: l.bedrooms,
      bathrooms: l.bathrooms,
      areaSqm: l.areaSqm ?? null,
      landSqm: l.landSqm ?? null,
      province: l.province,
      city: l.city,
      district: l.district ?? null,
      addressText: l.addressText ?? `${l.city}, ${l.province}`,
      lat: l.lat ?? null,
      lng: l.lng ?? null,
      images: JSON.stringify(gallery(i, 6)),
      amenities: JSON.stringify(l.amenities),
      furnished: l.furnished ?? true,
      luxuryScore: luxuryScore(l.priceAmount, l.amenities),
      featured: l.featured ?? false,
      status: "active",
    });
    n++;
  }

  // --- bulk listings -------------------------------------------------
  const bulk = parseBulk();
  let bi = LISTINGS.length;
  for (const b of bulk) {
    if (usedUrls.has(b.agencyUrl)) continue;
    usedUrls.add(b.agencyUrl);
    const amenities = amenitiesFor(b);
    const [lat, lng] = COORDS[b.district] ?? CITY_COORDS[b.city] ?? [7.89, 98.37];
    const usd = Math.round(b.priceAmount / 34.5);
    const featured = featuredFor(b);
    const scoringPrice = scoringPriceFor(b);
    await upsertListing({
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
    });
    bi++;
    n++;
  }

  const total = await prisma.listing.count({ where: { status: "active" } });
  console.log(`Seed complete: ${n} listings written, ${total} active in DB.`);
  console.log("  member@palaishorizon.com / password123  (active membership)");
  console.log("  visitor@palaishorizon.com / password123 (no membership)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
