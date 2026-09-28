/**
 * Second live source of Paris rentals, read from a national listings portal's
 * public pages (robots.txt: "Allow: /"). Fills in the lower end of the
 * catalogue (studios and small apartments) that the first agency has fewer of.
 * Nothing is stored or invented: a listing that disappears or loses its photo
 * simply drops out on the next refresh.
 */

const ORIGIN = "https://www.superimmo.com";
const REVALIDATE_SECONDS = 24 * 60 * 60;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";
const CONCURRENCY = 4;
const REQUEST_GAP_MS = 250;
const MAX_PHOTOS = 4;
const REQUEST_TIMEOUT_MS = 3000;
// Hard ceiling on the whole crawl so a slow or rate-limited run never blocks
// the home page: whatever hasn't been fetched by then is simply left out
// until the next 6-hour refresh, rather than stalling the page for minutes.
const DEADLINE_MS = 6000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const MIN_RENT_EUR = 500;
export const MAX_RENT_EUR = 1500;

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
};

function decode(text: string): string {
  return text.replace(/&#?\w+;/g, (m) => ENTITIES[m] ?? m);
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, "Accept-Language": "fr-FR,fr;q=0.9" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    // The site rate-limits bursts of requests with a 429 that can stay in
    // effect for a while — retrying/backing off here would block the whole
    // home page for minutes. Fail fast instead: this source simply
    // contributes fewer (or zero) listings until the next 6-hour refresh.
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

function meta(html: string, prop: string): string | undefined {
  const m = html.match(new RegExp(`property="${prop}"\\s+content="([^"]*)"`));
  return m ? decode(m[1]) : undefined;
}

// Paris' 20 districts, e.g. "paris-1er-75001", "paris-2eme-75002", …
const DISTRICTS = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  const zip = `750${String(n).padStart(2, "0")}`;
  const slug = n === 1 ? "1er" : `${n}eme`;
  return { zip, path: `/location/appartement/ile-de-france/paris/paris-${slug}-${zip}` };
});

export function parseDetail(url: string, html: string): ParisListing | null {
  const id = url.match(/-(x[a-z0-9]+)$/)?.[1];
  const ogTitle = meta(html, "og:title");
  if (!id || !ogTitle) return null;

  const zip = url.match(/-(75\d{3})-x/)?.[1];
  if (!zip) return null; // Paris intra-muros only
  const arrondissement = Number(zip.slice(3));
  if (arrondissement < 1 || arrondissement > 20) return null;

  const rentText = decode(html).match(/Loyer\s*:\s*([\d.,]+)\s*€\s*CC/)?.[1];
  const rentEur = rentText ? Math.round(Number(rentText.replace(/\./g, "").replace(",", "."))) : NaN;
  if (!Number.isFinite(rentEur) || rentEur < MIN_RENT_EUR || rentEur > MAX_RENT_EUR) return null;

  const areaRaw = ogTitle.match(/([\d]+(?:,\d+)?)\s*m²/)?.[1];
  const areaSqm = areaRaw ? Math.round(Number(areaRaw.replace(",", "."))) : null;
  const rooms = Number(ogTitle.match(/(\d+)\s*pièces?/)?.[1]) || (/studio/i.test(ogTitle) ? 1 : null);

  const seen = new Set<string>();
  const photos: string[] = [];
  for (const m of html.matchAll(/https:\/\/photo\.superimmo\.com\/[a-z0-9]+/g)) {
    if (seen.has(m[0])) continue;
    seen.add(m[0]);
    photos.push(m[0]);
    if (photos.length === MAX_PHOTOS) break;
  }
  if (photos.length === 0) return null;

  const furnished = /non meublé/i.test(html) ? false : /meublé/i.test(html);

  return {
    url,
    id,
    title: rooms === 1 ? "Studio" : `Appartement F${rooms ?? "?"}`,
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

async function detailUrls(deadline: number): Promise<string[]> {
  const urls = new Set<string>();
  for (const d of DISTRICTS) {
    if (Date.now() > deadline) break;
    const html = await fetchText(`${ORIGIN}${d.path}`);
    if (html) {
      for (const m of html.matchAll(/href="(\/annonces\/location-appartement-[^"]+)"/g)) {
        urls.add(`${ORIGIN}${m[1]}`);
      }
    }
    await sleep(REQUEST_GAP_MS);
  }
  return [...urls];
}

/** Paris apartments to rent between MIN_RENT_EUR and MAX_RENT_EUR, cheapest first. */
export async function getSuperimmoParisListings(): Promise<ParisListing[]> {
  const deadline = Date.now() + DEADLINE_MS;
  const urls = await detailUrls(deadline);
  const out: ParisListing[] = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    if (Date.now() > deadline) break;
    const batch = urls.slice(i, i + CONCURRENCY);
    const parsed = await Promise.all(
      batch.map(async (u) => {
        const html = await fetchText(u);
        return html ? parseDetail(u, html) : null;
      }),
    );
    for (const p of parsed) if (p) out.push(p);
    await sleep(REQUEST_GAP_MS);
  }
  return out.sort((a, b) => a.rentEur - b.rentEur);
}
