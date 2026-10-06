import { GuideView } from "@/components/expat/GuideView";
import { TAX_GUIDE } from "@/lib/expat/guides";

export const metadata = { title: "Fiscalité France–Thaïlande" };

export default function FiscalitePage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-cream sm:text-4xl">{TAX_GUIDE.title}</h1>
      <div className="mt-3">
        <GuideView guide={TAX_GUIDE} />
      </div>
    </div>
  );
}
