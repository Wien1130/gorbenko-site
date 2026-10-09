"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AssistantAvatar from "./AssistantAvatar";
import SiteAssistant from "./SiteAssistant";

const HIDDEN_PREFIXES = [
  "/andrii",
  "/olya",
  "/crm",
  "/cold-sales",
  "/reports",
  "/api",
  "/google-maps",
  "/bi-markt",
  "/angebot",
  "/deutsch",
  "/p",
];

export default function SiteAssistantLauncher() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const hidden = HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  // Hero already hosts the assistant — no FAB on home
  const isHome = pathname === "/";

  if (!mounted || hidden || isHome) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <SiteAssistant
          variant="panel"
          onClose={() => setOpen(false)}
        />
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] py-2 pl-2 pr-4 shadow-xl shadow-black/40 transition hover:border-[var(--accent)]/40"
        aria-label={open ? "Assistent schließen" : "Assistent öffnen"}
      >
        <AssistantAvatar state={open ? "speaking" : "idle"} size={40} />
        <span className="text-sm font-medium">Fragen?</span>
      </button>
    </div>
  );
}
