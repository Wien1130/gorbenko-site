import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../../lib/crm/api-auth";
import { getSql } from "../../../../lib/crm/db";

/**
 * POST /api/crm/messe/undo — снять с лида записи последних 30 минут (голос попал не на тот стенд).
 * Если после этого у лида не осталось касаний — лид удаляется целиком.
 */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена" }, { status: 500 });

  const leadId = Number((await req.json()).lead_id);
  if (!leadId) return Response.json({ error: "Нет lead_id" }, { status: 400 });

  const recent = (await sql`SELECT id FROM activities WHERE lead_id = ${leadId} AND created_at > now() - interval '30 minutes'`) as unknown as { id: number }[];
  if (!recent.length) {
    return Response.json({ error: "Нечего отменять: последняя запись старше 30 минут" }, { status: 409 });
  }

  await sql`DELETE FROM activities WHERE lead_id = ${leadId} AND created_at > now() - interval '30 minutes'`;
  await sql`DELETE FROM reminders WHERE lead_id = ${leadId} AND status = 'pending' AND created_at > now() - interval '30 minutes'`;
  await sql`DELETE FROM emails WHERE lead_id = ${leadId} AND status = 'scheduled' AND created_at > now() - interval '30 minutes'`;

  const left = (await sql`SELECT count(*)::int AS n FROM activities WHERE lead_id = ${leadId}`) as unknown as { n: number }[];
  let leadDeleted = false;
  if (!left[0]?.n) {
    await sql`DELETE FROM leads WHERE id = ${leadId}`;
    leadDeleted = true;
  }
  return Response.json({ ok: true, removed: recent.length, lead_deleted: leadDeleted });
}
