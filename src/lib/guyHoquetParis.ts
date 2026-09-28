/**
 * Third live source of Paris rentals, read from a national agency franchise's
 * public pages (robots.txt allows /location/annonces-paris-75000 and its
 * detail pages). A small inventory — a few apartments per refresh — but a
 * genuinely different agency network from the other two sources.
 * Nothing is stored or invented: a listing that disappears or loses its
 * photo simply drops out on the next refresh.
 */

const ORIGIN = "https://www.guy-hoquet.com";
const LIST_PATH = "/location/annonces-paris-75000";
const REVALIDATE_SECONDS = 24 * 60 * 60;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";
const MAX_PAGES = 5;
const CONCURRENCY = 5;
const REQUEST_TIMEOUT_MS = 4000;
const DEADLINE_MS = 8000;
const MAX_PHOTOS = 4;

export const MIN_RENT_EUR = 500;
export const MAX_RENT_EUR = 5000;

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

// Paris' 16th arrondissement is sometimes coded 75116 (an administrative
// quirk — two town halls share it) instead of the postal code 75016.
function normalizeZip(zip: string): string {
  return zip === "75116" ? "75016" : zip;
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, "Accept-Language": "fr-FR,fr;q=0.9" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

function meta(html: string, prop: string): string | undefined {
  const m = html.match(new RegExp(`property="${prop}"\\s+content="([^"]*)"`));
  return m ? m[1] : undefined;
}

export function parseDetail(url: string, html: string): ParisListing | null {
  const id = url.match(/-(\d+)$/)?.[1];
  const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (!id || !ld) return null;

  // The embedded JSON-LD has a free-text description with raw, unescaped
  // newlines inside its string literal — technically invalid JSON, so it's
  // read field-by-field with regexes instead of JSON.parse.
  const rentEur = Number(ld.match(/"price"\s*:\s*"?(\d+(?:\.\d+)?)"?/)?.[1]);
  if (!Number.isFinite(rentEur) || rentEur < MIN_RENT_EUR || rentEur > MAX_RENT_EUR) return null;
  const currency = ld.match(/"priceCurrency"\s*:\s*"([^"]+)"/)?.[1];
  if (currency && currency !== "EUR") return null;

  const rawZip = ld.match(/"postalCode"\s*:\s*"(\d{5})"/)?.[1];
  if (!rawZip || !/^75\d{3}$/.test(rawZip)) return null; // Paris intra-muros only
  const zip = normalizeZip(rawZip);
  const arrondissement = Number(zip.slice(3));
  if (arrondissement < 1 || arrondissement > 20) return null;

  const roomsRaw = ld.match(/"numberOfRooms"\s*:\s*(\d+)/)?.[1];
  const rooms = roomsRaw ? Number(roomsRaw) : null;
  const ogTitle = meta(html, "og:title") ?? "";
  const ogDescription = meta(html, "og:description") ?? "";
  const areaRaw = ogDescription.match(/([\d]+(?:[.,]\d+)?)\s*m2/)?.[1] ?? ogTitle.match(/([\d]+(?:[.,]\d+)?)\s*m2/)?.[1];
  const areaSqm = areaRaw ? Math.round(Number(areaRaw.replace(",", "."))) : null;
  const isStudio = rooms === 1 || /studio/i.test(ogTitle);

  const seen = new Set<string>();
  const photos: string[] = [];
  for (const m of html.matchAll(/https:\/\/media\.immo-facile\.com\/[^"'\s]+?\.(?:jpg|jpeg|png|webp)/gi)) {
    if (seen.has(m[0])) continue;
    seen.add(m[0]);
    photos.push(m[0]);
    if (photos.length === MAX_PHOTOS) break;
  }
  if (photos.length === 0) return null;

  const furnished = /location meublée/i.test(html);

  return {
    url,
    id,
    title: isStudio ? "Studio" : rooms ? `Appartement F${rooms}` : "Appartement",
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
  for (let page = 1; page <= MAX_PAGES; page++) {
    if (Date.now() > deadline) break;
    const html = await fetchText(`${ORIGIN}${LIST_PATH}${page > 1 ? `?page=${page}` : ""}`);
    if (!html) break;
    const before = urls.size;
    // Only genuine apartments — this network also lists parking, offices and
    // commercial units on the same page.
    for (const m of html.matchAll(/href="(https:\/\/www\.guy-hoquet\.com\/location\/appartement-[^"]+)"/g)) {
      urls.add(m[1]);
    }
    if (urls.size === before) break;
  }
  return [...urls];
}

/** Paris apartments to rent from this agency, cheapest first. */
export async function getGuyHoquetParisListings(): Promise<ParisListing[]> {
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
  }
  return out.sort((a, b) => a.rentEur - b.rentEur);
}
