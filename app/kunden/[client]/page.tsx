import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { loadClientReport } from "../../lib/analytics-os/queries";
import { demoReport } from "../../lib/analytics-os/mock";
import { isClientSlug, KUNDEN_COOKIE, kundenPassword, kundenToken } from "../../lib/kunden-auth";
import { ReportView } from "./ReportView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Werbe-Auswertung",
  robots: { index: false, follow: false },
};

function Plain({ children }: { children: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-6 text-[#f5f5f5]">
      <p className="max-w-sm text-center text-sm text-[#9ca3af]">{children}</p>
    </main>
  );
}

export default async function KundenReport({
  params,
}: {
  params: Promise<{ client: string }>;
}) {
  const { client } = await params;
  if (!isClientSlug(client)) notFound();

  if (client === "demo") {
    return <ReportView report={demoReport()} isDemo />;
  }

  if (!kundenPassword(client)) {
    return <Plain>Seite noch nicht freigeschaltet.</Plain>;
  }

  const store = await cookies();
  if (store.get(KUNDEN_COOKIE(client))?.value !== kundenToken(client)) {
    redirect(`/kunden/${client}/login`);
  }

  const report = await loadClientReport(client);
  if (!report) {
    return <Plain>Noch keine Daten angebunden.</Plain>;
  }

  return <ReportView report={report} isDemo={false} />;
}
