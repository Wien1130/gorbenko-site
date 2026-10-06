"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CONTACT } from "../../lib/content";
import type { AngebotClient } from "../../lib/angebot-clients";
import {
  RUBRIKEN,
  BLOCKS,
  blockPreisLabel,
  euro,
  kosten3M,
  matchPackage,
  parseSelectionParam,
  selectionToParam,
  summarize,
  type PricingBlock,
} from "../../lib/pricing";

function WhatsAppHref(text: string) {
  return `${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

export default function AngebotView({
  client,
  accessKey,
  initialParam,
}: {
  client: AngebotClient;
  accessKey: string;
  initialParam?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const fallback =
    client.packages.find((p) => p.id === client.defaultPresetId)?.blocks ??
    client.packages[0]?.blocks ??
    [];

  const [selected, setSelected] = useState<string[]>(() =>
    parseSelectionParam(initialParam, client.packages, fallback),
  );
  const [offen, setOffen] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState(false);

  const aktiv = matchPackage(selected, client.packages);
  const { chosen, monat1, abMonat2, einzel3M } = summarize(selected);
  const paket3M = aktiv ? aktiv.preis * 3 : null;
  const billed3M = paket3M ?? einzel3M;

  useEffect(() => {
    const p = selectionToParam(selected, client.packages);
    const qs = new URLSearchParams({ k: accessKey, p });
    router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
  }, [selected, accessKey, client.packages, pathname, router]);

  const summaryText = useMemo(() => {
    const name = aktiv ? `Paket ${aktiv.name}` : "Individuell";
    const lines = chosen.map((b) => `• ${b.kurz}`).join("\n");
    const money = aktiv
      ? `${euro(aktiv.preis)}/Monat × 3 = ${euro(aktiv.preis * 3)}`
      : `à la carte über 3 Monate: ${euro(einzel3M)}`;
    return [
      `Angebot ${client.clientName}`,
      name,
      money,
      `1. Monat: ${euro(monat1)} · ab 2. Monat: ${euro(abMonat2)}`,
      lines,
    ].join("\n");
  }, [aktiv, chosen, client.clientName, einzel3M, monat1, abMonat2]);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function copyLink() {
    const p = selectionToParam(selected, client.packages);
    const url = `${window.location.origin}${pathname}?k=${encodeURIComponent(accessKey)}&p=${encodeURIComponent(p)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setFormError(false);
    const data = new FormData(e.currentTarget);
    const contact = String(data.get("contact") ?? "").trim();
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? "").trim(),
          business: client.formBusiness,
          request: `${summaryText}\n\n${String(data.get("note") ?? "").trim()}`,
          email: contact.includes("@") ? contact : "",
          phone: contact.includes("@") ? "" : contact,
        }),
      });
      if (!res.ok) throw new Error("fail");
      setSent(true);
    } catch {
      setFormError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <header className="ag-top">
        <div className="ag-brand">
          Gorbenko
          <span>{client.clientName}</span>
        </div>
        <a className="ag-top-link" href="https://gorbenko.at">
          gorbenko.at
        </a>
      </header>

      <div className="ag-shell">
        <div>
          <p className="ag-kicker">{client.eyebrow}</p>
          <h1 className="ag-h1 ag-serif">{client.title}</h1>
          <p className="ag-intro">{client.introDe}</p>

          <h2 className="ag-h2">3 Pakete · fix für 3 Monate</h2>
          <div className="ag-packs">
            {client.packages.map((pack) => {
              const pBlocks = pack.blocks
                .map((id) => BLOCKS.find((b) => b.id === id))
                .filter((b): b is PricingBlock => Boolean(b));
              const einzeln = pBlocks.reduce((s, b) => s + kosten3M(b), 0);
              const on = aktiv?.id === pack.id;
              return (
                <article key={pack.id} className={`ag-sheet${on ? " is-on" : ""}`}>
                  <button
                    type="button"
                    className="ag-sheet-pick"
                    onClick={() => setSelected([...pack.blocks])}
                  >
                    <div className="ag-sheet-head">
                      <div className="ag-sheet-name">{pack.name}</div>
                      <div className="ag-sheet-price">
                        {euro(pack.preis)}/Monat
                        {on ? " · gewählt" : ""}
                      </div>
                    </div>
                    <p className="ag-sheet-q ag-serif">„{pack.ziel}“</p>
                  </button>
                  {pBlocks.map((b) => {
                    const kid = `${pack.id}-${b.id}`;
                    const open = offen === kid;
                    return (
                      <div key={b.id}>
                        <button
                          type="button"
                          className="ag-row"
                          onClick={() => setOffen(open ? null : kid)}
                        >
                          <span>{b.kurz}</span>
                          <span className="ag-row-price">{blockPreisLabel(b)}</span>
                        </button>
                        {b.fremd ? <span className="ag-fremd">{b.fremd}</span> : null}
                        {open ? (
                          <ul className="ag-dots">
                            {b.enthaelt.slice(0, 5).map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    );
                  })}
                  <div className="ag-sheet-foot">
                    <div>
                      Einzeln über 3 Monate{" "}
                      <span className="ag-strike">{euro(einzeln)}</span>
                    </div>
                    <div>
                      Als Paket: 3 × {euro(pack.preis)} = {euro(pack.preis * 3)}
                    </div>
                    <p className="ag-save">
                      Sie sparen {euro(einzeln - pack.preis * 3)}
                    </p>
                    <span className="ag-fremd">{pack.fremd}</span>
                  </div>
                </article>
              );
            })}
          </div>

          <h2 className="ag-h2">Bausteine · Häkchen = Individuell</h2>
          {RUBRIKEN.map((rubrik) => {
            const rows = BLOCKS.filter((b) => b.rubrik === rubrik);
            if (!rows.length) return null;
            return (
              <div key={rubrik}>
                <h3 className="ag-h2" style={{ marginTop: 28 }}>
                  {rubrik}
                </h3>
                {rows.map((b) => {
                  const open = offen === `bau-${b.id}`;
                  return (
                    <div key={b.id} className="ag-block">
                      <input
                        type="checkbox"
                        checked={selected.includes(b.id)}
                        onChange={() => toggle(b.id)}
                        aria-label={b.name}
                      />
                      <div>
                        <p className="ag-block-name">{b.name}</p>
                        <p className="ag-block-loest">Löst: {b.loest}</p>
                        {b.hinweis ? (
                          <p className="ag-block-loest">{b.hinweis}</p>
                        ) : null}
                        {b.fremd ? <span className="ag-fremd">{b.fremd}</span> : null}
                        <button
                          type="button"
                          className="ag-more"
                          onClick={() => setOffen(open ? null : `bau-${b.id}`)}
                        >
                          {open ? "Schließen" : "Was steckt drin"}
                        </button>
                        {open ? (
                          <ul className="ag-dots">
                            {b.enthaelt.slice(0, 5).map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                      <div className="ag-row-price">{blockPreisLabel(b)}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div className="ag-notes">
            <h2 className="ag-h2" style={{ marginTop: 0 }}>
              Außerhalb unserer Rechnung
            </h2>
            {client.notes.map((n) => (
              <p key={n.de}>{n.de}</p>
            ))}
          </div>
        </div>

        <aside className="ag-sum">
          <h2>Ihre Auswahl</h2>
          <div className="ag-stat">
            <span>1. Monat inkl. Setup</span>
            <strong>{euro(monat1)}</strong>
          </div>
          <div className="ag-stat">
            <span>ab 2. Monat</span>
            <strong>{euro(abMonat2)}</strong>
          </div>
          <div className="ag-stat">
            <span>3 Monate {aktiv ? "Paket" : "einzeln"}</span>
            <strong>{euro(billed3M)}</strong>
          </div>
          {aktiv && paket3M !== null ? (
            <p className="ag-sum-note">
              Paket {aktiv.name}: {euro(aktiv.preis)}/Monat × 3 = {euro(paket3M)}{" "}
              statt {euro(einzel3M)} einzeln
              {einzel3M > paket3M ? ` — Sie sparen ${euro(einzel3M - paket3M)}.` : "."}{" "}
              Start: 50 % des ersten Monats im Voraus.
            </p>
          ) : (
            <p className="ag-sum-note">
              Individuelle Auswahl — daraus mache ich einen Paketpreis.
            </p>
          )}
          {aktiv ? <p className="ag-sum-fremd">{aktiv.fremd}</p> : null}

          <div className="ag-actions">
            <a className="ag-btn" href={WhatsAppHref(summaryText)}>
              Per WhatsApp antworten
            </a>
            <button type="button" className="ag-btn ag-btn-ghost" onClick={copyLink}>
              {copied ? "Link kopiert" : "Diesen Stand teilen"}
            </button>
          </div>

          <div className="ag-form">
            {sent ? (
              <p className="ag-form-ok">
                Danke — ich melde mich. Sie können mir auch auf WhatsApp schreiben.
              </p>
            ) : (
              <form onSubmit={onSubmit}>
                <label>
                  Ihr Name *
                  <input name="name" required placeholder="Reza Homayuni" />
                </label>
                <label>
                  Telefon oder E-Mail *
                  <input name="contact" required placeholder="+43 … oder E-Mail" />
                </label>
                <label>
                  Kurznotiz
                  <textarea name="note" placeholder="Wunschtermin, Frage, …" />
                </label>
                <button className="ag-btn" type="submit" disabled={sending}>
                  {sending ? "Sende…" : "Dieses Angebot sichern"}
                </button>
                {formError ? (
                  <p className="ag-form-err">
                    Senden fehlgeschlagen — bitte WhatsApp nutzen.
                  </p>
                ) : null}
              </form>
            )}
          </div>
        </aside>
      </div>

      <div className="ag-bar">
        <div>
          <div style={{ fontSize: 11, color: "var(--ag-muted)" }}>
            {aktiv ? `Paket ${aktiv.name}` : "Individuell"} · 3 Monate
          </div>
          <strong>{euro(billed3M)}</strong>
        </div>
        <a href={WhatsAppHref(summaryText)}>WhatsApp</a>
      </div>
    </>
  );
}
