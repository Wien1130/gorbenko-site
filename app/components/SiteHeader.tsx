"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/projekte", label: "Projekte" },
  { href: "/ueber-mich", label: "Über mich" },
  { href: "/blog", label: "Blog" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled || open
          ? "border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          Gorbenko<span className="text-[var(--accent)]">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition hover:text-[var(--accent)] ${
                pathname.startsWith(item.href)
                  ? "text-[var(--accent)]"
                  : "text-[var(--foreground)]/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/kontakt"
            className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Kostenlose Beratung
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
        >
          <div className="relative h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 bg-current transition-transform ${
                open ? "top-1/2 -translate-y-1/2 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-6 bg-current transition-transform ${
                open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-16 bg-[var(--background)]/98 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-2 px-6 py-8">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="animate-fade-up rounded-xl px-4 py-4 font-display text-2xl font-bold"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/kontakt"
              className="animate-fade-up mt-4 rounded-full bg-[var(--accent)] px-6 py-4 text-center font-semibold text-[var(--background)]"
              style={{ animationDelay: "0.2s" }}
            >
              Kostenlose Beratung
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
