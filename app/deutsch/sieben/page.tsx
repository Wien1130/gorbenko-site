import type { Metadata } from "next";
import SiebenClient from "./SiebenClient";

export const metadata: Metadata = {
  title: "Семь фраз — Deutsch",
  robots: { index: false, follow: false },
};

export default function SiebenPage() {
  return <SiebenClient />;
}
