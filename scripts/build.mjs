/**
 * Build orchestrator — cross-platform, resilient to database config.
 *
 *   1. prisma generate       (needs *a* DATABASE_URL to validate the schema —
 *                             a placeholder is injected if the real one is absent)
 *   2. prisma migrate deploy (best effort — never fails the build)
 *   3. next build
 *
 * The real DATABASE_URL still has to be set in the hosting env for the app to
 * work at runtime; this just guarantees the build itself always completes.
 */
import { execSync } from "node:child_process";

const env = { ...process.env };
const hasRealDbUrl = !!env.DATABASE_URL;

if (!hasRealDbUrl) {
  env.DATABASE_URL =
    "postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public";
  console.warn(
    "\n⚠  DATABASE_URL is not set in this environment.\n" +
      "   Using a placeholder so the build can finish, but the deployed app\n" +
      "   will not work until you add a real DATABASE_URL and redeploy.\n",
  );
}

const run = (cmd, { allowFail = false } = {}) => {
  console.log(`\n▶ ${cmd}`);
  try {
    execSync(cmd, { stdio: "inherit", env });
  } catch (err) {
    if (allowFail) {
      console.warn(`⚠  "${cmd}" failed — continuing.`);
      return;
    }
    throw err;
  }
};

run("prisma generate");
run("prisma migrate deploy", { allowFail: true });
run("next build");
