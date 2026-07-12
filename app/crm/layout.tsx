import type { ReactNode } from "react";
import type { Metadata } from "next";
import DashboardStyles from "../components/DashboardStyles";

export const metadata: Metadata = {
  title: "CRM — Gorbenko",
  robots: { index: false, follow: false },
};

export default function CrmLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardStyles />
      {children}
    </>
  );
}
