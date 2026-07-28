import type { Metadata } from "next";
import Logo from "../components/Logo";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | Gorbenko",
  description: "Datenschutzerklärung gemäß DSGVO für gorbenko.at.",
  robots: { index: false },
};

export default function DatenschutzPage() {
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
        <h1 className="font-display text-4xl font-bold tracking-tight mb-2">
          Datenschutzerkl&auml;rung
        </h1>
        <p className="text-sm text-[var(--muted)] mb-12">gem&auml;&szlig; DSGVO &amp; &ouml;sterreichischem Datenschutzgesetz</p>

        <div className="space-y-10 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold mb-3">1. Verantwortlicher</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--muted)] space-y-1">
              <p className="text-[var(--foreground)] font-medium">Andrii Gorbenko</p>
              <p>Hietzinger Hauptstra&szlig;e 72/2, 1130 Wien, &Ouml;sterreich</p>
              <p>
                E-Mail:{" "}
                <a href="mailto:gorbenkomagic@gmail.com" className="text-[var(--accent)] hover:underline">
                  gorbenkomagic@gmail.com
                </a>
              </p>
              <p>
                Telefon:{" "}
                <a href="tel:+436765920259" className="text-[var(--accent)] hover:underline">
                  +43 676 592 02 59
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. Hosting &amp; Technisches</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--muted)] space-y-3">
              <p>Diese Website wird &uuml;ber <strong className="text-[var(--foreground)]">Vercel Inc.</strong> (440 N Barranca Ave #4133, Covina, CA 91723, USA) gehostet. Beim Aufruf der Website werden automatisch Server-Logfiles erfasst (IP-Adresse, Browser, Betriebssystem, Uhrzeit). Rechtsgrundlage: Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO (berechtigtes Interesse an der sicheren Bereitstellung der Website).</p>
              <p>Vercel ist nach dem EU-US Data Privacy Framework zertifiziert. Weitere Informationen:{" "}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">vercel.com/legal/privacy-policy</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">3. Cookies &amp; Einwilligung</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--muted)] space-y-3">
              <p>Diese Website verwendet Cookies und &auml;hnliche Technologien. Beim ersten Besuch erscheint ein Cookie-Banner, &uuml;ber den Sie Ihre Einwilligung erteilen oder ablehnen k&ouml;nnen.</p>
              <p><strong className="text-[var(--foreground)]">Notwendige Cookies:</strong> Speichern Ihrer Cookie-Einwilligung (localStorage). Kein Tracking, keine Weitergabe an Dritte. Rechtsgrundlage: Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO.</p>
              <p><strong className="text-[var(--foreground)]">Analyse- &amp; Marketing-Cookies:</strong> Nur nach Ihrer Einwilligung (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO). Sie k&ouml;nnen die Einwilligung jederzeit widerrufen, indem Sie den Browser-Speicher l&ouml;schen.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">4. Google Tag Manager</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--muted)] space-y-3">
              <p>Wir verwenden den <strong className="text-[var(--foreground)]">Google Tag Manager</strong> (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland). Der Tag Manager selbst verarbeitet keine personenbezogenen Daten, aktiviert jedoch nach Einwilligung die unten beschriebenen Dienste.</p>
              <p>Datenschutz Google:{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">policies.google.com/privacy</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">5. Google Analytics 4</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--muted)] space-y-3">
              <p>Nach Ihrer Einwilligung verwenden wir <strong className="text-[var(--foreground)]">Google Analytics 4</strong> (Google Ireland Limited). Dabei werden Nutzungsdaten (Seitenaufrufe, Verweildauer, Herkunft) anonymisiert erfasst und an Google-Server &uuml;bertragen, auch in die USA.</p>
              <p><strong className="text-[var(--foreground)]">Zweck:</strong> Analyse des Nutzerverhaltens zur Verbesserung der Website.</p>
              <p><strong className="text-[var(--foreground)]">Rechtsgrundlage:</strong> Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO (Einwilligung).</p>
              <p><strong className="text-[var(--foreground)]">Speicherdauer:</strong> 14 Monate (in Google Analytics konfiguriert).</p>
              <p>Sie k&ouml;nnen der Datenerfassung widersprechen &uuml;ber:{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Google Analytics Opt-out</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. Meta Pixel (Facebook)</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--muted)] space-y-3">
              <p>Nach Ihrer Einwilligung verwenden wir das <strong className="text-[var(--foreground)]">Meta Pixel</strong> (Meta Platforms Ireland Limited, 4 Grand Canal Square, Dublin 2, Irland). Dabei werden Informationen &uuml;ber Ihr Verhalten auf unserer Website an Meta &uuml;bertragen, auch in die USA.</p>
              <p><strong className="text-[var(--foreground)]">Zweck:</strong> Messung der Wirksamkeit von Facebook-/Instagram-Werbeanzeigen, Erstellung von Zielgruppen f&uuml;r Retargeting.</p>
              <p><strong className="text-[var(--foreground)]">Rechtsgrundlage:</strong> Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO (Einwilligung).</p>
              <p>Datenschutzerkl&auml;rung Meta:{" "}
                <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">facebook.com/privacy/policy</a>
              </p>
              <p>Opt-out:{" "}
                <a href="https://www.facebook.com/settings/?tab=ads" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">Facebook Werbeeinstellungen</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. Kontaktaufnahme</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--muted)] space-y-3">
              <p>Wenn Sie uns per E-Mail, Telefon oder WhatsApp kontaktieren, werden Ihre Angaben (Name, Kontaktdaten, Nachricht) zur Bearbeitung Ihrer Anfrage gespeichert. Rechtsgrundlage: Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO (Vertragsanbahnung) bzw. Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO.</p>
              <p>Die Daten werden nicht an Dritte weitergegeben und gel&ouml;scht, sobald sie nicht mehr ben&ouml;tigt werden.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">8. Ihre Rechte</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--muted)]">
              <p className="mb-3">Sie haben gem&auml;&szlig; DSGVO folgende Rechte:</p>
              <ul className="space-y-2 list-none">
                {[
                  "Auskunft über Ihre gespeicherten Daten (Art. 15)",
                  "Berichtigung unrichtiger Daten (Art. 16)",
                  "Löschung Ihrer Daten (Art. 17)",
                  "Einschränkung der Verarbeitung (Art. 18)",
                  "Datenübertragbarkeit (Art. 20)",
                  "Widerspruch gegen die Verarbeitung (Art. 21)",
                  "Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3)",
                ].map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-[var(--accent)]">→</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                Anfragen richten Sie an:{" "}
                <a href="mailto:gorbenkomagic@gmail.com" className="text-[var(--accent)] hover:underline">
                  gorbenkomagic@gmail.com
                </a>
              </p>
              <p className="mt-3">
                Sie haben auch das Recht, sich bei der &ouml;sterreichischen Datenschutzbeh&ouml;rde zu beschweren:{" "}
                <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
                  www.dsb.gv.at
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">9. Aktualit&auml;t</h2>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--muted)]">
              <p>Diese Datenschutzerkl&auml;rung ist g&uuml;ltig ab April 2026. Wir behalten uns vor, sie bei &Auml;nderungen der Rechtslage oder unserer Dienste anzupassen.</p>
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
