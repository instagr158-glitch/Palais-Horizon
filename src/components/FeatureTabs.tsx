"use client";

import { useState } from "react";
import { useI18n } from "@/components/I18nProvider";

const ICONS = [
  // search
  <path key="search" d="M11 4a7 7 0 1 0 4.2 12.6l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />,
  // scale / comparison
  <path
    key="scale"
    d="M12 3v2M5 6h14M5 6 2 12h6L5 6Zm14 0-3 6h6l-3-6ZM9 20h6M12 8v13"
  />,
  // sparkle / new
  <path
    key="sparkle"
    d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3ZM5 16l.8 2.2L8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-.8L5 16Z"
  />,
  // link
  <path
    key="link"
    d="M10 13a4 4 0 0 0 5.7.4l3-3a4 4 0 0 0-5.7-5.6l-1.6 1.5M14 11a4 4 0 0 0-5.7-.4l-3 3a4 4 0 0 0 5.7 5.6l1.5-1.5"
  />,
];

export function FeatureTabs() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const tools = t.landing.tools;
  const current = tools[active];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {tools.map((tool, i) => (
          <button
            key={tool.label}
            type="button"
            onClick={() => setActive(i)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
              i === active
                ? "border-gold bg-gold/10 text-gold"
                : "border-ink-border text-dim hover:border-gold/40 hover:text-cream"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ICONS[i]}
            </svg>
            {tool.label}
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <h3 className="font-display text-2xl text-cream sm:text-3xl">{current.title}</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm text-dim sm:text-base">{current.body}</p>
        <ul className="mx-auto mt-6 flex max-w-md flex-col gap-3 text-left">
          {current.points.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-silver">
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5 13 4 4L19 7" />
              </svg>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
