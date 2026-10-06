import { Suspense, cache } from "react";
import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { getServerDict } from "@/i18n/server";
import type { Dict } from "@/i18n";
import { queryListings, formatEur, formatUsd, priceTexts, type FullListing } from "@/lib/listings";
import { VillaCatalog, type VillaCard } from "@/components/VillaCatalog";
import { HeroSkeleton, CatalogSkeleton } from "@/components/ParisSkeleton";
import { PartsHero } from "@/components/PartsHero";
import { Reveal } from "@/components/Reveal";

export const dynamic = "force-dynamic";

// Properties above this price get the "high-end" badge and are capped in
// the teaser, like the Bali and Paris home pages keep only a handful of
// premium ones.
const PREMIUM_MIN_USD = 800_000;
const MAX_PREMIUM = 8;
// Hand-picked by request — not yet in the ingested catalogue (their URLs
// were added to the ingest source list too, so they'll also flow into the
// database on the next refresh), checked live on the agency's site.
const PINNED_PROPERTIES = [
  {
    id: "pinned-2-bedroom-villa-for-sale-or-rent-in-gree",
    url: "https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-or-rent-in-green-home-pool-villa-at-hua-hin-hin-lek-fai-prachuap-khiri-khan_85aea306a908-9a61-c942-8a66-26e5d089",
    title: "2 Bedroom Villa for Sale or Rent in Green Home Pool Villa at Hua Hin, Hin Lek Fai",
    location: "Prachuap Khiri Khan",
    bedrooms: 2,
    priceUsd: 98261,
    images: [
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTljNGIzNy0zM2YxLTc1MGQtODNmMC0xOTBmMzk2ZmJmNDEvMTliOWY5YTBmZjY2OWRjYTYwNWQ1ZjJmYjFlMTYyOTM2ZDY0MDg5Yjk5MTE1MjM0NTNhYTkxODk5YWIxN2ViMS5qcGVnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTljNGIzNy0zM2YxLTc1MGQtODNmMC0xOTBmMzk2ZmJmNDEvMWYxOGRmZTBlMWJjNjVjZDczZjFiMzk1MWNhNjFkNzY1OWMxMDJmYzcyMDM2NTgzN2QzYzI0Mjc3ZDA0YjY4ZC53ZWJwIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTljNGIzNy0zM2YxLTc1MGQtODNmMC0xOTBmMzk2ZmJmNDEvOWE0NjgzYzVlODgyMWVkMWZhODUyMWM4YzYyYzgyMjc4ZmUxNTM1NGI5ZGRkOTJjYzIzOGRiZjEzNGE0ZTZhZC53ZWJwIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTljNGIzNy0zM2YxLTc1MGQtODNmMC0xOTBmMzk2ZmJmNDEvN2VjZTVkYjA2M2EyYWEzNWYxMzFhYTE3ZGQxYWIyYjc1ZjdmZDcwZjkxNzQ1OGQwYzQ0Y2MwNTA3MWZjMTI2Mi5qcGVnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
    ],
  },
  {
    id: "pinned-2-bedroom-villa-for-sale-or-rent-in-tara",
    url: "https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-or-rent-in-taradol-resort-hua-hin-prachuap-khiri-khan_82d9f0a000f6-3e1e-5cd2-c125-14e5d089",
    title: "2 Bedroom Villa for Sale or Rent in Taradol Resort, Hua Hin",
    location: "Prachuap Khiri Khan",
    bedrooms: 2,
    priceUsd: 92754,
    images: [
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTljNGI1OC00NzhkLTdjZDQtYjhiNi0zYTk5OWY5YTBjNzEvZThiMzAyNmE4NDlmZjdjYzFhN2JmMmRkYjE5MGRmOTkwZjdkM2RjMTllMTMyMWVjY2JiMWFmNzFiZDZkNjEyMy5qcGVnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTljNGI1OC00NzhkLTdjZDQtYjhiNi0zYTk5OWY5YTBjNzEvOTBiN2EzODBhZGEzYzNmN2FmNGEwNTA4MDI3OTRjOTdhNDUwNDBjOTU0YjRkZjFlMGYyZDc1OGU5MWRhN2RiNS5qcGVnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTljNGI1OC00NzhkLTdjZDQtYjhiNi0zYTk5OWY5YTBjNzEvNmZkMmEzZjZlZWE2YmEzYTk2YjUzODAwYWY1MWU0ZTcxZjdmMzIxN2QzM2Q3NGFjN2JiMTdmYTM4MDdkMjQ4ZS53ZWJwIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTljNGI1OC00NzhkLTdjZDQtYjhiNi0zYTk5OWY5YTBjNzEvOTJhNTNhYWZhYmNjMTg4YmM0MDZhM2RmYjBkMDdhMGJiYjE5ZjA5YWE1ZmE1Njk3M2Q5M2NmNzI0NDI3NjJkMS5qcGVnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
    ],
  },
  {
    id: "pinned-3-bedroom-villa-for-sale-in-warisa-pool-",
    url: "https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-warisa-pool-villa-huahin-hin-lek-fai-prachuap-khiri-khan_9f92106ed25c-0580-6f92-f034-73e5d089",
    title: "3 Bedroom Villa for sale in Warisa Pool Villa HuaHin, Hin Lek Fai",
    location: "Prachuap Khiri Khan",
    bedrooms: 3,
    priceUsd: 104348,
    images: [
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTljNGI2Mi01NjlhLTcwYTMtOTE0OS1kNDdjYjM5ODcwYTAvNWFjMWMzYjA5OGNjNDMwMTk4N2MwM2JhN2Y4NjI5MWU5YmY5MDI0NDUxODI4NWY3N2RkNmU5Y2FmMWIxZjQzNS53ZWJwIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTljNGI2Mi01NjlhLTcwYTMtOTE0OS1kNDdjYjM5ODcwYTAvMWFiNDY4NGViMjE5NTcxNTkxMGFmNmVjZDUyOWQ2ZjM0NDk2MjU0Y2U3OTI3ZWU4OGRlMDlmNGE3Nzg5M2JkZi5qcGVnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTljNGI2Mi01NjlhLTcwYTMtOTE0OS1kNDdjYjM5ODcwYTAvNjJlNGE3ZGQ0YzZmY2JkZDM0Y2E0Mzc0YjgxYzRmMGRlNjg0NGUwNzU3MzllZTU1NTRjMjQwNjg4YTZkMjFjYy5qcGVnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTljNGI2Mi01NjlhLTcwYTMtOTE0OS1kNDdjYjM5ODcwYTAvZGY4NjIyZmQ1ZTkwNDQzNGMyOTczZWM0ZThlMWMzNDRkYzUwNDlhMzI3YzAxMDBmNTUyZWQ5OGRhNTNmODY1ZC53ZWJwIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
    ],
  },
  {
    id: "pinned-3-bedroom-villa-for-sale-or-rent-in-the-",
    url: "https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-the-rico-huahin-hin-lek-fai-prachuap-khiri-khan_e57485805e9a-805e-3f92-5618-b43fa089",
    title: "3 Bedroom Villa for Sale or Rent in The Rico Huahin, Hin Lek Fai",
    location: "Prachuap Khiri Khan",
    bedrooms: 3,
    priceUsd: 103478,
    images: [
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTlmYTY1ZS0xODM0LTcwYTYtYjQ5MS1mMGI0OTE0MTUyNGIvNjMyZThmYzBmODU0OWEwYzFmOGQ1NTljZDFjYTA0NTNhYmUyY2UyYmM2ZjAxMGYwZTFmMTI2NzY0YzY0ODI1Ny5qcGVnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTlmYTY1ZS0xODM0LTcwYTYtYjQ5MS1mMGI0OTE0MTUyNGIvNDdmMjIzZTU4NzM4OGYyYTgyMzM5NTNmZmE4YWM0Yjk3ODAyMTZmMzI1YTdiODJmMjIzYjlhNDdjM2FmZGMyNi5qcGVnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTlmYTY1ZS0xODM0LTcwYTYtYjQ5MS1mMGI0OTE0MTUyNGIvOTA1YWU3NzNiODRmMGFjNWRkOWE5NWM0MTNiNDc3ZWRiOGQyNjJmNGUyNDg5MTg1NWRlMmI0MGEyNDdkNDVhYy5qcGVnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTlmYTY1ZS0xODM0LTcwYTYtYjQ5MS1mMGI0OTE0MTUyNGIvZDdmMDk0NzE4MjlhN2Y4MTU3OGRlYWU5NDNjNzg0YjdlMWY2Y2I0N2E1MWQ4NDViMGNmZjAwNjE3ZTI1MmQ2Ni5qcGVnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
    ],
  },
  {
    id: "pinned-2-bedroom-villa-for-sale-in-sattahip-cho",
    url: "https://www.thailand-property.com/ads/2-bedroom-villa-for-sale-in-sattahip-chonburi_39c3d5be7af9-50be-4ac2-cb52-8538b089",
    title: "2 Bedroom Villa for sale in Sattahip",
    location: "Chonburi",
    bedrooms: 2,
    priceUsd: 104058,
    images: [
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTllMTY0MS03NGVkLTdkZjUtYmU5NC0wYWYyYmU0YzZkMDYvZTgwZjY0OTdkM2FjM2RkZjY5ODk2ZTZiMDY3NzU1ZDZkZWExMmE5MWQyMzExZjE2NzE1NDE4YmQwYWJiOGRmYi53ZWJwIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTllMTY0MS03NGVkLTdkZjUtYmU5NC0wYWYyYmU0YzZkMDYvODE5MGVhM2FiOGQxMTRiNDJmZTYyNDYyNzkwMGI4OTdmNWIzOGNiNTc2N2NiNjI5NThkNDIyNjZlMTk5Mjc2OC53ZWJwIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTllMTY0MS03NGVkLTdkZjUtYmU5NC0wYWYyYmU0YzZkMDYvMjg1OWZiZmM1NWMzMDIxMWYwNWQ0ZmEyMTIzZjYxODI0NmJkM2ZkNDhiYWYyMzRhNGU4NmU3Zjg3YWE0NzdlNi53ZWJwIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJpbmdlc3Rlci8wMTllMTY0MS03NGVkLTdkZjUtYmU5NC0wYWYyYmU0YzZkMDYvYTc0NTgzNjQ5ZWEyNjA5NzczYTM2YWE4OGQ0NmY1N2EwODY1NmU2NDY0ZGQyOGQxM2I2MTA4YzlhZTg0MjVmYy53ZWJwIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
    ],
  },
  {
    id: "pinned-4-bedroom-villa-for-sale-in-i-leaf-prime",
    url: "https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-i-leaf-prime-pattaya-jomtien-huai-yai-chonburi_e5ae17572cbc-898e-eb42-0e77-6f75c089",
    title: "4 Bedroom Villa for sale in I Leaf Prime Pattaya-Jomtien",
    location: "Chonburi",
    bedrooms: 4,
    priceUsd: 105797,
    images: [
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJwcm9wZXJ0aWVzLzAxOWQ0MmEzLTIyYjktNzVlYi1iMTAxLWRlZDcyNDI4YmY0Yi8wMTlkNDJhNi03MmMwLTcyZjctOTc0Ny02OWI5YTk3NmUzNGYucG5nIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJwcm9wZXJ0aWVzLzAxOWQ0MmEzLTIyYjktNzVlYi1iMTAxLWRlZDcyNDI4YmY0Yi8wMTlkNDJhNi03NzhkLTcxZTktYWY1NC1lNDk2YmU3YzU3ZWEuanBnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJwcm9wZXJ0aWVzLzAxOWQ0MmEzLTIyYjktNzVlYi1iMTAxLWRlZDcyNDI4YmY0Yi8wMTlkNDJhNi03NjdmLTcyZjctOGJjOC05YWRiNTk3MDFkMTUuanBnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
      "https://img.thailand-property.com/eyJidWNrZXQiOiJwcmQtbGlmdWxsY29ubmVjdC1iYWNrZW5kLWIyYi1pbWFnZXMiLCJrZXkiOiJwcm9wZXJ0aWVzLzAxOWQ0MmEzLTIyYjktNzVlYi1iMTAxLWRlZDcyNDI4YmY0Yi8wMTlkNDJhNi03NjdmLTcyZjctOGJjOC05YWRiNTk3MDFkMTUuanBnIiwiYnJhbmQiOiJ0aGFpbGFuZHByb3BlcnR5IiwiZWRpdHMiOnsicm90YXRlIjpudWxsLCJyZXNpemUiOnsid2lkdGgiOjExNzAsImhlaWdodCI6NzgwLCJmaXQiOiJjb3ZlciJ9fX0=",
    ],
  },
];

