const steps = [
  {
    num: "01",
    title: "Analyse",
    desc: "Wir analysieren Ihr Geschäft, Ihre häufigsten Kundenanfragen und Ihren Kommunikationsstil. Daraus entsteht das Fundament für Ihren KI-Assistenten.",
    detail: "Dauer: 1–2 Tage",
  },
  {
    num: "02",
    title: "Einrichtung",
    desc: "Wir trainieren den KI-Assistenten mit Ihren Daten — Menü, Preise, FAQ, Tonalität — und integrieren ihn in Facebook und Instagram.",
    detail: "Dauer: 3–5 Tage",
  },
  {
    num: "03",
    title: "Live",
    desc: "Ihr Assistent geht live und beantwortet Kundenanfragen sofort. Sie erhalten Benachrichtigungen bei Bestellungen und wichtigen Anfragen.",
    detail: "Ab Tag 7 aktiv",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="scroll-mt-20 border-t border-[var(--border)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
          So funktioniert&apos;s
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-2xl">
          In 3 Schritten zum
          <br />
          KI-Assistenten
        </h2>
        <p className="mt-4 max-w-xl text-[var(--muted)]">
          Von der Analyse bis zum Go-Live — alles aus einer Hand, in unter einer Woche.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.num} className="relative">
              <span className="font-display text-6xl font-bold text-[var(--accent)]/10">
                {step.num}
              </span>
              <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {step.desc}
              </p>
              <p className="mt-4 text-xs font-medium text-[var(--accent)]">
                {step.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
