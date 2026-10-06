// Montants et conditions indicatifs : les règles d'immigration thaïlandaises
// changent souvent. Toujours confirmer auprès de l'ambassade/consulat ou du
// service d'immigration avant toute démarche.

export type Objective =
  | "remote"
  | "retire"
  | "study"
  | "family"
  | "invest"
  | "discover"
  | "employee";

export type Duration = "short" | "months" | "year" | "long";
export type Funds = "lt500" | "500to800" | "800to2000" | "gt2000";

export type Answers = {
  objective: Objective;
  age50: boolean;
  duration: Duration;
  funds: Funds;
};

export const OBJECTIVES: { value: Objective; label: string }[] = [
  { value: "remote", label: "Travailler à distance / freelance" },
  { value: "retire", label: "Prendre ma retraite" },
  { value: "study", label: "Étudier ou pratiquer une activité (langue, muay thaï, cuisine…)" },
  { value: "family", label: "Rejoindre mon conjoint ou ma famille" },
  { value: "invest", label: "Investir / revenus très élevés" },
  { value: "employee", label: "Travailler pour une entreprise thaïlandaise" },
  { value: "discover", label: "Découvrir le pays, quelques semaines" },
];

export const DURATIONS: { value: Duration; label: string }[] = [
  { value: "short", label: "Moins de 2 mois" },
  { value: "months", label: "2 à 6 mois" },
  { value: "year", label: "Environ 1 an, renouvelable" },
  { value: "long", label: "Long terme (5 ans ou plus)" },
];

export const FUNDS: { value: Funds; label: string }[] = [
  { value: "lt500", label: "Moins de 500 000 THB (≈ 13 000 €)" },
  { value: "500to800", label: "500 000 à 800 000 THB (≈ 13 000 – 21 000 €)" },
  { value: "800to2000", label: "800 000 à 2 000 000 THB (≈ 21 000 – 53 000 €)" },
  { value: "gt2000", label: "Plus de 2 000 000 THB (≈ 53 000 €)" },
];

const FUNDS_RANK: Record<Funds, number> = { lt500: 0, "500to800": 1, "800to2000": 2, gt2000: 3 };
const DURATION_RANK: Record<Duration, number> = { short: 0, months: 1, year: 2, long: 3 };

export type Visa = {
  id: string;
  name: string;
  summary: string;
  duration: string;
  cost: string;
  funds: string;
  documents: string[];
  watch: string;
  /** Visitor goals this visa is relevant for; other goals never see it. */
  forObjectives: Objective[];
  /** Returns what is missing to qualify (empty = fits). */
  gaps: (a: Answers) => string[];
};

const enoughFunds = (a: Answers, min: Funds) => FUNDS_RANK[a.funds] >= FUNDS_RANK[min];

