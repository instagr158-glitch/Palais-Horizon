import { Suspense, cache } from "react";
import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { getServerDict } from "@/i18n/server";
import type { Dict } from "@/i18n";
import { queryListings, formatEur, formatUsd, type FullListing } from "@/lib/listings";
import { VillaCatalog, type VillaCard } from "@/components/VillaCatalog";
import { HeroSkeleton, CatalogSkeleton } from "@/components/ParisSkeleton";
import { PartsHero } from "@/components/PartsHero";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

// Villas above this price get the "high-end" badge and are capped in the
// teaser, like the Paris home page keeps only a handful of premium rentals.
const PREMIUM_MIN_USD = 600_000;
const MAX_PREMIUM = 8;
// The home page teaser shows only the cheapest villas for sale.
const HOME_SELECTION_SIZE = 6;

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.bali.badge };
}

function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

function cheapest<T extends { price: number }>(items: T[], n: number): T[] {
  return [...items].sort((a, b) => a.price - b.price).slice(0, n);
}

// Kept off the home page by request — editorial pick, not a data issue.
const EXCLUDED_TITLES = new Set([
  "Charming 1-Bedroom Villa for Sale Leasehold Near Balangan Beach",
  "2 Bedroom Villa for Leasehold Sale in Tumbak Bayuh Bali",
]);

// Hand-picked by request — not yet in the ingested catalogue, so it's kept
// here rather than in the database. Real, currently-listed villa (IDR
// 1,500,000,000 ≈ $94,937 at 15,800 IDR/USD, matching the ingest pipeline's
// own conversion rate), checked live on the agency's site.
const PINNED_VILLA = {
  id: "pinned-rf8368",
  url: "https://bali-home-immo.com/realestate-property/for-sale/villa/leasehold/canggu/mezzanine-style-1-bedroom-villa-for-sale-in-babakan-canggu-rf8368",
  title: "Mezzanine style 1 Bedroom Villa for sale in Babakan Canggu",
  city: "Canggu",
  district: "Residential Side",
  bedrooms: 1,
  areaSqm: 38,
  landSqm: null as number | null,
  priceUsd: 94937,
  images: [
    "https://bali-home-immo.com/images/properties/mezzanine-style-1-bedroom-villa-for-sale-in-babakan-canggu-rf8368-667cdb4469ceb437f31e8185175a7d35.png",
    "https://bali-home-immo.com/images/properties/mezzanine-style-1-bedroom-villa-for-sale-in-babakan-canggu-rf8368-d70dc6ee5ec9ef86cbc115b7277361a7.png",
    "https://bali-home-immo.com/images/properties/mezzanine-style-1-bedroom-villa-for-sale-in-babakan-canggu-rf8368-f1a99eafc56218c9f9eccd3e6f8e89d0.png",
    "https://bali-home-immo.com/images/properties/mezzanine-style-1-bedroom-villa-for-sale-in-babakan-canggu-rf8368-935b081673cb77490106fd0c1b67b78d.png",
  ],
};

// Memoized per request: the Hero and Catalog sections each read this from
// their own Server Component (streamed in separate Suspense boundaries).
const getVillas = cache(async (): Promise<FullListing[]> => {
  const { listings } = await queryListings({
    country: "bali",
    propertyType: "villa",
    listingType: "sale",
    sort: "price_asc",
    perPage: 48,
  });
  const eligible = listings.filter((l) => !EXCLUDED_TITLES.has(l.title));
  const standard = eligible.filter((l) => (l.priceUsd ?? 0) < PREMIUM_MIN_USD);
  const premium = eligible.filter((l) => (l.priceUsd ?? 0) >= PREMIUM_MIN_USD).slice(0, MAX_PREMIUM);
  return [...standard, ...premium];
});

// Split into their own Server Components so they can stream in behind
// Suspense rather than blocking the whole page on the database query.
async function HeroSection({ t }: { t: Dict["bali"] }) {
  const villas = await getVillas();
  const withPrice = villas.filter((l) => l.priceUsd != null);
  const minUsd = withPrice.length ? Math.min(...withPrice.map((l) => l.priceUsd!)) : null;
  const maxUsd = withPrice.length ? Math.max(...withPrice.map((l) => l.priceUsd!)) : null;
  const heroPhotos = villas
    .filter((l) => l.images[0])
    .slice(0, 5)
    .map((l) => l.images[0]);

  return (
    <PartsHero
      photos={heroPhotos}
      eyebrow={t.badge}
      lead={t.titleLead}
      trail={t.titleTrail}
      cta={t.cta}
      stats={[
        { value: minUsd != null ? formatUsd(minUsd) : "—", label: t.statFromLabel },
        {
          value: minUsd != null && maxUsd != null ? `${formatUsd(minUsd)} – ${formatUsd(maxUsd)}` : "—",
          label: t.statRangeLabel,
        },
      ]}
    />
  );
}

