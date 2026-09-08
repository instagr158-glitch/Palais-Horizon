/**
 * Build orchestrator — cross-platform, resilient to database config.
 *
 *   1. prisma generate   (needs *a* DATABASE_URL to validate the schema —
 *                         a placeholder is injected if the real one is absent)
 *   2. next build
 *
 * Database migrations are applied separately (`npm run db:migrate`, or once from
 * a machine with the DB URL) — not during the Vercel build.
 */
import { execSync } from "node:child_process";

const env = { ...process.env };

if (!env.DATABASE_URL) {
  env.DATABASE_URL =
    "postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public";
  console.warn(
    "\n⚠  DATABASE_URL is not set — using a placeholder so the build finishes.\n" +
      "   Add a real DATABASE_URL in the hosting env and redeploy for the app to work.\n",
  );
}

function run(cmd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", env });
}

run("prisma generate");
run("next build");
