"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

function updateConsent(granted: boolean) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const state = granted ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    ad_storage: state,
    analytics_storage: state,
    ad_user_data: state,
    ad_personalization: state,
  });
  if (granted) {
    window.dataLayer.push({ event: "consent_granted" });
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent");
    if (!stored) {
      setVisible(true);
    } else if (stored === "granted") {
      updateConsent(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem("cookie_consent", "granted");
    updateConsent(true);
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem("cookie_consent", "denied");
    updateConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl shadow-black/60 sm:flex sm:items-center sm:gap-6">
        {/* Icon */}
        <div className="mb-3 flex-shrink-0 sm:mb-0">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2c0 1.5.5 2.5 1.5 3S16 5.5 16 7c1.5 0 3 1 3 2.5 1.5.5 3 1.5 3 2.5-1 5.5-5 10-10 10z" />
              <circle cx="8.5" cy="11.5" r="1" fill="currentColor" />
              <circle cx="13" cy="15" r="1" fill="currentColor" />
              <circle cx="14" cy="9" r="0.75" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Wir verwenden Cookies</p>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--muted)]">
            Wir nutzen Google Analytics und Meta Pixel, um unsere Website zu
            verbessern und relevante Werbung zu schalten. Mehr dazu in unserer{" "}
            <a
              href="/datenschutz"
              className="text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Datenschutzerkl&auml;rung
            </a>
            .
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-shrink-0 gap-2 sm:mt-0">
          <button
            onClick={handleDecline}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)] transition"
          >
            Nur notwendige
          </button>
          <button
            onClick={handleAccept}
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-[var(--background)] hover:opacity-90 transition"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
