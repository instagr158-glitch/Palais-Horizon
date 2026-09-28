"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrackedLink } from "@/components/TrackedLink";
import { LogoSvg } from "@/components/Logo";
import { BRAND } from "@/lib/copy";
import { useI18n } from "@/components/I18nProvider";

export function Footer() {
  const { t } = useI18n();
  const pathname = usePathname();
  // Paris and Bali are each their own dedicated experience — no footer link
  // back to the generic, multi-country residences catalogue from either one
  // (Bali also has no use for the Paris-oriented subscription link, since it
  // has its own "Abonnement" entry point in the top nav).
  const isBaliContext = pathname.startsWith("/bali") || pathname.startsWith("/pricing-bali");
  const isParisContext = pathname === "/" || pathname.startsWith("/annonces");

  return (
    <footer className="border-t border-ink-border bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <LogoSvg size={32} />
              <span className="font-display text-lg font-semibold tracking-[0.14em]">
                PALAIS HORIZON
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-dim">{t.short}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <p className="mb-3 text-xs uppercase tracking-widetitle text-dim">
                {t.footer.explore}
              </p>
              <ul className="space-y-2 text-silver">
                {!isBaliContext && !isParisContext && (
                  <li><Link href="/listings" className="hover:text-gold">{t.footer.residences}</Link></li>
                )}
                {!isBaliContext && (
                  <li><TrackedLink href="/pricing" event="view_membership_click" location="footer" className="hover:text-gold">{t.footer.membership}</TrackedLink></li>
                )}
                <li><Link href="/about" className="hover:text-gold">{t.footer.about}</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-widetitle text-dim">
                {t.footer.account}
              </p>
              <ul className="space-y-2 text-silver">
                <li><Link href="/login" className="hover:text-gold">{t.footer.signIn}</Link></li>
                <li><Link href="/register" className="hover:text-gold">{t.footer.createAccount}</Link></li>
                <li><Link href="/account" className="hover:text-gold">{t.footer.myAccount}</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-widetitle text-dim">
                {t.footer.legal}
              </p>
              <ul className="space-y-2 text-silver">
                <li><Link href="/about" className="hover:text-gold">{t.footer.howItWorks}</Link></li>
                <li><Link href="/terms" className="hover:text-gold">{t.footer.terms}</Link></li>
                <li><Link href="/privacy" className="hover:text-gold">{t.footer.privacy}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="hr-gold my-8" />
        <p className="text-xs text-dim">
          © {new Date().getFullYear()} {BRAND.name}. {t.footer.disclaimer}
        </p>
      </div>
    </footer>
  );
}
