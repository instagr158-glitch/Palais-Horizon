import { BudgetPlanner } from "@/components/expat/BudgetPlanner";

export const metadata = { title: "Calculer mon budget" };

export default function BudgetPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream sm:text-4xl">Calculer mon budget en Thaïlande</h1>
      <p className="mt-2 max-w-2xl text-silver">
        Choisissez une ville et votre niveau de vie : vous obtenez une estimation mensuelle détaillée et l'épargne à
        prévoir pour démarrer.
      </p>
      <div className="mt-8">
        <BudgetPlanner />
      </div>
    </div>
  );
}
