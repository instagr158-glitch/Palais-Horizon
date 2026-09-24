"use client";

import { useEffect, useState } from "react";
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

type ListingType = "rent" | "sale";
type Step = "type" | "destination" | "budget" | "searching" | "results";

const STEP_INDEX: Record<Step, number> = {
  type: 1,
  destination: 2,
  budget: 3,
  searching: 4,
  results: 4,
};

export function TrackWizard() {
  const { t } = useI18n();
  const router = useRouter();

  const [step, setStep] = useState<Step>("type");
  const [listingType, setListingType] = useState<ListingType | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [budget, setBudget] = useState(0);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const countryLabel: Record<string, string> = {
    thailand: t.listings.countryThailand,
    bali: t.listings.countryBali,
    dubai: t.listings.countryDubai,
    miami: t.listings.countryMiami,
  };

  const maxPriceThb = budget > 0 ? eurToThbEquivalent(budget) : undefined;

  // Once all three answers are in, run the (real) search: fetch how many
  // active listings actually match, with a short animated delay so the
  // "searching" moment reads as a live lookup rather than an instant flash.
  useEffect(() => {
    if (step !== "searching" || !listingType || !country) return;
    let cancelled = false;
    const params = new URLSearchParams({ country, listingType });
    if (maxPriceThb) params.set("maxPrice", String(maxPriceThb));

    const fetchCount = fetch(`/api/listings/count?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => (typeof data.count === "number" ? data.count : 0))
      .catch(() => 0);
    const minDelay = new Promise((resolve) => setTimeout(resolve, 1600));

    Promise.all([fetchCount, minDelay]).then(([count]) => {
      if (cancelled) return;
      setResultCount(count);
      setStep("results");
    });
    return () => {
      cancelled = true;
    };
  }, [step, listingType, country, maxPriceThb]);

  function goToPricing() {
    setRedirecting(true);
    const params = new URLSearchParams();
    if (listingType) params.set("listingType", listingType);
    if (country) params.set("country", country);
    if (maxPriceThb) params.set("maxPrice", String(maxPriceThb));
    router.push(`/pricing?${params.toString()}`);
  }

  function back() {
    if (step === "destination") setStep("type");
    else if (step === "budget") setStep("destination");
  }

  const showBack = step === "destination" || step === "budget";
  const totalSteps = 3;

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-lg flex-col justify-center px-4 py-16">
      <div className="mb-6 flex items-center justify-between">
        {showBack ? (
          <button
            onClick={back}
            aria-label={t.track.back}
            className="text-dim transition-colors hover:text-cream"
          >
            ←
          </button>
        ) : (
          <span />
        )}
        {step !== "searching" && step !== "results" && (
          <span className="num text-xs tracking-widetitle text-dim">
            {STEP_INDEX[step]} / {totalSteps}
          </span>
        )}
      </div>

      {step !== "searching" && step !== "results" && (
        <div className="mb-10 flex gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-1 flex-1 rounded-full ${
                STEP_INDEX[step] >= n ? "bg-gold" : "bg-ink-border"
              }`}
            />
          ))}
        </div>
      )}

      {step === "type" && (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-gold/[0.06] text-3xl">
            🏠
          </div>
          <p className="text-xs uppercase tracking-widetitle text-gold">
            {t.track.typeLabel}
          </p>
          <h1 className="mt-3 font-display text-2xl text-cream sm:text-3xl">
            {t.track.typeQuestion}
          </h1>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setListingType("rent");
                setStep("destination");
              }}
              className="rounded-xl border border-ink-border bg-ink-panel p-6 text-center transition-colors hover:border-gold/60 hover:bg-gold/[0.04]"
            >
              <span className="block text-3xl">🔑</span>
              <span className="mt-2 block text-sm text-cream">{t.track.typeRent}</span>
            </button>
            <button
              onClick={() => {
                setListingType("sale");
                setStep("destination");
              }}
              className="rounded-xl border border-ink-border bg-ink-panel p-6 text-center transition-colors hover:border-gold/60 hover:bg-gold/[0.04]"
            >
              <span className="block text-3xl">🔏</span>
              <span className="mt-2 block text-sm text-cream">{t.track.typeBuy}</span>
            </button>
          </div>
        </div>
      )}

      {step === "destination" && (
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
                onClick={() => {
                  setCountry(d);
                  setStep("budget");
                }}
                className="rounded-xl border border-ink-border bg-ink-panel p-6 text-center transition-colors hover:border-gold/60 hover:bg-gold/[0.04]"
              >
                <span className="block text-3xl">{FLAGS[d]}</span>
                <span className="mt-2 block text-sm text-cream">{countryLabel[d]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "budget" && (
        <div className="text-center">
          <p className="text-xs uppercase tracking-widetitle text-gold">
            {t.track.budgetLabel}
          </p>
          <h1 className="mt-3 font-display text-2xl text-cream sm:text-3xl">
            {listingType === "sale" ? t.track.budgetQuestionBuy : t.track.budgetQuestion}
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
            onClick={() => setStep("searching")}
            className="btn-gold mt-10 w-full rounded-full px-4 py-3 text-sm"
          >
            {t.track.continue} →
          </button>
        </div>
      )}

      {step === "searching" && (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-gold/[0.06] text-3xl">
            🔎
          </div>
          <p className="text-xs uppercase tracking-widetitle text-gold">
            {t.track.searchingLabel}
          </p>
          <h1 className="mt-3 font-display text-2xl text-cream sm:text-3xl">
            {t.track.searchingQuestion}
          </h1>
          <div className="mx-auto mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-ink-border">
            <div className="h-full w-1/3 animate-[track-scan_1.1s_ease-in-out_infinite] rounded-full bg-gold-gradient" />
          </div>
        </div>
      )}

      {step === "results" && (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-gold/[0.06] text-3xl">
            ✦
          </div>
          <p className="num text-5xl text-gold-gradient">{resultCount ?? 0}</p>
          <p className="mt-2 text-sm text-dim">
            {resultCount === 1 ? t.listings.countOne : t.listings.countOther}{" "}
            {t.track.resultsFound}
          </p>

          <button
            onClick={goToPricing}
            disabled={redirecting}
            className="btn-gold mt-8 w-full rounded-full px-4 py-3 text-sm disabled:opacity-60"
          >
            {redirecting ? t.pricing.redirecting : t.track.viewListingsCta}
          </button>
        </div>
      )}
    </div>
  );
}
