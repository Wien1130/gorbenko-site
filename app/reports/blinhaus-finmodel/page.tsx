import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { REPORTS_COOKIE, reportsToken } from "../../lib/reports-auth";
import DashboardStyles from "../../components/DashboardStyles";
import FinmodelDashboard from "../../components/finmodel/FinmodelDashboard";

export const metadata: Metadata = {
  title: "Финмодель — BlinHaus Vienna",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BlinhausFinmodelPage() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(REPORTS_COOKIE)?.value;
  if (cookie !== reportsToken()) {
    redirect("/reports/login?next=/reports/blinhaus-finmodel");
  }

  return (
    <>
      <DashboardStyles />
      <FinmodelDashboard />
    </>
  );
}
