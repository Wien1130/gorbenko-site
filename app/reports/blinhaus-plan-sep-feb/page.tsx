import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { REPORTS_COOKIE, reportsToken } from "../../lib/reports-auth";
import DashboardStyles from "../../components/DashboardStyles";
import PlanSepFebDashboard from "../../components/finmodel/PlanSepFebDashboard";

export const metadata: Metadata = {
  title: "План сен–фев — BlinHaus Vienna",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BlinhausPlanSepFebPage() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(REPORTS_COOKIE)?.value;
  if (cookie !== reportsToken()) {
    redirect("/reports/login?next=/reports/blinhaus-plan-sep-feb");
  }

  return (
    <>
      <DashboardStyles />
      <PlanSepFebDashboard />
    </>
  );
}
