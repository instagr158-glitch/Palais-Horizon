"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type InvestCard = {
  url: string;
  street: string;
  place: string;
  isVacation: boolean;
  kindLabel: string;
  photos: string[];
  priceText: string;
  yieldText: string;
  investorsText: string | null;
  examplesText: string;
};

export type InvestGridLabels = {
  all: string;
  favorites: string;
  noFavorites: string;
  perShare: string;
  yieldLabel: string;
  cashFlowing: string;
  buy: string;
  addFavorite: string;
  removeFavorite: string;
};

const STORAGE_KEY = "ph-invest-favorites";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function PhotoSlider({ photos, alt }: { photos: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  return (
    <>
      <div
        className="hide-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {photos.map((src, i) => (
          <div key={src} className="relative aspect-[4/3] w-full flex-none snap-center">
            <Image
              src={src}
              alt={i === 0 ? alt : ""}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {photos.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {photos.map((src, i) => (
            <span
              key={src}
              className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function InvestGrid({ cards, labels }: { cards: InvestCard[]; labels: InvestGridLabels }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) setFavorites(new Set(saved.filter((x) => typeof x === "string")));
    } catch {
      // storage unavailable: favorites simply won't persist
    }
  }, []);

  function toggle(url: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (!next.delete(url)) next.add(url);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // storage unavailable: favorites simply won't persist
      }
      return next;
    });
  }

  const visible = onlyFavorites ? cards.filter((c) => favorites.has(c.url)) : cards;
  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition-colors ${
      active
        ? "border-gold bg-gold/10 text-gold"
        : "border-ink-border text-dim hover:text-cream"
    }`;

  return (
    <>
      <div className="flex gap-2">
        <button type="button" onClick={() => setOnlyFavorites(false)} className={chip(!onlyFavorites)}>
          {labels.all}
        </button>
        <button type="button" onClick={() => setOnlyFavorites(true)} className={chip(onlyFavorites)}>
          {labels.favorites} ({favorites.size})
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 text-sm text-dim">{labels.noFavorites}</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => {
            const isFavorite = favorites.has(c.url);
            return (
              <article
                key={c.url}
                className="flex flex-col overflow-hidden rounded-2xl border border-ink-border bg-ink-panel"
              >
                <div className="relative">
                  <PhotoSlider photos={c.photos} alt={`${c.street}, ${c.place}`} />
                  <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold text-white ${
                        c.isVacation ? "bg-emerald-600" : "bg-slate-600"
                      }`}
                    >
                      {c.kindLabel}
                    </span>
                    <span className="rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-black">
                      {labels.cashFlowing}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(c.url)}
                    aria-pressed={isFavorite}
                    aria-label={isFavorite ? labels.removeFavorite : labels.addFavorite}
                    className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-colors ${
                      isFavorite ? "text-gold" : "text-white hover:text-gold"
                    }`}
                  >
                    <HeartIcon filled={isFavorite} />
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-sans text-base font-bold text-cream">{c.street}</h2>
                  <p className="text-sm text-dim">{c.place}</p>

                  <p className="mt-3 text-sm">
                    <span className="num font-semibold text-cream">{c.priceText}</span>
                    <span className="text-dim">{labels.perShare}</span>
                    <span className="text-dim"> · </span>
                    <span className="num font-semibold text-gold">{c.yieldText}</span>{" "}
                    <span className="lowercase text-dim">{labels.yieldLabel}</span>
                  </p>

                  {c.investorsText && (
                    <p className="mt-2 flex items-center gap-2 text-sm text-dim">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gold"
                        aria-hidden
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      {c.investorsText}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-dim">{c.examplesText}</p>

                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold mt-5 inline-block self-start rounded-full px-5 py-2.5 text-sm"
                  >
                    {labels.buy}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
