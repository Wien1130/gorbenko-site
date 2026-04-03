const problems = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="9" y1="10" x2="15" y2="10" />
      </svg>
    ),
    title: "Verpasste Nachrichten",
    desc: "Kunden schreiben Ihnen abends, am Wochenende, im Urlaub. Jede unbeantwortete Nachricht ist ein verlorener Auftrag.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Zu langsame Antworten",
    desc: "Bis Sie antworten, hat der Kunde schon bei der Konkurrenz bestellt. Kunden erwarten Antworten in Minuten, nicht Stunden.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 12h8M4 18h4M4 6h16M20 6v.01M16 12v.01M12 18v.01" />
        <circle cx="20" cy="12" r="2" />
        <circle cx="16" cy="18" r="2" />
      </svg>
    ),
    title: "Wiederholende Fragen",
    desc: "Öffnungszeiten, Preise, Verfügbarkeit — Sie beantworten täglich dieselben Fragen. Zeit, die Sie besser investieren könnten.",
  },
];

export default function Problem() {
  return (
    <section className="border-t border-[var(--border)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
          Das Problem
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-2xl">
          Ihre Kunden schreiben.
          <br />
          <span className="text-[var(--muted)]">Aber niemand antwortet.</span>
        </h2>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {problems.map((p) => (
            <article
              key={p.title}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 hover:border-[var(--accent)]/30 transition"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                {p.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {p.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
