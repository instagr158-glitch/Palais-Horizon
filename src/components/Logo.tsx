"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/copy";

/**
 * Brand mark. Renders /logo.png if the owner has dropped their file in /public,
 * otherwise a faithful inline SVG reproduction (black disc, gold crescent,
 * gold + silver towers, house roof, gold window) built from the logo's palette.
 *
 * We preload the PNG with an off-DOM Image() so there is never a broken-image
 * flash if the file is absent.
 */
export function LogoMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  const [pngOk, setPngOk] = useState(false);

  useEffect(() => {
    const probe = new window.Image();
    probe.onload = () => {
      if (probe.naturalWidth > 0) setPngOk(true);
    };
    probe.src = "/logo.png";
  }, []);

  return (
    <span
      className={`relative inline-block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {pngOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt={BRAND.name}
          width={size}
          height={size}
          className="h-full w-full object-contain"
        />
      ) : (
        <LogoSvg size={size} />
      )}
    </span>
  );
}

export function LogoSvg({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={BRAND.name}
    >
      <defs>
        <linearGradient id="ph-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6D98A" />
          <stop offset="0.55" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#A9801E" />
        </linearGradient>
        <linearGradient id="ph-silver" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F2F3F5" />
          <stop offset="0.5" stopColor="#C7C9CC" />
          <stop offset="1" stopColor="#8E9195" />
        </linearGradient>
      </defs>

      {/* disc */}
      <circle cx="100" cy="100" r="96" fill="#0B0B0C" />

      {/* gold crescent ring, open on the right */}
      <circle
        cx="100"
        cy="100"
        r="82"
        fill="none"
        stroke="url(#ph-gold)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="360 155"
        transform="rotate(33 100 100)"
      />

      {/* silver tower with pointed top */}
      <path
        d="M104 150 V70 L118 52 L132 70 V150 Z"
        fill="url(#ph-silver)"
      />
      <path d="M118 52 L118 44 L124 52 Z" fill="#F2F3F5" />

      {/* gold building outline with vertical mullions */}
      <path
        d="M64 150 V92 L98 74 V150 Z"
        fill="none"
        stroke="url(#ph-gold)"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path
        d="M74 150 V96 M84 150 V90 M93 150 V85"
        stroke="url(#ph-gold)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* house roof — silver over gold */}
      <path
        d="M52 150 L100 112 L148 150"
        fill="none"
        stroke="url(#ph-silver)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 152 L100 122 L140 152"
        fill="none"
        stroke="url(#ph-gold)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* gold window */}
      <rect x="92" y="132" width="16" height="16" rx="1" fill="url(#ph-gold)" />
      <path
        d="M100 132 V148 M92 140 H108"
        stroke="#0B0B0C"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-[1.35rem] font-semibold leading-none tracking-[0.14em] text-cream ${className}`}
    >
      PALAIS<span className="text-gold-gradient"> HORIZON</span>
    </span>
  );
}

export function Logo({
  size = 38,
  withWordmark = true,
}: {
  size?: number;
  withWordmark?: boolean;
}) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark size={size} />
      {withWordmark && <Wordmark />}
    </span>
  );
}
