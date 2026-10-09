import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../lib/crm/api-auth";
import { fetchLead, fetchActivities, fetchPitchByLead } from "../../../lib/crm/db";
import { draftEmail, EMAIL_SIGNATURE_RU, EMAIL_SIGNATURE_DE } from "../../../lib/crm/ai";
import { pitchUrl, withUtm } from "../../../lib/crm/pitch";

export const maxDuration = 60;

/** POST /api/crm/email — сгенерировать/переписать черновик письма для лида. По умолчанию — немецкий. */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();

  const b = await req.json();
  const lead = await fetchLead(Number(b.lead_id));
  if (!lead) return Response.json({ error: "Лид не найден" }, { status: 404 });

  const lang: "ru" | "de" = b.lang === "ru" ? "ru" : "de";

  try {
    const [activities, pitch] = await Promise.all([fetchActivities(lead.id), fetchPitchByLead(lead.id)]);
    const link = pitch && pitch.status === "published" ? withUtm(pitchUrl(pitch.slug), pitch.slug, "email") : undefined;
    const draft = await draftEmail({
      lead,
      activities,
      lang,
      instruction: b.instruction || undefined,
      priorDraft: b.prior_subject && b.prior_body ? { subject: b.prior_subject, body: b.prior_body } : undefined,
      pitchUrl: link,
    });
    return Response.json({
      ...draft,
      lang,
      signature: lang === "de" ? EMAIL_SIGNATURE_DE : EMAIL_SIGNATURE_RU,
      to: lead.contact_email,
      pitch_url: link ?? "",
    });
  } catch (e) {
    console.error("crm email draft error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
