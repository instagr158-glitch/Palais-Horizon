"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AREA_LABELS,
  QUESTIONS,
  scoreAnswers,
  type Area,
  type Scored,
} from "@/lib/expat/test";

const STORAGE_KEY = "ph-th-test";
const FREE_RISKS = 1;

const labelColor: Record<Scored["label"], string> = {
  Faible: "text-emerald-400",
  Modéré: "text-yellow-400",
  Élevé: "text-orange-400",
  "Très élevé": "text-red-400",
};

function areaBreakdown(answers: Record<string, number>) {
  return (Object.keys(AREA_LABELS) as Area[]).map((area) => {
    const qs = QUESTIONS.filter((q) => q.area === area);
    const weight = qs.reduce((s, q) => s + q.weight, 0);
    const impact = qs.reduce((s, q) => {
      const chosen = answers[q.id];
      return s + (chosen == null ? 0 : (q.options[chosen].risk / 3) * q.weight);
    }, 0);
    return { area, pct: Math.round((impact / weight) * 100) };
  });
}

export function ProjectTest({ isMember, pricingHref }: { isMember: boolean; pricingHref: string }) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved?.done && saved.answers) {
        setAnswers(saved.answers);
        setDone(true);
        setStarted(true);
      }
    } catch {
      // storage unavailable: the result simply won't be remembered
    }
  }, []);

  function persist(next: Record<string, number>, finished: boolean) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers: next, done: finished }));
    } catch {
      // storage unavailable
    }
  }

  function choose(questionId: string, optionIndex: number) {
    const next = { ...answers, [questionId]: optionIndex };
    setAnswers(next);
    if (step + 1 >= QUESTIONS.length) {
      setDone(true);
      persist(next, true);
    } else {
      setStep(step + 1);
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setDone(false);
    persist({}, false);
  }

  if (!started) {
    return (
      <div className="panel mx-auto max-w-xl rounded-sm p-8 text-center">
        <h2 className="font-display text-3xl text-cream">Prêt(e) à tester votre projet ?</h2>
        <p className="mt-3 text-silver">
          {QUESTIONS.length} questions rapides sur votre destination, votre visa, votre argent, votre santé et
          vos attaches. Vous obtenez un score de risque et les points à corriger en premier.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="btn-gold mt-6 flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-bold"
        >
          Commencer
          <span aria-hidden>→</span>
        </button>
        <p className="mt-3 text-xs text-dim">Gratuit · 1 minute · sans inscription</p>
      </div>
    );
  }

  if (!done) {
    const q = QUESTIONS[step];
    const pct = Math.round((step / QUESTIONS.length) * 100);
    return (
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between text-xs text-dim">
          <span>
            Question {step + 1} sur {QUESTIONS.length}
          </span>
          <span className="uppercase tracking-wide text-gold">{AREA_LABELS[q.area]}</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} />
        </div>

        <h2 className="mt-6 font-display text-2xl text-cream sm:text-3xl">{q.text}</h2>
        <div className="mt-5 grid gap-3">
          {q.options.map((o, i) => (
            <button
              key={o.label}
              onClick={() => choose(q.id, i)}
              className="rounded-sm border border-ink-border bg-ink-panel px-4 py-3.5 text-left text-sm text-cream transition-colors hover:border-gold/60"
            >
              {o.label}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="mt-5 text-sm text-dim hover:text-cream">
            ← Question précédente
          </button>
        )}
      </div>
    );
  }

  const result = scoreAnswers(answers);
  const areas = areaBreakdown(answers);
  const total = result.risks.length;
  const shown = isMember ? result.risks : result.risks.slice(0, FREE_RISKS);
  const locked = isMember ? [] : result.risks.slice(FREE_RISKS);
  const hidden = locked.length;

  const unlockButton = (
    <Link
      href={pricingHref}
      className="btn-gold flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-bold sm:inline-flex sm:w-auto"
    >
      Débloquer mon rapport complet
      <span aria-hidden>→</span>
    </Link>
  );

  return (
    <div className={`mx-auto max-w-3xl ${hidden > 0 ? "pb-24 sm:pb-0" : ""}`}>
      <div className="panel rounded-sm p-8 text-center">
        <p className="text-xs uppercase tracking-widetitle text-dim">Votre score de risque</p>
        <p className="num mt-3 text-7xl leading-none text-gold-gradient">{result.score}</p>
        <p className={`mt-2 text-sm font-bold uppercase tracking-widetitle ${labelColor[result.label]}`}>
          Risque {result.label.toLowerCase()}
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm text-silver">
          Plus le score est élevé, plus votre projet porte de risques qui pourraient vous coûter de l'argent ou du temps.
        </p>

        <div className="mx-auto mt-6 grid max-w-md gap-3 text-left">
          {areas.map((a) => (
            <div key={a.area}>
              <div className="flex justify-between text-xs text-silver">
                <span>{AREA_LABELS[a.area]}</span>
                <span className="num text-dim">{a.pct}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gold" style={{ width: `${a.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {hidden > 0 && (
        <div className="mt-5 rounded-sm border border-gold/60 bg-gold/[0.07] p-6 text-center shadow-gold">
          <p className="font-display text-2xl text-cream sm:text-3xl">Votre rapport complet est prêt</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-silver">
            <span className="num font-semibold text-cream">{total}</span> risques identifiés dans votre projet. Vous voyez
            le premier ci-dessous. Débloquez les <span className="num font-semibold text-cream">{hidden}</span> autres,
            classés dans l'ordre où les corriger, avec les étapes concrètes pour chacun.
          </p>
          <div className="mt-5 sm:flex sm:justify-center">{unlockButton}</div>
          <p className="mt-3 text-xs text-dim">19 € / mois · sans engagement · accès immédiat</p>
        </div>
      )}

      <h2 className="mt-10 font-display text-2xl text-cream sm:text-3xl">
        {isMember ? "Vos risques, dans l'ordre où les corriger" : "Votre risque n° 1"}
      </h2>

      {total === 0 ? (
        <p className="panel mt-4 rounded-sm p-5 text-sm text-silver">
          Aucun risque majeur détecté dans vos réponses. Continuez à vérifier les conditions de votre visa avant de partir.
        </p>
      ) : (
        <ol className="mt-4 grid gap-4">
          {shown.map((r, i) => (
            <li key={r.question.id} className="panel rounded-sm p-5">
              <div className="flex items-start gap-3">
                <span className="num flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 text-sm text-gold">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-dim">{AREA_LABELS[r.question.area]}</p>
                  <h3 className="font-display text-xl text-cream">{r.content.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-silver">{r.content.why}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gold">Comment le corriger</p>
              <ul className="mt-2 grid gap-1.5 text-sm text-silver">
                {r.content.fix.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-gold">→</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}

          {locked.map((r, i) => (
            <li key={r.question.id} className="panel relative overflow-hidden rounded-sm p-5">
              <div className="flex items-start gap-3">
                <span className="num flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-sm text-dim">
                  {shown.length + i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-wide text-dim">{AREA_LABELS[r.question.area]}</p>
                  <h3 className="font-display text-xl text-cream">{r.content.title}</h3>
                </div>
                <span className="shrink-0 rounded-full border border-gold/40 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold">
                  Membres
                </span>
              </div>
              <div aria-hidden className="mt-4 grid gap-2">
                <div className="h-2.5 w-full rounded-full bg-white/10" />
                <div className="h-2.5 w-5/6 rounded-full bg-white/10" />
                <div className="h-2.5 w-2/3 rounded-full bg-white/10" />
              </div>
            </li>
          ))}
        </ol>
      )}

      {hidden > 0 && (
        <div className="mt-6 rounded-sm border border-gold/60 bg-gold/[0.07] p-6 text-center shadow-gold">
          <p className="font-display text-2xl text-cream">
            Corrigez les {hidden} autre{hidden > 1 ? "s" : ""} risque{hidden > 1 ? "s" : ""} avant de partir
          </p>
          <div className="mt-4 sm:flex sm:justify-center">{unlockButton}</div>
          <p className="mt-3 text-xs text-dim">19 € / mois · sans engagement · accès immédiat</p>
        </div>
      )}

      <div className="mt-8 text-sm">
        <button onClick={restart} className="text-dim hover:text-cream">
          Refaire le test
        </button>
      </div>

      {hidden > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold/30 bg-ink/95 p-3 backdrop-blur sm:hidden">
          {unlockButton}
        </div>
      )}

      <p className="mt-8 text-xs leading-relaxed text-dim">
        <span className="font-semibold text-gold">À savoir : </span>
        Ce test donne une indication générale à partir de vos réponses. Il ne remplace pas un conseil juridique, fiscal ou
        médical. Les règles de visa et d'assurance changent régulièrement : confirmez toujours auprès de l'administration ou
        d'un professionnel.
      </p>
    </div>
  );
}
