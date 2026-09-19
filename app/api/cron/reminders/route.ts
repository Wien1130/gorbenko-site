import { NextRequest } from "next/server";
import { getSql } from "../../../lib/crm/db";
import { sendTelegramNotify } from "../../../lib/crm/notify";

export const maxDuration = 30;

/**
 * GET /api/cron/reminders — Vercel Cron (см. vercel.json).
 * Шлёт в Telegram напоминания, у которых подошло время, и помечает их notified.
 * Повторный пинг — если напоминание висит notified больше 2 дней и не закрыто.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const sql = getSql();
  if (!sql) return Response.json({ error: "no db" }, { status: 500 });

  const due = (await sql`
    SELECT r.id, r.text, r.due_at, r.status, l.id AS lead_id, l.business_name, l.stage
    FROM reminders r LEFT JOIN leads l ON l.id = r.lead_id
    WHERE (r.status = 'pending' AND r.due_at <= now())
       OR (r.status = 'notified' AND r.due_at <= now() - interval '2 days')
    ORDER BY r.due_at LIMIT 20`) as unknown as {
    id: number; text: string; due_at: string; status: string;
    lead_id: number | null; business_name: string | null; stage: string | null;
  }[];

  let sent = 0;
  for (const r of due) {
    const repeat = r.status === "notified" ? "🔁 ВИСИТ 2+ ДНЯ: " : "⏰ ";
    const lines = [
      `${repeat}${r.text}`,
      r.business_name ? `Лид: ${r.business_name} (${r.stage})` : "",
      r.lead_id ? `https://gorbenko.at/crm/lead/${r.lead_id}` : "https://gorbenko.at/crm",
    ].filter(Boolean);
    const ok = await sendTelegramNotify(lines.join("\n"));
    if (ok) {
      // после повторного пинга закрываем, чтобы не спамить бесконечно
      if (r.status === "notified") {
        await sql`UPDATE reminders SET status = 'done' WHERE id = ${r.id}`;
      } else {
        await sql`UPDATE reminders SET status = 'notified' WHERE id = ${r.id}`;
      }
      sent++;
    }
  }

  return Response.json({ checked: due.length, sent });
}
