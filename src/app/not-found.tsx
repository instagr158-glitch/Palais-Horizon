"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl text-gold-gradient">404</p>
      <h1 className="mt-3 font-display text-2xl text-cream">{t.notFound.title}</h1>
      <p className="mt-2 text-dim">{t.notFound.body}</p>
      <Link href="/" className="btn-gold mt-6 rounded-sm px-6 py-2.5 text-sm">
        {t.notFound.cta}
      </Link>
    </div>
  );
}
