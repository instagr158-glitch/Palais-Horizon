"use client";

import { useEffect, useState } from "react";

function msUntilNextMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}

function format(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/** Counts down to the visitor's next local midnight, then starts over — a
 * daily-resetting countdown with no server state needed. */
export function PromoCountdown() {
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    setMsLeft(msUntilNextMidnight());
    const id = setInterval(() => setMsLeft(msUntilNextMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  // Avoid an SSR/client markup mismatch — render nothing until mounted.
  if (msLeft === null) return null;

  return <span className="num tabular-nums">{format(msLeft)}</span>;
}
