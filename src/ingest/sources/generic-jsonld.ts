import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  extractJsonLd,
  metaTag,
  type RawListing,
  type SourceAdapter,
} from "./base";

/**
 * Generic adapter: give it a list of listing detail URLs (one per line in
 * src/ingest/sources/urls.txt, or the INGEST_URLS env var) and it extracts
 * schema.org JSON-LD (falling back to Open Graph tags).
 *
 * Works on any site that embeds RealEstateListing / Residence / Product / Offer
 * structured data and does not block plain server-side fetches.
 */

const URLS_FILE = join(process.cwd(), "src/ingest/sources/urls.txt");

function loadUrls(): string[] {
  const fromEnv = (process.env.INGEST_URLS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const fromFile = existsSync(URLS_FILE)
    ? readFileSync(URLS_FILE, "utf8")
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s && !s.startsWith("#"))
    : [];
  return [...new Set([...fromEnv, ...fromFile])];
}

function num(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }
  return undefined;
}

function firstOf<T>(...vals: (T | undefined | null)[]): T | undefined {
  for (const v of vals) if (v != null && v !== "") return v as T;
  return undefined;
}

/** Units per 1 USD — indicative only, for converting a source price into
 * our internal THB-equivalent unit. THB itself needs no conversion. */
const UNITS_PER_USD: Record<string, number> = {
  USD: 1,
  THB: 34.5,
  IDR: 15800,
  AED: 3.67,
};

/** Converts a price in `currency` into THB-equivalent (our storage unit). */
function toThbEquivalent(price: number, currency: string | undefined): number {
  const cur = (currency || "THB").toUpperCase();
  if (cur === "THB") return Math.round(price);
  const rate = UNITS_PER_USD[cur];
  if (!rate) return Math.round(price); // unrecognised currency: pass through
  return Math.round((price / rate) * UNITS_PER_USD.THB);
}

type LdNode = Record<string, unknown>;

// Ordered by preference, not document order: a listing-specific node (with
// its own address/offer) beats a generic "Product" wrapper some sites emit
// alongside it for shopping-feed SEO.
const REAL_ESTATE_TYPE_PRIORITY = [
  "RealEstateListing",
  "Residence",
  "SingleFamilyResidence",
  "House",
  "Apartment",
  "Accommodation",
  "Place",
  "Product",
];

function nodeTypes(node: LdNode): string[] {
  const t = node["@type"];
  return Array.isArray(t) ? t.map(String) : [String(t)];
}

function pickRealEstateNode(nodes: unknown[]): LdNode | null {
  const candidates = nodes.filter(
    (n): n is LdNode => !!n && typeof n === "object",
  );
  for (const wanted of REAL_ESTATE_TYPE_PRIORITY) {
    const match = candidates.find((n) => nodeTypes(n).includes(wanted));
    if (match) return match;
  }
  return null;
}

/** Some sites nest the real address under `mainEntity` (e.g. a
 * RealEstateListing wrapping a Residence). Check both spots. */
function pickAddress(node: LdNode, allNodes: unknown[]): LdNode {
  const direct = node["address"] as LdNode | undefined;
  if (direct && typeof direct === "object") return direct;
  const mainEntity = node["mainEntity"] as LdNode | undefined;
  const nested = mainEntity?.["address"] as LdNode | undefined;
  if (nested && typeof nested === "object") return nested;
  // Last resort: any other node in the document that has an address.
  for (const n of allNodes) {
    if (!n || typeof n !== "object") continue;
    const addr = (n as LdNode)["address"];
    if (addr && typeof addr === "object") return addr as LdNode;
  }
  return {};
}

function slugFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    return (parts[parts.length - 1] || u.hostname).slice(0, 120);
  } catch {
    return url.slice(-120);
  }
}

export function parseJsonLdListing(url: string, html: string): RawListing | null {
  const nodes = extractJsonLd(html);
  const node = pickRealEstateNode(nodes);

  const ogTitle = metaTag(html, "og:title") ?? metaTag(html, "twitter:title");
  const ogDesc =
    metaTag(html, "og:description") ?? metaTag(html, "description");
  const ogImage = metaTag(html, "og:image");
  const siteName = metaTag(html, "og:site_name");

  if (!node && !ogTitle) return null;

  const offers = (node?.["offers"] ?? {}) as LdNode;
  const address = node ? pickAddress(node, nodes) : {};
  const geo = (node?.["geo"] ?? {}) as LdNode;

  const price = firstOf(
    num(offers["price"]),
    num((offers["priceSpecification"] as LdNode)?.["price"]),
  );
  const currency = firstOf(
    offers["priceCurrency"] as string,
    (offers["priceSpecification"] as LdNode)?.["priceCurrency"] as string,
  );

  const images: string[] = [];
  const nodeImage = node?.["image"];
  if (typeof nodeImage === "string") images.push(nodeImage);
  else if (Array.isArray(nodeImage))
    images.push(...nodeImage.map((x) => (typeof x === "string" ? x : (x as LdNode)?.["url"])).filter(Boolean) as string[]);
  if (ogImage && !images.includes(ogImage)) images.unshift(ogImage);

  const title = firstOf(node?.["name"] as string, ogTitle) ?? slugFromUrl(url);
  const host = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return "source";
    }
  })();

  return {
    externalId: slugFromUrl(url),
    sourceUrl: url,
    agencyName: firstOf(siteName, host) ?? host,
    agencyUrl: url,
    title,
    description: firstOf(node?.["description"] as string, ogDesc),
    propertyType: firstOf(
      Array.isArray(node?.["@type"])
        ? (node?.["@type"] as string[]).join(" ")
        : (node?.["@type"] as string),
      title,
    ),
    // The URL path is the reliable signal (e.g. "/for-sale/" vs "/for-rent/");
    // a page can mention "rental" in passing (e.g. "also available for
    // monthly rental") without the fetched price being a rent.
    listingType: /\/for-rent\/|\/rent\//i.test(url)
      ? "rent"
      : /\/for-sale\/|\/sale\//i.test(url)
        ? "sale"
        : /rent|rental|per month|\/month/i.test(html)
          ? "rent"
          : "sale",
    priceAmount: price != null ? toThbEquivalent(price, currency) : undefined,
    priceCurrency: "THB",
    bedrooms: num(
      firstOf(node?.["numberOfBedrooms"], node?.["numberOfRooms"]),
    ),
    bathrooms: num(node?.["numberOfBathroomsTotal"] ?? node?.["numberOfBathrooms"]),
    areaSqm: num(
      (node?.["floorSize"] as LdNode)?.["value"] ?? node?.["floorSize"],
    ),
    province: address["addressRegion"] as string | undefined,
    city: firstOf(
      address["addressLocality"] as string,
      address["addressRegion"] as string,
    ),
    addressText: firstOf(
      address["streetAddress"] as string,
      [address["addressLocality"], address["addressRegion"]]
        .filter(Boolean)
        .join(", ") || undefined,
    ),
    lat: num(geo["latitude"]),
    lng: num(geo["longitude"]),
    images,
    amenities: Array.isArray(node?.["amenityFeature"])
      ? (node?.["amenityFeature"] as LdNode[])
          .map((a) => a?.["name"])
          .filter(Boolean)
          .map(String)
      : [],
  };
}

const adapter: SourceAdapter = {
  name: "generic-jsonld",
  enabled: true,
  listUrls: async () => loadUrls(),
  parse: parseJsonLdListing,
};

export default adapter;
