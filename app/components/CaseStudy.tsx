const metrics = [
  { value: "€3.000", label: "Mehrumsatz in 15 Tagen" },
  { value: "<10s", label: "Antwortzeit" },
  { value: "24/7", label: "Erreichbarkeit" },
  { value: "95%", label: "Automatisch beantwortet" },
];

export default function CaseStudy() {
  return (
    <section
      id="case"
      className="scroll-mt-20 border-t border-[var(--border)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
          Fallstudie
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          BlinHaus Vienna
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--muted)]">
          Ein Wiener Café setzt unseren KI-Assistenten ein, um Bestellungen über
          Instagram und Facebook automatisch entgegenzunehmen und Kundenanfragen
          zu beantworten.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center"
            >
              <p className="font-display text-3xl font-bold text-[var(--accent)] sm:text-4xl">
                {m.value}
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 items-start">
            <div>
              <h3 className="text-lg font-semibold">Die Herausforderung</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                BlinHaus erhielt täglich dutzende Nachrichten über Instagram und
                Facebook — Bestellungen, Fragen zur Speisekarte, Lieferzeiten.
                Der Inhaber konnte nicht rund um die Uhr antworten, was zu
                verlorenen Bestellungen und frustrierten Kunden führte.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Die Lösung</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                Wir haben einen KI-Assistenten entwickelt, der die Speisekarte
                kennt, Bestellungen aufnimmt, Preise berechnet und den Inhaber
                automatisch über neue Bestellungen benachrichtigt — 24 Stunden
                am Tag, 7 Tage die Woche.
              </p>
            </div>
          </div>

          <blockquote className="mt-10 border-l-2 border-[var(--accent)] pl-6">
            <p className="text-[var(--muted)] italic leading-relaxed">
              &ldquo;Der Assistent beantwortet Kundenanfragen sofort und nimmt
              Bestellungen auf — auch nachts und am Wochenende. Wir haben
              dadurch deutlich mehr Bestellungen erhalten.&rdquo;
            </p>
            <footer className="mt-4 text-sm">
              <strong>Anatoly</strong>
              <span className="text-[var(--muted)]">
                {" "}
                — Inhaber, BlinHaus Vienna
              </span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
