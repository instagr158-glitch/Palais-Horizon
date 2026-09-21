"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

const BUDGET_MAX = 20000;
const BUDGET_STEP = 100;

// Same conversion the rest of the site uses (src/lib/listings.ts,
// src/ingest/normalize.ts) to go from an indicative EUR figure to the raw
// THB-equivalent value the /listings maxPrice filter expects.
const USD_TO_EUR = 0.92;
const THB_PER_USD = 34.5;

function eurToThbEquivalent(eur: number): number {
  return Math.round((eur / USD_TO_EUR) * THB_PER_USD);
}

const DESTINATIONS = ["thailand", "bali", "dubai", "miami"] as const;
const FLAGS: Record<(typeof DESTINATIONS)[number], string> = {
  thailand: "🇹🇭",
  bali: "🇮🇩",
  dubai: "🇦🇪",
  miami: "🇺🇸",
};

export function TrackWizard() {
  const { t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [budget, setBudget] = useState(0);

  const countryLabel: Record<string, string> = {
    thailand: t.listings.countryThailand,
    bali: t.listings.countryBali,
    dubai: t.listings.countryDubai,
    miami: t.listings.countryMiami,
  };

  function chooseDestination(country: string) {
    const params = new URLSearchParams({
      country,
      listingType: "rent",
      sort: "price_asc",
    });
    if (budget > 0) {
      params.set("maxPrice", String(eurToThbEquivalent(budget)));
    }
    router.push(`/listings?${params.toString()}`);
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-lg flex-col justify-center px-4 py-16">
      <div className="mb-6 flex items-center justify-between">
        {step === 2 ? (
          <button
            onClick={() => setStep(1)}
            aria-label={t.track.back}
            className="text-dim transition-colors hover:text-cream"
          >
            ←
          </button>
        ) : (
          <span />
        )}
        <span className="num text-xs tracking-widetitle text-dim">{step} / 2</span>
      </div>

      <div className="mb-10 flex gap-2">
        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-gold" : "bg-ink-border"}`} />
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-gold" : "bg-ink-border"}`} />
      </div>

      {step === 1 ? (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-gold/[0.06] text-3xl">
            🎯
          </div>
          <p className="text-xs uppercase tracking-widetitle text-gold">
            {t.track.budgetLabel}
          </p>
          <h1 className="mt-3 font-display text-2xl text-cream sm:text-3xl">
            {t.track.budgetQuestion}
          </h1>

          <p className="num mt-8 text-5xl text-gold-gradient">
            {budget.toLocaleString("fr-FR")} €
          </p>
          <p className="mt-2 text-xs uppercase tracking-widetitle text-dim">
            {t.track.budgetHint}
          </p>

          <input
            type="range"
            min={0}
            max={BUDGET_MAX}
            step={BUDGET_STEP}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-8 w-full accent-gold"
            aria-label={t.track.budgetQuestion}
          />
          <div className="mt-2 flex justify-between text-xs text-dim">
            <span className="text-left">
              0 €
              <br />
              {t.track.budgetMinHint}
            </span>
            <span className="text-right">
              {BUDGET_MAX.toLocaleString("fr-FR")} €
              <br />
              {t.track.budgetMaxHint}
            </span>
          </div>

          <button
            onClick={() => setStep(2)}
            className="btn-gold mt-10 w-full rounded-sm px-4 py-3 text-sm"
          >
            {t.track.continue} →
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xs uppercase tracking-widetitle text-gold">
            {t.track.destinationLabel}
          </p>
          <h1 className="mt-3 font-display text-2xl text-cream sm:text-3xl">
            {t.track.destinationQuestion}
          </h1>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {DESTINATIONS.map((d) => (
              <button
                key={d}
                onClick={() => chooseDestination(d)}
                className="rounded-sm border border-ink-border bg-ink-panel p-6 text-center transition-colors hover:border-gold/60 hover:bg-gold/[0.04]"
              >
                <span className="block text-3xl">{FLAGS[d]}</span>
                <span className="mt-2 block text-sm text-cream">
                  {countryLabel[d]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
