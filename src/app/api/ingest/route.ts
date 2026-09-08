import { NextResponse } from "next/server";
import { runIngest } from "@/ingest/ingest";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Refreshes the catalogue from every enabled source adapter.
 *
 * Triggered by the Vercel Cron defined in vercel.json (a GET with
 * `Authorization: Bearer <CRON_SECRET>`), or manually with `INGEST_SECRET`.
 */
async function handle(req: Request) {
  const header = req.headers.get("authorization") ?? "";
  const cronSecret = process.env.CRON_SECRET;
  const ingestSecret = process.env.INGEST_SECRET;

  const ok =
    (cronSecret && header === `Bearer ${cronSecret}`) ||
    (ingestSecret && header === `Bearer ${ingestSecret}`);

  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  try {
    const stats = await runIngest();
    return NextResponse.json({
      ok: true,
      ...stats,
      ms: Date.now() - started,
    });
  } catch (err) {
    console.error("Ingest failed:", err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}

export const GET = handle;
export const POST = handle;
