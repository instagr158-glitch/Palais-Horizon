import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { queryListings, type ListingFilters } from "@/lib/listings";
import { Filters } from "@/components/Filters";
import { ListingCard } from "@/components/ListingCard";
import { PaywallScreen } from "@/components/PaywallScreen";
import { getServerDict } from "@/i18n/server";

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

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await auth();
  if (!session) redirect("/login?next=/listings");
  if (!hasActiveSubscription(session.user)) return <PaywallScreen />;

  const t = await getServerDict();
  const sp = await searchParams;
  const filters: ListingFilters = {
    q: sp.q,
    propertyType: sp.propertyType,
    listingType: sp.listingType,
    province: sp.province,
    minBedrooms: num(sp.minBedrooms),
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    sort: (sp.sort as ListingFilters["sort"]) ?? "recent",
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
          <h1 className="font-display text-3xl text-cream">{t.listings.title}</h1>
          <p className="mt-1 text-sm text-dim">
            {total} {total === 1 ? t.listings.countOne : t.listings.countOther}
          </p>
        </div>
      </div>

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
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
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
          ))}
        </div>
      )}
    </div>
  );
}
