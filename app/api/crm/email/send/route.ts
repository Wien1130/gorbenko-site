import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../../lib/crm/api-auth";
import { getSql } from "../../../../lib/crm/db";
import { scheduleLeadEmail, sendLeadEmail } from "../../../../lib/crm/send-email";

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
    const sendAt = parseSendAt(b.send_at);
    if (sendAt && sendAt.getTime() > Date.now() + 60_000) {
      const r = await scheduleLeadEmail(leadId, { to, subject, body, lang }, sendAt);
      return Response.json({ ok: true, scheduled: true, email_id: r.id, send_at: sendAt.toISOString(), when: r.when });
    }
    const { gmailId } = await sendLeadEmail(leadId, { to, subject, body, lang });
    return Response.json({ ok: true, gmail_id: gmailId });
  } catch (e) {
    console.error("crm email send error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}

/** "2026-11-12" → 09:00 по Вене того дня; полный ISO — как есть. */
function parseSendAt(v: unknown): Date | null {
  if (typeof v !== "string" || !v.trim()) return null;
  const s = v.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T09:00:00+01:00`);
    // летом Вена +02:00 — сдвиг на час не критичен для утреннего письма, но поправим
    const m = Number(s.slice(5, 7));
    if (m >= 4 && m <= 10) d.setHours(d.getHours() - 1);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}
