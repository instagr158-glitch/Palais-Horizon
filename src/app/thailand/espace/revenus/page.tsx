import { GuideView } from "@/components/expat/GuideView";
import { INCOME_GUIDE } from "@/lib/expat/guides";

export const metadata = { title: "Générer un revenu" };

export default function RevenusPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream sm:text-4xl">{INCOME_GUIDE.title}</h1>
      <div className="mt-3">
        <GuideView guide={INCOME_GUIDE} />
      </div>
    </div>
  );
}
