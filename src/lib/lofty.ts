const LOFTY_BASE = "https://www.lofty.ai";
const REVALIDATE_SECONDS = 6 * 60 * 60;
// A displayed "current yield" above this is far more likely a temporary spike
// than a lasting return, so such properties are left out.
const MAX_PLAUSIBLE_YIELD_PCT = 12;

/**
 * Hand-picked Lofty properties (their public /property_deal/<slug> pages),
 * chosen because they showed a positive, plausible current yield, are tagged
 * "Cash Flowing" and carry no seller-buyback structure. Every entry is
 * re-read live (cached for a few hours): one that disappears, or stops paying
 * rent, drops out of the list on its own. Airbnb-style vacation rentals first.
 */
const CURATED_SLUGS = [
  "222-57th-St_Pittsburgh-PA-15201",
  "2208-Murray-Ave_Atlantic-City-NJ-08401",
  "1415-Race-St_Cincinnati-OH-45202",
  "217-W-Stone-St_Gibsonburg-OH-43431",
  "8848-N-95th-St-K_Milwaukee-WI-53224",
  "9901-E-Evans-Ave-Unit-4C_Aurora-CO-80247",
  "1411-Clarke-Ave-SW_Roanoke-VA-24016",
  "1677-Walker-Ave_Memphis-TN-38114",
];

export type LoftyKind = "vacation" | "single" | "multi" | "commercial" | "other";

export type LoftyProperty = {
  url: string;
  street: string;
  city: string;
  state: string;
  kind: LoftyKind;
  sharePriceUsd: number;
  currentYieldPct: number;
  image: string;
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
  const state = parts[parts.length - 2] ?? "";
  const city = parts.slice(0, -2).join(" ");
  return { street: street.replace(/-/g, " "), city, state };
}

async function readProperty(slug: string): Promise<LoftyProperty | null> {
  try {
    const url = `${LOFTY_BASE}/property_deal/${slug}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "PalaisHorizon/1.0 (+https://www.palais-horizon.com)" },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const text = stripHtml(html);

    const price = Number(text.match(/Share price \$([\d.]+)/)?.[1]);
    const currentYield = Number(text.match(/Current yield ([\d.]+)%/)?.[1]);
    if (!(price > 0) || !(currentYield > 0) || currentYield > MAX_PLAUSIBLE_YIELD_PCT) return null;

    const images = [
      ...new Set(
        [...html.matchAll(/https:\/\/images\.lofty\.ai\/images\/[A-Z0-9]+\/[^"'\\ ]+\.webp/g)].map(
          (m) => m[0],
        ),
      ),
    ];
    const image = images.find((u) => !u.endsWith("/thumb.webp")) ?? images[0];
    if (!image) return null;

    return {
      url,
      ...addressOf(slug),
      kind: kindOf(text.match(/[A-Z]{2} \d{5} ([A-Za-z ]+?) 1D/)?.[1]),
      sharePriceUsd: price,
      currentYieldPct: currentYield,
      image,
    };
  } catch {
    return null;
  }
}

export async function getLoftyProperties(): Promise<LoftyProperty[]> {
  const all = await Promise.all(CURATED_SLUGS.map(readProperty));
  return all.filter((p): p is LoftyProperty => p !== null);
}