export const VISAS: Visa[] = [
  {
    id: "exemption",
    forObjectives: ["discover", "remote"],
    name: "Exemption de visa (séjour touristique)",
    summary:
      "Pour un premier séjour sans démarche préalable : les ressortissants français et allemands entrent sans visa.",
    duration: "60 jours, prolongeable de 30 jours à l'immigration",
    cost: "Gratuit (prolongation ≈ 1 900 THB)",
    funds: "Aucun justificatif exigé en règle générale (billet de sortie demandé)",
    documents: ["Passeport valide 6 mois", "Billet retour ou de sortie", "Adresse du premier hébergement"],
    watch:
      "La durée d'exemption a déjà changé plusieurs fois et une réduction est régulièrement évoquée : vérifiez la durée en vigueur avant de réserver. Ne convient pas pour s'installer.",
    gaps: (a) => {
      const g: string[] = [];
      if (DURATION_RANK[a.duration] > 0) g.push("Votre durée dépasse ce que couvre l'exemption.");
      return g;
    },
  },
  {
    id: "dtv",
    forObjectives: ["remote", "study", "family"],
    name: "DTV – Destination Thailand Visa",
    summary:
      "Le visa pensé pour les travailleurs à distance, freelances et personnes qui suivent une activité en Thaïlande (cours, sport, etc.) ou rejoignent un proche.",
    duration: "Jusqu'à 5 ans, séjours de 180 jours par entrée, prolongeables de 180 jours",
    cost: "≈ 10 000 THB",
    funds: "≥ 500 000 THB sur un compte (relevés récents)",
    documents: [
      "Passeport valide",
      "Preuve de fonds (≥ 500 000 THB)",
      "Preuve d'activité : contrat de travail à distance, clients freelances ou inscription à l'activité",
      "Photo d'identité et justificatif d'hébergement",
    ],
    watch:
      "Il n'autorise pas à travailler pour un employeur ou des clients thaïlandais. Les critères d'acceptation varient selon l'ambassade.",
    gaps: (a) => {
      const g: string[] = [];
      if (!enoughFunds(a, "500to800")) g.push("Il faut justifier d'au moins 500 000 THB.");
      return g;
    },
  },
  {
    id: "retraite",
    forObjectives: ["retire"],
    name: "Visa retraite (Non-O / O-A, 50 ans et plus)",
    summary: "Pour s'installer durablement à partir de 50 ans, renouvelable chaque année.",
    duration: "1 an, renouvelable",
    cost: "≈ 2 000 THB le visa + ≈ 1 900 THB par prolongation",
    funds: "800 000 THB sur un compte thaïlandais, ou 65 000 THB de revenu mensuel, ou combinaison des deux",
    documents: [
      "Passeport valide",
      "Preuve de fonds ou de revenu (lettre de l'ambassade pour les pensions)",
      "Casier judiciaire et certificat médical (pour le O-A)",
      "Assurance santé exigée pour le O-A",
    ],
    watch:
      "La somme doit rester bloquée selon les règles du renouvellement. Le O-A se demande avant le départ, le Non-O peut se prolonger sur place.",
    gaps: (a) => {
      const g: string[] = [];
      if (!a.age50) g.push("Réservé aux 50 ans et plus.");
      if (!enoughFunds(a, "800to2000")) g.push("Il faut ≈ 800 000 THB (ou 65 000 THB de revenu mensuel).");
      if (DURATION_RANK[a.duration] < 2) g.push("Conçu pour un séjour d'au moins un an.");
      return g;
    },
  },
  {
    id: "mariage",
    forObjectives: ["family"],
    name: "Visa famille / mariage avec un(e) Thaïlandais(e)",
    summary: "Pour vivre avec un conjoint thaïlandais, prolongé chaque année.",
    duration: "1 an, renouvelable",
    cost: "≈ 2 000 THB le visa + ≈ 1 900 THB par prolongation",
    funds: "400 000 THB sur un compte thaïlandais ou 40 000 THB de revenu mensuel",
    documents: [
      "Acte de mariage enregistré en Thaïlande",
      "Pièces d'identité du conjoint",
      "Preuve de fonds ou de revenu",
      "Photos du couple et justificatif de domicile",
    ],
    watch: "Le mariage doit être légalement enregistré. Les contrôles de réalité du couple sont fréquents.",
    gaps: () => [],
  },
  {
    id: "etudiant",
    forObjectives: ["study"],
    name: "Visa étudiant / formation (ED)",
    summary: "Pour suivre des cours de thaï, d'arts martiaux ou une formation dans un établissement agréé.",
    duration: "90 jours à 1 an, renouvelable selon l'école",
    cost: "≈ 2 000 THB + frais de l'école",
    funds: "Frais de scolarité ; pas de montant fixe de fonds en général",
    documents: ["Lettre d'admission de l'école", "Passeport valide", "Justificatif de paiement des cours"],
    watch: "Une assiduité régulière est exigée. Ce visa ne permet pas de travailler.",
    gaps: () => [],
  },
  {
    id: "elite",
    forObjectives: ["invest", "retire", "remote"],
    name: "Thailand Elite (Privilege)",
    summary: "Un statut payant sans démarche d'immigration lourde, avec des services de conciergerie.",
    duration: "5 à 20 ans selon la formule",
    cost: "À partir d'environ 650 000 THB selon la formule",
    funds: "Frais d'adhésion (pas un compte bloqué)",
    documents: ["Passeport valide", "Casier judiciaire", "Frais d'adhésion"],
    watch: "Ne donne pas le droit de travailler. Comparez les formules et les conditions de remboursement.",
    gaps: (a) => {
      const g: string[] = [];
      if (!enoughFunds(a, "500to800")) g.push("Les frais d'adhésion commencent autour de 650 000 THB.");
      if (DURATION_RANK[a.duration] < 2) g.push("Pertinent surtout pour un projet long.");
      return g;
    },
  },
  {
    id: "ltr",
    forObjectives: ["invest", "retire", "remote"],
    name: "LTR – Long-Term Resident (10 ans)",
    summary: "Un visa de 10 ans pour les profils à hauts revenus : retraités aisés, télétravailleurs bien payés, investisseurs.",
    duration: "10 ans",
    cost: "≈ 50 000 THB",
    funds: "Revenu personnel d'environ 80 000 USD par an (conditions allégées pour certains profils)",
    documents: ["Preuves de revenu sur 2 ans", "Contrat ou preuve d'activité", "Assurance santé", "Casier judiciaire"],
    watch: "Les critères détaillés dépendent de la catégorie (retraité, télétravailleur, investisseur). Demandez un avis professionnel.",
    gaps: (a) => {
      const g: string[] = [];
      if (!enoughFunds(a, "gt2000")) g.push("Suppose un niveau de revenu ou de patrimoine élevé.");
      if (DURATION_RANK[a.duration] < 3) g.push("Pertinent surtout pour un projet long terme.");
      return g;
    },
  },
  {
    id: "salarie",
    forObjectives: ["employee"],
    name: "Visa Non-B + permis de travail",
    summary: "Pour travailler légalement pour une entreprise thaïlandaise, qui parraine votre dossier.",
    duration: "1 an, renouvelable avec le permis de travail",
    cost: "Variable ; démarches prises en charge en grande partie par l'employeur",
    funds: "Aucun montant fixe pour vous ; l'entreprise a ses propres conditions de capital",
    documents: ["Offre de travail", "Diplômes", "Dossier de l'employeur"],
    watch: "Pas de statut sans employeur. Le permis de travail est indispensable pour toute activité rémunérée sur place.",
    gaps: () => [],
  },
];

export function evaluate(a: Answers) {
  const results = VISAS.filter((v) => v.forObjectives.includes(a.objective)).map((v) => ({
    visa: v,
    gaps: v.gaps(a),
  }));
  return {
    fits: results.filter((r) => r.gaps.length === 0),
    notYet: results.filter((r) => r.gaps.length > 0),
  };
}
