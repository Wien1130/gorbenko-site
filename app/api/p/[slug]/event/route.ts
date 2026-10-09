import { NextRequest } from "next/server";
import { getSql, fetchPitchBySlug } from "../../../../lib/crm/db";
import { sendTelegramNotify } from "../../../../lib/crm/notify";

/**
 * POST /api/p/<slug>/event — публичный трекинг персональной страницы.
 * Хранится: вид события, UTM, грубый referrer, тип браузера (обрезанный UA). IP НЕ сохраняется.
 * kind=form — заявка с формы: уходит в CRM как activity + Telegram Андрею.
 */
export async function POST(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!/^[a-z0-9]{6,20}$/.test(slug)) return Response.json({ ok: false }, { status: 400 });
  const sql = getSql();
  if (!sql) return Response.json({ ok: false }, { status: 500 });

  const pitch = await fetchPitchBySlug(slug);
  if (!pitch) return Response.json({ ok: false }, { status: 404 });

  const b = await req.json().catch(() => ({}));
  const kind = String(b.kind ?? "view");
  if (!["view", "cta_whatsapp", "cta_call", "cta_site", "form"].includes(kind)) return Response.json({ ok: false }, { status: 400 });

  const s = (v: unknown, max = 200) => String(v ?? "").slice(0, max);
  const ua = s(req.headers.get("user-agent"), 120);
  const referrer = s(b.referrer ?? req.headers.get("referer"), 200);

  let payload: Record<string, string> | null = null;
  if (kind === "form") {
    payload = { name: s(b.name, 120), contact: s(b.contact, 160), message: s(b.message, 600) };
    if (!payload.contact && !payload.message) return Response.json({ ok: false, error: "empty" }, { status: 400 });
  } else if (b.target) {
    payload = { target: s(b.target, 200) };
  }

  await sql`INSERT INTO pitch_events (pitch_id, kind, utm_source, utm_medium, utm_campaign, referrer, user_agent, payload)
    VALUES (${pitch.id}, ${kind}, ${s(b.utm_source, 60)}, ${s(b.utm_medium, 60)}, ${s(b.utm_campaign, 80)}, ${referrer}, ${ua}, ${payload ? JSON.stringify(payload) : null}::jsonb)`;

  if (kind === "form" && payload) {
    const summary = `Заявка со страницы /p/${slug}: ${payload.name || "—"} · ${payload.contact || "—"} · ${payload.message || ""}`.slice(0, 500);
    await sql`INSERT INTO activities (lead_id, kind, entry_type, stage_after, summary)
      VALUES (${pitch.lead_id}, 'note', 'followup', ${""}, ${summary})`;
    await sql`INSERT INTO reminders (lead_id, due_at, text) VALUES (${pitch.lead_id}, now(), ${"Ответить на заявку со страницы: " + pitch.business_name})`;
    await sendTelegramNotify(
      `🔥 Заявка с персональной страницы!\n\n🏪 ${pitch.business_name}\n👤 ${payload.name || "—"}\n📞 ${payload.contact || "—"}\n💬 ${payload.message || "—"}\n\nhttps://gorbenko.at/crm/lead/${pitch.lead_id}`,
    );
  } else if (kind === "view") {
    // первый просмотр — короткий пинг Андрею (вау-момент: клиент открыл)
    const prev = await sql`SELECT count(*)::int AS n FROM pitch_events WHERE pitch_id = ${pitch.id} AND kind = 'view'`;
    if ((prev[0] as { n: number }).n === 1) {
      await sendTelegramNotify(`👁 ${pitch.business_name} открыл(а) персональную страницу.\nhttps://gorbenko.at/crm/lead/${pitch.lead_id}`);
    }
  }

  return Response.json({ ok: true });
}
