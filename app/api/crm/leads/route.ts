import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../lib/crm/api-auth";
import { getSql, fetchLeads } from "../../../lib/crm/db";
import { createCalendarEvent } from "../../../lib/crm/gmail";

export async function GET() {
  if (!(await isCrmAuthed())) return unauthorized();
  return Response.json({ leads: await fetchLeads() });
}

/** POST /api/crm/leads — сохранение ПОДТВЕРЖДЁННОЙ карточки захода (после экрана проверки). */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена (DATABASE_URL)" }, { status: 500 });

  const b = await req.json();
  const businessName = (b.business_name ?? "").trim();
  if (!businessName) return Response.json({ error: "Пустое название бизнеса" }, { status: 400 });

  const dealAmount = Number(b.deal_amount) || 0;
  const matchedId: number | null = b.matched_lead_id ? Number(b.matched_lead_id) : null;

  try {
    let leadId: number;
    let entryType = "cold_touch";

    if (matchedId) {
      entryType = "followup";
      // Обновляем существующий лид: новые непустые значения перекрывают старые
      await sql`
        UPDATE leads SET
          business_name = ${businessName},
          business_type = ${b.business_type ?? "other"},
          stage = ${b.stage ?? "warm_followup"},
          address = CASE WHEN ${b.address ?? ""} <> '' THEN ${b.address ?? ""} ELSE address END,
          contact_name = CASE WHEN ${b.contact_name ?? ""} <> '' THEN ${b.contact_name ?? ""} ELSE contact_name END,
          contact_email = CASE WHEN ${b.contact_email ?? ""} <> '' THEN ${b.contact_email ?? ""} ELSE contact_email END,
          contact_phone = CASE WHEN ${b.contact_phone ?? ""} <> '' THEN ${b.contact_phone ?? ""} ELSE contact_phone END,
          next_action = ${b.next_action ?? ""},
          meeting_datetime = CASE WHEN ${b.meeting_datetime ?? ""} <> '' THEN ${b.meeting_datetime ?? ""} ELSE meeting_datetime END,
          deal_amount = CASE WHEN ${dealAmount} > 0 THEN ${dealAmount} ELSE deal_amount END,
          updated_at = now()
        WHERE id = ${matchedId}`;
      leadId = matchedId;
    } else {
      const inserted = await sql`
        INSERT INTO leads (business_name, business_type, stage, address, contact_name, contact_email, contact_phone, next_action, meeting_datetime, deal_amount, notes)
        VALUES (${businessName}, ${b.business_type ?? "other"}, ${b.stage ?? "warm_followup"}, ${b.address ?? ""}, ${b.contact_name ?? ""}, ${b.contact_email ?? ""}, ${b.contact_phone ?? ""}, ${b.next_action ?? ""}, ${b.meeting_datetime ?? ""}, ${dealAmount}, ${b.notes ?? ""})
        RETURNING id`;
      leadId = (inserted[0] as { id: number }).id;
    }

    await sql`
      INSERT INTO activities (lead_id, kind, entry_type, stage_after, transcript, summary, photo_url)
      VALUES (${leadId}, ${b.kind ?? "visit"}, ${entryType}, ${b.stage ?? ""}, ${b.transcript ?? ""}, ${b.summary ?? ""}, ${b.photo_url ?? ""})`;

    if (b.reminder_date) {
      const text = (b.reminder_text ?? "") || (b.next_action ?? "") || `Follow-up: ${businessName}`;
      // 09:00 по Вене = 07:00 UTC (лето) — час не критичен, cron шлёт ближайшим прогоном
      await sql`INSERT INTO reminders (lead_id, due_at, text) VALUES (${leadId}, ${b.reminder_date + "T07:00:00Z"}, ${text})`;
    }

    let calendarAdded = false;
    if (b.stage === "meeting_confirmed" && b.meeting_datetime) {
      calendarAdded = await createCalendarEvent({
        businessName,
        meetingDatetime: b.meeting_datetime,
        notes: b.summary ?? "",
      });
    }

    return Response.json({ lead_id: leadId, entry_type: entryType, calendar_added: calendarAdded });
  } catch (e) {
    console.error("crm save lead error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