// The home page teaser shows the 6 hand-picked properties in PINNED_PROPERTIES.
const HOME_SELECTION_SIZE = 6;

export async function generateMetadata() {
  const t = await getServerDict();
  return { title: t.thailand.badge };
}

function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

// Memoized per request: the Hero and Catalog sections each read this from
// their own Server Component (streamed in separate Suspense boundaries).
const getProperties = cache(async (): Promise<FullListing[]> => {
  const { listings } = await queryListings({
    country: "thailand",
    listingType: "sale",
    sort: "price_asc",
    perPage: 48,
  });
  // Land listings rarely have compelling photos for a visual, hero-driven page.
  const eligible = listings.filter((l) => l.propertyType !== "land");
  const standard = eligible.filter((l) => (l.priceUsd ?? 0) < PREMIUM_MIN_USD);
  const premium = eligible.filter((l) => (l.priceUsd ?? 0) >= PREMIUM_MIN_USD).slice(0, MAX_PREMIUM);
  return [...standard, ...premium];
});

// Members see the newest listings first instead of the hand-picked teaser.
const getRecentProperties = cache(async (): Promise<FullListing[]> => {
  const { listings } = await queryListings({
    country: "thailand",
    listingType: "sale",
    sort: "recent",
    perPage: 48,
  });
  return listings.filter((l) => l.propertyType !== "land");
});

