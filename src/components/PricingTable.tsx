"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { isKnownInAppBrowser } from "@/lib/inAppBrowserEscape";

type Props = {
  configured: boolean;
  prices: { monthly?: string; annual?: string };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PricingTable({ configured, prices }: Props) {
  const { t } = useI18n();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSentFor, setEmailSentFor] = useState<string | null>(null);

  useEffect(() => {
    setInAppBrowser(isKnownInAppBrowser(navigator.userAgent));
  }, []);

  // The annual plan only appears when an annual Stripe price is configured.
  const hasAnnual = !!prices.annual;

  const plans = [
    {
      id: "monthly" as const,
      name: t.pricing.monthlyLabel,
      price: "€19",
      approx: "≈ $21 · ฿700",
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

    // TikTok/Instagram/Facebook's in-app browsers block navigation straight
    // to Stripe — email a link back to this site instead, so opening it in
    // a real mail app breaks the visitor out of the in-app browser, lands
    // them on familiar Palais Horizon branding, and they click Continue
    // themselves from there.
    if (inAppBrowser) {
      if (!EMAIL_RE.test(email)) {
        setError(t.pricing.emailInvalid);
        return;
      }
      setLoading(plan);
      try {
        const res = await fetch("/api/checkout/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
          setEmailSentFor(plan);
        } else {
          setError(data.error ?? t.pricing.networkError);
        }
      } catch {
        setError(t.pricing.networkError);
      }
      setLoading(null);
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
            {plan.note && <p className="mt-2 text-sm text-gold">{plan.note}</p>}

            {emailSentFor === plan.id ? (
              <p className="mt-5 rounded-sm border border-gold/40 bg-gold/5 px-4 py-3 text-sm text-gold">
                {t.pricing.emailSent}
              </p>
            ) : (
              <>
                {inAppBrowser && (
                  <div className="mt-4">
                    <label className="mb-1 block text-xs text-dim">
                      {t.pricing.emailHint}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.pricing.emailPlaceholder}
                      className="w-full rounded-sm px-3 py-2 text-sm"
                      autoComplete="email"
                    />
                  </div>
                )}
                <button
                  onClick={() => choose(plan.id)}
                  disabled={loading !== null}
                  className="btn-gold mt-4 w-full rounded-sm px-4 py-3 text-sm disabled:opacity-60"
                >
                  {loading === plan.id
                    ? inAppBrowser
                      ? t.pricing.emailSending
                      : t.pricing.redirecting
                    : inAppBrowser
                      ? t.pricing.emailCta
                      : t.pricing.cta}
                </button>
              </>
            )}
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
