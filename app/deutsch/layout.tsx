import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Fraunces, Manrope } from "next/font/google";
import DeutschShell from "./DeutschShell";
import "./heft.css";

const serif = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heft-serif",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-heft-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stunde — Deutsch mit Ksenija",
  description: "Личная тетрадь уроков немецкого: разбор, карточки и домашка.",
  robots: { index: false, follow: false },
};

export default function DeutschLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`heft ${serif.variable} ${sans.variable}`} style={{ fontFamily: "var(--font-heft-sans), system-ui, sans-serif" }}>
      <style>{`body { background: #0e0c0a !important; }`}</style>
      <Suspense fallback={null}>
        <DeutschShell>{children}</DeutschShell>
      </Suspense>
    </div>
  );
}
