export default function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-[var(--border)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16 items-start">
          <div className="lg:col-span-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              &Uuml;ber mich
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Hallo, ich bin Andrey.
            </h2>
            <div className="mt-6 space-y-4 text-[var(--muted)] leading-relaxed">
              <p>
                Ich lebe in Wien und helfe lokalen Unternehmen, ihre
                Kundenkommunikation mit KI zu automatisieren.
              </p>
              <p>
                Mein Hintergrund: Marketing, Werbung (Facebook &amp; Instagram
                Ads) und AI-Automatisierung. Ich habe den KI-Assistenten
                f&uuml;r BlinHaus Vienna entwickelt, der Bestellungen aufnimmt
                und Kunden rund um die Uhr bedient.
              </p>
              <p>
                Ich arbeite direkt mit Ihnen &mdash; kein gro&szlig;es
                Agentur-Team, sondern pers&ouml;nliche Betreuung und schnelle
                Umsetzung. Von der Analyse bis zum Go-Live in unter einer Woche.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "KI & Automatisierung",
                "Meta Ads",
                "Chatbots",
                "Marketing",
                "Wien, &Ouml;sterreich",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]"
                  dangerouslySetInnerHTML={{ __html: tag }}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex items-start justify-center">
            <div className="relative w-full max-w-xs">
              <div className="aspect-[3/4] rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                <img
                  src="/andrey.png"
                  alt="Andrey Gorbenko"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm shadow-xl">
                <p className="font-semibold">Andrey Gorbenko</p>
                <p className="text-xs text-[var(--accent)]">
                  KI-Automatisierung &middot; Wien
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
