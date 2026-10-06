import Link from "next/link";
import { Checklist } from "@/components/expat/Checklist";
import { SETUP_CHECKLIST } from "@/lib/expat/guides";

export const metadata = { title: "Mon espace Thaïlande" };

const TOOLS = [
  { href: "/thailand/espace/visa", title: "Trouver mon visa", text: "Répondez à 4 questions : voyez quels visas vous correspondent et ce qu'il vous manque." },
  { href: "/thailand/espace/budget", title: "Calculer mon budget", text: "Le coût de la vie dans 6 villes, selon votre niveau de vie." },
  { href: "/thailand/espace/fiscalite", title: "Comprendre la fiscalité", text: "Résidence fiscale, double imposition, déclarations." },
  { href: "/thailand/espace/banque-sante", title: "Banque, budget et santé", text: "Compte, transferts, assurance santé." },
  { href: "/thailand/espace/revenus", title: "Générer un revenu", text: "Pistes réalistes et plan d'action en 90 jours." },
  { href: "/thailand/espace/ateliers", title: "Ateliers en direct", text: "Visa, fiscalité, revenus : les sessions avec questions-réponses." },
  { href: "/thailand/espace/questions", title: "Poser une question", text: "Un agent vous répond sur votre situation." },
  { href: "/thailand/espace/biens", title: "Trouver mon bien", text: "Les maisons et condos adaptés à votre budget." },
];

export default function EspaceHome() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream sm:text-4xl">Votre espace expatriation</h1>
      <p className="mt-2 max-w-2xl text-silver">
        Tout ce qu'il faut pour planifier, financer et construire votre vie en Thaïlande. Commencez par le visa : c'est
        lui qui détermine le reste.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            prefetch={false}
            className="panel group flex flex-col rounded-sm p-5 transition-colors hover:border-gold/50"
          >
            <h2 className="font-display text-xl text-cream group-hover:text-gold">{tool.title}</h2>
            <p className="mt-2 text-sm text-dim">{tool.text}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl text-cream">Mon plan d'installation</h2>
      <p className="mt-1 text-sm text-dim">Cochez au fur et à mesure. Votre progression est enregistrée sur cet appareil.</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {SETUP_CHECKLIST.map((c) => (
          <Checklist key={c.key} storageKey={c.key} title={c.title} items={c.items} />
        ))}
      </div>
    </div>
  );
}
