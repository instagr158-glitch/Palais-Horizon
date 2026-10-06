import { GuideView } from "@/components/expat/GuideView";
import { BANK_HEALTH_GUIDE } from "@/lib/expat/guides";

export const metadata = { title: "Banque, budget et santé" };

export default function BanqueSantePage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream sm:text-4xl">{BANK_HEALTH_GUIDE.title}</h1>
      <div className="mt-3">
        <GuideView guide={BANK_HEALTH_GUIDE} />
      </div>
    </div>
  );
}
