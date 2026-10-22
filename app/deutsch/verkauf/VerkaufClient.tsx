"use client";

import { useEffect, useState } from "react";
import { VERKAUF_BLOCKS, VERKAUF_TOTAL } from "../data/verkauf";

const STORAGE_KEY = "heft-verkauf-known";

function loadKnown(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export default function VerkaufClient() {
  const [known, setKnown] = useState<string[]>([]);
  const [hideRu, setHideRu] = useState(false);

  useEffect(() => {
    setKnown(loadKnown());
  }, []);

  function toggle(id: string) {
    const next = known.includes(id) ? known.filter((x) => x !== id) : [...known, id];
    setKnown(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const count = known.length;
  const closed = count === VERKAUF_TOTAL;

  return (
    <>
      <div className="heft-kicker">Verkauf · Die Tür</div>
      <h1 className="heft-h1" style={{ color: "var(--cream)", marginTop: 8 }}>
        {closed ? "Все фразы в голове" : "Фразы для двери"}
      </h1>
      <p className="heft-lead" style={{ color: "var(--mute)" }}>
        Порядок: имя → главная фраза → вопрос → слушать → отразить боль → один кейс → цена → почта.
        Телефон с портфолио не доставать. Не читать с экрана — выучить, чтобы быть нарядным.
      </p>
      <div className="heft-progress">
        <i style={{ width: `${VERKAUF_TOTAL ? (count / VERKAUF_TOTAL) * 100 : 0}%` }} />
      </div>
      <p className="heft-lead" style={{ color: "var(--gold)", fontWeight: 700, marginTop: 0 }}>
        {count} из {VERKAUF_TOTAL} выучено
      </p>
      <button
        className="heft-btn-ghost"
        type="button"
        style={{ marginBottom: 8 }}
        onClick={() => setHideRu((v) => !v)}
      >
        {hideRu ? "Показать перевод" : "Скрыть перевод — проверить себя"}
      </button>

      {VERKAUF_BLOCKS.map((block) => (
        <section key={block.id} style={{ marginTop: 28 }}>
          <div className="heft-kicker">{block.title}</div>
          <p className="heft-lead" style={{ color: "var(--mute)", marginTop: 4 }}>
            {block.note}
          </p>
          {block.phrases.map((p, i) => {
            const said = known.includes(p.id);
            return (
              <article key={p.id} className={`heft-paper heft-street-card${said ? " said" : ""}`}>
                <div className="heft-street-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="heft-kicker">{said ? "выучено" : "учу"}</div>
                <p className="heft-win-de">{p.de}</p>
                {!hideRu ? <p className="heft-win-ru">{p.ru}</p> : null}
                <p className="heft-win-note">{p.when}</p>
                <button
                  className={`heft-btn${said ? " done" : ""}`}
                  style={{ marginTop: 16 }}
                  type="button"
                  onClick={() => toggle(p.id)}
                >
                  {said ? "Знаю наизусть ✓" : "Знаю наизусть"}
                </button>
              </article>
            );
          })}
        </section>
      ))}
    </>
  );
}
