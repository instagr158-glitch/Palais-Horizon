# Deploying Palais Horizon (Vercel + Postgres)

Same setup as `muscu-app`: **Vercel CLI**, **PostgreSQL**, Prisma migrations.
No GitHub repo required.

---

## 0. One-time: prepare a Postgres database

Pick one (both have a free tier):

- **Prisma Postgres** *(recommended — simplest)* —
  [console.prisma.io](https://console.prisma.io) → new project → copy the
  `DATABASE_URL` (a `prisma+postgres://…` string). It works for both the app and
  migrations, no extra config.
- **Neon** — [neon.tech](https://neon.tech) → new project → use the **direct**
  connection string (the one **without** `-pooler`) as `DATABASE_URL`. The app is
  small, so a dedicated pool isn't needed. If you do use the pooled URL, append
  `?pgbouncer=true` to it.

Create **two** databases (one for local dev, one for production) once you have
real customers — never test against the live data.

---

## 1. Local: point the app at Postgres

In `.env`:

```
DATABASE_URL="postgresql://…the string from step 0…"
```

Then:

```bash
npx prisma migrate deploy   # creates the tables
npm run db:seed             # loads the 24 demo listings + 2 demo accounts
npm run dev                 # http://localhost:3001
```

(For a throwaway local DB you can also run `npx prisma dev` — it starts a bundled
Postgres and prints a URL to paste into `.env`.)

---

## 2. Stripe — LIVE mode

1. [dashboard.stripe.com](https://dashboard.stripe.com) → toggle to **Live mode**.
2. **Developers → API keys** → `sk_live_…` and `pk_live_…`.
3. **Product catalogue → Add product** "Palais Horizon Membership" → recurring
   price **€19.00 / month** → copy the `price_…` id.
4. **Settings → Billing → Customer portal → Activate** (in Live mode too).
5. Webhook is added *after* the first deploy (step 4 below) once you know the URL.

Keep these values for the Vercel env vars — don't put live keys in `.env`.

---

## 3. Deploy with the Vercel CLI

```bash
npm i -g vercel
vercel login
vercel            # first run: links the project, creates .vercel/
vercel --prod     # deploys to production
```

The first `vercel` run asks a few questions — accept the defaults (framework:
Next.js). It prints a `https://…vercel.app` URL.

---

## 4. Set the environment variables in Vercel

**Project → Settings → Environment Variables** (Environment: *Production*):

| Name | Value |
|---|---|
| `DATABASE_URL` | your production Postgres string |
| `NEXTAUTH_SECRET` | a fresh `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-domain.com` (or the `.vercel.app` URL for now) |
| `APP_URL` | same as `NEXTAUTH_URL` |
| `STRIPE_SECRET_KEY` | `sk_live_…` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_…` |
| `STRIPE_PRICE_MONTHLY` | the live `price_…` |
| `STRIPE_WEBHOOK_SECRET` | filled in step 5 |
| `CRON_SECRET` | a random string |

Then redeploy so they take effect:

```bash
vercel --prod
```

The `build` step runs `prisma migrate deploy` automatically against `DATABASE_URL`,
so the production tables are created/updated on every deploy.

**Seed production once** (from your machine, with `.env` pointing at the prod DB):

```bash
npm run db:seed
```

---

## 5. Stripe webhook (production)

1. Stripe (Live) → **Developers → Webhooks → Add endpoint**
2. URL: `https://your-domain.com/api/webhooks/stripe`
3. Events: `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`
4. Copy the **Signing secret** (`whsec_…`) → set `STRIPE_WEBHOOK_SECRET` in Vercel
   → `vercel --prod`.

---

## 6. Custom domain

Vercel → **Settings → Domains** → add your domain → follow the DNS instructions.
Then update `NEXTAUTH_URL` and `APP_URL` to the final domain and `vercel --prod`.

---

## 7. Cron (listings refresh)

`vercel.json` registers a daily job hitting `/api/ingest`. Check it appears under
**Settings → Cron Jobs** after deploy. Add source URLs in
`src/ingest/sources/urls.txt` (see `INGESTION.md`) and redeploy.

Trigger it manually any time:

```bash
curl -H "Authorization: Bearer $INGEST_SECRET" https://your-domain.com/api/ingest
```

---

## Updating the site later

```bash
vercel --prod
```

---

## Before a public launch (not blocking the deploy)

- A legal entity able to invoice (auto-entrepreneur / company) + bank account.
- VAT: enable **Stripe Tax**.
- Fill in and lawyer-review `/terms` and `/privacy` (bracketed fields).
- Vercel's free Hobby plan is non-commercial — move to **Pro (~$20/mo)** once
  you're charging customers publicly.
