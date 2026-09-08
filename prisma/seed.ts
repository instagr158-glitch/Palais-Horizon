import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { LISTINGS } from "./seed-data";

const prisma = new PrismaClient();

const EXTERIOR = [
  "1600596542815-ffad4c1539a9",
  "1600585154340-be6161a56a0c",
  "1600047509807-ba8f99d2cdde",
  "1512917774080-9991f1c4c750",
  "1580587771525-78b9dba3b914",
  "1613977257363-707ba9348227",
  "1600210492493-0946911123ea",
  "1613490493576-7fde63acd811",
  "1600585152915-d208bec867a1",
  "1568605114967-8130f3a36994",
  "1600585153490-76fb20a32601",
  "1523217582562-09d0def993a6",
  "1600121848594-d8644e57abab",
];
const INTERIOR = [
  "1600566753086-00f18fb6b3ea",
  "1600607687939-ce8a6c25118c",
  "1600566753190-17f0baa2a6c3",
  "1600563438938-a9a27216b4f5",
  "1600566752355-35792bedcfea",
  "1600607687920-4e2a09cf159d",
  "1600210491892-03d54c0aaf87",
  "1502672260266-1c1ef2d93688",
  "1493809842364-78817add7ffb",
  "1583608205776-bfd35f0d9f83",
  "1584622650111-993a426fbf0a",
  "1567496898669-ee935f5f647a",
  "1522708323590-d24dbb6b0267",
];
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

function gallery(seed: number, count = 5): string[] {
  const out = [img(EXTERIOR[seed % EXTERIOR.length])];
  for (let i = 0; i < count - 1; i++) {
    const pool = i % 2 === 0 ? INTERIOR : EXTERIOR;
    out.push(img(pool[(seed * 3 + i + 1) % pool.length]));
  }
  return out;
}

function luxuryScore(priceAmount: number, amenities: string[]): number {
  let score = Math.min(60, Math.round(priceAmount / 2_500_000));
  const text = amenities.join(" ").toLowerCase();
  for (const kw of ["infinity", "sea view", "beach", "freehold", "staff", "spa"]) {
    if (text.includes(kw)) score += 6;
  }
  return Math.min(100, score);
}

async function main() {
  // --- demo accounts -------------------------------------------------------
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

  // --- listings ----------------------------------------------------------
  let created = 0;
  for (let i = 0; i < LISTINGS.length; i++) {
    const l = LISTINGS[i];
    const data = {
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
    };
    await prisma.listing.upsert({
      where: { source_externalId: { source: "seed", externalId: l.externalId } },
      update: data,
      create: data,
    });
    created++;
  }

  console.log(`Seed complete: ${created} listings, 2 demo users.`);
  console.log("  member@palaishorizon.com / password123  (active membership)");
  console.log("  visitor@palaishorizon.com / password123 (no membership)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
