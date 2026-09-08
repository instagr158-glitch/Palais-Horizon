import { prisma } from "../lib/db";
import { runIngest } from "./ingest";

/** CLI wrapper — `npm run ingest [adapterName]`. */
async function main() {
  const only = process.argv[2];
  await runIngest(only, (line) => console.log(line));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
