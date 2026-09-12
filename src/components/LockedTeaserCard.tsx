import { TrackedLink } from "@/components/TrackedLink";
import Image from "next/image";
import type { TeaserListing } from "@/lib/listings";
import type { Dict } from "@/i18n";

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="10" width="16" height="11" rx="2" fill="currentColor" opacity="0.9" />
      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const TYPE_WORD: Record<string, { en: string; fr: string; de: string }> = {
  villa: { en: "villa", fr: "villa", de: "Villa" },
  house: { en: "house", fr: "maison", de: "Haus" },
  penthouse: { en: "penthouse", fr: "penthouse", de: "Penthouse" },
  condo: { en: "residence", fr: "appartement", de: "Wohnung" },
  land: { en: "land", fr: "terrain", de: "Grundstück" },
};

/**
 * Public landing teaser. Deliberately receives NO price / address / agency data,
 * so none of it is present in the page HTML.
 */
export function LockedTeaserCard({
  teaser,
  t,
  locale,
}: {
  teaser: TeaserListing;
  t: Dict;
  locale: "en" | "fr" | "de";
}) {
  const typeWord = TYPE_WORD[teaser.propertyType]?.[locale] ?? teaser.propertyType;
  const headline = teaser.bedrooms
    ? locale === "fr"
      ? `${typeWord} · ${teaser.bedrooms} ch. · ${teaser.city}`
      : locale === "de"
        ? `${typeWord} · ${teaser.bedrooms} Schlafz. · ${teaser.city}`
        : `${teaser.bedrooms}-bedroom ${typeWord} · ${teaser.city}`
    : `${typeWord} · ${teaser.city}`;

  return (
    <TrackedLink
      href="/pricing"
      event="view_membership_click"
      location="locked_card"
      className="group relative block overflow-hidden rounded-sm border border-ink-border bg-ink-panel transition-colors hover:border-gold/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {teaser.image ? (
          <Image
            src={teaser.image}
            alt={headline}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-ink-panel2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xs uppercase tracking-widetitle text-silver">
            {teaser.province}
          </p>
          <p className="mt-1 font-display text-lg capitalize text-cream">
            {headline}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-2 text-gold">
          <LockIcon />
          <span className="text-xs sm:text-sm">{t.landing.lockedPrice}</span>
        </div>
        <span className="btn-gold shrink-0 rounded-sm px-3 py-1.5 text-xs sm:text-sm">
          {t.landing.subscribeCta}
        </span>
      </div>
    </TrackedLink>
  );
}
