/**
 * Real luxury listings gathered from public agency pages (Sept 2026).
 * Facts that matter — title, price, location, size, agency, source URL — are real
 * and the `agencyUrl` links to the live listing. Photos are representative stock
 * (real og:images are attached automatically when the ingestion pipeline runs).
 */

const EXTERIOR = [
  "1600596542815-ffad4c1539a9",
  "1600585154340-be6161a56a0c",
  "1600047509807-ba8f99d2cdde",
  "1512917774080-9991f1c4c750",
  "1580587771525-78b9dba3b914",
  "1613977257363-707ba9348227",
  "1600210492493-0946911123ea",
  "1613490493576-7fde63acd811",
  "1600585152915-d208bec867a1",
  "1568605114967-8130f3a36994",
  "1600585153490-76fb20a32601",
  "1523217582562-09d0def993a6",
  "1600121848594-d8644e57abab",
];

const INTERIOR = [
  "1600566753086-00f18fb6b3ea",
  "1600607687939-ce8a6c25118c",
  "1600566753190-17f0baa2a6c3",
  "1600563438938-a9a27216b4f5",
  "1600566752355-35792bedcfea",
  "1600607687920-4e2a09cf159d",
  "1600210491892-03d54c0aaf87",
  "1502672260266-1c1ef2d93688",
  "1493809842364-78817add7ffb",
  "1583608205776-bfd35f0d9f83",
  "1584622650111-993a426fbf0a",
  "1567496898669-ee935f5f647a",
  "1522708323590-d24dbb6b0267",
];

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

function gallery(seed: number, count = 5): string[] {
  const out: string[] = [img(EXTERIOR[seed % EXTERIOR.length])];
  for (let i = 0; i < count - 1; i++) {
    const pool = i % 2 === 0 ? INTERIOR : EXTERIOR;
    out.push(img(pool[(seed + i + 1) % pool.length]));
  }
  return out;
}

const THB_PER_USD = 34.5;
const usd = (thb: number) => Math.round(thb / THB_PER_USD / 1000) * 1000;

type Raw = {
  externalId: string;
  agencyName: string;
  agencyUrl: string;
  title: string;
  description: string;
  propertyType: "villa" | "house" | "penthouse" | "condo" | "land";
  listingType?: "sale" | "rent";
  priceAmount: number;
  priceUsd?: number;
  bedrooms: number;
  bathrooms: number;
  areaSqm?: number;
  landSqm?: number;
  province: string;
  city: string;
  district?: string;
  addressText?: string;
  lat?: number;
  lng?: number;
  amenities: string[];
  furnished?: boolean;
  featured?: boolean;
};

const POOL = "Private swimming pool";

