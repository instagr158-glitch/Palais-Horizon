import type { RawListing } from "./sources/base";

/** Price floors (THB) below which we don't consider it "luxury". */
const SALE_FLOOR = 15_000_000;
const RENT_FLOOR = 120_000; // per month

const LUXURY_KEYWORDS = [
  "villa",
  "penthouse",
  "pool",
  "infinity",
  "sea view",
  "ocean view",
  "beachfront",
  "oceanfront",
  "private",
  "estate",
  "mansion",
  "luxury",
  "designer",
  "branded residence",
];

export type LuxuryVerdict = {
  keep: boolean;
  score: number;
  reason?: string;
};

export function assessLuxury(l: RawListing): LuxuryVerdict {
  const isRent = (l.listingType ?? "sale") === "rent";
  const floor = isRent ? RENT_FLOOR : SALE_FLOOR;
  const text = `${l.title} ${l.description ?? ""} ${(l.amenities ?? []).join(" ")}`
    .toLowerCase();

  let score = 0;
  if (l.priceAmount) score += Math.min(60, Math.round(l.priceAmount / (floor / 10)));
  for (const kw of LUXURY_KEYWORDS) if (text.includes(kw)) score += 5;
  if ((l.bedrooms ?? 0) >= 4) score += 5;
  if ((l.areaSqm ?? 0) >= 300) score += 5;
  score = Math.min(100, score);

  // Hard reject: a known price that is clearly below the luxury floor.
  if (l.priceAmount && l.priceAmount < floor) {
    return { keep: false, score, reason: `below ${isRent ? "rent" : "sale"} floor` };
  }
  // Unknown price but no luxury signals at all → skip.
  if (!l.priceAmount && score < 20) {
    return { keep: false, score, reason: "no price and weak luxury signals" };
  }
  return { keep: true, score };
}
