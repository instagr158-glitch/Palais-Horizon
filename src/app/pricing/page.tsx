import type { Metadata } from "next";
import { PricingTable } from "@/components/PricingTable";
import { stripeConfigured, PRICE_IDS } from "@/lib/stripe";
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

      <div className="mx-auto max-w-md">
        <PricingTable
          configured={stripeConfigured}
          prices={{ monthly: PRICE_IDS.monthly, annual: PRICE_IDS.annual }}
        />
      </div>

      <div className="hr-gold my-12" />
      <p className="text-sm text-dim">{t.pricing.disclaimer}</p>
    </div>
  );
}
