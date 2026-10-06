"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const ESPACE_LINKS = [
  { href: "/thailand/espace", label: "Accueil" },
  { href: "/thailand/espace/visa", label: "Visa" },
  { href: "/thailand/espace/budget", label: "Budget" },
  { href: "/thailand/espace/fiscalite", label: "Fiscalité" },
  { href: "/thailand/espace/banque-sante", label: "Banque et santé" },
  { href: "/thailand/espace/revenus", label: "Revenus" },
  { href: "/thailand/espace/ateliers", label: "Ateliers" },
  { href: "/thailand/espace/questions", label: "Questions" },
  { href: "/thailand/espace/biens", label: "Biens" },
];

export function EspaceNav() {
  const pathname = usePathname();
  return (
    <nav className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" aria-label="Espace expatriation">
      {ESPACE_LINKS.map((l) => {
        const active = l.href === "/thailand/espace" ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            prefetch={false}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "border-gold bg-gold text-black"
                : "border-white/15 text-cream/80 hover:border-gold/50 hover:text-cream"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
