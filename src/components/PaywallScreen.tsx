"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export function PaywallScreen() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="mb-5 text-gold">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="10" width="16" height="11" rx="2" fill="currentColor" opacity="0.9" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="font-display text-3xl text-cream">{t.paywall.expiredTitle}</h1>
      <p className="mt-3 text-dim">{t.paywall.expiredBody}</p>
      <Link href="/pricing" className="btn-gold mt-6 rounded-sm px-6 py-2.5 text-sm">
        {t.paywall.expiredCta}
      </Link>
    </div>
  );
}
