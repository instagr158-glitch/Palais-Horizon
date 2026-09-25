import { getServerDict } from "@/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.invest.badge };
}

const LOFTY = { name: "Lofty", url: "https://www.lofty.ai", sharePriceUsd: 50 };

function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export default async function InvestMiamiPage() {
  const t = (await getServerDict()).invest;

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
