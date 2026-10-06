import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";
import { getServerDict } from "@/i18n/server";
import { EspaceNav } from "@/components/expat/EspaceNav";

export const dynamic = "force-dynamic";

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!hasActiveSubscription(session?.user)) redirect("/pricing-thailand?locked=thailand");

  const dict = await getServerDict();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {dict.code !== "fr" && (
        <p className="mb-6 rounded-sm border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-silver">
          Les outils et guides de cet espace sont pour l'instant rédigés en français.
        </p>
      )}
      <EspaceNav />
      <div className="mt-8">{children}</div>
      <p className="mt-12 text-xs leading-relaxed text-dim">
        <span className="font-semibold text-gold">À savoir : </span>
        Ces informations sont générales et indicatives. Elles ne remplacent pas un conseil juridique, fiscal ou médical.
        Les règles de visa, de fiscalité et d'assurance changent régulièrement : confirmez toujours auprès de
        l'administration compétente ou d'un professionnel avant toute démarche.
      </p>
    </div>
  );
}
