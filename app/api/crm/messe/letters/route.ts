import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../../lib/crm/api-auth";
import { draftMesseLetters } from "../../../../lib/crm/messe/letters";
import { EMAIL_SIGNATURE_DE, EMAIL_SIGNATURE_RU } from "../../../../lib/crm/ai";
import { weekdayDe } from "../../../../lib/crm/vienna";

export const maxDuration = 60;

/** POST /api/crm/messe/letters — два письма с выставки (сразу + на дату) одним вызовом Claude. */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const b = await req.json();
  const secondDate = String(b.second_date || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(secondDate)) return Response.json({ error: "Нет даты второго письма" }, { status: 400 });
  const weekday = weekdayDe(secondDate);
  const lang = b.lang === "ru" ? "ru" : b.lang === "en" ? "en" : "de";
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
      secondWeekdayDe: lang === "de" ? `am ${weekday}` : weekday,
      talkDateLabel: String(b.talk_date || ""),
      lang,
    });
    const signature = lang === "ru" ? EMAIL_SIGNATURE_RU : lang === "de" ? EMAIL_SIGNATURE_DE : "";
    const limit = lang === "en"
      ? "Английский черновик не отправляется: подпись и HTML есть только для немецкого и русского."
      : "";
    return Response.json({ ...letters, signature, lang, send_ready: lang !== "en", limit });
  } catch (e) {
    console.error("messe letters error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
