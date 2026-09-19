import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../lib/crm/api-auth";
import { transcribeAudio } from "../../../lib/crm/transcribe";
import { uploadPhoto } from "../../../lib/crm/photos";
import { parseVisit } from "../../../lib/crm/ai";
import { getSql, fetchLead } from "../../../lib/crm/db";
import type { Lead } from "../../../lib/crm/types";

export const maxDuration = 60;

/**
 * POST /api/crm/capture — принимает голос/фото/текст/кнопку-исход,
 * возвращает разобранную AI карточку (НЕ сохраняет — сохранение после подтверждения).
 */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();

  const form = await req.formData();
  const audio = form.get("audio") as File | null;
  const photo = form.get("photo") as File | null;
  const typedText = ((form.get("text") as string) ?? "").trim();
  const outcome = ((form.get("outcome") as string) ?? "").trim();
  const leadIdRaw = (form.get("lead_id") as string) ?? "";

  if (!audio && !photo && !typedText && !outcome) {
    return Response.json({ error: "Пустой заход: нужен голос, фото, текст или кнопка" }, { status: 400 });
  }

  try {
    // Параллельно: транскрипция + загрузка фото + список лидов
    const sql = getSql();
    const [transcript, photoUrl, existingLeads, currentLead] = await Promise.all([
      audio ? transcribeAudio(audio) : Promise.resolve(""),
      photo ? uploadPhoto(photo) : Promise.resolve(""),
      sql
        ? sql`SELECT id, business_name, stage FROM leads ORDER BY updated_at DESC LIMIT 100`.then(
            (r) => r as unknown as Pick<Lead, "id" | "business_name" | "stage">[],
          )
        : Promise.resolve([]),
      leadIdRaw ? fetchLead(parseInt(leadIdRaw, 10)) : Promise.resolve(null),
    ]);

    let photoBase64: { mediaType: string; data: string } | undefined;
    if (photo) {
      const buf = Buffer.from(await photo.arrayBuffer());
      // Claude принимает jpeg/png/gif/webp до ~5MB
      if (buf.length < 5 * 1024 * 1024) {
        photoBase64 = { mediaType: photo.type || "image/jpeg", data: buf.toString("base64") };
      }
    }

    const proposal = await parseVisit({
      transcript,
      typedText,
      outcome,
      photoBase64,
      existingLeads,
      currentLead,
    });

    return Response.json({ proposal, transcript, photo_url: photoUrl });
  } catch (e) {
    console.error("crm capture error", e);
    return Response.json({ error: String(e instanceof Error ? e.message : e) }, { status: 500 });
  }
}
