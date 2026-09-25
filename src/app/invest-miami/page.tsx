import Image from "next/image";
import { getServerDict } from "@/i18n/server";
import { getInvestmentCatalogue, type Confidence, type InvestmentItem } from "@/lib/investment";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.invest.badge };
}

const PLATFORMS = [
  { key: "ark7", name: "Ark7", url: "https://ark7.com" },
  { key: "arrived", name: "Arrived", url: "https://arrived.com" },
] as const;

const BUILDINGS = [
  { name: "Domus Brickell Center", area: "Brickell", rule: "ruleDaily" },
  { name: "Icon Brickell III (W Miami)", area: "Brickell", rule: "ruleDaily" },
  { name: "Four Seasons Residences", area: "Brickell", rule: "ruleDaily" },
  { name: "E11EVEN Hotel & Residences", area: "Downtown Miami", rule: "ruleDaily" },
  { name: "Gale Miami Hotel & Residences", area: "Downtown Miami", rule: "ruleDaily" },
  { name: "Acqualina", area: "Sunny Isles Beach", rule: "rule90" },
] as const;

const BUILDINGS_LIST_URL = "https://www.condoblackbook.com/blog/miami-condos-that-allow-airbnb";

const NUMBER_LOCALES: Record<string, string> = { fr: "fr-FR", en: "en-US", de: "de-DE" };

const CONFIDENCE_STYLES: Record<Confidence, string> = {
  high: "text-emerald-400",
  medium: "text-gold",
  low: "text-red-400",
};

