// Runs `prisma migrate deploy`, but never fails the build.
// - DATABASE_URL valid            -> migrations applied, tables ready
// - DATABASE_URL missing / wrong  -> logs a warning, build continues; the next
//   deploy (once the URL is fixed) applies the migrations.
import { execSync } from "node:child_process";

try {
  // `prisma` loads .env itself, so this works both locally and on Vercel
  // (where DATABASE_URL is a real environment variable).
  execSync("prisma migrate deploy", { stdio: "inherit" });
} catch {
  console.warn(
    "\n⚠  `prisma migrate deploy` did not run (DATABASE_URL missing or wrong).\n" +
      "   The build continues. Fix DATABASE_URL and redeploy to create the tables.\n",
  );
}
process.exit(0);
