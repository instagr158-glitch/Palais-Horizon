# Palais Horizon — going live, step by step

You have accounts for **Vercel**, **GitHub** and **Prisma**. You still need a
**Stripe** account. Total time: ~1 hour. Follow the parts in order.

Legend: 💻 = a command in the project folder · 🌐 = something you do on a website.

---

## Part 0 — Install the two CLI tools (2 min)

💻

```bash
npm install -g vercel
```

Git is already installed. The Stripe CLI is already installed on this machine
(`stripe --version` to check).

---

## Part 1 — Create the database (Prisma Postgres) (5 min)

🌐 [console.prisma.io](https://console.prisma.io) → **New project**

- Name: `palais-horizon`
- Region: **Frankfurt** (eu-central-1) — closest to your users
- Click **Create**, then open the project → **Database** → **Connect** → copy the
  connection string. It looks like:
  `prisma+postgres://accelerate.prisma-data.net/?api_key=…`

Keep this — it is your `DATABASE_URL`.

> Later, for a clean separation, create a **second** project `palais-horizon-prod`
> and use its URL only in Vercel. For now one is fine.

---

## Part 2 — Set up the project locally (10 min)

💻 In the project folder:

```bash
npm install
cp .env.example .env
```

Open `.env` and fill:

| Variable | Value |
|---|---|
| `DATABASE_URL` | the string from Part 1 |
| `NEXTAUTH_SECRET` | run `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` and paste the output |
| `APP_URL` | `http://localhost:3001` |
| `NEXTAUTH_URL` | `http://localhost:3001` |
| `CRON_SECRET` | any random string |
| `INGEST_SECRET` | any random string |
| the `STRIPE_*` lines | leave empty for now |

Then:

```bash
npx prisma migrate deploy   # creates the tables in your database
npm run db:seed             # loads 24 demo listings + 2 demo accounts
npm run dev                 # open http://localhost:3001
```

Check the site loads and the language gate appears. It now runs on your real
cloud database.

Demo logins:
`member@palaishorizon.com` / `password123` (has membership) ·
`visitor@palaishorizon.com` / `password123` (no membership).

---

## Part 3 — Stripe in TEST mode (15 min)

🌐 [dashboard.stripe.com](https://dashboard.stripe.com) → create account →
**Country: France**. Stay in **Test mode** (toggle, top-right).

1. **Developers → API keys** → copy **Secret key** (`sk_test_…`) and
   **Publishable key** (`pk_test_…`).
2. **Product catalogue → + Add product**
   - Name: `Palais Horizon Membership`
   - Price: **Recurring**, **€19.00**, billing period **Monthly** → **Save**
   - Open the price → copy its ID (`price_…`)
3. **Settings → Billing → Customer portal** → **Activate test link**.

💻 Put these in `.env`:

```
STRIPE_SECRET_KEY="sk_test_…"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_…"
STRIPE_PRICE_MONTHLY="price_…"
```

4. **Webhook for local testing** — open a **second terminal** in the project:

```bash
stripe login
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

It prints `whsec_…` — put it in `.env`:

```
STRIPE_WEBHOOK_SECRET="whsec_…"
```

5. Restart `npm run dev`. Test the full flow:
   - Register a new account → you land on the membership page
   - Click **Continue** → Stripe Checkout → card **4242 4242 4242 4242**, any
     future date, any CVC, any postcode
   - You come back and the catalogue unlocks (prices, agency links visible)
   - `/account` → **Manage billing** opens the Stripe portal

If that works, the app is fully functional. Now put it online.

---

## Part 4 — Push the code to GitHub (5 min)

🌐 [github.com/new](https://github.com/new)
- Repository name: `palais-horizon`
- **Private**
- **Do not** add a README, .gitignore or licence (the project already has them)
- **Create repository**

💻 The project already has a first commit. Connect it and push (replace
`YOUR-USERNAME`):

```bash
git remote add origin https://github.com/YOUR-USERNAME/palais-horizon.git
git push -u origin main
```

When it asks for a password, paste a **Personal Access Token**, not your GitHub
password:
🌐 github.com → Settings → Developer settings → Personal access tokens → Tokens
(classic) → Generate new token → scope **`repo`** → copy it → use it as the
password. (Or install the GitHub CLI: `gh auth login`.)

---

## Part 5 — Deploy on Vercel (10 min)

🌐 [vercel.com/new](https://vercel.com/new)
- **Import** the `palais-horizon` GitHub repo
- Framework preset: **Next.js** (auto-detected) — leave build settings as is
- **Before clicking Deploy**, open **Environment Variables** and add all of these
  (Environment: leave "All" selected):

| Name | Value |
|---|---|
| `DATABASE_URL` | your Prisma Postgres string |
| `NEXTAUTH_SECRET` | a **new** `randomBytes(32)` value (different from local) |
| `NEXTAUTH_URL` | `https://palais-horizon.vercel.app` (adjust after first deploy) |
| `APP_URL` | same as `NEXTAUTH_URL` |
| `STRIPE_SECRET_KEY` | `sk_test_…` (switch to live in Part 8) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_…` |
| `STRIPE_PRICE_MONTHLY` | `price_…` |
| `CRON_SECRET` | a random string |
| `INGEST_SECRET` | a random string |

- Click **Deploy**. Wait ~2 min.
- Vercel gives you a URL like `https://palais-horizon-xxxx.vercel.app`. If it
  differs from what you put in `NEXTAUTH_URL`/`APP_URL`, fix those two variables
  (**Settings → Environment Variables**) and **Redeploy** (Deployments → ⋯ →
  Redeploy).

The build runs `prisma migrate deploy` automatically, so your database tables are
created on deploy. **Seed the production data once** — 💻 with your `.env` still
pointing at the same database:

```bash
npm run db:seed
```

---

## Part 6 — Stripe webhook for the live site (5 min)

🌐 Stripe (still **Test mode**) → **Developers → Webhooks → Add endpoint**
- Endpoint URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.updated`,
  `customer.subscription.deleted`
- **Add endpoint** → copy the **Signing secret** (`whsec_…`)

🌐 Vercel → **Settings → Environment Variables** → add
`STRIPE_WEBHOOK_SECRET` = that `whsec_…` → **Redeploy**.

---

## Part 7 — Test the live site

🌐 Open your `.vercel.app` URL:
- Register → subscribe with card `4242 4242 4242 4242` → catalogue unlocks
- Stripe → Payments: the test payment appears
- Stripe → Webhooks: the endpoint shows "succeeded" deliveries
- Vercel → Settings → **Cron Jobs**: `/api/ingest` is listed

If all green, the SaaS is live (in test mode).

---

## Part 8 — Switch Stripe to LIVE (when you're ready to charge real money)

🌐 Stripe → flip to **Live mode**, then repeat:
1. **API keys** → `sk_live_…`, `pk_live_…`
2. Recreate the product + **€19/month** price → new `price_…`
3. **Customer portal** → activate (live)
4. **Webhooks** → add the same endpoint URL, same events → new `whsec_…`

🌐 Vercel → **Settings → Environment Variables** → replace
`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_MONTHLY`,
`STRIPE_WEBHOOK_SECRET` with the **live** values → **Redeploy**.

Do one real test: subscribe yourself with a real card for €19, confirm access,
then refund yourself from Stripe.

---

## Part 9 — Custom domain

🌐 Buy a domain (OVH, Namecheap, Porkbun…). In Vercel → **Settings → Domains** →
add it → follow the DNS records shown. Once it's verified:

🌐 Vercel → Environment Variables → set `NEXTAUTH_URL` and `APP_URL` to
`https://yourdomain.com` → **Redeploy**.
🌐 Stripe → Webhooks → update the endpoint URL to the new domain.

---

## Part 10 — Before you promote it publicly

- **Legal pages**: open `src/app/terms/page.tsx` and `src/app/privacy/page.tsx`,
  replace every `[BRACKETED]` field (legal entity, address, support email,
  governing law), commit, `git push` (Vercel redeploys automatically).
- **Register a business** able to invoice (auto-entrepreneur is enough to start).
- **VAT**: Stripe → Settings → **Tax** → enable Stripe Tax.
- **Vercel plan**: the free Hobby plan is for non-commercial use — upgrade to
  **Pro (~$20/month)** once you're charging customers.

---

## Updating the site later

💻

```bash
git add -A && git commit -m "…" && git push
```

Vercel redeploys automatically on every push to `main`.

---

## Growing the catalogue

Add luxury-listing URLs (one per line) to `src/ingest/sources/urls.txt`, commit,
push. The daily Vercel cron imports them. Run it now instead of waiting:

```bash
curl -H "Authorization: Bearer YOUR_INGEST_SECRET" https://yourdomain.com/api/ingest
```

See `INGESTION.md` for adding new source types.
