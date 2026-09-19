"use client";

import { useState } from "react";
import type { Lead } from "../../lib/crm/types";

type Phase = "idle" | "drafting" | "editing" | "sending" | "sent";

export default function EmailComposer({ lead }: { lead: Lead }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [lang, setLang] = useState<"ru" | "de">("de");
  const [to, setTo] = useState(lead.contact_email);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [signature, setSignature] = useState("");
  const [instruction, setInstruction] = useState("");

  async function draft(revise: boolean) {
    setPhase("drafting");
    setError("");
    try {
      const res = await fetch("/api/crm/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          lang,
          instruction: instruction || undefined,
          ...(revise && subject ? { prior_subject: subject, prior_body: body } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setSubject(json.subject);
      setBody(json.body);
      setSignature(json.signature);
      if (!to && json.to) setTo(json.to);
      setInstruction("");
      setPhase("editing");
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setPhase(subject ? "editing" : "idle");
    }
  }

  async function send() {
    setPhase("sending");
    setError("");
    try {
      const res = await fetch("/api/crm/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, to, subject, body, lang }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setPhase("sent");
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setPhase("editing");
    }
  }

  if (phase === "sent") {
    return (
      <div className="crm-ok">
        ✅ Письмо отправлено на {to}. Оно в «Отправленных» твоего Gmail.
        <div style={{ marginTop: 8 }}>
          <button className="crm-mini-btn" onClick={() => { setPhase("idle"); setSubject(""); setBody(""); }}>Ещё письмо</button>
        </div>
      </div>
    );
  }

  if (phase === "idle" || (phase === "drafting" && !subject)) {
    return (
      <div>
        <div className="crm-row-btns" style={{ marginBottom: 8 }}>
          <button className={`crm-chip ${lang === "de" ? "on" : ""}`} onClick={() => setLang("de")}>🇦🇹 Deutsch</button>
          <button className={`crm-chip ${lang === "ru" ? "on" : ""}`} onClick={() => setLang("ru")}>🇷🇺 Русский</button>
        </div>
        <input
          className="crm-input"
          style={{ marginBottom: 8 }}
          placeholder="Что сказать? (необязательно — AI сам по контексту)"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
        {error && <div className="crm-error">{error}</div>}
        <button className="crm-go" onClick={() => draft(false)} disabled={phase === "drafting"}>
          {phase === "drafting" ? "🧠 Пишу…" : "✍️ Сгенерировать письмо"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="crm-field">
        <label>Кому</label>
        <input className="crm-input" type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="email@..." />
      </div>
      <div className="crm-field">
        <label>Тема</label>
        <input className="crm-input" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="crm-field">
        <label>Текст</label>
        <textarea className="crm-textarea" style={{ minHeight: 180 }} value={body} onChange={(e) => setBody(e.target.value)} />
        <div className="crm-sig">{signature.trim()}</div>
      </div>
      <div className="crm-field">
        <input
          className="crm-input"
          placeholder="Правка: «короче», «добавь про party-пакет»…"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
      </div>
      {error && <div className="crm-error">{error}</div>}
      <div className="crm-row-btns">
        <button className="crm-go" onClick={() => draft(true)} disabled={phase !== "editing" || !instruction}>
          🔁 Переписать
        </button>
        <button className="crm-go red" onClick={send} disabled={phase !== "editing" || !to || !subject}>
          {(phase as Phase) === "sending" ? "Отправляю…" : "📤 Отправить"}
        </button>
      </div>
    </div>
  );
}
