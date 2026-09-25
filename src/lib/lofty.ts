const LOFTY_BASE = "https://www.lofty.ai";
const REVALIDATE_SECONDS = 6 * 60 * 60;
const USER_AGENT = "PalaisHorizon/1.0 (+https://www.palais-horizon.com)";
// Guards against a mis-read page, not against high yields: those are shown.
const MAX_PLAUSIBLE_YIELD_PCT = 50;
// Only properties yielding more than this are shown.
const MIN_YIELD_PCT = 7;
const MAX_PHOTOS = 3;

/**
 * Hand-picked Lofty properties (their public /property_deal/<slug> pages) that
 * show a current yield above 7% and are tagged "Cash Flowing". Every entry is
 * re-read live (cached for a few hours): one that disappears, or stops paying
 * rent, drops out of the list on its own. Most attractive properties first.
 */
const CURATED_SLUGS = [
  "605-Squires-Row_San-Antonio-TX-78213",
  "2208-Murray-Ave_Atlantic-City-NJ-08401",
  "222-57th-St_Pittsburgh-PA-15201",
  "2221-E-Chase-St_Baltimore-MD-21213",
  "581-San-Francisco-St_Las-Cruces-NM-88001",
  "999-Canyon-Rd_Ogden-UT-84404",
  "1415-Race-St_Cincinnati-OH-45202",
  "10828-Pluton-St_Norwalk-CA-90650",
  "4506-S-Fallwood-Ct_Columbia-MO-65203",
  "1411-Clarke-Ave-SW_Roanoke-VA-24016",
  "9901-E-Evans-Ave-Unit-4C_Aurora-CO-80247",
  "1677-Walker-Ave_Memphis-TN-38114",
  "723-12th-St_Moline-IL-61265",
  "39-Fleetwood-Dr_Palm-Coast-FL-32137",
  "14720-Ohio-Ave_Cleveland-OH-44128",
  "217-W-Stone-St_Gibsonburg-OH-43431",
  "8848-N-95th-St-K_Milwaukee-WI-53224",
];

export type LoftyKind = "vacation" | "single" | "multi" | "commercial" | "other";

export type LoftyProperty = {
  url: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  kind: LoftyKind;
  sharePriceUsd: number;
  currentYieldPct: number;
  /** Number of investors already in the property, when it could be read. */
  investors: number | null;
  photos: string[];
};

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ");
}

function kindOf(label: string | undefined): LoftyKind {
  if (!label) return "other";
  if (/vacation rental/i.test(label)) return "vacation";
  if (/multi family/i.test(label)) return "multi";
  if (/single family/i.test(label)) return "single";
  if (/commercial/i.test(label)) return "commercial";
  return "other";
}

// slug: "<street-words>_<City-Words>-<ST>-<ZIP>"
function addressOf(slug: string) {
  const [street, rest = ""] = slug.split("_");
  const parts = rest.split("-");
  return {
    street: street.replace(/-/g, " "),
    city: parts.slice(0, -2).join(" "),
    state: parts[parts.length - 2] ?? "",
    zip: parts[parts.length - 1] ?? "",
  };
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The marketplace page embeds its property list as serialized data where each
 * property's id is followed by its investor count. The count is only trusted
 * when that id is one of the ids in the property's own photo URLs.
 */
function investorsFor(marketHtml: string | null, slug: string, folderIds: Set<string>): number | null {
  if (!marketHtml) return null;
  const match = marketHtml.match(
    new RegExp(
      `\\\\"${escapeRegExp(slug)}\\\\",[\\s\\S]{0,900}?\\\\"([0-9A-Z]{26})\\\\",(\\d{1,5}),\\\\"https://images`,
    ),
  );
  return match && folderIds.has(match[1]) ? Number(match[2]) : null;
}

async function readProperty(slug: string, marketHtml: string | null): Promise<LoftyProperty | null> {
  const url = `${LOFTY_BASE}/property_deal/${slug}`;
  const html = await fetchText(url);
  if (!html) return null;
  const text = stripHtml(html);

  const price = Number(text.match(/Share price \$([\d.]+)/)?.[1]);
  const currentYield = Number(text.match(/Current yield ([\d.]+)%/)?.[1]);
  if (!(price > 0) || !(currentYield > MIN_YIELD_PCT) || currentYield > MAX_PLAUSIBLE_YIELD_PCT) return null;

  const images = [
    ...new Set(
      [...html.matchAll(/https:\/\/images\.lofty\.ai\/images\/([A-Z0-9]+)\/[^"'\\ ]+\.webp/g)].map(
        (m) => m[0],
      ),
    ),
  ];
  const photos = images.filter((u) => !u.endsWith("/thumb.webp")).slice(0, MAX_PHOTOS);
  if (photos.length === 0) return null;
  const folderIds = new Set(images.map((u) => u.match(/\/images\/([A-Z0-9]+)\//)?.[1] ?? ""));

  return {
    url,
    ...addressOf(slug),
    kind: kindOf(text.match(/[A-Z]{2} \d{5} ([A-Za-z ]+?) 1D/)?.[1]),
    sharePriceUsd: price,
    currentYieldPct: currentYield,
    investors: investorsFor(marketHtml, slug, folderIds),
    photos,
  };
}

export async function getLoftyProperties(): Promise<LoftyProperty[]> {
  const marketHtml = await fetchText(`${LOFTY_BASE}/marketplace`);
  const all = await Promise.all(CURATED_SLUGS.map((slug) => readProperty(slug, marketHtml)));
  return all.filter((p): p is LoftyProperty => p !== null);
}
