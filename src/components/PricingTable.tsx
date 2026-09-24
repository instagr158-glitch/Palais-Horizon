"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

type Props = {
  configured: boolean;
  prices: { monthly?: string; annual?: string };
};

export function PricingTable({ configured, prices }: Props) {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Carried over from the Track quiz (see TrackWizard.tsx), which now runs
  // *before* this page — these ride along into Stripe as metadata so the
  // post-payment success page can hand the member a pre-filtered catalogue.
  const preferences = {
    listingType: searchParams.get("listingType") ?? undefined,
    country: searchParams.get("country") ?? undefined,
    maxPrice: searchParams.get("maxPrice") ?? undefined,
  };

  // The annual plan only appears when an annual Stripe price is configured.
  const hasAnnual = !!prices.annual;

  const plans = [
    {
      id: "monthly" as const,
      name: t.pricing.monthlyLabel,
      price: "€19",
      approx: "≈ $21",
      unit: t.pricing.perMonth,
      note: t.pricing.cancelAnytime,
      highlight: !hasAnnual,
    },
    ...(hasAnnual
      ? [
          {
            id: "annual" as const,
            name: t.pricing.annualLabel,
            price: "€190",
            approx: "≈ $210",
            unit: t.pricing.perYear,
            note: t.pricing.annualNote,
            highlight: true,
          },
        ]
      : []),
  ];

  async function choose(plan: "monthly" | "annual") {
    setError(null);
    if (!configured || !prices[plan]) {
      setError(t.pricing.notConfigured);
      return;
    }
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, preferences }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? t.pricing.networkError);
        setLoading(null);
      }
    } catch {
      setError(t.pricing.networkError);
      setLoading(null);
    }
  }

  return (
    <div>
      <div
        className={`grid gap-5 ${
          plans.length > 1 ? "sm:grid-cols-2" : "sm:max-w-sm"
        }`}
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-sm border p-5 sm:p-6 ${
              plan.highlight
                ? "border-gold/60 bg-gold/[0.04] shadow-gold"
                : "border-ink-border bg-ink-panel"
            }`}
          >
            {plan.highlight && plans.length > 1 && (
              <span className="absolute -top-3 right-5 rounded-sm bg-gold px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-black">
                {t.pricing.bestValue}
              </span>
            )}
            {plan.id === "monthly" && (
              <span className="absolute -top-3 left-5 rounded-sm bg-gold px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-black">
                {t.pricing.promoLabel}
              </span>
            )}
            <p className="text-xs uppercase tracking-widetitle text-dim">
              {plan.name}
            </p>
            <p className="mt-3 flex items-baseline gap-1.5">
              <span className="num text-[2.75rem] leading-none text-cream sm:text-5xl">
                {plan.price}
              </span>
              <span className="text-base text-silver">{plan.unit}</span>
            </p>
            <p className="num mt-2 text-sm text-silver">{plan.approx}</p>
            {plan.note && <p className="mt-2 text-sm text-gold">{plan.note}</p>}

            <button
              onClick={() => choose(plan.id)}
              disabled={loading !== null}
              className="btn-gold mt-5 w-full rounded-full px-4 py-3 text-sm disabled:opacity-60"
            >
              {loading === plan.id ? t.pricing.redirecting : t.pricing.cta}
            </button>

            <ul className="mt-5 grid gap-2 border-t border-ink-border pt-5">
              {t.pricing.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-silver">
                  <span className="mt-0.5 text-emerald-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-sm border border-gold/40 bg-gold/5 px-4 py-3 text-sm text-gold">
          {error}
        </p>
      )}

      {!configured && (
        <p className="mt-6 text-xs text-dim">{t.pricing.ownerNote}</p>
      )}
    </div>
  );
}
