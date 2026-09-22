import type { Listing } from "@prisma/client";
import { prisma } from "@/lib/db";

export type PropertyType = "villa" | "house" | "penthouse" | "condo" | "land";
export const PROPERTY_TYPES: PropertyType[] = [
  "villa",
  "house",
  "penthouse",
  "condo",
  "land",
];

export const PROVINCES = [
  "Phuket",
  "Surat Thani", // Koh Samui
  "Bangkok",
  "Chonburi", // Pattaya
  "Prachuap Khiri Khan", // Hua Hin
  "Chiang Mai",
] as const;

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** Full shape returned to members. */
export type FullListing = {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  listingType: string;
  priceAmount: number | null;
  priceCurrency: string;
  priceUsd: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  landSqm: number | null;
  province: string;
  city: string;
  district: string | null;
  addressText: string | null;
  lat: number | null;
  lng: number | null;
  images: string[];
  amenities: string[];
  furnished: boolean;
  featured: boolean;
  agencyName: string;
  agencyUrl: string;
  sourceUrl: string;
  createdAt: string;
};

export function toFullListing(l: Listing): FullListing {
  return {
    id: l.id,
    title: l.title,
    description: l.description,
    propertyType: l.propertyType,
    listingType: l.listingType,
    priceAmount: l.priceAmount,
    priceCurrency: l.priceCurrency,
    priceUsd: l.priceUsd,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    areaSqm: l.areaSqm,
    landSqm: l.landSqm,
    province: l.province,
    city: l.city,
    district: l.district,
    addressText: l.addressText,
    lat: l.lat,
    lng: l.lng,
    images: parseJsonArray(l.images),
    amenities: parseJsonArray(l.amenities),
    furnished: l.furnished,
    featured: l.featured,
    agencyName: l.agencyName,
    agencyUrl: l.agencyUrl,
    sourceUrl: l.sourceUrl,
    createdAt: l.createdAt.toISOString(),
  };
}

/** Countries with at least one active market. "province" is the country-level
 * field on Listing (Thai region name for Thailand, "Bali" for Indonesia,
 * "Dubai" for the UAE). */
export const COUNTRY_PROVINCES: Record<string, readonly string[]> = {
  thailand: PROVINCES,
  bali: ["Bali"],
  dubai: ["Dubai"],
  miami: ["Miami"],
};

export type ListingFilters = {
  q?: string;
  country?: string;
  propertyType?: string;
  listingType?: string;
  province?: string;
  minBedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: "recent" | "price_desc" | "price_asc" | "area_desc";
  page?: number;
  perPage?: number;
};

