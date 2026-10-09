"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { WorkSession } from "../../lib/crm/types";

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function fmtDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function isToday(iso: string, now: number): boolean {
  return new Date(iso).toDateString() === new Date(now).toDateString();
}

export default function WorkBar({ sessions, todayVisits }: { sessions: WorkSession[]; todayVisits: number }) {
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<Record<number, { start: string; end: string }>>({});

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const open = sessions.find((s) => !s.ended_at);
  const ref = now ?? 0;
  const today = now ? sessions.filter((s) => isToday(s.started_at, ref)) : [];
  const todayMs = today.reduce(
    (sum, s) => sum + ((s.ended_at ? new Date(s.ended_at).getTime() : ref) - new Date(s.started_at).getTime()),
    0,
  );
  const hours = todayMs / 3600000;
  const perHour = hours > 0.05 ? (todayVisits / hours).toFixed(1) : "—";

  async function startStop() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/crm/work", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: open ? "stop" : "start" }),
    });
    const json = await res.json();
    if (!res.ok) setError(json.error || `HTTP ${res.status}`);
    setBusy(false);
    router.refresh();
  }

  function draftFor(s: WorkSession) {
    return drafts[s.id] ?? { start: toLocalInput(s.started_at), end: toLocalInput(s.ended_at) };
  }

  async function saveSession(s: WorkSession) {
    const d = draftFor(s);
    setError("");
    const res = await fetch(`/api/crm/work/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        started_at: d.start ? new Date(d.start).toISOString() : undefined,
        ended_at: d.end ? new Date(d.end).toISOString() : null,
      }),
    });
    const json = await res.json();
    if (!res.ok) setError(json.error || `HTTP ${res.status}`);
    else router.refresh();
  }

  async function deleteSession(s: WorkSession) {
    if (!confirm("Удалить эту сессию?")) return;
    await fetch(`/api/crm/work/${s.id}`, { method: "DELETE" });
    router.refresh();
  }

  const recent = sessions.slice(0, 6);

  return (
    <div className="crm-work">
      <div className="crm-work-row">
        <div className="crm-work-info">
          {open ? (
            <>
              <div className="crm-work-timer">⏱ {now ? fmtDuration(ref - new Date(open.started_at).getTime()) : "…"}</div>
              <div className="crm-sub">работаю с {fmtTime(open.started_at)}</div>
            </>
          ) : (
            <>
              <div className="crm-work-timer" style={{ color: "#9ca3af" }}>Не в работе</div>
              <div className="crm-sub">сегодня {today.length ? `${today.length} сесс.` : "ещё не начинал"}</div>
            </>
          )}
        </div>
        <button className={`crm-work-btn ${open ? "stop" : "start"}`} onClick={startStop} disabled={busy}>
          {busy ? "…" : open ? "⏹ Конец работы" : "▶ Старт работы"}
        </button>
      </div>

      <div className="crm-work-stats">
        <span>Сегодня: <b>{hours.toFixed(1)} ч</b></span>
        <span><b>{todayVisits}</b> точек</span>
        <span><b>{perHour}</b> точек/час</span>
        <button className="crm-mini-btn" onClick={() => setEditing((v) => !v)}>{editing ? "Готово" : "✏️ Время"}</button>
      </div>

      {error && <div className="crm-error">{error}</div>}

      {editing && (
        <div className="crm-work-edit">
          <div className="crm-sub" style={{ marginBottom: 8 }}>Забыл нажать? Поправь время. Пустой «конец» = ещё работаю.</div>
          {recent.map((s) => {
            const d = draftFor(s);
            return (
              <div key={s.id} className="crm-work-session">
                <div className="crm-2col">
                  <div className="crm-field">
                    <label>Старт</label>
                    <input className="crm-input" type="datetime-local" value={d.start}
                      onChange={(e) => setDrafts({ ...drafts, [s.id]: { ...d, start: e.target.value } })} />
                  </div>
                  <div className="crm-field">
                    <label>Конец</label>
                    <input className="crm-input" type="datetime-local" value={d.end}
                      onChange={(e) => setDrafts({ ...drafts, [s.id]: { ...d, end: e.target.value } })} />
                  </div>
                </div>
                <div className="crm-row-btns">
                  <button className="crm-mini-btn" onClick={() => saveSession(s)}>💾 Сохранить</button>
                  <button className="crm-mini-btn" onClick={() => deleteSession(s)}>🗑</button>
                </div>
              </div>
            );
          })}
          {recent.length === 0 && <div className="crm-sub">Сессий пока нет — нажми «Старт работы».</div>}
        </div>
      )}
    </div>
  );
}