// Split into their own Server Components so they can stream in behind
// Suspense rather than blocking the whole page on the database query.
async function HeroSection({ t, locale }: { t: Dict["thailand"]; locale: string }) {
  const properties = await getProperties();
  const prices = [
    ...properties.filter((l) => l.priceUsd != null).map((l) => l.priceUsd!),
    ...PINNED_PROPERTIES.map((p) => p.priceUsd),
  ];
  const minUsd = prices.length ? Math.min(...prices) : null;
  const maxUsd = prices.length ? Math.max(...prices) : null;
  const heroPhotos = properties
    .filter((l) => l.images[0])
    .slice(0, 5)
    .map((l) => l.images[0]);
  // French and German visitors see euros first, English visitors dollars first.
  const primary = locale === "en" ? formatUsd : formatEur;

  return (
    <PartsHero
      photos={heroPhotos}
      eyebrow={t.badge}
      lead={t.titleLead}
      trail={t.titleTrail}
      cta={t.cta}
      stats={[
        { value: minUsd != null ? primary(minUsd) : "—", label: t.statFromLabel },
        {
          value: minUsd != null && maxUsd != null ? `${primary(minUsd)} – ${primary(maxUsd)}` : "—",
          label: t.statRangeLabel,
        },
      ]}
    />
  );
}

