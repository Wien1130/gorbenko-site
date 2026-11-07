import { getSql, fetchLead, fetchPitchByLead } from "./db";
import { sendGmail } from "./gmail";
import { withSignature } from "./ai";
import { buildEmailHtml } from "./email-html";
import { pitchUrl, withUtm } from "./pitch";

export type OutgoingEmail = { to: string; subject: string; body: string; lang: "ru" | "de" };

/** Колонка отложенной отправки — идемпотентно, чтобы не ждать ручной миграции. */
export async function ensureEmailSchedule() {
  const sql = getSql();
  if (!sql) return;
  await sql`ALTER TABLE emails ADD COLUMN IF NOT EXISTS send_at timestamptz`;
}

/**
 * Реальная отправка письма лиду через Gmail Андрея: подпись, HTML, ссылка на персональную страницу (с UTM),
 * запись в emails/activities, дозапись contact_email. Используется и кнопкой «Отправить», и cron'ом для отложенных.
 */
export async function sendLeadEmail(leadId: number, mail: OutgoingEmail, opts?: { emailRowId?: number }) {
  const sql = getSql();
  if (!sql) throw new Error("База не подключена");
  const lead = await fetchLead(leadId);
  if (!lead) throw new Error("Лид не найден");

  const pitch = await fetchPitchByLead(leadId);
  const link = pitch && pitch.status === "published" ? withUtm(pitchUrl(pitch.slug), pitch.slug, "email") : undefined;
  const bodyWithLink = link && !mail.body.includes(`/p/${pitch!.slug}`) ? `${mail.body}\n\n${link}` : mail.body;
  const fullBody = withSignature(bodyWithLink, mail.lang);
  const html = buildEmailHtml({ body: bodyWithLink, lang: mail.lang, pitchUrl: link, businessName: lead.business_name });
  const { id: gmailId } = await sendGmail({ to: mail.to, subject: mail.subject, body: fullBody, html });

  if (opts?.emailRowId) {
    await sql`UPDATE emails SET status = 'sent', gmail_id = ${gmailId}, body = ${fullBody} WHERE id = ${opts.emailRowId}`;
  } else {
    await sql`INSERT INTO emails (lead_id, to_email, subject, body, lang, status, gmail_id)
      VALUES (${leadId}, ${mail.to}, ${mail.subject}, ${fullBody}, ${mail.lang}, 'sent', ${gmailId})`;
  }
  await sql`INSERT INTO activities (lead_id, kind, entry_type, stage_after, summary)
    VALUES (${leadId}, 'email', 'followup', ${lead.stage}, ${"Отправлено письмо: " + mail.subject})`;
  if (mail.to && !lead.contact_email) {
    await sql`UPDATE leads SET contact_email = ${mail.to}, updated_at = now() WHERE id = ${leadId}`;
  }
  return { gmailId, lead };
}

/** Отложить письмо: лежит в emails со status='scheduled', cron отправит, когда send_at наступит. */
export async function scheduleLeadEmail(leadId: number, mail: OutgoingEmail, sendAt: Date) {
  const sql = getSql();
  if (!sql) throw new Error("База не подключена");
  const lead = await fetchLead(leadId);
  if (!lead) throw new Error("Лид не найден");
  await ensureEmailSchedule();
  const rows = (await sql`INSERT INTO emails (lead_id, to_email, subject, body, lang, status, gmail_id, send_at)
    VALUES (${leadId}, ${mail.to}, ${mail.subject}, ${mail.body}, ${mail.lang}, 'scheduled', '', ${sendAt.toISOString()})
    RETURNING id`) as unknown as { id: number }[];
  const when = sendAt.toLocaleString("ru-RU", { timeZone: "Europe/Vienna", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  await sql`INSERT INTO activities (lead_id, kind, entry_type, stage_after, summary)
    VALUES (${leadId}, 'email', 'followup', ${lead.stage}, ${`Письмо запланировано на ${when}: ${mail.subject}`})`;
  return { id: rows[0].id, when };
}

/** Отправить все отложенные письма, у которых пришло время. Вызывается из cron. */
export async function sendDueScheduledEmails(limit = 10) {
  const sql = getSql();
  if (!sql) return { checked: 0, sent: 0, failed: [] as string[] };
  await ensureEmailSchedule();
  const due = (await sql`
    SELECT id, lead_id, to_email, subject, body, lang FROM emails
    WHERE status = 'scheduled' AND send_at IS NOT NULL AND send_at <= now()
    ORDER BY send_at LIMIT ${limit}`) as unknown as
    { id: number; lead_id: number; to_email: string; subject: string; body: string; lang: string }[];
  let sent = 0;
  const failed: string[] = [];
  for (const e of due) {
    try {
      await sendLeadEmail(e.lead_id, { to: e.to_email, subject: e.subject, body: e.body, lang: e.lang === "ru" ? "ru" : "de" }, { emailRowId: e.id });
      sent++;
    } catch (err) {
      const msg = String(err instanceof Error ? err.message : err);
      await sql`UPDATE emails SET status = 'failed', gmail_id = ${("ERR: " + msg).slice(0, 200)} WHERE id = ${e.id}`;
      failed.push(`#${e.id} → ${e.to_email}: ${msg}`);
    }
  }
  return { checked: due.length, sent, failed };
}
