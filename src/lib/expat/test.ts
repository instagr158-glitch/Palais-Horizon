// Test « Mon projet en Thaïlande est-il solide ? ». Contenu rédigé en français.
// Informations générales et indicatives, pas un conseil juridique, fiscal ou
// médical : les règles changent, à confirmer auprès d'un professionnel.

export type Area = "place" | "visa" | "money" | "ties";

export const AREA_LABELS: Record<Area, string> = {
  place: "Destination",
  visa: "Visa",
  money: "Argent",
  ties: "Attaches",
};

export type Option = { label: string; risk: 0 | 1 | 2 | 3 };

export type Question = {
  id: string;
  area: Area;
  text: string;
  /** Poids de la question dans le score : plus c'est élevé, plus l'erreur coûte cher. */
  weight: number;
  options: Option[];
};

export const QUESTIONS: Question[] = [
  {
    id: "city",
    area: "place",
    text: "Savez-vous dans quelle ville vous voulez vivre ?",
    weight: 2,
    options: [
      { label: "Pas encore", risk: 3 },
      { label: "Oui, mais je n'y suis jamais allé(e)", risk: 2 },
      { label: "Oui, j'y ai séjourné moins d'un mois", risk: 1 },
      { label: "Oui, j'y ai séjourné plus d'un mois", risk: 0 },
    ],
  },
  {
    id: "visa",
    area: "visa",
    text: "Quel visa comptez-vous utiliser ?",
    weight: 3,
    options: [
      { label: "Je ne sais pas encore", risk: 3 },
      { label: "L'exemption touristique, on verra ensuite", risk: 3 },
      { label: "J'ai identifié un visa mais rien n'est lancé", risk: 2 },
      { label: "Mon dossier de visa est en cours ou accepté", risk: 0 },
    ],
  },
  {
    id: "visaConditions",
    area: "visa",
    text: "Remplissez-vous les conditions de ce visa (fonds, âge, activité) ?",
    weight: 3,
    options: [
      { label: "Je ne les connais pas", risk: 3 },
      { label: "Non, il me manque des éléments", risk: 3 },
      { label: "En partie", risk: 2 },
      { label: "Oui, tout est prêt", risk: 0 },
    ],
  },
  {
    id: "income",
    area: "money",
    text: "Comment financerez-vous votre vie sur place ?",
    weight: 3,
    options: [
      { label: "Je n'ai pas encore de revenu prévu", risk: 3 },
      { label: "Avec mon épargne uniquement", risk: 2 },
      { label: "Un revenu à distance qui démarre à peine", risk: 2 },
      { label: "Un revenu ou une pension réguliers", risk: 0 },
    ],
  },
  {
    id: "health",
    area: "money",
    text: "Avez-vous une couverture santé valable en Thaïlande ?",
    weight: 3,
    options: [
      { label: "Non", risk: 3 },
      { label: "Je ne l'ai pas encore comparée", risk: 2 },
      { label: "J'ai des devis en cours", risk: 1 },
      { label: "Oui, elle est souscrite", risk: 0 },
    ],
  },
  {
    id: "tax",
    area: "money",
    text: "Savez-vous où vous serez résident fiscal et ce que cela change ?",
    weight: 2,
    options: [
      { label: "Non, je n'y ai pas pensé", risk: 3 },
      { label: "Vaguement", risk: 2 },
      { label: "Oui, mais sans l'avoir fait valider", risk: 1 },
      { label: "Oui, validé par un professionnel", risk: 0 },
    ],
  },
  {
    id: "ties",
    area: "ties",
    text: "Qu'avez-vous prévu pour vos attaches en France (logement, emploi, assurances, banque) ?",
    weight: 2,
    options: [
      { label: "Rien de décidé", risk: 3 },
      { label: "Une partie seulement", risk: 2 },
      { label: "Un plan clair, en cours d'exécution", risk: 0 },
    ],
  },
];

export type RiskContent = { title: string; why: string; fix: string[] };

