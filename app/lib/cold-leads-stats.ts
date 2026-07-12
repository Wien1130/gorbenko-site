import type { LeadRow } from "./cold-leads";

export const CAMPAIGN_GOAL = 100;
export const CAMPAIGN_MAX_DAYS = 20;

export const STAGE_ORDER = [
  "lost",
  "warm_followup",
  "meeting_tentative",
  "meeting_confirmed",
  "meeting_done",
  "proposal_sent",
  "won",
] as const;

export type Stage = (typeof STAGE_ORDER)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  lost: "Отказ",
  warm_followup: "Тёплый / follow-up",
  meeting_tentative: "Встреча (предв.)",
  meeting_confirmed: "Встреча (подтв.)",
  meeting_done: "Встреча прошла",
  proposal_sent: "Предложение отправлено",
  won: "Продажа",
};

export const STAGE_COLORS: Record<Stage, string> = {
  lost: "#f87171",
  warm_followup: "#facc15",
  meeting_tentative: "#fb923c",
  meeting_confirmed: "#60a5fa",
  meeting_done: "#38bdf8",
  proposal_sent: "#a78bfa",
  won: "#4ade80",
};

function dedupLatestByBusiness(rows: LeadRow[]): LeadRow[] {
  const latest = new Map<string, LeadRow>();
  let noNameI = 0;
  for (const r of rows) {
    const key = (r.business_name || "").trim().toLowerCase();
    if (!key) {
      latest.set(`__noname_${noNameI++}`, r);
      continue;
    }
    latest.set(key, r); // rows идут по порядку добавления — последняя перезапишет предыдущую
  }
  return Array.from(latest.values());
}

export interface ColdSalesStats {
  total: number;
  followups: number;
  daysElapsed: number;
  daysLeft: number;
  pace: number;
  counts: Record<Stage, number>;
  meetings: number;
  toMeetingRate: number;
  wonRate: number;
  revenue: number;
  hours: number;
  perHour: number;
  firstDate: string | null;
  trend: { date: string; touches: number; cumulative: number }[];
}

function estimateHours(rows: LeadRow[]): number {
  const byDate: Record<string, Date[]> = {};
  let noTsCount = 0;

  for (const r of rows) {
    if (r.timestamp) {
      const t = new Date(r.timestamp);
      if (!isNaN(t.getTime())) {
        (byDate[r.date] ??= []).push(t);
        continue;
      }
    }
    if (r.date) noTsCount += 1;
  }

  let totalMs = 0;
  for (const day in byDate) {
    const times = byDate[day].sort((a, b) => a.getTime() - b.getTime());
    const span = times[times.length - 1].getTime() - times[0].getTime();
    totalMs += Math.max(span, 5 * 60 * 1000);
  }

  const estimateMs = noTsCount * 12 * 60 * 1000; // ~12 мин/касание для старых записей без timestamp
  return Math.round(((totalMs + estimateMs) / 3600000) * 10) / 10;
}

export function computeColdSalesStats(rows: LeadRow[]): ColdSalesStats {
  const coldRows = rows.filter((r) => (r.entry_type || "cold_touch") !== "followup");
  const total = coldRows.length; // счётчик "100 касаний" — только новые холодные заходы
  const followups = rows.length - total;

  const latestRows = dedupLatestByBusiness(rows); // воронка/конверсия/выручка — по актуальному статусу бизнеса
  const counts = Object.fromEntries(STAGE_ORDER.map((s) => [s, 0])) as Record<Stage, number>;
  for (const r of latestRows) {
    if (r.stage in counts) counts[r.stage as Stage] += 1;
  }

  const dates = coldRows.map((r) => r.date).filter(Boolean).sort();
  const firstDate = dates[0] ?? null;
  const firstDateObj = firstDate ? new Date(firstDate) : new Date();
  const today = new Date();
  const daysElapsed = Math.max(
    Math.floor((today.setHours(0, 0, 0, 0) - firstDateObj.setHours(0, 0, 0, 0)) / 86400000) + 1,
    1,
  );
  const daysLeft = Math.max(CAMPAIGN_MAX_DAYS - daysElapsed, 0);
  const remaining = Math.max(CAMPAIGN_GOAL - total, 0);
  const pace = daysLeft > 0 ? Math.round((remaining / daysLeft) * 10) / 10 : remaining;

  const latestTotal = latestRows.length || 1;
  const meetings = counts.meeting_tentative + counts.meeting_confirmed + counts.meeting_done;
  const toMeetingRate = Math.round(((meetings + counts.proposal_sent + counts.won) / latestTotal) * 1000) / 10;
  const wonRate = Math.round((counts.won / latestTotal) * 1000) / 10;

  const revenue = latestRows.reduce((sum, r) => sum + (parseFloat(r.deal_amount) || 0), 0);
  const hours = estimateHours(rows); // часы по ВСЕМ сообщениям — письмо тоже занимает время
  const perHour = hours > 0 ? Math.round((revenue / hours) * 10) / 10 : 0;

  const byDay = new Map<string, number>();
  for (const r of coldRows) {
    if (!r.date) continue;
    byDay.set(r.date, (byDay.get(r.date) ?? 0) + 1);
  }
  const sortedDays = Array.from(byDay.keys()).sort();
  let cumulative = 0;
  const trend = sortedDays.map((d) => {
    const touches = byDay.get(d) ?? 0;
    cumulative += touches;
    return { date: d, touches, cumulative };
  });

  return {
    total,
    followups,
    daysElapsed,
    daysLeft,
    pace,
    counts,
    meetings,
    toMeetingRate,
    wonRate,
    revenue,
    hours,
    perHour,
    firstDate,
    trend,
  };
}
