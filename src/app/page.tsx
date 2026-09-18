import Image from "next/image";
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
        <Image
          src="/images/hero-flag.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative mx-auto max-w-2xl px-4 pt-10 pb-10 text-center sm:px-6 sm:pt-16 sm:pb-14">
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-ink-border bg-ink-panel/80 px-4 py-2 text-xs text-dim">
              <span className="text-cream">
                {stats.total}+ {t.landing.statListingsSuffix}
              </span>
              <span aria-hidden className="text-ink-border">
                ·
              </span>
              <span className="text-cream">
                {stats.agencyCount}+ {t.landing.statAgenciesSuffix}
              </span>
            </div>
          </div>
          <h1 className="mx-auto mt-5 max-w-xl font-sans text-2xl font-extrabold leading-[1.25] text-cream sm:text-5xl sm:leading-[1.15]">
            <span className="block">{t.landing.heroTitleLead.trim()}</span>
            <span className="my-1 inline-block whitespace-nowrap rounded-sm bg-gold/15 px-1.5 text-gold">
              {t.landing.heroTitleHighlight}
            </span>
            <span className="block">{t.landing.heroTitleTrail.trim()}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-dim sm:text-base">
            {t.landing.heroSubtext}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <TrackedLink
              href="/pricing"
              event="view_membership_click"
              location="hero_primary"
              className="btn-gold inline-block rounded-sm px-6 py-3 text-sm"
            >
              {t.landing.heroCtaPrimary}
            </TrackedLink>
            <a
              href="#demo"
              className="inline-block rounded-sm border border-ink-border px-6 py-3 text-sm text-cream transition hover:border-gold/50"
            >
              {t.landing.heroCtaDemo}
            </a>
          </div>
        </div>
      </section>

      {/* product demo — the tool itself, not a listing */}
      <section id="demo" className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="overflow-hidden rounded-sm border border-ink-border shadow-gold">
          <div className="flex items-center gap-1.5 border-b border-ink-border bg-ink-panel px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <video
            src="/videos/product-demo.mp4"
            poster="/images/product-demo-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            className="w-full"
          />
        </div>
        <p className="mt-4 text-center text-sm text-dim">{t.landing.demoCaption}</p>
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
