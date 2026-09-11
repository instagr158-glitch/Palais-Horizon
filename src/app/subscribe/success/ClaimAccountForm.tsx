"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useI18n } from "@/components/I18nProvider";

type Props = {
  sessionId: string;
  email: string;
};

export function ClaimAccountForm({ sessionId, email }: Props) {
  const router = useRouter();
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/claim-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t.success.claimError);
        setLoading(false);
        return;
      }
      const signInRes = await signIn("credentials", { email, password, redirect: false });
      if (signInRes?.error) {
        setError(t.success.claimError);
        setLoading(false);
        return;
      }
      router.push("/listings");
      router.refresh();
    } catch {
      setError(t.success.claimNetworkError);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 w-full space-y-4 text-left">
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
          value={email}
          disabled
          className="w-full rounded-sm px-3 py-2 text-sm opacity-70"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs uppercase tracking-widetitle text-dim">
          {t.auth.passwordLabel} <span className="text-dim">{t.success.claimPasswordHint}</span>
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
        {loading ? t.success.claimSubmitting : t.success.claimCta}
      </button>
    </form>
  );
}
