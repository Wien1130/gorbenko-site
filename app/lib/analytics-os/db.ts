import { neon } from "@neondatabase/serverless";

/** Analytics OS Postgres (Neon). Null when ANALYTICS_DATABASE_URL is unset — callers show an empty state. */
export function getAnalyticsSql() {
  const url = process.env.ANALYTICS_DATABASE_URL;
  if (!url) return null;
  return neon(url);
}
