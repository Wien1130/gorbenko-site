import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Newsreader } from "next/font/google";
import "./pitch.css";

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-pt-serif",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Persönliche Seite — Gorbenko",
  robots: { index: false, follow: false },
};

export default function PitchLayout({ children }: { children: ReactNode }) {
  return <div className={`pt ${serif.variable}`}>{children}</div>;
}
