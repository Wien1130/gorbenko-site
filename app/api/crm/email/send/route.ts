import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../../lib/crm/api-auth";
import { getSql } from "../../../../lib/crm/db";
import { holdLeadEmail, scheduleLeadEmail, sendLeadEmail } from "../../../../lib/crm/send-email";
import { parseSendAt } from "../../../../lib/crm/vienna";

export const maxDuration = 30;

/**
 * POST /api/crm/email/send — отправка письма через Gmail Андрея (текст + HTML).
 * Если передан send_at (ISO или YYYY-MM-DD) в будущем — письмо откладывается, cron отправит его в срок
 * (дата без времени = 09:00 по Вене).
 */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена" }, { status: 500 });

  const b = await req.json();
  const to = (b.to ?? "").trim();
  const subject = (b.subject ?? "").trim();
  const body = (b.body ?? "").trim();
  const lang: "ru" | "de" = b.lang === "ru" ? "ru" : "de";
  const leadId = Number(b.lead_id);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return Response.json({ error: `Некорректный email: "${to}"` }, { status: 400 });
  if (!subject || !body) return Response.json({ error: "Пустая тема или текст" }, { status: 400 });
  if (!leadId) return Response.json({ error: "Нет lead_id" }, { status: 400 });

  try {
    if (b.hold === true) {
      const r = await holdLeadEmail(leadId, { to, subject, body, lang });
      return Response.json({ ok: true, held: true, duplicate: r.duplicate, email_id: r.id, status: "needs_review" });
    }
    const sendAt = parseSendAt(b.send_at);
    if (sendAt && sendAt.getTime() > Date.now() + 60_000) {
      const r = await scheduleLeadEmail(leadId, { to, subject, body, lang }, sendAt);
      return Response.json({ ok: true, scheduled: true, email_id: r.id, send_at: sendAt.toISOString(), when: r.when });
    }
    const dup = (await sql`
      SELECT id, gmail_id, status FROM emails
      WHERE lead_id = ${leadId} AND subject = ${subject}
        AND status IN ('sent', 'uncertain', 'sending')
        AND created_at > now() - interval '12 hours'
      ORDER BY id DESC LIMIT 1`) as unknown as { id: number; gmail_id: string; status: string }[];
    if (dup[0]) {
      return Response.json({ ok: true, duplicate: true, email_id: dup[0].id, gmail_id: dup[0].gmail_id, status: dup[0].status });
    }
    const { gmailId } = await sendLeadEmail(leadId, { to, subject, body, lang });
    return Response.json({ ok: true, gmail_id: gmailId });
  } catch (e) {
    console.error("crm email send error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}

