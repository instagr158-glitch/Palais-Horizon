import { Suspense } from "react";
import { RegisterForm } from "./RegisterForm";
import { getServerDict } from "@/i18n/server";

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.auth.createCta };
}

export default async function RegisterPage() {
  const t = await getServerDict();
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-3xl text-cream">{t.auth.registerTitle}</h1>
      <p className="mt-2 text-sm text-dim">{t.auth.registerBody}</p>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
