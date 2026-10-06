"use client";

import { useEffect, useState } from "react";

export function Checklist({
  storageKey,
  title,
  items,
}: {
  storageKey: string;
  title?: string;
  items: string[];
}) {
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(saved)) setDone(new Set(saved.filter((x) => typeof x === "string")));
    } catch {
      // storage unavailable: progress simply won't persist
    }
  }, [storageKey]);

  function toggle(item: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (!next.delete(item)) next.add(item);
      try {
        localStorage.setItem(storageKey, JSON.stringify([...next]));
      } catch {
        // storage unavailable: progress simply won't persist
      }
      return next;
    });
  }

  const count = items.filter((i) => done.has(i)).length;
  const pct = items.length ? Math.round((count / items.length) * 100) : 0;

  return (
    <div className="panel rounded-sm p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl text-cream">{title ?? "Ma liste"}</h3>
        <span className="num text-sm text-gold">
          {count}/{items.length}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-4 grid gap-2">
        {items.map((item) => {
          const checked = done.has(item);
          return (
            <li key={item}>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-silver">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(item)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#D4AF37]"
                />
                <span className={checked ? "text-dim line-through" : ""}>{item}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
