"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/andrii",            icon: "🏠", label: "Обзор",       short: "Обзор" },
  { href: "/andrii/strategy",   icon: "🎯", label: "Стратегия",   short: "Стратегия" },
  { href: "/andrii/reels",      icon: "🎬", label: "Банк reels",  short: "Reels" },
  { href: "/andrii/references", icon: "💡", label: "Референсы",   short: "Референсы" },
  { href: "/andrii/ideas",      icon: "🎙️", label: "Идеи (бот)",  short: "Идеи" },
  { href: "/andrii/system",     icon: "⚙️", label: "Автопостинг", short: "Постинг" },
];

export default function AndriiShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="an-shell">
      <aside className="an-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-label">Gorbenko · проект</div>
          <div className="sidebar-brand-name">DACH<br />Million</div>
          <div className="sidebar-brand-sub">Андрей · reels на DE</div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((item) => {
            const exact = item.href === "/andrii";
            const active = exact ? pathname === "/andrii" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${active ? " active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          Gorbenko Agency · 2026
        </div>
      </aside>
      <main className="an-main">
        {children}
      </main>

      <nav className="an-mobile-nav">
        {NAV.map((item) => {
          const exact = item.href === "/andrii";
          const active = exact ? pathname === "/andrii" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`m-nav-item${active ? " active" : ""}`}
            >
              <span className="m-nav-icon">{item.icon}</span>
              {item.short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
