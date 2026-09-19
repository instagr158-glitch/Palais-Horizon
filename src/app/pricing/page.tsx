import type { Metadata } from "next";
import Image from "next/image";
import { PricingTable } from "@/components/PricingTable";
import { stripeConfigured, PRICE_IDS } from "@/lib/stripe";
import { getServerDict } from "@/i18n/server";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80";

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
        {/* the payoff — a villa, and the one reason that matters */}
        <div>
          <h1 className="font-sans text-2xl font-extrabold leading-tight text-cream sm:text-4xl">
            {t.pricing.unlockTitle}
          </h1>

          <div className="relative mt-6 aspect-[16/9] max-h-72 overflow-hidden rounded-sm border border-ink-border">
            <Image
              src={HERO_IMAGE}
              alt={t.pricing.unlockTagline}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-display text-xl text-cream sm:text-2xl">
                {t.pricing.unlockTagline}
              </p>
            </div>
          </div>
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
