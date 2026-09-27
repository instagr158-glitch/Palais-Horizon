"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  if (images.length === 0) {
    return <div className="aspect-[9/16] w-full rounded-sm bg-ink-panel2 sm:aspect-[16/9]" />;
  }

  return (
    <>
      <div className="overflow-hidden rounded-sm border border-ink-border">
        {/* The aspect-ratio sizing lives on this plain div, not on the
            <button> below — some mobile browsers don't combine CSS
            aspect-ratio with a <button>'s own sizing reliably, which made
            the photo render zoomed into one corner instead of shown in full. */}
        {/* Portrait on mobile so the whole photo fits without scrolling past
            it; a wider, shorter frame from tablet width up where the screen
            has room to spare. */}
        <div className="relative aspect-[9/16] w-full bg-ink-panel2 sm:aspect-[16/10]">
          {/* object-contain: the whole photo, not a cropped fill — a listing
              photo cut off at the edges is exactly what looked like a
              rendering bug to a member browsing on their phone. */}
          <Image
            src={images[active]}
            alt={`${title} — photo ${active + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-contain"
          />
          <button
            type="button"
            onClick={() => setZoom(true)}
            aria-label={`${title} — photo ${active + 1}, agrandir`}
            className="absolute inset-0"
          />
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto bg-ink-panel p-2">
            {images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setActive(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-sm border ${
                  i === active ? "border-gold" : "border-ink-border"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {zoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setZoom(false)}
        >
          <div className="relative h-full max-h-[85vh] w-full max-w-5xl">
            <Image
              src={images[active]}
              alt={`${title} — photo ${active + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            className="absolute right-5 top-5 text-2xl text-cream"
            onClick={() => setZoom(false)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