async function CatalogSection({
  t,
  isMember,
  locale,
  sortRecentLabel,
}: {
  t: Dict["thailand"];
  isMember: boolean;
  locale: string;
  sortRecentLabel: string;
}) {
  const recent = isMember ? await getRecentProperties() : [];
  const recentCards: VillaCard[] = recent.slice(0, HOME_SELECTION_SIZE).map((l) => ({
    id: l.id,
    href: l.agencyUrl,
    external: true,
    place: [l.district, l.city].filter(Boolean).join(", ") || l.province,
    title: l.title,
    photos: l.images.slice(0, 4),
    price: l.priceUsd ?? 0,
    createdAt: new Date(l.createdAt).getTime(),
    ...priceTexts(l.priceUsd, locale),
    specsText: [
      l.bedrooms ? (l.bedrooms === 1 ? t.bedroomOne : fmt(t.bedrooms, { n: l.bedrooms })) : null,
      l.areaSqm ? `${l.areaSqm} m²` : null,
    ]
      .filter(Boolean)
      .join(" · "),
    landSqm: l.landSqm,
    landText: l.landSqm ? `${l.landSqm} m²` : null,
    premium: (l.priceUsd ?? 0) >= PREMIUM_MIN_USD,
  }));

  // Visitors see the 6 hand-picked properties above; members the newest listings.
  const pinnedCards: VillaCard[] = PINNED_PROPERTIES.map((p) => ({
    id: p.id,
    href: isMember ? p.url : "/pricing-thailand?locked=thailand",
    external: isMember,
    place: p.location,
    title: p.title,
    photos: p.images,
    price: p.priceUsd,
    ...priceTexts(p.priceUsd, locale),
    specsText: p.bedrooms === 1 ? t.bedroomOne : fmt(t.bedrooms, { n: p.bedrooms }),
    landSqm: null,
    landText: null,
    premium: p.priceUsd >= PREMIUM_MIN_USD,
  }));

  return (
    <VillaCatalog
      cards={isMember ? recentCards : pinnedCards}
      seeMoreHref={isMember ? "/listings?country=thailand&from=thailand" : "/pricing-thailand?locked=thailand"}
      seeMoreLabel={t.seeMore}
      labels={{
        all: t.filterAll,
        under: t.filterUnder,
        mid: t.filterMid,
        premium: t.filterPremium,
        favorites: t.filterFavorites,
        noFavorites: t.noFavorites,
        sortLabel: t.sortLabel,
        sortRecent: isMember ? sortRecentLabel : undefined,
        sortPrice: t.sortPrice,
        sortLand: t.sortLand,
        premiumBadge: t.premium,
        view: t.view,
        addFavorite: t.addFavorite,
        removeFavorite: t.removeFavorite,
        empty: t.empty,
      }}
    />
  );
}

