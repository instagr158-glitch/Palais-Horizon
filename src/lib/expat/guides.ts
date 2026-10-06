// Contenu éditorial de l'espace expatriation Thaïlande (en français).
// Informations générales, pas un conseil juridique, fiscal ou médical : les
// règles changent, confirmez auprès d'un professionnel avant toute décision.

export type GuideSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  warning?: string;
};

export type Guide = {
  title: string;
  intro: string;
  sections: GuideSection[];
  checklistKey: string;
  checklist: string[];
};

export const TAX_GUIDE: Guide = {
  title: "Fiscalité : France et Thaïlande",
  intro:
    "Partir vivre en Thaïlande change votre situation fiscale des deux côtés. Voici les points à comprendre avant de partir, pour ne pas payer deux fois ni oublier une déclaration.",
  sections: [
    {
      title: "1. Devenez-vous résident fiscal thaïlandais ?",
      paragraphs: [
        "Vous êtes considéré comme résident fiscal en Thaïlande si vous y passez 180 jours ou plus dans une même année civile (du 1er janvier au 31 décembre).",
      ],
      bullets: [
        "Moins de 180 jours : en principe, seuls vos revenus de source thaïlandaise sont concernés.",
        "180 jours ou plus : vous devez déclarer vos revenus selon les règles de résident.",
      ],
    },
    {
      title: "2. Vos revenus étrangers rapportés en Thaïlande",
      paragraphs: [
        "Depuis 2024, les revenus de source étrangère que vous faites entrer en Thaïlande peuvent être imposés, quelle que soit l'année où ils ont été gagnés. Il ne suffit plus d'attendre l'année suivante pour les rapatrier.",
        "L'impôt thaïlandais est progressif, de 0 % jusqu'à 35 % pour les tranches les plus élevées, avec des abattements et déductions.",
      ],
      warning:
        "Gardez une trace de ce que vous virez depuis l'étranger (relevés, origine des fonds). Une comptabilité claire vous protège en cas de contrôle.",
    },
    {
      title: "3. Éviter la double imposition",
      paragraphs: [
        "Il existe une convention fiscale entre la France et la Thaïlande. Elle sert à répartir le droit d'imposer chaque type de revenu (salaire, pension, loyers, dividendes) et prévoit un crédit d'impôt pour ne pas payer deux fois.",
        "Les règles diffèrent selon la nature du revenu : une pension, un salaire de télétravail et des loyers français ne sont pas traités de la même façon.",
      ],
    },
    {
      title: "4. Côté France : quitter votre résidence fiscale",
      bullets: [
        "La France regarde votre foyer, votre lieu de séjour principal, votre activité principale et le centre de vos intérêts économiques.",
        "Prévenez votre centre des impôts de votre départ et déclarez votre changement de situation.",
        "Vos revenus de source française (loyers, pensions françaises, plus-values immobilières) restent en général imposables en France ou font l'objet de règles particulières.",
        "Vérifiez l'impact sur votre couverture santé (Sécurité sociale, CSG/CRDS) et sur vos comptes bancaires et assurances en France.",
      ],
    },
    {
      title: "5. En pratique en Thaïlande",
      bullets: [
        "Demandez un numéro fiscal (TIN) auprès de l'administration fiscale thaïlandaise dès que vous devenez résident.",
        "La déclaration annuelle est en général à déposer avant fin mars pour l'année précédente.",
        "Un comptable ou conseiller fiscal local francophone vous évite des erreurs coûteuses : le gain dépasse souvent largement son tarif.",
      ],
    },
  ],
  checklistKey: "ph-th-fiscal",
  checklist: [
    "Compter mes jours de présence prévus en Thaïlande sur l'année",
    "Lister mes revenus (salaire, freelance, pension, loyers, dividendes) et leur pays d'origine",
    "Lire la convention fiscale France–Thaïlande pour chaque type de revenu",
    "Prévenir mon centre des impôts français de mon départ",
    "Demander mon numéro fiscal (TIN) thaïlandais",
    "Garder les relevés de tous mes virements vers la Thaïlande",
    "Prendre rendez-vous avec un conseiller fiscal spécialiste France–Thaïlande",
  ],
};

