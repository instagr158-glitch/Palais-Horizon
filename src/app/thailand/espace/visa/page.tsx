import { VisaFinder } from "@/components/expat/VisaFinder";

export const metadata = { title: "Trouver mon visa" };

export default function VisaPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream sm:text-4xl">Trouver mon visa pour la Thaïlande</h1>
      <p className="mt-2 max-w-2xl text-silver">
        Répondez aux questions ci-dessous : les visas qui correspondent à votre situation s'affichent, avec les
        documents à préparer.
      </p>
      <div className="mt-8">
        <VisaFinder />
      </div>
      <p className="mt-8 rounded-sm border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-silver">
        Les montants et conditions sont indicatifs et évoluent régulièrement. Vérifiez-les sur le site de l'ambassade
        ou du consulat de Thaïlande avant de déposer un dossier.
      </p>
    </div>
  );
}
