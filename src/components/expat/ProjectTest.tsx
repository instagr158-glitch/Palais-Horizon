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
const FREE_RISKS = 3;

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
          {QUESTIONS.length} questions à choix multiple sur votre destination, votre visa, votre argent, vos attaches et
          votre entourage. Vous obtenez un score de risque et les points à corriger en premier.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="btn-gold mt-6 flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-bold"
        >
          Commencer
          <span aria-hidden>→</span>
        </button>
        <p className="mt-3 text-xs text-dim">Gratuit · 3 minutes · sans inscription</p>
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
  const shown = isMember ? result.risks : result.risks.slice(0, FREE_RISKS);
  const hidden = result.risks.length - shown.length;

  return (
    <div className="mx-auto max-w-3xl">
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

      <h2 className="mt-10 font-display text-2xl text-cream sm:text-3xl">
        {isMember ? "Vos risques, dans l'ordre où les corriger" : "Les risques à corriger en premier"}
      </h2>

      {shown.length === 0 ? (
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
        </ol>
      )}

      {hidden > 0 && (
        <div className="mt-6 rounded-sm border border-gold/40 bg-gold/5 p-6 text-center">
          <p className="font-display text-2xl text-cream">
            {hidden} autre{hidden > 1 ? "s" : ""} risque{hidden > 1 ? "s" : ""} à corriger
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-silver">
            Les membres voient la liste complète, classée dans l'ordre où la corriger, avec les étapes pour chacun.
          </p>
          <Link
            href={pricingHref}
            className="btn-gold mt-4 flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-bold sm:inline-flex sm:w-auto"
          >
            Voir mon rapport complet
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
        <button onClick={restart} className="text-dim hover:text-cream">
          Refaire le test
        </button>
        <Link href="/thailand#biens" className="text-gold hover:underline">
          Voir les biens à vendre →
        </Link>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-dim">
        <span className="font-semibold text-gold">À savoir : </span>
        Ce test donne une indication générale à partir de vos réponses. Il ne remplace pas un conseil juridique, fiscal ou
        médical. Les règles de visa et d'assurance changent régulièrement : confirmez toujours auprès de l'administration ou
        d'un professionnel.
      </p>
    </div>
  );
}
