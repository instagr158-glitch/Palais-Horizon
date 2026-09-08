import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms of Service" };

const UPDATED = "September 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl text-cream">Terms of Service</h1>
      <p className="mt-2 text-sm text-dim">Last updated: {UPDATED}</p>

      <div className="mt-6 rounded-sm border border-gold/40 bg-gold/5 p-4 text-sm text-gold">
        Template to finalise: replace the bracketed fields
        (<code>[LEGAL ENTITY]</code>, <code>[ADDRESS]</code>,
        <code>[SUPPORT EMAIL]</code>, <code>[GOVERNING LAW]</code>) and have this
        reviewed by a lawyer before public launch.
      </div>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-silver">
        <section>
          <h2 className="font-display text-xl text-cream">1. Who we are</h2>
          <p>
            Palais Horizon (&quot;Palais Horizon&quot;, &quot;we&quot;,
            &quot;us&quot;) is operated by [LEGAL ENTITY], [ADDRESS]. Contact:
            [SUPPORT EMAIL].
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">2. What the service is</h2>
          <p>
            Palais Horizon is an <strong>index of third-party property
            listings</strong> in Thailand. We aggregate listings published by
            real-estate agencies and portals, present them in one searchable
            catalogue, and link each listing back to the agency that holds it.
          </p>
          <p className="mt-2">
            We are <strong>not</strong> a real-estate agency or broker. We do not
            hold mandates, do not represent buyers or sellers, are not a party to
            any sale, lease or negotiation, and receive no commission on any
            transaction. All property details (price, availability, description,
            photos) originate from the source agency and may be inaccurate or out
            of date; you must verify everything directly with that agency.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">3. Membership &amp; billing</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Access to the catalogue requires a paid membership. The current
              price is shown on the{" "}
              <Link href="/pricing" className="text-gold hover:underline">
                membership page
              </Link>
              .
            </li>
            <li>
              Payments are processed by Stripe. We never see or store your full
              card details.
            </li>
            <li>
              Membership renews automatically each period until cancelled. You can
              cancel anytime from your account; access continues until the end of
              the paid period.
            </li>
            <li>
              Except where required by law, payments are non-refundable. We may
              change pricing with notice; existing members keep their rate until
              their next renewal after the change takes effect.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">4. Acceptable use</h2>
          <p>
            One membership is for one person. Do not scrape, resell, or
            redistribute the catalogue, share your login, or use the service to
            send unsolicited messages to agencies. We may suspend or terminate
            accounts that break these rules or abuse the service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">5. No warranty; liability</h2>
          <p>
            The service is provided &quot;as is&quot;. We do not warrant that
            listings are accurate, complete, available, or suitable for any
            purpose. To the maximum extent permitted by law, our total liability
            to you is limited to the amount you paid us in the 12 months before
            the claim.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-cream">6. Changes &amp; contact</h2>
          <p>
            We may update these terms; material changes will be notified by email
            or on the site. Questions: [SUPPORT EMAIL]. These terms are governed by
            the laws of [GOVERNING LAW].
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
