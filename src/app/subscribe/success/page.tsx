import Link from "next/link";
import { RefreshOnMount } from "./RefreshOnMount";
import { getServerDict } from "@/i18n/server";

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.success.title };
}

export default async function SubscribeSuccessPage() {
  const t = await getServerDict();
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
