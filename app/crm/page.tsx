import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CRM_COOKIE, crmToken } from "../lib/crm-auth";
import { fetchLeads, fetchDueReminders, getSql } from "../lib/crm/db";
import CrmHome from "../components/crm/CrmHome";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const cookieStore = await cookies();
  if (cookieStore.get(CRM_COOKIE)?.value !== crmToken()) redirect("/crm/login");

  const sql = getSql();
  const [leads, reminders, counts] = await Promise.all([
    fetchLeads(),
    fetchDueReminders(),
    sql
      ? sql`SELECT
            (SELECT count(*) FROM activities WHERE entry_type = 'cold_touch')::int AS touches,
            (SELECT count(*) FROM leads WHERE stage IN ('meeting_tentative','meeting_confirmed','meeting_done'))::int AS meetings,
            (SELECT count(*) FROM leads WHERE stage = 'won')::int AS won`
      : Promise.resolve([{ touches: 0, meetings: 0, won: 0 }]),
  ]);

  const c = (counts[0] ?? { touches: 0, meetings: 0, won: 0 }) as { touches: number; meetings: number; won: number };

  return (
    <main style={{ minHeight: "100vh", background: "#0d0d0d" }}>
      <CrmHome
        leads={leads}
        reminders={reminders}
        stats={{ leads: leads.length, touches: c.touches, meetings: c.meetings, won: c.won }}
      />
    </main>
  );
}
