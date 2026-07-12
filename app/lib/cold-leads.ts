import { parse } from "csv-parse/sync";

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

/** Читает cold_leads.csv из приватного GitHub-репо. Только серверный код — токен не уходит на клиент. */
export async function fetchLeadRows(): Promise<LeadRow[]> {
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
