import { QuestionForm } from "@/components/expat/QuestionForm";
import { EXPERT_CONTACT } from "@/lib/expat/guides";

export const metadata = { title: "Poser une question" };

export default function QuestionsPage() {
  const active = !!(EXPERT_CONTACT.whatsapp || EXPERT_CONTACT.instagram);
  return (
    <div>
      <h1 className="font-display text-3xl text-cream sm:text-4xl">Posez votre question à un agent</h1>
      <p className="mt-2 max-w-2xl text-silver">
        Visa, fiscalité, banque, santé, logement : décrivez votre situation et recevez une réponse personnalisée.
      </p>
      <div className="mt-8 max-w-2xl">
        {active ? (
          <QuestionForm whatsapp={EXPERT_CONTACT.whatsapp} instagram={EXPERT_CONTACT.instagram} />
        ) : (
          <p className="panel rounded-sm p-5 text-sm text-silver">
            Le canal d'échange avec l'agent est en cours d'activation. Revenez très bientôt.
          </p>
        )}
      </div>
    </div>
  );
}
