"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { LESSONS, getLesson, latestLesson } from "./data/lessons";

const NAV = [
  { href: "/deutsch", label: "Урок", icon: "I" },
  { href: "/deutsch/karten", label: "Карточки", icon: "II" },
  { href: "/deutsch/hausaufgabe", label: "Домашка", icon: "III" },
  { href: "/deutsch/strasse", label: "Улица", icon: "IV" },
  { href: "/deutsch/ksenia", label: "Ксюша", icon: "V" },
];

export default function DeutschShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/deutsch";
  const params = useSearchParams();
  const lesson = getLesson(params.get("l"));
  const upcoming = latestLesson();
  const q = `?l=${lesson.id}`;

  return (
    <div className="heft-shell">
      <header className="heft-top">
        <div>
          <div className="heft-brand-kicker">Andrii · Ksenija</div>
          <div className="heft-brand">
            Stun<span>de</span>
          </div>
        </div>
        <div className="heft-top-meta">
          <strong>Следующий урок</strong>
          {upcoming.nextLabel}
        </div>
      </header>

      <nav className="heft-lessons" aria-label="Уроки">
        {LESSONS.map((item) => {
          const href = `${pathname === "/deutsch" ? "/deutsch" : pathname}?l=${item.id}`;
          return (
            <Link key={item.id} href={href} className={item.id === lesson.id ? "active" : ""}>
              <b>{String(item.number).padStart(2, "0")}</b>
              <span>{item.date.slice(8)}.09</span>
            </Link>
          );
        })}
      </nav>

      <nav className="heft-nav">
        {NAV.map((item) => {
          const active = item.href === "/deutsch" ? pathname === "/deutsch" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={`${item.href}${q}`} className={active ? "active" : ""}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}

      <nav className="heft-mobile-nav">
        {NAV.map((item) => {
          const active = item.href === "/deutsch" ? pathname === "/deutsch" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={`${item.href}${q}`} className={active ? "active" : ""}>
              <b>{item.icon}</b>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
