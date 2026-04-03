"use client";

import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    // Formspree — replace YOUR_FORM_ID with your Formspree endpoint
    // Sign up free at https://formspree.io and create a form
    try {
      const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setSent(true);
      }
    } catch {
      // Fallback: open email client
      const name = data.get("name") as string;
      const email = data.get("email") as string;
      const message = data.get("message") as string;
      window.location.href = `mailto:gorbenko.ai@gmail.com?subject=Anfrage von ${name}&body=${encodeURIComponent(`Von: ${name}\nKontakt: ${email}\n\n${message}`)}`;
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-[var(--border)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Kontakt
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Lassen Sie uns
              <br />
              sprechen.
            </h2>
            <p className="mt-4 text-[var(--muted)] leading-relaxed">
              Erz&auml;hlen Sie mir von Ihrem Gesch&auml;ft. Ich zeige Ihnen in
              15 Minuten, wie ein KI-Assistent f&uuml;r Sie aussehen
              k&ouml;nnte &mdash; kostenlos und unverbindlich.
            </p>

            <div className="mt-10 space-y-5">
              <a
                href="https://wa.me/436765920259"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] p-4 hover:border-[var(--accent)]/30 transition group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.122 1.528 5.854L0 24l6.335-1.495A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.893 0-3.693-.508-5.27-1.475l-.378-.224-3.916.924.987-3.607-.247-.393A9.715 9.715 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-[var(--accent)] transition">
                    WhatsApp
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    Schnellste Antwort — direkt schreiben
                  </p>
                </div>
              </a>

              <a
                href="mailto:gorbenko.ai@gmail.com"
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] p-4 hover:border-[var(--accent)]/30 transition group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4L12 13 2 4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-[var(--accent)] transition">
                    E-Mail
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    gorbenko.ai@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://t.me/gorbenko_andrey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] p-4 hover:border-[var(--accent)]/30 transition group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-[var(--accent)] transition">
                    Telegram
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    @gorbenko_andrey
                  </p>
                </div>
              </a>
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 md:p-8">
              {sent ? (
                <div className="flex min-h-[340px] items-center justify-center text-center">
                  <div>
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)]/15">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold">Nachricht gesendet!</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Ich melde mich innerhalb von 24 Stunden bei Ihnen.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[var(--muted)]"
                    >
                      Name / Unternehmen
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                      placeholder="Ihr Name oder Firmenname"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[var(--muted)]"
                    >
                      E-Mail oder Telefon
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="text"
                      required
                      className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                      placeholder="Wie kann ich Sie erreichen?"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[var(--muted)]"
                    >
                      Nachricht
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="mt-2 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                      placeholder="Erzählen Sie kurz von Ihrem Geschäft und was Sie automatisieren möchten"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[var(--accent)] py-4 font-semibold text-[var(--background)] hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? "Wird gesendet..." : "Nachricht senden"}
                  </button>
                  <p className="text-xs text-center text-[var(--muted)]">
                    Kostenlos &amp; unverbindlich. Ich antworte innerhalb von 24h.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