async function CatalogSection({ t, isMember }: { t: Dict["bali"]; isMember: boolean }) {
  const villas = await getVillas();

  const cards: VillaCard[] = villas.map((l) => ({
    id: l.id,
    href: isMember ? l.agencyUrl : "/pricing-bali?locked=bali",
    external: isMember,
    place: [l.district, l.city].filter(Boolean).join(", ") || l.province,
    title: l.title,
    photos: l.images.slice(0, 4),
    price: l.priceUsd ?? 0,
    priceText: l.priceUsd != null ? formatUsd(l.priceUsd) : "—",
    secondaryPriceText: l.priceUsd != null ? formatEur(l.priceUsd) : null,
    specsText: [
      l.bedrooms ? (l.bedrooms === 1 ? t.bedroomOne : fmt(t.bedrooms, { n: l.bedrooms })) : null,
      l.areaSqm ? `${l.areaSqm} m²` : null,
    ]
      .filter(Boolean)
      .join(" · "),
    landSqm: l.landSqm,
    landText: l.landSqm ? `${l.landSqm} m²` : null,
    premium: (l.priceUsd ?? 0) >= PREMIUM_MIN_USD,
  }));

  const pinnedCard: VillaCard = {
    id: PINNED_VILLA.id,
    href: isMember ? PINNED_VILLA.url : "/pricing-bali?locked=bali",
    external: isMember,
    place: [PINNED_VILLA.district, PINNED_VILLA.city].filter(Boolean).join(", "),
    title: PINNED_VILLA.title,
    photos: PINNED_VILLA.images,
    price: PINNED_VILLA.priceUsd,
    priceText: formatUsd(PINNED_VILLA.priceUsd),
    secondaryPriceText: formatEur(PINNED_VILLA.priceUsd),
    specsText: [
      PINNED_VILLA.bedrooms === 1 ? t.bedroomOne : fmt(t.bedrooms, { n: PINNED_VILLA.bedrooms }),
      `${PINNED_VILLA.areaSqm} m²`,
    ].join(" · "),
    landSqm: PINNED_VILLA.landSqm,
    landText: PINNED_VILLA.landSqm ? `${PINNED_VILLA.landSqm} m²` : null,
    premium: PINNED_VILLA.priceUsd >= PREMIUM_MIN_USD,
  };
  // Reserve one slot for the hand-picked villa, fill the rest with the
  // cheapest from the catalogue.
  const selectedCards = [pinnedCard, ...cheapest(cards, HOME_SELECTION_SIZE - 1)];

  return (
    <VillaCatalog
      cards={selectedCards}
      seeMoreHref={isMember ? "/listings?country=bali&from=bali" : "/pricing-bali?locked=bali"}
      seeMoreLabel={t.seeMore}
      labels={{
        all: t.filterAll,
        under: t.filterUnder,
        mid: t.filterMid,
        premium: t.filterPremium,
        favorites: t.filterFavorites,
        noFavorites: t.noFavorites,
        sortLabel: t.sortLabel,
        sortPrice: t.sortPrice,
        sortLand: t.sortLand,
        premiumBadge: t.premium,
        view: t.view,
        addFavorite: t.addFavorite,
        removeFavorite: t.removeFavorite,
        empty: t.empty,
      }}
    />
  );
}

export default async function BaliPage() {
  const dict = await getServerDict();
  const t = dict.bali;
  const nf = dict.code === "fr" ? "fr-FR" : dict.code === "de" ? "de-DE" : "en-US";
  const session = await auth();
  const isMember = hasActiveSubscription(session?.user);

  const steps = [
    { title: t.step1Title, body: t.step1Body },
    { title: t.step2Title, body: t.step2Body },
    { title: t.step3Title, body: t.step3Body },
  ];

  return (
    <div>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection t={t} />
      </Suspense>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="py-16 sm:py-24">
          <ol className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {steps.map((step, i) => (
              <Reveal key={step.title} delayMs={i * 120}>
                <li className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 sm:p-7">
                  <span className="num pointer-events-none absolute -right-2 -top-6 font-display text-[7rem] font-semibold leading-none text-gold/10">
                    {i + 1}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-sm font-semibold text-gold">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-cream">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dim">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <div id="biens" className="scroll-mt-16">
          <Suspense fallback={<CatalogSkeleton count={HOME_SELECTION_SIZE} />}>
            <CatalogSection t={t} isMember={isMember} />
          </Suspense>
        </div>

        <div className="mt-16 space-y-2 pb-16">
          <p className="text-xs leading-relaxed text-dim">
            {fmt(t.note, { date: new Date().toLocaleDateString(nf, { dateStyle: "long" }) })}
          </p>
          <p className="text-xs leading-relaxed text-dim">
            <span className="font-semibold text-gold">{t.disclaimerTitle}</span>
            {t.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
