import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { CRM_COOKIE, crmToken } from "../../../lib/crm-auth";
import { fetchLead, fetchActivities, fetchLeadReminders, fetchLeadEmails } from "../../../lib/crm/db";
import LeadDetail from "../../../components/crm/LeadDetail";

export const dynamic = "force-dynamic";

export default async function LeadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pitch?: string }>;
}) {
  const cookieStore = await cookies();
  if (cookieStore.get(CRM_COOKIE)?.value !== crmToken()) redirect("/crm/login");

  const { id } = await params;
  const { pitch } = await searchParams;
  const leadId = parseInt(id, 10);
  if (!leadId) notFound();

  const lead = await fetchLead(leadId);
  if (!lead) notFound();

  const [activities, reminders, emails] = await Promise.all([
    fetchActivities(leadId),
    fetchLeadReminders(leadId),
    fetchLeadEmails(leadId),
  ]);

  return (
    <main style={{ minHeight: "100vh", background: "#0d0d0d" }}>
      <LeadDetail lead={lead} activities={activities} reminders={reminders} emails={emails} openPitch={pitch === "1"} />
    </main>
  );
}
