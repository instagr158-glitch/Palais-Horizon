import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { queryListings, type ListingFilters } from "@/lib/listings";
import { Filters } from "@/components/Filters";
import { CountryTabs } from "@/components/CountryTabs";
import { ListingCard } from "@/components/ListingCard";
import { PaywallScreen } from "@/components/PaywallScreen";
import { getServerDict, getLocale } from "@/i18n/server";

// French needs "en Thaïlande" but "à Bali/Dubaï/Miami" — English and German
// use a single preposition for all four, so only "fr" needs its own map.
const FR_PREPOSITIONS: Record<string, string> = {
  thailand: "en",
  bali: "à",
  dubai: "à",
  miami: "à",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDict();
  return { title: t.listings.title };
}
export const dynamic = "force-dynamic";

function num(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

// Keeps the pager short and wrappable on mobile instead of one long row of
// every page number (which pushed page 1 off-screen with no way back to it
// on narrow viewports) — always anchors the first and last page, plus a
// window around the current one.
function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set(
    [1, 2, total - 1, total, current - 1, current, current + 1].filter(
      (p) => p >= 1 && p <= total,
    ),
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

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await auth();
  if (!session) redirect("/login?next=/listings");
  if (!hasActiveSubscription(session.user)) return <PaywallScreen />;

  const t = await getServerDict();
  const locale = await getLocale();
  const sp = await searchParams;
  const country =
    sp.country === "bali" || sp.country === "dubai" || sp.country === "miami"
      ? sp.country
      : "thailand";
  const countryLabel = {
    thailand: t.listings.countryThailand,
    bali: t.listings.countryBali,
    dubai: t.listings.countryDubai,
    miami: t.listings.countryMiami,
  }[country];
  const preposition = locale === "fr" ? FR_PREPOSITIONS[country] : "in";
  const filters: ListingFilters = {
    q: sp.q,
    country,
    propertyType: sp.propertyType,
    listingType: sp.listingType,
    province: sp.province,
    minBedrooms: num(sp.minBedrooms),
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    sort: (sp.sort as ListingFilters["sort"]) ?? "price_asc",
    page: num(sp.page) ?? 1,
    perPage: 12,
  };

  const { listings, total, page, pages } = await queryListings(filters);

  const pageHref = (p: number) => {
    const next = new URLSearchParams(
      Object.entries(sp).filter(([, v]) => v) as [string, string][],
    );
    next.set("page", String(p));
    return `/listings?${next.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl text-cream sm:text-3xl">
            {t.listings.title}
          </h1>
          <p className="mt-1 text-sm text-dim">
            <span className="num">{total}</span>{" "}
            {total === 1 ? t.listings.countOne : t.listings.countOther}{" "}
            {preposition} {countryLabel}
          </p>
        </div>
      </div>

      <CountryTabs active={country} />

      <Suspense fallback={<div className="panel h-20 rounded-sm" />}>
        <Filters />
      </Suspense>

      {listings.length === 0 ? (
        <p className="mt-16 text-center text-dim">
          {t.listings.noResults}{" "}
          <Link href="/listings" className="text-gold hover:underline">
            {t.listings.clearFilters}
          </Link>
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} t={t} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <Link
            href={pageHref(Math.max(1, page - 1))}
            aria-label={t.listings.prevPage}
            className={`rounded-sm border px-3 py-1.5 text-sm ${
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
                className={`rounded-sm border px-3 py-1.5 text-sm ${
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
            aria-label={t.listings.nextPage}
            className={`rounded-sm border px-3 py-1.5 text-sm ${
              page === pages
                ? "pointer-events-none border-ink-border text-dim opacity-40"
                : "border-ink-border text-dim hover:text-cream"
            }`}
          >
            →
          </Link>
        </div>
      )}
    </div>
  );
}
