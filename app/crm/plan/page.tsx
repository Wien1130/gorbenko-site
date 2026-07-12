import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CRM_COOKIE, crmToken } from "../../lib/crm-auth";
import { fetchLeadRows } from "../../lib/cold-leads";
import { fetchDailyPlans, getWeekDates, extractUpcomingMeetings } from "../../lib/plans";
import WeekPlanner from "../../components/WeekPlanner";

export const dynamic = "force-dynamic";

export default async function WeekPlanPage() {
  const cookieStore = await cookies();
  if (cookieStore.get(CRM_COOKIE)?.value !== crmToken()) {
    redirect("/crm/login");
  }

  const [rows, plans] = await Promise.all([fetchLeadRows(), fetchDailyPlans()]);
  const weekDates = getWeekDates();
  const meetings = extractUpcomingMeetings(rows);

  return (
    <main className="dash-main">
      <div className="dash-header">
        <span className="page-label">Gorbenko · закрытая CRM</span>
        <a href="/crm" className="badge red" style={{ textDecoration: "none" }}>← назад к CRM</a>
      </div>
      <h1 className="page-title">🗓 План на неделю</h1>
      <p className="page-sub">Блоки времени под холодные заходы + что уже назначено.</p>

      <WeekPlanner weekDates={weekDates} plans={plans} meetings={meetings} />
    </main>
  );
}
