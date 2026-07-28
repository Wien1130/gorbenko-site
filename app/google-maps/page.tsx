import type { Metadata } from "next";
import Logo from "../components/Logo";

export const metadata: Metadata = {
  title: "Google Maps Bewertungen verbessern – Wien | Gorbenko",
  description:
    "Ihr Café hat 3,6 Sterne auf Google Maps? Wir bringen Sie auf 4,5+ in 60 Tagen. Kostenlose Erstberatung für Wiener Cafés.",
  keywords: [
    "Google Maps Bewertungen",
    "Google Bewertungen verbessern",
    "Café Wien",
    "Google Rating",
    "Bewertungen Wien",
    "lokales Marketing Wien",
  ],
  openGraph: {
    title: "Von 3,6 auf 4,5+ Sterne – Google Maps für Wiener Cafés",
    description:
      "Ihr Café verliert täglich Gäste wegen schlechter Bewertungen. Wir lösen das.",
    locale: "de_AT",
    type: "website",
  },
};

// ── Update these before sending ──────────────────────────────────────────────
const WHATSAPP = "436765920259";
const PHONE_HREF = "tel:+436765920259";
const PHONE_LABEL = "+43 676 592 02 59";
// ─────────────────────────────────────────────────────────────────────────────

const WA_BERATUNG = `https://wa.me/${WHATSAPP}?text=Hallo%21+Ich+m%C3%B6chte+eine+kostenlose+Beratung+f%C3%BCr+mein+Caf%C3%A9+und+meine+Google+Maps+Bewertungen.`;
const WA_HERO = `https://wa.me/${WHATSAPP}?text=Hallo%21+Ich+interessiere+mich+f%C3%BCr+die+Verbesserung+meiner+Google+Maps+Bewertungen.`;

function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.66A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16z" />
    </svg>
  );
}

