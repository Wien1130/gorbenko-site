import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../lib/crm/api-auth";
import { getSql } from "../../../lib/crm/db";
import { fetchWorkSessions } from "../../../lib/crm/work";

export async function GET() {
  if (!(await isCrmAuthed())) return unauthorized();
  return Response.json({ sessions: await fetchWorkSessions(30) });
}

/** POST /api/crm/work — {action: "start"} | {action: "stop"}; опционально at (ISO), если время задано вручную. */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена" }, { status: 500 });

  const b = await req.json();
  const at = b.at ? new Date(b.at) : new Date();
  if (Number.isNaN(at.getTime())) return Response.json({ error: "Неверное время" }, { status: 400 });

  const open = (await sql`SELECT id FROM work_sessions WHERE ended_at IS NULL ORDER BY started_at DESC LIMIT 1`)[0] as
    | { id: number }
    | undefined;

  if (b.action === "start") {
    if (open) return Response.json({ error: "Работа уже идёт — сначала «Конец»" }, { status: 409 });
    const r = await sql`INSERT INTO work_sessions (started_at) VALUES (${at.toISOString()}) RETURNING id, started_at, ended_at`;
    return Response.json({ session: r[0] });
  }
  if (b.action === "stop") {
    if (!open) return Response.json({ error: "Нет открытой сессии" }, { status: 409 });
    const r = await sql`UPDATE work_sessions SET ended_at = ${at.toISOString()} WHERE id = ${open.id} RETURNING id, started_at, ended_at`;
    return Response.json({ session: r[0] });
  }
  return Response.json({ error: "Неизвестное действие" }, { status: 400 });
}
