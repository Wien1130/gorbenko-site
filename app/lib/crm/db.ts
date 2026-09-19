import { neon } from "@neondatabase/serverless";
import type { Lead, Activity, Reminder, EmailRecord } from "./types";

/** Единая точка доступа к Postgres (Neon). Если DATABASE_URL не задан — sql = null, вызывающий код деградирует. */
export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

export const SCHEMA_SQL = [
  `CREATE TABLE IF NOT EXISTS leads (
    id serial PRIMARY KEY,
    business_name text NOT NULL,
    business_type text NOT NULL DEFAULT 'other',
    stage text NOT NULL DEFAULT 'warm_followup',
    address text NOT NULL DEFAULT '',
    contact_name text NOT NULL DEFAULT '',
    contact_email text NOT NULL DEFAULT '',
    contact_phone text NOT NULL DEFAULT '',
    next_action text NOT NULL DEFAULT '',
    meeting_datetime text NOT NULL DEFAULT '',
    deal_amount numeric NOT NULL DEFAULT 0,
    notes text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS activities (
    id serial PRIMARY KEY,
    lead_id int NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    kind text NOT NULL DEFAULT 'visit',
    entry_type text NOT NULL DEFAULT 'cold_touch',
    stage_after text NOT NULL DEFAULT '',
    transcript text NOT NULL DEFAULT '',
    summary text NOT NULL DEFAULT '',
    photo_url text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS reminders (
    id serial PRIMARY KEY,
    lead_id int REFERENCES leads(id) ON DELETE CASCADE,
    due_at timestamptz NOT NULL,
    text text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS emails (
    id serial PRIMARY KEY,
    lead_id int NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    to_email text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    lang text NOT NULL DEFAULT 'de',
    status text NOT NULL DEFAULT 'sent',
    gmail_id text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_activities_lead ON activities(lead_id, created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_reminders_due ON reminders(status, due_at)`,
];

export async function ensureSchema() {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not set");
  for (const stmt of SCHEMA_SQL) await sql.query(stmt);
}

export async function fetchLeads(): Promise<Lead[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql`
    SELECT l.*,
      (SELECT max(a.created_at) FROM activities a WHERE a.lead_id = l.id) AS last_activity_at
    FROM leads l
    ORDER BY last_activity_at DESC NULLS LAST, l.updated_at DESC`;
  return rows as unknown as (Lead & { last_activity_at: string })[];
}

export async function fetchLead(id: number): Promise<Lead | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM leads WHERE id = ${id}`;
  return (rows[0] as unknown as Lead) ?? null;
}

export async function fetchActivities(leadId: number): Promise<Activity[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql`SELECT * FROM activities WHERE lead_id = ${leadId} ORDER BY created_at DESC`;
  return rows as unknown as Activity[];
}

export async function fetchLeadReminders(leadId: number): Promise<Reminder[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql`SELECT * FROM reminders WHERE lead_id = ${leadId} AND status <> 'done' ORDER BY due_at`;
  return rows as unknown as Reminder[];
}

export async function fetchLeadEmails(leadId: number): Promise<EmailRecord[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql`SELECT * FROM emails WHERE lead_id = ${leadId} ORDER BY created_at DESC`;
  return rows as unknown as EmailRecord[];
}

/** Напоминания на сегодня и просроченные (для главного экрана). */
export async function fetchDueReminders(): Promise<Reminder[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql`
    SELECT r.*, l.business_name
    FROM reminders r LEFT JOIN leads l ON l.id = r.lead_id
    WHERE r.status <> 'done' AND r.due_at <= now() + interval '12 hours'
    ORDER BY r.due_at`;
  return rows as unknown as Reminder[];
}
