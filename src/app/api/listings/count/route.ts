import { NextResponse } from "next/server";
import { queryListings } from "@/lib/listings";

export const dynamic = "force-dynamic";

/**
 * Public, unauthenticated count of active listings matching a filter —
 * used by the Track quiz to show a real "X annonces disponibles" figure
 * before checkout, without exposing any paywalled listing detail (price,
 * photos, address). Safe to leave open: it's a number, not the catalogue.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country") ?? undefined;
  const listingType = searchParams.get("listingType") ?? undefined;
  const maxPriceParam = searchParams.get("maxPrice");

  const result = await queryListings({
    country,
    listingType,
    maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
    perPage: 1,
  });

  return NextResponse.json({ count: result.total });
}
