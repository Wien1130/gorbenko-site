import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CRM_COOKIE, crmToken } from "../../lib/crm-auth";
import { fetchLeadRows } from "../../lib/cold-leads";
import { computeColdSalesStats } from "../../lib/cold-leads-stats";
import { fetchResistanceLog, matchResistanceContext } from "../../lib/resistance";
import { fetchDayStats } from "../../lib/crm/work";
import ColdSalesOverview from "../../components/ColdSalesOverview";
import LeadsTable from "../../components/LeadsTable";
import FearCard from "../../components/FearCard";
import DayCharts from "../../components/crm/DayCharts";

export const dynamic = "force-dynamic";

export default async function CrmStatsPage() {
  const cookieStore = await cookies();
  if (cookieStore.get(CRM_COOKIE)?.value !== crmToken()) redirect("/crm/login");

  const [rows, resistance, days] = await Promise.all([fetchLeadRows(), fetchResistanceLog(), fetchDayStats()]);
  const stats = computeColdSalesStats(rows);
  const resistanceWithContext = matchResistanceContext(resistance, rows);

  return (
    <main style={{ minHeight: "100vh", background: "#0d0d0d" }}>
      <div className="crm-wrap">
        <div className="crm-top">
          <a href="/crm" className="crm-mini-btn" style={{ textDecoration: "none" }}>← CRM</a>
          <div className="crm-title">📊 Статистика</div>
          <a href="/crm/map" className="crm-mini-btn" style={{ textDecoration: "none" }}>🗺</a>
        </div>
        <DayCharts days={days} />
      </div>

      <div className="dash-main" style={{ paddingTop: 0 }}>
        {stats.total > 0 && (
          <>
            <ColdSalesOverview stats={stats} />
            <LeadsTable rows={rows} masked={false} />
          </>
        )}
        <FearCard count={resistance.length} entries={resistanceWithContext} variant="private" />
      </div>
    </main>
  );
}
