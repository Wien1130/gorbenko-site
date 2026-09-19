import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../../lib/crm/api-auth";
import { getSql } from "../../../../lib/crm/db";

/** PATCH /api/crm/reminders/[id] — {action: "done"} или {action: "snooze", days: N}. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена" }, { status: 500 });

  const { id } = await params;
  const rid = parseInt(id, 10);
  const b = await req.json();

  try {
    if (b.action === "done") {
      await sql`UPDATE reminders SET status = 'done' WHERE id = ${rid}`;
    } else if (b.action === "snooze") {
      const days = Math.max(1, Math.min(30, Number(b.days) || 1));
      await sql`UPDATE reminders SET status = 'pending', due_at = now() + make_interval(days => ${days}) WHERE id = ${rid}`;
    } else {
      return Response.json({ error: "Неизвестное действие" }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
