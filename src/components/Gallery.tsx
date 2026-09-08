"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  if (images.length === 0) {
    return <div className="aspect-[16/9] w-full rounded-sm bg-ink-panel2" />;
  }

  return (
    <>
      <div className="overflow-hidden rounded-sm border border-ink-border">
        <button
          type="button"
          onClick={() => setZoom(true)}
          className="relative block aspect-[16/10] w-full"
        >
          <Image
            src={images[active]}
            alt={`${title} — photo ${active + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
        </button>
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
