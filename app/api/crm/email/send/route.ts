import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../../lib/crm/api-auth";
import { getSql, fetchLead } from "../../../../lib/crm/db";
import { sendGmail } from "../../../../lib/crm/gmail";
import { withSignature } from "../../../../lib/crm/ai";

export const maxDuration = 30;

/** POST /api/crm/email/send — реальная отправка письма через Gmail Андрея. */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена" }, { status: 500 });

  const b = await req.json();
  const to = (b.to ?? "").trim();
  const subject = (b.subject ?? "").trim();
  const body = (b.body ?? "").trim();
  const lang: "ru" | "de" = b.lang === "de" ? "de" : "ru";
  const leadId = Number(b.lead_id);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return Response.json({ error: `Некорректный email: "${to}"` }, { status: 400 });
  if (!subject || !body) return Response.json({ error: "Пустая тема или текст" }, { status: 400 });

  const lead = await fetchLead(leadId);
  if (!lead) return Response.json({ error: "Лид не найден" }, { status: 404 });

  try {
    const fullBody = withSignature(body, lang);
    const { id: gmailId } = await sendGmail({ to, subject, body: fullBody });

    await sql`INSERT INTO emails (lead_id, to_email, subject, body, lang, status, gmail_id)
      VALUES (${leadId}, ${to}, ${subject}, ${fullBody}, ${lang}, 'sent', ${gmailId})`;
    await sql`INSERT INTO activities (lead_id, kind, entry_type, stage_after, summary)
      VALUES (${leadId}, 'email', 'followup', ${lead.stage}, ${"Отправлено письмо: " + subject})`;
    if (to && !lead.contact_email) {
      await sql`UPDATE leads SET contact_email = ${to}, updated_at = now() WHERE id = ${leadId}`;
    }

    return Response.json({ ok: true, gmail_id: gmailId });
  } catch (e) {
    console.error("crm email send error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
