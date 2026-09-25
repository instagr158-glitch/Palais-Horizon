import { getServerDict } from "@/i18n/server";

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

export default async function InvestMiamiPage() {
  const t = (await getServerDict()).invest;
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

      <section className="mt-12">
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
