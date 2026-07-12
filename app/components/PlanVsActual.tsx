"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DayComparison } from "../lib/plans";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function matchClass(match: number | null): string {
  if (match === null) return "none";
  if (match >= 90) return "good";
  if (match >= 50) return "mid";
  return "bad";
}

export default function PlanVsActual({ comparisons }: { comparisons: DayComparison[] }) {
  const router = useRouter();
  const [hours, setHours] = useState("2");
  const [touches, setTouches] = useState("5");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/daily-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayStr(),
          plannedHours: Number(hours),
          plannedTouches: Number(touches),
        }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Не удалось сохранить план. Попробуй ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card plan-card">
      <div className="card-title">📅 План vs факт</div>

      <form className="plan-form" onSubmit={submit}>
        <div className="plan-field">
          <label>Часов на сегодня</label>
          <input
            className="form-input"
            type="number"
            min="0"
            step="0.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>
        <div className="plan-field">
          <label>Касаний на сегодня</label>
          <input
            className="form-input"
            type="number"
            min="0"
            step="1"
            value={touches}
            onChange={(e) => setTouches(e.target.value)}
          />
        </div>
        <button className="form-submit" type="submit" disabled={submitting} style={{ marginTop: 0 }}>
          {submitting ? "Сохраняю..." : `Запланировать на ${todayStr()}`}
        </button>
      </form>
      {error && <p className="form-error" style={{ marginBottom: 12 }}>{error}</p>}

      {comparisons.length === 0 ? (
        <p style={{ color: "var(--text-3)", fontSize: 13 }}>Пока нет ни планов, ни касаний.</p>
      ) : (
        comparisons.map((c) => (
          <div className="plan-row" key={c.date}>
            <span className="plan-date">{c.date.slice(5)}</span>
            <span className="plan-metric">
              ⏱ {c.plannedHours !== null ? <>план <b>{c.plannedHours}ч</b> · </> : null}
              факт <b>{c.actualHours}ч</b>
            </span>
            <span className="plan-metric">
              🎯 {c.plannedTouches !== null ? <>план <b>{c.plannedTouches}</b> · </> : null}
              факт <b>{c.actualTouches}</b>
            </span>
            <span className={`plan-match ${matchClass(c.touchesMatch)}`}>
              {c.touchesMatch !== null ? `${c.touchesMatch}%` : "—"}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
