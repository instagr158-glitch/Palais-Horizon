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

async function runAdapter(name: string, log: Logger): Promise<IngestStats> {
  const stats: IngestStats = { added: 0, updated: 0, rejected: 0, failed: 0 };
  const adapter = enabledAdapters().find((a) => a.name === name);
  if (!adapter) return stats;

  const urls = await adapter.listUrls();
  log(`[${adapter.name}] ${urls.length} URL(s)`);
  if (urls.length === 0) return stats;

  const seenExternalIds: string[] = [];

  for (const url of urls) {
    const html = await fetchHtml(url);
    if (!html) {
      stats.failed++;
      continue;
    }
    const raw = adapter.parse(url, html);
    if (!raw) {
      log(`  ? no data extracted: ${url}`);
      stats.failed++;
      continue;
    }

    const verdict = assessLuxury(raw);
    if (!verdict.keep) {
      log(`  - rejected (${verdict.reason}): ${raw.title}`);
      stats.rejected++;
      continue;
    }

    const data = normalize(raw, adapter.name, verdict.score);
    seenExternalIds.push(data.externalId);

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
      stats.updated++;
      log(`  ~ updated: ${data.title}`);
    } else {
      stats.added++;
      log(`  + added:   ${data.title}`);
    }
  }

  if (seenExternalIds.length > 0) {
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

  return stats;
}

/**
 * Run every enabled source adapter (or just `only`). Safe to call from a route
 * handler (Vercel Cron) or from the CLI (`npm run ingest`).
 */
export async function runIngest(
  only?: string,
  log: Logger = noop,
): Promise<IngestStats> {
  const adapters = enabledAdapters().filter((a) => !only || a.name === only);
  const total: IngestStats = { added: 0, updated: 0, rejected: 0, failed: 0 };

  for (const a of adapters) {
    const s = await runAdapter(a.name, log);
    total.added += s.added;
    total.updated += s.updated;
    total.rejected += s.rejected;
    total.failed += s.failed;
  }

  log(
    `Done. ${total.added} added, ${total.updated} updated, ` +
      `${total.rejected} rejected (non-luxury), ${total.failed} failed.`,
  );
  return total;
}
