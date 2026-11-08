import { NextRequest } from "next/server";
import { isCrmAuthed, unauthorized } from "../../../../lib/crm/api-auth";
import { getSql } from "../../../../lib/crm/db";
import { readStandPhoto, uploadStandPhoto } from "../../../../lib/crm/photos";

export const maxDuration = 30;

function parseList(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((x) => typeof x === "string");
  if (typeof raw === "string" && raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** GET — показать фото стенда только залогиненному в CRM. */
export async function GET(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const path = req.nextUrl.searchParams.get("path") ?? "";
  const photo = await readStandPhoto(path);
  if (!photo) return Response.json({ error: "Фото не найдено" }, { status: 404 });
  return new Response(photo.bytes, {
    headers: { "Content-Type": photo.type, "Cache-Control": "private, max-age=86400" },
  });
}

/** POST — прикрепить фото стенда к карточке. Не разбирает визитку и не пишет письмо. */
export async function POST(req: NextRequest) {
  if (!(await isCrmAuthed())) return unauthorized();
  const sql = getSql();
  if (!sql) return Response.json({ error: "База не подключена" }, { status: 500 });

  const form = await req.formData();
  const file = form.get("photo") as File | null;
  const event = String(form.get("event") ?? "blickfang-2026");
  const exhibitorId = String(form.get("exhibitor_id") ?? "").trim();
  const leadId = Number(form.get("lead_id") || 0);
  if (!file || !exhibitorId) return Response.json({ error: "Нет фото или стенда" }, { status: 400 });

  const uploaded = await uploadStandPhoto(file);
  if (!uploaded) return Response.json({ error: "Фото не сохранилось. Сними ещё раз, поменьше." }, { status: 500 });

  await sql`ALTER TABLE fair_visits ADD COLUMN IF NOT EXISTS photos text NOT NULL DEFAULT '[]'`;
  const existing = (await sql`SELECT photos FROM fair_visits WHERE event = ${event} AND exhibitor_id = ${exhibitorId}`) as unknown as { photos: unknown }[];
  const photos = parseList(existing[0]?.photos);
  photos.push(uploaded.path);
  const stored = JSON.stringify(photos);

  if (existing.length) {
    await sql`UPDATE fair_visits SET photos = ${stored}, updated_at = now() WHERE event = ${event} AND exhibitor_id = ${exhibitorId}`;
  } else {
    await sql`INSERT INTO fair_visits (event, exhibitor_id, photos) VALUES (${event}, ${exhibitorId}, ${stored})`;
  }

  if (leadId) {
    await sql`INSERT INTO activities (lead_id, kind, entry_type, summary, photo_url)
      VALUES (${leadId}, 'visit', 'followup', ${"Фото со стенда"}, ${uploaded.pageUrl})`;
  }

  return Response.json({ ok: true, photos });
}
