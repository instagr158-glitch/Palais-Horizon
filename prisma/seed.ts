import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { LISTINGS } from "./seed-data";
import { parseBulk, type BulkListing } from "./bulk-listings";

function resolveDbUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  if (url.includes("-pooler.") && !/[?&]pgbouncer=/.test(url)) {
    return url + (url.includes("?") ? "&" : "?") + "pgbouncer=true";
  }
  return url;
}

const prisma = new PrismaClient({ datasourceUrl: resolveDbUrl() });

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

function gallery(seed: number, count = 6): string[] {
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

// ---------- bulk-listing expansion --------------------------------------

const COORDS: Record<string, [number, number]> = {
  // Phuket
  Rawai: [7.78, 98.325], "Nai Harn": [7.775, 98.303], Chalong: [7.846, 98.338],
  Kata: [7.82, 98.298], Karon: [7.845, 98.294], Patong: [7.897, 98.297],
  Kamala: [7.955, 98.283], "Bang Tao": [7.995, 98.293], Surin: [7.98, 98.281],
  "Cherng Talay": [7.99, 98.30], Layan: [8.02, 98.298], "Nai Thon": [8.09, 98.30],
  "Mai Khao": [8.15, 98.302], "Pa Khlok": [8.02, 98.42], "Si Sunthon": [8.00, 98.34],
  Thalang: [8.03, 98.34], Kathu: [7.91, 98.33], "Ko Kaeo": [7.90, 98.42],
  Yamu: [8.02, 98.42], Ratsada: [7.89, 98.40],
  // Koh Samui
  Bophut: [9.56, 100.06], Chaweng: [9.53, 100.06], Lamai: [9.47, 100.05],
  Maenam: [9.57, 100.03], "Bang Por": [9.58, 99.95], "Plai Laem": [9.58, 100.06],
  "Bang Rak": [9.57, 100.06], Nathon: [9.53, 99.94], "Choeng Mon": [9.57, 100.07],
  // Pattaya
  Jomtien: [12.89, 100.87], "Na Jomtien": [12.83, 100.90], Pratumnak: [12.91, 100.86],
  "East Pattaya": [12.93, 100.95], "Na Kluea": [12.97, 100.89],
  // Hua Hin
  "Hin Lek Fai": [12.55, 99.93], "Thap Tai": [12.50, 99.90], "Nong Kae": [12.51, 99.96],
  "Khao Tao": [12.47, 99.98], "Hua Hin Town": [12.57, 99.96],
  // Bangkok
  Thonglor: [13.735, 100.583], "Phrom Phong": [13.73, 100.57],
  Sukhumvit: [13.74, 100.56], Sathorn: [13.72, 100.53], Silom: [13.72, 100.53],
};
const CITY_COORDS: Record<string, [number, number]> = {
  Phuket: [7.89, 98.37], "Koh Samui": [9.51, 100.01], Pattaya: [12.93, 100.88],
  "Hua Hin": [12.57, 99.96], Bangkok: [13.74, 100.55], "Chiang Mai": [18.79, 98.98],
};

const AREA_FLAVOUR: Record<string, string> = {
  Rawai: "in the quiet south of the island, minutes from Rawai and Nai Harn beaches",
  "Nai Harn": "moments from Nai Harn, one of Phuket's finest beaches",
  Chalong: "central for the whole island, close to Chalong Bay and the marinas",
  Kamala: "on Phuket's exclusive west coast near Kamala Beach",
  "Bang Tao": "in the Laguna / Bang Tao beach-club belt",
  Surin: "above Surin Beach, Phuket's most sought-after address",
  "Cherng Talay": "in Cherng Talay, walking distance to Bang Tao and Layan beaches",
  Layan: "beside the calm sands of Layan Beach",
  "Nai Thon": "overlooking the peaceful bay of Nai Thon",
  "Pa Khlok": "on the tranquil north-east coast near Ao Po Grand Marina",
  Patong: "a short drive from Patong's beach and nightlife",
  "Si Sunthon": "in the sought-after Cherng Talay / Laguna hinterland",
  "Ko Kaeo": "on the east coast near Boat Lagoon and the international schools",
  Bophut: "in the Bophut hills with views over the north-east coast",
  Chaweng: "close to Chaweng, Samui's main beach and dining strip",
  Lamai: "above Lamai on Samui's laid-back south-east coast",
  "Bang Por": "on Samui's quiet north coast with sunset sea views",
  "Plai Laem": "on the Plai Laem headland with wide ocean views",
  Jomtien: "close to Jomtien Beach and the Pattaya waterfront",
  "Na Jomtien": "on the exclusive Na Jomtien stretch south of the city",
  "East Pattaya": "in the green, low-density East Pattaya / Mabprachan Lake area",
  Thonglor: "on Thonglor, Bangkok's most fashionable street",
  "Phrom Phong": "steps from Phrom Phong BTS and EmQuartier",
  Silom: "in the heart of Bangkok's financial district",
};

function amenitiesFor(b: BulkListing): string[] {
  const t = b.title.toLowerCase();
  const out: string[] = [];
  if (b.propertyType === "condo") {
    out.push("Resort facilities & pool", "Fitness centre", "24-hour security & concierge",
      "Covered parking");
  } else {
    out.push(t.includes("no pool") ? "Landscaped gardens" : "Private swimming pool");
    out.push("Covered parking", "Tropical garden");
  }
  if (/sea view|ocean view|seaview/.test(t)) out.push("Sea view");
  if (/sunset/.test(t)) out.push("Sunset views");
  if (/beachfront|beach residences|oceanfront|steps.*beach|beach house/.test(t))
    out.push("Beachfront / walk to the beach");
  if (/lake|lakeside|lakeview|lake front|lagoon/.test(t)) out.push("Lake / lagoon view");
  if (/golf/.test(t)) out.push("Golf-course frontage");
  if ((b.bedrooms ?? 0) >= 5) out.push("Staff / guest quarters");
  if (b.priceAmount >= 80_000_000) out.push("Full estate services");
  return [...new Set(out)];
}

function describe(b: BulkListing, amenities: string[]): string {
  const bd = b.bedrooms ? `${b.bedrooms}-bedroom ` : "";
  const kind = b.propertyType === "condo" ? "residence" : b.propertyType;
  const flavour = AREA_FLAVOUR[b.district]
    ? `, ${AREA_FLAVOUR[b.district]}`
    : ` in ${b.district}, ${b.province}`;
  const size = b.areaSqm ? ` About ${b.areaSqm} sqm of living space.` : "";
  const feat = amenities.slice(0, 3).join(", ").toLowerCase();
  const tierLine =
    b.priceAmount >= 100_000_000
      ? "A trophy property at the very top of the market."
      : b.priceAmount >= 40_000_000
        ? "A substantial residence in the high-luxury tier."
        : b.priceAmount >= 15_000_000
          ? "A refined home in the core luxury segment."
          : "An accessible entry into the luxury collection.";
  return (
    `${tierLine} This ${bd}${kind}${flavour}.${size} ` +
    `Highlights include ${feat}. ` +
    `Listed by ${b.agencyName}. Palais Horizon introduces members directly to the ` +
    `agency for the full brochure, current photography and a private viewing.`
  );
}

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
    const featured =
      b.priceAmount >= 70_000_000 ||
      (b.priceAmount >= 28_000_000 &&
        /sea view|ocean view|beachfront|sunset/i.test(b.title));
    await upsertListing({
      source: "seed",
      externalId: `bulk-${b.externalId}`,
      sourceUrl: b.agencyUrl,
      agencyName: b.agencyName,
      agencyUrl: b.agencyUrl,
      title: b.title,
      description: describe(b, amenities),
      propertyType: b.propertyType,
      listingType: "sale",
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
      luxuryScore: luxuryScore(b.priceAmount, amenities),
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
