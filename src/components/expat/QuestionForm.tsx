"use client";

import { useState } from "react";

const TOPICS = ["Visa", "Fiscalité", "Banque", "Santé", "Revenus", "Logement / achat", "Autre"];

export function QuestionForm({ whatsapp, instagram }: { whatsapp: string; instagram: string }) {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [question, setQuestion] = useState("");

  const message = `[Palais Horizon – ${topic}] ${question.trim()}`;
  const ready = question.trim().length >= 10;
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}` : null;

  return (
    <div className="panel grid gap-4 rounded-sm p-5">
      <label className="grid gap-1.5 text-sm text-silver">
        Sujet
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-sm border border-ink-border bg-ink-panel px-3 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
        >
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm text-silver">
        Votre question
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={5}
          placeholder="Décrivez votre situation (nationalité, projet, durée, budget…) pour obtenir une réponse précise."
          className="w-full rounded-sm border border-ink-border bg-ink-panel px-3 py-2.5 text-sm text-cream placeholder:text-dim focus:border-gold focus:outline-none"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        {whatsappHref && (
          <a
            href={ready ? whatsappHref : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!ready}
            className={`btn-gold rounded-full px-6 py-2.5 text-sm ${ready ? "" : "pointer-events-none opacity-50"}`}
          >
            Envoyer sur WhatsApp
          </a>
        )}
        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost rounded-full px-6 py-2.5 text-sm"
          >
            Écrire sur Instagram
          </a>
        )}
      </div>
      {!ready && whatsappHref && <p className="text-xs text-dim">Écrivez au moins une phrase pour activer l'envoi.</p>}
    </div>
  );
}
