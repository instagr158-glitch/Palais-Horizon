import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { getServerDict } from "@/i18n/server";

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.auth.signInTitle };
}

export default async function LoginPage() {
  const t = await getServerDict();
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-3xl text-cream">{t.auth.signInTitle}</h1>
      <p className="mt-2 text-sm text-dim">{t.auth.signInBody}</p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