export const RISKS: Record<string, RiskContent> = {
  city: {
    title: "Une ville choisie sans l'avoir testée",
    why: "Le coût de la vie, le climat, les services de santé et l'ambiance changent énormément entre Bangkok, Chiang Mai, Phuket ou Hua Hin.",
    fix: [
      "Comparez 2 ou 3 villes sur le coût, la santé, la communauté et l'accès à l'aéroport.",
      "Louez d'abord quelques semaines, sans signer de bail long.",
      "Évitez de payer une longue période d'avance avant d'avoir vu le logement.",
    ],
  },
  visa: {
    title: "Aucun visa adapté à une installation",
    why: "L'exemption touristique n'est pas faite pour s'installer : sa durée a déjà changé plusieurs fois, les contrôles à la frontière existent, et enchaîner les entrées peut être refusé.",
    fix: [
      "Listez les visas longue durée qui correspondent à votre situation (travail à distance, retraite, famille, formation).",
      "Vérifiez les conditions exactes sur le site de l'ambassade ou du consulat de Thaïlande.",
      "Démarrez le dossier avant votre départ si le visa se demande depuis la France.",
    ],
  },
  visaConditions: {
    title: "Les conditions du visa ne sont pas réunies",
    why: "Fonds bloqués, preuve de revenu, âge minimum, justificatif d'activité : un seul élément manquant peut faire refuser le dossier ou bloquer un renouvellement.",
    fix: [
      "Notez, pour votre visa, chaque condition et chaque document exigé.",
      "Vérifiez le montant de fonds à justifier et depuis combien de temps il doit être sur le compte.",
      "Demandez un avis à un professionnel de l'immigration si votre cas est atypique.",
    ],
  },
  income: {
    title: "Pas de revenu pour tenir dans la durée",
    why: "L'épargne s'épuise plus vite qu'on ne le croit, et travailler sur place sans autorisation est interdit.",
    fix: [
      "Définissez une source de revenu légale compatible avec votre visa (employeur étranger, clients hors de Thaïlande, pension).",
      "Visez au moins quelques mois de revenu régulier avant de partir.",
      "Chiffrez votre budget mensuel réel, puis ajoutez 20 % de marge.",
    ],
  },
  health: {
    title: "Aucune couverture santé adaptée",
    why: "Les hôpitaux privés sont d'excellente qualité mais coûteux, et votre carte vitale ne fonctionne pas sur place. Certains visas exigent une assurance.",
    fix: [
      "Comparez une assurance expatrié internationale et une assurance locale (plafonds, franchise, exclusions).",
      "Vérifiez le traitement des maladies préexistantes et l'évacuation médicale.",
      "Les Français peuvent aussi étudier la Caisse des Français de l'Étranger (CFE).",
    ],
  },
  tax: {
    title: "Votre situation fiscale n'est pas clarifiée",
    why: "Vous pouvez devenir résident fiscal thaïlandais à partir de 180 jours de présence par an, tout en restant lié à la France. Une mauvaise lecture peut coûter cher.",
    fix: [
      "Comptez vos jours de présence prévus en Thaïlande sur l'année.",
      "Listez vos revenus et leur origine (salaire, freelance, pension, loyers).",
      "Faites valider votre situation par un conseiller spécialisé France–Thaïlande.",
    ],
  },
  ties: {
    title: "Des attaches en France non réglées",
    why: "Logement, emploi, banque, assurances, courrier et impôts continuent de courir pendant que vous êtes loin.",
    fix: [
      "Décidez du sort de votre logement (conserver, louer, rendre) et prévenez le bailleur à temps.",
      "Gardez un compte et une carte bancaires utilisables à l'étranger.",
      "Désignez un contact de confiance en France pour le courrier et les urgences.",
    ],
  },
};

export type Scored = {
  score: number;
  label: "Faible" | "Modéré" | "Élevé" | "Très élevé";
  risks: { question: Question; risk: number; impact: number; content: RiskContent }[];
};

export function scoreAnswers(answers: Record<string, number>): Scored {
  const totalWeight = QUESTIONS.reduce((s, q) => s + q.weight, 0);
  let sum = 0;
  const risks: Scored["risks"] = [];
  for (const q of QUESTIONS) {
    const chosen = answers[q.id];
    const risk = chosen == null ? 0 : q.options[chosen].risk;
    const impact = (risk / 3) * q.weight;
    sum += impact;
    if (risk > 0) risks.push({ question: q, risk, impact, content: RISKS[q.id] });
  }
  risks.sort((a, b) => b.impact - a.impact || b.question.weight - a.question.weight);
  const score = Math.round((sum / totalWeight) * 100);
  const label = score < 25 ? "Faible" : score < 50 ? "Modéré" : score < 70 ? "Élevé" : "Très élevé";
  return { score, label, risks };
}
