import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CRM_COOKIE, crmToken } from "../../lib/crm-auth";
import EmailQueue from "../../components/crm/EmailQueue";
import MesseStyles from "../../components/crm/messe/MesseStyles";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Очередь писем · CRM", robots: { index: false, follow: false } };

export default async function EmailsPage() {
  const cookieStore = await cookies();
  if (cookieStore.get(CRM_COOKIE)?.value !== crmToken()) redirect("/crm/login");
  return (
    <main className="messe">
      <MesseStyles />
      <EmailQueue />
    </main>
  );
}
