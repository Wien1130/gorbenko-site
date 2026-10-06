"use client";

import { useEffect, useState } from "react";
import { getLesson } from "../data/lessons";

function storageKey(date: string) {
  return `heft-street-${date}`;
}

function loadDone(date: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(storageKey(date)) || "[]") as string[];
  } catch {
    return [];
  }
}

export default function StreetClient({ lessonId }: { lessonId?: string }) {
  const lesson = getLesson(lessonId);
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    setDone(loadDone(lesson.date));
  }, [lesson.date]);

  function toggle(id: string) {
    const next = done.includes(id) ? done.filter((x) => x !== id) : [...done, id];
    setDone(next);
    localStorage.setItem(storageKey(lesson.date), JSON.stringify(next));
  }

  const total = lesson.street.length;
  const count = done.length;
  const nextMove = lesson.street.find((m) => !done.includes(m.id));
  const closed = count === total;

  return (
    <>
      <div className="heft-kicker">Heute · Kaltakquise</div>
      <h1 className="heft-h1" style={{ color: "var(--cream)", marginTop: 8 }}>
        {closed ? "Урок на улице закрыт" : "5 фраз. Сегодня."}
      </h1>
      <p className="heft-lead" style={{ color: "var(--mute)" }}>
        {closed
          ? "Немецкий сегодня работал на деньги. Не в тетради."
          : "Не выучил — сказал у двери. Пока не отметишь все пять, час с Ксюшей ещё не доехал."}
      </p>
      <div className="heft-progress">
        <i style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
      </div>
      <p className="heft-lead" style={{ color: "var(--gold)", fontWeight: 700, marginTop: 0 }}>
        {count} из {total} сказано на точке
      </p>

      {nextMove && !closed ? (
        <div className="heft-street-now">
          <div className="heft-kicker">Сейчас скажи</div>
          <p className="heft-win-de">{nextMove.de}</p>
          <p className="heft-win-ru" style={{ color: "rgba(246,237,217,0.7)" }}>
            {nextMove.when}
          </p>
        </div>
      ) : null}

      {lesson.street.map((move, i) => {
        const said = done.includes(move.id);
        const current = nextMove?.id === move.id;
        return (
          <article
            key={move.id}
            className={`heft-paper heft-street-card${said ? " said" : ""}${current ? " now" : ""}`}
          >
            <div className="heft-street-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="heft-kicker">
              {move.step}
              {current ? " · твоя очередь" : ""}
              {said ? " · сказано" : ""}
            </div>
            <p className="heft-win-de">{move.de}</p>
            <p className="heft-win-ru">{move.ru}</p>
            <p className="heft-win-note">{move.when}</p>
            <button
              className={`heft-btn${said ? " done" : ""}`}
              style={{ marginTop: 16 }}
              type="button"
              onClick={() => toggle(move.id)}
            >
              {said ? "Сказал на точке ✓" : "Сказал на точке"}
            </button>
          </article>
        );
      })}
    </>
  );
}
