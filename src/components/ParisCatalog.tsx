"use client";

import { useEffect, useState } from "react";
import { HeartIcon, PhotoSlider } from "@/components/InvestGrid";

export type ParisCard = {
  id: string;
  /** Where the button goes: the agency listing for members, the pricing page otherwise. */
  href: string;
  external: boolean;
  place: string;
  title: string;
  photos: string[];
  rent: number;
  rentText: string;
  pricePerSqm: number | null;
  sqmText: string | null;
  detailText: string;
  furnished: boolean;
  premium: boolean;
};

export type ParisLabels = {
  all: string;
  under: string;
  mid: string;
  premium: string;
  favorites: string;
  noFavorites: string;
  sortLabel: string;
  sortRent: string;
  sortSqm: string;
  perMonth: string;
  furnished: string;
  premiumBadge: string;
  view: string;
  addFavorite: string;
  removeFavorite: string;
  empty: string;
};

type Band = "all" | "under" | "mid" | "premium";
type Sort = "rent" | "sqm";

const STORAGE_KEY = "ph-paris-favorites";

export function ParisCatalog({ cards, labels }: { cards: ParisCard[]; labels: ParisLabels }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [band, setBand] = useState<Band>("all");
  const [sort, setSort] = useState<Sort>("rent");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) setFavorites(new Set(saved.filter((x) => typeof x === "string")));
    } catch {
      // storage unavailable: favorites simply won't persist
    }
  }, []);

  function toggle(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // storage unavailable: favorites simply won't persist
      }
      return next;
    });
  }

  const inBand = (c: ParisCard) =>
    band === "all" ||
    (band === "under" && c.rent < 1200) ||
    (band === "mid" && c.rent >= 1200 && !c.premium) ||
    (band === "premium" && c.premium);

  const visible = cards
    .filter((c) => inBand(c) && (!onlyFavorites || favorites.has(c.id)))
    .sort((a, b) =>
      sort === "sqm"
        ? (a.pricePerSqm ?? Infinity) - (b.pricePerSqm ?? Infinity) || a.rent - b.rent
        : a.rent - b.rent,
    );

  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-gold bg-gold text-black"
        : "border-white/15 text-cream/80 hover:border-gold/50 hover:text-cream"
    }`;

  return (
    <>
      <div className="sticky top-16 z-30 -mx-4 border-y border-white/5 bg-ink/80 px-4 py-3 backdrop-blur-lg sm:-mx-6 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-2.5">
          <div className="hide-scrollbar flex gap-2 overflow-x-auto">
            {(
              [
                ["all", labels.all],
                ["under", labels.under],
                ["mid", labels.mid],
                ["premium", labels.premium],
              ] as [Band, string][]
            ).map(([key, text]) => (
              <button
                key={key}
                type="button"
                onClick={() => setBand(key)}
                className={chip(band === key)}
              >
                {text}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOnlyFavorites((v) => !v)}
              className={chip(onlyFavorites)}
            >
              {labels.favorites} ({favorites.size})
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-dim">
            <span>{labels.sortLabel}</span>
            {(
              [
                ["rent", labels.sortRent],
                ["sqm", labels.sortSqm],
              ] as [Sort, string][]
            ).map(([key, text]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                className={`rounded-full px-3 py-1 font-medium transition-colors ${
                  sort === key ? "bg-white/10 text-cream" : "hover:text-cream"
                }`}
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {visible.length === 0 && (
        <p className="mt-10 text-center text-sm text-dim">
          {cards.length === 0 ? labels.empty : labels.noFavorites}
        </p>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((c) => {
          const isFavorite = favorites.has(c.id);
          return (
            <article
              key={c.id}
              className="group relative isolate overflow-hidden rounded-3xl border border-white/10 bg-ink-panel shadow-panel"
            >
              <div className="relative">
                <PhotoSlider photos={c.photos} alt={`${c.title}, ${c.place}`} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 from-20% via-black/70 via-50% to-black/20" />

                <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-1.5">
                  {c.premium && (
                    <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-black">
                      {labels.premiumBadge}
                    </span>
                  )}
                  {c.furnished && (
                    <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      {labels.furnished}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggle(c.id)}
                  aria-pressed={isFavorite}
                  aria-label={isFavorite ? labels.removeFavorite : labels.addFavorite}
                  className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 backdrop-blur-md transition-colors ${
                    isFavorite ? "text-gold" : "text-white hover:text-gold"
                  }`}
                >
                  <HeartIcon filled={isFavorite} />
                </button>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">
                    {c.place}
                  </p>
                  <p className="mt-1 text-xl font-bold leading-tight text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.85)]">
                    {c.title}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="num text-4xl leading-none text-gold-gradient">{c.rentText}</p>
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-white/85">
                        {labels.perMonth}
                      </p>
                    </div>
                    {c.sqmText && (
                      <div className="text-right">
                        <p className="num text-xl font-semibold text-white">{c.sqmText}</p>
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-xs font-medium text-white/90">{c.detailText}</p>

                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="btn-gold pointer-events-auto mt-4 block w-full rounded-full px-5 py-3 text-center text-sm"
                  >
                    {labels.view}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
