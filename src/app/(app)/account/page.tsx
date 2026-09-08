import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hasActiveSubscription } from "@/lib/subscription";
import { AccountActions } from "./AccountActions";
import { getLocale } from "@/i18n/server";
import { getDictionary } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return { title: t.account.title };
}
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?next=/account");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const locale = await getLocale();
  const t = getDictionary(locale);
  const isMember = hasActiveSubscription(user);
  const statusKey = user.subscriptionStatus as keyof typeof t.account.statuses;
  const localeTag = locale === "fr" ? "fr-FR" : locale === "de" ? "de-DE" : "en-GB";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-2xl text-cream sm:text-3xl">
        {t.account.title}
      </h1>

      <div className="panel mt-6 rounded-sm p-5 sm:p-6">
        <dl className="divide-y divide-ink-border text-sm">
          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt className="text-dim">{t.account.name}</dt>
            <dd className="text-right text-cream">{user.name ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt className="text-dim">{t.account.email}</dt>
            <dd className="break-all text-right text-cream">{user.email}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 py-2.5">
            <dt className="text-dim">{t.account.membership}</dt>
            <dd className={isMember ? "text-right text-gold" : "text-right text-cream"}>
              {t.account.statuses[statusKey] ?? user.subscriptionStatus}
            </dd>
          </div>
          {user.plan && (
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-dim">{t.account.plan}</dt>
              <dd className="text-right text-cream">
                {user.plan === "annual"
                  ? t.pricing.annualLabel
                  : t.pricing.monthlyLabel}
              </dd>
            </div>
          )}
          {user.currentPeriodEnd && (
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-dim">
                {isMember ? t.account.renewsEnds : t.account.ended}
              </dt>
              <dd className="num text-right text-cream">
                {user.currentPeriodEnd.toLocaleDateString(localeTag, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
          )}
        </dl>

        <div className="hr-gold my-6" />

        <AccountActions
          isMember={isMember}
          hasStripeCustomer={!!user.stripeCustomerId}
        />
      </div>

      {isMember && (
        <Link
          href="/listings"
          className="mt-6 inline-block text-sm text-gold hover:underline"
        >
          {t.account.browse} →
        </Link>
      )}
    </div>
  );
}