function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export default async function InvestMiamiPage() {
  const dict = await getServerDict();
  const t = dict.invest;
  const nf = NUMBER_LOCALES[dict.code] ?? "en-US";
  const money = (n: number) =>
    n.toLocaleString(nf, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const pct = (n: number) =>
    n.toLocaleString(nf, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const signed = (n: number, digits: number) =>
    `${n >= 0 ? "+" : ""}${n.toLocaleString(nf, { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
  const catalogue = await getInvestmentCatalogue();
  const confidenceLabels = {
    high: t.confidenceHigh,
    medium: t.confidenceMedium,
    low: t.confidenceLow,
  };

  const renderCard = (item: InvestmentItem, index: number) => (
    <article
      key={item.id}
      className="flex flex-col overflow-hidden rounded-sm border border-ink-border bg-ink-panel"
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="num rounded-sm bg-black/70 px-2.5 py-1 text-sm font-bold text-cream backdrop-blur-sm">
            #{index + 1}
          </span>
          {index < 3 && (
            <span className="rounded-sm bg-gold px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide text-black">
              {t.topBadge}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-wide text-gold">{item.neighborhood}</p>
        <h3 className="mt-1 font-sans text-sm font-bold leading-snug text-cream">{item.title}</h3>
        <p className="mt-1 text-xs text-dim">
          {item.bedrooms} {t.bedsShort}
          {item.bathrooms != null && ` · ${item.bathrooms} ${t.bathsShort}`}
          {item.areaSqm != null && ` · ${Math.round(item.areaSqm)} m²`}
        </p>

        <div className="mt-4 rounded-sm border border-gold/30 bg-gold/[0.04] p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-dim">{t.yieldLabel}</p>
          <p className="num mt-1 text-4xl text-gold-gradient">{pct(item.yieldPct)} %</p>
          <p className="mt-1 text-xs text-dim">
            {t.rangeLabel} : {pct(item.yieldMinPct)} – {pct(item.yieldMaxPct)} %
          </p>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4 border-t border-ink-border pt-2">
            <dt className="text-dim">{t.priceLabel}</dt>
            <dd className="num text-right text-cream">{money(item.priceUsd)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-ink-border pt-2">
            <dt className="text-dim">{t.estRentLabel}</dt>
            <dd className="num text-right text-cream">
              {money(item.estRentUsd)}
              <span className="block text-xs text-dim">
                {money(item.rentMinUsd)} – {money(item.rentMaxUsd)}
              </span>
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-ink-border pt-2">
            <dt className="text-dim">{t.confidenceLabel}</dt>
            <dd className={`text-right font-semibold ${CONFIDENCE_STYLES[item.confidence]}`}>
              {confidenceLabels[item.confidence]}
            </dd>
          </div>
        </dl>

        <p className="mt-3 text-xs text-dim">
          {fmt(item.basis === "building" ? t.basisBuilding : t.basisZip, {
            n: item.compCount,
            beds: item.bedrooms,
            place: item.basisPlace,
          })}
        </p>
        <ul className="mt-3 space-y-1 text-xs text-dim">
          {catalogue.medianYieldPct != null && (
            <li>
              {fmt(t.yieldVsMedian, {
                median: pct(catalogue.medianYieldPct),
                diff: signed(item.yieldPct - catalogue.medianYieldPct, 1),
              })}
            </li>
          )}
          {item.pricePerSqm != null && (
            <li>
              {fmt(t.pricePerSqm, { value: money(item.pricePerSqm) })}
              {item.pricePerSqmVsMedianPct != null &&
                ` (${fmt(t.pricePerSqmVs, { pct: signed(item.pricePerSqmVsMedianPct, 0) })})`}
            </li>
          )}
        </ul>

        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold mt-5 inline-block self-start rounded-full px-5 py-2.5 text-sm"
        >
          {t.viewListing}
        </a>
      </div>
    </article>
  );
  const descriptions = { ark7: t.ark7Desc, arrived: t.arrivedDesc };
  const minimums = { ark7: t.ark7Min, arrived: t.arrivedMin };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="text-center">
        <span className="inline-block rounded-full border border-gold/30 bg-gold/[0.06] px-4 py-1.5 text-xs uppercase tracking-widetitle text-gold">
          {t.badge}
        </span>
        <h1 className="mx-auto mt-4 max-w-2xl font-sans text-3xl font-extrabold leading-[1.15] text-cream sm:text-5xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-dim sm:text-base">{t.subtitle}</p>
      </div>

      {catalogue.items.length > 0 && (
        <section className="mt-12">
          <h2 className="font-sans text-xl font-extrabold text-cream sm:text-2xl">
            {t.catalogueTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-dim">{t.catalogueBody}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalogue.items.map(renderCard)}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-dim">{t.caveat}</p>
          <div className="mt-4 rounded-sm border border-ink-border bg-ink-panel p-4">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widetitle text-gold">
              {t.methodTitle}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-dim">{t.methodBody}</p>
          </div>
        </section>
      )}

      <section className="mt-14">
        <h2 className="font-sans text-xl font-extrabold text-cream sm:text-2xl">
          {t.fractionalTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-dim">{t.fractionalBody}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PLATFORMS.map((p) => (
            <div
              key={p.key}
              className="flex flex-col rounded-sm border border-ink-border bg-ink-panel p-6"
            >
              <h3 className="font-sans text-lg font-bold text-cream">{p.name}</h3>
              <p className="mt-2 text-sm text-dim">{descriptions[p.key]}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4 border-t border-ink-border pt-2">
                  <dt className="text-dim">{t.minLabel}</dt>
                  <dd className="text-right text-cream">{minimums[p.key]}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-ink-border pt-2">
                  <dt className="text-dim">{t.incomeLabel}</dt>
                  <dd className="text-right text-cream">{t.income}</dd>
                </div>
              </dl>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-6 inline-block self-start rounded-full px-5 py-2.5 text-sm"
              >
                {t.visitAt} {p.name}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-sans text-xl font-extrabold text-cream sm:text-2xl">
          {t.directTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-dim">{t.directBody}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BUILDINGS.map((b) => (
            <div key={b.name} className="rounded-sm border border-ink-border bg-ink-panel p-4">
              <p className="font-sans text-sm font-bold text-cream">{b.name}</p>
              <p className="mt-0.5 text-xs uppercase tracking-wide text-gold">{b.area}</p>
              <p className="mt-2 text-sm text-dim">{t[b.rule]}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-dim">{t.buildingsSource}</p>
        <a
          href={BUILDINGS_LIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold mt-5 inline-block rounded-full px-5 py-2.5 text-sm"
        >
          {t.fullList}
        </a>
      </section>

      <section className="mt-14 rounded-sm border border-gold/30 bg-gold/[0.04] p-6">
        <h2 className="font-sans text-sm font-bold uppercase tracking-widetitle text-gold">
          {t.disclaimerTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-dim">{t.disclaimer}</p>
        <p className="mt-3 text-xs text-dim">{t.updated}</p>
      </section>
    </div>
  );
}
