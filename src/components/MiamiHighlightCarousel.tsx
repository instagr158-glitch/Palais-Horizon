"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TrackedLink } from "@/components/TrackedLink";
import type { HighlightItem } from "@/lib/listings";

export function MiamiHighlightCarousel({
  items,
  title,
  ctaLabel,
}: {
  items: HighlightItem[];
  title: string;
  ctaLabel: string;
}) {
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleIds((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const id = (entry.target as HTMLElement).dataset.id;
            if (!id) continue;
            if (entry.isIntersecting) next.add(id);
            else next.delete(id);
          }
          return next;
        });
      },
      { threshold: 0.6 },
    );
    for (const el of cardRefs.current.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <section className="border-b border-ink-border py-12 sm:py-16">
      <h2 className="mx-auto mb-8 max-w-2xl px-4 text-center font-sans text-2xl font-extrabold leading-[1.2] text-cream sm:text-4xl">
        {title}
      </h2>
      <div className="hide-scrollbar flex gap-6 overflow-x-auto px-4 pt-3 pb-3 sm:justify-center sm:px-6">
        {items.map((item) => {
          const active = visibleIds.has(item.id);
          return (
            <div
              key={item.id}
              data-id={item.id}
              ref={(el) => {
                if (el) cardRefs.current.set(item.id, el);
                else cardRefs.current.delete(item.id);
              }}
              className={`relative aspect-[3/4] w-[280px] flex-none overflow-hidden rounded-2xl transition-transform duration-500 sm:w-[320px] ${
                active ? "-translate-y-2 z-50 shadow-gold" : "z-0 shadow-panel"
              }`}
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(max-width: 640px) 280px, 320px"
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex justify-center px-4">
        <TrackedLink
          href="/track"
          event="view_membership_click"
          location="miami_highlight_carousel"
          className="btn-gold inline-block rounded-full px-6 py-3 text-sm"
        >
          {ctaLabel}
        </TrackedLink>
      </div>
    </section>
  );
}
