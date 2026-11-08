import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CRM_COOKIE, crmToken } from "../../lib/crm-auth";
import { getSql } from "../../lib/crm/db";
import { getFair, type FairVisit } from "../../lib/crm/messe/data";
import MesseBoard from "../../components/crm/messe/MesseBoard";
import MesseStyles from "../../components/crm/messe/MesseStyles";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ event?: string }> }): Promise<Metadata> {
  const { event } = await searchParams;
  const fair = getFair(event);
  return { title: `${fair.title} — обход · CRM`, robots: { index: false, follow: false } };
}

export default async function MessePage({ searchParams }: { searchParams: Promise<{ event?: string }> }) {
  const cookieStore = await cookies();
  if (cookieStore.get(CRM_COOKIE)?.value !== crmToken()) redirect("/crm/login");

  const { event } = await searchParams;
  const fair = getFair(event);

  let visits: FairVisit[] = [];
  const sql = getSql();
  if (sql) {
    try {
      const exists = await sql`SELECT to_regclass('fair_visits') AS t`;
      if ((exists[0] as { t: string | null }).t) {
        visits = (await sql`SELECT * FROM fair_visits WHERE event = ${fair.event}`) as unknown as FairVisit[];
      }
    } catch (e) {
      console.error("messe visits load", e);
    }
  }

  return (
    <main className="messe">
      <MesseStyles />
      <MesseBoard key={fair.event} fair={fair} initialVisits={visits} />
    </main>
  );
}
