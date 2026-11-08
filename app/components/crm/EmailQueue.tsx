"use client";

import { useEffect, useState } from "react";

type Row = {
  id: number;
  lead_id: number;
  to_email: string;
  subject: string;
  body: string;
  status: string;
  send_vienna: string | null;
  created_vienna: string;
  business_name: string;
  event: string | null;
};

const FILTERS = ["", "needs_review", "scheduled", "sending", "sent", "failed", "uncertain"] as const;
const LABEL: Record<string, string> = {
  "": "последние",
  needs_review: "на проверке",
  scheduled: "запланированы",
  sending: "отправляются",
  sent: "ушли",
  failed: "сбой",
  uncertain: "неясно",
};

export default function EmailQueue() {
  const [status, setStatus] = useState<string>("needs_review");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | null>(null);

  async function load(next = status) {
    setError("");
    const res = await fetch(`/api/crm/emails${next ? `?status=${next}` : ""}`);
    const json = await res.json();
    if (!res.ok) { setError(json.error || `HTTP ${res.status}`); return; }
    setRows(json.emails || []);
  }

  useEffect(() => { void load(status); }, [status]);

  function patch(id: number, part: Partial<Row>) {
    setRows((list) => list.map((r) => (r.id === id ? { ...r, ...part } : r)));
  }

  async function act(id: number, action: string, extra: Record<string, string> = {}) {
    setBusy(id);
    setError("");
    try {
      const row = rows.find((r) => r.id === id);
      const res = await fetch("/api/crm/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, subject: row?.subject, body: row?.body, ...extra }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      await load(status);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <header className="m-head">
        <small><a href="/crm" style={{ color: "#9bd4d1" }}>← CRM</a> · <a href="/crm/messe" style={{ color: "#9bd4d1" }}>выставки</a></small>
        <h1>Очередь писем</h1>
        <div className="sub">Время — Europe/Vienna. «Письмо ✓» на стенде не доказывает, что второе письмо ушло.</div>
      </header>
      <div className="m-bar">
        <div className="m-tabs">
          {FILTERS.map((f) => (
            <button key={f || "all"} className={status === f ? "on" : ""} onClick={() => setStatus(f)}>{LABEL[f]}</button>
          ))}
        </div>
      </div>
      <div className="m-main">
        {error && <div className="m-err">{error}</div>}
        {rows.map((r) => (
          <article key={r.id} className="m-card">
            <div className="m-top">
              <div>
                <div className="m-name">{r.business_name}</div>
                <div className="m-sub">{LABEL[r.status] || r.status} · {r.event || "без выставки"} · создано {r.created_vienna}</div>
              </div>
              <div className="m-booth">{r.send_vienna || "—"}<small>Вена</small></div>
            </div>
            <div className="m-links">
              <a href={`/crm/lead/${r.lead_id}`}>Лид #{r.lead_id}</a>
              <span>{r.to_email}</span>
            </div>
            <input value={r.subject} onChange={(e) => patch(r.id, { subject: e.target.value })} />
            <textarea style={{ minHeight: 140, marginTop: 8 }} value={r.body} onChange={(e) => patch(r.id, { body: e.target.value })} />
            <div className="m-actions">
              {r.status !== "sent" && r.status !== "sending" && r.status !== "uncertain" && (
                <button disabled={busy === r.id} onClick={() => void act(r.id, "save")}>Сохранить текст</button>
              )}
              {r.status === "scheduled" && (
                <button disabled={busy === r.id} onClick={() => void act(r.id, "cancel")}>Снять с очереди</button>
              )}
              {(r.status === "needs_review" || r.status === "failed") && (
                <button disabled={busy === r.id} onClick={() => {
                  const day = window.prompt("Дата YYYY-MM-DD, уйдёт в 09:00 по Вене");
                  if (day && /^\d{4}-\d{2}-\d{2}$/.test(day)) void act(r.id, "schedule", { send_at: day });
                }}>Запланировать</button>
              )}
              {(r.status === "needs_review" || r.status === "failed") && (
                <button className="pink" disabled={busy === r.id} onClick={() => {
                  if (window.confirm(`Отправить это письмо для ${r.business_name} сейчас?`)) void act(r.id, "send");
                }}>Отправить сейчас</button>
              )}
            </div>
          </article>
        ))}
        {!rows.length && <div className="m-note">В этом фильтре писем нет.</div>}
      </div>
    </>
  );
}
