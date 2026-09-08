import Link from "next/link";
import Image from "next/image";
import type { FullListing } from "@/lib/listings";
import { formatThb, formatUsd } from "@/lib/listings";
import type { Dict } from "@/i18n";

function Spec({
  value,
  label,
}: {
  value: string | number | null;
  label: string;
}) {
  if (value == null) return null;
  return (
    <span className="text-dim">
      <span className="text-silver">{value}</span> {label}
    </span>
  );
}

/** Member-facing card. Full data — only rendered behind the paywall. */
export function ListingCard({ listing, t }: { listing: FullListing; t: Dict }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-sm border border-ink-border bg-ink-panel transition-colors hover:border-gold/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {listing.images[0] ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-ink-panel2" />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-sm bg-black/70 px-2 py-1 text-[11px] uppercase tracking-wide text-silver">
            {listing.listingType === "rent" ? t.listings.forRent : t.listings.forSale}
          </span>
          {listing.featured && (
            <span className="rounded-sm bg-gold px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-black">
              {t.listings.signature}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-widetitle text-dim">
          {listing.city}
          {listing.district ? ` · ${listing.district}` : ""} — {listing.province}
        </p>
        <h3 className="mt-1 line-clamp-1 font-display text-lg text-cream">
          {listing.title}
        </h3>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Spec value={listing.bedrooms} label={t.listings.bed} />
          <Spec value={listing.bathrooms} label={t.listings.bath} />
          <Spec value={listing.areaSqm} label={t.listings.sqm} />
          {listing.landSqm ? (
            <Spec value={listing.landSqm} label={t.listings.sqmLand} />
          ) : null}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="font-display text-xl text-gold-gradient">
              {formatThb(listing.priceAmount, t.listings.priceOnApplication)}
            </p>
            {listing.priceUsd ? (
              <p className="text-xs text-dim">≈ {formatUsd(listing.priceUsd)}</p>
            ) : null}
          </div>
          <span className="text-xs text-dim">{listing.agencyName}</span>
        </div>
      </div>
    </Link>
  );
}
