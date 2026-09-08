import { PrismaClient } from "@prisma/client";

/**
 * Neon's pooled endpoints (host contains "-pooler") run PgBouncer in transaction
 * mode, which breaks Prisma's prepared statements unless `pgbouncer=true` is set.
 * Normalise the URL so the app works with either the pooled or the direct string.
 */
function resolveDbUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  if (url.includes("-pooler.") && !/[?&]pgbouncer=/.test(url)) {
    return url + (url.includes("?") ? "&" : "?") + "pgbouncer=true";
  }
  return url;
}

const log: ("error" | "warn")[] =
  process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

function makeClient() {
  const url = resolveDbUrl();
  // Only pass datasourceUrl when we actually have one, otherwise let Prisma read
  // the schema's env("DATABASE_URL") (important during `next build`).
  return url ? new PrismaClient({ datasourceUrl: url, log }) : new PrismaClient({ log });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
