import { getSql } from "./db";
import type { WorkSession, DayStats, MapPoint } from "./types";

/** Сессии работы за последние N дней (новые сверху). */
export async function fetchWorkSessions(days = 30): Promise<WorkSession[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql`
    SELECT id, started_at, ended_at FROM work_sessions
    WHERE started_at >= now() - make_interval(days => ${days})
    ORDER BY started_at DESC`;
  return rows as unknown as WorkSession[];
}

/** Статистика по дням (дата по Вене): часы из сессий, заходы/follow-up/письма из activities. */
export async function fetchDayStats(): Promise<DayStats[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql`
    WITH a AS (
      SELECT to_char(created_at AT TIME ZONE 'Europe/Vienna', 'YYYY-MM-DD') AS day,
        count(*) FILTER (WHERE entry_type = 'cold_touch' AND kind = 'visit')::int AS visits,
        count(*) FILTER (WHERE entry_type = 'followup' AND kind <> 'email')::int AS followups,
        count(*) FILTER (WHERE kind = 'email')::int AS emails
      FROM activities GROUP BY 1
    ), w AS (
      SELECT to_char(started_at AT TIME ZONE 'Europe/Vienna', 'YYYY-MM-DD') AS day,
        sum(extract(epoch FROM coalesce(ended_at, now()) - started_at)) / 3600.0 AS hours
      FROM work_sessions GROUP BY 1
    )
    SELECT coalesce(a.day, w.day) AS day,
      round(coalesce(w.hours, 0)::numeric, 2)::float AS hours,
      coalesce(a.visits, 0) AS visits, coalesce(a.followups, 0) AS followups, coalesce(a.emails, 0) AS emails
    FROM a FULL OUTER JOIN w ON a.day = w.day
    ORDER BY 1`;
  return rows as unknown as DayStats[];
}

/** Точки на карту: лиды с координатами + день первого захода. */
export async function fetchMapPoints(): Promise<MapPoint[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql`
    SELECT l.id, l.business_name, l.stage, l.lat, l.lng, l.address,
      min(a.created_at) AS first_visit,
      to_char(min(a.created_at) AT TIME ZONE 'Europe/Vienna', 'YYYY-MM-DD') AS visit_day
    FROM leads l LEFT JOIN activities a ON a.lead_id = l.id
    WHERE l.lat IS NOT NULL AND l.lng IS NOT NULL
    GROUP BY l.id
    ORDER BY first_visit`;
  return rows as unknown as MapPoint[];
}
