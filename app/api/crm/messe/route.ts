import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../lib/crm/api-auth";
import { getSql } from "../../../lib/crm/db";
import type { FairVisit } from "../../../lib/crm/messe/data";

const STATUSES = new Set(["todo", "talked", "revisit", "skip"]);

async function ensureTable(sql: NonNullable<ReturnType<typeof getSql>>) {
  await sql.query(`CREATE TABLE IF NOT EXISTS fair_visits (
    event text NOT NULL,
    exhibitor_id text NOT NULL,
    status text NOT NULL DEFAULT 'todo',
    note text NOT NULL DEFAULT '',
    lead_id int REFERENCES leads(id) ON DELETE SET NULL,
    email_sent boolean NOT NULL DEFAULT false,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (event, exhibitor_id)
  )`);
}

/** GET /api/crm/messe?event=blickfang-2026 — статусы обхода по всем стендам. */
export async function GET(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ visits: [] });
  const event = req.nextUrl.searchParams.get("event") ?? "blickfang-2026";
  await ensureTable(sql);
  const rows = await sql`SELECT * FROM fair_visits WHERE event = ${event}`;
  return Response.json({ visits: rows as unknown as FairVisit[] });
}

/** POST /api/crm/messe — upsert статуса/заметки/лида по одному стенду. */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена (DATABASE_URL)" }, { status: 500 });

  const b = await req.json();
  const event = String(b.event ?? "blickfang-2026");
  const exhibitorId = String(b.exhibitor_id ?? "").trim();
  if (!exhibitorId) return Response.json({ error: "Нет exhibitor_id" }, { status: 400 });

  const status = STATUSES.has(b.status) ? (b.status as string) : null;
  const note = typeof b.note === "string" ? b.note : null;
  const leadId = b.lead_id !== undefined ? (b.lead_id === null ? null : Number(b.lead_id)) : undefined;
  const emailSent = typeof b.email_sent === "boolean" ? b.email_sent : null;

  try {
    await ensureTable(sql);
    const rows = await sql`
      INSERT INTO fair_visits (event, exhibitor_id, status, note, lead_id, email_sent)
      VALUES (${event}, ${exhibitorId}, ${status ?? "todo"}, ${note ?? ""}, ${leadId ?? null}, ${emailSent ?? false})
      ON CONFLICT (event, exhibitor_id) DO UPDATE SET
        status = COALESCE(${status}, fair_visits.status),
        note = COALESCE(${note}, fair_visits.note),
        lead_id = CASE WHEN ${leadId === undefined} THEN fair_visits.lead_id ELSE ${leadId ?? null} END,
        email_sent = COALESCE(${emailSent}, fair_visits.email_sent),
        updated_at = now()
      RETURNING *`;
    return Response.json({ visit: rows[0] });
  } catch (e) {
    console.error("crm messe upsert error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
