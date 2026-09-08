import { PrismaClient } from "@prisma/client";

/**
 * Neon's pooled endpoints (host contains "-pooler") run PgBouncer in transaction
 * mode, which breaks Prisma's prepared statements unless `pgbouncer=true` is set.
 * Normalise the URL here so it works whether the deploy config uses the pooled or
 * the direct connection string.
 */
function resolveDbUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  if (url.includes("-pooler.") && !/[?&]pgbouncer=/.test(url)) {
    return url + (url.includes("?") ? "&" : "?") + "pgbouncer=true";
  }
  return url;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: resolveDbUrl(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
