import type { Dict } from "./en";

export const de: Dict = {
  code: "de",
  tagline: "Thailands schönste Wohnsitze in einem privaten Adressbuch.",
  short: "Das exklusive Verzeichnis für Luxusimmobilien in ganz Thailand.",

  nav: {
    listings: "Residenzen",
    pricing: "Mitgliedschaft",
    about: "Über uns",
    account: "Mein Konto",
    login: "Anmelden",
    join: "Mitglied werden",
    signOut: "Abmelden",
    language: "Sprache",
    memberBar: "MITGLIEDS­ZUGANG AKTIV",
  },

  gate: {
    title: "Wählen Sie Ihre Sprache",
    subtitle: "Sie können sie jederzeit über das Menü ändern.",
  },

  landing: {
    heroKicker: "Privater Immobilienclub · Thailand",
    heroTitle:
      "Die schönsten Villen, Penthäuser und Anwesen Thailands — an einem Ort.",
    heroBody:
      "Palais Horizon bündelt Luxusangebote der führenden Maklerhäuser des Landes. Mitglieder sehen jeden Preis, jedes Detail und werden direkt an das Maklerbüro vermittelt.",
    heroCta: "Mitgliedschaft ansehen",
    heroCtaSecondary: "So funktioniert es",
    statResidences: "kuratierte Residenzen",
    statRegions: "abgedeckte Regionen",
    statEntry: "Einstieg in die Kollektion",
    teaserTitle: "Ein Blick in die Kollektion",
    teaserBody:
      "Preise, Lagen und vollständige Galerien sind Mitgliedern vorbehalten. Erstellen Sie ein Konto, um den Katalog freizuschalten.",
    teaserCreate: "Konto erstellen",
    lockedPrice: "Preis nur für Mitglieder",
    unlockBanner:
      "Die vollständige Kollektion — Preise, Lagen, Galerien und Maklervermittlung — öffnet sich mit der Mitgliedschaft.",
    whyTitle: "Warum Mitglieder beitreten",
    why: [
      {
        title: "Jeder Preis, vollständig",
        body: "Angebotspreise in THB und USD, Preisverlauf und die echte Adresse — Mitgliedern nie vorenthalten.",
      },
      {
        title: "Direkt zum Makler",
        body: "Ein Klick führt Sie zum Originalinserat des Maklers. Keine Zwischenhändler, keine überhöhten Gebühren.",
      },
      {
        title: "Nur das Luxussegment",
        body: "Wir filtern alles unterhalb der Grenze für Spitzenimmobilien heraus — Sie sehen nur die Spitze des Marktes.",
      },
      {
        title: "Neue Angebote zuerst",
        body: "Die Kollektion aktualisiert sich laufend in Phuket, Samui, Bangkok, Hua Hin und Chiang Mai.",
      },
    ],
    howTitle: "So funktioniert es",
    how: [
      { step: "01", title: "Konto erstellen", body: "Dauert eine Minute. Keine Karte für die Registrierung nötig." },
      { step: "02", title: "Mitgliedschaft wählen", body: "Monatlich oder jährlich. Jederzeit im Konto kündbar." },
      { step: "03", title: "Alles freischalten", body: "Vollständige Preise, Galerien, Lagen und Maklervermittlung." },
    ],
    faqTitle: "Fragen",
    faq: [
      {
        q: "Verkaufen Sie die Immobilien selbst?",
        a: "Nein. Palais Horizon ist ein Verzeichnis. Jedes Inserat verlinkt auf das Maklerbüro mit dem Mandat — Sie verhandeln direkt mit ihm.",
      },
      {
        q: "Woher stammen die Angebote?",
        a: "Von führenden thailändischen Luxusmaklern und -portalen. Wir vereinheitlichen ihre Inserate zu einer durchsuchbaren Kollektion und behalten den Link zur Quelle.",
      },
      {
        q: "Kann ich kündigen?",
        a: "Jederzeit, mit einem Klick im Konto. Der Zugang bleibt bis zum Ende des bezahlten Zeitraums bestehen.",
      },
    ],
  },

  paywall: {
    expiredTitle: "Ihre Mitgliedschaft ist abgelaufen",
    expiredBody: "Reaktivieren Sie sie, um die vollständige Kollektion wieder zu öffnen.",
    expiredCta: "Mitgliedschaft reaktivieren",
  },

  pricing: {
    title: "Mitgliedschaft",
    body: "Eine Mitgliedschaft. Die gesamte Luxuskollektion und ein direkter Draht zu jedem Makler.",
    monthlyLabel: "Monatlich",
    annualLabel: "Jährlich",
    annualNote: "2 Monate gratis",
    bestValue: "Bester Wert",
    perMonth: "/ Monat",
    perYear: "/ Jahr",
    billedMonthly: "Monatliche Abrechnung. Jederzeit kündbar.",
    billedAnnual: "Jährliche Abrechnung. Jederzeit kündbar.",
    cta: "Weiter",
    redirecting: "Weiterleitung…",
    features: [
      "Vollständige Angebotspreise (THB + USD)",
      "Exakte Lagen und Karte",
      "Vollständige Fotogalerien",
      "Direkte Vermittlung an das Maklerbüro",
      "Unbegrenzte Suchen und Filter",
      "Neue Luxusangebote, sobald sie erscheinen",
    ],
    notConfigured:
      "Die Zahlung ist noch nicht eingerichtet. Fügen Sie Ihre Stripe-Schlüssel hinzu, um die Kasse zu aktivieren.",
    ownerNote:
      "Hinweis für den Seitenbetreiber: Tragen Sie Ihre Stripe-Schlüssel und Preis-IDs in .env ein, um die echte Kasse zu aktivieren. Bis dahin nutzen Sie das Demokonto member@palaishorizon.com für eine Vorschau des Mitgliederzugangs.",
    disclaimer:
      "Palais Horizon ist ein Verzeichnis von Drittanbieter-Inseraten. Die Mitgliedschaft verschafft Zugang zur Kollektion und eine direkte Vermittlung an jedes Maklerbüro — es ist keine Maklerprovision und hier wird kein Immobiliengeschäft abgewickelt.",
    lockedBanner:
      "Der Residenzen-Katalog ist Mitgliedern vorbehalten. Wählen Sie unten einen Tarif, um ihn freizuschalten.",
    canceledBanner: "Bezahlvorgang abgebrochen — es wurde nichts berechnet.",
    signInFirst: "Bitte melden Sie sich zuerst an.",
    networkError: "Netzwerkfehler. Bitte versuchen Sie es erneut.",
  },

  auth: {
    signInTitle: "Anmelden",
    signInBody: "Rufen Sie Ihre Palais-Horizon-Mitgliedschaft auf.",
    emailLabel: "E-Mail",
    passwordLabel: "Passwort",
    signInCta: "Anmelden",
    signingIn: "Anmeldung…",
    noAccount: "Kein Konto?",
    createOne: "Eines erstellen",
    badCredentials: "E-Mail oder Passwort ist falsch.",
    registerTitle: "Konto erstellen",
    registerBody:
      "Die Registrierung ist kostenlos. Wählen Sie danach eine Mitgliedschaft, um die Kollektion freizuschalten.",
    nameLabel: "Name",
    optional: "(optional)",
    passwordHint: "(mind. 8 Zeichen)",
    createCta: "Konto erstellen",
    creating: "Wird erstellt…",
    haveAccount: "Schon Mitglied?",
    genericError: "Konto konnte nicht erstellt werden.",
    networkError: "Netzwerkfehler. Bitte versuchen Sie es erneut.",
  },

  listings: {
    title: "Residenzen",
    countOne: "Luxusangebot in Thailand",
    countOther: "Luxusangebote in Thailand",
    searchPlaceholder: "Gebiet, Projekt, Stichwort suchen…",
    allRegions: "Alle Regionen",
    allTypes: "Alle Typen",
    samuiRegion: "Koh Samui (Surat Thani)",
    budgets: [
      "Beliebiges Budget",
      "Bis ฿25M",
      "฿25M – ฿50M",
      "฿50M – ฿100M",
      "฿100M +",
    ],
    sorts: [
      "Neueste zuerst",
      "Preis — absteigend",
      "Preis — aufsteigend",
      "Größte zuerst",
    ],
    noResults: "Noch keine Residenz passt zu diesen Filtern.",
    clearFilters: "Filter zurücksetzen",
    bed: "Schlafz.",
    bath: "Bäder",
    sqm: "m²",
    sqmLand: "m² Grund",
    forSale: "Zu verkaufen",
    forRent: "Zu vermieten",
    signature: "Signature",
    priceOnApplication: "Preis auf Anfrage",
  },

  detail: {
    back: "Zurück zu den Residenzen",
    description: "Beschreibung",
    features: "Ausstattung",
    location: "Lage",
    type: "Typ",
    bedrooms: "Schlafzimmer",
    bathrooms: "Badezimmer",
    interiorArea: "Wohnfläche",
    landArea: "Grundstücksfläche",
    region: "Region",
    furnished: "Möbliert",
    yes: "Ja",
    listingAgency: "Maklerbüro",
    viewOnAgency: "Auf der Makler-Website ansehen",
    agencyDisclaimer:
      "Sie werden direkt an das Maklerbüro vermittelt, das dieses Inserat hält. Palais Horizon ist nicht der Verkäufer.",
    moreIn: "Mehr in",
  },

  account: {
    title: "Mein Konto",
    name: "Name",
    email: "E-Mail",
    membership: "Mitgliedschaft",
    plan: "Tarif",
    renewsEnds: "Verlängert / endet",
    ended: "Beendet am",
    browse: "Residenzen durchsuchen",
    statuses: {
      none: "Keine Mitgliedschaft",
      active: "Aktiv",
      trialing: "Testphase",
      past_due: "Zahlung überfällig",
      canceled: "Gekündigt",
    },
    manageBilling: "Zahlung verwalten / kündigen",
    opening: "Wird geöffnet…",
    startMembership: "Mitgliedschaft starten",
    reactivate: "Mitgliedschaft reaktivieren",
    viewMembership: "Mitgliedschaft ansehen",
    signOut: "Abmelden",
    portalError: "Das Zahlungsportal konnte nicht geöffnet werden.",
  },

  success: {
    title: "Willkommen bei Palais Horizon",
    body: "Ihre Mitgliedschaft wird aktiviert. Das kann einige Sekunden dauern, während die Zahlung bestätigt wird.",
    cta: "Zur Kollektion",
    hint: "Falls der Katalog weiterhin nach einem Tarif fragt, laden Sie in Kürze neu — die Bestätigung wird abgeschlossen.",
  },

  about: {
    title: "Über Palais Horizon",
    p1: "Palais Horizon ist ein unabhängiges Verzeichnis für Luxusimmobilien in ganz Thailand. Wir bündeln Inserate der führenden Maklerhäuser und Portale des Landes, vereinheitlichen sie zu einer Kollektion und behalten den Link zur Originalquelle, sodass Mitglieder direkt mit dem beauftragten Maklerbüro verhandeln.",
    p2: "Wir halten keine Immobilienmandate und sind an keinem Verkauf oder Mietvertrag beteiligt. Die Mitgliedschaft bezahlt Kuratierung und Zugang — eine einzige, durchsuchbare Sicht auf die Spitze des Marktes und einen direkten Draht zu jedem Makler.",
    membersTitle: "Was Mitglieder erhalten",
    members: [
      "Vollständige Angebotspreise in THB und USD, mit exakter Lage und Karte.",
      "Vollständige Fotogalerien und Objektdetails.",
      "Eine Ein-Klick-Vermittlung zur Seite des Maklerbüros.",
      "Unbegrenzte Suche und Filter über alle abgedeckten Regionen.",
    ],
    sourcesTitle: "Woher die Inserate stammen",
    sourcesBody:
      "Zu den Quellen zählen derzeit Conrad Properties, Thailand-Property, Three Seasons Properties und weitere etablierte Luxusmakler. Die Kollektion wird von einer Pipeline aktualisiert, die alles unterhalb der Grenze für Spitzenimmobilien herausfiltert.",
    cta: "Mitgliedschaft ansehen",
  },

  notFound: {
    title: "Diese Adresse steht nicht im Buch",
    body: "Die gesuchte Seite wurde verschoben oder hat nie existiert.",
    cta: "Zurück zu Palais Horizon",
  },

  footer: {
    explore: "Entdecken",
    account: "Konto",
    legal: "Rechtliches",
    residences: "Residenzen",
    membership: "Mitgliedschaft",
    about: "Über uns",
    signIn: "Anmelden",
    createAccount: "Konto erstellen",
    myAccount: "Mein Konto",
    howItWorks: "Wie das Verzeichnis funktioniert",
    terms: "AGB",
    privacy: "Datenschutz",
    disclaimer:
      "Ein unabhängiges Immobilienverzeichnis. Die Inserate gehören den jeweiligen Maklerbüros; Palais Horizon verlinkt auf die Originalquelle und ist nicht der Verkäufer.",
  },

  languageNames: {
    en: "English",
    fr: "Français",
    de: "Deutsch",
  },
};
