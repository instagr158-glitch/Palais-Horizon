import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy Policy" };

const UPDATED = "September 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl text-cream">Privacy Policy</h1>
      <p className="mt-2 text-sm text-dim">Last updated: {UPDATED}</p>

      <div className="mt-6 rounded-sm border border-gold/40 bg-gold/5 p-4 text-sm text-gold">
        Template to finalise: replace <code>[LEGAL ENTITY]</code>,
        <code>[ADDRESS]</code>, <code>[SUPPORT EMAIL]</code> and confirm the
        details with a lawyer (GDPR applies if you have EU visitors).
      </div>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-silver">
        <section>
          <h2 className="font-display text-xl text-cream">Controller</h2>
          <p>
            [LEGAL ENTITY], [ADDRESS]. Contact for privacy requests: [SUPPORT
            EMAIL].
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">What we collect</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Account:</strong> your email address, name (optional), and a
              hashed password.
            </li>
            <li>
              <strong>Billing:</strong> handled by Stripe. We store your Stripe
              customer and subscription IDs and your membership status — not your
              card number.
            </li>
            <li>
              <strong>Usage:</strong> a language-preference cookie and standard
              server logs (IP, browser, pages viewed) for security and
              operations.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">Why, and legal basis</h2>
          <p>
            To provide the service and your membership (contract), to take payment
            (contract), to keep the service secure and comply with the law
            (legitimate interest / legal obligation). We do not sell your data and
            do not use it for third-party advertising.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">Who we share with</h2>
          <p>
            Service providers who process data on our behalf: Stripe (payments),
            our hosting and database providers, and email delivery. Property
            listings link out to third-party agency websites, which have their own
            policies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">Retention &amp; your rights</h2>
          <p>
            We keep account data while your account exists and for a reasonable
            period afterwards for legal and accounting purposes. You can ask us to
            access, correct, export or delete your data, or object to processing,
            by emailing [SUPPORT EMAIL]. You may also complain to your local data
            protection authority.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">Cookies</h2>
          <p>
            We use a small number of first-party cookies that are strictly
            necessary: your login session and your language choice. No third-party
            tracking or advertising cookies.
          </p>
        </section>
      </div>

      <Link
        href="/"
        className="mt-10 inline-block text-sm text-gold hover:underline"
      >
        ← Back to Palais Horizon
      </Link>
    </div>
  );
}
