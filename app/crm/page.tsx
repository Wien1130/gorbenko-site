import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CRM_COOKIE, crmToken } from "../lib/crm-auth";
import { fetchLeadRows } from "../lib/cold-leads";
import { computeColdSalesStats } from "../lib/cold-leads-stats";
import { fetchDailyPlans, computePlanVsActual } from "../lib/plans";
import { fetchResistanceLog } from "../lib/resistance";
import ColdSalesOverview from "../components/ColdSalesOverview";
import LeadsTable from "../components/LeadsTable";
import PlanVsActual from "../components/PlanVsActual";
import FearCard from "../components/FearCard";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(CRM_COOKIE)?.value;
  if (cookie !== crmToken()) {
    redirect("/crm/login");
  }

  const [rows, plans, resistance] = await Promise.all([
    fetchLeadRows(),
    fetchDailyPlans(),
    fetchResistanceLog(),
  ]);
  const stats = computeColdSalesStats(rows);
  const comparisons = computePlanVsActual(plans, rows);

  return (
    <main className="dash-main">
      <div className="dash-header">
        <span className="page-label">Gorbenko · закрытая CRM</span>
        <span className="badge red">🔒 приватно</span>
      </div>
      <h1 className="page-title">🗂 Холодные продажи — вся картина</h1>
      <p className="page-sub">
        Полная версия с именами, контактами и заметками. Не для шаринга.
      </p>

      <FearCard count={resistance.length} variant="private" />

      {stats.total > 0 ? (
        <>
          <ColdSalesOverview stats={stats} />
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
