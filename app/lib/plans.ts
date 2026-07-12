import type { LeadRow } from "./cold-leads";
import { appendCsvRow, fetchCsv } from "./github-csv";

const PLANS_PATH = "knowledge/daily_plans.csv";
const PLANS_HEADER = ["date", "planned_hours", "planned_touches", "note"];

export interface DailyPlan {
  date: string;
  planned_hours: string;
  planned_touches: string;
  note: string;
}

export async function fetchDailyPlans(): Promise<DailyPlan[]> {
  return fetchCsv<DailyPlan>(PLANS_PATH);
}

export async function saveDailyPlan(plan: {
  date: string;
  plannedHours: number;
  plannedTouches: number;
  note?: string;
}): Promise<boolean> {
  return appendCsvRow(PLANS_PATH, PLANS_HEADER, {
    date: plan.date,
    planned_hours: String(plan.plannedHours),
    planned_touches: String(plan.plannedTouches),
    note: plan.note ?? "",
  });
}

export interface DayComparison {
  date: string;
  plannedHours: number | null;
  actualHours: number;
  plannedTouches: number | null;
  actualTouches: number;
  hoursMatch: number | null;
  touchesMatch: number | null;
}

/** Реальные часы за конкретный день — по первому/последнему сообщению в этот день. */
function actualHoursByDay(rows: LeadRow[]): Record<string, number> {
  const byDate: Record<string, Date[]> = {};
  for (const r of rows) {
    if (!r.date) continue;
    const t = r.timestamp ? new Date(r.timestamp) : null;
    if (t && !isNaN(t.getTime())) {
      (byDate[r.date] ??= []).push(t);
    }
  }
  const result: Record<string, number> = {};
  for (const day in byDate) {
    const times = byDate[day].sort((a, b) => a.getTime() - b.getTime());
    const span = times[times.length - 1].getTime() - times[0].getTime();
    result[day] = Math.round((Math.max(span, 5 * 60 * 1000) / 3600000) * 10) / 10;
  }
  return result;
}

/** Сопоставляет запланированные часы/касания с реальными по датам, где был хотя бы план или касание. */
export function computePlanVsActual(plans: DailyPlan[], rows: LeadRow[]): DayComparison[] {
  const hoursByDay = actualHoursByDay(rows);
  const touchesByDay: Record<string, number> = {};
  for (const r of rows) {
    if (!r.date) continue;
    touchesByDay[r.date] = (touchesByDay[r.date] ?? 0) + 1;
  }

  const planByDate = new Map(plans.map((p) => [p.date, p]));
  const allDates = new Set([...planByDate.keys(), ...Object.keys(touchesByDay)]);

  return Array.from(allDates)
    .sort()
    .reverse()
    .map((date) => {
      const plan = planByDate.get(date);
      const plannedHours = plan ? parseFloat(plan.planned_hours) || 0 : null;
      const plannedTouches = plan ? parseInt(plan.planned_touches, 10) || 0 : null;
      const actualHours = hoursByDay[date] ?? 0;
      const actualTouches = touchesByDay[date] ?? 0;

      return {
        date,
        plannedHours,
        actualHours,
        plannedTouches,
        actualTouches,
        hoursMatch: plannedHours ? Math.round((actualHours / plannedHours) * 1000) / 10 : null,
        touchesMatch: plannedTouches ? Math.round((actualTouches / plannedTouches) * 1000) / 10 : null,
      };
    });
}
