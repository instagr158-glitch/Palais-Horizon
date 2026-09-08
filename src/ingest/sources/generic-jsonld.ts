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

type LdNode = Record<string, unknown>;

function pickRealEstateNode(nodes: unknown[]): LdNode | null {
  const wanted = [
    "RealEstateListing",
    "Residence",
    "SingleFamilyResidence",
    "House",
    "Apartment",
    "Product",
    "Accommodation",
    "Place",
  ];
  for (const n of nodes) {
    if (!n || typeof n !== "object") continue;
    const node = n as LdNode;
    const t = node["@type"];
    const types = Array.isArray(t) ? t.map(String) : [String(t)];
    if (types.some((x) => wanted.includes(x))) return node;
  }
  return null;
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
  const address = (node?.["address"] ?? {}) as LdNode;
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
    listingType: /rent|rental|per month|\/month/i.test(html) ? "rent" : "sale",
    priceAmount:
      currency && currency.toUpperCase() !== "THB" && price
        ? Math.round(price * (currency.toUpperCase() === "USD" ? 34.5 : 1))
        : price,
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
