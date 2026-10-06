import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Newsreader } from "next/font/google";
import "./angebot.css";

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-ag-serif",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Angebot",
  robots: { index: false, follow: false },
};

export default function AngebotLayout({ children }: { children: ReactNode }) {
  return <div className={`ag ${serif.variable}`}>{children}</div>;
}
