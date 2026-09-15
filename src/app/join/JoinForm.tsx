"use client";

import { useState } from "react";
import { useI18n } from "@/components/I18nProvider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function JoinForm() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!EMAIL_RE.test(email)) {
      setError(t.pricing.emailInvalid);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
      } else {
        setError(data.error ?? t.pricing.networkError);
      }
    } catch {
      setError(t.pricing.networkError);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <p className="mt-8 rounded-sm border border-gold/40 bg-gold/5 px-4 py-3 text-sm text-gold">
        {t.pricing.emailSent}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      {error && (
        <p className="rounded-sm border border-gold/40 bg-gold/5 px-3 py-2 text-sm text-gold">
          {error}
        </p>
      )}
      <div>
        <label className="mb-1 block text-xs uppercase tracking-widetitle text-dim">
          {t.auth.emailLabel}
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.pricing.emailPlaceholder}
          className="w-full rounded-sm px-3 py-2 text-sm"
          autoComplete="email"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full rounded-sm px-4 py-2.5 text-sm disabled:opacity-60"
      >
        {loading ? t.pricing.emailSending : t.pricing.emailCta}
      </button>
    </form>
  );
}
