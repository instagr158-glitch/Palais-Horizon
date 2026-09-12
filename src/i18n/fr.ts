import type { Dict } from "./en";

export const fr: Dict = {
  code: "fr",
  tagline: "Les plus belles demeures de Thaïlande, dans un carnet d'adresses privé.",
  short: "L'index réservé aux membres de l'immobilier de luxe en Thaïlande.",

  nav: {
    listings: "Résidences",
    pricing: "Abonnement",
    about: "À propos",
    account: "Mon compte",
    login: "Se connecter",
    join: "Devenir membre",
    signOut: "Se déconnecter",
    language: "Langue",
    memberBar: "ACCÈS MEMBRE ACTIF",
  },

  gate: {
    title: "Choisissez votre langue",
    subtitle: "Vous pourrez la changer à tout moment depuis le menu.",
  },

  landing: {
    heroKicker: "Club immobilier privé · Thaïlande",
    heroTitle:
      "Les plus belles villas, penthouses et propriétés de Thaïlande — au même endroit.",
    heroBody:
      "Palais Horizon rassemble les annonces de luxe des meilleures agences du pays. Les membres voient chaque prix, chaque détail, et sont mis en relation directe avec l'agence.",
    heroCta: "Voir l'abonnement",
    heroCtaSecondary: "Comment ça marche",
    statResidencesBig: "Sélection",
    statResidences: "pas d'aspiration — chaque annonce vérifiée",
    statRegions: "et bientôt tout le pays",
    statEntry: "entrée dans la collection",
    teaserTitle: "Un aperçu de la collection",
    teaserBody:
      "Les prix, les localisations et les galeries complètes sont réservés aux membres. Créez un compte pour débloquer le catalogue.",
    teaserCreate: "Créer un compte",
    lockedPrice: "Prix réservé aux membres",
    unlockBanner:
      "La collection complète — prix, localisations, galeries et mise en relation avec les agences — s'ouvre avec l'abonnement.",
    whyTitle: "Pourquoi devenir membre",
    why: [
      {
        title: "Chaque prix, en entier",
        body: "Prix affichés en THB et en USD, historique des prix et adresse réelle — jamais masqués pour les membres.",
      },
      {
        title: "En direct avec l'agence",
        body: "Un clic vous mène à l'annonce d'origine de l'agence. Pas d'intermédiaire, pas de frais gonflés.",
      },
      {
        title: "Uniquement le segment luxe",
        body: "Nous écartons tout ce qui se situe sous la ligne des biens d'exception : vous ne voyez que le haut du marché.",
      },
      {
        title: "Les nouveautés en premier",
        body: "La collection se met à jour en continu à Phuket, Samui, Bangkok, Hua Hin et Chiang Mai.",
      },
    ],
    howTitle: "Comment ça marche",
    how: [
      { step: "01", title: "Créez votre compte", body: "Une minute suffit. Aucune carte requise pour s'inscrire." },
      { step: "02", title: "Choisissez un abonnement", body: "Mensuel ou annuel. Résiliable à tout moment depuis votre compte." },
      { step: "03", title: "Débloquez tout", body: "Prix complets, galeries, localisations et mise en relation avec les agences." },
    ],
    faqTitle: "Questions",
    faq: [
      {
        q: "Vendez-vous les biens vous-mêmes ?",
        a: "Non. Palais Horizon est un index. Chaque annonce renvoie vers l'agence qui détient le mandat — vous traitez directement avec elle.",
      },
      {
        q: "D'où viennent les annonces ?",
        a: "Des grandes agences et portails de luxe thaïlandais. Nous harmonisons leurs annonces en une seule collection consultable et conservons le lien vers la source.",
      },
      {
        q: "Puis-je résilier ?",
        a: "À tout moment, en un clic depuis votre compte. Vous gardez l'accès jusqu'à la fin de la période payée.",
      },
    ],
  },

  paywall: {
    expiredTitle: "Votre abonnement a pris fin",
    expiredBody: "Réactivez-le pour rouvrir la collection complète.",
    expiredCta: "Réactiver l'abonnement",
  },

  pricing: {
    title: "Abonnement",
    body: "Un seul abonnement. Toute la collection de luxe, et une ligne directe vers chaque agence.",
    monthlyLabel: "Mensuel",
    annualLabel: "Annuel",
    annualNote: "2 mois offerts",
    bestValue: "Meilleure offre",
    perMonth: "/ mois",
    perYear: "/ an",
    billedMonthly: "Facturé mensuellement. Résiliable à tout moment.",
    billedAnnual: "Facturé annuellement. Résiliable à tout moment.",
    cta: "Continuer",
    redirecting: "Redirection…",
    features: [
      "Prix affichés complets (THB + USD)",
      "Localisations exactes et carte",
      "Galeries photo complètes",
      "Mise en relation directe avec l'agence",
      "Recherches et filtres illimités",
      "Nouvelles annonces de luxe dès leur arrivée",
    ],
    notConfigured:
      "Le paiement n'est pas encore configuré. Ajoutez vos clés Stripe pour activer le paiement.",
    ownerNote:
      "Note pour le propriétaire du site : ajoutez vos clés Stripe et vos identifiants de prix dans .env pour activer le vrai paiement. En attendant, utilisez le compte de démo member@palaishorizon.com pour prévisualiser l'accès membre.",
    disclaimer:
      "Palais Horizon est un index d'annonces de tiers. L'abonnement donne accès à la collection et à une mise en relation avec chaque agence — ce n'est pas une commission d'agence et aucune transaction immobilière n'est traitée ici.",
    lockedBanner:
      "Le catalogue des résidences est réservé aux membres. Choisissez une formule ci-dessous pour le débloquer.",
    canceledBanner: "Paiement annulé — aucun débit n'a été effectué.",
    signInFirst: "Veuillez d'abord vous connecter.",
    networkError: "Erreur réseau. Veuillez réessayer.",
    promoBadge: "-62%",
    promoOriginal: "€50",
    promoLabel: "Offre limitée",
    promoEndsIn: "Se termine dans",
  },

  auth: {
    signInTitle: "Se connecter",
    signInBody: "Accédez à votre abonnement Palais Horizon.",
    emailLabel: "E-mail",
    passwordLabel: "Mot de passe",
    signInCta: "Se connecter",
    signingIn: "Connexion…",
    noAccount: "Pas de compte ?",
    createOne: "En créer un",
    badCredentials: "E-mail ou mot de passe incorrect.",
    registerTitle: "Créez votre compte",
    registerBody:
      "L'inscription est gratuite. Choisissez ensuite un abonnement pour débloquer la collection.",
    nameLabel: "Nom",
    optional: "(facultatif)",
    passwordHint: "(8 caractères minimum)",
    createCta: "Créer le compte",
    creating: "Création…",
    haveAccount: "Déjà membre ?",
    genericError: "Impossible de créer le compte.",
    networkError: "Erreur réseau. Veuillez réessayer.",
  },

  listings: {
    title: "Résidences",
    countOne: "annonce de luxe en Thaïlande",
    countOther: "annonces de luxe en Thaïlande",
    searchPlaceholder: "Rechercher un secteur, un programme, un mot-clé…",
    allRegions: "Toutes les régions",
    allTypes: "Tous les types",
    allOfferTypes: "Achat ou location",
    samuiRegion: "Koh Samui (Surat Thani)",
    budgets: [
      "Tous budgets",
      "Jusqu'à ฿25M",
      "฿25M – ฿50M",
      "฿50M – ฿100M",
      "฿100M +",
    ],
    sorts: [
      "Plus récentes",
      "Prix — décroissant",
      "Prix — croissant",
      "Plus grandes",
    ],
    noResults: "Aucune résidence ne correspond encore à ces filtres.",
    clearFilters: "Réinitialiser les filtres",
    bed: "ch.",
    bath: "sdb",
    sqm: "m²",
    sqmLand: "m² terrain",
    forSale: "À vendre",
    forRent: "À louer",
    signature: "Signature",
    priceOnApplication: "Prix sur demande",
    perMonth: "/ mois",
  },

  detail: {
    back: "Retour aux résidences",
    description: "Description",
    features: "Caractéristiques",
    location: "Localisation",
    type: "Type",
    bedrooms: "Chambres",
    bathrooms: "Salles de bain",
    interiorArea: "Surface habitable",
    landArea: "Surface du terrain",
    region: "Région",
    furnished: "Meublé",
    yes: "Oui",
    listingAgency: "Agence mandataire",
    viewOnAgency: "Voir sur le site de l'agence",
    agencyDisclaimer:
      "Vous êtes mis en relation directe avec l'agence qui détient cette annonce. Palais Horizon n'est pas le vendeur.",
    moreIn: "Autres biens à",
  },

  account: {
    title: "Mon compte",
    name: "Nom",
    email: "E-mail",
    membership: "Abonnement",
    plan: "Formule",
    renewsEnds: "Renouvellement / fin",
    ended: "Terminé le",
    browse: "Parcourir les résidences",
    statuses: {
      none: "Aucun abonnement",
      active: "Actif",
      trialing: "Essai",
      past_due: "Paiement en retard",
      canceled: "Résilié",
    },
    manageBilling: "Gérer la facturation / résilier",
    opening: "Ouverture…",
    startMembership: "Souscrire un abonnement",
    reactivate: "Réactiver l'abonnement",
    viewMembership: "Voir l'abonnement",
    signOut: "Se déconnecter",
    portalError: "Impossible d'ouvrir le portail de facturation.",
  },

  success: {
    title: "Bienvenue chez Palais Horizon",
    body: "Votre abonnement est en cours d'activation. Cela peut prendre quelques secondes, le temps que le paiement se confirme.",
    cta: "Entrer dans la collection",
    hint: "Si le catalogue vous redemande une formule, actualisez dans un instant — la confirmation se termine.",
    claimTitle: "Votre abonnement est actif",
    claimBody: "Définissez un mot de passe pour pouvoir vous reconnecter à tout moment — aucun compte n'était nécessaire pour payer.",
    claimPasswordHint: "(8 caractères ou plus)",
    claimCta: "Définir le mot de passe et entrer",
    claimSubmitting: "Configuration de votre compte…",
    claimError: "Impossible de définir votre mot de passe. Veuillez réessayer.",
    claimNetworkError: "Erreur réseau. Veuillez réessayer.",
    existingTitle: "Votre abonnement est actif",
    existingBody: "Cet e-mail possède déjà un compte Palais Horizon — connectez-vous pour accéder à la collection.",
    existingCta: "Se connecter",
    genericTitle: "Paiement reçu",
    genericBody: "Connectez-vous (ou créez un compte avec le même e-mail) pour accéder à votre abonnement.",
  },

  about: {
    title: "À propos de Palais Horizon",
    p1: "Palais Horizon est un index indépendant de l'immobilier de luxe en Thaïlande. Nous rassemblons les annonces des meilleures agences et portails du pays, les harmonisons en une seule collection, et conservons le lien vers la source d'origine afin que les membres traitent directement avec l'agence mandataire.",
    p2: "Nous ne détenons aucun mandat et ne sommes partie à aucune vente ni location. L'abonnement paie la curation et l'accès — une vue unique et consultable du haut du marché, et une ligne directe vers chaque agence.",
    membersTitle: "Ce que les membres obtiennent",
    members: [
      "Les prix affichés complets en THB et en USD, avec la localisation exacte et la carte.",
      "Les galeries photo complètes et le détail des biens.",
      "Une mise en relation en un clic avec la page de l'agence.",
      "Recherche et filtres illimités sur toutes les régions couvertes.",
    ],
    sourcesTitle: "D'où viennent les annonces",
    sourcesBody:
      "Les sources incluent actuellement Conrad Properties, Thailand-Property, Three Seasons Properties et d'autres agences de luxe établies. La collection est rafraîchie par un pipeline qui écarte tout ce qui se situe sous la ligne des biens d'exception.",
    cta: "Voir l'abonnement",
  },

  notFound: {
    title: "Cette adresse n'est pas dans le carnet",
    body: "La page que vous cherchiez a été déplacée ou n'a jamais existé.",
    cta: "Retour à Palais Horizon",
  },

  footer: {
    explore: "Explorer",
    account: "Compte",
    legal: "Légal",
    residences: "Résidences",
    membership: "Abonnement",
    about: "À propos",
    signIn: "Se connecter",
    createAccount: "Créer un compte",
    myAccount: "Mon compte",
    howItWorks: "Comment fonctionne l'index",
    terms: "Conditions d'utilisation",
    privacy: "Politique de confidentialité",
    disclaimer:
      "Un index immobilier indépendant. Les annonces appartiennent à leurs agences respectives ; Palais Horizon renvoie vers la source d'origine et n'est pas le vendeur.",
  },

  languageNames: {
    en: "English",
    fr: "Français",
    de: "Deutsch",
  },
};
