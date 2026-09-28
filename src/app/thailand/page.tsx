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

// Properties above this price get the "high-end" badge and are capped in
// the teaser, like the Bali and Paris home pages keep only a handful of
// premium ones.
const PREMIUM_MIN_USD = 800_000;
const MAX_PREMIUM = 8;
// The home page teaser shows only the cheapest properties for sale.
const HOME_SELECTION_SIZE = 6;

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.thailand.badge };
}

function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

function cheapest<T extends { price: number }>(items: T[], n: number): T[] {
  return [...items].sort((a, b) => a.price - b.price).slice(0, n);
}

// Memoized per request: the Hero and Catalog sections each read this from
// their own Server Component (streamed in separate Suspense boundaries).
const getProperties = cache(async (): Promise<FullListing[]> => {
  const { listings } = await queryListings({
    country: "thailand",
    listingType: "sale",
    sort: "price_asc",
    perPage: 48,
  });
  // Land listings rarely have compelling photos for a visual, hero-driven page.
  const eligible = listings.filter((l) => l.propertyType !== "land");
  const standard = eligible.filter((l) => (l.priceUsd ?? 0) < PREMIUM_MIN_USD);
  const premium = eligible.filter((l) => (l.priceUsd ?? 0) >= PREMIUM_MIN_USD).slice(0, MAX_PREMIUM);
  return [...standard, ...premium];
});

// Split into their own Server Components so they can stream in behind
// Suspense rather than blocking the whole page on the database query.
async function HeroSection({ t }: { t: Dict["thailand"] }) {
  const properties = await getProperties();
  const withPrice = properties.filter((l) => l.priceUsd != null);
  const minUsd = withPrice.length ? Math.min(...withPrice.map((l) => l.priceUsd!)) : null;
  const maxUsd = withPrice.length ? Math.max(...withPrice.map((l) => l.priceUsd!)) : null;
  const heroPhotos = properties
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

async function CatalogSection({ t, isMember }: { t: Dict["thailand"]; isMember: boolean }) {
  const properties = await getProperties();

  const cards: VillaCard[] = properties.map((l) => ({
    id: l.id,
    href: isMember ? l.agencyUrl : "/pricing-thailand?locked=thailand",
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
  const selectedCards = cheapest(cards, HOME_SELECTION_SIZE);

  return (
    <VillaCatalog
      cards={selectedCards}
      seeMoreHref={isMember ? "/listings?country=thailand&from=thailand" : "/pricing-thailand?locked=thailand"}
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

export default async function ThailandPage() {
  const dict = await getServerDict();
  const t = dict.thailand;
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
