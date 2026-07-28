"use client";

import { useState } from "react";

export default function BeratungForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const data = new FormData(e.currentTarget);
    const contact = String(data.get("contact") ?? "").trim();
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      business: String(data.get("business") ?? "").trim(),
      request: String(data.get("message") ?? "").trim() || "Kostenlose Beratung angefragt",
      email: contact.includes("@") ? contact : "",
      phone: contact.includes("@") ? "" : contact,
    };

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("send failed");
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[380px] items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <div>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)]/15">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-lg font-semibold">Danke für Ihre Anfrage!</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Ich melde mich innerhalb von 24 Stunden bei Ihnen.
          </p>
        </div>
      </div>
    );
  }

  const inputCls =
    "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 md:p-8"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[var(--muted)]">
          Ihr Name *
        </label>
        <input id="name" name="name" type="text" required className={inputCls} placeholder="Max Mustermann" />
      </div>
      <div>
        <label htmlFor="business" className="block text-sm font-medium text-[var(--muted)]">
          Unternehmen
        </label>
        <input id="business" name="business" type="text" className={inputCls} placeholder="Name Ihres Betriebs (optional)" />
      </div>
      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-[var(--muted)]">
          Telefon oder E-Mail *
        </label>
        <input id="contact" name="contact" type="text" required className={inputCls} placeholder="Wie kann ich Sie erreichen?" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[var(--muted)]">
          Was beschäftigt Sie gerade?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={`${inputCls} resize-none`}
          placeholder="Erzählen Sie kurz von Ihrem Geschäft — z. B. was Zeit frisst oder wo Kunden verloren gehen"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[var(--accent)] py-4 font-semibold text-[var(--background)] transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Wird gesendet…" : "Kostenlose Beratung anfragen"}
      </button>
      {error && (
        <p className="text-center text-sm text-[var(--c-rose)]">
          Senden fehlgeschlagen — schreiben Sie mir bitte direkt auf WhatsApp.
        </p>
      )}
      <p className="text-center text-xs text-[var(--muted)]">
        Kostenlos &amp; unverbindlich. Ich antworte innerhalb von 24 h.
      </p>
    </form>
  );
}
