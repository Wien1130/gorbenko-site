"use client";

import { useEffect, useMemo, useState } from "react";
import { getLesson, lessonCards } from "../data/lessons";

function storageKey(lessonId: string) {
  return `heft-cards-known-${lessonId}`;
}

function loadKnown(lessonId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(storageKey(lessonId)) || "[]") as string[];
  } catch {
    return [];
  }
}

export default function KartenClient({ lessonId }: { lessonId?: string }) {
  const lesson = getLesson(lessonId);
  const cards = useMemo(() => lessonCards(lesson), [lesson]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [known, setKnown] = useState<string[]>([]);

  useEffect(() => {
    setKnown(loadKnown(lesson.id));
    setIndex(0);
    setFlipped(false);
    setShowExample(false);
  }, [lesson.id]);

  const remaining = cards.filter((c) => !known.includes(c.id));
  const card = remaining[index] ?? remaining[0];
  const done = remaining.length === 0;

  function persist(next: string[]) {
    setKnown(next);
    localStorage.setItem(storageKey(lesson.id), JSON.stringify(next));
  }

  function nextCard() {
    setFlipped(false);
    setShowExample(false);
    const left = cards.filter((c) => !known.includes(c.id));
    if (left.length <= 1) {
      setIndex(0);
      return;
    }
    setIndex((i) => (i + 1) % left.length);
  }

  function markKnown() {
    if (!card) return;
    persist([...known, card.id]);
    setFlipped(false);
    setShowExample(false);
    setIndex(0);
  }

  function reset() {
    persist([]);
    setIndex(0);
    setFlipped(false);
    setShowExample(false);
  }

  const learned = known.length;
  const total = cards.length;

  return (
    <>
      <div className="heft-kicker">Карточки · телефон</div>
      <h1 className="heft-h1" style={{ color: "var(--cream)", marginTop: 8 }}>
        Тапни карточку
      </h1>
      <p className="heft-lead" style={{ color: "var(--mute)" }}>
        {learned} из {total} уже знаешь. Сначала немецкое, потом перевод.
      </p>
      <div className="heft-progress">
        <i style={{ width: `${total ? (learned / total) * 100 : 0}%` }} />
      </div>

      {done ? (
        <div className="heft-paper">
          <h2 className="heft-h2">Колода пустая</h2>
          <p className="heft-lead">Все карточки этого урока ты уже отметил. Можно пройти ещё раз.</p>
          <button className="heft-btn" style={{ marginTop: 18 }} onClick={reset} type="button">
            Начать заново
          </button>
        </div>
      ) : (
        <>
          <button
            className={`heft-flip${flipped ? " flipped" : ""}`}
            onClick={() => setFlipped((v) => !v)}
            type="button"
            style={{ width: "100%", border: 0, background: "transparent", padding: 0, textAlign: "left" }}
          >
            <div className="heft-flip-inner">
              <div className="heft-face front">
                <div className="heft-kicker">Deutsch</div>
                <p className="heft-face-de">{card.de}</p>
                <span style={{ color: "#6b5f50", fontSize: 13 }}>нажми — перевод</span>
              </div>
              <div className="heft-face back">
                <div className="heft-kicker">Русский</div>
                <p className="heft-face-de">{card.ru}</p>
                {card.hint ? <span style={{ color: "#6b5f50" }}>{card.hint}</span> : <span />}
              </div>
            </div>
          </button>

          {showExample && card.example ? (
            <div className="heft-example">
              <div className="heft-kicker">В предложении</div>
              <p>{card.example}</p>
              {card.exampleRu ? <span>{card.exampleRu}</span> : null}
            </div>
          ) : null}

          <div className="heft-actions" style={{ marginTop: 16 }}>
            {card.example ? (
              <button
                className="heft-btn-ghost"
                onClick={() => setShowExample((v) => !v)}
                type="button"
              >
                {showExample ? "Скрыть пример" : "Пример в предложении"}
              </button>
            ) : null}
            <button className="heft-btn-ghost" onClick={() => nextCard()} type="button">
              Ещё раз
            </button>
            <button className="heft-btn" onClick={markKnown} type="button">
              Знаю
            </button>
          </div>
        </>
      )}
    </>
  );
}
