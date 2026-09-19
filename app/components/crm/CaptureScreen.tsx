"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { STAGE_ORDER, STAGE_LABELS, type Stage } from "../../lib/cold-leads-stats";
import { BUSINESS_TYPE_OPTIONS, type VisitProposal } from "../../lib/crm/types";

const OUTCOMES: { value: string; label: string }[] = [
  { value: "lost", label: "❌ Отказ" },
  { value: "warm_followup", label: "🌤 Тёплый" },
  { value: "meeting_tentative", label: "📅 Встреча" },
  { value: "won", label: "💰 Продажа" },
];

type Phase = "input" | "parsing" | "confirm" | "saving";

export default function CaptureScreen({ leadId, leadName }: { leadId?: number; leadName?: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("input");
  const [error, setError] = useState("");

  // --- ввод ---
  const [outcome, setOutcome] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- подтверждение ---
  const [proposal, setProposal] = useState<VisitProposal | null>(null);
  const [transcript, setTranscript] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  async function toggleRecord() {
    if (recording) {
      recRef.current?.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        setAudioBlob(new Blob(chunksRef.current, { type: mime || "audio/webm" }));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recRef.current = rec;
      setAudioBlob(null);
      setSeconds(0);
      setRecording(true);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError("Нет доступа к микрофону. Разреши микрофон для gorbenko.at в настройках.");
    }
  }

  function onPhoto(f: File | null) {
    setPhoto(f);
    setPhotoPreview(f ? URL.createObjectURL(f) : "");
  }

  async function submit() {
    if (recording) { toggleRecord(); setTimeout(submit, 400); return; }
    if (!outcome && !audioBlob && !photo && !text.trim()) {
      setError("Нажми исход, наговори, сфоткай или напиши хоть что-то.");
      return;
    }
    setError("");
    setPhase("parsing");
    try {
      const fd = new FormData();
      if (audioBlob) {
        const ext = audioBlob.type.includes("mp4") ? "m4a" : "webm";
        fd.append("audio", new File([audioBlob], `visit.${ext}`, { type: audioBlob.type }));
      }
      if (photo) fd.append("photo", photo);
      if (text.trim()) fd.append("text", text.trim());
      if (outcome) fd.append("outcome", outcome);
      if (leadId) fd.append("lead_id", String(leadId));

      const res = await fetch("/api/crm/capture", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setProposal(json.proposal);
      setTranscript(json.transcript ?? "");
      setPhotoUrl(json.photo_url ?? "");
      setPhase("confirm");
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setPhase("input");
    }
  }

  function upd<K extends keyof VisitProposal>(key: K, value: VisitProposal[K]) {
    setProposal((p) => (p ? { ...p, [key]: value } : p));
  }

  async function save() {
    if (!proposal) return;
    setPhase("saving");
    setError("");
    try {
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...proposal,
          transcript,
          photo_url: photoUrl,
          kind: "visit",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      router.push(`/crm/lead/${json.lead_id}`);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setPhase("confirm");
    }
  }

  // ---------- Экран подтверждения ----------
  if ((phase === "confirm" || phase === "saving") && proposal) {
    return (
      <div className="crm-wrap">
        <div className="crm-top">
          <div className="crm-title">Проверь карточку</div>
          <a href="/crm" className="crm-mini-btn" style={{ textDecoration: "none" }}>✕</a>
        </div>

        {proposal.matched_lead_id ? (
          <div className="crm-banner">
            ✉️ Follow-up по существующему лиду #{proposal.matched_lead_id}.{" "}
            <button className="crm-mini-btn" onClick={() => upd("matched_lead_id", null)}>Нет, это новый бизнес</button>
          </div>
        ) : (
          <div className="crm-banner">🆕 Новый лид (холодное касание)</div>
        )}

        <div className="crm-field">
          <label>Название бизнеса</label>
          <input className="crm-input" value={proposal.business_name} onChange={(e) => upd("business_name", e.target.value)} />
        </div>
        <div className="crm-2col">
          <div className="crm-field">
            <label>Тип</label>
            <select className="crm-select" value={proposal.business_type} onChange={(e) => upd("business_type", e.target.value as VisitProposal["business_type"])}>
              {BUSINESS_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="crm-field">
            <label>Стадия</label>
            <select className="crm-select" value={proposal.stage} onChange={(e) => upd("stage", e.target.value as Stage)}>
              {STAGE_ORDER.map((s) => <option key={s} value={s}>{STAGE_LABELS[s as Stage]}</option>)}
            </select>
          </div>
        </div>
        <div className="crm-field">
          <label>Контакт (имя)</label>
          <input className="crm-input" value={proposal.contact_name} onChange={(e) => upd("contact_name", e.target.value)} />
        </div>
        <div className="crm-2col">
          <div className="crm-field">
            <label>Email</label>
            <input className="crm-input" type="email" value={proposal.contact_email} onChange={(e) => upd("contact_email", e.target.value)} />
          </div>
          <div className="crm-field">
            <label>Телефон</label>
            <input className="crm-input" value={proposal.contact_phone} onChange={(e) => upd("contact_phone", e.target.value)} />
          </div>
        </div>
        <div className="crm-field">
          <label>Адрес</label>
          <input className="crm-input" value={proposal.address} onChange={(e) => upd("address", e.target.value)} />
        </div>
        <div className="crm-field">
          <label>Что произошло (summary)</label>
          <textarea className="crm-textarea" value={proposal.summary} onChange={(e) => upd("summary", e.target.value)} />
        </div>
        <div className="crm-field">
          <label>Следующий шаг</label>
          <input className="crm-input" value={proposal.next_action} onChange={(e) => upd("next_action", e.target.value)} />
        </div>
        <div className="crm-2col">
          <div className="crm-field">
            <label>Напомнить (дата)</label>
            <input className="crm-input" type="date" value={proposal.reminder_date} onChange={(e) => upd("reminder_date", e.target.value)} />
          </div>
          <div className="crm-field">
            <label>Сумма, €</label>
            <input className="crm-input" type="number" value={proposal.deal_amount || ""} onChange={(e) => upd("deal_amount", Number(e.target.value) || 0)} />
          </div>
        </div>
        {proposal.stage === "meeting_confirmed" && (
          <div className="crm-field">
            <label>Встреча (строго ГГГГ-ММ-ДД ЧЧ:ММ — уйдёт в календарь)</label>
            <input className="crm-input" value={proposal.meeting_datetime} onChange={(e) => upd("meeting_datetime", e.target.value)} />
          </div>
        )}

        {transcript && <div className="crm-sub" style={{ margin: "8px 0" }}>🎙 «{transcript.slice(0, 220)}{transcript.length > 220 ? "…" : ""}»</div>}
        {error && <div className="crm-error">{error}</div>}

        <button className="crm-go red" onClick={save} disabled={phase === "saving" || !proposal.business_name.trim()}>
          {phase === "saving" ? "Сохраняю…" : "✓ Сохранить"}
        </button>
        <button className="crm-go" style={{ background: "#161616", color: "#bbb", marginTop: 8 }} onClick={() => setPhase("input")}>
          ← Назад к вводу
        </button>
      </div>
    );
  }

  // ---------- Экран ввода ----------
  return (
    <div className="crm-wrap">
      <div className="crm-top">
        <div className="crm-title">{leadName ? `➕ По лиду: ${leadName}` : "➕ Новый заход"}</div>
        <a href={leadId ? `/crm/lead/${leadId}` : "/crm"} className="crm-mini-btn" style={{ textDecoration: "none" }}>✕</a>
      </div>

      <div className="crm-outcomes">
        {OUTCOMES.map((o) => (
          <button
            key={o.value}
            className={`crm-outcome ${outcome === o.value ? "on" : ""}`}
            onClick={() => setOutcome(outcome === o.value ? "" : o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="crm-inputs">
        <div className="crm-rec">
          <button className={`crm-rec-btn ${recording ? "recording" : ""}`} onClick={toggleRecord}>
            {recording ? `⏺ Пишу… ${seconds}с — тапни чтобы остановить` : audioBlob ? "🎙 Записано ✓ — тапни перезаписать" : "🎙 Наговорить что произошло"}
          </button>
        </div>

        <div className="crm-photo-row">
          <label className="crm-photo-label">
            📷 {photo ? "Фото ✓ — заменить" : "Фото визитки / вывески"}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={(e) => onPhoto(e.target.files?.[0] ?? null)}
            />
          </label>
          {photoPreview && <img src={photoPreview} alt="" className="crm-photo-thumb" />}
        </div>

        <textarea
          className="crm-textarea"
          placeholder="…или напиши текстом (необязательно)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      {error && <div className="crm-error">{error}</div>}

      <button className="crm-go red" onClick={submit} disabled={phase === "parsing"}>
        {phase === "parsing" ? "🧠 Разбираю…" : "Разобрать →"}
      </button>
    </div>
  );
}
