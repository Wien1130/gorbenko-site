"use client";

import { useRef, useState } from "react";
import type { Exhibitor, FairVisit } from "../../../lib/crm/messe/data";
import type { VisitProposal } from "../../../lib/crm/types";

/**
 * 🎤 прямо на карточке стенда: наговорил по-русски → Whisper → Claude →
 * заметка на карточке + лид в CRM (новый или дозапись в существующий) + напоминание на названную дату.
 */
export default function VoiceNote({
  exhibitor: r,
  visit,
  fairTitle,
  onDone,
}: {
  exhibitor: Exhibitor;
  visit: FairVisit;
  fairTitle: string;
  onDone: (res: { note: string; leadId: number; reminderDate: string; summary: string }) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const [last, setLast] = useState("");
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function toggle() {
    if (recording) {
      recRef.current?.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mime || "audio/webm" });
        if (blob.size > 0) void process(blob, mime);
      };
      rec.start();
      recRef.current = rec;
      setSeconds(0);
      setRecording(true);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError("Нет доступа к микрофону — разреши его для gorbenko.at в настройках Safari.");
    }
  }

  async function process(blob: Blob, mime: string) {
    setBusy(true);
    setError("");
    try {
      const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Vienna" });
      const fd = new FormData();
      fd.append("audio", new File([blob], mime === "audio/mp4" ? "talk.m4a" : "talk.webm", { type: blob.type }));
      fd.append(
        "text",
        `${fairTitle}, MAK Wien, Stand ${r.booth} (${r.floor}). Участник: ${r.name}, ${r.city}, ${r.category}. Название бизнеса: «${r.name}» (не менять). Андрей надиктовал по-русски итог разговора на стенде: вытащи имя/должность собеседника, email/телефон если названы, что обсудили (summary 1–2 фразы), следующий шаг (next_action) и ДАТУ, когда он просил написать/позвонить (reminder_date, YYYY-MM-DD). Календарь: сегодня ${today} (${weekday(today)}), завтра ${addDays(1)}, ближайший понедельник ${nextMonday()}, через неделю ${addDays(7)}. «На следующей неделе» = ближайший понедельник ${nextMonday()}.`,
      );
      fd.append("outcome", "warm_followup");
      if (visit.lead_id) fd.append("lead_id", String(visit.lead_id));
      const cap = await fetch("/api/crm/capture", { method: "POST", body: fd });
      const cj = await cap.json();
      if (!cap.ok) throw new Error(cj.error || `HTTP ${cap.status}`);
      const p = cj.proposal as VisitProposal;
      const transcript: string = (cj.transcript || "").trim();

      const reminderDate = p.reminder_date && p.reminder_date > today ? p.reminder_date : nextWorkday();
      const notes = [
        `${fairTitle} · Stand ${r.booth} (${r.floor}) · ${r.city}`,
        `Предложение: ${r.offer}`,
        r.imprint_name ? `Владелец по импрессуму: ${r.imprint_name}` : "",
        r.website ? `Сайт: ${r.website}` : "",
      ].filter(Boolean).join("\n");
      const summary = [`Разговор на стенде ${r.booth} ${fairTitle}.`, p.summary || ""].filter(Boolean).join(" ");

      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matched_lead_id: visit.lead_id ?? null,
          business_name: r.name,
          business_type: "other",
          stage: "warm_followup",
          address: r.city && r.city !== "Не подтверждено" ? r.city : "",
          contact_name: p.contact_name || r.imprint_name || "",
          contact_email: p.contact_email || r.email || "",
          contact_phone: p.contact_phone || "",
          next_action: p.next_action || "Написать после выставки",
          reminder_date: reminderDate,
          reminder_text: `${r.name}: ${p.next_action || "follow-up после BLICKFANG"}`,
          notes,
          summary,
          transcript,
          kind: "visit",
        }),
      });
      const lj = await res.json();
      if (!res.ok) throw new Error(lj.error || `HTTP ${res.status}`);

      const line = [
        transcript || p.summary,
        p.contact_name ? `Контакт: ${p.contact_name}${p.contact_phone ? ` ${p.contact_phone}` : ""}${p.contact_email ? ` ${p.contact_email}` : ""}` : "",
        `→ ${p.next_action || "написать"} · ${fmt(reminderDate)}`,
      ].filter(Boolean).join("\n");
      setLast(`Записал. Лид #${lj.lead_id}, напоминание ${fmt(reminderDate)}.`);
      onDone({ note: line, leadId: lj.lead_id, reminderDate, summary: p.summary || "" });
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="m-voice">
      <button className={`m-mic ${recording ? "rec" : ""}`} onClick={() => void toggle()} disabled={busy}>
        {busy ? "Слушаю и записываю в CRM…" : recording ? `■ Стоп · ${seconds}s` : "🎤 Надиктовать разговор"}
      </button>
      {!recording && !busy && !last && !error && (
        <div className="m-hint">С кем говорил, что обсудили, когда написать. Заметка, лид и напоминание — сами.</div>
      )}
      {last && <div className="m-hint" style={{ color: "var(--green)" }}>{last}</div>}
      {error && <div className="m-err">{error}</div>}
    </div>
  );
}

function fmt(iso: string) { const [y, m, d] = iso.split("-"); return y && m && d ? `${d}.${m}` : iso; }
const vienna = (d: Date) => d.toLocaleDateString("sv-SE", { timeZone: "Europe/Vienna" });
function addDays(n: number) { const d = new Date(); d.setDate(d.getDate() + n); return vienna(d); }
function nextMonday() { const d = new Date(); d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)); return vienna(d); }
function weekday(iso: string) { return new Date(`${iso}T12:00:00`).toLocaleDateString("ru-RU", { weekday: "long" }); }
function nextWorkday(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("sv-SE", { timeZone: "Europe/Vienna" });
}
