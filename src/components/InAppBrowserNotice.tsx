"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/I18nProvider";

/**
 * TikTok, Instagram and Facebook's built-in browsers block navigation to
 * payment domains like checkout.stripe.com (their own interstitial tells
 * the visitor to copy the link into a real browser instead) — this warns
 * people before they hit that dead end, with the one-tap fix.
 */
function isKnownInAppBrowser(ua: string): boolean {
  return /musical_ly|tiktok|instagram|fban|fbav|fb_iab/i.test(ua);
}

export function InAppBrowserNotice() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isKnownInAppBrowser(navigator.userAgent));
  }, []);

  if (!show) return null;

  return (
    <p className="mb-6 rounded-sm border border-gold/40 bg-gold/5 px-4 py-3 text-sm text-gold">
      {t.pricing.inAppBrowserWarning}
    </p>
  );
}
