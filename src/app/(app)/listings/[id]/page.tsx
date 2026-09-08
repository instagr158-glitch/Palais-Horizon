import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import {
  getListingById,
  getSimilarListings,
  formatThb,
  formatUsd,
} from "@/lib/listings";
import { Gallery } from "@/components/Gallery";
import { ListingCard } from "@/components/ListingCard";
import { PaywallScreen } from "@/components/PaywallScreen";
import { getServerDict } from "@/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);
  return { title: listing?.title ?? "Residence" };
}

function Fact({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  if (value == null || value === "") return null;
  return (
    <div className="border-b border-ink-border py-3">
      <dt className="text-xs uppercase tracking-widetitle text-dim">{label}</dt>
      <dd className="num mt-1 text-cream">{value}</dd>
    </div>
  );
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (!hasActiveSubscription(session.user)) return <PaywallScreen />;

  const t = await getServerDict();
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) notFound();

  const similar = await getSimilarListings(listing, 3);
  const typeLabel =
    listing.listingType === "rent" ? t.listings.forRent : t.listings.forSale;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/listings" className="text-sm text-dim hover:text-gold">
        ← {t.detail.back}
      </Link>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs uppercase tracking-widetitle text-gold">
            {typeLabel} · {listing.propertyType}
          </p>
          <h1 className="mt-1 font-display text-2xl text-cream sm:text-4xl">
            {listing.title}
          </h1>
          <p className="mt-1 text-sm text-dim sm:text-base">
            {listing.addressText ?? `${listing.city}, ${listing.province}`}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="num text-2xl text-gold-gradient sm:text-3xl">
            {formatThb(listing.priceAmount, t.listings.priceOnApplication)}
          </p>
          {listing.priceUsd ? (
            <p className="num text-sm text-dim">≈ {formatUsd(listing.priceUsd)}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Gallery images={listing.images} title={listing.title} />

          <h2 className="mt-8 font-display text-2xl text-cream">
            {t.detail.description}
          </h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-silver">
            {listing.description}
          </p>

          {listing.amenities.length > 0 && (
            <>
              <h2 className="mt-8 font-display text-2xl text-cream">
                {t.detail.features}
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {listing.amenities.map((a) => (
                  <li
                    key={a}
                    className="flex items-start gap-2 text-sm text-silver"
                  >
                    <span className="mt-0.5 text-gold">✦</span>
                    {a}
                  </li>
                ))}
              </ul>
            </>
          )}

          {listing.lat != null && listing.lng != null && (
            <>
              <h2 className="mt-8 font-display text-2xl text-cream">
                {t.detail.location}
              </h2>
              <div className="mt-3 overflow-hidden rounded-sm border border-ink-border">
                <iframe
                  title="Map"
                  className="h-72 w-full"
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                    listing.lng - 0.03
                  }%2C${listing.lat - 0.03}%2C${listing.lng + 0.03}%2C${
                    listing.lat + 0.03
                  }&layer=mapnik&marker=${listing.lat}%2C${listing.lng}`}
                />
              </div>
            </>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="panel sticky top-24 rounded-sm p-5">
            <dl>
              <Fact label={t.detail.type} value={listing.propertyType} />
              <Fact label={t.detail.bedrooms} value={listing.bedrooms} />
              <Fact label={t.detail.bathrooms} value={listing.bathrooms} />
              <Fact
                label={t.detail.interiorArea}
                value={listing.areaSqm ? `${listing.areaSqm} ${t.listings.sqm}` : null}
              />
              <Fact
                label={t.detail.landArea}
                value={listing.landSqm ? `${listing.landSqm} ${t.listings.sqm}` : null}
              />
              <Fact label={t.detail.region} value={listing.province} />
              <Fact
                label={t.detail.furnished}
                value={listing.furnished ? t.detail.yes : "—"}
              />
            </dl>

            <div className="mt-5 rounded-sm border border-gold/30 bg-gold/[0.04] p-4">
              <p className="text-xs uppercase tracking-widetitle text-dim">
                {t.detail.listingAgency}
              </p>
              <p className="mt-1 font-display text-lg text-cream">
                {listing.agencyName}
              </p>
              <a
                href={listing.agencyUrl}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="btn-gold mt-3 block rounded-sm px-4 py-2.5 text-center text-sm"
              >
                {t.detail.viewOnAgency} →
              </a>
              <p className="mt-2 text-[11px] leading-relaxed text-dim">
                {t.detail.agencyDisclaimer}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-cream">
            {t.detail.moreIn} {listing.province}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((l) => (
              <ListingCard key={l.id} listing={l} t={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