export const LISTINGS: Raw[] = [
  // ---------------- Phuket · Conrad Properties ----------------
  {
    externalId: "conrad-millionaires-mile-kamala",
    agencyName: "Conrad Properties",
    agencyUrl:
      "https://www.conradproperties.asia/properties/ultra-luxury-sea-view-villa-on-millionaires-mile-phuket",
    title: "Ultra-Luxury 6-Bedroom Sea View Pool Villa on Millionaire's Mile",
    description:
      "Experience unparalleled luxury on Phuket's coveted west coast near Kamala Beach. This spectacular six-bedroom pool villa, extensively renovated in 2022, sits on a headland offering breathtaking panoramic ocean and sunset views. Six spacious suites accommodate twelve guests; the master features a private terrace with jacuzzi plunge pool and outdoor soaking tub. Freehold with Chanote title, full villa staff and 24-hour estate security.",
    propertyType: "villa",
    priceAmount: 139_450_000,
    priceUsd: 4_300_000,
    bedrooms: 6,
    bathrooms: 6,
    areaSqm: 1800,
    landSqm: 2200,
    province: "Phuket",
    city: "Kamala",
    district: "Kathu",
    addressText: "Millionaire's Mile, Kamala, Phuket",
    lat: 7.9553,
    lng: 98.2831,
    amenities: [
      "17m salt-filtration swimming pool",
      "Master suite with private jacuzzi",
      "Media room with projector",
      "Games room with pool table",
      "Private spa room",
      "Full villa staff (manager, chef, housekeeping)",
      "24-hour estate security",
      "Freehold — Chanote title",
    ],
    furnished: true,
    featured: true,
  },
  {
    externalId: "conrad-bang-tao-beach-4bed",
    agencyName: "Conrad Properties",
    agencyUrl:
      "https://www.conradproperties.asia/properties/luxury-villa-for-sale-phuket-bang-tao-beach",
    title: "Luxury 4-Bedroom Villa Close to Bang Tao Beach",
    description:
      "An elegant residence offering a secluded sanctuary while remaining minutes from Phuket's most elite beach clubs. Open-plan living with vaulted ceilings, a professional designer kitchen with Gaggenau appliances, spa-inspired master suite and a sustainable 60kW solar system. Mature tropical gardens with ambient lighting frame a 12-metre private pool.",
    propertyType: "villa",
    priceAmount: 60_000_000,
    priceUsd: usd(60_000_000),
    bedrooms: 4,
    bathrooms: 5,
    areaSqm: 824,
    landSqm: 824,
    province: "Phuket",
    city: "Bang Tao",
    district: "Choeng Thale",
    addressText: "Bang Tao, Choeng Thale, Phuket",
    lat: 7.9954,
    lng: 98.2931,
    amenities: [
      "12m private swimming pool",
      "Designer kitchen with Gaggenau appliances",
      "Media room",
      "Double carport with automatic security gate",
      "60kW solar panel system",
      "Air-conditioned walk-in pantry with wine fridge",
      "Mature tropical gardens",
    ],
    furnished: true,
    featured: true,
  },
  {
    externalId: "conrad-bang-tao-4bed-528",
    agencyName: "Conrad Properties",
    agencyUrl:
      "https://www.conradproperties.asia/properties/4-bedroom-luxury-villa-for-sale-bang-tao-phuket",
    title: "Elegant 4-Bedroom Luxury Pool Villa in Bang Tao",
    description:
      "A refined four-bedroom pool villa in the sought-after Bang Tao / Laguna area, walking distance to boutiques, restaurants and the beach. Bright open-plan living areas flow to a covered terrace and private pool set within landscaped gardens.",
    propertyType: "villa",
    priceAmount: 43_000_000,
    priceUsd: usd(43_000_000),
    bedrooms: 4,
    bathrooms: 4,
    areaSqm: 528,
    province: "Phuket",
    city: "Bang Tao",
    district: "Choeng Thale",
    lat: 7.9931,
    lng: 98.2967,
    amenities: [POOL, "Covered terrace", "Landscaped gardens", "Fitted kitchen", "Carport"],
    furnished: true,
  },
  {
    externalId: "conrad-nai-harn-4bed",
    agencyName: "Conrad Properties",
    agencyUrl:
      "https://www.conradproperties.asia/properties/exclusive-4-bed-modern-pool-villa-for-sale-phuket",
    title: "Exclusive 4-Bedroom Modern Pool Villa near Nai Harn",
    description:
      "A contemporary four-bedroom villa on a generous 750 sqm plot in the peaceful south of the island, minutes from Nai Harn Beach and Rawai. Clean architectural lines, floor-to-ceiling glazing and a large pool terrace for indoor–outdoor living.",
    propertyType: "villa",
    priceAmount: 36_900_000,
    priceUsd: usd(36_900_000),
    bedrooms: 4,
    bathrooms: 4,
    areaSqm: 400,
    landSqm: 750,
    province: "Phuket",
    city: "Nai Harn",
    district: "Mueang Phuket",
    lat: 7.7745,
    lng: 98.3035,
    amenities: [POOL, "Floor-to-ceiling glazing", "Pool terrace", "Open-plan living", "Off-street parking"],
    furnished: true,
  },
  {
    externalId: "conrad-laguna-penthouse",
    agencyName: "Conrad Properties",
    agencyUrl:
      "https://www.conradproperties.asia/properties/seaview-penthouse-for-sale-phuket-2",
    title: "Oceanview 2-Bedroom Penthouse with Private Pool, Laguna",
    description:
      "A rare duplex penthouse inside a five-star branded residence in Laguna, with a private rooftop pool and uninterrupted views over the golf course to the Andaman Sea. Full resort facilities, rental programme and foreign-freehold title available.",
    propertyType: "penthouse",
    priceAmount: 75_900_000,
    priceUsd: usd(75_900_000),
    bedrooms: 2,
    bathrooms: 3,
    areaSqm: 316,
    province: "Phuket",
    city: "Laguna",
    district: "Choeng Thale",
    lat: 8.0009,
    lng: 98.2986,
    amenities: [
      "Private rooftop pool",
      "Branded five-star residence",
      "Resort facilities & spa",
      "Managed rental programme",
      "Foreign freehold available",
    ],
    furnished: true,
    featured: true,
  },
  {
    externalId: "conrad-cherng-talay-lakeview",
    agencyName: "Conrad Properties",
    agencyUrl:
      "https://www.conradproperties.asia/properties/4-bedroom-pool-villa-for-sale-in-phuket",
    title: "Lake View 4-Bedroom Pool Villa in Cherng Talay",
    description:
      "A serene four-bedroom villa overlooking a private lake in Cherng Talay, close to Laguna and Bang Tao. Expansive 728 sqm of living space, large infinity-edge pool and sun deck facing the water.",
    propertyType: "villa",
    priceAmount: 32_500_000,
    priceUsd: usd(32_500_000),
    bedrooms: 4,
    bathrooms: 5,
    areaSqm: 728,
    province: "Phuket",
    city: "Cherng Talay",
    district: "Choeng Thale",
    lat: 7.9889,
    lng: 98.3016,
    amenities: ["Infinity-edge pool", "Lake frontage", "Sun deck", "Western kitchen", "Maid's quarters"],
    furnished: true,
  },
  {
    externalId: "conrad-rawai-1162",
    agencyName: "Conrad Properties",
    agencyUrl:
      "https://www.conradproperties.asia/properties/spacious-pool-villa-300-meters-to-rawai-beach",
    title: "Spacious 4-Bedroom Pool Villa, 300m to Rawai Beach",
    description:
      "A substantial family villa on a 1,162 sqm plot just 300 metres from Rawai Beach. Four large bedrooms, sociable open-plan living, a big private pool and tropical garden with room to expand.",
    propertyType: "villa",
    priceAmount: 30_000_000,
    priceUsd: usd(30_000_000),
    bedrooms: 4,
    bathrooms: 5,
    areaSqm: 500,
    landSqm: 1162,
    province: "Phuket",
    city: "Rawai",
    district: "Mueang Phuket",
    lat: 7.7803,
    lng: 98.3251,
    amenities: [POOL, "300m to the beach", "Large tropical garden", "Open-plan living", "Double carport"],
    furnished: true,
  },
  {
    externalId: "conrad-ao-por-bayfront",
    agencyName: "Conrad Properties",
    agencyUrl:
      "https://www.conradproperties.asia/properties/3-bed-villa-ao-yon-phuket-sea-view-freehold",
    title: "Bayfront 3-Bedroom Sea View Villa, Ao Por",
    description:
      "A freehold three-bedroom villa on the quiet north-east coast at Ao Por, with sweeping views over the bay and islands and easy access to the marina. Ideal lock-up-and-leave with a private pool and covered terrace.",
    propertyType: "villa",
    priceAmount: 28_000_000,
    priceUsd: usd(28_000_000),
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 320,
    province: "Phuket",
    city: "Ao Por",
    district: "Pa Khlok",
    lat: 8.0503,
    lng: 98.4213,
    amenities: [POOL, "Bay and island views", "Close to Ao Po Grand Marina", "Freehold title", "Covered terrace"],
    furnished: true,
  },
  {
    externalId: "conrad-patong-penthouse",
    agencyName: "Conrad Properties",
    agencyUrl:
      "https://www.conradproperties.asia/properties/3-bed-foreign-freehold-penthouse-with-pool-in-patong",
    title: "Foreign-Freehold 3-Bedroom Penthouse with Pool, Patong",
    description:
      "A top-floor three-bedroom penthouse with its own plunge pool in a well-managed Patong building, moments from the beach and nightlife. Sold foreign freehold with strong short-term rental history.",
    propertyType: "penthouse",
    priceAmount: 29_900_000,
    priceUsd: usd(29_900_000),
    bedrooms: 3,
    bathrooms: 3,
    areaSqm: 210,
    province: "Phuket",
    city: "Patong",
    district: "Kathu",
    lat: 7.8987,
    lng: 98.2969,
    amenities: ["Private plunge pool", "Foreign freehold", "Rental management", "Covered parking", "Sea glimpses"],
    furnished: true,
  },

  // ---------------- Phuket · Thailand-Property ----------------
  {
    externalId: "tp-lakewood-hills-6bed",
    agencyName: "Thailand-Property (FazWaz Phuket)",
    agencyUrl:
      "https://www.thailand-property.com/ads/6-bedroom-villa-for-sale-in-lakewood-hills-villa-choeng-thale-phuket_bc61f588e11b-dbe0-7812-19d1-f883c089",
    title: "6-Bedroom Villa in Lakewood Hills, Choeng Thale",
    description:
      "A commanding six-bedroom residence in the gated Lakewood Hills estate above Layan, with 1,200 sqm of living space, hillside views, a large infinity pool and separate staff accommodation.",
    propertyType: "villa",
    priceAmount: 69_990_000,
    priceUsd: usd(69_990_000),
    bedrooms: 6,
    bathrooms: 6,
    areaSqm: 1200,
    province: "Phuket",
    city: "Choeng Thale",
    district: "Thalang",
    lat: 8.0181,
    lng: 98.3021,
    amenities: ["Infinity pool", "Gated estate", "Hillside views", "Staff accommodation", "Home cinema"],
    furnished: true,
  },
  {
    externalId: "tp-surin-heights-4bed",
    agencyName: "Thailand-Property (FazWaz Phuket)",
    agencyUrl:
      "https://www.thailand-property.com/ads/4-bedroom-villa-for-sale-in-surin-heights-choeng-thale-phuket_d0f1bbc6e699-7191-89f2-8c98-e5e5d089",
    title: "4-Bedroom Sea View Villa in Surin Heights",
    description:
      "A contemporary four-bedroom villa in the exclusive Surin Heights community, with panoramic sea views toward Surin and Bang Tao, a 500 sqm layout and a west-facing infinity pool for sunset views.",
    propertyType: "villa",
    priceAmount: 105_341_419,
    priceUsd: usd(105_341_419),
    bedrooms: 4,
    bathrooms: 4,
    areaSqm: 500,
    province: "Phuket",
    city: "Surin",
    district: "Choeng Thale",
    lat: 7.9797,
    lng: 98.2807,
    amenities: ["West-facing infinity pool", "Panoramic sea views", "Smart-home system", "Gated community", "Sky lounge"],
    furnished: true,
    featured: true,
  },
  {
    externalId: "tp-baan-cocoon-5bed",
    agencyName: "Thailand-Property (LivePhuket)",
    agencyUrl:
      "https://www.thailand-property.com/ads/5-bedroom-villa-for-sale-in-baan-cocoon-kathu-phuket_876dbc9b3e26-d34e-29b2-994b-fe149f89",
    title: "5-Bedroom Villa in Baan Cocoon, Kathu",
    description:
      "A private five-bedroom villa in the boutique Baan Cocoon development in central Kathu, with 500 sqm of accommodation across two pavilions, a 15-metre lap pool and mature gardens.",
    propertyType: "villa",
    priceAmount: 68_000_000,
    priceUsd: usd(68_000_000),
    bedrooms: 5,
    bathrooms: 6,
    areaSqm: 500,
    province: "Phuket",
    city: "Kathu",
    district: "Kathu",
    lat: 7.9107,
    lng: 98.3327,
    amenities: ["15m lap pool", "Two pavilions", "Mature gardens", "Central location", "Covered sala"],
    furnished: true,
  },
  {
    externalId: "tp-zenithy-luxe-3bed",
    agencyName: "Thailand-Property (LivePhuket)",
    agencyUrl:
      "https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-zenithy-luxe-si-sunthon-phuket_130de96d6046-6ca0-1dd2-9b4f-80169f89",
    title: "3-Bedroom Villa in Zenithy Luxe, Si Sunthon",
    description:
      "A sleek three-bedroom pool villa in the Zenithy Luxe project near Boat Avenue and Laguna, 338 sqm on a private plot with a modern open kitchen and a saltwater pool.",
    propertyType: "villa",
    priceAmount: 22_000_000,
    priceUsd: usd(22_000_000),
    bedrooms: 3,
    bathrooms: 3,
    areaSqm: 338,
    province: "Phuket",
    city: "Si Sunthon",
    district: "Thalang",
    lat: 8.0009,
    lng: 98.3411,
    amenities: ["Saltwater pool", "Close to Boat Avenue", "Modern open kitchen", "Carport", "Private garden"],
    furnished: true,
  },
  {
    externalId: "tp-baan-wana-3bed",
    agencyName: "Thailand-Property (FazWaz Phuket)",
    agencyUrl:
      "https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-baan-wana-pool-villas-si-sunthon-phuket_e6748eaf74eb-551e-47d2-87d8-61069f89",
    title: "3-Bedroom Villa in Baan Wana Pool Villas",
    description:
      "A well-kept three-bedroom villa in the established Baan Wana Pool Villas estate near Laguna, 290 sqm with a private pool, tropical garden and 24-hour security.",
    propertyType: "villa",
    priceAmount: 16_900_000,
    priceUsd: usd(16_900_000),
    bedrooms: 3,
    bathrooms: 3,
    areaSqm: 290,
    province: "Phuket",
    city: "Si Sunthon",
    district: "Thalang",
    lat: 7.9995,
    lng: 98.3357,
    amenities: [POOL, "Gated estate", "24-hour security", "Tropical garden", "Near Laguna"],
    furnished: true,
  },
  {
    externalId: "tp-trichada-3bed",
    agencyName: "Thailand-Property (FazWaz Phuket)",
    agencyUrl:
      "https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-in-trichada-villa-phuket-choeng-thale-phuket_145d37d0a1c6-ca81-48d2-2a95-2e839f89",
    title: "3-Bedroom Villa in Trichada, Choeng Thale",
    description:
      "A bright, modern three-bedroom villa in the popular Trichada community near Layan Beach, with a private pool, open-plan living and a rental-friendly layout.",
    propertyType: "villa",
    priceAmount: 19_000_000,
    priceUsd: usd(19_000_000),
    bedrooms: 3,
    bathrooms: 2,
    areaSqm: 200,
    province: "Phuket",
    city: "Choeng Thale",
    district: "Thalang",
    lat: 8.0102,
    lng: 98.2977,
    amenities: [POOL, "Near Layan Beach", "Open-plan living", "Rental potential", "Carport"],
    furnished: true,
  },
  {
    externalId: "tp-chalong-3bed",
    agencyName: "Thailand-Property (LivePhuket)",
    agencyUrl:
      "https://www.thailand-property.com/ads/3-bedroom-villa-for-sale-or-rent-in-chalong-phuket_1d733c759e89-6c91-37d2-79b9-a7e5d089",
    title: "3-Bedroom Villa on 600 sqm Plot, Chalong",
    description:
      "A private three-bedroom villa on a large 600 sqm plot in Chalong, central for the whole island, with a big pool, carport for three cars and a self-contained studio.",
    propertyType: "villa",
    priceAmount: 30_600_000,
    priceUsd: usd(30_600_000),
    bedrooms: 3,
    bathrooms: 3,
    areaSqm: 600,
    landSqm: 600,
    province: "Phuket",
    city: "Chalong",
    district: "Mueang Phuket",
    lat: 7.8462,
    lng: 98.3381,
    amenities: [POOL, "600 sqm plot", "Guest studio", "3-car carport", "Central location"],
    furnished: true,
  },

  // ---------------- Koh Samui · Three Seasons Properties ----------------
  {
    externalId: "3s-bang-por-designer-5bed",
    agencyName: "Three Seasons Properties",
    agencyUrl:
      "https://three-seasons-properties.com/villa-for-sale/luxury-5-bedroom-designer-villa-with-panoramic-sea-view-for-sale-in-bang-por-koh-samui-b402c5s/",
    title: "Luxury 5-Bedroom Designer Villa with Panoramic Sea View, Bang Por",
    description:
      "An architect-designed five-bedroom estate on the quiet north coast at Bang Por, 954 sqm of living space cascading down the hillside to a horizon-edge pool with 180-degree sea views toward Koh Phangan.",
    propertyType: "villa",
    priceAmount: 65_000_000,
    priceUsd: 1_950_000,
    bedrooms: 5,
    bathrooms: 6,
    areaSqm: 954,
    province: "Surat Thani",
    city: "Bang Por",
    district: "Koh Samui",
    lat: 9.5803,
    lng: 99.9512,
    amenities: [
      "Horizon-edge infinity pool",
      "180° sea views",
      "Architect-designed",
      "Home automation",
      "Staff quarters",
      "Double garage",
    ],
    furnished: true,
    featured: true,
  },
  {
    externalId: "3s-bang-por-5bed-b401",
    agencyName: "Three Seasons Properties",
    agencyUrl:
      "https://three-seasons-properties.com/villa-for-sale/luxury-5-bedroom-sea-view-pool-villa-for-sale-in-bang-por-koh-samui-b401c5s/",
    title: "Luxury 5-Bedroom Sea View Pool Villa, Bang Por",
    description:
      "A generous five-bedroom villa on a 958 sqm hillside plot at Bang Por, with a large infinity pool, sunset sea views and a separate media pavilion.",
    propertyType: "villa",
    priceAmount: 38_000_000,
    priceUsd: 1_140_000,
    bedrooms: 5,
    bathrooms: 6,
    areaSqm: 958,
    province: "Surat Thani",
    city: "Bang Por",
    district: "Koh Samui",
    lat: 9.5811,
    lng: 99.9531,
    amenities: ["Infinity pool", "Sunset sea views", "Media pavilion", "Hillside plot", "Covered parking"],
    furnished: true,
  },
  {
    externalId: "3s-bophut-4bed-ph358",
    agencyName: "Three Seasons Properties",
    agencyUrl:
      "https://three-seasons-properties.com/villa-for-sale/ph358modern-4-bed-sea-view-pool-villa/",
    title: "Modern 4-Bedroom Sea View Pool Villa, Bophut Hills",
    description:
      "A crisp modern four-bedroom villa in the Bophut hills, 400 sqm with a wide infinity pool and elevated views over Big Buddha and the north-east coast.",
    propertyType: "villa",
    priceAmount: 33_900_000,
    priceUsd: 1_017_000,
    bedrooms: 4,
    bathrooms: 5,
    areaSqm: 400,
    province: "Surat Thani",
    city: "Bophut",
    district: "Koh Samui",
    lat: 9.5637,
    lng: 100.0621,
    amenities: ["Infinity pool", "Sea and island views", "Open-plan living", "Fitted kitchen", "Carport"],
    furnished: true,
  },
  {
    externalId: "3s-nathon-4bed-ph374",
    agencyName: "Three Seasons Properties",
    agencyUrl:
      "https://three-seasons-properties.com/villa-for-sale/ph374sublime-4-bed-pool-villa-with-breath-taking-sunset-views/",
    title: "Sublime 4-Bedroom Pool Villa with Sunset Views, Nathon Hills",
    description:
      "A peaceful four-bedroom villa above Nathon on the west coast, 556 sqm oriented for spectacular sunsets over the sea and the mainland mountains beyond.",
    propertyType: "villa",
    priceAmount: 26_900_000,
    priceUsd: 807_000,
    bedrooms: 4,
    bathrooms: 5,
    areaSqm: 556,
    province: "Surat Thani",
    city: "Nathon",
    district: "Koh Samui",
    lat: 9.5361,
    lng: 99.9381,
    amenities: [POOL, "West-facing sunset views", "Large sun terrace", "Tropical garden", "Quiet location"],
    furnished: true,
  },
  {
    externalId: "3s-bophut-5bed-ph365",
    agencyName: "Three Seasons Properties",
    agencyUrl:
      "https://three-seasons-properties.com/villa-for-sale/ph365luxury-modern-5-bed-sea-view-pool-villa/",
    title: "Luxury Modern 5-Bedroom Sea View Pool Villa, Bophut",
    description:
      "A contemporary five-bedroom villa in the Bophut hills, 550 sqm over two levels with a large infinity pool, entertainment terrace and panoramic north-coast views.",
    propertyType: "villa",
    priceAmount: 20_450_000,
    priceUsd: 613_500,
    bedrooms: 5,
    bathrooms: 6,
    areaSqm: 550,
    province: "Surat Thani",
    city: "Bophut",
    district: "Koh Samui",
    lat: 9.5651,
    lng: 100.0602,
    amenities: ["Infinity pool", "Entertainment terrace", "Panoramic sea views", "Two levels", "Off-street parking"],
    furnished: true,
  },
  {
    externalId: "3s-chaweng-3bed-ph359",
    agencyName: "Three Seasons Properties",
    agencyUrl:
      "https://three-seasons-properties.com/villa-for-sale/ph3593-bedroom-sea-view-villa-in-the-heart-of-chaweng/",
    title: "3-Bedroom Sea View Villa in the Heart of Chaweng",
    description:
      "A stylish three-bedroom villa on the Chaweng hillside, 260 sqm, walking distance to the island's main beach and dining, with a private pool and lagoon-blue sea views.",
    propertyType: "villa",
    priceAmount: 26_900_000,
    priceUsd: 807_000,
    bedrooms: 3,
    bathrooms: 4,
    areaSqm: 260,
    province: "Surat Thani",
    city: "Chaweng",
    district: "Koh Samui",
    lat: 9.5321,
    lng: 100.0611,
    amenities: [POOL, "Walk to Chaweng Beach", "Sea views", "Roof terrace", "Rental licence potential"],
    furnished: true,
  },

  // ---------------- Bangkok · Thailand-Property ----------------
  {
    externalId: "tp-la-citta-thonglor16",
    agencyName: "Thailand-Property (FazWaz Bangkok)",
    agencyUrl:
      "https://www.thailand-property.com/ads/2-bedroom-condo-for-sale-in-la-citta-delre-thonglor-16-khlong-tan-nuea-bangkok_dea759768e5f-8800-c402-f555-5840c089",
    title: "2-Bedroom Residence at La Citta Delre, Thonglor 16",
    description:
      "A large 147 sqm two-bedroom residence in the low-density La Citta Delre building on Thonglor Soi 16, an exclusive address in the heart of Bangkok's most fashionable district. Private lift lobby, imported kitchen and generous entertaining space.",
    propertyType: "condo",
    priceAmount: 36_700_000,
    priceUsd: usd(36_700_000),
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 147,
    province: "Bangkok",
    city: "Bangkok",
    district: "Watthana (Thong Lo)",
    addressText: "Thonglor Soi 16, Khlong Tan Nuea, Watthana, Bangkok",
    lat: 13.7386,
    lng: 100.5833,
    amenities: [
      "Private lift lobby",
      "Imported kitchen",
      "Low-density building",
      "Rooftop pool & sky lounge",
      "Walk to Thong Lo BTS",
    ],
    furnished: true,
    featured: true,
  },
  {
    externalId: "tp-the-xxxix-sansiri",
    agencyName: "Thailand-Property (108Siam)",
    agencyUrl:
      "https://www.thailand-property.com/ads/2-bedroom-condo-for-sale-in-the-xxxix-by-sansiri-khlong-tan-nuea-bangkok-near-bts-phrom-phong_07f27c12e739-28fe-5462-b459-95a8c089",
    title: "2-Bedroom Condo at The XXXIX by Sansiri, Phrom Phong",
    description:
      "A refined 83 sqm two-bedroom unit in The XXXIX by Sansiri, a boutique freehold building on Sukhumvit 39, a short walk from Phrom Phong BTS, EmQuartier and Benchasiri Park.",
    propertyType: "condo",
    priceAmount: 20_500_000,
    priceUsd: usd(20_500_000),
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 83,
    province: "Bangkok",
    city: "Bangkok",
    district: "Watthana (Phrom Phong)",
    addressText: "Sukhumvit 39, Khlong Tan Nuea, Watthana, Bangkok",
    lat: 13.7307,
    lng: 100.5698,
    amenities: [
      "Boutique freehold building",
      "Walk to Phrom Phong BTS",
      "Near EmQuartier",
      "Sky pool & fitness",
      "24-hour security & concierge",
    ],
    furnished: true,
  },
];
