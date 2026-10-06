import type { Metadata } from "next";
import { ANGEBOT_CLIENTS } from "../lib/angebot-clients";
import { isValidAngebotKey } from "../lib/angebot-auth";
import LockedAngebot from "./LockedAngebot";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Angebot",
  robots: { index: false, follow: false },
};

export default async function AngebotIndex({
  searchParams,
}: {
  searchParams: Promise<{ k?: string }>;
}) {
  const { k } = await searchParams;
  if (!isValidAngebotKey(k)) return <LockedAngebot />;

  return (
    <>
      <header className="ag-top">
        <div className="ag-brand">
          Gorbenko
          <span>Angebote · nicht öffentlich</span>
        </div>
      </header>
      <div className="ag-shell" style={{ gridTemplateColumns: "1fr" }}>
        <div>
          <p className="ag-kicker">Nächster Schritt</p>
          <h1 className="ag-h1 ag-serif">Welches Angebot öffnen?</h1>
          <p className="ag-intro">
            Jede Praxis bekommt eine eigene geschlossene Seite. Denselben Schlüssel
            behalten Sie in der Adresse.
          </p>
          <ul style={{ paddingLeft: 18, lineHeight: 1.8 }}>
            {ANGEBOT_CLIENTS.map((c) => (
              <li key={c.slug}>
                <a href={`/angebot/${c.slug}?k=${encodeURIComponent(k ?? "")}`}>
                  {c.clientName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
