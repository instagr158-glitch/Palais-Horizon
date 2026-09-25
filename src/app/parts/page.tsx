import { getServerDict } from "@/i18n/server";
import {
  getLoftyMiamiProperties,
  getLoftyProperties,
  type LoftyKind,
  type LoftyProperty,
} from "@/lib/lofty";
import { InvestGrid, type InvestCard } from "@/components/InvestGrid";

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 text-center">
        <span className="inline-block rounded-full border border-gold/30 bg-gold/[0.06] px-4 py-1.5 text-xs uppercase tracking-widetitle text-gold">
          {t.badge}
        </span>
      </div>
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

      <p className="mt-6 text-xs leading-relaxed text-dim">
        {fmt(t.note, { date: new Date().toLocaleDateString(nf, { dateStyle: "long" }) })}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-dim">
        <span className="font-semibold text-gold">{t.disclaimerTitle}</span>
        {t.disclaimer}
      </p>
    </div>
  );
}
