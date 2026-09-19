import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CRM_COOKIE, crmToken } from "../../lib/crm-auth";
import { fetchLeadRows } from "../../lib/cold-leads";
import { computeColdSalesStats } from "../../lib/cold-leads-stats";
import { fetchDailyPlans, computePlanVsActual, averagePlanMatch } from "../../lib/plans";
import { fetchResistanceLog, matchResistanceContext } from "../../lib/resistance";
import ColdSalesOverview from "../../components/ColdSalesOverview";
import LeadsTable from "../../components/LeadsTable";
import PlanVsActual from "../../components/PlanVsActual";
import FearCard from "../../components/FearCard";

export const dynamic = "force-dynamic";

/** Старый полный дашборд (воронка, план/факт, таблица) — теперь на /crm/stats. */
export default async function CrmStatsPage() {
  const cookieStore = await cookies();
  if (cookieStore.get(CRM_COOKIE)?.value !== crmToken()) redirect("/crm/login");

  const [rows, plans, resistance] = await Promise.all([
    fetchLeadRows(),
    fetchDailyPlans(),
    fetchResistanceLog(),
  ]);
  const stats = computeColdSalesStats(rows);
  const comparisons = computePlanVsActual(plans, rows);
  const planMatchPct = averagePlanMatch(comparisons);
  const resistanceWithContext = matchResistanceContext(resistance, rows);

  return (
    <main className="dash-main">
      <div className="dash-header">
        <a href="/crm" className="page-label" style={{ textDecoration: "none" }}>← CRM</a>
        <a href="/crm/plan" className="badge red" style={{ textDecoration: "none" }}>🗓 план на неделю →</a>
      </div>
      <h1 className="page-title">📊 Холодные продажи — вся картина</h1>
      <p className="page-sub">Полная версия с именами, контактами и заметками. Не для шаринга.</p>

      <FearCard count={resistance.length} entries={resistanceWithContext} variant="private" />

      {stats.total > 0 ? (
        <>
          <ColdSalesOverview stats={stats} planMatchPct={planMatchPct} />
          <PlanVsActual comparisons={comparisons} />
          <LeadsTable rows={rows} masked={false} />
        </>
      ) : (
        <div className="card">
          <div className="card-title">Пока пусто</div>
        </div>
      )}

      <p className="footer-note">
        Публичная версия без личных данных: <a href="/cold-sales">gorbenko.at/cold-sales</a>
      </p>
    </main>
  );
}
