import { en, type Dict } from "./en";
import { fr } from "./fr";
import { de } from "./de";

export type { Dict };

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALES = ["en", "fr", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
};

const DICTS: Record<Locale, Dict> = { en, fr, de };

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function getDictionary(locale: string | undefined | null): Dict {
  return DICTS[isLocale(locale) ? locale : DEFAULT_LOCALE];
}

/** Pick the best locale from an Accept-Language header. */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const parts = header
    .split(",")
    .map((p) => p.trim().split(";")[0].toLowerCase().slice(0, 2));
  for (const p of parts) if (isLocale(p)) return p;
  return null;
}
