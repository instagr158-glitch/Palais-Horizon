"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dict } from "@/i18n";
import { getDictionary, type Locale } from "@/i18n";

type I18nValue = { locale: Locale; t: Dict };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dict;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, t: dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (ctx) return ctx;
  // Fallback so a stray client component never crashes.
  return { locale: "en", t: getDictionary("en") };
}

const YEAR = 60 * 60 * 24 * 365;

/** Persist the choice and reload so server components re-render translated. */
export function setLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${YEAR}; samesite=lax`;
}
