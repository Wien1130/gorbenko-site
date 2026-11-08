import { getSql, fetchLead, fetchPitchByLead } from "./db";
import { sendGmail } from "./gmail";
import { withSignature } from "./ai";
import { buildEmailHtml } from "./email-html";
import { pitchUrl, withUtm } from "./pitch";
import { formatVienna } from "./vienna";

/** Gmail письмо принял, а запись в базе не подтвердилась. Повторно само не отправлять. */
export class EmailPersistError extends Error {
  readonly gmailId: string;
  constructor(message: string, gmailId: string) {
    super(message);
    this.name = "EmailPersistError";
    this.gmailId = gmailId;
  }
}

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

  try {
    if (opts?.emailRowId) {
      await sql`UPDATE emails SET status = 'sent', gmail_id = ${gmailId}, body = ${fullBody} WHERE id = ${opts.emailRowId}`;
    } else {
      await sql`INSERT INTO emails (lead_id, to_email, subject, body, lang, status, gmail_id)
        VALUES (${leadId}, ${mail.to}, ${mail.subject}, ${fullBody}, ${mail.lang}, 'sent', ${gmailId})`;
    }
  } catch (err) {
    const message = String(err instanceof Error ? err.message : err);
    try {
      if (opts?.emailRowId) {
        await sql`UPDATE emails SET status = 'uncertain', gmail_id = ${gmailId} WHERE id = ${opts.emailRowId}`;
      } else {
        await sql`INSERT INTO emails (lead_id, to_email, subject, body, lang, status, gmail_id)
          VALUES (${leadId}, ${mail.to}, ${mail.subject}, ${fullBody}, ${mail.lang}, 'uncertain', ${gmailId})`;
      }
    } catch {
      /* строка могла остаться в sending — очередь показывает её отдельно */
    }
    throw new EmailPersistError(message, gmailId);
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
  const when = formatVienna(sendAt);
  await sql`INSERT INTO activities (lead_id, kind, entry_type, stage_after, summary)
    VALUES (${leadId}, 'email', 'followup', ${lead.stage}, ${`Письмо запланировано на ${when}: ${mail.subject}`})`;
  return { id: rows[0].id, when };
}

/** Черновик «нужно обдумать»: cron его не берёт. Повтор того же текста за 12 часов не плодит строку. */
export async function holdLeadEmail(leadId: number, mail: OutgoingEmail) {
  const sql = getSql();
  if (!sql) throw new Error("База не подключена");
  const lead = await fetchLead(leadId);
  if (!lead) throw new Error("Лид не найден");
  await ensureEmailSchedule();
  const existing = (await sql`
    SELECT id FROM emails
    WHERE lead_id = ${leadId} AND subject = ${mail.subject} AND status = 'needs_review'
      AND created_at > now() - interval '12 hours'
    ORDER BY id DESC LIMIT 1`) as unknown as { id: number }[];
  if (existing[0]) return { id: existing[0].id, duplicate: true };
  const rows = (await sql`INSERT INTO emails (lead_id, to_email, subject, body, lang, status, gmail_id, send_at)
    VALUES (${leadId}, ${mail.to}, ${mail.subject}, ${mail.body}, ${mail.lang}, 'needs_review', '', NULL)
    RETURNING id`) as unknown as { id: number }[];
  await sql`INSERT INTO activities (lead_id, kind, entry_type, stage_after, summary)
    VALUES (${leadId}, 'email', 'followup', ${lead.stage}, ${`Письмо сохранено на проверку: ${mail.subject}`})`;
  return { id: rows[0].id, duplicate: false };
}

/** Явно поставить уже сохранённое письмо на дату. sent/sending/uncertain не трогает. */
export async function scheduleExistingEmail(emailId: number, sendAt: Date) {
  const sql = getSql();
  if (!sql) throw new Error("База не подключена");
  await ensureEmailSchedule();
  const rows = (await sql`
    UPDATE emails SET status = 'scheduled', send_at = ${sendAt.toISOString()}
    WHERE id = ${emailId} AND status IN ('needs_review', 'scheduled', 'failed')
    RETURNING id, lead_id, subject`) as unknown as { id: number; lead_id: number; subject: string }[];
  if (!rows[0]) return null;
  const when = formatVienna(sendAt);
  const lead = await fetchLead(rows[0].lead_id);
  await sql`INSERT INTO activities (lead_id, kind, entry_type, stage_after, summary)
    VALUES (${rows[0].lead_id}, 'email', 'followup', ${lead?.stage ?? ""}, ${`Письмо запланировано на ${when}: ${rows[0].subject}`})`;
  return { id: rows[0].id, when };
}

/** Снять с автоотправки, не удаляя текст. */
export async function cancelScheduledEmail(emailId: number) {
  const sql = getSql();
  if (!sql) throw new Error("База не подключена");
  const rows = (await sql`
    UPDATE emails SET status = 'needs_review', send_at = NULL
    WHERE id = ${emailId} AND status = 'scheduled'
    RETURNING id`) as unknown as { id: number }[];
  return rows[0]?.id ?? null;
}

/**
 * Забрать пачку отложенных писем и отправить.
 * Сначала статус sending, чтобы второй cron не взял ту же строку.
 * Если Gmail принял письмо, а база не записала sent — статус uncertain, без слепого повтора.
 */
export async function sendDueScheduledEmails(limit = 10) {
  const sql = getSql();
  if (!sql) return { checked: 0, sent: 0, failed: [] as string[], uncertain: [] as number[] };
  await ensureEmailSchedule();
  const due = (await sql`
    WITH due AS (
      SELECT id FROM emails
      WHERE status = 'scheduled' AND send_at IS NOT NULL AND send_at <= now()
      ORDER BY send_at
      LIMIT ${limit}
      FOR UPDATE SKIP LOCKED
    )
    UPDATE emails AS e
    SET status = 'sending'
    FROM due
    WHERE e.id = due.id
    RETURNING e.id, e.lead_id, e.to_email, e.subject, e.body, e.lang`) as unknown as
    { id: number; lead_id: number; to_email: string; subject: string; body: string; lang: string }[];
  let sent = 0;
  const failed: string[] = [];
  const uncertain: number[] = [];
  for (const e of due) {
    try {
      await sendLeadEmail(e.lead_id, { to: e.to_email, subject: e.subject, body: e.body, lang: e.lang === "ru" ? "ru" : "de" }, { emailRowId: e.id });
      sent++;
    } catch (err) {
      if (err instanceof EmailPersistError) {
        uncertain.push(e.id);
        continue;
      }
      const msg = String(err instanceof Error ? err.message : err);
      await sql`UPDATE emails SET status = 'failed', gmail_id = ${("ERR: " + msg).slice(0, 200)} WHERE id = ${e.id} AND status = 'sending'`;
      failed.push(`#${e.id}: ${msg}`);
    }
  }
  return { checked: due.length, sent, failed, uncertain };
}
