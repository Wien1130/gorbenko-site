import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../lib/crm/api-auth";
import { fetchLead, fetchActivities } from "../../../lib/crm/db";
import { draftEmail, EMAIL_SIGNATURE_RU, EMAIL_SIGNATURE_DE } from "../../../lib/crm/ai";

export const maxDuration = 60;

/** POST /api/crm/email — сгенерировать/переписать черновик письма для лида. */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();

  const b = await req.json();
  const lead = await fetchLead(Number(b.lead_id));
  if (!lead) return Response.json({ error: "Лид не найден" }, { status: 404 });

  const lang: "ru" | "de" = b.lang === "de" ? "de" : "ru";

  try {
    const activities = await fetchActivities(lead.id);
    const draft = await draftEmail({
      lead,
      activities,
      lang,
      instruction: b.instruction || undefined,
      priorDraft: b.prior_subject && b.prior_body ? { subject: b.prior_subject, body: b.prior_body } : undefined,
    });
    return Response.json({
      ...draft,
      lang,
      signature: lang === "de" ? EMAIL_SIGNATURE_DE : EMAIL_SIGNATURE_RU,
      to: lead.contact_email,
    });
  } catch (e) {
    console.error("crm email draft error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
