import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasActiveSubscription } from "@/lib/subscription";
import { isTikTokInAppBrowser } from "@/lib/inAppBrowserEscape";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // TikTok's in-app browser blocks navigation straight to Stripe — send it
  // to the account-creation page instead of the pricing page, so it never
  // lands on the subscribe flow from inside one. Instagram/Facebook reach
  // Stripe fine on their own, so they go straight to /pricing like any
  // other visitor (checkout works as a guest either way — the account is
  // created automatically after payment, see the Stripe webhook).
  if (pathname === "/pricing") {
    if (isTikTokInAppBrowser(req.headers.get("user-agent") ?? "")) {
      const url = req.nextUrl.clone();
      url.pathname = "/join";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Everything else here (the catalogue, the account page) requires sign-in.
  const token = await getToken({ req });
  if (!token) {
    const callbackUrl = pathname + req.nextUrl.search;
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(url);
  }

  // /account is available to any signed-in user (to manage / reactivate billing).
  if (pathname.startsWith("/account")) {
    return NextResponse.next();
  }

  // Everything else under the matcher (the catalogue) needs an active membership.
  const isMember = hasActiveSubscription({
    subscriptionStatus: token.subscriptionStatus as string | null | undefined,
    currentPeriodEnd: token.currentPeriodEnd as string | null | undefined,
  });

  if (!isMember) {
    const url = req.nextUrl.clone();
    url.pathname = "/pricing";
    url.searchParams.set("locked", "1");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/listings/:path*", "/account/:path*", "/pricing"],
};
