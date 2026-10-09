import { neon } from "@neondatabase/serverless";
import type { Lead, Activity, Reminder, EmailRecord, Pitch, PitchEvent, PitchContent, PitchFocus } from "./types";

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
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS lat double precision`,
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS lng double precision`,
  `ALTER TABLE activities ADD COLUMN IF NOT EXISTS lat double precision`,
  `ALTER TABLE activities ADD COLUMN IF NOT EXISTS lng double precision`,
  `CREATE TABLE IF NOT EXISTS work_sessions (
    id serial PRIMARY KEY,
    started_at timestamptz NOT NULL,
    ended_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS pitches (
    id serial PRIMARY KEY,
    lead_id int NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    slug text NOT NULL UNIQUE,
    focus text NOT NULL DEFAULT 'general',
    lang text NOT NULL DEFAULT 'de',
    content jsonb NOT NULL,
    status text NOT NULL DEFAULT 'draft',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS pitch_events (
    id serial PRIMARY KEY,
    pitch_id int NOT NULL REFERENCES pitches(id) ON DELETE CASCADE,
    kind text NOT NULL,
    utm_source text NOT NULL DEFAULT '',
    utm_medium text NOT NULL DEFAULT '',
    utm_campaign text NOT NULL DEFAULT '',
    referrer text NOT NULL DEFAULT '',
    user_agent text NOT NULL DEFAULT '',
    payload jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_pitches_lead ON pitches(lead_id)`,
  `CREATE INDEX IF NOT EXISTS idx_pitch_events_pitch ON pitch_events(pitch_id, created_at)`,
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

// ---------- Персональные страницы ----------

export async function fetchPitchByLead(leadId: number): Promise<Pitch | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM pitches WHERE lead_id = ${leadId} ORDER BY updated_at DESC LIMIT 1`;
  return (rows[0] as unknown as Pitch) ?? null;
}

export async function fetchPitchBySlug(slug: string): Promise<(Pitch & { business_name: string; contact_name: string }) | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql`
    SELECT p.*, l.business_name, l.contact_name
    FROM pitches p JOIN leads l ON l.id = p.lead_id
    WHERE p.slug = ${slug} AND p.status = 'published'`;
  return (rows[0] as unknown as Pitch & { business_name: string; contact_name: string }) ?? null;
}

/** Одна страница на лида: есть — обновляем контент (slug стабилен), нет — создаём. */
export async function upsertPitch(opts: {
  leadId: number;
  slug: string;
  focus: PitchFocus;
  content: PitchContent;
  status: "draft" | "published";
}): Promise<Pitch> {
  const sql = getSql();
  if (!sql) throw new Error("DATABASE_URL is not set");
  const existing = await fetchPitchByLead(opts.leadId);
  const contentJson = JSON.stringify(opts.content);
  if (existing) {
    const rows = await sql`
      UPDATE pitches SET focus = ${opts.focus}, content = ${contentJson}::jsonb, status = ${opts.status}, updated_at = now()
      WHERE id = ${existing.id} RETURNING *`;
    return rows[0] as unknown as Pitch;
  }
  const rows = await sql`
    INSERT INTO pitches (lead_id, slug, focus, content, status)
    VALUES (${opts.leadId}, ${opts.slug}, ${opts.focus}, ${contentJson}::jsonb, ${opts.status}) RETURNING *`;
  return rows[0] as unknown as Pitch;
}

export async function fetchPitchEvents(pitchId: number, limit = 30): Promise<PitchEvent[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql`SELECT * FROM pitch_events WHERE pitch_id = ${pitchId} ORDER BY created_at DESC LIMIT ${limit}`;
  return rows as unknown as PitchEvent[];
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
