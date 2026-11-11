import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../lib/crm/api-auth";
import { getSql } from "../../../lib/crm/db";
import { canSendLang, cancelScheduledEmail, scheduleExistingEmail, sendLeadEmail } from "../../../lib/crm/send-email";
import { parseSendAt } from "../../../lib/crm/vienna";

export const dynamic = "force-dynamic";

const STATUSES = new Set(["needs_review", "scheduled", "sending", "sent", "failed", "uncertain"]);

/** GET /api/crm/emails?status= — очередь писем. fair_visits.email_sent сюда не входит. */
export async function GET(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ emails: [] });
  const status = req.nextUrl.searchParams.get("status");
  const rows = status && STATUSES.has(status)
    ? await sql`
        SELECT e.id, e.lead_id, e.to_email, e.subject, e.body, e.lang, e.status,
               to_char(e.send_at AT TIME ZONE 'Europe/Vienna', 'YYYY-MM-DD HH24:MI') AS send_vienna,
               to_char(e.created_at AT TIME ZONE 'Europe/Vienna', 'YYYY-MM-DD HH24:MI') AS created_vienna,
               l.business_name,
               (SELECT fv.event FROM fair_visits fv WHERE fv.lead_id = e.lead_id ORDER BY fv.updated_at DESC LIMIT 1) AS event
        FROM emails e JOIN leads l ON l.id = e.lead_id
        WHERE e.status = ${status}
        ORDER BY e.created_at DESC LIMIT 40`
    : await sql`
        SELECT e.id, e.lead_id, e.to_email, e.subject, e.body, e.lang, e.status,
               to_char(e.send_at AT TIME ZONE 'Europe/Vienna', 'YYYY-MM-DD HH24:MI') AS send_vienna,
               to_char(e.created_at AT TIME ZONE 'Europe/Vienna', 'YYYY-MM-DD HH24:MI') AS created_vienna,
               l.business_name,
               (SELECT fv.event FROM fair_visits fv WHERE fv.lead_id = e.lead_id ORDER BY fv.updated_at DESC LIMIT 1) AS event
        FROM emails e JOIN leads l ON l.id = e.lead_id
        ORDER BY e.created_at DESC LIMIT 40`;
  return Response.json({ emails: rows });
}

/** Правка, снятие с очереди, явное планирование или отправка одной строки. */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена" }, { status: 500 });
  const b = await req.json();
  const id = Number(b.id);
  const action = String(b.action || "");
  if (!id) return Response.json({ error: "Нет id" }, { status: 400 });

  if (action === "save") {
    const subject = String(b.subject || "").trim();
    const body = String(b.body || "").trim();
    if (!subject || !body) return Response.json({ error: "Пустой текст" }, { status: 400 });
    const rows = await sql`
      UPDATE emails SET subject = ${subject}, body = ${body}
      WHERE id = ${id} AND status IN ('needs_review', 'scheduled', 'failed')
      RETURNING id, status`;
    if (!rows[0]) return Response.json({ error: "Эту строку уже нельзя править" }, { status: 409 });
    return Response.json({ ok: true, email: rows[0] });
  }

  if (action === "cancel") {
    const cancelled = await cancelScheduledEmail(id);
    if (!cancelled) return Response.json({ error: "В очереди такого письма нет" }, { status: 409 });
    return Response.json({ ok: true, id: cancelled, status: "needs_review" });
  }

  if (action === "schedule") {
    const existing = (await sql`SELECT lang FROM emails WHERE id = ${id}`) as unknown as { lang: string }[];
    if (existing[0] && !canSendLang(existing[0].lang)) {
      return Response.json({ error: "Английский черновик не ставится в отправку: подписи для него нет." }, { status: 400 });
    }
    const sendAt = parseSendAt(b.send_at);
    if (!sendAt || sendAt.getTime() < Date.now() + 60_000) return Response.json({ error: "Нужна будущая дата" }, { status: 400 });
    const row = await scheduleExistingEmail(id, sendAt);
    if (!row) return Response.json({ error: "Это письмо нельзя запланировать" }, { status: 409 });
    return Response.json({ ok: true, ...row });
  }

  if (action === "send") {
    const rows = (await sql`
      SELECT id, lead_id, to_email, subject, body, lang, status FROM emails
      WHERE id = ${id} AND status IN ('needs_review', 'failed')`) as unknown as
      { id: number; lead_id: number; to_email: string; subject: string; body: string; lang: string; status: string }[];
    const row = rows[0];
    if (!row) return Response.json({ error: "Отправлять можно только черновик или сбой" }, { status: 409 });
    if (!canSendLang(row.lang)) {
      return Response.json({ error: "Английский черновик не отправляется: подпись есть только для немецкого и русского." }, { status: 400 });
    }
    const { gmailId } = await sendLeadEmail(row.lead_id, {
      to: row.to_email,
      subject: row.subject,
      body: row.body,
      lang: row.lang,
    }, { emailRowId: row.id });
    return Response.json({ ok: true, gmail_id: gmailId });
  }

  return Response.json({ error: "Неизвестное действие" }, { status: 400 });
}
