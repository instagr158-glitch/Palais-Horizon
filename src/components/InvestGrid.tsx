"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type InvestCard = {
  url: string;
  street: string;
  place: string;
  /** "main" = the yield-ranked list, "miami" = the Miami / Florida section. */
  group: "main" | "miami";
  /** Whether the property pays rent today (shows its yield). */
  paying: boolean;
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
  miamiTitle: string;
  otherTitle: string;
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
          <div key={src} className="relative aspect-[4/5] w-full flex-none snap-center overflow-hidden">
            <Image
              src={src}
              alt={i === 0 ? alt : ""}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
      {photos.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 top-5 flex justify-center gap-1.5">
          {photos.map((src, i) => (
            <span
              key={src}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}

function SectionTitle({ children, count }: { children: string; count: number }) {
  return (
    <div className="flex items-end gap-4">
      <h2 className="font-display text-3xl font-semibold text-cream sm:text-4xl">{children}</h2>
      <span className="num mb-1.5 rounded-full border border-gold/30 px-2.5 py-0.5 text-xs text-gold">
        {count}
      </span>
      <span className="mb-3 hidden h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent sm:block" />
    </div>
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
  const mainCards = visible.filter((c) => c.group === "main");
  const miamiCards = visible.filter((c) => c.group === "miami");
  const chip = (active: boolean) =>
    `rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-gold bg-gold text-black"
        : "border-white/15 text-cream/80 hover:border-gold/50 hover:text-cream"
    }`;

  const renderCard = (c: InvestCard) => {
    const isFavorite = favorites.has(c.url);
    return (
      <article
        key={c.url}
        className="group relative isolate overflow-hidden rounded-3xl border border-white/10 bg-ink-panel shadow-panel"
      >
        <div className="relative">
          <PhotoSlider photos={c.photos} alt={`${c.street}, ${c.place}`} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 from-20% via-black/65 via-50% to-black/15" />

          <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-1.5">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold text-white backdrop-blur-md ${
                c.isVacation ? "bg-emerald-600/90" : "bg-black/55"
              }`}
            >
              {c.kindLabel}
            </span>
            {c.paying && (
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-black">
                {labels.cashFlowing}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => toggle(c.url)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? labels.removeFavorite : labels.addFavorite}
            className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 backdrop-blur-md transition-colors ${
              isFavorite ? "text-gold" : "text-white hover:text-gold"
            }`}
          >
            <HeartIcon filled={isFavorite} />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">{c.place}</p>
            <h3 className="mt-1 font-display text-[1.65rem] font-semibold leading-tight text-cream">
              {c.street}
            </h3>

            <div className="mt-4 flex items-end justify-between gap-4">
              {c.paying ? (
                <div>
                  <p className="num text-4xl leading-none text-gold-gradient">{c.yieldText}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-cream/60">
                    {labels.yieldLabel}
                  </p>
                </div>
              ) : (
                <span />
              )}
              <div className="text-right">
                <p className="num text-xl font-semibold text-cream">{c.priceText}</p>
                <p className="text-[11px] uppercase tracking-wide text-cream/60">
                  {labels.perShare.replace("/", "")}
                </p>
              </div>
            </div>

            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-cream/70">
              {c.investorsText && (
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
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
                </span>
              )}
              <span>{c.examplesText}</span>
            </p>

            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold pointer-events-auto mt-4 block w-full rounded-full px-5 py-3 text-center text-sm"
            >
              {labels.buy}
            </a>
          </div>
        </div>
      </article>
    );
  };

  return (
    <>
      <div className="sticky top-16 z-30 -mx-4 border-y border-white/5 bg-ink/80 px-4 py-3 backdrop-blur-lg sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl gap-2">
          <button type="button" onClick={() => setOnlyFavorites(false)} className={chip(!onlyFavorites)}>
            {labels.all}
          </button>
          <button type="button" onClick={() => setOnlyFavorites(true)} className={chip(onlyFavorites)}>
            {labels.favorites} ({favorites.size})
          </button>
        </div>
      </div>

      {visible.length === 0 && <p className="mt-10 text-center text-sm text-dim">{labels.noFavorites}</p>}

      {miamiCards.length > 0 && (
        <section className="mt-12">
          <SectionTitle count={miamiCards.length}>{labels.miamiTitle}</SectionTitle>
          <div className="hide-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
            {miamiCards.map((c) => (
              <div key={c.url} className="w-[84%] flex-none snap-center sm:w-[46%] lg:w-auto">
                {renderCard(c)}
              </div>
            ))}
          </div>
        </section>
      )}

      {mainCards.length > 0 && (
        <section className="mt-16">
          {miamiCards.length > 0 && <SectionTitle count={mainCards.length}>{labels.otherTitle}</SectionTitle>}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{mainCards.map(renderCard)}</div>
        </section>
      )}
    </>
  );
}
