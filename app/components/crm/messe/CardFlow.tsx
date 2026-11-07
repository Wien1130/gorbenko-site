"use client";

import { useEffect, useRef, useState } from "react";
import type { Exhibitor, FairVisit } from "../../../lib/crm/messe/data";
import type { VisitProposal } from "../../../lib/crm/types";

type Step = "photo" | "reading" | "confirm" | "saving" | "drafting" | "email" | "sending" | "sent";

/**
 * «Визитка → лид → письмо» прямо на карточке участника.
 * 1) фото визитки → /api/crm/capture (Claude vision вытаскивает имя/email/телефон)
 * 2) проверка полей → /api/crm/leads (лид в общей CRM с контекстом выставки)
 * 3) черновик → /api/crm/email, отправка → /api/crm/email/send (Gmail Андрея)
 */
export default function CardFlow({
  exhibitor: r,
  visit,
  fairTitle,
  onLead,
  onEmailSent,
  onClose,
}: {
  exhibitor: Exhibitor;
  visit: FairVisit;
  fairTitle: string;
  onLead: (leadId: number) => void;
  onEmailSent: () => void;
  onClose: () => void;
}) {
  const hasLead = !!visit.lead_id;
  const [step, setStep] = useState<Step>(hasLead ? "drafting" : "photo");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [leadId, setLeadId] = useState<number | null>(visit.lead_id);
  const [contact, setContact] = useState({ name: "", email: r.email || "", phone: "" });
  const [summary, setSummary] = useState("");
  const [talk, setTalk] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [signature, setSignature] = useState("");
  const [to, setTo] = useState(r.email || "");
  const [instruction, setInstruction] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const draftedFor = useRef<number | null>(null);

  const context = `${fairTitle}, MAK Wien, Stand ${r.booth} (${r.floor}). Участник: ${r.name}, ${r.city}, ${r.category}. Разговор на стенде выставки.`;

  async function onFile(file: File) {
    setError("");
    setPreview(URL.createObjectURL(file));
    setStep("reading");
    try {
      const fd = new FormData();
      fd.append("photo", file);
      fd.append("text", `${context} Это визитка. Вытащи имя, email, телефон. Название бизнеса: «${r.name}».`);
      fd.append("outcome", "warm_followup");
      const res = await fetch("/api/crm/capture", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      const p = json.proposal as VisitProposal;
      setContact({ name: p.contact_name || "", email: p.contact_email || r.email || "", phone: p.contact_phone || "" });
      setSummary(p.summary || "");
      setPhotoUrl(json.photo_url ?? "");
      setStep("confirm");
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setStep("photo");
    }
  }

  async function saveLead() {
    setError("");
    setStep("saving");
    try {
      const notes = [
        `${fairTitle} · Stand ${r.booth} (${r.floor}) · ${r.city}`,
        `Предложение: ${r.offer}`,
        r.opening_de ? `Erste Frage: ${r.opening_de}` : "",
        r.website ? `Сайт: ${r.website}` : "",
      ].filter(Boolean).join("\n");
      const fullSummary = [`Разговор на стенде ${r.booth} ${fairTitle}.`, talk.trim(), summary.trim()].filter(Boolean).join(" ");
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: r.name,
          business_type: "other",
          stage: "warm_followup",
          address: r.city && r.city !== "Не подтверждено" ? r.city : "",
          contact_name: contact.name,
          contact_email: contact.email,
          contact_phone: contact.phone,
          next_action: "Отправить 2 конкретные идеи, предложить 15-минутный разговор",
          reminder_date: nextWorkday(),
          reminder_text: `Follow-up после BLICKFANG: ${r.name}`,
          notes,
          summary: fullSummary,
          transcript: talk.trim(),
          photo_url: photoUrl,
          kind: "visit",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setLeadId(json.lead_id);
      setTo(contact.email);
      onLead(json.lead_id);
      setStep("drafting");
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setStep("confirm");
    }
  }

  async function draft(revise: boolean) {
    if (!leadId) return;
    setError("");
    setStep("drafting");
    try {
      const base = `Разговор был СЕГОДНЯ на стенде ${r.booth} выставки ${fairTitle} im MAK — не визит в заведение; первое предложение — отсылка к стенду/продукту. Продукт/бренд: ${r.name}. Идея, которую обсуждали: ${r.offer} ${talk.trim() ? `Что сказал собеседник: ${talk.trim()}.` : ""} Предложи прислать 2 конкретные идеи и короткий 15-минутный разговор на следующей неделе. Не оценивать их сайт негативно.`;
      const res = await fetch("/api/crm/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: leadId,
          lang: "de",
          instruction: revise && instruction ? `${base} Инструкция: ${instruction}` : base,
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
      setStep("email");
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setStep(subject ? "email" : "confirm");
    }
  }

  async function send() {
    if (!leadId) return;
    setError("");
    setStep("sending");
    try {
      const res = await fetch("/api/crm/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, to, subject, body, lang: "de" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      onEmailSent();
      setStep("sent");
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setStep("email");
    }
  }

  // Если лид уже есть — сразу черновик письма
  useEffect(() => {
    if (step === "drafting" && leadId && draftedFor.current !== leadId) {
      draftedFor.current = leadId;
      void draft(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, leadId]);

  const stepIdx = ["photo", "reading", "confirm", "saving", "drafting", "email", "sending", "sent"].indexOf(step);

  return (
    <div className="m-flow">
      <div className="m-steps">
        <b>{stepIdx <= 1 ? "1 Визитка" : "1 ✓"}</b><i>›</i>
        <b style={{ color: stepIdx >= 2 ? undefined : "#b4bfc8" }}>{stepIdx <= 3 ? "2 Лид" : "2 ✓"}</b><i>›</i>
        <b style={{ color: stepIdx >= 4 ? undefined : "#b4bfc8" }}>{step === "sent" ? "3 ✓ Отправлено" : "3 Письмо"}</b>
        <span style={{ flex: 1 }} />
        <button className="ghost" onClick={onClose}>закрыть</button>
      </div>

      {error && <div className="m-err">{error}</div>}

      {step === "photo" && (
        <>
          <label className="m-filelabel">
            📷 Сфотографировать визитку
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={(e) => e.target.files?.[0] && void onFile(e.target.files[0])} />
          </label>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <button className="ghost" onClick={() => setStep("confirm")}>Без визитки — ввести контакт вручную</button>
          </div>
        </>
      )}

      {step === "reading" && (
        <>
          {preview && <img src={preview} alt="" className="m-thumb" />}
          <div className="m-busy">Читаю визитку…</div>
        </>
      )}

      {(step === "confirm" || step === "saving") && (
        <>
          {preview && <img src={preview} alt="" className="m-thumb" />}
          <div className="row">
            <div className="field"><span className="m-label">Имя</span><input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} /></div>
            <div className="field"><span className="m-label">Телефон</span><input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></div>
          </div>
          <div className="field"><span className="m-label">Email</span><input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></div>
          <div className="field">
            <span className="m-label">Что обсудили (1–2 фразы, пойдёт в письмо)</span>
            <textarea value={talk} onChange={(e) => setTalk(e.target.value)} placeholder="Напр.: интересует видео монтажа, решает Frau X, написать в понедельник" />
          </div>
          <div className="m-actions">
            {!preview && <button onClick={() => setStep("photo")}>📷 Визитка</button>}
            <button className="pink" disabled={step === "saving"} onClick={() => void saveLead()}>
              {step === "saving" ? "Сохраняю…" : "Сохранить лид → письмо"}
            </button>
          </div>
        </>
      )}

      {step === "drafting" && <div className="m-busy">Пишу письмо по-немецки…</div>}

      {(step === "email" || step === "sending") && (
        <>
          <div className="field"><span className="m-label">Кому</span><input type="email" value={to} onChange={(e) => setTo(e.target.value)} /></div>
          <div className="field"><span className="m-label">Тема</span><input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
          <div className="field">
            <span className="m-label">Текст</span>
            <textarea style={{ minHeight: 180 }} value={body} onChange={(e) => setBody(e.target.value)} />
            <div className="m-sig">{signature}</div>
          </div>
          <div className="field">
            <input placeholder="Переписать: напр. «короче», «упомяни видео монтажа»" value={instruction} onChange={(e) => setInstruction(e.target.value)} />
          </div>
          <div className="m-actions">
            <button onClick={() => void draft(true)} disabled={step === "sending"}>↻ Переписать</button>
            <button className="pink" disabled={step === "sending" || !to || !subject || !body} onClick={() => void send()}>
              {step === "sending" ? "Отправляю…" : "Отправить"}
            </button>
          </div>
          <div style={{ marginTop: 8, fontSize: 13, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {leadId && <a href={`/crm/lead/${leadId}`}>Открыть лид #{leadId}</a>}
            <a
              href={`mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}\n\n${signature}`)}`}
              onClick={() => onEmailSent()}
              title="Если Gmail-отправка не сработала — открыть в почте телефона"
            >
              Открыть в почте телефона
            </a>
          </div>
        </>
      )}

      {step === "sent" && (
        <div className="m-ok">
          Письмо ушло на {to}. Лид #{leadId} в CRM, напоминание на {nextWorkday()}.
          <div style={{ marginTop: 6 }}><a href={`/crm/lead/${leadId}`}>Открыть лид</a> · <button className="ghost" onClick={onClose}>закрыть</button></div>
        </div>
      )}
    </div>
  );
}

/** Ближайший рабочий день по Вене (пн–пт) — для напоминания. */
function nextWorkday(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("sv-SE", { timeZone: "Europe/Vienna" });
}
