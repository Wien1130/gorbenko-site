import { parse } from "csv-parse/sync";
import { getSql } from "./crm/db";

const GITHUB_REPO = process.env.COLD_LEADS_GITHUB_REPO ?? "Wien1130/entrepreneur-os";
const CSV_PATH = "knowledge/cold_leads.csv";

export interface LeadRow {
  touch_number: string;
  date: string;
  timestamp: string;
  business_name: string;
  business_type: string;
  stage: string;
  entry_type: string;
  contact_name: string;
  next_action: string;
  meeting_datetime: string;
  deal_amount: string;
  notes: string;
  photo_url: string;
  raw_text: string;
}

/**
 * Источник правды — Postgres (новая CRM). Каждая activity реконструируется в строку
 * старого CSV-формата, чтобы вся статистика/маскирование/публичная страница работали без правок.
 * Если DATABASE_URL не задан — fallback на старый CSV с GitHub (пред-миграционный режим).
 */
export async function fetchLeadRows(): Promise<LeadRow[]> {
  const sql = getSql();
  if (sql) {
    try {
      const rows = (await sql`
        SELECT a.created_at, a.entry_type, a.stage_after, a.transcript, a.summary, a.photo_url,
               l.business_name, l.business_type, l.contact_name, l.next_action,
               l.meeting_datetime, l.deal_amount, l.stage AS lead_stage
        FROM activities a JOIN leads l ON l.id = a.lead_id
        ORDER BY a.created_at ASC`) as unknown as {
        created_at: string; entry_type: string; stage_after: string; transcript: string;
        summary: string; photo_url: string; business_name: string; business_type: string;
        contact_name: string; next_action: string; meeting_datetime: string;
        deal_amount: string; lead_stage: string;
      }[];

      return rows.map((r, i) => {
        const d = new Date(r.created_at);
        return {
          touch_number: String(i + 1),
          date: d.toLocaleDateString("sv-SE", { timeZone: "Europe/Vienna" }),
          timestamp: d.toISOString(),
          business_name: r.business_name,
          business_type: r.business_type,
          stage: r.stage_after || r.lead_stage,
          entry_type: r.entry_type,
          contact_name: r.contact_name,
          next_action: r.next_action,
          meeting_datetime: r.meeting_datetime,
          deal_amount: String(r.deal_amount ?? "0"),
          notes: r.summary,
          photo_url: r.photo_url,
          raw_text: r.transcript,
        };
      });
    } catch (e) {
      console.error("fetchLeadRows: db error, fallback to CSV", e);
    }
  }
  return fetchLeadRowsFromCsv();
}

/** Старый путь: cold_leads.csv из приватного GitHub-репо (используется до миграции и как fallback). */
export async function fetchLeadRowsFromCsv(): Promise<LeadRow[]> {
  const token = process.env.COLD_LEADS_GITHUB_TOKEN;
  if (!token) return [];

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${CSV_PATH}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3.raw",
      },
      cache: "no-store",
    },
  );
  if (!res.ok) return [];

  const text = await res.text();
  if (!text.trim()) return [];

  try {
    return parse(text, { columns: true, skip_empty_lines: true }) as LeadRow[];
  } catch {
    return [];
  }
}
