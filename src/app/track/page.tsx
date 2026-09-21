import type { Metadata } from "next";
import { TrackWizard } from "@/components/TrackWizard";
import { getServerDict } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerDict();
  return { title: t.track.title };
}

export default function TrackPage() {
  return <TrackWizard />;
}
