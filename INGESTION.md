# Feeding the catalogue

Palais Horizon keeps listings in one table (`Listing`). There are three ways in,
from cheapest/simplest to most powerful.

---

## 1. The seed (already done)

`prisma/seed-data.ts` contains ~24 real luxury listings. Re-run any time:

```bash
npm run db:seed
```

Edit that file to add, remove or correct listings by hand — useful for a curated
"signature" selection.

---

## 2. The `generic-jsonld` adapter (free, no dependencies)

Most agency listing pages embed **schema.org structured data** (`RealEstateListing`,
`Residence`, `Product`/`Offer`) and Open Graph tags. The generic adapter reads
those.

1. Put one listing-detail URL per line in `src/ingest/sources/urls.txt`
   (or set `INGEST_URLS="url1,url2"` in `.env`).
2. Run:
   ```bash
   npm run ingest
   ```
3. Each URL is fetched, parsed, passed through the **luxury filter**
   (`src/ingest/luxuryFilter.ts` — price floors + keywords) and upserted.
   Listings previously ingested from an adapter but missing this run are marked
   `inactive`.

Good sources for this (public listing pages, no hard bot-wall observed):
`conradproperties.asia`, `three-seasons-properties.com`,
`thailand-property.com`, `list-sothebysrealty.com`.

> Some big portals (FazWaz, DDproperty, Hipflat) sit behind Cloudflare and will
> return `403` to a plain fetch. Skip them here — see option 3.

---

## 3. Add a dedicated source adapter

For a site that needs custom parsing (or a sitemap/RSS crawl), add one file:

```ts
// src/ingest/sources/my-agency.ts
import type { SourceAdapter, RawListing } from "./base";
import { fetchHtml } from "./base";

const adapter: SourceAdapter = {
  name: "my-agency",
  enabled: true,
  async listUrls() {
    // e.g. read a sitemap and return the /property/* URLs
    return [];
  },
  parse(url, html): RawListing | null {
    // return a RawListing (see base.ts for the shape) or null to skip
    return null;
  },
};
export default adapter;
```

Then register it in `src/ingest/sources/index.ts`:

```ts
import myAgency from "./my-agency";
export const ADAPTERS = [genericJsonLd, myAgency];
```

`RawListing` fields are all optional except `externalId`, `sourceUrl`,
`agencyName`, `agencyUrl`, `title`. `normalize.ts` fills gaps (province guessing,
type mapping, THB→USD, etc).

---

## 4. Schedule it for free (GitHub Actions)

`.github/workflows/ingest.yml`:

```yaml
name: Refresh listings
on:
  schedule: [{ cron: "0 */6 * * *" }]   # every 6 hours
  workflow_dispatch:
jobs:
  ingest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run db:push
      - run: npm run ingest
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}   # your free Neon/Turso URL
```

(With SQLite committed to the repo you would instead commit `prisma/dev.db` back;
a hosted Postgres is cleaner once you deploy.)

---

## If you later get a budget

A paid scraping service (Apify has ready-made actors for FazWaz, DDproperty and
Thailand-Property) can feed the same pipeline: write a thin adapter whose
`listUrls()`/`parse()` call the Apify dataset instead of fetching HTML. Nothing
else changes.
