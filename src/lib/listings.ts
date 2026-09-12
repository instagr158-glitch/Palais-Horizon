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

/** Safe shape for the public landing page. No price, no address, no agency link. */
export type TeaserListing = {
  id: string;
  headline: string; // generic, e.g. "4-bedroom villa · Bang Tao"
  propertyType: string;
  city: string;
  province: string;
  bedrooms: number | null;
  image: string;
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

export function toTeaser(l: Listing): TeaserListing {
  const bed = l.bedrooms ? `${l.bedrooms}-bedroom ` : "";
  return {
    id: l.id,
    headline: `${bed}${l.propertyType} · ${l.city}`,
    propertyType: l.propertyType,
    city: l.city,
    province: l.province,
    bedrooms: l.bedrooms,
    image: parseJsonArray(l.images)[0] ?? "",
  };
}

export type ListingFilters = {
  q?: string;
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

export async function getTeasers(take = 6): Promise<TeaserListing[]> {
  const rows = await prisma.listing.findMany({
    where: { status: "active" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take,
  });
  return rows.map(toTeaser);
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

export function formatThb(
  amount: number | null | undefined,
  fallback = "Price on application",
): string {
  if (amount == null) return fallback;
  return `฿${amount.toLocaleString("en-US")}`;
}

export function formatUsd(amount: number | null | undefined): string {
  if (amount == null) return "";
  return `$${amount.toLocaleString("en-US")}`;
}
