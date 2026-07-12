import type { ReactNode } from "react";
import type { Metadata } from "next";
import DashboardStyles from "../components/DashboardStyles";

export const metadata: Metadata = {
  title: "100 холодных касаний — Gorbenko",
  description: "Публичный трекер кампании холодных продаж: воронка, конверсия, темп.",
};

export default function ColdSalesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardStyles />
      {children}
    </>
  );
}
