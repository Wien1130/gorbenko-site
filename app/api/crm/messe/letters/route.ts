import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../../lib/crm/api-auth";
import { draftMesseLetters } from "../../../../lib/crm/messe/letters";
import { EMAIL_SIGNATURE_DE } from "../../../../lib/crm/ai";
import { weekdayDe } from "../../../../lib/crm/vienna";

export const maxDuration = 60;

/** POST /api/crm/messe/letters — два письма с выставки (сразу + на дату) одним вызовом Claude. */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const b = await req.json();
  const secondDate = String(b.second_date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(secondDate)) return Response.json({ error: "Нет даты второго письма" }, { status: 400 });
  const weekday = weekdayDe(secondDate);
  try {
    const letters = await draftMesseLetters({
      fairTitle: String(b.fair_title || ""),
      venue: String(b.venue || ""),
      booth: String(b.booth || ""),
      exhibitor: String(b.exhibitor || ""),
      city: String(b.city || ""),
      offer: String(b.offer || ""),
      openingDe: String(b.opening_de || ""),
      contactName: String(b.contact_name || ""),
      talk: String(b.talk || ""),
      secondDate,
      secondWeekdayDe: `am ${weekday}`,
      talkDateLabel: String(b.talk_date || ""),
    });
    return Response.json({ ...letters, signature: EMAIL_SIGNATURE_DE });
  } catch (e) {
    console.error("messe letters error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
