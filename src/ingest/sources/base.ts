/**
 * A source adapter turns one website / feed into normalised listings.
 * Add a new source = add a file that default-exports a SourceAdapter and
 * register it in ./index.ts.
 */

export type RawListing = {
  /** stable id within this source (slug, listing code, hashed URL…) */
  externalId: string;
  sourceUrl: string;
  agencyName: string;
  agencyUrl: string;

  title: string;
  description?: string;
  propertyType?: string; // free text, normalised later
  listingType?: string; // "sale" | "rent"

  priceAmount?: number; // THB
  priceCurrency?: string;

  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  landSqm?: number;

  province?: string;
  city?: string;
  district?: string;
  addressText?: string;
  lat?: number;
  lng?: number;

  images?: string[];
  amenities?: string[];
  furnished?: boolean;
};

export type SourceAdapter = {
  /** unique, stable name — becomes the `source` column prefix */
  name: string;
  /** whether to run this adapter in `npm run ingest` */
  enabled: boolean;
  /** discover the listing detail URLs to fetch */
  listUrls: () => Promise<string[]>;
  /** parse one fetched page into a RawListing (or null to skip) */
  parse: (url: string, html: string) => RawListing | null;
};

export async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; PalaisHorizonBot/1.0; +https://palaishorizon.com/about)",
        accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      console.warn(`  ! ${res.status} ${url}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.warn(`  ! fetch failed ${url}:`, (err as Error).message);
    return null;
  }
}

/** Pull every JSON-LD block from an HTML string. */
export function extractJsonLd(html: string): unknown[] {
  const out: unknown[] = [];
  const re =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const parsed = JSON.parse(m[1].trim());
      if (Array.isArray(parsed)) out.push(...parsed);
      else out.push(parsed);
    } catch {
      /* ignore malformed block */
    }
  }
  return out;
}

/** Pull an Open Graph / meta tag value. */
export function metaTag(html: string, property: string): string | undefined {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
      "i",
    ),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return m[1];
  }
  return undefined;
}
