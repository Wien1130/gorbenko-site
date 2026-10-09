import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../../lib/crm/api-auth";
import { getSql } from "../../../../lib/crm/db";
import { geocode } from "../../../../lib/crm/geo";

const EDITABLE = [
  "business_name", "business_type", "stage", "address",
  "contact_name", "contact_email", "contact_phone",
  "next_action", "meeting_datetime", "deal_amount", "notes",
] as const;

/** PATCH /api/crm/leads/[id] — точечная правка полей лида. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена" }, { status: 500 });

  const { id } = await params;
  const leadId = parseInt(id, 10);
  const body = await req.json();

  const updates = Object.entries(body).filter(([k]) => (EDITABLE as readonly string[]).includes(k));
  if (!updates.length) return Response.json({ error: "Нет полей для правки" }, { status: 400 });

  try {
    const before = (await sql`SELECT address FROM leads WHERE id = ${leadId}`)[0] as { address: string } | undefined;
    for (const [key, value] of updates) {
      const v = key === "deal_amount" ? Number(value) || 0 : String(value ?? "");
      await sql.query(`UPDATE leads SET ${key} = $1, updated_at = now() WHERE id = $2`, [v, leadId]);
    }
    const newAddress = typeof body.address === "string" ? body.address.trim() : "";
    if (newAddress && newAddress !== (before?.address ?? "").trim()) {
      const g = await geocode(newAddress);
      if (g) await sql`UPDATE leads SET lat = ${g.lat}, lng = ${g.lng} WHERE id = ${leadId}`;
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("crm patch lead error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}

/** DELETE /api/crm/leads/[id] — удалить лид со всей историей (activities/reminders/emails/pitch — каскадом). */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена" }, { status: 500 });
  const { id } = await params;
  const leadId = parseInt(id, 10);
  if (!leadId) return Response.json({ error: "id?" }, { status: 400 });
  await sql`DELETE FROM leads WHERE id = ${leadId}`;
  return Response.json({ ok: true });
}
