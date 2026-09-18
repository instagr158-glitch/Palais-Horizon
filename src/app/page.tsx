import Image from "next/image";
import { TrackedLink } from "@/components/TrackedLink";
import { FeatureTabs } from "@/components/FeatureTabs";
import { getCatalogStats } from "@/lib/listings";
import { getLocale } from "@/i18n/server";
import { getDictionary } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const t = getDictionary(await getLocale());
  const stats = await getCatalogStats();

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
            <span className="my-1 inline-block rounded-sm bg-gold/15 px-1.5 text-gold sm:whitespace-nowrap">
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

      {/* features — what the tool actually does, tab by tab */}
      <section className="mx-auto max-w-5xl px-4 pt-6 pb-14 text-center sm:px-6 sm:pt-10">
        <span className="inline-block rounded-full border border-gold/30 bg-gold/[0.06] px-4 py-1.5 text-xs uppercase tracking-widetitle text-gold">
          {t.landing.toolsBadge}
        </span>
        <h2 className="mx-auto mt-4 max-w-2xl font-sans text-2xl font-extrabold leading-[1.2] text-cream sm:text-4xl">
          {t.landing.toolsTitle}
        </h2>
        <div className="mt-8">
          <FeatureTabs />
        </div>
      </section>

      {/* global coverage — active market vs. upcoming expansion, never blurred together */}
      <section className="mx-auto max-w-5xl px-4 pt-6 pb-14 text-center sm:px-6 sm:pt-10">
        <span className="inline-block rounded-full border border-gold/30 bg-gold/[0.06] px-4 py-1.5 text-xs uppercase tracking-widetitle text-gold">
          {t.landing.coverageBadge}
        </span>
        <h2 className="mx-auto mt-4 max-w-2xl font-sans text-2xl font-extrabold leading-[1.2] text-cream sm:text-4xl">
          {t.landing.coverageTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-dim">
          {t.landing.coverageSubtext}
        </p>

        <div className="relative mx-auto mt-8 aspect-[2/1] max-w-4xl overflow-hidden rounded-sm border border-ink-border bg-ink">
          <Image src="/images/world-map.svg" alt="" fill className="object-cover" />

          <div
            className="absolute flex -translate-x-1/2 translate-y-3 flex-col items-center"
            style={{ left: "77.9%", top: "42.4%" }}
          >
            <p className="text-[10px] font-semibold text-gold sm:text-xs">
              {t.landing.coverageThailand}
            </p>
          </div>
          <div
            className="absolute left-[19%] top-[46%] flex -translate-x-1/2 flex-col items-center sm:left-[27.7%] sm:top-[35.7%] sm:translate-y-3"
          >
            <p className="text-[10px] font-semibold text-gold sm:text-xs">
              {t.landing.coverageMiami}
            </p>
          </div>
          <div
            className="absolute flex -translate-x-1/2 translate-y-3 flex-col items-center"
            style={{ left: "65.4%", top: "36.0%" }}
          >
            <p className="text-[10px] font-semibold text-gold sm:text-xs">
              {t.landing.coverageDubai}
            </p>
          </div>
          <div
            className="absolute flex -translate-x-1/2 translate-y-3 flex-col items-center"
            style={{ left: "82.0%", top: "54.8%" }}
          >
            <p className="text-[10px] font-semibold text-gold sm:text-xs">
              {t.landing.coverageBali}
            </p>
          </div>

          {/* coming-soon markets — gray. Positions are spread out further on
              mobile (base classes) than on desktop (sm:), since the same
              percentage gap is much tighter in absolute pixels on a small
              screen; the dots themselves stay at their true map position,
              only the text labels move. */}
          <div className="absolute left-[38%] top-[7%] flex -translate-x-1/2 flex-col items-center sm:left-[46%] sm:top-[16%]">
            <p className="text-[10px] text-dim sm:text-xs">{t.landing.coverageUK}</p>
          </div>
          <div className="absolute left-[66%] top-[7%] flex -translate-x-1/2 flex-col items-center sm:left-[59%] sm:top-[16%]">
            <p className="text-[10px] text-dim sm:text-xs">
              {t.landing.coverageNetherlands}
            </p>
          </div>
          <div className="absolute left-[52%] top-[16%] flex -translate-x-1/2 flex-col items-center sm:left-[52%] sm:top-[27.5%]">
            <p className="text-[10px] text-dim sm:text-xs">{t.landing.coverageFrance}</p>
          </div>
          <div className="absolute left-[34%] top-[21%] flex -translate-x-1/2 flex-col items-center sm:left-[29.4%] sm:top-[27.4%] sm:translate-y-3">
            <p className="text-[10px] text-dim sm:text-xs">{t.landing.coverageNewYork}</p>
          </div>
          <div className="absolute left-[11%] top-[27%] flex -translate-x-1/2 flex-col items-center sm:left-[17.2%] sm:top-[31.1%] sm:translate-y-3">
            <p className="text-[10px] text-dim sm:text-xs">
              {t.landing.coverageLosAngeles}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-dim">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gold" /> {t.landing.coverageActive}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border border-gold/70" /> {t.landing.coverageSoon}
          </span>
        </div>
      </section>

      {/* price comparison — the real reason a second opinion pays off */}
      <section className="border-y border-ink-border bg-ink-panel/40">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <span className="inline-block rounded-full border border-gold/30 bg-gold/[0.06] px-4 py-1.5 text-xs uppercase tracking-widetitle text-gold">
            {t.landing.compareBadge}
          </span>
          <h2 className="mx-auto mt-4 font-sans text-2xl font-extrabold leading-[1.2] text-cream sm:text-4xl">
            {t.landing.compareTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-dim sm:text-base">
            {t.landing.compareBody}
          </p>

          <div className="mx-auto mt-8 flex h-32 max-w-md items-end justify-center gap-2 sm:h-40">
            {[35, 50, 62, 72, 80, 88, 94, 100, 90].map((h, i) => (
              <div
                key={i}
                className={`w-full rounded-t-sm ${
                  i === 0 ? "bg-gold-gradient" : "bg-ink-panel2"
                }`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-gold">{t.landing.compareChartCaption}</p>

          <div className="mx-auto mt-8 max-w-sm rounded-sm border border-gold/30 bg-gold/[0.04] px-5 py-4">
            <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-left">
              <span className="text-sm text-dim">{t.landing.compareStatLabel}</span>
              <span className="num whitespace-nowrap text-2xl text-gold-gradient">
                {t.landing.compareStatValue}
              </span>
            </div>
          </div>

          <div className="mt-10 rounded-sm border border-gold/30 bg-gold/[0.04] p-6 text-center">
            <p className="font-display text-xl text-cream">{t.landing.unlockBanner}</p>
            <TrackedLink
              href="/pricing"
              event="view_membership_click"
              location="unlock_banner"
              className="btn-gold mt-4 inline-block rounded-sm px-6 py-2.5 text-sm"
            >
              {t.landing.heroCta}
            </TrackedLink>
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
