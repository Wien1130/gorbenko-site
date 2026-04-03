export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--accent-dim),transparent_60%)]" />
      <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent)]/3 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              KI-Automatisierung &middot; Wien
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.2rem]">
              Ihr KI-Assistent
              <br />
              <span className="text-[var(--accent)]">antwortet</span> Ihren
              <br />
              Kunden &mdash; 24/7
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--muted)]">
              Auf Facebook &amp; Instagram. Nimmt Bestellungen an, beantwortet
              Fragen, qualifiziert Leads&nbsp;&mdash; automatisch und in Ihrem Ton.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="rounded-full bg-[var(--accent)] px-8 py-4 font-semibold text-[var(--background)] hover:opacity-90 transition"
              >
                Kostenlose Demo
              </a>
              <a
                href="#case"
                className="rounded-full border border-[var(--border)] px-8 py-4 font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                Ergebnis ansehen
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)] pulse-dot" />
                Bereits im Einsatz in Wien
              </span>
              <span>&lt;10 Sek. Antwortzeit</span>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-20 border-t border-[var(--border)] pt-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              Powered by Claude AI
            </span>
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
              Meta Business Integration
            </span>
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Made in Wien, &Ouml;sterreich
            </span>
          </div>
          </div>

          {/* Chat demo */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-2xl shadow-black/40">
              {/* Chat header */}
              <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--card)] px-5 py-3.5">
                <div className="relative h-9 w-9 rounded-full bg-[var(--accent)]/15 flex items-center justify-center text-xs font-bold text-[var(--accent)]">
                  BH
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--card)] bg-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">BlinHaus Vienna</p>
                  <p className="text-xs text-[var(--accent)]">
                    KI-Assistent &middot; Online
                  </p>
                </div>
                <span className="ml-auto text-xs text-[var(--muted)]">
                  jetzt
                </span>
              </div>

              {/* Messages */}
              <div className="space-y-3 p-5 min-h-[320px]">
                <div className="chat-msg flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-white/10 px-4 py-2.5 text-sm">
                    Hallo! Kann ich Blini f&uuml;r morgen bestellen?
                  </div>
                </div>

                <div className="chat-msg flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-[var(--accent)]/10 border border-[var(--accent)]/15 px-4 py-2.5 text-sm">
                    Willkommen bei BlinHaus! Nat&uuml;rlich helfe ich
                    Ihnen gerne. Unsere beliebtesten Blini: Lachs, K&auml;se,
                    Pilze. Was darf es sein?
                  </div>
                </div>

                <div className="chat-msg flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-white/10 px-4 py-2.5 text-sm">
                    3x Lachs, 2x K&auml;se. Lieferung um 18:00
                  </div>
                </div>

                <div className="chat-msg flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-[var(--accent)]/10 border border-[var(--accent)]/15 px-4 py-2.5 text-sm">
                    Perfekt! 3&times; Lachs (&euro;27) + 2&times; K&auml;se
                    (&euro;16) = <strong>&euro;43</strong>. Lieferung morgen um
                    18:00. Ihre Adresse bitte?
                  </div>
                </div>

                <div className="chat-msg flex justify-start">
                  <div className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/15 px-3 py-1.5 text-xs text-[var(--accent)]">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Antwort in 3 Sekunden
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
