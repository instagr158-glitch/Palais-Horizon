"use client";

import { useI18n } from "@/components/I18nProvider";

const FLAGS = ["🇹🇭", "🇦🇪", "🇺🇸", "🇮🇩"];

export function CountryTabs() {
  const { t } = useI18n();
  const countries = [
    { label: t.listings.countryThailand, active: true },
    { label: t.listings.countryDubai, active: false },
    { label: t.listings.countryMiami, active: false },
    { label: t.listings.countryBali, active: false },
  ];

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {countries.map((c, i) =>
        c.active ? (
          <span
            key={c.label}
            className="inline-flex items-center gap-2 rounded-full border border-gold bg-gold/10 px-4 py-2 text-sm text-gold"
          >
            <span aria-hidden>{FLAGS[i]}</span>
            {c.label}
          </span>
        ) : (
          <span
            key={c.label}
            title={t.listings.comingSoon}
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-ink-border px-4 py-2 text-sm text-dim opacity-60"
          >
            <span aria-hidden>{FLAGS[i]}</span>
            {c.label}
            <span className="rounded-full border border-ink-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
              {t.listings.comingSoon}
            </span>
          </span>
        ),
      )}
    </div>
  );
}
