import type { Metadata } from "next";
import Image from "next/image";
import { PricingTable } from "@/components/PricingTable";
import { stripeConfigured, PRICE_IDS } from "@/lib/stripe";
import { getTeasers } from "@/lib/listings";
import { getServerDict } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDict();
  return { title: t.pricing.title };
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ locked?: string; canceled?: string }>;
}) {
  const sp = await searchParams;
  const t = await getServerDict();
  const [teaser] = await getTeasers(1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {sp.locked && (
        <p className="mb-6 rounded-sm border border-gold/40 bg-gold/5 px-4 py-3 text-sm text-gold">
          {t.pricing.lockedBanner}
        </p>
      )}
      {sp.canceled && (
        <p className="mb-6 rounded-sm border border-ink-border bg-ink-panel px-4 py-3 text-sm text-dim">
          {t.pricing.canceledBanner}
        </p>
      )}

      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        {/* visual + value — what membership actually unlocks */}
        <div>
          <h1 className="font-display text-3xl text-cream sm:text-4xl">
            {t.pricing.title}
          </h1>
          <p className="mt-3 max-w-xl text-sm text-dim sm:text-base">
            {t.pricing.body}
          </p>

          {teaser?.image && (
            <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-sm border border-ink-border">
              <Image
                src={teaser.image}
                alt={teaser.headline}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs uppercase tracking-widetitle text-silver">
                  {teaser.province}
                </p>
                <p className="mt-1 font-display text-lg capitalize text-cream">
                  {teaser.headline}
                </p>
              </div>
            </div>
          )}

          <ul className="mt-8 space-y-5">
            {t.landing.why.map((w) => (
              <li key={w.title} className="flex items-start gap-3">
                <span className="mt-0.5 text-gold">✦</span>
                <div>
                  <p className="font-medium text-cream">{w.title}</p>
                  <p className="mt-0.5 text-sm text-dim">{w.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* the plan itself */}
        <div>
          <PricingTable
            configured={stripeConfigured}
            prices={{ monthly: PRICE_IDS.monthly, annual: PRICE_IDS.annual }}
          />
        </div>
      </div>

      <div className="hr-gold my-12" />
      <p className="text-sm text-dim">{t.pricing.disclaimer}</p>
    </div>
  );
}
