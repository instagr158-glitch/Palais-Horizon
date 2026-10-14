import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { getServerDict } from "@/i18n/server";
import { ProjectTest } from "@/components/expat/ProjectTest";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.funnel.testTitle };
}

export default async function TestPage() {
  const dict = await getServerDict();
  const t = dict.funnel;
  const session = await auth();
  const isMember = hasActiveSubscription(session?.user);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {dict.code !== "fr" && (
        <p className="mx-auto mb-6 max-w-xl rounded-sm border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-silver">
          {t.frenchOnly}
        </p>
      )}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-widetitle text-gold">{t.testEyebrow}</p>
        <h1 className="mt-3 font-display text-3xl text-cream sm:text-5xl">{t.testTitle}</h1>
        <p className="mt-3 text-silver">{t.testLead}</p>
      </div>
      <ProjectTest isMember={isMember} pricingHref="/pricing-expat" />
    </div>
  );
}
