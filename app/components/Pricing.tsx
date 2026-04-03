const plans = [
  {
    name: "Starter",
    setup: "1.500",
    monthly: "200",
    desc: "Ideal für den Einstieg — ein Kanal, schnelle Ergebnisse.",
    features: [
      "1 Kanal (Facebook oder Instagram)",
      "Bis zu 50 häufige Fragen",
      "Automatische Antworten 24/7",
      "Benachrichtigungen per Telegram",
      "Monatlicher Performance-Report",
    ],
    popular: false,
  },
  {
    name: "Business",
    setup: "2.500",
    monthly: "350",
    desc: "Für Unternehmen, die mehr wollen — beide Kanäle, aktive Leadgenerierung.",
    features: [
      "Facebook + Instagram",
      "Leadqualifizierung & Weiterleitung",
      "Bestellannahme & Terminbuchung",
      "Echtzeit-Benachrichtigungen",
      "Wöchentlicher Report & Optimierung",
      "Mehrsprachig (DE/EN)",
    ],
    popular: true,
  },
  {
    name: "Premium",
    setup: "4.000",
    monthly: "500",
    desc: "Maximale Automatisierung — CRM-Integration, Analytik, Prioritäts-Support.",
    features: [
      "Alles aus Business",
      "CRM / Shopify-Integration",
      "Erweiterte Analytik & Dashboard",
      "Individuelle Workflows",
      "Prioritäts-Support & Beratung",
      "Laufende KI-Optimierung",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="scroll-mt-20 border-t border-[var(--border)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
          Preise
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Transparente Preise
        </h2>
        <p className="mt-4 max-w-xl text-[var(--muted)]">
          Einmalige Einrichtung + monatliche Betreuung. Kein Kleingedrucktes.
        </p>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-2xl border p-7 transition ${
                plan.popular
                  ? "border-[var(--accent)]/40 bg-[var(--accent)]/5"
                  : "border-[var(--border)] bg-[var(--card)]"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-[var(--background)]">
                  Beliebt
                </span>
              )}

              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{plan.desc}</p>

              <div className="mt-6">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">
                    &euro;{plan.setup}
                  </span>
                  <span className="text-sm text-[var(--muted)]">
                    Einrichtung
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  + &euro;{plan.monthly}/Monat Betreuung
                </p>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-[var(--muted)]"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      className="mt-0.5 shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 block rounded-xl py-3.5 text-center text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-[var(--accent)] text-[var(--background)] hover:opacity-90"
                    : "border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                Jetzt starten
              </a>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-[var(--muted)]">
          Nicht sicher, welches Paket? &mdash;{" "}
          <a href="#contact" className="text-[var(--accent)] hover:underline">
            Schreiben Sie mir
          </a>
          , ich berate Sie kostenlos.
        </p>
      </div>
    </section>
  );
}
