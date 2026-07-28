import type { Metadata } from "next";
import Logo from "../components/Logo";

export const metadata: Metadata = {
  title: "Impressum | Gorbenko",
  description: "Impressum und Pflichtangaben gemäß ECG und MedienG.",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-6">
          <a href="/"><Logo /></a>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
          Rechtliches
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight mb-12">
          Impressum
        </h1>

        <div className="space-y-10 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold mb-3">Angaben gemäß &sect;&nbsp;5 ECG</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-2 text-[var(--muted)]">
              <p><span className="text-[var(--foreground)] font-medium">Name:</span> Andrii Gorbenko</p>
              <p><span className="text-[var(--foreground)] font-medium">Unternehmensgegenstand:</span> Werbeagentur</p>
              <p><span className="text-[var(--foreground)] font-medium">Adresse:</span> Hietzinger Hauptstra&szlig;e 72/2, 1130 Wien, &Ouml;sterreich</p>
              <p><span className="text-[var(--foreground)] font-medium">Telefon:</span>{" "}
                <a href="tel:+436765920259" className="text-[var(--accent)] hover:underline">+43 676 592 02 59</a>
              </p>
              <p><span className="text-[var(--foreground)] font-medium">E-Mail:</span>{" "}
                <a href="mailto:gorbenkomagic@gmail.com" className="text-[var(--accent)] hover:underline">gorbenkomagic@gmail.com</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Gewerberechtliche Angaben</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-2 text-[var(--muted)]">
              <p><span className="text-[var(--foreground)] font-medium">Gewerbe:</span> Werbeagentur</p>
              <p><span className="text-[var(--foreground)] font-medium">Gewerbebeh&ouml;rde:</span> Magistrat der Stadt Wien, Bezirksamt f&uuml;r den 13. und 14. Bezirk</p>
              <p><span className="text-[var(--foreground)] font-medium">Berufsrecht:</span> Gewerbeordnung (GewO)</p>
              <p>
                <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
                  www.ris.bka.gv.at
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Offenlegung gem&auml;&szlig; &sect;&nbsp;25 MedienG</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--muted)]">
              <p>Medieninhaber und Herausgeber: Andrii Gorbenko, Hietzinger Hauptstra&szlig;e 72/2, 1130 Wien.</p>
              <p className="mt-2">Zweck der Website: Pr&auml;sentation von Marketingdienstleistungen und Kontaktaufnahme mit potenziellen Kunden.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Haftungsausschluss</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--muted)] space-y-3">
              <p>Die Inhalte dieser Website wurden mit gr&ouml;&szlig;tm&ouml;glicher Sorgfalt erstellt. F&uuml;r die Richtigkeit, Vollst&auml;ndigkeit und Aktualit&auml;t der Inhalte kann jedoch keine Gew&auml;hr &uuml;bernommen werden.</p>
              <p>Als Diensteanbieter sind wir gem&auml;&szlig; &sect;&nbsp;17 ECG f&uuml;r eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Urheberrecht</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--muted)]">
              <p>Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem &ouml;sterreichischen Urheberrecht. Die Vervielf&auml;ltigung, Bearbeitung, Verbreitung und jede Art der Verwertung au&szlig;erhalb der Grenzen des Urheberrechts bed&uuml;rfen der schriftlichen Zustimmung des Autors.</p>
            </div>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-[var(--border)]">
          <a href="/" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition">
            &larr; Zur&uuml;ck zur Startseite
          </a>
        </div>
      </div>
    </main>
  );
}
