"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";

function toNew(path: string) {
  if (path === "/klassisch") return "/";
  if (path.startsWith("/klassisch/")) return path.slice("/klassisch".length);
  return path || "/";
}

export default function ClassicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/klassisch";
  const router = useRouter();
  const fresh = toNew(pathname);

  useEffect(() => {
    const root = document.documentElement;
    const keys = [
      "--background",
      "--foreground",
      "--accent",
      "--accent-dim",
      "--muted",
      "--card",
      "--border",
    ];
    for (const key of keys) root.style.removeProperty(key);
    document.body.style.background = "#050508";
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname.startsWith("/klassisch") ||
        url.pathname.startsWith("/api") ||
        url.pathname.startsWith("/_next")
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      router.push(`/klassisch${url.pathname === "/" ? "" : url.pathname}${url.search}${url.hash}`);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] flex h-8 items-center justify-center gap-3 bg-[#111114] px-4 text-center text-xs text-[#d5d5d8]">
        <span>Bisherige Fassung</span>
        <Link href={fresh} className="font-semibold text-[#00d4aa]">
          Neue Fassung ansehen ↗
        </Link>
      </div>
      <SiteHeader prefix="/klassisch" offset />
      {children}
      <SiteFooter />
    </>
  );
}
