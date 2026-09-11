"use client";

import { useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { PromoCountdown } from "@/components/PromoCountdown";

type Props = {
  configured: boolean;
  prices: { monthly?: string; annual?: string };
};

export function PricingTable({ configured, prices }: Props) {
  const { t } = useI18n();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // The annual plan only appears when an annual Stripe price is configured.
  const hasAnnual = !!prices.annual;

  const plans = [
    {
      id: "monthly" as const,
      name: t.pricing.monthlyLabel,
      price: "€19",
      approx: "≈ $21 · ฿700",
      unit: t.pricing.perMonth,
      note: t.pricing.billedMonthly,
      highlight: !hasAnnual,
    },
    ...(hasAnnual
      ? [
          {
            id: "annual" as const,
            name: t.pricing.annualLabel,
            price: "€190",
            approx: "≈ $210 · ฿7,000",
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
        body: JSON.stringify({ plan }),
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
                {t.pricing.promoBadge} · {t.pricing.promoLabel}
              </span>
            )}
            <p className="text-xs uppercase tracking-widetitle text-dim">
              {plan.name}
            </p>
            <p className="mt-3 flex items-baseline gap-1.5">
              {plan.id === "monthly" && (
                <span className="num text-2xl font-semibold text-red-500 line-through decoration-2">
                  {t.pricing.promoOriginal}
                </span>
              )}
              <span className="num text-[2.75rem] leading-none text-cream sm:text-5xl">
                {plan.price}
              </span>
              <span className="text-base text-silver">{plan.unit}</span>
            </p>
            <p className="num mt-2 text-sm text-silver">{plan.approx}</p>
            <p className="mt-2 text-sm text-gold">{plan.note}</p>
            {plan.id === "monthly" && (
              <div className="mt-3 flex items-center gap-2 rounded-sm border border-red-500/50 bg-red-500/10 px-3 py-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0 text-red-500"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm font-semibold text-red-500">
                  {t.pricing.promoEndsIn}{" "}
                  <span className="num text-base font-bold">
                    <PromoCountdown />
                  </span>
                </p>
              </div>
            )}

            <button
              onClick={() => choose(plan.id)}
              disabled={loading !== null}
              className="btn-gold mt-5 w-full rounded-sm px-4 py-3 text-sm disabled:opacity-60"
            >
              {loading === plan.id ? t.pricing.redirecting : t.pricing.cta}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-sm border border-gold/40 bg-gold/5 px-4 py-3 text-sm text-gold">
          {error}
        </p>
      )}

      <ul className="mt-8 grid gap-2 sm:grid-cols-2">
        {t.pricing.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-silver">
            <span className="mt-0.5 text-gold">✦</span>
            {f}
          </li>
        ))}
      </ul>

      {!configured && (
        <p className="mt-6 text-xs text-dim">{t.pricing.ownerNote}</p>
      )}
    </div>
  );
}
