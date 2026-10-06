import Link from "next/link";
import { UPCOMING_WORKSHOPS, WORKSHOP_TOPICS } from "@/lib/expat/guides";

export const metadata = { title: "Ateliers en direct" };

function formatDate(startsAt: string) {
  const d = new Date(startsAt.replace(" ", "T") + ":00+02:00");
  return Number.isNaN(d.getTime())
    ? startsAt
    : d.toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Paris" });
}

export default function AteliersPage() {
  const now = Date.now();
  const upcoming = UPCOMING_WORKSHOPS.filter((w) => {
    const t = new Date(w.startsAt.replace(" ", "T") + ":00+02:00").getTime();
    return Number.isNaN(t) || t >= now;
  }).sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <div>
      <h1 className="font-display text-3xl text-cream sm:text-4xl">Ateliers en direct</h1>
      <p className="mt-2 max-w-2xl text-silver">
        Des sessions en visio avec questions-réponses pour préparer votre installation, financer votre séjour et
        construire votre vie sur place.
      </p>

      <h2 className="mt-8 font-display text-2xl text-cream">Prochaines sessions</h2>
      {upcoming.length === 0 ? (
        <p className="panel mt-3 rounded-sm p-5 text-sm text-silver">
          La prochaine date sera annoncée très bientôt. Posez dès maintenant vos questions pour qu'elles soient
          traitées pendant l'atelier :{" "}
          <Link href="/thailand/espace/questions" className="text-gold hover:underline">
            poser une question
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 grid gap-3">
          {upcoming.map((w) => (
            <li key={w.title + w.startsAt} className="panel flex flex-wrap items-center justify-between gap-3 rounded-sm p-5">
              <div>
                <p className="font-display text-xl text-cream">{w.title}</p>
                <p className="mt-1 text-sm text-dim">{formatDate(w.startsAt)}</p>
              </div>
              <a href={w.joinUrl} target="_blank" rel="noopener noreferrer" className="btn-gold rounded-full px-5 py-2 text-sm">
                Rejoindre
              </a>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 font-display text-2xl text-cream">Les thèmes au programme</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {WORKSHOP_TOPICS.map((t) => (
          <div key={t.title} className="panel rounded-sm p-5">
            <h3 className="font-display text-lg text-cream">{t.title}</h3>
            <p className="mt-2 text-sm text-dim">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
