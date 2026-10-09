import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../lib/crm/api-auth";
import { fetchLead, fetchActivities, fetchPitchByLead, fetchPitchEvents, upsertPitch, getSql } from "../../../lib/crm/db";
import { generatePitch } from "../../../lib/crm/ai";
import { newPitchSlug, pitchUrl, sanitizePitch, defaultFocus, withUtm } from "../../../lib/crm/pitch";
import type { PitchContent, PitchFocus } from "../../../lib/crm/types";

export const maxDuration = 60;

function focusOf(v: unknown, fallback: PitchFocus): PitchFocus {
  return v === "catering" || v === "gastro" || v === "general" ? v : fallback;
}

/** Готовые ссылки для кнопок в CRM. */
function links(slug: string, businessName: string, contactName: string) {
  const url = pitchUrl(slug);
  const greet = contactName ? `Hallo ${contactName},` : "Hallo,";
  const wa = `${greet} danke für das Gespräch heute. Wie versprochen — eine Seite, die ich speziell für ${businessName} vorbereitet habe:\n${withUtm(url, slug, "wa")}\n\nBeste Grüße, Andrii Gorbenko`;
  return { url, wa_text: wa };
}

/** GET /api/crm/pitch?lead_id= — текущая страница лида + события. */
export async function GET(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const leadId = Number(req.nextUrl.searchParams.get("lead_id"));
  if (!leadId) return Response.json({ error: "lead_id?" }, { status: 400 });
  const [lead, pitch] = await Promise.all([fetchLead(leadId), fetchPitchByLead(leadId)]);
  if (!lead) return Response.json({ error: "Лид не найден" }, { status: 404 });
  if (!pitch) return Response.json({ pitch: null, events: [], focus: defaultFocus(lead.business_type) });
  const events = await fetchPitchEvents(pitch.id);
  return Response.json({ pitch, events, ...links(pitch.slug, lead.business_name, lead.contact_name) });
}

/** POST /api/crm/pitch — сгенерировать (или переписать) контент. Не сохраняет. */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const b = await req.json();
  const lead = await fetchLead(Number(b.lead_id));
  if (!lead) return Response.json({ error: "Лид не найден" }, { status: 404 });
  const focus = focusOf(b.focus, defaultFocus(lead.business_type));
  try {
    const activities = await fetchActivities(lead.id);
    const raw = await generatePitch({
      lead,
      activities,
      focus,
      instruction: b.instruction || undefined,
      prior: b.prior as PitchContent | undefined,
    });
    const { content, flags } = sanitizePitch(raw);
    return Response.json({ content, focus, flags });
  } catch (e) {
    console.error("crm pitch generate error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}

/** PUT /api/crm/pitch — сохранить/опубликовать контент. Возвращает ссылку. */
export async function PUT(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена" }, { status: 500 });
  const b = await req.json();
  const lead = await fetchLead(Number(b.lead_id));
  if (!lead) return Response.json({ error: "Лид не найден" }, { status: 404 });
  const content = b.content as PitchContent | undefined;
  if (!content || !content.headline) return Response.json({ error: "Пустой контент" }, { status: 400 });
  const focus = focusOf(b.focus, defaultFocus(lead.business_type));
  const status: "draft" | "published" = b.status === "draft" ? "draft" : "published";

  try {
    const existing = await fetchPitchByLead(lead.id);
    const slug = existing?.slug ?? newPitchSlug();
    const { content: clean } = sanitizePitch(content);
    const pitch = await upsertPitch({ leadId: lead.id, slug, focus, content: clean, status });
    if (!existing || existing.status !== "published") {
      if (status === "published") {
        await sql`INSERT INTO activities (lead_id, kind, entry_type, stage_after, summary)
          VALUES (${lead.id}, 'note', 'followup', ${lead.stage}, ${"Опубликована персональная страница: " + pitchUrl(slug)})`;
      }
    }
    return Response.json({ pitch, ...links(slug, lead.business_name, lead.contact_name) });
  } catch (e) {
    console.error("crm pitch save error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}