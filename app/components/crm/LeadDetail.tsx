"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STAGE_ORDER, STAGE_LABELS, type Stage } from "../../lib/cold-leads-stats";
import { BUSINESS_TYPE_OPTIONS, type Lead, type Activity, type Reminder, type EmailRecord } from "../../lib/crm/types";
import StageBadge from "./StageBadge";
import EmailComposer from "./EmailComposer";

const KIND_ICONS: Record<string, string> = { visit: "🚶", note: "📝", email: "✉️", call: "📞" };

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Vienna",
    });
  } catch {
    return iso;
  }
}

export default function LeadDetail({
  lead: initial,
  activities,
  reminders: initialReminders,
  emails,
}: {
  lead: Lead;
  activities: Activity[];
  reminders: Reminder[];
  emails: EmailRecord[];
}) {
  const router = useRouter();
  const [lead, setLead] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [reminders, setReminders] = useState(initialReminders);
  const [showEmail, setShowEmail] = useState(false);
  const [saved, setSaved] = useState(false);

  async function patch(fields: Partial<Lead>) {
    setLead((l) => ({ ...l, ...fields }));
    await fetch(`/api/crm/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
  }

  async function saveEdits() {
    await patch({
      business_name: lead.business_name,
      business_type: lead.business_type,
      address: lead.address,
      contact_name: lead.contact_name,
      contact_email: lead.contact_email,
      contact_phone: lead.contact_phone,
      next_action: lead.next_action,
      notes: lead.notes,
      deal_amount: lead.deal_amount,
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  async function reminderAction(id: number, action: "done" | "snooze") {
    setReminders((rs) => rs.filter((r) => r.id !== id));
    await fetch(`/api/crm/reminders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action === "done" ? { action } : { action, days: 2 }),
    });
  }

  const mapsUrl = lead.address
    ? `https://www.google.com/maps/search/${encodeURIComponent(lead.address)}`
    : `https://www.google.com/maps/search/${encodeURIComponent(lead.business_name + " Wien")}`;

  return (
    <div className="crm-wrap">
      <div className="crm-top">
        <a href="/crm" className="crm-mini-btn" style={{ textDecoration: "none" }}>← Все лиды</a>
        <StageBadge stage={lead.stage} />
      </div>

      <h1 className="crm-title" style={{ fontSize: "1.4rem", marginBottom: 4 }}>{lead.business_name}</h1>
      <div className="crm-sub">
        {BUSINESS_TYPE_OPTIONS.find((o) => o.value === lead.business_type)?.label ?? lead.business_type}
        {lead.contact_name ? ` · ${lead.contact_name}` : ""}
        {lead.deal_amount > 0 ? ` · ${lead.deal_amount}€` : ""}
      </div>

      {/* Быстрая смена стадии */}
      <div className="crm-filters" style={{ marginTop: 12 }}>
        {STAGE_ORDER.map((s) => (
          <button
            key={s}
            className={`crm-chip ${lead.stage === s ? "on" : ""}`}
            onClick={() => patch({ stage: s as Stage })}
          >
            {STAGE_LABELS[s as Stage]}
          </button>
        ))}
      </div>

      {/* Действия */}
      <div className="crm-actions">
        <a href={`/crm/new?lead=${lead.id}`} className="crm-action"><b>➕</b>Заход</a>
        <button className="crm-action" onClick={() => setShowEmail((v) => !v)}><b>✉️</b>Письмо</button>
        <a href={lead.contact_phone ? `tel:${lead.contact_phone.replace(/[^\d+]/g, "")}` : "#"} className={`crm-action ${lead.contact_phone ? "" : "off"}`}><b>📞</b>Позвонить</a>
        <a href={mapsUrl} target="_blank" rel="noreferrer" className="crm-action"><b>🗺</b>Маршрут</a>
      </div>

      {showEmail && (
        <div style={{ marginBottom: 16 }}>
          <div className="crm-section-title">Письмо в один клик</div>
          <EmailComposer lead={lead} />
        </div>
      )}

      {reminders.length > 0 && (
        <div className="crm-remind">
          <div className="crm-remind-title">⏰ Напоминания</div>
          {reminders.map((r) => (
            <div key={r.id} className="crm-remind-item">
              <span style={{ flex: 1 }}>
                {r.text}
                <small>{fmtDate(r.due_at)}</small>
              </span>
              <button className="crm-mini-btn" onClick={() => reminderAction(r.id, "snooze")}>+2д</button>
              <button className="crm-mini-btn" onClick={() => reminderAction(r.id, "done")}>✓</button>
            </div>
          ))}
        </div>
      )}

      {/* Поля */}
      <div className="crm-section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Данные
        <button className="crm-mini-btn" onClick={() => (editing ? saveEdits() : setEditing(true))}>
          {editing ? "💾 Сохранить" : "✏️ Править"}
        </button>
      </div>
      {saved && <div className="crm-ok">Сохранено ✓</div>}

      {editing ? (
        <>
          <div className="crm-field"><label>Название</label>
            <input className="crm-input" value={lead.business_name} onChange={(e) => setLead({ ...lead, business_name: e.target.value })} /></div>
          <div className="crm-field"><label>Тип</label>
            <select className="crm-select" value={lead.business_type} onChange={(e) => setLead({ ...lead, business_type: e.target.value as Lead["business_type"] })}>
              {BUSINESS_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select></div>
          <div className="crm-field"><label>Контакт</label>
            <input className="crm-input" value={lead.contact_name} onChange={(e) => setLead({ ...lead, contact_name: e.target.value })} /></div>
          <div className="crm-2col">
            <div className="crm-field"><label>Email</label>
              <input className="crm-input" value={lead.contact_email} onChange={(e) => setLead({ ...lead, contact_email: e.target.value })} /></div>
            <div className="crm-field"><label>Телефон</label>
              <input className="crm-input" value={lead.contact_phone} onChange={(e) => setLead({ ...lead, contact_phone: e.target.value })} /></div>
          </div>
          <div className="crm-field"><label>Адрес</label>
            <input className="crm-input" value={lead.address} onChange={(e) => setLead({ ...lead, address: e.target.value })} /></div>
          <div className="crm-field"><label>Следующий шаг</label>
            <input className="crm-input" value={lead.next_action} onChange={(e) => setLead({ ...lead, next_action: e.target.value })} /></div>
          <div className="crm-field"><label>Сумма, €</label>
            <input className="crm-input" type="number" value={lead.deal_amount || ""} onChange={(e) => setLead({ ...lead, deal_amount: Number(e.target.value) || 0 })} /></div>
          <div className="crm-field"><label>Заметки</label>
            <textarea className="crm-textarea" value={lead.notes} onChange={(e) => setLead({ ...lead, notes: e.target.value })} /></div>
        </>
      ) : (
        <div className="crm-lead" style={{ cursor: "default" }}>
          <div className="crm-lead-meta" style={{ flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
            {lead.contact_email && <span>✉️ {lead.contact_email}</span>}
            {lead.contact_phone && <span>📞 {lead.contact_phone}</span>}
            {lead.address && <span>📍 {lead.address}</span>}
            {lead.next_action && <span>→ {lead.next_action}</span>}
            {lead.meeting_datetime && <span>📅 {lead.meeting_datetime}</span>}
            {lead.notes && <span>📝 {lead.notes}</span>}
            {!lead.contact_email && !lead.contact_phone && !lead.address && !lead.next_action && !lead.notes && (
              <span>Пока пусто — жми «Править» или добавь заход.</span>
            )}
          </div>
        </div>
      )}

      {/* История */}
      <div className="crm-section-title">История ({activities.length})</div>
      <div className="crm-timeline">
        {activities.map((a) => (
          <div key={a.id} className="crm-tl-item">
            <div className="crm-tl-date">
              {KIND_ICONS[a.kind] ?? "•"} {fmtDate(a.created_at)}
              {a.entry_type === "cold_touch" ? " · холодный заход" : ""}
            </div>
            <div>{a.summary || a.transcript.slice(0, 200) || "—"}</div>
            {a.photo_url && <a href={a.photo_url} target="_blank" rel="noreferrer" className="crm-tl-photo">📷 фото</a>}
          </div>
        ))}
        {activities.length === 0 && <div className="crm-sub">Пока нет записей.</div>}
      </div>

      {emails.length > 0 && (
        <>
          <div className="crm-section-title">Письма ({emails.length})</div>
          {emails.map((e) => (
            <div key={e.id} className="crm-tl-item">
              <div className="crm-tl-date">✉️ {fmtDate(e.created_at)} → {e.to_email}</div>
              <div><b>{e.subject}</b></div>
              <div className="crm-sub" style={{ whiteSpace: "pre-wrap" }}>{e.body.slice(0, 160)}…</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
