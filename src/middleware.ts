import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasActiveSubscription } from "@/lib/subscription";
import { isKnownInAppBrowser } from "@/lib/inAppBrowserEscape";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // TikTok/Instagram/Facebook's in-app browsers block navigation straight to
  // Stripe — send them to the account-creation page instead of the pricing
  // page, so they never land on the subscribe flow from inside one.
  if (pathname === "/pricing") {
    if (isKnownInAppBrowser(req.headers.get("user-agent") ?? "")) {
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