export async function queryListings(filters: ListingFilters) {
  const perPage = Math.min(filters.perPage ?? 12, 48);
  const page = Math.max(filters.page ?? 1, 1);

  const where: Record<string, unknown> = { status: "active" };
  const countryProvinces = filters.country
    ? COUNTRY_PROVINCES[filters.country]
    : undefined;
  if (countryProvinces) where.province = { in: [...countryProvinces] };
  if (filters.propertyType) where.propertyType = filters.propertyType;
  if (filters.listingType) where.listingType = filters.listingType;
  if (filters.province) where.province = filters.province;
  if (filters.minBedrooms) where.bedrooms = { gte: filters.minBedrooms };
  if (filters.minPrice || filters.maxPrice) {
    where.priceAmount = {
      ...(filters.minPrice ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
    };
  }
  if (filters.q) {
    const q = filters.q;
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { city: { contains: q } },
      { district: { contains: q } },
      { province: { contains: q } },
    ];
  }

  const orderBy =
    filters.sort === "price_desc"
      ? [{ priceAmount: "desc" as const }]
      : filters.sort === "price_asc"
        ? [{ priceAmount: "asc" as const }]
        : filters.sort === "area_desc"
          ? [{ areaSqm: "desc" as const }]
          : [{ featured: "desc" as const }, { createdAt: "desc" as const }];

  const [rows, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings: rows.map(toFullListing),
    total,
    page,
    perPage,
    pages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getListingById(id: string): Promise<FullListing | null> {
  const row = await prisma.listing.findUnique({ where: { id } });
  return row ? toFullListing(row) : null;
}

export async function getSimilarListings(
  listing: FullListing,
  take = 3,
): Promise<FullListing[]> {
  const rows = await prisma.listing.findMany({
    where: {
      status: "active",
      id: { not: listing.id },
      OR: [{ province: listing.province }, { propertyType: listing.propertyType }],
    },
    orderBy: { featured: "desc" },
    take,
  });
  return rows.map(toFullListing);
}

/** Country + display flag for a listing, derived from its stored province. */
function countryOf(province: string): { country: string; flag: string } {
  if (province === "Bali") return { country: "Bali", flag: "🇮🇩" };
  if (province === "Dubai") return { country: "Dubai", flag: "🇦🇪" };
  if (province === "Miami") return { country: "Miami", flag: "🇺🇸" };
  return { country: "Thailand", flag: "🇹🇭" };
}

/**
 * A hand-picked set of real, currently-listed rentals for the homepage
 * showcase — chosen for being priced near the accessible end of each market
 * (≈€1,000/month or under for Thailand and Bali, ≈€2,000/month for Dubai and
 * Miami) and for having a genuine, good-quality listing photo. IDs are
 * pinned rather than queried by price so the selection stays deliberate;
 * any listing that later goes inactive is simply skipped.
 */
const SHOWCASE_IDS = [
  "cmty5eh8100d3jw045j87kofh", // Bangkok — Park Origin Thonglor
  "cmu9jifid00ltig04lss6rutb", // Uluwatu/Balangan, Bali — cozy pool villa
  "cmu9jczj600frig044bq54ler", // The Views, Dubai — Fairways West
  "cmu9jcis5005zig04o0pwv89i", // Cutler Bay, Miami
  "cmty5eh2l00d1jw046mvi0w1u", // Phuket — Aristo 2 sea view condo
  "cmu9jcpzl00apig04i52r1qec", // Damac Hills 2, Dubai — villa
  "cmu9jcnay0094ig04zp9o8xd3", // Kendall, Miami
];

export type ShowcaseItem = FullListing & { country: string; flag: string };

export async function getShowcaseListings(): Promise<ShowcaseItem[]> {
  const rows = await prisma.listing.findMany({
    where: { id: { in: SHOWCASE_IDS }, status: "active" },
  });
  const byId = new Map(rows.map((r) => [r.id, r]));
  return SHOWCASE_IDS.map((id) => byId.get(id))
    .filter((r): r is NonNullable<typeof r> => !!r)
    .map((r) => ({ ...toFullListing(r), ...countryOf(r.province) }));
}

/**
 * A hand-picked set of real, currently-listed for-sale homes for the
 * homepage showcase's "buy" section — Bali only (Thailand's sale villas
 * near this budget kept coming back with genuinely blurry source photos,
 * so they were dropped rather than shipped looking bad). Genuine market
 * floor, not a target price: only one real Bali villa lists under €140k.
 * Pinned by ID, same rationale as SHOWCASE_IDS above.
 */
const SALE_SHOWCASE_IDS = [
  "cmu7t8xa60009jv04dhrqzf37", // Jimbaran, Bali — villa, €139,747
  "cmu7t99f6000ljv04oup9ug9g", // Ungasan, Bali — villa, €143,240
];

export async function getSaleShowcaseListings(): Promise<ShowcaseItem[]> {
  const rows = await prisma.listing.findMany({
    where: { id: { in: SALE_SHOWCASE_IDS }, status: "active" },
  });
  const byId = new Map(rows.map((r) => [r.id, r]));
  return SALE_SHOWCASE_IDS.map((id) => byId.get(id))
    .filter((r): r is NonNullable<typeof r> => !!r)
    .map((r) => ({ ...toFullListing(r), ...countryOf(r.province) }));
}

export async function getCatalogStats() {
  const [total, provinces, agencies] = await Promise.all([
    prisma.listing.count({ where: { status: "active" } }),
    prisma.listing.findMany({
      where: { status: "active" },
      select: { province: true },
      distinct: ["province"],
    }),
    prisma.listing.findMany({
      where: { status: "active" },
      select: { agencyName: true },
      distinct: ["agencyName"],
    }),
  ]);
  return { total, provinceCount: provinces.length, agencyCount: agencies.length };
}

// ---------- formatting ----------

// Indicative USD->EUR rate used across the site (matches the homepage showcase).
const USD_TO_EUR = 0.92;

export function formatEur(
  usdAmount: number | null | undefined,
  fallback = "Price on application",
): string {
  if (usdAmount == null) return fallback;
  return `€${Math.round(usdAmount * USD_TO_EUR).toLocaleString("en-US")}`;
}

export function formatUsd(amount: number | null | undefined): string {
  if (amount == null) return "";
  return `$${amount.toLocaleString("en-US")}`;
}