export default async function ThailandPage() {
  const dict = await getServerDict();
  const t = dict.thailand;
  const nf = dict.code === "fr" ? "fr-FR" : dict.code === "de" ? "de-DE" : "en-US";
  const session = await auth();
  const isMember = hasActiveSubscription(session?.user);

  const steps = [
    { title: t.step1Title, body: t.step1Body },
    { title: t.step2Title, body: t.step2Body },
    { title: t.step3Title, body: t.step3Body },
  ];

  return (
    <div>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection t={t} locale={dict.code} />
      </Suspense>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section className="py-16 sm:py-24">
          <ol className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {steps.map((step, i) => (
              <Reveal key={step.title} delayMs={i * 120}>
                <li className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 sm:p-7">
                  <span className="num pointer-events-none absolute -right-2 -top-6 font-display text-[7rem] font-semibold leading-none text-gold/10">
                    {i + 1}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-sm font-semibold text-gold">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-cream">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dim">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <div id="biens" className="scroll-mt-16">
          <Suspense fallback={<CatalogSkeleton count={HOME_SELECTION_SIZE} />}>
            <CatalogSection
              t={t}
              isMember={isMember}
              locale={dict.code}
              sortRecentLabel={dict.listings.sorts[0]}
            />
          </Suspense>
        </div>

        <div className="mt-16 space-y-2 pb-16">
          <p className="text-xs leading-relaxed text-dim">
            {fmt(t.note, { date: new Date().toLocaleDateString(nf, { dateStyle: "long" }) })}
          </p>
          <p className="text-xs leading-relaxed text-dim">
            <span className="font-semibold text-gold">{t.disclaimerTitle}</span>
            {t.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
