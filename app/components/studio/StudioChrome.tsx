"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import StudioMenu from "../home/StudioMenu";
import StudioTheme from "./StudioTheme";

export default function StudioChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/";
  const oldHref = path.startsWith("/klassisch")
    ? path
    : path === "/"
      ? "/klassisch"
      : `/klassisch${path}`;

  return (
    <StudioTheme>
      <div className="studio-topbar">
        <header className="studio-header studio-wrap">
          <Link href="/" className="studio-wordmark" aria-label="Gorbenko, zur Startseite">
            Gorbenko.at
          </Link>
          <StudioMenu />
        </header>
      </div>
      {children}
      <footer className="studio-subfoot">
        <div className="studio-wrap studio-foot">
          <Link href="/" className="studio-wordmark">
            Gorbenko.at
          </Link>
          <span>Wien · Andrii Gorbenko</span>
          <nav aria-label="Rechtliches">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href={oldHref}>Bisherige Fassung</Link>
          </nav>
        </div>
      </footer>
    </StudioTheme>
  );
}
