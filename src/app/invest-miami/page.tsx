import Image from "next/image";
import { getServerDict } from "@/i18n/server";
import { getLoftyProperties, type LoftyKind } from "@/lib/lofty";

export const dynamic = "force-dynamic";

const NUMBER_LOCALES: Record<string, string> = { fr: "fr-FR", en: "en-US", de: "de-DE" };

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.invest.badge };
}

const LOFTY = { name: "Lofty", url: "https://www.lofty.ai", sharePriceUsd: 50 };

function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export default async function InvestMiamiPage() {
  const dict = await getServerDict();
  const t = dict.invest;
  const nf = NUMBER_LOCALES[dict.code] ?? "en-US";
  const properties = await getLoftyProperties();
  const kindLabels: Record<LoftyKind, string> = {
    vacation: t.airbnbBadge,
    single: t.kindSingle,
    multi: t.kindMulti,
    commercial: t.kindCommercial,
    other: t.kindOther,
  };
  const money = (n: number) => n.toLocaleString(nf, { style: "currency", currency: "USD" });
  const pct = (n: number) =>
    n.toLocaleString(nf, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

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

      <section className="mt-12">
        <h2 className="font-sans text-xl font-extrabold text-cream sm:text-2xl">
          {t.fractionalTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-dim">{t.fractionalBody}</p>
        <div className="mt-6 flex max-w-xl flex-col rounded-sm border border-ink-border bg-ink-panel p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-sans text-lg font-bold text-cream">{LOFTY.name}</h3>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-400">
              {t.openBadge}
            </span>
          </div>
          <p className="mt-2 text-sm text-dim">{t.loftyDesc}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4 border-t border-ink-border pt-2">
              <dt className="text-dim">{t.minLabel}</dt>
              <dd className="text-right text-cream">{t.loftyMin}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-ink-border pt-2">
              <dt className="text-dim">{t.examplesLabel}</dt>
              <dd className="text-right text-cream">
                {fmt(t.sharesExample, {
                  a: Math.floor(100 / LOFTY.sharePriceUsd),
                  b: Math.floor(500 / LOFTY.sharePriceUsd),
                })}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-ink-border pt-2">
              <dt className="text-dim">{t.incomeLabel}</dt>
              <dd className="text-right text-cream">{t.income}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-ink-border pt-2">
              <dt className="text-dim">{t.eligibilityLabel}</dt>
              <dd className="text-right text-emerald-400">{t.loftyEligibility}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-dim">{t.loftyTax}</p>
          <a
            href={LOFTY.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold mt-6 inline-block self-start rounded-full px-5 py-2.5 text-sm"
          >
            {t.visitAt} {LOFTY.name}
          </a>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-dim">{t.plansNote}</p>
      </section>

      {properties.length > 0 && (
        <section className="mt-14">
          <h2 className="font-sans text-xl font-extrabold text-cream sm:text-2xl">
            {t.oppTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-dim">{t.oppBody}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <article
                key={p.url}
                className="flex flex-col overflow-hidden rounded-sm border border-ink-border bg-ink-panel"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={p.image}
                    alt={`${p.street}, ${p.city}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  {p.kind === "vacation" && (
                    <span className="absolute left-3 top-3 rounded-sm bg-gold px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide text-black">
                      {t.airbnbBadge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs uppercase tracking-wide text-gold">
                    {p.city}, {p.state}
                  </p>
                  <h3 className="mt-1 font-sans text-sm font-bold leading-snug text-cream">
                    {p.street}
                  </h3>
                  {p.kind !== "vacation" && (
                    <p className="mt-1 text-xs text-dim">{kindLabels[p.kind]}</p>
                  )}

                  <div className="mt-4 rounded-sm border border-gold/30 bg-gold/[0.04] p-4 text-center">
                    <p className="text-xs uppercase tracking-wide text-dim">{t.currentYieldLabel}</p>
                    <p className="num mt-1 text-4xl text-gold-gradient">{pct(p.currentYieldPct)} %</p>
                  </div>

                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-4 border-t border-ink-border pt-2">
                      <dt className="text-dim">{t.sharePriceLabel}</dt>
                      <dd className="num text-right text-cream">{money(p.sharePriceUsd)}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-ink-border pt-2">
                      <dt className="text-dim">{t.examplesLabel}</dt>
                      <dd className="text-right text-cream">
                        {fmt(t.sharesExample, {
                          a: Math.floor(100 / p.sharePriceUsd),
                          b: Math.floor(500 / p.sharePriceUsd),
                        })}
                      </dd>
                    </div>
                  </dl>

                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold mt-5 inline-block self-start rounded-full px-5 py-2.5 text-sm"
                  >
                    {t.visitAt} {LOFTY.name}
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-dim">
            {fmt(t.oppNote, {
              date: new Date().toLocaleDateString(nf, { dateStyle: "long" }),
            })}
          </p>
        </section>
      )}

      <section className="mt-14 rounded-sm border border-gold/30 bg-gold/[0.04] p-6">
        <h2 className="font-sans text-sm font-bold uppercase tracking-widetitle text-gold">
          {t.disclaimerTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-dim">{t.disclaimer}</p>
      </section>
    </div>
  );
}
