import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { REPORTS_COOKIE, reportsToken } from "../../lib/reports-auth";
import DashboardStyles from "../../components/DashboardStyles";
import HorecaMarkupDashboard from "../../components/finmodel/HorecaMarkupDashboard";

export const metadata: Metadata = {
  title: "Наценка и цены — BlinHaus Vienna",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BlinhausHorecaMarkupPage() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(REPORTS_COOKIE)?.value;
  if (cookie !== reportsToken()) {
    redirect("/reports/login?next=/reports/blinhaus-horeca-markup");
  }

  return (
    <>
      <DashboardStyles />
      <HorecaMarkupDashboard />
    </>
  );
}
