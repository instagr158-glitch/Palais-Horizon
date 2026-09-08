import Link from "next/link";
import { LogoSvg } from "@/components/Logo";
import { LockedTeaserCard } from "@/components/LockedTeaserCard";
import { getTeasers, getCatalogStats } from "@/lib/listings";
import { getLocale } from "@/i18n/server";
import { getDictionary } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [teasers, stats] = await Promise.all([getTeasers(6), getCatalogStats()]);

  return (
    <div className="grain relative">
      {/* hero */}
      <section className="relative overflow-hidden border-b border-ink-border">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-4">
              <LogoSvg size={64} />
              <span className="font-display text-2xl font-semibold tracking-[0.16em]">
                PALAIS <span className="text-gold-gradient">HORIZON</span>
              </span>
            </div>
            <p className="text-xs uppercase tracking-widetitle text-gold">
              {t.landing.heroKicker}
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-tight text-cream sm:text-6xl">
              {t.landing.heroTitle}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-dim">
              {t.landing.heroBody}
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link href="/pricing" className="btn-gold rounded-sm px-6 py-3 text-sm">
                {t.landing.heroCta}
              </Link>
              <a href="#how" className="btn-ghost rounded-sm px-6 py-3 text-sm">
                {t.landing.heroCtaSecondary}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm text-dim">
              <span>
                <span className="font-display text-2xl text-cream">{stats.total}</span>{" "}
                {t.landing.statResidences}
              </span>
              <span>
                <span className="font-display text-2xl text-cream">
                  {stats.provinceCount}
                </span>{" "}
                {t.landing.statRegions}
              </span>
              <span>
                <span className="font-display text-2xl text-cream">฿15M+</span>{" "}
                {t.landing.statEntry}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* teasers */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl text-cream">
              {t.landing.teaserTitle}
            </h2>
            <p className="mt-2 max-w-xl text-dim">{t.landing.teaserBody}</p>
          </div>
          <Link
            href="/register"
            className="hidden shrink-0 text-sm text-gold hover:underline sm:block"
          >
            {t.landing.teaserCreate} →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {teasers.map((teaser) => (
            <LockedTeaserCard
              key={teaser.id}
              teaser={teaser}
              t={t}
              locale={locale}
            />
          ))}
        </div>

        <div className="mt-10 rounded-sm border border-gold/30 bg-gold/[0.04] p-6 text-center">
          <p className="font-display text-xl text-cream">
            {t.landing.unlockBanner}
          </p>
          <Link
            href="/pricing"
            className="btn-gold mt-4 inline-block rounded-sm px-6 py-2.5 text-sm"
          >
            {t.pricing.title}
          </Link>
        </div>
      </section>

      {/* why */}
      <section className="border-y border-ink-border bg-ink-panel/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl text-cream">{t.landing.whyTitle}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.landing.why.map((w) => (
              <div key={w.title} className="panel rounded-sm p-5">
                <div className="mb-3 h-8 w-8 rounded-sm bg-gold-gradient" />
                <h3 className="font-display text-lg text-cream">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dim">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl text-cream">{t.landing.howTitle}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {t.landing.how.map((h) => (
            <div key={h.step} className="border-l border-gold/40 pl-5">
              <p className="font-display text-3xl text-gold-gradient">{h.step}</p>
              <h3 className="mt-2 font-display text-xl text-cream">{h.title}</h3>
              <p className="mt-2 text-sm text-dim">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* faq */}
      <section className="border-t border-ink-border bg-ink-panel/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl text-cream">{t.landing.faqTitle}</h2>
          <div className="mt-8 space-y-6">
            {t.landing.faq.map((f) => (
              <div key={f.q}>
                <h3 className="font-display text-lg text-cream">{f.q}</h3>
                <p className="mt-1 text-sm leading-relaxed text-dim">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="hr-gold my-10" />
          <div className="text-center">
            <p className="font-display text-2xl text-cream">{t.tagline}</p>
            <Link
              href="/register"
              className="btn-gold mt-4 inline-block rounded-sm px-6 py-2.5 text-sm"
            >
              {t.nav.join}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
