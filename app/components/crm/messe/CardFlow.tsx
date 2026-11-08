"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { Exhibitor, FairVisit } from "../../../lib/crm/messe/data";
import type { VisitProposal } from "../../../lib/crm/types";
import { toast } from "./toast";

type Step = "photo" | "reading" | "confirm" | "saving" | "saved" | "drafting" | "email" | "sending" | "sent";

/** Скриншот с телефона бывает на несколько мегабайт. Ужимаем, текст визитки остаётся читаемым. */
async function shrinkCard(file: File): Promise<File> {
  try {
    const bmp = await createImageBitmap(file);
    const max = 2000;
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bmp.width * scale));
    canvas.height = Math.max(1, Math.round(bmp.height * scale));
    canvas.getContext("2d")?.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    if (blob) return new File([blob], "card.jpg", { type: "image/jpeg" });
  } catch {
    /* отправим как есть */
  }
  return file;
}

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
  venue,
  onLead,
  onEmailSent,
  onClose,
}: {
  exhibitor: Exhibitor;
  visit: FairVisit;
  fairTitle: string;
  venue: string;
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
  const [contact, setContact] = useState({ name: r.imprint_name || "", email: r.email || "", phone: "" });
  const [summary, setSummary] = useState("");
  const [talk, setTalk] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [signature, setSignature] = useState("");
  const [to, setTo] = useState(r.email || "");
  const [instruction, setInstruction] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  /** "" = отправить сейчас, иначе YYYY-MM-DD — cron отправит в 09:00 по Вене. */
  const [sendDate, setSendDate] = useState("");
  const [scheduledWhen, setScheduledWhen] = useState("");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [listening, setListening] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const shotRef = useRef<HTMLInputElement>(null);
  const draftedFor = useRef<number | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const context = `${fairTitle}, ${venue}, Stand ${r.booth} (${r.floor}). Участник: ${r.name}, ${r.city}, ${r.category}. Разговор на стенде выставки.`;

  /** 🎤 Надиктовать по-русски: что обсудили, кто контакт, когда писать. Groq Whisper → Claude → поля. */
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
      const mime = MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mime || "audio/webm" });
        if (blob.size > 0) void onAudio(blob, mime);
      };
      rec.start();
      recRef.current = rec;
      setSeconds(0);
      setRecording(true);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError("Нет доступа к микрофону. Разреши микрофон для gorbenko.at в настройках Safari.");
    }
  }

  async function onAudio(blob: Blob, mime: string) {
    setListening(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("audio", new File([blob], mime === "audio/mp4" ? "talk.m4a" : "talk.webm", { type: blob.type }));
      fd.append(
        "text",
        `${context} Название бизнеса: «${r.name}» (не менять). Андрей надиктовал по-русски итог разговора на стенде: вытащи имя/должность собеседника, email/телефон если названы, что обсудили (summary 1–2 фразы), следующий шаг и ДАТУ, когда он просил написать/позвонить (reminder_date, YYYY-MM-DD). Календарь: сегодня ${today()}, завтра ${addDays(1)}, ближайший понедельник ${nextMonday()}, через неделю ${addDays(7)}. «На следующей неделе» = ${nextMonday()}.`,
      );
      fd.append("outcome", "warm_followup");
      const res = await fetch("/api/crm/capture", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      const p = json.proposal as VisitProposal;
      const transcript: string = json.transcript || "";
      setTalk((prev) => [prev.trim(), transcript.trim()].filter(Boolean).join("\n"));
      if (p.summary) setSummary(p.summary);
      setContact((c) => ({ name: c.name || p.contact_name || "", email: c.email || p.contact_email || r.email || "", phone: c.phone || p.contact_phone || "" }));
      if (p.next_action) setNextAction(p.next_action);
      if (p.reminder_date && p.reminder_date > today()) {
        setReminderDate(p.reminder_date);
      }
      if (step === "photo") setStep("confirm");
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      if (step === "reading") setStep("photo");
    } finally {
      setListening(false);
    }
  }

  function take(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) void onFile(file);
  }

  async function onFile(file: File) {
    setError("");
    const image = await shrinkCard(file);
    setPreview(URL.createObjectURL(image));
    setStep("reading");
    try {
      const fd = new FormData();
      fd.append("photo", image);
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

  async function saveLead(then: "stay" | "email") {
    setError("");
    setStep("saving");
    try {
      const notes = [
        `${fairTitle} · Stand ${r.booth} (${r.floor}) · ${r.city}`,
        `Предложение: ${r.offer}`,
        r.opening_de ? `Erste Frage: ${r.opening_de}` : "",
        r.imprint_name ? `Владелец по импрессуму: ${r.imprint_name}` : "",
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
          next_action: reminderDate ? `Составить и отправить письмо ${fmtDate(reminderDate)}` : (nextAction || "Написать, когда будет повод"),
          reminder_date: reminderDate,
          reminder_text: reminderDate ? `Составить и отправить письмо: ${r.name}, стенд ${r.booth}` : "",
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
      toast("ok", reminderDate ? `Лид #${json.lead_id} сохранён. ${fmtDate(reminderDate)} напомню написать письмо.` : `Лид #${json.lead_id} сохранён, без напоминания.`);
      setStep(then === "email" ? "drafting" : "saved");
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
      const base = `Разговор был СЕГОДНЯ на стенде ${r.booth} выставки ${fairTitle}${venue ? ` (${venue})` : ""} — не визит в заведение; первое предложение — отсылка к стенду/продукту. Продукт/бренд: ${r.name}. ${r.imprint_name ? `Владелец по импрессуму: ${r.imprint_name} — если имя контакта в лиде пустое, обращайся «Sehr geehrte/r Frau/Herr <Nachname>» по этому имени.` : ""} Идея, которую обсуждали: ${r.offer} ${talk.trim() ? `Что сказал собеседник: ${talk.trim()}.` : ""} Не выдумывай разговор. Предложи один следующий шаг и короткий разговор. Не оценивать их сайт негативно.`;
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
    toast("busy", sendDate ? `Планирую письмо на ${fmtDate(sendDate)}…` : `Отправляю письмо на ${to}…`);
    try {
      const res = await fetch("/api/crm/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, to, subject, body, lang: "de", send_at: sendDate || "" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setScheduledWhen(json.scheduled ? json.when || sendDate : "");
      toast("ok", json.scheduled ? `Письмо запланировано на ${json.when || fmtDate(sendDate)}` : `Письмо ушло на ${to}`);
      onEmailSent();
      setStep("sent");
    } catch (e) {
      const msg = String(e instanceof Error ? e.message : e);
      setError(msg);
      toast("err", `Письмо НЕ ушло: ${msg}`);
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
        <b>{step === "saved" || stepIdx > 1 ? "1 ✓" : "1 Визитка"}</b><i>›</i>
        <b style={{ color: step === "saved" || stepIdx >= 2 ? undefined : "#b4bfc8" }}>{step === "saved" || stepIdx > 3 ? "2 ✓" : "2 Лид"}</b><i>›</i>
        <b style={{ color: step === "saved" ? "#b4bfc8" : stepIdx >= 4 ? undefined : "#b4bfc8" }}>{step === "sent" ? "3 ✓ Отправлено" : "3 Письмо"}</b>
        <span style={{ flex: 1 }} />
        <button className="ghost" onClick={onClose}>закрыть</button>
      </div>

      {error && <div className="m-err">{error}</div>}

      {step === "photo" && (
        <>
          <button className={`m-mic ${recording ? "rec" : ""}`} onClick={() => void toggleRecord()} disabled={listening}>
            {listening ? "Слушаю и разбираю…" : recording ? `■ Стоп · ${seconds}s` : "🎤 Надиктовать разговор"}
          </button>
          <div className="m-hint">Скажи по-русски: с кем говорил, что обсудили и когда напомнить тебе написать. Письмо само не отправится.</div>
          <label className="m-filelabel">
            📷 Сфотографировать
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={(e) => take(e)} />
          </label>
          <label className="m-filelabel">
            🖼️ Загрузить скриншот
            <input ref={shotRef} type="file" accept="image/*" onChange={(e) => take(e)} />
          </label>
          <div className="m-hint">Камера или готовая картинка визитки — разберу имя, email и телефон.</div>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <button className="ghost" onClick={() => setStep("confirm")}>Ввести контакт вручную</button>
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
            <span className="m-label">Что обсудили (пойдёт в лид и в письмо)</span>
            <textarea value={talk} onChange={(e) => setTalk(e.target.value)} placeholder="Напр.: интересует видео монтажа, решает Frau X, написать в понедельник" />
          </div>
          {summary && <div className="m-hint"><b>Итог:</b> {summary}{nextAction ? ` · Дальше: ${nextAction}` : ""}</div>}
          <div className="row">
            <div className="field">
              <span className="m-label">Напомнить мне написать</span>
              <input type="date" value={reminderDate} min={today()} onChange={(e) => setReminderDate(e.target.value)} />
            </div>
            <div className="field" style={{ justifyContent: "flex-end" }}>
              <button className={`m-mic small ${recording ? "rec" : ""}`} onClick={() => void toggleRecord()} disabled={listening || step === "saving"}>
                {listening ? "Разбираю…" : recording ? `■ Стоп · ${seconds}s` : "🎤 Надиктовать"}
              </button>
            </div>
          </div>
          <div className="m-hint">
            {reminderDate
              ? `${fmtDate(reminderDate)} утром придёт напоминание в Telegram: составить и отправить письмо. Само оно не уйдёт.`
              : "Дату не ставь — напоминания не будет. Письмо отсюда не отправляется."}
          </div>
          <div className="m-actions">
            {!preview && <button onClick={() => fileRef.current?.click()}>📷 Камера</button>}
            {!preview && <button onClick={() => shotRef.current?.click()}>🖼️ Скриншот</button>}
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={(e) => take(e)} />
            <input ref={shotRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => take(e)} />
            <button disabled={step === "saving" || listening || recording} onClick={() => void saveLead("email")}>
              Сохранить и написать письмо
            </button>
            <button className="pink" disabled={step === "saving" || listening || recording} onClick={() => void saveLead("stay")}>
              {step === "saving" ? "Сохраняю…" : "Сохранить лид"}
            </button>
          </div>
        </>
      )}

      {step === "saved" && (
        <div className="m-ok">
          Лид #{leadId} сохранён.{reminderDate ? ` ${fmtDate(reminderDate)} напомню составить письмо.` : " Напоминание не ставил."}
          <div className="m-actions">
            <button onClick={() => setStep("drafting")}>Написать письмо сейчас</button>
            <button className="pink" onClick={onClose}>Готово</button>
          </div>
        </div>
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
          <div className="m-when">
            <span className="m-label">Когда отправить</span>
            <div className="m-when-row">
              <button className={!sendDate ? "on" : ""} onClick={() => setSendDate("")}>Сейчас</button>
              <button className={sendDate === addDays(1) ? "on" : ""} onClick={() => setSendDate(addDays(1))}>Завтра</button>
              <button className={sendDate === nextMonday() ? "on" : ""} onClick={() => setSendDate(nextMonday())}>Пн</button>
              <input type="date" value={sendDate} min={addDays(1)} onChange={(e) => setSendDate(e.target.value)} />
            </div>
            {sendDate && <div className="m-hint">Уйдёт {fmtDate(sendDate)} в 09:00 по Вене само — думать больше не надо.</div>}
          </div>
          <div className="m-actions">
            <button onClick={() => void draft(true)} disabled={step === "sending"}>↻ Переписать</button>
            <button className="pink" disabled={step === "sending" || !to || !subject || !body} onClick={() => void send()}>
              {step === "sending" ? (sendDate ? "Планирую…" : "Отправляю…") : sendDate ? `Запланировать на ${fmtDate(sendDate)}` : "Отправить сейчас"}
            </button>
          </div>
          {error && <div className="m-err">{error}</div>}
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
          {scheduledWhen ? `Письмо запланировано: уйдёт ${scheduledWhen} на ${to}.` : `Письмо ушло на ${to}.`} Лид #{leadId} в CRM, напоминание на {reminderDate || nextWorkday()}.
          <div style={{ marginTop: 6 }}><a href={`/crm/lead/${leadId}`}>Открыть лид</a> · <button className="ghost" onClick={onClose}>закрыть</button></div>
        </div>
      )}
    </div>
  );
}

const vienna = (d: Date) => d.toLocaleDateString("sv-SE", { timeZone: "Europe/Vienna" });
function today(): string { return vienna(new Date()); }
function addDays(n: number): string { const d = new Date(); d.setDate(d.getDate() + n); return vienna(d); }
function nextMonday(): string {
  const d = new Date();
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  return vienna(d);
}
function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}.${m}` : iso;
}
/** Ближайший рабочий день по Вене (пн–пт) — для напоминания. */
function nextWorkday(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return vienna(d);
}
