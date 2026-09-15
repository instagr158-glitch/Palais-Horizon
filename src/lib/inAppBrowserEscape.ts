/**
 * TikTok, Instagram and Facebook's built-in browsers block navigation to
 * payment domains like checkout.stripe.com and show their own "copy this
 * link into a real browser" page instead. That page is TikTok's own
 * graceful fallback and works fine as long as we hand it a plain https://
 * URL — rewriting the scheme (x-safari-https://, intent://) to try to force
 * an escape breaks it outright ("can't redirect") instead of reaching that
 * fallback, so don't do that. The only safe assist available from here is
 * pre-copying the link to the clipboard so there's one less manual step.
 */
function isKnownInAppBrowser(ua: string): boolean {
  return /musical_ly|tiktok|instagram|fban|fbav|fb_iab/i.test(ua);
}

export async function assistInAppBrowserCheckout(url: string): Promise<void> {
  if (typeof navigator === "undefined") return;
  if (!isKnownInAppBrowser(navigator.userAgent)) return;
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    // Clipboard access can be denied inside a restrictive in-app webview —
    // that's fine, the normal redirect still proceeds either way.
  }
}
