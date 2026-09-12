import { TrackedLink } from "@/components/TrackedLink";
import { LockedTeaserCard } from "@/components/LockedTeaserCard";
import { getTeasers, getCatalogStats } from "@/lib/listings";
import { getLocale } from "@/i18n/server";
import { getDictionary } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const [teasers, stats] = await Promise.all([getTeasers(9), getCatalogStats()]);

  return (
    <div className="grain relative">
      {/* intro — short, no hard sell yet */}
      <section className="relative overflow-hidden border-b border-ink-border">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-6 sm:px-6 sm:pt-14 sm:pb-10">
          <p className="text-xs uppercase tracking-widetitle text-gold">
            {t.landing.heroKicker}
          </p>
          <h1 className="mt-2 max-w-3xl font-display text-2xl leading-[1.15] text-cream sm:text-4xl lg:text-5xl">
            {t.landing.heroTitle}
          </h1>
          <ul className="mt-4 flex flex-col gap-1.5 sm:gap-2">
            {t.landing.heroBullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-dim sm:text-base">
                <span className="mt-0.5 text-gold">✦</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* photo showcase — the collection, front and centre */}
      <section className="mx-auto max-w-7xl px-4 pt-6 pb-14 sm:px-6 sm:pt-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl text-cream sm:text-3xl">
              {t.landing.teaserTitle}
            </h2>
            <p className="mt-2 hidden max-w-xl text-dim sm:block">{t.landing.teaserBody}</p>
          </div>
          <TrackedLink
            href="/pricing"
            event="view_membership_click"
            location="teaser_link"
            className="hidden shrink-0 text-sm text-gold hover:underline sm:block"
          >
            {t.landing.teaserCreate} →
          </TrackedLink>
        </div>

        <div className="mt-4 grid gap-5 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
          {teasers.map((teaser) => (
            <LockedTeaserCard
              key={teaser.id}
              teaser={teaser}
              t={t}
              locale={locale}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-5 rounded-sm border border-ink-border bg-ink-panel/60 px-6 py-6 text-center">
          <div>
            <p className="num text-2xl text-gold-gradient sm:text-3xl">
              {stats.total}+
            </p>
            <p className="mt-0.5 text-xs text-dim sm:text-sm">
              {t.landing.statListingsSuffix}
            </p>
          </div>
          <div>
            <p className="num text-2xl text-gold-gradient sm:text-3xl">
              {stats.provinceCount}
            </p>
            <p className="mt-0.5 text-xs text-dim sm:text-sm">
              {t.landing.statRegionsSuffix}
            </p>
          </div>
          <div>
            <p className="num text-2xl text-gold-gradient sm:text-3xl">
              {stats.agencyCount}+
            </p>
            <p className="mt-0.5 text-xs text-dim sm:text-sm">
              {t.landing.statAgenciesSuffix}
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-sm border border-gold/30 bg-gold/[0.04] p-6 text-center">
          <p className="font-display text-xl text-cream">
            {t.landing.unlockBanner}
          </p>
          <TrackedLink
            href="/pricing"
            event="view_membership_click"
            location="unlock_banner"
            className="btn-gold mt-4 inline-block rounded-sm px-6 py-2.5 text-sm"
          >
            {t.landing.heroCta}
          </TrackedLink>
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
              <p className="num text-2xl text-gold-gradient">{h.step}</p>
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
            <TrackedLink
              href="/pricing"
              event="view_membership_click"
              location="faq"
              className="btn-gold mt-4 inline-block rounded-sm px-6 py-2.5 text-sm"
            >
              {t.nav.join}
            </TrackedLink>
          </div>
        </div>
      </section>
    </div>
  );
}
