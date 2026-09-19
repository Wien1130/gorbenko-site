"use client";

import { useState } from "react";
import { STAGE_ORDER, STAGE_LABELS, type Stage } from "../../lib/cold-leads-stats";
import type { Lead, Reminder } from "../../lib/crm/types";
import StageBadge from "./StageBadge";

function viennaDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", timeZone: "Europe/Vienna" });
  } catch {
    return "";
  }
}

export default function CrmHome({
  leads,
  reminders,
  stats,
}: {
  leads: Lead[];
  reminders: Reminder[];
  stats: { leads: number; touches: number; meetings: number; won: number };
}) {
  const [filter, setFilter] = useState<string>("all");
  const [reminderList, setReminderList] = useState(reminders);

  const shown = filter === "all" ? leads : leads.filter((l) => l.stage === filter);

  async function reminderAction(id: number, action: "done" | "snooze") {
    setReminderList((rs) => rs.filter((r) => r.id !== id));
    await fetch(`/api/crm/reminders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action === "done" ? { action } : { action, days: 2 }),
    });
  }

  return (
    <div className="crm-wrap">
      <div className="crm-top">
        <div>
          <div className="crm-title">🗂 Cold Sales CRM</div>
          <div className="crm-sub">50 ресторанов — вперёд</div>
        </div>
        <div className="crm-links">
          <a href="/crm/stats">📊</a>
          <a href="/crm/plan">🗓</a>
        </div>
      </div>

      <div className="crm-stats-mini">
        <div className="crm-stat"><b>{stats.touches}</b><span>касаний</span></div>
        <div className="crm-stat"><b>{stats.leads}</b><span>лидов</span></div>
        <div className="crm-stat"><b>{stats.meetings}</b><span>встреч</span></div>
        <div className="crm-stat"><b>{stats.won}</b><span>продаж</span></div>
      </div>

      {reminderList.length > 0 && (
        <div className="crm-remind">
          <div className="crm-remind-title">⏰ Напомнить сегодня</div>
          {reminderList.map((r) => (
            <div key={r.id} className="crm-remind-item">
              <a href={r.lead_id ? `/crm/lead/${r.lead_id}` : "#"}>
                {r.text}
                {r.business_name && <small>{r.business_name}</small>}
              </a>
              <button className="crm-mini-btn" onClick={() => reminderAction(r.id, "snooze")}>+2д</button>
              <button className="crm-mini-btn" onClick={() => reminderAction(r.id, "done")}>✓</button>
            </div>
          ))}
        </div>
      )}

      <div className="crm-filters">
        <button className={`crm-chip ${filter === "all" ? "on" : ""}`} onClick={() => setFilter("all")}>
          Все ({leads.length})
        </button>
        {STAGE_ORDER.map((s) => {
          const n = leads.filter((l) => l.stage === s).length;
          if (!n) return null;
          return (
            <button key={s} className={`crm-chip ${filter === s ? "on" : ""}`} onClick={() => setFilter(s)}>
              {STAGE_LABELS[s as Stage]} ({n})
            </button>
          );
        })}
      </div>

      {shown.map((l) => (
        <a key={l.id} href={`/crm/lead/${l.id}`} className="crm-lead">
          <div className="crm-lead-top">
            <span className="crm-lead-name">{l.business_name}</span>
            <StageBadge stage={l.stage} />
          </div>
          <div className="crm-lead-meta">
            <span>{viennaDate(l.updated_at)}</span>
            {l.contact_email && <span>✉️</span>}
            {l.contact_phone && <span>📞</span>}
            {l.next_action && <span>→ {l.next_action.slice(0, 46)}</span>}
          </div>
        </a>
      ))}

      {shown.length === 0 && <div className="crm-sub" style={{ textAlign: "center", padding: 30 }}>Пусто. Жми «Заход» 👇</div>}

      <a href="/crm/new" className="crm-fab">＋ Заход</a>
    </div>
  );
}
