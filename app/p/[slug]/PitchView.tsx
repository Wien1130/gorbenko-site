"use client";

import { useEffect, useRef, useState } from "react";
import type { PitchContent, PitchFocus } from "../../lib/crm/types";

const WA = "436765920259";
const PHONE = "+43 676 59 202 59";
const SITE = "https://gorbenko.at";
const INSTAGRAM = "https://www.instagram.com/ki.mit.andrii/";

type EventKind = "view" | "cta_whatsapp" | "cta_call" | "cta_site" | "form";

function utm(slug: string, url: string, content: string): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", "coldsales");
  u.searchParams.set("utm_medium", "pitch");
  u.searchParams.set("utm_campaign", "100kunden-2026-10");
  u.searchParams.set("utm_content", `${slug}-${content}`);
  return u.toString();
}

export default function PitchView({
  slug,
  businessName,
  contactName,
  focus,
  content,
  createdAt,
  youtubeUrl,
}: {
  slug: string;
  businessName: string;
  contactName: string;
  focus: PitchFocus;
  content: PitchContent;
  createdAt: string;
  youtubeUrl: string;
}) {
  const YOUTUBE = youtubeUrl;
  const sent = useRef(false);
  const [form, setForm] = useState({ name: contactName, contact: "", message: "" });
  const [formState, setFormState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  function track(kind: EventKind, extra: Record<string, string> = {}) {
    const sp = new URLSearchParams(window.location.search);
    const body = JSON.stringify({
      kind,
      utm_source: sp.get("utm_source") ?? "",
      utm_medium: sp.get("utm_medium") ?? "",
      utm_campaign: sp.get("utm_campaign") ?? "",
      referrer: document.referrer,
      ...extra,
    });
    if (kind !== "form" && navigator.sendBeacon) {
      navigator.sendBeacon(`/api/p/${slug}/event`, new Blob([body], { type: "application/json" }));
      return Promise.resolve(true);
    }
    return fetch(`/api/p/${slug}/event`, { method: "POST", headers: { "Content-Type": "application/json" }, body }).then((r) => r.ok);
  }

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track("view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.contact.trim() && !form.message.trim()) return;
    setFormState("sending");
    const ok = await track("form", form);
    setFormState(ok ? "ok" : "err");
  }

  const date = new Date(createdAt).toLocaleDateString("de-AT", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Vienna" });
  const waHref = `https://wa.me/${WA}?text=${encodeURIComponent(content.whatsapp_text)}`;
  const focusLabel = focus === "catering" ? "Catering" : focus === "gastro" ? "Gastronomie" : "Marketing";

  return (
    <>
      <header className="pt-top">
        <a className="pt-brand" href={utm(slug, SITE, "brand")} onClick={() => track("cta_site", { target: "brand" })}>
          Gorbenko<span>Werbeagentur · Wien</span>
        </a>
        <div className="pt-date">{date}</div>
      </header>

      <main className="pt-shell">
        <p className="pt-kicker">Persönlich für {businessName} · {focusLabel}</p>
        <h1 className="pt-h1 pt-serif">{content.headline}</h1>
        <p className="pt-sub">{content.subline}</p>

        {content.observed.length > 0 && (
          <>
            <h2 className="pt-h2">Was mir bei Ihnen aufgefallen ist</h2>
            <ul className="pt-obs">
              {content.observed.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </>
        )}

        <h2 className="pt-h2">Was ich für {businessName} vorschlage</h2>
        {content.proposals.map((p, i) => (
          <div className="pt-card" key={i}>
            <div className="pt-num">0{i + 1}</div>
            <h3 className="pt-serif">{p.title}</h3>
            <p>{p.text}</p>
          </div>
        ))}

        <h2 className="pt-h2">Warum ich</h2>
        <div className="pt-me">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero-portrait.png" alt="Andrii Gorbenko" />
          <div>
            <p>{content.why_me}</p>
            <small>Andrii Gorbenko · Inhaber, Werbeagentur Gorbenko, Wien · 15 Jahre eigener Unternehmer</small>
          </div>
        </div>

        <h2 className="pt-h2">Einblick in meine Arbeit</h2>
        <div className="pt-proof">
          <a href={utm(slug, `${SITE}/projekte/nagl`, "nagl")} target="_blank" rel="noreferrer" onClick={() => track("cta_site", { target: "nagl" })}>
            <b>Messerschmiede Stefan Nagl, Wien</b>
            <span>Landingpage, digitaler Assistent, Drehtage in der Werkstatt, Google- &amp; Meta-Kampagnen → Fallstudie lesen</span>
          </a>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" onClick={() => track("cta_site", { target: "instagram" })}>
            <b>Instagram @ki.mit.andrii</b>
            <span>Wie ich als Unternehmer in Wien mit KI arbeite — offen, mit echten Zahlen</span>
          </a>
          {YOUTUBE && (
            <a href={YOUTUBE} target="_blank" rel="noreferrer" onClick={() => track("cta_site", { target: "youtube" })}>
              <b>YouTube</b>
              <span>Hinter den Kulissen: wie meine Systeme im Alltag arbeiten</span>
            </a>
          )}
          <a href={utm(slug, `${SITE}/preise`, "preise")} target="_blank" rel="noreferrer" onClick={() => track("cta_site", { target: "preise" })}>
            <b>Preise</b>
            <span>Transparente ab-Preise, keine Umsatzsteuer (Kleinunternehmer § 6 Abs. 1 Z 27 UStG)</span>
          </a>
        </div>

        <section className="pt-next">
          <h2 className="pt-h2">Nächster Schritt</h2>
          <p className="pt-serif">{content.next_step}</p>
          <div className="pt-actions">
            <a className="pt-btn" href={waHref} target="_blank" rel="noreferrer" onClick={() => track("cta_whatsapp")}>
              Per WhatsApp antworten
            </a>
            <a className="pt-btn pt-btn-ghost" href={`tel:${PHONE.replace(/\s/g, "")}`} onClick={() => track("cta_call")}>
              Anrufen · {PHONE}
            </a>
          </div>

          <form className="pt-form" onSubmit={submitForm}>
            {formState === "ok" ? (
              <p className="pt-form-ok">Danke — ich melde mich noch heute bei Ihnen.</p>
            ) : (
              <>
                <label>
                  Oder Termin vorschlagen — Ihr Name
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
                </label>
                <label>
                  Telefon oder E-Mail
                  <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} autoComplete="tel" required />
                </label>
                <label>
                  Wann passt es Ihnen?
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="z. B. Dienstag nach 15 Uhr" />
                </label>
                <button className="pt-btn" type="submit" disabled={formState === "sending"}>
                  {formState === "sending" ? "Wird gesendet…" : "Termin vorschlagen"}
                </button>
                {formState === "err" && <p className="pt-form-err">Das hat nicht geklappt — bitte per WhatsApp oder Anruf.</p>}
              </>
            )}
          </form>
        </section>

        <footer className="pt-foot">
          Diese Seite wurde von Andrii Gorbenko persönlich für {businessName} nach unserem Gespräch erstellt (mit KI-Unterstützung beim Text). Sie ist nicht öffentlich auffindbar. Beim Öffnen werden Zeitpunkt und Browser-Typ gespeichert, keine IP-Adresse — Details unter{" "}
          <a href={`${SITE}/datenschutz`}>Datenschutz</a> · <a href={`${SITE}/impressum`}>Impressum</a>
        </footer>
      </main>
    </>
  );
}
