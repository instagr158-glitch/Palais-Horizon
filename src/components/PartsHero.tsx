"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type PartsHeroStat = { value: string; label: string };

const SLIDE_MS = 6000;

export function PartsHero({
  photos,
  eyebrow,
  lead,
  trail,
  cta,
  stats,
}: {
  photos: string[];
  eyebrow: string;
  lead: string;
  trail: string;
  cta: string;
  stats: PartsHeroStat[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [photos.length]);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-ink">
        {photos.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-[1600ms] ${
              i === index ? "animate-kenburns opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(212,175,55,0.22),transparent_55%)]" />
      </div>

      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-end px-5 pb-16 pt-24 sm:justify-center sm:px-8 sm:pb-24">
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widetitle text-gold">
          <span className="h-px w-8 bg-gold/70" />
          {eyebrow}
        </p>

        <h1 className="mt-5 max-w-3xl font-display leading-[1.02] tracking-tight">
          <span className="block text-[2.85rem] font-semibold text-cream sm:text-7xl">{lead}</span>
          <span className="text-gold-gradient mt-3 block text-[1.7rem] font-medium italic leading-[1.15] sm:text-4xl">
            {trail}
          </span>
        </h1>

        <div className="mt-9 flex items-center gap-5">
          <a
            href="#biens"
            className="btn-gold inline-block rounded-full px-8 py-3.5 text-sm shadow-gold"
          >
            {cta}
          </a>
          <span
            aria-hidden
            className="animate-scroll-cue hidden text-2xl text-gold sm:inline-block"
          >
            ↓
          </span>
        </div>

        <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-2.5 sm:gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-3.5 backdrop-blur-md sm:px-5 sm:py-4"
            >
              <dt className="num text-xl font-semibold text-cream sm:text-3xl">{s.value}</dt>
              <dd className="mt-0.5 text-[11px] leading-tight text-cream/70 sm:text-xs">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
