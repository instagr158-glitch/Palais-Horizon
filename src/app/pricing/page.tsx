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
          <div className="relative aspect-[16/9] max-h-72 overflow-hidden rounded-sm border border-ink-border bg-ink-panel">
            <RadarIcon />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-panel via-ink-panel/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-5 text-center">
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

/** A continuously sweeping radar filling the whole panel, standing in for a
 * live agent scanning every agency's listings — not a static stock photo. */
function RadarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full text-gold"
    >
      <circle cx="12" cy="12" r="11.5" stroke="currentColor" strokeWidth="0.4" opacity="0.2" fill="none" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="0.4" opacity="0.28" fill="none" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="0.4" opacity="0.38" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="0.4" opacity="0.5" fill="none" />
      <line x1="0.5" y1="12" x2="23.5" y2="12" stroke="currentColor" strokeWidth="0.25" opacity="0.15" />
      <line x1="12" y1="0.5" x2="12" y2="23.5" stroke="currentColor" strokeWidth="0.25" opacity="0.15" />
      <g style={{ transformOrigin: "12px 12px", animation: "radar-sweep 2.4s linear infinite" }}>
        <path d="M12 12 L12 0.5 A11.5 11.5 0 0 1 21.6 6.1 Z" fill="currentColor" opacity="0.18" />
      </g>
      <circle
        cx="17.5"
        cy="7"
        r="0.35"
        fill="currentColor"
        style={{ transformOrigin: "17.5px 7px", animation: "radar-blip 2.4s ease-in-out infinite" }}
      />
      <circle
        cx="6"
        cy="16.5"
        r="0.3"
        fill="currentColor"
        style={{ transformOrigin: "6px 16.5px", animation: "radar-blip 2.4s ease-in-out infinite 0.8s" }}
      />
      <circle
        cx="16"
        cy="17"
        r="0.28"
        fill="currentColor"
        style={{ transformOrigin: "16px 17px", animation: "radar-blip 2.4s ease-in-out infinite 1.6s" }}
      />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
}
