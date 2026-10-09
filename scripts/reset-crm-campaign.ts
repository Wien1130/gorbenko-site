/**
 * Старт новой кампании: архивирует текущие данные CRM в таблицы archive_<label>_*,
 * очищает рабочие таблицы и (опционально) открывает рабочую сессию.
 * Запуск: npx tsx --env-file=.env.local scripts/reset-crm-campaign.ts <label> [sessionStartISO]
 */
import { neon } from "@neondatabase/serverless";
import { SCHEMA_SQL } from "../app/lib/crm/db";

const label = process.argv[2];
const sessionStart = process.argv[3];
if (!label || !/^[a-z0-9_]+$/.test(label)) throw new Error("Укажи label архива, например summer2026");

const sql = neon(process.env.DATABASE_URL!);

(async () => {
  for (const s of SCHEMA_SQL) await sql.query(s);
  for (const t of ["leads", "activities", "reminders", "emails"]) {
    await sql.query(`DROP TABLE IF EXISTS archive_${label}_${t}`);
    await sql.query(`CREATE TABLE archive_${label}_${t} AS SELECT * FROM ${t}`);
  }
  const arch = await sql.query(
    `SELECT (SELECT count(*)::int FROM archive_${label}_leads) leads, (SELECT count(*)::int FROM archive_${label}_activities) acts`,
  );
  console.log("archive:", JSON.stringify(arch[0]));
  await sql.query("TRUNCATE leads, activities, reminders, emails, work_sessions RESTART IDENTITY CASCADE");
  if (sessionStart) await sql`INSERT INTO work_sessions (started_at) VALUES (${sessionStart})`;
  const c = await sql`SELECT (SELECT count(*)::int FROM leads) leads, (SELECT count(*)::int FROM activities) acts,
    (SELECT started_at FROM work_sessions LIMIT 1) session`;
  console.log("now:", JSON.stringify(c[0]));
})();
