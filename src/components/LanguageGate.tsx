"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, getDictionary, type Locale } from "@/i18n";
import { setLocaleCookie } from "@/components/I18nProvider";
import { LogoSvg } from "@/components/Logo";

/**
 * Shown on the first visit (no NEXT_LOCALE cookie yet) so the visitor picks
 * a language on arrival. `initialLocale` is the Accept-Language best guess used
 * to label the screen until they choose.
 */
export function LanguageGate({ initialLocale }: { initialLocale: Locale }) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);
  const t = getDictionary(initialLocale);

  if (dismissed) return null;

  function choose(locale: Locale) {
    setLocaleCookie(locale);
    setDismissed(true);
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-sm border border-ink-border bg-ink-panel p-8 text-center shadow-panel">
        <div className="mb-5 flex justify-center">
          <LogoSvg size={56} />
        </div>
        <p className="font-display text-xl font-semibold tracking-[0.14em] text-cream">
          PALAIS <span className="text-gold-gradient">HORIZON</span>
        </p>
        <h1 className="mt-4 font-display text-2xl text-cream">{t.gate.title}</h1>
        <p className="mt-1 text-sm text-dim">{t.gate.subtitle}</p>

        <div className="mt-6 grid gap-2">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => choose(l)}
              className="btn-ghost rounded-sm px-4 py-3 text-sm font-medium hover:border-gold/60"
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
