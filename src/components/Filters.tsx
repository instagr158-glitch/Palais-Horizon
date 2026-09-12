"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { PROPERTY_TYPES, PROVINCES } from "@/lib/listings";
import { useI18n } from "@/components/I18nProvider";

const TYPE_LABELS: Record<string, { en: string; fr: string; de: string }> = {
  villa: { en: "Villa", fr: "Villa", de: "Villa" },
  house: { en: "House", fr: "Maison", de: "Haus" },
  penthouse: { en: "Penthouse", fr: "Penthouse", de: "Penthouse" },
  condo: { en: "Condo", fr: "Appartement", de: "Eigentumswohnung" },
  land: { en: "Land", fr: "Terrain", de: "Grundstück" },
};

export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { t, locale } = useI18n();

  const budgets = [
    { value: "", label: t.listings.budgets[0] },
    { value: "0-25000000", label: t.listings.budgets[1] },
    { value: "25000000-50000000", label: t.listings.budgets[2] },
    { value: "50000000-100000000", label: t.listings.budgets[3] },
    { value: "100000000-0", label: t.listings.budgets[4] },
  ];
  const sorts = [
    { value: "recent", label: t.listings.sorts[0] },
    { value: "price_desc", label: t.listings.sorts[1] },
    { value: "price_asc", label: t.listings.sorts[2] },
    { value: "area_desc", label: t.listings.sorts[3] },
  ];

  const update = useCallback(
    (patch: Record<string, string>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v) next.set(k, v);
        else next.delete(k);
      }
      next.delete("page");
      router.push(`${pathname}?${next.toString()}`);
    },
    [params, pathname, router],
  );

  const budgetValue =
    params.get("minPrice") || params.get("maxPrice")
      ? `${params.get("minPrice") ?? "0"}-${params.get("maxPrice") ?? "0"}`
      : "";

  return (
    <div className="panel rounded-sm p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        <input
          defaultValue={params.get("q") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter")
              update({ q: (e.target as HTMLInputElement).value });
          }}
          placeholder={t.listings.searchPlaceholder}
          className="rounded-sm px-3 py-2 text-sm lg:col-span-2"
        />

        <select
          value={params.get("province") ?? ""}
          onChange={(e) => update({ province: e.target.value })}
          className="rounded-sm px-3 py-2 text-sm"
        >
          <option value="">{t.listings.allRegions}</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {p === "Surat Thani" ? t.listings.samuiRegion : p}
            </option>
          ))}
        </select>

        <select
          value={params.get("propertyType") ?? ""}
          onChange={(e) => update({ propertyType: e.target.value })}
          className="rounded-sm px-3 py-2 text-sm"
        >
          <option value="">{t.listings.allTypes}</option>
          {PROPERTY_TYPES.map((ty) => (
            <option key={ty} value={ty}>
              {TYPE_LABELS[ty]?.[locale] ?? ty}
            </option>
          ))}
        </select>

        <select
          value={params.get("listingType") ?? ""}
          onChange={(e) => update({ listingType: e.target.value })}
          className="rounded-sm px-3 py-2 text-sm"
        >
          <option value="">{t.listings.allOfferTypes}</option>
          <option value="sale">{t.listings.forSale}</option>
          <option value="rent">{t.listings.forRent}</option>
        </select>

        <select
          value={budgetValue}
          onChange={(e) => {
            const [min, max] = e.target.value.split("-");
            update({
              minPrice: min && min !== "0" ? min : "",
              maxPrice: max && max !== "0" ? max : "",
            });
          }}
          className="rounded-sm px-3 py-2 text-sm"
        >
          {budgets.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>

        <select
          value={params.get("sort") ?? "recent"}
          onChange={(e) => update({ sort: e.target.value })}
          className="rounded-sm px-3 py-2 text-sm"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
