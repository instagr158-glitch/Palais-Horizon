"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useI18n();
  const next = params.get("next") || "/pricing";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.auth.genericError);
        setLoading(false);
        return;
      }
      await signIn("credentials", { email, password, redirect: false });
      router.push(next);
      router.refresh();
    } catch {
      setError(t.auth.networkError);
      setLoading(false);
    }
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
          {t.auth.nameLabel} <span className="text-dim/60">{t.auth.optional}</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-sm px-3 py-2 text-sm"
          autoComplete="name"
        />
      </div>
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
          {t.auth.passwordLabel}{" "}
          <span className="text-dim/60">{t.auth.passwordHint}</span>
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-sm px-3 py-2 text-sm"
          autoComplete="new-password"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full rounded-sm px-4 py-2.5 text-sm disabled:opacity-60"
      >
        {loading ? t.auth.creating : t.auth.createCta}
      </button>
      <p className="text-sm text-dim">
        {t.auth.haveAccount}{" "}
        <Link href="/login" className="text-gold hover:underline">
          {t.auth.signInCta}
        </Link>
      </p>
    </form>
  );
}
