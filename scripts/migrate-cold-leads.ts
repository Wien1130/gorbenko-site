/**
 * Одноразовая миграция: knowledge/cold_leads.csv (GitHub) → Postgres (Neon).
 * Запуск: npx tsx scripts/migrate-cold-leads.ts
 * Читает env из .env.local. Идемпотентность: если в leads уже есть строки — останавливается
 * (защита от задвоения), перезапуск с --force очищает таблицы и мигрирует заново.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { neon } from "@neondatabase/serverless";

// --- env из .env.local ---
try {
  const envText = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of envText.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)="?([^"]*)"?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {
  /* нет .env.local — берём из окружения */
}

import { SCHEMA_SQL } from "../app/lib/crm/db";
import { fetchLeadRowsFromCsv } from "../app/lib/cold-leads";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL не задан (в .env.local)");
  const sql = neon(url);

  console.log("Создаю схему…");
  for (const stmt of SCHEMA_SQL) await sql.query(stmt);

  const existing = await sql`SELECT count(*)::int AS n FROM leads`;
  const n = (existing[0] as { n: number }).n;
  if (n > 0) {
    if (!process.argv.includes("--force")) {
      console.log(`В базе уже ${n} лидов. Для повторной миграции: --force (сотрёт всё).`);
      return;
    }
    console.log("--force: очищаю таблицы…");
    await sql.query("TRUNCATE leads RESTART IDENTITY CASCADE");
  }

  console.log("Читаю CSV с GitHub…");
  const rows = await fetchLeadRowsFromCsv();
  console.log(`Строк в CSV: ${rows.length}`);
  if (!rows.length) throw new Error("CSV пуст или не прочитался");

  // Хронологический порядок
  const sorted = [...rows].sort((a, b) => {
    const ta = a.timestamp || `${a.date}T12:00:00`;
    const tb = b.timestamp || `${b.date}T12:00:00`;
    return ta.localeCompare(tb);
  });

  const leadIdByKey = new Map<string, number>();
  let leadsCreated = 0;
  let activitiesCreated = 0;

  for (const r of sorted) {
    const name = (r.business_name || "").trim();
    if (!name) continue;
    const key = name.toLowerCase();
    const ts = r.timestamp || `${r.date}T12:00:00+02:00`;
    const amount = parseFloat(r.deal_amount) || 0;
    const email = ((r as unknown as Record<string, string>).contact_email ?? "").trim();

    let leadId = leadIdByKey.get(key);
    if (!leadId) {
      const inserted = await sql`
        INSERT INTO leads (business_name, business_type, stage, contact_name, contact_email, next_action, meeting_datetime, deal_amount, notes, created_at, updated_at)
        VALUES (${name}, ${r.business_type || "other"}, ${r.stage || "warm_followup"}, ${r.contact_name || ""}, ${email}, ${r.next_action || ""}, ${r.meeting_datetime || ""}, ${amount}, ${""}, ${ts}, ${ts})
        RETURNING id`;
      leadId = (inserted[0] as { id: number }).id;
      leadIdByKey.set(key, leadId);
      leadsCreated++;
    } else {
      // последняя строка по бизнесу побеждает (та же логика, что dedupLatestByBusiness)
      await sql`
        UPDATE leads SET
          stage = ${r.stage || "warm_followup"},
          business_type = CASE WHEN ${r.business_type || ""} <> '' THEN ${r.business_type || ""} ELSE business_type END,
          contact_name = CASE WHEN ${r.contact_name || ""} <> '' THEN ${r.contact_name || ""} ELSE contact_name END,
          contact_email = CASE WHEN ${email} <> '' THEN ${email} ELSE contact_email END,
          next_action = CASE WHEN ${r.next_action || ""} <> '' THEN ${r.next_action || ""} ELSE next_action END,
          meeting_datetime = CASE WHEN ${r.meeting_datetime || ""} <> '' THEN ${r.meeting_datetime || ""} ELSE meeting_datetime END,
          deal_amount = CASE WHEN ${amount} > 0 THEN ${amount} ELSE deal_amount END,
          updated_at = ${ts}
        WHERE id = ${leadId}`;
    }

    const entryType = r.entry_type === "followup" ? "followup" : "cold_touch";
    await sql`
      INSERT INTO activities (lead_id, kind, entry_type, stage_after, transcript, summary, photo_url, created_at)
      VALUES (${leadId}, 'visit', ${entryType}, ${r.stage || ""}, ${r.raw_text || ""}, ${r.notes || ""}, ${r.photo_url || ""}, ${ts})`;
    activitiesCreated++;
  }

  console.log(`✅ Готово: ${leadsCreated} лидов, ${activitiesCreated} записей истории.`);

  const check = await sql`
    SELECT (SELECT count(*)::int FROM activities WHERE entry_type='cold_touch') AS touches,
           (SELECT count(*)::int FROM leads) AS leads`;
  console.log("Проверка:", check[0]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
