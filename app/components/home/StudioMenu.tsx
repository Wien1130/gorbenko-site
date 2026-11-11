"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/projekte", label: "Projekte" },
  { href: "/leistungen", label: "Leistungen" },
  { href: "/preise", label: "Preise" },
  { href: "/ueber-mich", label: "Über mich" },
  { href: "/blog", label: "Blog" },
];

export default function StudioMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        id="studio-nav"
        className={`studio-nav${open ? " open" : ""}`}
        aria-label="Hauptnavigation"
      >
        {links.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="studio-btn studio-header-cta" href="/kontakt">
        Projekt besprechen <span aria-hidden="true">↗</span>
      </Link>
      <button
        type="button"
        className="studio-menu-btn"
        aria-expanded={open}
        aria-controls="studio-nav"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
    </>
  );
}
