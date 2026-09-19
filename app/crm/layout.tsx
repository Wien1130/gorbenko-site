import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import DashboardStyles from "../components/DashboardStyles";
import CrmStyles from "../components/crm/CrmStyles";

export const metadata: Metadata = {
  title: "CRM — Gorbenko",
  robots: { index: false, follow: false },
  manifest: "/crm.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cold CRM",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function CrmLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardStyles />
      <CrmStyles />
      {children}
    </>
  );
}
