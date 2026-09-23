"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { TrackedLink } from "@/components/TrackedLink";

export type ShowcaseCardData = {
  id: string;
  image: string;
  title: string;
  city: string;
  country: string;
  flag: string;
  priceLabel: string | null;
  note?: string;
};

const AUTOPLAY_MS = 5000;

export function PropertyShowcase({
  items,
  badge,
  title,
  subtext,
  showLocation = true,
  teaser = false,
  lockBadgeLabel,
}: {
  items: ShowcaseCardData[];
  badge: string;
  title: string;
  subtext: string;
  showLocation?: boolean;
  /** Paywall teaser mode: only items[0] is ever shown in the spotlight; every
   * other thumbnail is blurred, locked and links to /pricing instead of
   * switching the spotlight. */
  teaser?: boolean;
  /** Badge (e.g. "+99") shown with the lock icon on the last thumbnail. */
  lockBadgeLabel?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setActive((i) => (i + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (teaser || paused || items.length < 2) return;
    const id = setInterval(advance, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [teaser, paused, advance, items.length]);

  if (items.length === 0) return null;
  const current = teaser ? items[0] : items[active];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="text-center">
        <span className="inline-block rounded-full border border-gold/30 bg-gold/[0.06] px-4 py-1.5 text-xs uppercase tracking-widetitle text-gold">
          {badge}
        </span>
        <h2 className="mx-auto mt-4 max-w-2xl font-sans text-2xl font-extrabold leading-[1.2] text-cream sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-dim sm:text-base">
          {subtext}
        </p>
      </div>

      <div
        className="mt-8 grid gap-3 lg:grid-cols-[1.7fr_1fr] lg:gap-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* main spotlight panel */}
        <TrackedLink
          href="/pricing"
          event="view_membership_click"
          location="showcase_main"
          className="group relative block aspect-[4/3] overflow-hidden rounded-sm border border-ink-border sm:aspect-[16/10]"
        >
          {items.map((item, i) => (
            <Image
              key={item.id}
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority={i === 0}
              className={`object-cover transition-opacity duration-700 ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

          {showLocation && (
            <div className="absolute left-4 top-4 rounded-sm bg-black/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-cream backdrop-blur-sm">
              {current.flag} {current.city}
            </div>
          )}

          {current.priceLabel != null && (
            <div className="absolute right-4 top-4 rounded-sm bg-gold px-3 py-1.5 text-sm font-bold text-black shadow-gold">
              {current.priceLabel}
            </div>
          )}

          <div className="absolute inset-x-0 bottom-[3px] p-4 sm:p-6">
            <p className="font-sans text-base font-bold leading-snug text-cream drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] sm:text-xl">
              {current.title}
            </p>
            {current.note && (
              <p className="mt-1 text-xs font-medium text-gold">{current.note}</p>
            )}
          </div>

          {/* auto-advance progress bar, restarts on every active-item change */}
          {!teaser && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/40">
              <div
                key={`${current.id}-${paused}`}
                className="h-full bg-gold-gradient"
                style={{
                  animation: paused
                    ? "none"
                    : `showcase-progress ${AUTOPLAY_MS}ms linear forwards`,
                  width: paused ? "100%" : undefined,
                }}
              />
            </div>
          )}
        </TrackedLink>

        {/* thumbnail rail */}
        <div className="grid grid-cols-4 gap-2 lg:grid-cols-2 lg:gap-3">
          {items.map((item, i) => {
            const locked = teaser && i > 0;
            const isLastLocked = locked && i === items.length - 1;

            if (locked) {
              return (
                <TrackedLink
                  key={item.id}
                  href="/pricing"
                  event="view_membership_click"
                  location="showcase_locked_thumbnail"
                  aria-label={item.title}
                  className="group relative aspect-square overflow-hidden rounded-sm border border-ink-border"
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="120px"
                    className="scale-110 object-cover blur-md"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/75">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gold">
                      <rect x="4" y="10" width="16" height="11" rx="2" fill="currentColor" opacity="0.9" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {isLastLocked && lockBadgeLabel && (
                      <span className="text-xs font-bold text-gold">{lockBadgeLabel}</span>
                    )}
                  </div>
                </TrackedLink>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={item.title}
                className={`group relative aspect-square overflow-hidden rounded-sm border transition ${
                  i === active
                    ? "border-gold shadow-gold"
                    : "border-ink-border opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/80 px-1.5 py-1 text-left leading-tight">
                  {showLocation && (
                    <span className="block truncate text-[11px] font-semibold text-cream">
                      {item.flag} {item.country}
                    </span>
                  )}
                  {item.priceLabel != null && (
                    <span className="num block text-[11px] font-bold text-gold">
                      {item.priceLabel}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
