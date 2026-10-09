import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../../lib/crm/api-auth";
import { getSql } from "../../../../lib/crm/db";

/** PATCH — правка времени, если забыл нажать старт/конец. {started_at?, ended_at?: ISO | null} */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена" }, { status: 500 });

  const sid = parseInt((await params).id, 10);
  const b = await req.json();
  const cur = (await sql`SELECT started_at, ended_at FROM work_sessions WHERE id = ${sid}`)[0] as
    | { started_at: string; ended_at: string | null }
    | undefined;
  if (!cur) return Response.json({ error: "Сессия не найдена" }, { status: 404 });

  const start = b.started_at ? new Date(b.started_at) : new Date(cur.started_at);
  const end = b.ended_at === null ? null : b.ended_at ? new Date(b.ended_at) : cur.ended_at ? new Date(cur.ended_at) : null;
  if (Number.isNaN(start.getTime()) || (end && Number.isNaN(end.getTime()))) {
    return Response.json({ error: "Неверное время" }, { status: 400 });
  }
  if (end && end <= start) return Response.json({ error: "Конец должен быть позже старта" }, { status: 400 });

  await sql`UPDATE work_sessions SET started_at = ${start.toISOString()}, ended_at = ${end ? end.toISOString() : null} WHERE id = ${sid}`;
  return Response.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена" }, { status: 500 });
  await sql`DELETE FROM work_sessions WHERE id = ${parseInt((await params).id, 10)}`;
  return Response.json({ ok: true });
}
