import { JoinForm } from "./JoinForm";
import { getServerDict } from "@/i18n/server";

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.join.title };
}

/**
 * Where TikTok/Instagram/Facebook in-app browser visitors land instead of
 * /pricing (see middleware.ts) — a plain account-creation step, kept
 * separate from the €19/month plan card so the two don't visually blur
 * together. The email link it sends leads back to /pricing once opened in
 * a real browser.
 */
export default async function JoinPage() {
  const t = await getServerDict();
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-3xl text-cream">{t.join.title}</h1>
      <p className="mt-2 text-sm text-dim">{t.join.body}</p>
      <JoinForm />
    </div>
  );
}
