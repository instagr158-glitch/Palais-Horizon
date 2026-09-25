import type { Metadata } from "next";
import { LandingContent } from "@/components/LandingContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Bali" };

export default function BaliLandingPage() {
  return <LandingContent market="bali" />;
}
