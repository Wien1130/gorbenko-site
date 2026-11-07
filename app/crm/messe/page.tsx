import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CRM_COOKIE, crmToken } from "../../lib/crm-auth";
import { getSql } from "../../lib/crm/db";
import { FAIR, type FairVisit } from "../../lib/crm/messe/data";
import MesseBoard from "../../components/crm/messe/MesseBoard";
import MesseStyles from "../../components/crm/messe/MesseStyles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BLICKFANG — обход · CRM",
  robots: { index: false, follow: false },
};

export default async function MessePage() {
  const cookieStore = await cookies();
  if (cookieStore.get(CRM_COOKIE)?.value !== crmToken()) redirect("/crm/login");

  let visits: FairVisit[] = [];
  const sql = getSql();
  if (sql) {
    try {
      const exists = await sql`SELECT to_regclass('fair_visits') AS t`;
      if ((exists[0] as { t: string | null }).t) {
        visits = (await sql`SELECT * FROM fair_visits WHERE event = ${FAIR.event}`) as unknown as FairVisit[];
      }
    } catch (e) {
      console.error("messe visits load", e);
    }
  }

  return (
    <main className="messe">
      <MesseStyles />
      <MesseBoard fair={FAIR} initialVisits={visits} />
    </main>
  );
}
