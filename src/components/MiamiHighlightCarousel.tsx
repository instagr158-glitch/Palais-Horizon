import Image from "next/image";
import { TrackedLink } from "@/components/TrackedLink";
import type { HighlightItem } from "@/lib/listings";

export function MiamiHighlightCarousel({
  items,
  ctaLabel,
}: {
  items: HighlightItem[];
  ctaLabel: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="border-b border-ink-border py-12 sm:py-16">
      <div className="hide-scrollbar flex gap-6 overflow-x-auto px-4 pb-3 sm:justify-center sm:px-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative aspect-[3/4] w-[280px] flex-none overflow-hidden rounded-2xl shadow-panel transition-transform duration-300 hover:-translate-y-2 hover:shadow-gold sm:w-[320px]"
          >
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(max-width: 640px) 280px, 320px"
              className="object-cover"
            />
          </div>
        ))}
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
