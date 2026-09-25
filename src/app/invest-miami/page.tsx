import Image from "next/image";
import { getServerDict } from "@/i18n/server";
import { getLoftyProperties } from "@/lib/lofty";

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
  const properties = await getLoftyProperties();
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
        <p className="mx-auto mt-4 max-w-xl text-sm text-dim sm:text-base">{t.subtitle}</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <h2 className="mt-1 font-sans text-sm font-bold text-cream">{p.street}</h2>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-dim">{t.yieldLabel}</p>
                  <p className="num text-3xl text-gold-gradient">{pct(p.currentYieldPct)} %</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-dim">{t.sharePriceLabel}</p>
                  <p className="num text-lg text-cream">{money(p.sharePriceUsd)}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-dim">
                {fmt(t.sharesExample, {
                  a: Math.floor(100 / p.sharePriceUsd),
                  b: Math.floor(500 / p.sharePriceUsd),
                })}
              </p>

              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-5 inline-block self-start rounded-full px-5 py-2.5 text-sm"
              >
                {t.buy}
              </a>
            </div>
          </article>
        ))}
      </div>

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
