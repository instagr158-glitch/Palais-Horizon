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

export type ShowcaseItem = FullListing & { country: string; flag: string };
export type HighlightItem = { id: string; image: string };
export type Market = "miami" | "bali";

type HighlightEntry = { id: string; imageIndex: number };
type ShowcaseEntry = { id: string; imageIndex: number; title: string };

/**
 * Hand-picked, real, currently-listed high-end listings per market for the
 * landing pages (homepage = Miami, /bali = Bali): a plain photo carousel
 * (`highlight`), a rental showcase and a sale showcase. No price is shown on
 * any of them. Real titles are replaced by short, address-free descriptions,
 * and each entry pins the specific photo (by index into that listing's own
 * image list) rather than always using images[0]. Order matters: the
 * showcases keep the first N visible and blur the rest (see visibleCount in
 * LandingContent), so the last entries are the ones meant to end up blurred.
 */
const MARKET_SHOWCASES: Record<
  Market,
  { highlight: HighlightEntry[]; rent: ShowcaseEntry[]; sale: ShowcaseEntry[] }
> = {
  miami: {
    highlight: [
      { id: "cmu7t9uc4001ujv045evtksm1", imageIndex: 1 }, // 485 Brickell Ave, Unit 1609 — Icon Brickell
      { id: "cmu7t9t5x001rjv048rak6e7n", imageIndex: 1 }, // 801 Brickell Key Blvd, Unit 2006
      { id: "cmu7t9sco001pjv04vid97tck", imageIndex: 2 }, // 485 Brickell Ave, Unit 1909 — Icon Brickell
      { id: "cmu7t9qjc001ljv041n2tqly7", imageIndex: 2 }, // 851 NE 1st Ave, Unit 3506 — Park West
      { id: "cmu7t9wpv001zjv049087k2cu", imageIndex: 2 }, // 79 SW 12th St, Unit 2201S — Brickell
      { id: "cmu7t9r2l001mjv04e0zg0l3r", imageIndex: 2 }, // 20 NE 11th St, Unit EXECPH03A — Park West
    ],
    rent: [
      { id: "cmu9iy62d0024jl04vz03o1el", imageIndex: 2, title: "3-Bedroom High-Rise Apartment, Floor-to-Ceiling Windows" }, // 1300 S Miami Ave, Unit 1206 — Brickell
      { id: "cmu9j01xe002mjn04fbmkoxvz", imageIndex: 2, title: "2-Bedroom High-Rise Apartment, Panoramic Bay Views" }, // 1100 Biscayne Blvd, Unit 3805 — Marquis
      { id: "cmu9j02lh002ojn040p3mxqgv", imageIndex: 2, title: "3-Bedroom High-Rise Apartment, Ocean-View Balcony" }, // 2101 Brickell Ave, Unit 3005 — Skyline on Brickell
      { id: "cmu9j01n4002ljn04k991n8x6", imageIndex: 2, title: "2-Bedroom High-Rise Apartment, Modern Open Kitchen" }, // 801 Brickell Key Blvd, Unit 1512
      { id: "cmu9j02wp002pjn043rws4xq3", imageIndex: 3, title: "2-Bedroom High-Rise Apartment, Designer Interior" }, // 801 S Miami Ave, Unit 1810 — blurred
      { id: "cmu9izwig0026jn04sp0mvea9", imageIndex: 2, title: "2-Bedroom High-Rise Apartment, Skyline-View Suite" }, // 1400 Biscayne Blvd, Unit 602 — blurred, last
    ],
    sale: [
      { id: "cmu7t9ty7001tjv044zp9dk8a", imageIndex: 2, title: "2-Bedroom Condo for Sale, Floor-to-Ceiling Windows" }, // 475 Brickell Ave, Unit 5507
      { id: "cmu7t9ur7001vjv044i4od9im", imageIndex: 2, title: "1-Bedroom Condo for Sale, Open Kitchen & Balcony" }, // 68 SE 6th St, Unit 806 — Brickell
      { id: "cmu7t9rvc001ojv048ylkah04", imageIndex: 2, title: "1-Bedroom Condo for Sale, Skyline Balcony View" }, // 31 SE 5th St, Unit 3309 — Brickell
      { id: "cmu7t9rft001njv04u6y2w8xz", imageIndex: 2, title: "1-Bedroom Condo for Sale, Panoramic City Views" }, // 90 SW 3rd St, Unit 2014 — blurred
      { id: "cmu7t9tjp001sjv04gigukt2h", imageIndex: 3, title: "1-Bedroom Condo for Sale, Downtown High-Rise" }, // 151 SE 1st St, Unit 1202 — blurred, last
    ],
  },
  bali: {
    highlight: [
      { id: "cmu7t9a93000mjv04flb6pc6g", imageIndex: 0 }, // Canggu, Echo Beach — 4bd
      { id: "cmu7t8z9c000bjv0410icrwhu", imageIndex: 0 }, // Pererenan, Tumbak Bayuh — 5bd
      { id: "cmu7t8su20005jv040f0grl29", imageIndex: 0 }, // Canggu, Berawa — 3bd
      { id: "cmu7t97j4000jjv049srgknx9", imageIndex: 0 }, // Uluwatu, Bingin — 2bd
      { id: "cmu7t91ua000djv04p7oldbsd", imageIndex: 0 }, // Uluwatu — 3bd
      { id: "cmu7t8ybe000ajv04a3flbov2", imageIndex: 0 }, // Uluwatu — 3bd off-plan
    ],
    rent: [
      { id: "cmu9jkn3f00mtjp04h4nus3ck", imageIndex: 0, title: "3-Bedroom Villa for Rent, Thatched Roof & Private Pool" }, // Canggu
      { id: "cmu9jkoo700n7jp04qh37oean", imageIndex: 0, title: "3-Bedroom Villa for Rent, Long Private Pool" }, // Canggu
      { id: "cmu9jkxka00pfjp042uykjnno", imageIndex: 0, title: "3-Bedroom Villa for Rent, Private Pool" }, // Jimbaran
      { id: "cmu9jkx0t00p7jp04n9t0j3gv", imageIndex: 0, title: "3-Bedroom Villa for Monthly Rental, Tropical Garden" }, // Kerobokan
      { id: "cmu9jdbs600k2ig042qvhz012", imageIndex: 0, title: "3-Bedroom Villa for Rent, Frangipani Garden Pool" }, // Canggu, Batu Bolong — blurred
      { id: "cmu9jl1z400qojp04pteszi8r", imageIndex: 0, title: "Brand New 3-Bedroom Modern Villa for Rent" }, // Umalas — blurred, last
    ],
    sale: [
      { id: "cmucnpwxs0001if04u4nhsmmp", imageIndex: 0, title: "Brand New 2-Bedroom Modern Villa for Sale, Leasehold" }, // Kerobokan
      { id: "cmu7t8u2i0006jv04opg80osf", imageIndex: 0, title: "Stylish 2-Bedroom Turnkey Villa for Sale" }, // Uluwatu, Bingin
      { id: "cmu7t98h0000kjv04e6c6kiqj", imageIndex: 0, title: "Brand New 1-Bedroom Villa for Sale, Leasehold" }, // Uluwatu, Balangan
      { id: "cmu7t99f6000ljv04oup9ug9g", imageIndex: 0, title: "Modern 1-Bedroom Pool Villa for Sale, Leasehold" }, // Ungasan — blurred
      { id: "cmu7t8xa60009jv04dhrqzf37", imageIndex: 0, title: "2-Bedroom Villa for Sale, Coastal Luxury" }, // Jimbaran — blurred, last
    ],
  },
};

