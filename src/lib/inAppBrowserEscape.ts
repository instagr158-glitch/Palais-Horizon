/**
 * TikTok, Instagram and Facebook's built-in browsers block navigation to
 * payment domains like checkout.stripe.com and show their own "copy this
 * link into a real browser" dead-end instead. Rather than warn the visitor
 * about it, silently route the redirect through the OS-level escape hatch
 * so it opens straight in Safari / Chrome — no banner, no extra tap.
 */
function isKnownInAppBrowser(ua: string): boolean {
  return /musical_ly|tiktok|instagram|fban|fbav|fb_iab/i.test(ua);
}

export function escapeUrlForInAppBrowser(url: string): string {
  if (typeof navigator === "undefined") return url;
  const ua = navigator.userAgent;
  if (!isKnownInAppBrowser(ua)) return url;

  if (/iPhone|iPad|iPod/i.test(ua)) {
    // Apple's private scheme that forces Safari to open even from inside
    // another app's WKWebView.
    return url.replace(/^https:\/\//, "x-safari-https://");
  }

  if (/Android/i.test(ua)) {
    // Routes the navigation through Android's intent system straight to
    // Chrome, with the plain URL as a fallback if Chrome isn't installed.
    const stripped = url.replace(/^https?:\/\//, "");
    return `intent://${stripped}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
  }

  return url;
}
