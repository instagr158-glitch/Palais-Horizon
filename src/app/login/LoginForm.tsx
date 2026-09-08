"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useI18n();
  const next = params.get("next") || params.get("callbackUrl") || "/listings";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError(t.auth.badCredentials);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      {error && (
        <p className="rounded-sm border border-gold/40 bg-gold/5 px-3 py-2 text-sm text-gold">
          {error}
        </p>
      )}
      <div>
        <label className="mb-1 block text-xs uppercase tracking-widetitle text-dim">
          {t.auth.emailLabel}
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-sm px-3 py-2 text-sm"
          autoComplete="email"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-widetitle text-dim">
          {t.auth.passwordLabel}
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-sm px-3 py-2 text-sm"
          autoComplete="current-password"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full rounded-sm px-4 py-2.5 text-sm disabled:opacity-60"
      >
        {loading ? t.auth.signingIn : t.auth.signInCta}
      </button>
      <p className="text-sm text-dim">
        {t.auth.noAccount}{" "}
        <Link href="/register" className="text-gold hover:underline">
          {t.auth.createOne}
        </Link>
      </p>
    </form>
  );
}
