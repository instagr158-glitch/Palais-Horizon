import Link from "next/link";
import { RefreshOnMount } from "./RefreshOnMount";
import { ClaimAccountForm } from "./ClaimAccountForm";
import { getServerDict } from "@/i18n/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.success.title };
}

export default async function SubscribeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const t = await getServerDict();
  const session = await auth();

  // Already signed in (this checkout reused an existing account) — the
  // original welcome screen, with the JWT refresh so the new plan shows up.
  if (session?.user?.id) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <RefreshOnMount />
        <div className="mb-4 text-4xl text-gold">✦</div>
        <h1 className="font-display text-3xl text-cream">{t.success.title}</h1>
        <p className="mt-3 text-dim">{t.success.body}</p>
        <Link href="/listings" className="btn-gold mt-6 rounded-sm px-6 py-2.5 text-sm">
          {t.success.cta}
        </Link>
        <p className="mt-3 text-xs text-dim">{t.success.hint}</p>
      </div>
    );
  }

  const { session_id } = await searchParams;

  if (session_id && stripe) {
    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);
      const paid = checkoutSession.payment_status === "paid" || checkoutSession.status === "complete";
      const email = checkoutSession.customer_details?.email?.toLowerCase().trim();

      if (paid && email) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (user?.needsPasswordSetup) {
          return (
            <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-4 text-center">
              <div className="mb-4 text-4xl text-gold">✦</div>
              <h1 className="font-display text-3xl text-cream">{t.success.claimTitle}</h1>
              <p className="mt-3 text-dim">{t.success.claimBody}</p>
              <ClaimAccountForm sessionId={session_id} email={email} />
            </div>
          );
        }

        if (user) {
          return (
            <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
              <div className="mb-4 text-4xl text-gold">✦</div>
              <h1 className="font-display text-3xl text-cream">{t.success.existingTitle}</h1>
              <p className="mt-3 text-dim">{t.success.existingBody}</p>
              <Link href="/login?next=/listings" className="btn-gold mt-6 rounded-sm px-6 py-2.5 text-sm">
                {t.success.existingCta}
              </Link>
            </div>
          );
        }
      }
    } catch (err) {
      console.error("Success page: could not resolve checkout session:", err);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-4xl text-gold">✦</div>
      <h1 className="font-display text-3xl text-cream">{t.success.genericTitle}</h1>
      <p className="mt-3 text-dim">{t.success.genericBody}</p>
      <Link href="/login?next=/listings" className="btn-gold mt-6 rounded-sm px-6 py-2.5 text-sm">
        {t.success.existingCta}
      </Link>
    </div>
  );
}