export async function getMarketShowcase(market: Market): Promise<{
  highlight: HighlightItem[];
  rent: ShowcaseItem[];
  sale: ShowcaseItem[];
}> {
  const config = MARKET_SHOWCASES[market];
  const ids = [...config.highlight, ...config.rent, ...config.sale].map((e) => e.id);
  const rows = await prisma.listing.findMany({
    where: { id: { in: ids }, status: "active" },
  });
  const byId = new Map(rows.map((r) => [r.id, r]));

  const pinnedImage = (id: string, imageIndex: number) => {
    const row = byId.get(id);
    if (!row) return null;
    const images = parseJsonArray(row.images);
    const image = images[imageIndex] ?? images[0];
    return image ? { row, image } : null;
  };

  const showcase = (entries: ShowcaseEntry[]): ShowcaseItem[] =>
    entries
      .map(({ id, imageIndex, title }) => {
        const found = pinnedImage(id, imageIndex);
        if (!found) return null;
        return {
          ...toFullListing(found.row),
          ...countryOf(found.row.province),
          images: [found.image],
          title,
        };
      })
      .filter((r): r is ShowcaseItem => !!r);

  return {
    highlight: config.highlight
      .map(({ id, imageIndex }) => {
        const found = pinnedImage(id, imageIndex);
        return found ? { id, image: found.image } : null;
      })
      .filter((x): x is HighlightItem => !!x),
    rent: showcase(config.rent),
    sale: showcase(config.sale),
  };
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
