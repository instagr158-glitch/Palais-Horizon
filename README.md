# Palais Horizon

A members-only index of **luxury property across Thailand** — villas, fine houses
and premium condos/penthouses. Visitors see a blurred teaser on the landing page;
everything else (prices, exact locations, full galleries and a direct link to the
listing agency) is behind a paid membership.

Built to run at **zero fixed cost**: Next.js + SQLite + a home-grown ingestion
pipeline. Stripe is the only external service and it charges nothing until a
member actually pays.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS — palette from the logo (black / gold `#D4AF37` / silver) |
| Database | Prisma + PostgreSQL (local: `npx prisma dev`; prod: Prisma Postgres / Neon) |
| Auth | NextAuth (email + password, JWT sessions) |
| Payments | Stripe Checkout + Billing Portal (test mode by default) |
| Data | `src/ingest` pipeline + a real seed in `prisma/seed-data.ts` |

---

## Quick start

```bash
npm install
cp .env.example .env        # then edit .env — set a Postgres DATABASE_URL
npx prisma dev              # optional: starts a local Postgres, prints a URL for .env
npx prisma migrate deploy   # create the tables
npm run db:seed             # load real luxury listings + 2 demo accounts
npm run dev                 # http://localhost:3001 (see note below)
```

**Going live:** see [`DEPLOY.md`](./DEPLOY.md) (Vercel CLI + Postgres, same as
`muscu-app`).

> **Port** — this machine already runs another project on `:3000`, so the dev
> server and `.env` are set to `:3001`. On a free machine, change `port` in
> `.claude/launch.json` and `APP_URL` / `NEXTAUTH_URL` in `.env` back to `3000`.

### Demo accounts (created by the seed)

| Email | Password | Access |
|---|---|---|
| `member@palaishorizon.com` | `password123` | active membership — full catalogue |
| `visitor@palaishorizon.com` | `password123` | registered, no membership |

---

## Environment (`.env`)

The app runs **without Stripe** — the membership button just shows "payment not
configured". To enable real checkout:

1. Create a free Stripe account (**country: France** — Stripe has no Thai option),
   switch to **Test mode**.
2. **Developers → API keys** → copy into `STRIPE_SECRET_KEY` and
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. **Product catalogue → Add product** "Palais Horizon Membership" → add one
   recurring price **€19 / month** → copy the `price_…` ID into
   `STRIPE_PRICE_MONTHLY`. (Add a yearly price later and put its ID in
   `STRIPE_PRICE_ANNUAL` to also show an annual plan — it's optional.)
4. **Settings → Billing → Customer portal → Activate** (so "Manage billing" works).
5. Run the webhook listener while developing:
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```
   Copy the `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET`.

Test card: `4242 4242 4242 4242`, any future date, any CVC. The current membership
price shown on `/pricing` is **€19 / month** (edit in `src/components/PricingTable.tsx`).

---

## Languages (EN / FR / DE)

Everyone lands on **English** so the site is always understandable. On the first
visit a language picker (`src/components/LanguageGate.tsx`) — shown in English —
lets the visitor switch to Français or Deutsch; the choice is stored in the
`NEXT_LOCALE` cookie and can be changed anytime from the header
(`LanguageSwitcher`). The default is set in `src/i18n/server.ts` (`getLocale`). All UI copy lives in `src/i18n/{en,fr,de}.ts` — `en.ts` is
the source of truth and the other two must match its shape (TypeScript enforces
this). Server components read the locale with `getServerDict()` /
`getLocale()` (`src/i18n/server.ts`); client components use the `useI18n()` hook.

Listing **titles and descriptions stay in English** — they come straight from the
agencies. To add a language: copy `en.ts`, translate the values, and register it
in `src/i18n/index.ts` (`LOCALES`, `LOCALE_LABELS`, `DICTS`).

## The paywall

- **Landing page** teasers are fed only `{photo, city, propertyType}` — no price
  or address is ever sent to the browser for non-members.
- `/listings` and `/listings/[id]` are protected by `src/middleware.ts`
  (must be signed in **and** have an active membership) and re-checked inside each
  page (`hasActiveSubscription` in `src/lib/subscription.ts`).
- `/account` is reachable by any signed-in user so they can (re)subscribe or open
  the Stripe billing portal.

---

## Listings data

- `prisma/seed-data.ts` holds ~24 **real, current** luxury listings (real title,
  price, location, size, agency and a working link to the agency's own page).
- `src/ingest/` refreshes and expands the catalogue — see
  [`INGESTION.md`](./INGESTION.md).

```bash
npm run ingest            # run every enabled source adapter
npm run ingest generic-jsonld   # run one adapter
```

---

## Your logo

Drop the circular black/gold logo file at `public/logo.png` and it is used
everywhere automatically. Until then a faithful inline SVG stand-in
(`src/components/Logo.tsx`) is shown.

---

## Deploy (still free)

- **Hosting:** Vercel Hobby (non-commercial) or any Node host / VPS you own.
- **Database:** swap `provider = "sqlite"` for `"postgresql"` in
  `prisma/schema.prisma` and point `DATABASE_URL` at a free Neon or Turso DB.
- **Cron:** a scheduled GitHub Action runs `npm run ingest` (see `INGESTION.md`).

---

## Legal note

Palais Horizon is an **index of third-party listings**. It does not hold property
mandates and is not a party to any sale or lease — every listing links back to the
originating agency. Confirm each source site's terms before enabling automated
ingestion of it.
