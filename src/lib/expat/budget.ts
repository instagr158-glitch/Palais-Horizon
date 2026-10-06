// Fourchettes mensuelles indicatives, en THB, pour une personne seule au
// niveau "confort" (condo une chambre, repas locaux et occidentaux mélangés,
// scooter ou transports, assurance santé internationale d'entrée de gamme).
// À ajuster selon votre mode de vie : ce sont des ordres de grandeur.

export const THB_PER_EUR = 37.5;

export type CityId = "bangkok" | "chiangmai" | "phuket" | "pattaya" | "huahin" | "samui";
export type Tier = "eco" | "comfort" | "premium";

export const CATEGORIES = [
  { id: "housing", label: "Logement (loyer + charges)" },
  { id: "food", label: "Alimentation" },
  { id: "transport", label: "Transport" },
  { id: "health", label: "Santé et assurance" },
  { id: "leisure", label: "Loisirs et sorties" },
  { id: "misc", label: "Internet, téléphone, visa, divers" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const CITIES: { id: CityId; label: string; note: string; base: Record<CategoryId, number> }[] = [
  {
    id: "bangkok",
    label: "Bangkok",
    note: "Le plus d'offre : santé, aéroport, emplois, vie culturelle. Loyers élevés dans les quartiers centraux.",
    base: { housing: 22000, food: 14000, transport: 3500, health: 5000, leisure: 8000, misc: 4000 },
  },
  {
    id: "chiangmai",
    label: "Chiang Mai",
    note: "Communauté de télétravailleurs, coût de la vie plus bas, climat plus frais en hiver.",
    base: { housing: 14000, food: 11000, transport: 3000, health: 4500, leisure: 6000, misc: 3500 },
  },
  {
    id: "phuket",
    label: "Phuket",
    note: "Île très touristique : plages et services, mais loyers et transports plus chers.",
    base: { housing: 28000, food: 14000, transport: 6000, health: 5000, leisure: 9000, misc: 4000 },
  },
  {
    id: "pattaya",
    label: "Pattaya",
    note: "Beaucoup de condos abordables, proche de Bangkok, ambiance très touristique.",
    base: { housing: 18000, food: 12000, transport: 3500, health: 4500, leisure: 8000, misc: 3500 },
  },
  {
    id: "huahin",
    label: "Hua Hin",
    note: "Station balnéaire plus calme, appréciée des retraités, à environ 3 h de Bangkok.",
    base: { housing: 20000, food: 12000, transport: 4500, health: 4500, leisure: 7500, misc: 3500 },
  },
  {
    id: "samui",
    label: "Koh Samui",
    note: "Île plus isolée : tout est plus cher, la santé de qualité est plus éloignée.",
    base: { housing: 26000, food: 14000, transport: 6000, health: 5000, leisure: 9000, misc: 4000 },
  },
];

export const TIERS: { id: Tier; label: string; housing: number; other: number }[] = [
  { id: "eco", label: "Économe", housing: 0.65, other: 0.75 },
  { id: "comfort", label: "Confort", housing: 1, other: 1 },
  { id: "premium", label: "Aisé", housing: 1.9, other: 1.6 },
];

export function computeBudget(city: CityId, tier: Tier, people: 1 | 2) {
  const c = CITIES.find((x) => x.id === city)!;
  const t = TIERS.find((x) => x.id === tier)!;
  const lines = CATEGORIES.map((cat) => {
    let v = c.base[cat.id] * (cat.id === "housing" ? t.housing : t.other);
    if (people === 2) v *= cat.id === "housing" ? 1.1 : 1.8;
    return { id: cat.id, label: cat.label, thb: Math.round(v / 100) * 100 };
  });
  const totalThb = lines.reduce((s, l) => s + l.thb, 0);
  return { lines, totalThb, totalEur: Math.round(totalThb / THB_PER_EUR) };
}
