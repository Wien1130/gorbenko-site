"use client";

import { useEffect, useState } from "react";
import { SIEBEN_GOAL, SIEBEN_PHRASES } from "../data/sieben";

const STORAGE_KEY = "heft-sieben-reps";

type Reps = { day: string; counts: Record<string, number> };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadReps(): Reps {
  const empty: Reps = { day: today(), counts: {} };
  if (typeof window === "undefined") return empty;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as Reps | null;
    if (!parsed || parsed.day !== today()) return empty;
    return parsed;
  } catch {
    return empty;
  }
}

export default function SiebenClient() {
  const [reps, setReps] = useState<Reps>({ day: today(), counts: {} });
  const [hideRu, setHideRu] = useState(false);

  useEffect(() => {
    setReps(loadReps());
  }, []);

  function bump(id: string) {
    const next: Reps = {
      day: today(),
      counts: { ...reps.counts, [id]: (reps.counts[id] || 0) + 1 },
    };
    setReps(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const total = SIEBEN_PHRASES.length * SIEBEN_GOAL;
  const done = SIEBEN_PHRASES.reduce(
    (n, p) => n + Math.min(reps.counts[p.id] || 0, SIEBEN_GOAL),
    0,
  );
  const allDone = done >= total;

  return (
    <>
      <div className="heft-kicker">Verkauf · Sieben Sätze</div>
      <h1 className="heft-h1" style={{ color: "var(--cream)", marginTop: 8 }}>
        {allDone ? "Семь фраз — сегодня сделано" : "Семь фраз на одну дверь"}
      </h1>
      <p className="heft-lead" style={{ color: "var(--mute)" }}>
        Пять фраз плюс две спасательные. Больше в первую неделю не нужно. Повторять вслух — у двери,
        в кафе, в метро. Каждое повторение — нажатие. Цель — {SIEBEN_GOAL} раз каждую в день, счётчик
        обнуляется ночью.
      </p>
      <div className="heft-progress">
        <i style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
      </div>
      <p className="heft-lead" style={{ color: "var(--gold)", fontWeight: 700, marginTop: 0 }}>
        {done} из {total} повторений сегодня
      </p>
      <button
        className="heft-btn-ghost"
        type="button"
        style={{ marginBottom: 8 }}
        onClick={() => setHideRu((v) => !v)}
      >
        {hideRu ? "Показать перевод" : "Скрыть перевод — проверить себя"}
      </button>

      {SIEBEN_PHRASES.map((p, i) => {
        const n = reps.counts[p.id] || 0;
        const said = n >= SIEBEN_GOAL;
        return (
          <article key={p.id} className={`heft-paper heft-street-card${said ? " said" : ""}`}>
            <div className="heft-street-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="heft-kicker">{p.step}</div>
            <p className="heft-win-de" style={{ fontSize: "1.35rem", lineHeight: 1.35 }}>
              {p.de}
            </p>
            {!hideRu ? <p className="heft-win-ru">{p.ru}</p> : null}
            <p className="heft-win-note">{p.when}</p>
            <button
              className={`heft-btn${said ? " done" : ""}`}
              style={{ marginTop: 16 }}
              type="button"
              onClick={() => bump(p.id)}
            >
              {said ? `Сказал ${n} раз ✓` : `Сказал вслух · ${n}/${SIEBEN_GOAL}`}
            </button>
          </article>
        );
      })}

      <p className="heft-lead" style={{ color: "var(--mute)", marginTop: 28 }}>
        Остальные 43 фразы (боль, кейс, цена, возражения) — во вкладке «Дверь». Туда — когда эти семь
        идут без раздумий.
      </p>
    </>
  );
}
