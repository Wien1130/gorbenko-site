"use client";

import { useEffect, useState } from "react";
import { PITCH_FOCUS_OPTIONS, type Lead, type Pitch, type PitchContent, type PitchEvent, type PitchFocus } from "../../lib/crm/types";

type Phase = "loading" | "idle" | "generating" | "preview" | "saving" | "published";

const EVENT_LABEL: Record<string, string> = {
  view: "👁 открыл",
  cta_whatsapp: "💬 нажал WhatsApp",
  cta_call: "📞 нажал «позвонить»",
  cta_site: "🔗 перешёл на сайт",
  form: "📝 заявка с формы",
};

function fmt(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Vienna" });
}

/**
 * Персональная страница лида: сгенерить → проверить → опубликовать → отправить (WhatsApp / копировать).
 * autoStart — сразу генерировать (приход с экрана захода «Сохранить + страница»).
 */
export default function PitchPanel({ lead, autoStart }: { lead: Lead; autoStart?: boolean }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState("");
  const [focus, setFocus] = useState<PitchFocus>("general");
  const [content, setContent] = useState<PitchContent | null>(null);
  const [flags, setFlags] = useState<string[]>([]);
  const [pitch, setPitch] = useState<Pitch | null>(null);
  const [events, setEvents] = useState<PitchEvent[]>([]);
  const [url, setUrl] = useState("");
  const [waText, setWaText] = useState("");
  const [instruction, setInstruction] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/crm/pitch?lead_id=${lead.id}`);
        const json = await res.json();
        if (json.focus) setFocus(json.focus);
        if (json.pitch) {
          setPitch(json.pitch);
          setContent(json.pitch.content);
          setFocus(json.pitch.focus);
          setEvents(json.events ?? []);
          setUrl(json.url ?? "");
          setWaText(json.wa_text ?? "");
          setPhase(json.pitch.status === "published" ? "published" : "preview");
        } else if (autoStart) {
          await generate(json.focus ?? "general", false);
        } else {
          setPhase("idle");
        }
      } catch (e) {
        setError(String(e instanceof Error ? e.message : e));
        setPhase("idle");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead.id]);

  async function generate(f: PitchFocus, revise: boolean) {
    setPhase("generating");
    setError("");
    try {
      const res = await fetch("/api/crm/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: lead.id,
          focus: f,
          instruction: instruction || undefined,
          ...(revise && content ? { prior: content } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setContent(json.content);
      setFlags(json.flags ?? []);
      setInstruction("");
      setPhase("preview");
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setPhase(content ? "preview" : "idle");
    }
  }

  async function publish() {
    if (!content) return;
    setPhase("saving");
    setError("");
    try {
      const res = await fetch("/api/crm/pitch", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: lead.id, focus, content, status: "published" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setPitch(json.pitch);
      setUrl(json.url);
      setWaText(json.wa_text);
      setPhase("published");
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
      setPhase("preview");
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* iOS без https-контекста — покажем ссылку текстом ниже */
    }
  }

  function upd<K extends keyof PitchContent>(key: K, value: PitchContent[K]) {
    setContent((c) => (c ? { ...c, [key]: value } : c));
  }

  const phoneDigits = lead.contact_phone.replace(/[^\d+]/g, "").replace(/^\+/, "").replace(/^00/, "");
  const waToClient = phoneDigits ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(waText)}` : `https://wa.me/?text=${encodeURIComponent(waText)}`;

  if (phase === "loading") return <div className="crm-sub">Загружаю…</div>;

  // ---------- Старт ----------
  if (phase === "idle" || (phase === "generating" && !content)) {
    return (
      <div>
        <div className="crm-sub" style={{ marginBottom: 8 }}>
          Страница на немецком под это заведение: что ты увидел, 2–3 предложения, следующий шаг, кнопки WhatsApp/звонок/форма. Ты видишь, когда клиент открыл.
        </div>
        <div className="crm-row-btns" style={{ marginBottom: 8 }}>
          {PITCH_FOCUS_OPTIONS.map((o) => (
            <button key={o.value} className={`crm-chip ${focus === o.value ? "on" : ""}`} onClick={() => setFocus(o.value)}>{o.label}</button>
          ))}
        </div>
        <input
          className="crm-input"
          style={{ marginBottom: 8 }}
          placeholder="Что подчеркнуть? (необязательно)"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
        />
        {error && <div className="crm-error">{error}</div>}
        <button className="crm-go" onClick={() => generate(focus, false)} disabled={phase === "generating"}>
          {phase === "generating" ? "🧠 Собираю страницу…" : "🪄 Собрать страницу"}
        </button>
      </div>
    );
  }

  // ---------- Опубликовано: ссылка, отправка, статистика ----------
  if (phase === "published" && pitch && content) {
    const views = events.filter((e) => e.kind === "view").length;
    const lastView = events.find((e) => e.kind === "view");
    return (
      <div>
        <div className="crm-ok" style={{ marginBottom: 10 }}>
          ✅ Страница живая: <a href={url} target="_blank" rel="noreferrer" style={{ color: "inherit", wordBreak: "break-all" }}>{url.replace("https://", "")}</a>
        </div>

        <div className="crm-actions" style={{ marginBottom: 12 }}>
          <a href={waToClient} target="_blank" rel="noreferrer" className="crm-action"><b>💬</b>WhatsApp</a>
          <button className="crm-action" onClick={() => copy(url)}><b>{copied ? "✓" : "📋"}</b>{copied ? "Скопировано" : "Ссылка"}</button>
          <a href={url} target="_blank" rel="noreferrer" className="crm-action"><b>👀</b>Открыть</a>
          <button className="crm-action" onClick={() => setPhase("preview")}><b>✏️</b>Править</button>
        </div>

        <div className="crm-lead" style={{ cursor: "default" }}>
          <div className="crm-lead-top">
            <span className="crm-lead-name">{views ? `👁 ${views} ${views === 1 ? "просмотр" : views < 5 ? "просмотра" : "просмотров"}` : "👁 ещё не открывали"}</span>
            {lastView && <span className="crm-sub">последний {fmt(lastView.created_at)}</span>}
          </div>
          {events.filter((e) => e.kind !== "view").slice(0, 8).map((e) => (
            <div key={e.id} className="crm-sub" style={{ marginTop: 6 }}>
              {EVENT_LABEL[e.kind] ?? e.kind} · {fmt(e.created_at)}
              {e.payload?.target ? ` · ${e.payload.target}` : ""}
              {e.kind === "form" && e.payload ? ` · ${e.payload.name || ""} ${e.payload.contact || ""} — ${e.payload.message || ""}` : ""}
            </div>
          ))}
        </div>
        <div className="crm-sub" style={{ marginTop: 8 }}>{content.summary_ru}</div>
        {!lead.contact_phone && <div className="crm-sub" style={{ marginTop: 6 }}>Телефона нет — WhatsApp откроет выбор контакта с готовым текстом.</div>}
      </div>
    );
  }

  // ---------- Превью / правка ----------
  if (!content) return null;
  return (
    <div>
      {flags.length > 0 && (
        <div className="crm-banner">⚖️ Юр-фильтр: {flags.join(", ")}. Замены со стрелкой уже сделаны, остальное поправь руками.</div>
      )}
      <div className="crm-sub" style={{ marginBottom: 8 }}>{content.summary_ru}</div>

      <div className="crm-field"><label>Заголовок (DE)</label>
        <input className="crm-input" value={content.headline} onChange={(e) => upd("headline", e.target.value)} /></div>
      <div className="crm-field"><label>Подзаголовок</label>
        <textarea className="crm-textarea" style={{ minHeight: 70 }} value={content.subline} onChange={(e) => upd("subline", e.target.value)} /></div>
      <div className="crm-field"><label>Что заметил (по строке)</label>
        <textarea className="crm-textarea" style={{ minHeight: 70 }} value={content.observed.join("\n")} onChange={(e) => upd("observed", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} /></div>
      {content.proposals.map((p, i) => (
        <div className="crm-field" key={i}><label>Предложение {i + 1}</label>
          <input className="crm-input" style={{ marginBottom: 6 }} value={p.title} onChange={(e) => upd("proposals", content.proposals.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
          <textarea className="crm-textarea" style={{ minHeight: 70 }} value={p.text} onChange={(e) => upd("proposals", content.proposals.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} /></div>
      ))}
      <div className="crm-field"><label>Почему я</label>
        <textarea className="crm-textarea" style={{ minHeight: 70 }} value={content.why_me} onChange={(e) => upd("why_me", e.target.value)} /></div>
      <div className="crm-field"><label>Следующий шаг</label>
        <input className="crm-input" value={content.next_step} onChange={(e) => upd("next_step", e.target.value)} /></div>
      <div className="crm-field"><label>Текст WhatsApp от клиента</label>
        <input className="crm-input" value={content.whatsapp_text} onChange={(e) => upd("whatsapp_text", e.target.value)} /></div>

      <div className="crm-field">
        <input className="crm-input" placeholder="Правка: «короче», «добавь про Firmenfeiern»…" value={instruction} onChange={(e) => setInstruction(e.target.value)} />
      </div>
      {error && <div className="crm-error">{error}</div>}
      <div className="crm-row-btns">
        <button className="crm-go" onClick={() => generate(focus, true)} disabled={phase !== "preview" || !instruction}>
          {phase === "generating" ? "🧠 Переписываю…" : "🔁 Переписать"}
        </button>
        <button className="crm-go red" onClick={publish} disabled={phase !== "preview"}>
          {phase === "saving" ? "Публикую…" : pitch ? "💾 Обновить страницу" : "🚀 Опубликовать"}
        </button>
      </div>
    </div>
  );
}
