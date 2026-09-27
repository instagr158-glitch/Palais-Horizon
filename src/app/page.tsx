import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { getServerDict } from "@/i18n/server";
import type { Dict } from "@/i18n";
import { getParisListings, STANDARD_MAX_EUR } from "@/lib/paris";
import { ParisCatalog, type ParisCard } from "@/components/ParisCatalog";
import { HeroSkeleton, CatalogSkeleton } from "@/components/ParisSkeleton";
import { PartsHero } from "@/components/PartsHero";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

const NUMBER_LOCALES: Record<string, string> = { fr: "fr-FR", en: "en-US", de: "de-DE" };

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.paris.badge };
}

function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

// The home page is a teaser, not the full catalogue (see /annonces, members-only,
// for that) — a small spread across the price range, cheapest to priciest.
const HOME_SELECTION_SIZE = 9;

function pickSpread<T>(items: T[], n: number): T[] {
  if (items.length <= n) return items;
  return Array.from({ length: n }, (_, i) => items[Math.floor((i * items.length) / n)]);
}

function money(n: number, nf: string) {
  return n.toLocaleString(nf, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

// Split into its own Server Component so it can stream in behind a Suspense
// boundary — the live scrape it awaits can take several seconds, and this
// keeps that wait from blocking the whole page (nav, steps) from painting.
async function HeroSection({ t, nf }: { t: Dict["paris"]; nf: string }) {
  const listings = await getParisListings();

  const heroPhotos = [
    ...listings.filter((l) => l.rentEur > STANDARD_MAX_EUR).slice(1, 3),
    ...listings.filter((l) => l.rentEur <= STANDARD_MAX_EUR && (l.areaSqm ?? 0) >= 40).slice(0, 3),
  ].map((l) => l.photos[0]);
  const minRent = listings.length ? Math.min(...listings.map((l) => l.rentEur)) : 800;

  return (
    <PartsHero
      photos={heroPhotos}
      eyebrow={t.badge}
      lead={t.titleLead}
      trail={t.titleTrail}
      cta={t.cta}
      stats={[
        { value: money(minRent, nf), label: t.statFromLabel },
        { value: t.statRangeValue, label: t.statRangeLabel },
      ]}
    />
  );
}

async function CatalogSection({ t, nf, isMember }: { t: Dict["paris"]; nf: string; isMember: boolean }) {
  const listings = await getParisListings(); // deduped: same in-flight fetch as HeroSection

  const cards: ParisCard[] = listings.map((l) => ({
    id: l.id,
    href: isMember ? l.url : "/pricing?locked=parts",
    external: isMember,
    place: fmt(t.place, { zip: l.zip }),
    title: l.title,
    photos: l.photos,
    rent: l.rentEur,
    rentText: money(l.rentEur, nf),
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
  const selectedCards = pickSpread(cards, HOME_SELECTION_SIZE);

  return (
    <ParisCatalog
      cards={selectedCards}
      seeMoreHref="/pricing?locked=parts"
      seeMoreLabel={t.seeMore}
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
  );
}

export default async function HomePage() {
  const dict = await getServerDict();
  const t = dict.paris;
  const nf = NUMBER_LOCALES[dict.code] ?? "en-US";
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
        <HeroSection t={t} nf={nf} />
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
            <CatalogSection t={t} nf={nf} isMember={isMember} />
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
