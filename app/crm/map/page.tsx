import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CRM_COOKIE, crmToken } from "../../lib/crm-auth";
import { fetchMapPoints } from "../../lib/crm/work";
import CrmMap from "../../components/crm/CrmMap";

export const dynamic = "force-dynamic";

export default async function CrmMapPage() {
  const cookieStore = await cookies();
  if (cookieStore.get(CRM_COOKIE)?.value !== crmToken()) redirect("/crm/login");

  const points = await fetchMapPoints();

  return (
    <main style={{ minHeight: "100vh", background: "#0d0d0d" }}>
      <div className="crm-wrap">
        <div className="crm-top">
          <a href="/crm" className="crm-mini-btn" style={{ textDecoration: "none" }}>← CRM</a>
          <div className="crm-title">🗺 Карта точек</div>
          <a href="/crm/stats" className="crm-mini-btn" style={{ textDecoration: "none" }}>📊</a>
        </div>
        <CrmMap points={points} />
      </div>
    </main>
  );
}
