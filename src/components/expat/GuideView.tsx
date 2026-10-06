import type { Guide } from "@/lib/expat/guides";
import { Checklist } from "@/components/expat/Checklist";

export function GuideView({ guide }: { guide: Guide }) {
  return (
    <div>
      <p className="max-w-3xl text-silver">{guide.intro}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="grid gap-5">
          {guide.sections.map((s) => (
            <section key={s.title} className="panel rounded-sm p-5">
              <h2 className="font-display text-xl text-cream">{s.title}</h2>
              {s.paragraphs?.map((p) => (
                <p key={p} className="mt-3 text-sm leading-relaxed text-silver">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-silver">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-gold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.warning && (
                <p className="mt-3 rounded-sm border border-gold/30 bg-gold/5 px-3 py-2 text-sm text-silver">
                  {s.warning}
                </p>
              )}
            </section>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Checklist storageKey={guide.checklistKey} title="Ma checklist" items={guide.checklist} />
        </div>
      </div>
    </div>
  );
}
