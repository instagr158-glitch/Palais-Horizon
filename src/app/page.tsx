import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { getServerDict } from "@/i18n/server";
import type { Dict } from "@/i18n";
import { queryListings } from "@/lib/listings";
import { HeroSkeleton } from "@/components/ParisSkeleton";
import { PartsHero } from "@/components/PartsHero";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

async function HeroSection({ t }: { t: Dict["funnel"] }) {
  // The hero only needs background photos: if the database is unreachable the
  // test funnel (the actual point of this page) must still render.
  const photos = await queryListings({
    country: "thailand",
    listingType: "sale",
    sort: "recent",
    perPage: 12,
  })
    .then(({ listings }) =>
      listings
        .filter((l) => l.propertyType !== "land" && l.images[0])
        .slice(0, 5)
        .map((l) => l.images[0]),
    )
    .catch(() => [] as string[]);

  return (
    <PartsHero
      photos={photos}
      eyebrow={t.badge}
      lead={t.titleLead}
      trail={t.titleTrail}
      cta={t.cta}
      ctaHref="/test"
      subtitle={t.subtitle}
      bullets={t.promise}
      stats={[]}
    />
  );
}

export default async function HomePage() {
  const dict = await getServerDict();
  const t = dict.funnel;
  const session = await auth();
  const isMember = hasActiveSubscription(session?.user);

  const steps = [
    { title: t.step1Title, body: t.step1Body },
    { title: t.step2Title, body: t.step2Body },
    { title: t.step3Title, body: t.step3Body },
  ];

  return (
    <div>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection t={t} />
      </Suspense>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="py-16 sm:py-24">
          <h2 className="mb-8 text-center font-display text-3xl font-semibold text-cream sm:text-5xl">{t.howTitle}</h2>
          <ol className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {steps.map((step, i) => (
              <Reveal key={step.title} delayMs={i * 120}>
                <li className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 sm:p-7">
                  <span className="num pointer-events-none absolute -right-2 -top-6 font-display text-[7rem] font-semibold leading-none text-gold/10">
                    {i + 1}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-sm font-semibold text-gold">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-cream">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dim">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="mt-8 sm:flex sm:justify-center">
            <Link
              href="/test"
              className="btn-gold flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-bold sm:inline-flex sm:w-auto"
            >
              {t.cta}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        <section className="pb-16 sm:pb-24">
          <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-6 sm:p-10">
            <h2 className="font-display text-3xl font-semibold text-cream sm:text-4xl">{t.offerTitle}</h2>
            <p className="mt-2 max-w-2xl text-silver">{t.offerLead}</p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {t.offerFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-cream">
                  <span className="mt-0.5 text-emerald-500">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={isMember ? "/test" : "/pricing-expat"}
              className="btn-gold mt-6 flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-bold sm:inline-flex sm:w-auto"
            >
              {isMember ? t.reportCta : t.offerCta}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