function Check() {
  return (
    <span className="mt-0.5 shrink-0 h-5 w-5 rounded-full bg-[var(--accent)]/15 flex items-center justify-center">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

export default function GoogleMapsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="/"><Logo /></a>
          <a
            href={WA_HERO}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] hover:opacity-90 transition"
          >
            <IconWhatsApp />
            WhatsApp schreiben
          </a>
          <a
            href={PHONE_HREF}
            className="sm:hidden inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
          >
            <IconPhone />
            Anrufen
          </a>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--accent-dim),transparent_60%)]" />
        <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent)]/[0.03] blur-[120px]" />

        <div className="relative mx-auto max-w-6xl px-6 w-full">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Google Maps &middot; Wien
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              Ihr Café hat{" "}
              <span className="line-through decoration-red-400 text-[var(--muted)]">
                3,6&nbsp;Sterne
              </span>
              .
              <br />
              <span className="text-[var(--accent)]">Wir bringen Sie auf 4,5+.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              T&auml;glich verlieren Caf&eacute;s in Wien potenzielle G&auml;ste,
              weil sie auf Google Maps schlecht bewertet sind. Wir &auml;ndern das
              &mdash; schnell, nachhaltig und ohne Risiko.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={WA_HERO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-[var(--accent)] px-8 py-4 font-semibold text-[var(--background)] hover:opacity-90 transition"
              >
                <IconWhatsApp />
                WhatsApp schreiben
              </a>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] px-8 py-4 font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                <IconPhone />
                {PHONE_LABEL}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-[var(--muted)]">
              <span className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--accent)] pulse-dot" />
                Kostenlose Erstberatung
              </span>
              <span>Erste Ergebnisse in 30 Tagen</span>
              <span>100&nbsp;% Google-konform</span>
            </div>
          </div>

          {/* Before / After cards */}
          <div className="mt-16 grid sm:grid-cols-2 gap-6 max-w-xl">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-7">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-red-400 mb-4">
                Jetzt
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold font-display">3,6</span>
                <span className="text-sm text-[var(--muted)]">/ 5,0</span>
              </div>
              <p className="text-xl text-yellow-400 mb-3">
                ★★★<span className="opacity-25">★★</span>
              </p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Potenzielle G&auml;ste gehen zur Konkurrenz &mdash; ohne
                zur&uuml;ckzublicken.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-7">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--accent)] mb-4">
                Nach unserer Arbeit
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold font-display text-[var(--accent)]">
                  4,5+
                </span>
                <span className="text-sm text-[var(--muted)]">/ 5,0</span>
              </div>
              <p className="text-xl text-yellow-400 mb-3">
                ★★★★<span className="opacity-40">★</span>
              </p>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Mehr G&auml;ste, mehr Vertrauen, mehr Umsatz &mdash; messbar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem ────────────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--border)] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
            Das Problem
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-2xl">
            3,6 Sterne kosten Sie
            <br />
            <span className="text-[var(--muted)]">t&auml;glich G&auml;ste &mdash; und Geld.</span>
          </h2>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: "94 % lesen Bewertungen",
                desc: "Fast alle potenziellen G\u00e4ste pr\u00fcfen Google Maps, bevor sie ein Caf\u00e9 besuchen. Unter 4,0 Sternen verlieren Sie die meisten sofort.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
                title: "Direkter Umsatzverlust",
                desc: "Ein Caf\u00e9 mit 4,5+ Sternen zieht 30\u201350\u00a0% mehr G\u00e4ste an als eines mit 3,6. Jeder Stern z\u00e4hlt direkt auf Ihren Umsatz.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                ),
                title: "Konkurrenz w\u00e4chst",
                desc: "W\u00e4hrend Sie warten, arbeiten Caf\u00e9s nebenan aktiv an ihren Bewertungen. Der Abstand w\u00e4chst jeden Monat.",
              },
            ].map((p) => (
              <article
                key={p.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 hover:border-[var(--accent)]/30 transition"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                  {p.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we do ─────────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--border)] py-24 md:py-32 bg-[var(--card)]">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
            Was wir tun
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-2xl">
            Unser System bringt Ihnen
            <br />
            <span className="text-[var(--accent)]">echte, positive Bewertungen.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-[var(--muted)] leading-relaxed">
            Wir nutzen bew&auml;hrte Strategien, um zufriedene G&auml;ste zu
            motivieren, ihre Erfahrungen auf Google zu teilen &mdash; vollst&auml;ndig
            konform mit den Google-Richtlinien.
          </p>

          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Analyse",
                desc: "Wir analysieren Ihr aktuelles Profil, Ihre Bewertungen und die Hauptschwachstellen.",
              },
              {
                step: "02",
                title: "Strategie",
                desc: "Wir entwickeln einen individuellen Plan speziell f\u00fcr Ihr Caf\u00e9 und Ihre G\u00e4ste.",
              },
              {
                step: "03",
                title: "Umsetzung",
                desc: "Wir aktivieren Ihre zufriedenen G\u00e4ste und sorgen f\u00fcr einen kontinuierlichen Bewertungsfluss.",
              },
              {
                step: "04",
                title: "Ergebnis",
                desc: "Ihr Rating steigt, Sie erscheinen h\u00f6her in der lokalen Suche \u2014 mehr G\u00e4ste kommen.",
              },
            ].map((s) => (
              <div key={s.step}>
                <div className="text-[5rem] font-bold font-display leading-none select-none text-[var(--accent)]/10">
                  {s.step}
                </div>
                <div className="-mt-4">
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Result ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--border)] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
                Das Ergebnis
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Erste Ergebnisse
                <br />
                <span className="text-[var(--accent)]">in 30 Tagen.</span>
              </h2>
              <p className="mt-6 text-lg text-[var(--muted)] leading-relaxed">
                Unsere Kunden sehen eine messbare Verbesserung ihres Google-Ratings
                bereits im ersten Monat. In 60&ndash;90 Tagen erreichen die meisten
                das Ziel von 4,5+.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "Rating von 3,6 auf 4,5+ in 60\u201390 Tagen",
                  "H\u00f6here Sichtbarkeit in der lokalen Google-Suche",
                  "Mehr organische G\u00e4ste ohne Werbekosten",
                  "St\u00e4rkeres Vertrauen bei neuen G\u00e4sten",
                  "100\u00a0% Google-konform \u2014 kein Risiko",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual progress card */}
            <div className="relative">
              <div className="rounded-3xl border border-[var(--accent)]/20 bg-[var(--card)] p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-[var(--accent)]/15 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Google Maps</p>
                    <p className="text-xs text-[var(--muted)]">Wien, &Ouml;sterreich</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[var(--muted)]">Vorher</span>
                      <span className="font-bold text-red-400">3,6 ★</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
                      <div className="h-full rounded-full bg-red-400/60" style={{ width: "72%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[var(--muted)]">Nachher</span>
                      <span className="font-bold text-[var(--accent)]">4,5+ ★</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
                      <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: "90%" }} />
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border)] text-center">
                  {[
                    { value: "30", label: "Tage bis erste\nErgebnisse" },
                    { value: "4,5+", label: "Sterne\nZiel" },
                    { value: "0\u00a0€", label: "Kosten f\u00fcr\nErstberatung" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold font-display text-[var(--accent)]">{stat.value}</p>
                      <p className="mt-1 text-xs text-[var(--muted)] leading-snug whitespace-pre-line">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[var(--accent)]/10 to-transparent -z-10 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing / CTA ──────────────────────────────────────────────────── */}
      <section className="border-t border-[var(--border)] py-24 md:py-32 bg-[var(--card)]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              So starten wir
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Kostenlose Beratung &mdash;
              <br />
              <span className="text-[var(--accent)]">ohne Verpflichtung.</span>
            </h2>
            <p className="mt-6 text-lg text-[var(--muted)] leading-relaxed">
              In einem 15-min&uuml;tigen Gespr&auml;ch analysieren wir Ihre
              Situation und zeigen Ihnen genau, was wir f&uuml;r Ihr Caf&eacute;
              tun k&ouml;nnen.
            </p>
          </div>

          <div className="mt-12 mx-auto max-w-lg rounded-3xl border border-[var(--accent)]/25 bg-[var(--background)] p-8 md:p-10">
            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <p className="text-2xl font-bold font-display">Erstberatung</p>
                <p className="text-sm text-[var(--muted)] mt-1">F&uuml;r Caf&eacute;s in Wien</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-3xl font-bold text-[var(--accent)]">Gratis</p>
                <p className="text-xs text-[var(--muted)]">15 Minuten</p>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Analyse Ihres Google Maps Profils",
                "Konkurrenzvergleich in Ihrer Umgebung",
                "Konkreter Aktionsplan f\u00fcr Ihr Caf\u00e9",
                "Keine versteckten Kosten, keine Verpflichtung",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={WA_BERATUNG}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--accent)] px-6 py-3.5 font-semibold text-[var(--background)] hover:opacity-90 transition"
              >
                <IconWhatsApp />
                WhatsApp schreiben
              </a>
              <a
                href={PHONE_HREF}
                className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-full border border-[var(--border)] px-6 py-3.5 font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                <IconPhone />
                Jetzt anrufen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <Logo />
              <p className="mt-1 text-xs text-[var(--muted)]">
                Google Maps Optimierung f&uuml;r Wiener Caf&eacute;s
              </p>
            </div>
            <p className="text-xs text-[var(--muted)]">
              &copy; {new Date().getFullYear()} Gorbenko Marketing &amp; Traffic.
              Wien, &Ouml;sterreich.
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
