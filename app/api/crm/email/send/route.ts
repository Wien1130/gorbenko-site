import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../../lib/crm/api-auth";
import { getSql, fetchLead, fetchPitchByLead } from "../../../../lib/crm/db";
import { sendGmail } from "../../../../lib/crm/gmail";
import { withSignature } from "../../../../lib/crm/ai";
import { buildEmailHtml } from "../../../../lib/crm/email-html";
import { pitchUrl, withUtm } from "../../../../lib/crm/pitch";

export const maxDuration = 30;

/** POST /api/crm/email/send — реальная отправка письма через Gmail Андрея (текст + HTML). */
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

  const lead = await fetchLead(leadId);
  if (!lead) return Response.json({ error: "Лид не найден" }, { status: 404 });

  try {
    const pitch = await fetchPitchByLead(leadId);
    const link = pitch && pitch.status === "published" ? withUtm(pitchUrl(pitch.slug), pitch.slug, "email") : undefined;
    // Если страница есть, а в тексте ссылки нет — добавим строкой перед подписью (UTM-версия).
    const bodyWithLink = link && !body.includes(`/p/${pitch!.slug}`) ? `${body}\n\n${link}` : body;
    const fullBody = withSignature(bodyWithLink, lang);
    const html = buildEmailHtml({ body: bodyWithLink, lang, pitchUrl: link, businessName: lead.business_name });
    const { id: gmailId } = await sendGmail({ to, subject, body: fullBody, html });

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
