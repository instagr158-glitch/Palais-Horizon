"use client";

import { useState } from "react";
import {
  DURATIONS,
  FUNDS,
  OBJECTIVES,
  evaluate,
  type Answers,
  type Visa,
} from "@/lib/expat/visas";

const select =
  "w-full rounded-sm border border-ink-border bg-ink-panel px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none";

function VisaCard({ visa, gaps }: { visa: Visa; gaps: string[] }) {
  const fits = gaps.length === 0;
  return (
    <article
      className={`rounded-sm border p-5 ${
        fits ? "border-gold/50 bg-gold/[0.04]" : "border-ink-border bg-ink-panel"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-xl text-cream">{visa.name}</h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            fits ? "bg-gold text-black" : "bg-white/10 text-dim"
          }`}
        >
          {fits ? "Adapté à votre profil" : "Pas encore"}
        </span>
      </div>
      <p className="mt-2 text-sm text-silver">{visa.summary}</p>

      {!fits && (
        <ul className="mt-3 grid gap-1 text-sm text-gold">
          {gaps.map((g) => (
            <li key={g}>→ {g}</li>
          ))}
        </ul>
      )}

      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-dim">Durée</dt>
          <dd className="mt-0.5 text-cream">{visa.duration}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-dim">Coût indicatif</dt>
          <dd className="mt-0.5 text-cream">{visa.cost}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-dim">Fonds exigés</dt>
          <dd className="mt-0.5 text-cream">{visa.funds}</dd>
        </div>
      </dl>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-gold">Documents et points de vigilance</summary>
        <ul className="mt-3 grid gap-1.5 text-silver">
          {visa.documents.map((d) => (
            <li key={d}>• {d}</li>
          ))}
        </ul>
        <p className="mt-3 rounded-sm border border-gold/30 bg-gold/5 px-3 py-2 text-silver">{visa.watch}</p>
      </details>
    </article>
  );
}

export function VisaFinder() {
  const [answers, setAnswers] = useState<Answers>({
    objective: "remote",
    age50: false,
    duration: "year",
    funds: "500to800",
  });

  const { fits, notYet } = evaluate(answers);

  return (
    <div>
      <div className="panel grid gap-4 rounded-sm p-5 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-silver sm:col-span-2">
          Pourquoi voulez-vous aller en Thaïlande ?
          <select
            className={select}
            value={answers.objective}
            onChange={(e) => setAnswers({ ...answers, objective: e.target.value as Answers["objective"] })}
          >
            {OBJECTIVES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm text-silver">
          Combien de temps comptez-vous y rester ?
          <select
            className={select}
            value={answers.duration}
            onChange={(e) => setAnswers({ ...answers, duration: e.target.value as Answers["duration"] })}
          >
            {DURATIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm text-silver">
          Quels fonds pouvez-vous justifier ?
          <select
            className={select}
            value={answers.funds}
            onChange={(e) => setAnswers({ ...answers, funds: e.target.value as Answers["funds"] })}
          >
            {FUNDS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 text-sm text-silver sm:col-span-2">
          <input
            type="checkbox"
            checked={answers.age50}
            onChange={(e) => setAnswers({ ...answers, age50: e.target.checked })}
            className="h-4 w-4 accent-[#D4AF37]"
          />
          J'ai 50 ans ou plus
        </label>
      </div>

      <h2 className="mt-8 font-display text-2xl text-cream">
        {fits.length > 0
          ? `${fits.length} option${fits.length > 1 ? "s" : ""} adaptée${fits.length > 1 ? "s" : ""} à votre profil`
          : "Aucune option ne correspond exactement"}
      </h2>
      <div className="mt-4 grid gap-4">
        {fits.map((r) => (
          <VisaCard key={r.visa.id} visa={r.visa} gaps={r.gaps} />
        ))}
      </div>

      {notYet.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-xl text-cream">Presque accessibles</h2>
          <p className="mt-1 text-sm text-dim">Ce qu'il vous manque pour y prétendre.</p>
          <div className="mt-4 grid gap-4">
            {notYet.map((r) => (
              <VisaCard key={r.visa.id} visa={r.visa} gaps={r.gaps} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
