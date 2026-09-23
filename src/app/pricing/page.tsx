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

      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        {/* the payoff — a live agent scanning for listings, not a stock photo */}
        <div>
          <div className="relative flex aspect-[16/9] max-h-72 flex-col items-center justify-center gap-5 overflow-hidden rounded-sm border border-ink-border bg-ink-panel">
            <RadarIcon />
            <p className="font-display text-xl text-cream sm:text-2xl">
              {t.pricing.unlockTagline}
            </p>
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

/** A continuously sweeping radar, standing in for a live agent scanning
 * every agency's listings — not a static stock photo. */
function RadarIcon() {
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.06]">
      <svg width="52" height="52" viewBox="0 0 24 24" className="text-gold">
        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1" opacity="0.25" fill="none" />
        <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1" opacity="0.35" fill="none" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1" opacity="0.45" fill="none" />
        <g style={{ transformOrigin: "12px 12px", animation: "radar-sweep 2.4s linear infinite" }}>
          <path d="M12 12 L12 2.5 A9.5 9.5 0 0 1 18.7 5.3 Z" fill="currentColor" opacity="0.22" />
        </g>
        <circle
          cx="16"
          cy="8"
          r="0.9"
          fill="currentColor"
          style={{ transformOrigin: "16px 8px", animation: "radar-blip 2.4s ease-in-out infinite" }}
        />
        <circle
          cx="7.5"
          cy="15"
          r="0.7"
          fill="currentColor"
          style={{ transformOrigin: "7.5px 15px", animation: "radar-blip 2.4s ease-in-out infinite 1.2s" }}
        />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    </div>
  );
}
