import { prisma } from "../lib/db";
import { fetchHtml } from "./sources/base";
import { enabledAdapters } from "./sources";
import { assessLuxury } from "./luxuryFilter";
import { normalize } from "./normalize";

export type IngestStats = {
  added: number;
  updated: number;
  rejected: number;
  failed: number;
};

type Logger = (line: string) => void;
const noop: Logger = () => {};

// Sequential, one fetch at a time, made the catalogue's ~1,300 URLs take far
// longer than Vercel's function time limit — the cron kept timing out partway
// through the list and never reached sources added later in urls.txt. Fetching
// a batch concurrently cuts wall-clock time by roughly this factor.
const CONCURRENCY = 25;

async function processOne(
  adapterName: string,
  url: string,
  log: Logger,
): Promise<{ result: "added" | "updated" | "rejected" | "failed"; externalId?: string; title?: string }> {
  const adapter = enabledAdapters().find((a) => a.name === adapterName)!;
  const html = await fetchHtml(url);
  if (!html) return { result: "failed" };

  const raw = adapter.parse(url, html);
  if (!raw) {
    log(`  ? no data extracted: ${url}`);
    return { result: "failed" };
  }

  const verdict = assessLuxury(raw);
  if (!verdict.keep) {
    log(`  - rejected (${verdict.reason}): ${raw.title}`);
    return { result: "rejected" };
  }

  const data = normalize(raw, adapter.name, verdict.score);

  const existing = await prisma.listing.findUnique({
    where: {
      source_externalId: { source: adapter.name, externalId: data.externalId },
    },
  });

  await prisma.listing.upsert({
    where: {
      source_externalId: { source: adapter.name, externalId: data.externalId },
    },
    create: { ...data, status: "active", lastSeenAt: new Date() },
    update: { ...data, status: "active", lastSeenAt: new Date() },
  });

  if (existing) {
    log(`  ~ updated: ${data.title}`);
    return { result: "updated", externalId: data.externalId, title: data.title };
  }
  log(`  + added:   ${data.title}`);
  return { result: "added", externalId: data.externalId, title: data.title };
}

async function runAdapter(
  name: string,
  log: Logger,
  offset: number,
  limit: number | undefined,
): Promise<IngestStats & { total: number }> {
  const stats: IngestStats = { added: 0, updated: 0, rejected: 0, failed: 0 };
  const adapter = enabledAdapters().find((a) => a.name === name);
  if (!adapter) return { ...stats, total: 0 };

  const allUrls = await adapter.listUrls();
  const urls = limit != null ? allUrls.slice(offset, offset + limit) : allUrls.slice(offset);
  log(
    `[${adapter.name}] ${allUrls.length} URL(s) total, processing ${urls.length} (offset ${offset})`,
  );
  if (urls.length === 0) return { ...stats, total: allUrls.length };

  const seenExternalIds: string[] = [];

  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((url) => processOne(name, url, log)),
    );
    for (const r of results) {
      stats[r.result]++;
      if (r.externalId) seenExternalIds.push(r.externalId);
    }
  }

  // Only a full, unpaginated pass has seen every URL for this adapter — on a
  // partial (offset/limit) run, anything outside this slice would otherwise
  // get wrongly marked inactive just for not appearing in this batch.
  const isFullRun = offset === 0 && (limit == null || limit >= allUrls.length);
  if (isFullRun && seenExternalIds.length > 0) {
    const stale = await prisma.listing.updateMany({
      where: {
        source: adapter.name,
        status: "active",
        externalId: { notIn: seenExternalIds },
      },
      data: { status: "inactive" },
    });
    if (stale.count > 0) log(`  . ${stale.count} marked inactive`);
  }

  return { ...stats, total: allUrls.length };
}

/**
 * Run every enabled source adapter (or just `only`). Safe to call from a route
 * handler (Vercel Cron) or from the CLI (`npm run ingest`).
 *
 * `offset`/`limit` process only a slice of each adapter's URL list, so a run
 * too large to finish inside one serverless invocation can be split across
 * several calls (e.g. offset=0&limit=300, then offset=300&limit=300, …).
 * Stale-listing cleanup only runs on a full, unpaginated pass.
 */
export async function runIngest(
  only?: string,
  log: Logger = noop,
  offset = 0,
  limit?: number,
): Promise<IngestStats & { totalUrls: number }> {
  const adapters = enabledAdapters().filter((a) => !only || a.name === only);
  const total: IngestStats & { totalUrls: number } = {
    added: 0,
    updated: 0,
    rejected: 0,
    failed: 0,
    totalUrls: 0,
  };

  for (const a of adapters) {
    const s = await runAdapter(a.name, log, offset, limit);
    total.added += s.added;
    total.updated += s.updated;
    total.rejected += s.rejected;
    total.failed += s.failed;
    total.totalUrls += s.total;
  }

  log(
    `Done. ${total.added} added, ${total.updated} updated, ` +
      `${total.rejected} rejected (non-luxury), ${total.failed} failed.`,
  );
  return total;
}
