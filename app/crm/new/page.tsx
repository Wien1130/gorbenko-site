import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CRM_COOKIE, crmToken } from "../../lib/crm-auth";
import { fetchLead } from "../../lib/crm/db";
import CaptureScreen from "../../components/crm/CaptureScreen";

export const dynamic = "force-dynamic";

export default async function NewVisitPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string }>;
}) {
  const cookieStore = await cookies();
  if (cookieStore.get(CRM_COOKIE)?.value !== crmToken()) redirect("/crm/login");

  const params = await searchParams;
  const leadId = params.lead ? parseInt(params.lead, 10) : undefined;
  const lead = leadId ? await fetchLead(leadId) : null;

  return (
    <main style={{ minHeight: "100vh", background: "#0d0d0d" }}>
      <CaptureScreen leadId={lead?.id} leadName={lead?.business_name} />
    </main>
  );
}
