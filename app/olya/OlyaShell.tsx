"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/olya",            icon: "🏠", label: "Обзор",      short: "Обзор" },
  { href: "/olya/strategy",   icon: "🎯", label: "Стратегия",  short: "Стратегия" },
  { href: "/olya/reels",      icon: "🎬", label: "Банк reels", short: "Reels" },
  { href: "/olya/references", icon: "💡", label: "Референсы",  short: "Референсы" },
  { href: "/olya/ideas",      icon: "🎙️", label: "Идеи (бот)", short: "Идеи" },
];

export default function OlyaShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="olya-shell">
      <aside className="olya-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-label">Gorbenko · проект</div>
          <div className="sidebar-brand-name">Не смотри<br />в глаза</div>
          <div className="sidebar-brand-sub">Оля · писательница</div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((item) => {
            const exact = item.href === "/olya";
            const active = exact ? pathname === "/olya" : pathname.startsWith(item.href);
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
      <main className="olya-main">
        {children}
      </main>

      <nav className="olya-mobile-nav">
        {NAV.map((item) => {
          const exact = item.href === "/olya";
          const active = exact ? pathname === "/olya" : pathname.startsWith(item.href);
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
