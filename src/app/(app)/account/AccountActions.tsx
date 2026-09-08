"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useI18n } from "@/components/I18nProvider";

export function AccountActions({
  isMember,
  hasStripeCustomer,
}: {
  isMember: boolean;
  hasStripeCustomer: boolean;
}) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? t.account.portalError);
        setLoading(false);
      }
    } catch {
      setError(t.pricing.networkError);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-sm border border-gold/40 bg-gold/5 px-3 py-2 text-sm text-gold">
          {error}
        </p>
      )}

      {hasStripeCustomer ? (
        <button
          onClick={openPortal}
          disabled={loading}
          className="btn-ghost w-full rounded-sm px-4 py-2.5 text-sm disabled:opacity-60"
        >
          {loading ? t.account.opening : t.account.manageBilling}
        </button>
      ) : (
        <Link
          href="/pricing"
          className="btn-gold block w-full rounded-sm px-4 py-2.5 text-center text-sm"
        >
          {isMember ? t.account.viewMembership : t.account.startMembership}
        </Link>
      )}

      {!isMember && hasStripeCustomer && (
        <Link
          href="/pricing"
          className="btn-gold block w-full rounded-sm px-4 py-2.5 text-center text-sm"
        >
          {t.account.reactivate}
        </Link>
      )}

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full rounded-sm px-4 py-2.5 text-sm text-dim hover:text-cream"
      >
        {t.account.signOut}
      </button>
    </div>
  );
}
