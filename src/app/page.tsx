import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { getServerDict } from "@/i18n/server";
import { getParisListings, STANDARD_MAX_EUR } from "@/lib/paris";
import { ParisCatalog, type ParisCard } from "@/components/ParisCatalog";
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

export default async function HomePage() {
  const dict = await getServerDict();
  const t = dict.paris;
  const nf = NUMBER_LOCALES[dict.code] ?? "en-US";
  const session = await auth();
  const isMember = hasActiveSubscription(session?.user);
  const listings = await getParisListings();

  const money = (n: number) =>
    n.toLocaleString(nf, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  const cards: ParisCard[] = listings.map((l) => ({
    id: l.id,
    href: isMember ? l.url : "/pricing?locked=parts",
    external: isMember,
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

  const heroPhotos = [
    ...listings.filter((l) => l.rentEur > STANDARD_MAX_EUR).slice(0, 2),
    ...listings.filter((l) => l.rentEur <= STANDARD_MAX_EUR && (l.areaSqm ?? 0) >= 40).slice(0, 3),
  ].map((l) => l.photos[0]);
  const minRent = listings.length ? Math.min(...listings.map((l) => l.rentEur)) : 800;

  const steps = [
    { title: t.step1Title, body: t.step1Body },
    { title: t.step2Title, body: t.step2Body },
    { title: t.step3Title, body: t.step3Body },
  ];

  return (
    <div>
      <PartsHero
        photos={heroPhotos}
        eyebrow={t.badge}
        lead={t.titleLead}
        trail={t.titleTrail}
        cta={t.cta}
        stats={[
          { value: money(minRent), label: t.statFromLabel },
          { value: t.statRangeValue, label: t.statRangeLabel },
        ]}
      />

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
          <ParisCatalog
            cards={cards}
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
