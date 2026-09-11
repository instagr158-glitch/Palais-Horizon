"use client";

import Link from "next/link";
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

  const links = [
    { href: "/listings", label: t.nav.listings },
    { href: "/pricing", label: t.nav.pricing },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink-border bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Logo size={34} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm tracking-wide transition-colors ${
                pathname.startsWith(l.href)
                  ? "text-gold"
                  : "text-dim hover:text-cream"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {status === "loading" ? null : session ? (
            <>
              <Link href="/account" className="text-sm text-dim hover:text-cream">
                {t.nav.account}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-ghost rounded-sm px-3 py-1.5 text-sm"
              >
                {t.nav.signOut}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-dim hover:text-cream">
                {t.nav.login}
              </Link>
              <Link
                href="/pricing"
                className="btn-gold rounded-sm px-4 py-1.5 text-sm"
              >
                {t.nav.join}
              </Link>
            </>
          )}
        </div>

        <button
          className="btn-ghost rounded-sm p-2 md:hidden"
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
                <Link href="/account" onClick={() => setOpen(false)} className="text-sm text-dim">
                  {t.nav.account}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn-ghost rounded-sm px-3 py-2 text-left text-sm"
                >
                  {t.nav.signOut}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-sm text-dim">
                  {t.nav.login}
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setOpen(false)}
                  className="btn-gold rounded-sm px-4 py-2 text-center text-sm"
                >
                  {t.nav.join}
                </Link>
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
