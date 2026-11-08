"use client";

import { useState } from "react";
import type { Exhibitor, FairVisit } from "../../../lib/crm/messe/data";
import { toast } from "./toast";

type Step = "input" | "drafting" | "review" | "sending" | "done";

/**
 * «Два письма» прямо на стенде:
 *   №1 — «мы только что говорили у вашего стенда» — уходит сразу;
 *   №2 — черновик «нужно обдумать». Само не уходит. На дату его ставит отдельная кнопка.
 */
export default function TwoLetters({
  exhibitor: r,
  visit,
  fairTitle,
  venue,
  talkDateLabel,
  onLead,
  onDone,
  onClose,
}: {
  exhibitor: Exhibitor;
  visit: FairVisit;
  fairTitle: string;
  venue: string;
  talkDateLabel: string;
  onLead: (leadId: number) => void;
  onDone: (info: { mode: "held" | "scheduled"; secondDate?: string }) => void;
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
  const [letter1Sent, setLetter1Sent] = useState(false);
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
    toast("busy", "Пишу оба письма по-немецки… ~10 секунд");
    try {
      await ensureLead();
      const res = await fetch("/api/crm/messe/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fair_title: fairTitle, venue, talk_date: talkDateLabel,
          booth: r.booth, exhibitor: r.name, city: r.city, offer: r.offer, opening_de: r.opening_de,
          contact_name: name, talk, second_date: date2,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setL1({ subject: json.letter1_subject, body: json.letter1_body });
      setL2({ subject: json.letter2_subject, body: json.letter2_body });
      setSignature(json.signature || "");
      toast("ok", "Оба письма готовы — проверь и отправь");
      setStep("review");
    } catch (e) {
      const msg = String(e instanceof Error ? e.message : e);
      setError(msg);
      toast("err", `Не получилось составить: ${msg}`);
      setStep("input");
    }
  }

  async function postMail(subject: string, body: string, sendAt: string, hold: boolean) {
    const res = await fetch("/api/crm/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead_id: leadId, to, subject, body, lang: "de", send_at: hold ? "" : sendAt, hold }),
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`);
    return j as { ok?: boolean; duplicate?: boolean; when?: string; held?: boolean; gmail_id?: string };
  }

  async function sendFirstAndHoldSecond() {
    if (!leadId) return;
    setError("");
    setStep("sending");
    try {
      if (!letter1Sent) {
        toast("busy", `Отправляю письмо 1 на ${to}…`);
        const first = await postMail(l1.subject, l1.body, "", false);
        setLetter1Sent(true);
        if (first.duplicate) toast("ok", "Письмо 1 уже было отправлено — повторно не шлю");
      }
      toast("busy", "Сохраняю письмо 2 на проверку…");
      await postMail(l2.subject, l2.body, "", true);
      setResult(`Письмо 1 ушло на ${to}. Письмо 2 лежит как «нужно обдумать» и само не уйдёт.`);
      toast("ok", "Письмо 1 ушло. Письмо 2 ждёт твоего решения");
      onDone({ mode: "held" });
      setStep("done");
    } catch (e) {
      const msg = String(e instanceof Error ? e.message : e);
      setError(letter1Sent ? `${msg}. Письмо 1 уже ушло, повторно его не отправляю.` : msg);
      toast("err", `НЕ ушло: ${msg}`);
      setStep("review");
    }
  }

  async function scheduleSecond() {
    if (!leadId) return;
    if (!window.confirm(`Запланировать письмо 2 на ${fmt(date2)} в 09:00 по Вене? Это отдельное решение, само оно не уйдёт.`)) return;
    setError("");
    setStep("sending");
    try {
      const second = await postMail(l2.subject, l2.body, date2, false);
      setResult(`Письмо 2 запланировано: ${second.when || fmt(date2)}.`);
      toast("ok", `Письмо 2 запланировано на ${second.when || fmt(date2)}`);
      onDone({ mode: "scheduled", secondDate: date2 });
      setStep("done");
    } catch (e) {
      const msg = String(e instanceof Error ? e.message : e);
      setError(msg);
      toast("err", `Не запланировалось: ${msg}`);
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
            <span className="m-label">Ориентир для письма 2 (само не отправится)</span>
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
            <div className="m-letter-head">Письмо 2 — <b>черновик, само не уйдёт</b></div>
            <input value={l2.subject} onChange={(e) => setL2({ ...l2, subject: e.target.value })} />
            <textarea style={{ minHeight: 200 }} value={l2.body} onChange={(e) => setL2({ ...l2, body: e.target.value })} />
          </div>
          <div className="m-sig">{signature}</div>
          <div className="m-actions">
            <button onClick={() => setStep("input")} disabled={step === "sending"}>← Поправить вводные</button>
            <button className="pink" disabled={step === "sending" || !l1.subject || !l1.body || !l2.subject || !l2.body} onClick={() => void sendFirstAndHoldSecond()}>
              {step === "sending" ? "Отправляю…" : letter1Sent ? "Сохранить письмо 2 на проверку" : "Отправить 1 сейчас, 2 сохранить"}
            </button>
            <button disabled={step === "sending" || !l2.subject || !l2.body} onClick={() => void scheduleSecond()}>
              Запланировать 2 на {fmt(date2)}
            </button>
          </div>
          {error && <div className="m-err">{error}</div>}
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
