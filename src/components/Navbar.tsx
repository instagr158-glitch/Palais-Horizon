"use client";

import Link from "next/link";
import { TrackedLink } from "@/components/TrackedLink";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/components/I18nProvider";
import { hasActiveSubscription } from "@/lib/subscription";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isMember = hasActiveSubscription(session?.user);
  const { t } = useI18n();

  // Paris, Bali and Thailand are each their own dedicated experience —
  // no menu links out to another country (or to the generic, multi-country
  // catalogue), and "Abonnement" always points at that country's own offer.
  // Every other page (About, login, the legacy residences catalogue, …)
  // falls back to a general menu with all three entry points.
  const isBaliContext = pathname.startsWith("/bali") || pathname.startsWith("/pricing-bali");
  const isThailandContext = pathname.startsWith("/thailand") || pathname.startsWith("/pricing-thailand");
  const isParisContext = pathname === "/" || pathname.startsWith("/annonces");
  const links = isBaliContext
    ? [
        { href: "/bali", label: t.bali.navLabel },
        { href: "/pricing-bali", label: t.nav.pricing },
        { href: "/about", label: t.nav.about },
      ]
    : isThailandContext
      ? [
          { href: "/thailand", label: t.thailand.navLabel },
          { href: "/pricing-thailand", label: t.nav.pricing },
          { href: "/about", label: t.nav.about },
        ]
      : isParisContext
        ? [
            { href: "/", label: t.paris.navLabel },
            { href: "/annonces", label: t.nav.allListings },
            { href: "/pricing", label: t.nav.pricing },
            { href: "/about", label: t.nav.about },
          ]
        : [
            { href: "/", label: t.paris.navLabel },
            { href: "/bali", label: t.bali.navLabel },
            { href: "/thailand", label: t.thailand.navLabel },
            { href: "/annonces", label: t.nav.allListings },
            { href: "/pricing", label: t.nav.pricing },
            { href: "/about", label: t.nav.about },
          ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink-border bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Logo size={34} />
        </Link>

        <nav className="hidden items-center gap-5 md:flex lg:gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              prefetch={false}
              href={l.href}
              className={`whitespace-nowrap text-sm tracking-wide transition-colors ${
                (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href))
                  ? "text-gold"
                  : "text-dim hover:text-cream"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 whitespace-nowrap md:flex">
          <LanguageSwitcher />
          {status === "loading" ? null : session ? (
            <>
              <Link href="/account" prefetch={false} className="text-sm text-dim hover:text-cream">
                {t.nav.account}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-ghost rounded-full px-3 py-1.5 text-sm"
              >
                {t.nav.signOut}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" prefetch={false} className="text-sm text-dim hover:text-cream">
                {t.nav.login}
              </Link>
              <TrackedLink
                href="/track"
                event="view_membership_click"
                location="navbar"
                prefetch={false}
                className="btn-gold whitespace-nowrap rounded-full px-4 py-1.5 text-sm"
              >
                {t.nav.join}
              </TrackedLink>
            </>
          )}
        </div>

        <button
          className="btn-ghost rounded-full p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-border bg-ink px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                prefetch={false}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-dim hover:text-cream"
              >
                {l.label}
              </Link>
            ))}
            <div className="hr-gold my-2" />
            {session ? (
              <>
                <Link href="/account" prefetch={false} onClick={() => setOpen(false)} className="text-sm text-dim">
                  {t.nav.account}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn-ghost rounded-full px-3 py-2 text-left text-sm"
                >
                  {t.nav.signOut}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" prefetch={false} onClick={() => setOpen(false)} className="text-sm text-dim">
                  {t.nav.login}
                </Link>
                <TrackedLink
                  href="/track"
                  event="view_membership_click"
                  location="navbar_mobile"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="btn-gold rounded-full px-4 py-2 text-center text-sm"
                >
                  {t.nav.join}
                </TrackedLink>
              </>
            )}
            <div className="pt-1">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
      {isMember && (
        <div className="bg-gold/10 py-1 text-center text-[11px] tracking-widetitle text-gold">
          {t.nav.memberBar}
        </div>
      )}
    </header>
  );
}
