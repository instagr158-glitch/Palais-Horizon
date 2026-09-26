/**
 * Live Paris rental listings, read from a national agency network's public pages
 * (robots.txt allows /annonces/location-appartement/v-paris/ and the detail pages).
 * Nothing is stored or invented: a listing that disappears, loses its photo, or
 * falls outside the rent bounds simply drops out on the next refresh.
 */

const ORIGIN = "https://www.century21.fr";
const LIST_PATH = "/annonces/location-appartement/v-paris/";
const REVALIDATE_SECONDS = 6 * 60 * 60;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";
const MAX_PAGES = 6;
const CONCURRENCY = 10;
const MAX_PHOTOS = 4;

/** Monthly rent bounds (EUR, charges included). Most listings sit in the lower band. */
export const MIN_RENT_EUR = 800;
export const MAX_RENT_EUR = 5000;
/** Up to this rent a listing is "standard"; above it, "premium". */
export const STANDARD_MAX_EUR = 2000;
const MAX_PREMIUM = 8;

export type ParisListing = {
  url: string;
  id: string;
  title: string;
  zip: string;
  arrondissement: number;
  rooms: number | null;
  areaSqm: number | null;
  rentEur: number;
  pricePerSqm: number | null;
  furnished: boolean;
  photos: string[];
};

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
  "&euro;": "€",
  "&agrave;": "à",
  "&egrave;": "è",
  "&eacute;": "é",
  "&ecirc;": "ê",
  "&ocirc;": "ô",
  "&ccedil;": "ç",
  "&thinsp;": " ",
};

function decode(text: string): string {
  return text.replace(/&#?\w+;/g, (m) => ENTITIES[m] ?? m);
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, "Accept-Language": "fr-FR,fr;q=0.9" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

function meta(html: string, prop: string): string | undefined {
  const m = html.match(new RegExp(`property="${prop}"\\s+content="([^"]*)"`));
  return m ? decode(m[1]) : undefined;
}

export function parseDetail(url: string, html: string): ParisListing | null {
  const id = url.match(/detail\/(\d+)/)?.[1];
  const ogTitle = meta(html, "og:title");
  if (!id || !ogTitle) return null;

  const zip = ogTitle.match(/\b(75\d{3})\b/)?.[1];
  if (!zip) return null; // Paris intra-muros only
  const arrondissement = Number(zip.slice(3));
  if (arrondissement < 1 || arrondissement > 20) return null;

  const text = decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ");
  const priceText = text.match(/Ref\s*:\s*\w+\s+([\d ]+?)\s*€\s*par mois/)?.[1];
  const rentEur = priceText ? Number(priceText.replace(/\s/g, "")) : NaN;
  if (!Number.isFinite(rentEur) || rentEur < MIN_RENT_EUR || rentEur > MAX_RENT_EUR) return null;

  const areaRaw = ogTitle.match(/([\d]+(?:,\d+)?)\s*m2/)?.[1];
  const areaSqm = areaRaw ? Math.round(Number(areaRaw.replace(",", "."))) : null;
  const rooms = Number(ogTitle.match(/(\d+)\s*pièces?/)?.[1]) || null;

  const seen = new Set<string>();
  const photos: string[] = [];
  for (const m of html.matchAll(/imagesBien\/s3\/[\w/]+_8_([A-F0-9-]+)\.jpg/g)) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);
    photos.push(`${ORIGIN}/${m[0]}`);
    if (photos.length === MAX_PHOTOS) break;
  }
  if (photos.length === 0) return null;

  const description = meta(html, "og:description") ?? "";
  const furnished = /meublé/i.test(ogTitle) || (/meublé/i.test(description) && !/non[- ]meublé/i.test(description));

  return {
    url,
    id,
    title: ogTitle.split(" - ")[0].replace(/ à louer/, "").trim(),
    zip,
    arrondissement,
    rooms,
    areaSqm,
    rentEur,
    pricePerSqm: areaSqm ? Math.round((rentEur / areaSqm) * 10) / 10 : null,
    furnished,
    photos,
  };
}

async function detailUrls(): Promise<string[]> {
  const urls = new Set<string>();
  for (let page = 1; page <= MAX_PAGES; page++) {
    const html = await fetchText(`${ORIGIN}${LIST_PATH}${page > 1 ? `page-${page}/` : ""}`);
    if (!html) break;
    const before = urls.size;
    for (const m of html.matchAll(/href="(\/trouver_logement\/detail\/\d+\/)"/g)) urls.add(`${ORIGIN}${m[1]}`);
    if (urls.size === before) break;
  }
  return [...urls];
}

/** Paris apartments to rent between MIN_RENT_EUR and MAX_RENT_EUR, cheapest first. */
export async function getParisListings(): Promise<ParisListing[]> {
  const urls = await detailUrls();
  const out: ParisListing[] = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const parsed = await Promise.all(
      batch.map(async (u) => {
        const html = await fetchText(u);
        return html ? parseDetail(u, html) : null;
      }),
    );
    for (const p of parsed) if (p) out.push(p);
  }
  // The catalogue is mostly standard rents; only a few high-end ones (best price per m² first).
  const standard = out.filter((l) => l.rentEur <= STANDARD_MAX_EUR);
  const premium = out
    .filter((l) => l.rentEur > STANDARD_MAX_EUR)
    .sort((a, b) => (a.pricePerSqm ?? Infinity) - (b.pricePerSqm ?? Infinity))
    .slice(0, MAX_PREMIUM);
  return [...standard, ...premium].sort((a, b) => a.rentEur - b.rentEur);
}