export const BANK_HEALTH_GUIDE: Guide = {
  title: "Banque, budget et santé",
  intro:
    "Un compte bancaire local, un moyen simple de transférer de l'argent et une bonne couverture santé sont les trois bases d'une installation sereine.",
  sections: [
    {
      title: "Ouvrir un compte bancaire thaïlandais",
      paragraphs: [
        "Les grandes banques (Bangkok Bank, Kasikorn, SCB, Krungthai…) ouvrent des comptes aux étrangers, mais les conditions varient d'une agence à l'autre.",
      ],
      bullets: [
        "Généralement demandé : passeport, visa valide, justificatif d'adresse en Thaïlande (bail, lettre de l'hôtel ou du propriétaire), numéro de téléphone thaïlandais.",
        "Certaines agences demandent un certificat de résidence délivré par l'immigration.",
        "Si une agence refuse, essayez-en une autre ou une autre banque : c'est fréquent et sans gravité.",
        "Pour le visa retraite, le compte sert aussi à justifier les fonds exigés.",
      ],
    },
    {
      title: "Transférer de l'argent depuis la France",
      bullets: [
        "Comparez les services de transfert en ligne (Wise, Revolut, virement international classique) : les frais et le taux de change varient fortement.",
        "Évitez les bureaux de change d'aéroport et les retraits répétés avec une carte qui facture des frais fixes.",
        "Gardez la preuve de chaque transfert : utile pour la fiscalité et pour justifier vos fonds à l'immigration.",
      ],
    },
    {
      title: "Construire votre budget",
      paragraphs: [
        "Utilisez l'outil Budget de cet espace pour estimer vos dépenses mensuelles par ville. Ajoutez une réserve : prévoyez environ 6 mois de dépenses plus deux à trois mois de loyer pour la caution et l'installation.",
      ],
    },
    {
      title: "Votre couverture santé",
      paragraphs: [
        "Les hôpitaux privés thaïlandais sont de très bonne qualité mais coûteux sans assurance. Votre carte vitale ne fonctionne pas sur place.",
      ],
      bullets: [
        "Assurance santé internationale pour expatriés : couverture large, y compris à l'étranger, plus chère.",
        "Assurance locale thaïlandaise : moins chère, mais souvent limitée en âge, en pathologies et en plafonds.",
        "Certaines formules de visa (comme le O-A) imposent une assurance santé.",
        "Les Français peuvent étudier l'adhésion à la Caisse des Français de l'Étranger (CFE).",
        "Comparez toujours : plafonds annuels, franchise, exclusions de maladies préexistantes, évacuation médicale.",
      ],
      warning:
        "Ces exemples ne sont pas des recommandations commerciales. Demandez plusieurs devis et lisez les exclusions avant de signer.",
    },
  ],
  checklistKey: "ph-th-bank-health",
  checklist: [
    "Choisir une banque et préparer les documents d'ouverture de compte",
    "Obtenir un justificatif d'adresse en Thaïlande",
    "Mettre en place un service de transfert à bas frais",
    "Estimer mon budget mensuel avec l'outil Budget",
    "Demander au moins 3 devis d'assurance santé",
    "Vérifier les exclusions (maladies préexistantes, sports, évacuation)",
    "Repérer l'hôpital privé le plus proche de ma future ville",
  ],
};

