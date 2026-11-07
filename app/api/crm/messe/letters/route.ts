import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../../lib/crm/api-auth";
import { draftMesseLetters } from "../../../../lib/crm/messe/letters";
import { EMAIL_SIGNATURE_DE } from "../../../../lib/crm/ai";

export const maxDuration = 60;

/** POST /api/crm/messe/letters — два письма с выставки (сразу + на дату) одним вызовом Claude. */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const b = await req.json();
  const secondDate = String(b.second_date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(secondDate)) return Response.json({ error: "Нет даты второго письма" }, { status: 400 });
  const weekday = new Date(`${secondDate}T12:00:00`).toLocaleDateString("de-AT", { weekday: "long" });
  try {
    const letters = await draftMesseLetters({
      fairTitle: String(b.fair_title || "BLICKFANG Wien 2026"),
      booth: String(b.booth || ""),
      exhibitor: String(b.exhibitor || ""),
      city: String(b.city || ""),
      offer: String(b.offer || ""),
      openingDe: String(b.opening_de || ""),
      contactName: String(b.contact_name || ""),
      talk: String(b.talk || ""),
      secondDate,
      secondWeekdayDe: `am ${weekday}`,
    });
    return Response.json({ ...letters, signature: EMAIL_SIGNATURE_DE });
  } catch (e) {
    console.error("messe letters error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
