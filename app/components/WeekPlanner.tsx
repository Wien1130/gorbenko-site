"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DailyPlan } from "../lib/plans";
import type { UpcomingMeeting } from "../lib/plans";

const DOW_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function formatDay(date: string): string {
  const d = new Date(date + "T00:00:00");
  return `${DOW_LABELS[(d.getDay() + 6) % 7]} ${date.slice(8, 10)}.${date.slice(5, 7)}`;
}

export default function WeekPlanner({
  weekDates,
  plans,
  meetings,
}: {
  weekDates: string[];
  plans: DailyPlan[];
  meetings: UpcomingMeeting[];
}) {
  const router = useRouter();
  const planByDate = new Map(plans.map((p) => [p.date, p]));
  const today = new Date().toISOString().slice(0, 10);

  const [values, setValues] = useState<Record<string, { hours: string; touches: string }>>(() => {
    const init: Record<string, { hours: string; touches: string }> = {};
    for (const d of weekDates) {
      const p = planByDate.get(d);
      init[d] = { hours: p?.planned_hours ?? "", touches: p?.planned_touches ?? "" };
    }
    return init;
  });
  const [saving, setSaving] = useState<string | null>(null);

  async function saveDay(date: string) {
    const v = values[date];
    if (!v.hours && !v.touches) return;
    setSaving(date);
    try {
      await fetch("/api/daily-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          plannedHours: Number(v.hours) || 0,
          plannedTouches: Number(v.touches) || 0,
        }),
      });
      router.refresh();
    } finally {
      setSaving(null);
    }
  }

  return (
    <>
      <div className="card">
        <div className="card-title">🗓 План на неделю — блоки времени под холодные заходы</div>
        <p style={{ color: "var(--text-3)", fontSize: 13, marginBottom: 16 }}>
          Без адресов — просто сколько часов/касаний выделяешь на «зайти и посмотреть» в этот день.
        </p>
        {weekDates.map((date) => (
          <div className="plan-row" key={date} style={{ gridTemplateColumns: "70px 1fr 1fr 90px" }}>
            <span className="plan-date" style={{ color: date === today ? "var(--accent)" : undefined }}>
              {formatDay(date)}
            </span>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.5"
              placeholder="часов"
              value={values[date].hours}
              onChange={(e) => setValues((s) => ({ ...s, [date]: { ...s[date], hours: e.target.value } }))}
            />
            <input
              className="form-input"
              type="number"
              min="0"
              step="1"
              placeholder="касаний"
              value={values[date].touches}
              onChange={(e) => setValues((s) => ({ ...s, [date]: { ...s[date], touches: e.target.value } }))}
            />
            <button
              className="table-sort-btn"
              type="button"
              disabled={saving === date}
              onClick={() => saveDay(date)}
            >
              {saving === date ? "..." : "Сохранить"}
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">📍 Уже назначенные встречи на неделю</div>
        {meetings.length === 0 ? (
          <p style={{ color: "var(--text-3)", fontSize: 13 }}>Пока нет назначенных встреч.</p>
        ) : (
          meetings.map((m, i) => (
            <div className="plan-row" key={i} style={{ gridTemplateColumns: "1fr 1fr auto" }}>
              <span className="plan-date">{m.meeting_datetime}</span>
              <span className="plan-metric"><b>{m.business_name}</b></span>
              <span className={`plan-match ${m.stage === "meeting_confirmed" ? "good" : "mid"}`}>
                {m.stage === "meeting_confirmed" ? "подтв." : "предв."}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
}
