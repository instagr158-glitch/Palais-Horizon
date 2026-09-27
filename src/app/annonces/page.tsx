import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { getServerDict } from "@/i18n/server";
import type { Dict } from "@/i18n";
import { getAllParisListings, STANDARD_MAX_EUR } from "@/lib/paris";
import { ParisCatalog, type ParisCard } from "@/components/ParisCatalog";
import { CatalogSkeleton } from "@/components/ParisSkeleton";
import { PaywallScreen } from "@/components/PaywallScreen";

export const dynamic = "force-dynamic";

const NUMBER_LOCALES: Record<string, string> = { fr: "fr-FR", en: "en-US", de: "de-DE" };
const PAGE_SIZE = 30;

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.paris.allListingsTitle };
}

function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

// Keeps the pager short and wrappable on mobile instead of one long row of
// every page number — always anchors the first and last page, plus a window
// around the current one. (Same helper as the residences catalogue's pager.)
function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set(
    [1, 2, total - 1, total, current - 1, current, current + 1].filter((p) => p >= 1 && p <= total),
  );
  const sorted = [...keep].sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("…");
    result.push(p);
    prev = p;
  }
  return result;
}

// Split off so the title/badge paint immediately and only this part streams
// in behind Suspense — the live scrape it awaits can take several seconds.
async function ListingsSection({
  t,
  nf,
  page: requestedPage,
  prevPageLabel,
  nextPageLabel,
}: {
  t: Dict["paris"];
  nf: string;
  page: number;
  prevPageLabel: string;
  nextPageLabel: string;
}) {
  const listings = await getAllParisListings();

  const money = (n: number) =>
    n.toLocaleString(nf, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  const cards: ParisCard[] = listings.map((l) => ({
    id: l.id,
    href: l.url,
    external: true,
    place: fmt(t.place, { zip: l.zip }),
    title: l.title,
    photos: l.photos,
    rent: l.rentEur,
    rentText: money(l.rentEur),
    pricePerSqm: l.pricePerSqm,
    sqmText: l.pricePerSqm != null ? `${l.pricePerSqm.toLocaleString(nf, { maximumFractionDigits: 0 })} ${t.perSqm}` : null,
    detailText: [
      l.areaSqm ? `${l.areaSqm} m²` : null,
      l.rooms ? (l.rooms === 1 ? t.roomsOne : fmt(t.rooms, { n: l.rooms })) : null,
    ]
      .filter(Boolean)
      .join(" · "),
    furnished: l.furnished,
    premium: l.rentEur > STANDARD_MAX_EUR,
  }));

  const pages = Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), pages);
  const pageCards = cards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageHref = (p: number) => (p === 1 ? "/annonces" : `/annonces?page=${p}`);

  return (
    <>
      <p className="mt-3 max-w-2xl text-sm text-dim sm:text-base">
        {fmt(t.allListingsBody, { n: cards.length })}
      </p>

      <div className="mt-10">
        <ParisCatalog
          cards={pageCards}
          labels={{
            all: t.filterAll,
            under: t.filterUnder,
            mid: t.filterMid,
            premium: t.filterPremium,
            favorites: t.filterFavorites,
            noFavorites: t.noFavorites,
            sortLabel: t.sortLabel,
            sortRent: t.sortRent,
            sortSqm: t.sortSqm,
            perMonth: t.perMonth,
            furnished: t.furnished,
            premiumBadge: t.premium,
            view: t.view,
            addFavorite: t.addFavorite,
            removeFavorite: t.removeFavorite,
            empty: t.empty,
          }}
        />
      </div>

      {pages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <Link
            href={pageHref(Math.max(1, page - 1))}
            aria-label={prevPageLabel}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              page === 1
                ? "pointer-events-none border-ink-border text-dim opacity-40"
                : "border-ink-border text-dim hover:text-cream"
            }`}
          >
            ←
          </Link>
          {pageNumbers(page, pages).map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="px-1 text-sm text-dim">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={pageHref(p)}
                className={`num rounded-full border px-3 py-1.5 text-sm ${
                  p === page
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-ink-border text-dim hover:text-cream"
                }`}
              >
                {p}
              </Link>
            ),
          )}
          <Link
            href={pageHref(Math.min(pages, page + 1))}
            aria-label={nextPageLabel}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              page === pages
                ? "pointer-events-none border-ink-border text-dim opacity-40"
                : "border-ink-border text-dim hover:text-cream"
            }`}
          >
            →
          </Link>
        </div>
      )}

      <div className="mt-16 space-y-2 pb-16">
        <p className="text-xs leading-relaxed text-dim">
          {fmt(t.note, { date: new Date().toLocaleDateString(nf, { dateStyle: "long" }) })}
        </p>
        <p className="text-xs leading-relaxed text-dim">
          <span className="font-semibold text-gold">{t.disclaimerTitle}</span>
          {t.disclaimer}
        </p>
      </div>
    </>
  );
}

export default async function AllParisListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/annonces");
  if (!hasActiveSubscription(session.user)) return <PaywallScreen />;

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const dict = await getServerDict();
  const t = dict.paris;
  const nf = NUMBER_LOCALES[dict.code] ?? "en-US";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-widetitle text-gold">{t.allListingsBadge}</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-cream sm:text-5xl">{t.allListingsTitle}</h1>

      <Suspense fallback={<CatalogSkeleton />}>
        <ListingsSection
          t={t}
          nf={nf}
          page={page}
          prevPageLabel={dict.listings.prevPage}
          nextPageLabel={dict.listings.nextPage}
        />
      </Suspense>
    </div>
  );
}
