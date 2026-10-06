"use client";

import { useEffect, useState } from "react";
import { CITIES, TIERS, THB_PER_EUR, computeBudget, type CityId, type Tier } from "@/lib/expat/budget";

const STORAGE_KEY = "ph-th-budget";
const select =
  "w-full rounded-sm border border-ink-border bg-ink-panel px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none";

const thb = (n: number) => `${n.toLocaleString("fr-FR")} THB`;
const eur = (thbAmount: number) => `${Math.round(thbAmount / THB_PER_EUR).toLocaleString("fr-FR")} €`;

export function BudgetPlanner() {
  const [city, setCity] = useState<CityId>("chiangmai");
  const [tier, setTier] = useState<Tier>("comfort");
  const [people, setPeople] = useState<1 | 2>(1);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved?.city && CITIES.some((c) => c.id === saved.city)) setCity(saved.city);
      if (saved?.tier && TIERS.some((t) => t.id === saved.tier)) setTier(saved.tier);
      if (saved?.people === 1 || saved?.people === 2) setPeople(saved.people);
    } catch {
      // storage unavailable: choices simply won't persist
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ city, tier, people }));
    } catch {
      // storage unavailable
    }
  }, [city, tier, people]);

  const budget = computeBudget(city, tier, people);
  const cityInfo = CITIES.find((c) => c.id === city)!;
  const cushion = budget.totalThb * 6 + budget.lines.find((l) => l.id === "housing")!.thb * 3;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="panel grid content-start gap-4 rounded-sm p-5">
        <label className="grid gap-1.5 text-sm text-silver">
          Ville
          <select className={select} value={city} onChange={(e) => setCity(e.target.value as CityId)}>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm text-silver">
          Niveau de vie
          <select className={select} value={tier} onChange={(e) => setTier(e.target.value as Tier)}>
            {TIERS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm text-silver">
          Nombre de personnes
          <select className={select} value={people} onChange={(e) => setPeople(Number(e.target.value) as 1 | 2)}>
            <option value={1}>1 personne</option>
            <option value={2}>2 personnes (couple)</option>
          </select>
        </label>
        <p className="text-sm text-dim">{cityInfo.note}</p>
      </div>

      <div className="panel rounded-sm p-5">
        <p className="text-xs uppercase tracking-wide text-dim">Budget mensuel estimé</p>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
          <span className="num text-4xl text-gold-gradient">{eur(budget.totalThb)}</span>
          <span className="num text-base text-silver">{thb(budget.totalThb)} / mois</span>
        </p>

        <ul className="mt-5 grid gap-2 border-t border-ink-border pt-4">
          {budget.lines.map((l) => (
            <li key={l.id} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-silver">{l.label}</span>
              <span className="num text-cream">
                {eur(l.thb)} <span className="text-dim">· {thb(l.thb)}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-sm border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-silver">
          <p>
            Épargne conseillée pour démarrer : <span className="num text-cream">{eur(cushion)}</span> (6 mois de dépenses
            + 3 mois de loyer pour caution et installation).
          </p>
        </div>

        <p className="mt-4 text-xs text-dim">
          Estimation indicative en euros avec 1 € ≈ {THB_PER_EUR} THB. Vos dépenses réelles dépendent de votre quartier,
          de votre logement et de vos habitudes.
        </p>
      </div>
    </div>
  );
}
