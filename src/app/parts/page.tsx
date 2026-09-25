import { getServerDict } from "@/i18n/server";
import {
  getLoftyMiamiProperties,
  getLoftyProperties,
  type LoftyKind,
  type LoftyProperty,
} from "@/lib/lofty";
import { InvestGrid, type InvestCard } from "@/components/InvestGrid";
import { PartsHero } from "@/components/PartsHero";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

const NUMBER_LOCALES: Record<string, string> = { fr: "fr-FR", en: "en-US", de: "de-DE" };

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.invest.badge };
}

function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export default async function InvestMiamiPage() {
  const dict = await getServerDict();
  const t = dict.invest;
  const nf = NUMBER_LOCALES[dict.code] ?? "en-US";
  const [properties, miamiProperties] = await Promise.all([
    getLoftyProperties(),
    getLoftyMiamiProperties(),
  ]);

  const kindLabels: Record<LoftyKind, string> = {
    vacation: t.airbnbBadge,
    single: t.kindSingle,
    multi: t.kindMulti,
    commercial: t.kindCommercial,
    apartment: t.kindApartment,
    other: t.kindOther,
  };
  const money = (n: number) => n.toLocaleString(nf, { style: "currency", currency: "USD" });
  const pct = (n: number) =>
    n.toLocaleString(nf, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const toCard = (p: LoftyProperty, group: InvestCard["group"]): InvestCard => ({
    url: p.url,
    group,
    paying: p.currentYieldPct > 0,
    street: p.street,
    place: `${p.city}, ${p.state} ${p.zip}`,
    isVacation: p.kind === "vacation",
    kindLabel: kindLabels[p.kind],
    photos: p.photos,
    priceText: money(p.sharePriceUsd),
    yieldText: `${pct(p.currentYieldPct)} %`,
    investorsText: p.investors != null ? fmt(t.investors, { n: p.investors.toLocaleString(nf) }) : null,
    examplesText: fmt(t.sharesExample, {
      a: Math.floor(100 / p.sharePriceUsd),
      b: Math.floor(500 / p.sharePriceUsd),
      sa: Math.floor(100 / p.sharePriceUsd) === 1 ? t.shareOne : t.shareMany,
      sb: Math.floor(500 / p.sharePriceUsd) === 1 ? t.shareOne : t.shareMany,
    }),
  });
  const cards: InvestCard[] = [
    ...properties.map((p) => toCard(p, "main")),
    ...miamiProperties.map((p) => toCard(p, "miami")),
  ];

  const heroPhotos = [
    ...cards.filter((c) => c.group === "miami").slice(2, 5),
    ...cards.filter((c) => c.group === "main").slice(0, 2),
  ].map((c) => c.photos[0]);
  const minPrice = Math.min(...[...properties, ...miamiProperties].map((p) => p.sharePriceUsd));
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
        cta={dict.landing.heroCtaPrimary}
        stats={[
          {
            value: minPrice.toLocaleString(nf, { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
            label: t.statShareLabel,
          },
          { value: String(cards.length), label: t.statPropsLabel },
          { value: t.statWorldValue, label: t.statWorldLabel },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="py-16 sm:py-24">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-cream sm:text-5xl">
              {dict.landing.howTitle}
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
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
          <InvestGrid
            cards={cards}
            labels={{
              all: t.filterAll,
              favorites: t.filterFavorites,
              noFavorites: t.noFavorites,
              perShare: t.perShare,
              yieldLabel: t.yieldLabel,
              cashFlowing: t.cashFlowing,
              miamiTitle: t.miamiTitle,
              otherTitle: t.otherTitle,
              buy: t.buy,
              addFavorite: t.addFavorite,
              removeFavorite: t.removeFavorite,
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
