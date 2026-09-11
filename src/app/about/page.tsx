import type { Metadata } from "next";
import { TrackedLink } from "@/components/TrackedLink";
import { getServerDict } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDict();
  return { title: t.nav.about };
}

export default async function AboutPage() {
  const t = await getServerDict();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl text-cream">{t.about.title}</h1>
      <div className="mt-6 space-y-5 text-dim">
        <p>{t.about.p1}</p>
        <p>{t.about.p2}</p>
        <h2 className="font-display text-2xl text-cream">{t.about.membersTitle}</h2>
        <ul className="list-disc space-y-2 pl-5">
          {t.about.members.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <h2 className="font-display text-2xl text-cream">{t.about.sourcesTitle}</h2>
        <p>{t.about.sourcesBody}</p>
      </div>
      <TrackedLink
        href="/pricing"
        event="view_membership_click"
        location="about"
        className="btn-gold mt-8 inline-block rounded-sm px-6 py-2.5 text-sm"
      >
        {t.about.cta}
      </TrackedLink>
    </div>
  );
}
