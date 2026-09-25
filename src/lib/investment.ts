import { prisma } from "@/lib/db";
import { toFullListing } from "@/lib/listings";

export type Confidence = "high" | "medium" | "low";
export type CompBasis = "building" | "zip";

export type InvestmentItem = {
  id: string;
  image: string;
  title: string;
  neighborhood: string;
  zip: string;
  priceUsd: number;
  bedrooms: number;
  bathrooms: number | null;
  areaSqm: number | null;
  sourceUrl: string;
  estRentUsd: number;
  rentMinUsd: number;
  rentMaxUsd: number;
  compCount: number;
  basis: CompBasis;
  /** What the comparables were matched on: the building/neighbourhood name or the ZIP. */
  basisPlace: string;
  yieldPct: number;
  yieldMinPct: number;
  yieldMaxPct: number;
  confidence: Confidence;
  pricePerSqm: number | null;
  /** Price per m² relative to the catalogue median, in percent (negative = cheaper). */
  pricePerSqmVsMedianPct: number | null;
};

export type InvestmentCatalogue = {
  items: InvestmentItem[];
  medianYieldPct: number | null;
};

// Central Miami / Miami Beach ZIP codes — the apartment towers where a
// short-term-rental investment makes sense. Suburban houses are left out.
const CORE_ZIPS = new Set([
  "33127", "33128", "33129", "33130", "33131", "33132", "33133",
  "33137", "33138", "33139", "33140", "33141",
]);

const MIN_COMPARABLES = 3;
// A gross yield above this is far more likely a data quirk than an opportunity.
const MAX_PLAUSIBLE_YIELD_PCT = 12;

function zipOf(text: string): string | null {
  return text.match(/FL (\d{5})/)?.[1] ?? null;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length / 2;
  return sorted.length % 2 ? sorted[Math.floor(mid)] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function confidenceOf(count: number, min: number, max: number): Confidence {
  const spread = max / min;
  if (count >= 5 && spread <= 1.5) return "high";
  if (count >= 3 && spread <= 2) return "medium";
  return "low";
}

/**
 * Real, currently-listed Miami apartments for sale, each with a gross rental
 * yield estimated from the asking rents of comparable listings in our own
 * catalogue (same bedroom count, same building/neighbourhood, else same ZIP).
 * Ranked by estimated yield, highest first. Estimates rest on asking rents,
 * not realised income, and say nothing about short-term (Airbnb) revenue.
 */
export async function getInvestmentCatalogue(): Promise<InvestmentCatalogue> {
  const [sales, rents] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "active", province: "Miami", listingType: "sale", priceUsd: { not: null } },
    }),
    prisma.listing.findMany({
      where: {
        status: "active",
        province: "Miami",
        listingType: "rent",
        priceUsd: { not: null },
        bedrooms: { not: null },
      },
      select: { title: true, city: true, bedrooms: true, priceUsd: true },
    }),
  ]);

  const rentComps = rents.map((r) => ({
    city: r.city,
    zip: zipOf(r.title),
    bedrooms: r.bedrooms as number,
    rent: r.priceUsd as number,
  }));

  const drafts: Omit<InvestmentItem, "pricePerSqmVsMedianPct">[] = [];
  for (const row of sales) {
    const zip = zipOf(row.title);
    if (!zip || !CORE_ZIPS.has(zip) || row.bedrooms == null || !row.priceUsd) continue;

    const sameBuilding = rentComps.filter((c) => c.city === row.city && c.bedrooms === row.bedrooms);
    const sameZip = rentComps.filter((c) => c.zip === zip && c.bedrooms === row.bedrooms);
    const basis: CompBasis | null =
      sameBuilding.length >= MIN_COMPARABLES ? "building" : sameZip.length >= MIN_COMPARABLES ? "zip" : null;
    if (!basis) continue;

    const comps = basis === "building" ? sameBuilding : sameZip;
    const rentsUsd = comps.map((c) => c.rent);
    const estRent = median(rentsUsd);
    const rentMin = Math.min(...rentsUsd);
    const rentMax = Math.max(...rentsUsd);
    const toYield = (monthly: number) => ((monthly * 12) / row.priceUsd!) * 100;
    if (toYield(estRent) > MAX_PLAUSIBLE_YIELD_PCT) continue;

    const images = toFullListing(row).images;
    const image = images.find((u) => u.endsWith("/origin.jpg")) ?? images[0];
    if (!image) continue;

    drafts.push({
      id: row.id,
      image,
      title: row.title,
      neighborhood: row.city,
      zip,
      priceUsd: row.priceUsd,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      areaSqm: row.areaSqm,
      sourceUrl: row.sourceUrl,
      estRentUsd: estRent,
      rentMinUsd: rentMin,
      rentMaxUsd: rentMax,
      compCount: comps.length,
      basis,
      basisPlace: basis === "building" ? row.city : zip,
      yieldPct: toYield(estRent),
      yieldMinPct: toYield(rentMin),
      yieldMaxPct: toYield(rentMax),
      confidence: confidenceOf(comps.length, rentMin, rentMax),
      pricePerSqm: row.areaSqm ? row.priceUsd / row.areaSqm : null,
    });
  }

  const pricesPerSqm = drafts.flatMap((d) => (d.pricePerSqm != null ? [d.pricePerSqm] : []));
  const medianPricePerSqm = pricesPerSqm.length ? median(pricesPerSqm) : null;

  const items = drafts
    .map((d) => ({
      ...d,
      pricePerSqmVsMedianPct:
        d.pricePerSqm != null && medianPricePerSqm
          ? (d.pricePerSqm / medianPricePerSqm - 1) * 100
          : null,
    }))
    .sort((a, b) => b.yieldPct - a.yieldPct);

  return {
    items,
    medianYieldPct: items.length ? median(items.map((i) => i.yieldPct)) : null,
  };
}
