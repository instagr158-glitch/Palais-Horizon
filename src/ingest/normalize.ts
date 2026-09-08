import type { RawListing } from "./sources/base";

const TYPE_MAP: Record<string, string> = {
  villa: "villa",
  house: "house",
  "detached house": "house",
  home: "house",
  penthouse: "penthouse",
  apartment: "condo",
  condo: "condo",
  condominium: "condo",
  flat: "condo",
  land: "land",
  plot: "land",
};

const PROVINCE_HINTS: [RegExp, string][] = [
  [/phuket/i, "Phuket"],
  [/samui|surat thani|koh phangan|koh tao/i, "Surat Thani"],
  [/bangkok|krung thep/i, "Bangkok"],
  [/pattaya|chonburi|jomtien/i, "Chonburi"],
  [/hua hin|prachuap/i, "Prachuap Khiri Khan"],
  [/chiang mai/i, "Chiang Mai"],
];

export function normalizeType(input?: string): string {
  const t = (input ?? "").toLowerCase().trim();
  for (const [k, v] of Object.entries(TYPE_MAP)) {
    if (t.includes(k)) return v;
  }
  return "villa";
}

export function guessProvince(l: RawListing): string {
  if (l.province) return l.province;
  const hay = `${l.addressText ?? ""} ${l.city ?? ""} ${l.district ?? ""} ${l.title}`;
  for (const [re, name] of PROVINCE_HINTS) if (re.test(hay)) return name;
  return "Phuket";
}

/** THB per USD — indicative only, for display. */
const THB_PER_USD = 34.5;

export type NormalizedListing = {
  source: string;
  externalId: string;
  sourceUrl: string;
  agencyName: string;
  agencyUrl: string;
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
  images: string;
  amenities: string;
  furnished: boolean;
};

export function normalize(
  raw: RawListing,
  sourceName: string,
  luxuryScoreHint = 0,
): NormalizedListing & { luxuryScore: number } {
  const province = guessProvince(raw);
  const priceAmount = raw.priceAmount ?? null;
  return {
    source: sourceName,
    externalId: raw.externalId,
    sourceUrl: raw.sourceUrl,
    agencyName: raw.agencyName || sourceName,
    agencyUrl: raw.agencyUrl || raw.sourceUrl,
    title: raw.title.trim().slice(0, 200),
    description: (raw.description ?? "").trim().slice(0, 4000),
    propertyType: normalizeType(raw.propertyType),
    listingType: raw.listingType === "rent" ? "rent" : "sale",
    priceAmount,
    priceCurrency: raw.priceCurrency ?? "THB",
    priceUsd: priceAmount ? Math.round(priceAmount / THB_PER_USD) : null,
    bedrooms: raw.bedrooms ?? null,
    bathrooms: raw.bathrooms ?? null,
    areaSqm: raw.areaSqm ?? null,
    landSqm: raw.landSqm ?? null,
    province,
    city: raw.city ?? province,
    district: raw.district ?? null,
    addressText: raw.addressText ?? `${raw.city ?? province}, ${province}`,
    lat: raw.lat ?? null,
    lng: raw.lng ?? null,
    images: JSON.stringify((raw.images ?? []).filter(Boolean).slice(0, 12)),
    amenities: JSON.stringify((raw.amenities ?? []).filter(Boolean).slice(0, 30)),
    furnished: raw.furnished ?? false,
    luxuryScore: luxuryScoreHint,
  };
}
