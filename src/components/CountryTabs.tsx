"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

const FLAGS = ["🇹🇭", "🇮🇩", "🇦🇪", "🇺🇸"];

export function CountryTabs({
  active,
}: {
  active: "thailand" | "bali" | "dubai";
}) {
  const { t } = useI18n();
  const params = useSearchParams();

  const hrefFor = (country: string) => {
    const next = new URLSearchParams(params.toString());
    if (country === "thailand") next.delete("country");
    else next.set("country", country);
    next.delete("page");
    next.delete("province");
    const qs = next.toString();
    return `/listings${qs ? `?${qs}` : ""}`;
  };

  const countries = [
    { key: "thailand", label: t.listings.countryThailand, live: true },
    { key: "bali", label: t.listings.countryBali, live: true },
    { key: "dubai", label: t.listings.countryDubai, live: true },
    { key: "miami", label: t.listings.countryMiami, live: false },
  ];

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {countries.map((c, i) =>
        c.live ? (
          <Link
            key={c.key}
            href={hrefFor(c.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
              active === c.key
                ? "border-gold bg-gold/10 text-gold"
                : "border-ink-border text-dim hover:border-gold/40 hover:text-cream"
            }`}
          >
            <span aria-hidden>{FLAGS[i]}</span>
            {c.label}
          </Link>
        ) : (
          <span
            key={c.key}
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