export const INCOME_GUIDE: Guide = {
  title: "Générer un revenu depuis la Thaïlande",
  intro:
    "Vivre en Thaïlande coûte moins cher qu'en France, mais un revenu régulier rend l'installation durable. Voici les pistes les plus réalistes et leurs limites légales.",
  sections: [
    {
      title: "Pistes à explorer",
      bullets: [
        "Télétravail pour un employeur étranger : le visa DTV est pensé pour ce cas.",
        "Freelance en ligne (rédaction, design, développement, traduction, assistance virtuelle) pour des clients hors de Thaïlande.",
        "Création de contenu et audience (vidéo, réseaux sociaux) monétisée à l'étranger.",
        "Vente de produits ou formations numériques.",
        "Enseignement de sa langue ou de ses compétences : nécessite un permis de travail si c'est sur place.",
      ],
    },
    {
      title: "Ce qu'il faut savoir sur la légalité",
      bullets: [
        "Travailler pour un employeur ou des clients thaïlandais exige un permis de travail.",
        "Le télétravail pour des clients hors de Thaïlande est toléré avec le visa adapté, mais reste une zone sensible : renseignez-vous sur votre cas précis.",
        "La location meublée de courte durée (moins de 30 jours) est en principe interdite en copropriété sans licence hôtelière.",
      ],
      warning: "Ne travaillez jamais sans autorisation sur place : le risque est l'expulsion et l'interdiction de revenir.",
    },
    {
      title: "Plan en 4 étapes pour un premier revenu en ligne",
      bullets: [
        "Semaines 1–2 : choisissez une compétence que vous maîtrisez déjà et listez 3 types de clients possibles.",
        "Semaines 3–4 : préparez une offre claire (prix, délai, exemple concret) et une page de présentation.",
        "Mois 2 : contactez 10 prospects par semaine et proposez un petit projet à prix d'entrée.",
        "Mois 3 : transformez vos premiers clients en références et relevez vos tarifs.",
      ],
    },
  ],
  checklistKey: "ph-th-income",
  checklist: [
    "Choisir la compétence que je veux monétiser",
    "Définir 3 types de clients cibles hors de Thaïlande",
    "Écrire mon offre (prix, délai, résultat)",
    "Préparer 3 exemples de travaux ou références",
    "Contacter mes 10 premiers prospects",
    "Vérifier que mon visa permet cette activité",
  ],
};

export const SETUP_CHECKLIST: { key: string; title: string; items: string[] }[] = [
  {
    key: "ph-th-setup-visa",
    title: "Visa et démarches",
    items: [
      "Identifier le visa adapté avec l'outil Visa",
      "Rassembler les justificatifs de fonds",
      "Vérifier la validité de mon passeport (6 mois minimum)",
      "Prévoir l'enregistrement d'adresse (TM30) et les déclarations de résidence",
    ],
  },
  {
    key: "ph-th-setup-money",
    title: "Argent et santé",
    items: [
      "Calculer mon budget mensuel",
      "Ouvrir un compte et mettre en place un transfert à bas frais",
      "Souscrire une assurance santé",
      "Préparer la partie fiscale (France et Thaïlande)",
    ],
  },
  {
    key: "ph-th-setup-life",
    title: "Vie sur place",
    items: [
      "Choisir la ville avec l'outil Budget",
      "Louer d'abord quelques semaines avant de s'engager",
      "Définir ma source de revenu",
      "Si achat : consulter la recherche de biens adaptée à mon budget",
    ],
  },
];

export const WORKSHOP_TOPICS = [
  { title: "Visas : choisir le bon et préparer son dossier", description: "Les visas longue durée expliqués, les pièges des renouvellements et un échange de questions." },
  { title: "Fiscalité France–Thaïlande", description: "Résidence fiscale, double imposition, déclarations : les bases pour partir sans erreur." },
  { title: "Gagner un revenu depuis la Thaïlande", description: "Pistes concrètes de revenu à distance et plan d'action sur 90 jours." },
  { title: "Banque, budget et santé", description: "Ouvrir un compte, transférer de l'argent, choisir une assurance et construire son budget." },
];

// Ajoutez ici les prochaines sessions en direct (date au format AAAA-MM-JJ HH:MM,
// heure de Paris). Elles s'affichent automatiquement dans l'espace membre.
export const UPCOMING_WORKSHOPS: {
  title: string;
  startsAt: string;
  joinUrl: string;
}[] = [];

// Renseignez ici l'un des deux canaux (ou les deux) pour activer l'échange avec
// l'agent : numéro WhatsApp au format international sans "+" (ex. 33612345678)
// et/ou lien de votre profil Instagram.
export const EXPERT_CONTACT = {
  whatsapp: "",
  instagram: "",
};
