import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { hasActiveSubscription } from "@/lib/subscription";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // /account is available to any signed-in user (to manage / reactivate billing).
    if (pathname.startsWith("/account")) {
      return NextResponse.next();
    }

    // Everything else under the matcher (the catalogue) needs an active membership.
    const isMember = hasActiveSubscription({
      subscriptionStatus: token?.subscriptionStatus,
      currentPeriodEnd: token?.currentPeriodEnd,
    });

    if (!isMember) {
      const url = req.nextUrl.clone();
      url.pathname = "/pricing";
      url.searchParams.set("locked", "1");
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // returning false here bounces the user to the sign-in page with callbackUrl
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: "/login" },
  },
);

export const config = {
  matcher: ["/listings/:path*", "/account/:path*"],
};
