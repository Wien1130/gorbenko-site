"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { from: "user" | "bot"; text: string };
type Scenario = { initials: string; name: string; messages: Msg[] };

const scenarios: Scenario[] = [
  {
    initials: "SN",
    name: "Messerschmiede Nagl",
    messages: [
      { from: "user", text: "Hallo! Ich suche ein Küchenmesser als Geschenk. Liefern Sie auch nach Graz?" },
      {
        from: "bot",
        text: "Gerne! Ja, wir liefern österreichweit. Für ein Geschenk empfehle ich ein handgeschmiedetes Küchenmesser — jedes Stück ein Unikat. Soll ich Ihnen einen Beratungstermin mit Stefan vereinbaren?",
      },
      { from: "user", text: "Ja, bitte! Am liebsten Samstag." },
      {
        from: "bot",
        text: "Perfekt — Samstag 10:00 ist frei. Ich habe Ihre Anfrage an Stefan weitergeleitet, er meldet sich persönlich. ✔",
      },
    ],
  },
  {
    initials: "BH",
    name: "BlinHaus Vienna",
    messages: [
      { from: "user", text: "Hallo! Kann ich Blini für morgen bestellen?" },
      {
        from: "bot",
        text: "Willkommen bei BlinHaus! Natürlich — unsere beliebtesten Blini: Lachs, Käse, Pilze. Was darf es sein?",
      },
      { from: "user", text: "3x Lachs, 2x Käse. Lieferung um 18:00" },
      {
        from: "bot",
        text: "Perfekt! 3× Lachs (€27) + 2× Käse (€16) = €43. Lieferung morgen um 18:00. Ihre Adresse bitte?",
      },
    ],
  },
];

export default function ChatDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  // Первый сценарий рендерится сразу целиком (SSR): быстрый LCP + читаемо для KI-краулеров.
  const [visible, setVisible] = useState(scenarios[0].messages.length);
  const [typing, setTyping] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const firstRun = useRef(true);

  const scenario = scenarios[scenarioIdx];

  useEffect(() => {
    const ts = timeouts.current;
    if (firstRun.current) {
      firstRun.current = false;
      ts.push(
        setTimeout(() => {
          setVisible(0);
          setScenarioIdx(1 % scenarios.length);
        }, 7000)
      );
      return () => {
        ts.forEach(clearTimeout);
        timeouts.current = [];
      };
    }
    let t = 800;
    scenario.messages.forEach((msg, i) => {
      if (msg.from === "bot") {
        ts.push(setTimeout(() => setTyping(true), t));
        t += 1100;
      }
      ts.push(
        setTimeout(() => {
          setTyping(false);
          setVisible(i + 1);
        }, t)
      );
      t += msg.from === "bot" ? 1600 : 1100;
    });
    // switch to next scenario
    ts.push(
      setTimeout(() => {
        setVisible(0);
        setScenarioIdx((s) => (s + 1) % scenarios.length);
      }, t + 3500)
    );
    return () => {
      ts.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, [scenario]);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-3.5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)]/15 text-xs font-bold text-[var(--accent)]">
          {scenario.initials}
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--card)] bg-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-medium">{scenario.name}</p>
          <p className="text-xs text-[var(--accent)]">Digitaler Assistent · Online</p>
        </div>
        <span className="ml-auto text-xs text-[var(--muted)]">jetzt</span>
      </div>

      <div className="min-h-[340px] space-y-3 p-5">
        {scenario.messages.slice(0, visible).map((msg, i) => (
          <div
            key={`${scenarioIdx}-${i}`}
            className={`flex animate-fade-up ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            style={{ animationDuration: "0.35s" }}
          >
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.from === "user"
                  ? "rounded-br-md bg-white/10"
                  : "rounded-bl-md border border-[var(--accent)]/15 bg-[var(--accent)]/10"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[var(--accent)]/15 bg-[var(--accent)]/10 px-4 py-3">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            </div>
          </div>
        )}
        {visible === scenario.messages.length && !typing && (
          <div className="flex animate-fade-up justify-start" style={{ animationDuration: "0.35s" }}>
            <div className="inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/15 bg-[var(--accent)]/10 px-3 py-1.5 text-xs text-[var(--accent)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Antwort in 3 Sekunden — automatisch
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
