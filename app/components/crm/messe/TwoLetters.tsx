"use client";

import { useState } from "react";
import type { Exhibitor, FairVisit } from "../../../lib/crm/messe/data";

type Step = "input" | "drafting" | "review" | "sending" | "done";

/**
 * «Два письма» прямо на стенде:
 *   №1 — «мы только что говорили у вашего стенда» — уходит сразу;
 *   №2 — две конкретные идеи — ложится в очередь и уходит в выбранный день в 09:00.
 * Один вызов Claude на оба текста, один экран проверки, одна кнопка.
 */
export default function TwoLetters({
  exhibitor: r,
  visit,
  fairTitle,
  onLead,
  onDone,
  onClose,
}: {
  exhibitor: Exhibitor;
  visit: FairVisit;
  fairTitle: string;
  onLead: (leadId: number) => void;
  onDone: (info: { secondDate: string }) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("input");
  const [error, setError] = useState("");
  const [talk, setTalk] = useState(stripMeta(visit.note));
  const [to, setTo] = useState(r.email || "");
  const [name, setName] = useState(r.imprint_name || "");
  const [date2, setDate2] = useState(nextMonday());
  const [l1, setL1] = useState({ subject: "", body: "" });
  const [l2, setL2] = useState({ subject: "", body: "" });
  const [signature, setSignature] = useState("");
  const [leadId, setLeadId] = useState<number | null>(visit.lead_id);
  const [result, setResult] = useState("");

  async function ensureLead(): Promise<number> {
    if (leadId) return leadId;
    const res = await fetch("/api/crm/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_name: r.name,
        business_type: "other",
        stage: "warm_followup",
        address: r.city && r.city !== "Не подтверждено" ? r.city : "",
        contact_name: name,
        contact_email: to,
        next_action: `Письмо 2 уйдёт ${fmt(date2)}; после него — звонок`,
        reminder_date: date2,
        reminder_text: `${r.name}: письмо 2 ушло сегодня — проверить ответ, позвонить`,
        notes: [`${fairTitle} · Stand ${r.booth} (${r.floor}) · ${r.city}`, `Предложение: ${r.offer}`, r.website ? `Сайт: ${r.website}` : ""].filter(Boolean).join("\n"),
        summary: `Разговор на стенде ${r.booth} ${fairTitle}. ${talk}`.trim(),
        kind: "visit",
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
    setLeadId(json.lead_id);
    onLead(json.lead_id);
    return json.lead_id as number;
  }

  async function draft() {
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) { setError("Нужен email — спроси на стенде или сфотографируй визитку."); return; }
    setStep("drafting");
    try {
      await ensureLead();
      const res = await fetch("/api/crm/messe/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fair_title: fairTitle, booth: r.booth, exhibitor: r.name, city: r.city, offer: r.offer, opening_de: r.opening_de,
          contact_name: name, talk, second_date: date2,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setL1({ subject: json.letter1_subject, body: json.letter1_body });
      setL2({ subject: json.letter2_subject, body: json.letter2_body });
      setSignature(json.signature || "");
      setStep("review");
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setStep("input");
    }
  }

  async function sendBoth() {
    if (!leadId) return;
    setError("");
    setStep("sending");
    try {
      const send = (subject: string, body: string, send_at: string) =>
        fetch("/api/crm/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead_id: leadId, to, subject, body, lang: "de", send_at }),
        }).then(async (res) => { const j = await res.json(); if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`); return j; });
      await send(l1.subject, l1.body, "");
      const second = await send(l2.subject, l2.body, date2);
      setResult(`Письмо 1 ушло на ${to}. Письмо 2 запланировано: ${second.when || fmt(date2)}.`);
      onDone({ secondDate: date2 });
      setStep("done");
    } catch (e) {
      setError(`${e instanceof Error ? e.message : e}. Если письмо 1 уже ушло — отправь второе через «✉️ Письмо» с датой.`);
      setStep("review");
    }
  }

  return (
    <div className="m-flow">
      <div className="m-steps">
        <b>{step === "input" ? "1 Разговор" : "1 ✓"}</b><i>›</i>
        <b style={{ color: step === "input" || step === "drafting" ? "#b4bfc8" : undefined }}>{step === "done" ? "2 ✓ Ушло" : "2 Два письма"}</b>
        <span style={{ flex: 1 }} />
        <button className="ghost" onClick={onClose}>закрыть</button>
      </div>
      {error && <div className="m-err">{error}</div>}

      {(step === "input" || step === "drafting") && (
        <>
          <div className="field">
            <span className="m-label">О чём говорили (коротко, по-русски — пойдёт в оба письма)</span>
            <textarea value={talk} onChange={(e) => setTalk(e.target.value)} placeholder="Напр.: хочет видео-ролики про ракетки, сайт не продаёт комплекты, решает сам" />
          </div>
          <div className="row">
            <div className="field"><span className="m-label">Имя (для обращения)</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Christoph Maier" /></div>
            <div className="field"><span className="m-label">Email</span><input type="email" value={to} onChange={(e) => setTo(e.target.value)} /></div>
          </div>
          <div className="m-when">
            <span className="m-label">Письмо 2 с идеями уйдёт</span>
            <div className="m-when-row">
              <button className={date2 === nextWeekday(1) ? "on" : ""} onClick={() => setDate2(nextWeekday(1))}>Пн {fmt(nextWeekday(1))}</button>
              <button className={date2 === nextWeekday(2) ? "on" : ""} onClick={() => setDate2(nextWeekday(2))}>Вт {fmt(nextWeekday(2))}</button>
              <button className={date2 === addDays(7) ? "on" : ""} onClick={() => setDate2(addDays(7))}>+7 дней</button>
              <input type="date" value={date2} min={addDays(1)} onChange={(e) => e.target.value && setDate2(e.target.value)} />
            </div>
          </div>
          <div className="m-actions">
            <button className="pink" disabled={step === "drafting"} onClick={() => void draft()}>
              {step === "drafting" ? "Пишу оба письма…" : "Составить два письма"}
            </button>
          </div>
        </>
      )}

      {(step === "review" || step === "sending") && (
        <>
          <div className="m-letter">
            <div className="m-letter-head">Письмо 1 — <b>уйдёт сейчас</b> на {to}</div>
            <input value={l1.subject} onChange={(e) => setL1({ ...l1, subject: e.target.value })} />
            <textarea style={{ minHeight: 120 }} value={l1.body} onChange={(e) => setL1({ ...l1, body: e.target.value })} />
          </div>
          <div className="m-letter">
            <div className="m-letter-head">Письмо 2 — <b>уйдёт {fmt(date2)} в 09:00</b></div>
            <input value={l2.subject} onChange={(e) => setL2({ ...l2, subject: e.target.value })} />
            <textarea style={{ minHeight: 200 }} value={l2.body} onChange={(e) => setL2({ ...l2, body: e.target.value })} />
          </div>
          <div className="m-sig">{signature}</div>
          <div className="m-actions">
            <button onClick={() => setStep("input")} disabled={step === "sending"}>← Поправить вводные</button>
            <button className="pink" disabled={step === "sending" || !l1.subject || !l1.body || !l2.subject || !l2.body} onClick={() => void sendBoth()}>
              {step === "sending" ? "Отправляю…" : `Отправить 1 сейчас + 2 на ${fmt(date2)}`}
            </button>
          </div>
        </>
      )}

      {step === "done" && (
        <div className="m-ok">
          {result} Лид #{leadId}: в день второго письма придёт напоминание проверить ответ.
          <div style={{ marginTop: 6 }}><a href={`/crm/lead/${leadId}`}>Открыть лид</a> · <button className="ghost" onClick={onClose}>закрыть</button></div>
        </div>
      )}
    </div>
  );
}

const vienna = (d: Date) => d.toLocaleDateString("sv-SE", { timeZone: "Europe/Vienna" });
function addDays(n: number) { const d = new Date(); d.setDate(d.getDate() + n); return vienna(d); }
/** Ближайший будущий день недели (1 = пн … 5 = пт). */
function nextWeekday(wd: number) { const d = new Date(); const diff = ((((wd - d.getDay()) % 7) + 7) % 7) || 7; d.setDate(d.getDate() + diff); return vienna(d); }
function nextMonday() { return nextWeekday(1); }
function fmt(iso: string) { const [y, m, d] = iso.split("-"); return y && m && d ? `${d}.${m}` : iso; }
/** Из заметки на карточке убираем служебные строки («→ … · дата», «Контакт: …»), оставляем суть разговора. */
function stripMeta(note: string) {
  return (note || "").split("\n").filter((l) => !/^(→|Контакт:|✉️)/.test(l.trim())).join("\n").trim();
}
