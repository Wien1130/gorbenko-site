"use client";

import { useEffect, useMemo, useState } from "react";
import { getLesson } from "../data/lessons";

function storageKey(lessonId: string) {
  return `heft-hw-${lessonId}`;
}

function tokensFrom(de: string) {
  return de.trim().split(/\s+/);
}

type Progress = Record<string, boolean>;

function loadProgress(lessonId: string): Progress {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(storageKey(lessonId)) || "{}") as Progress;
  } catch {
    return {};
  }
}

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export default function HomeworkClient({ lessonId }: { lessonId?: string }) {
  const lesson = getLesson(lessonId);
  const winTokens = useMemo(() => tokensFrom(lesson.win.de), [lesson.win.de]);
  const [progress, setProgress] = useState<Progress>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [tripleStep, setTripleStep] = useState<Record<string, number>>({});
  const [built, setBuilt] = useState<string[]>([]);
  const [bank, setBank] = useState(() => shuffle(winTokens));

  useEffect(() => {
    setProgress(loadProgress(lesson.id));
    setBuilt([]);
    setBank(shuffle(tokensFrom(lesson.win.de)));
    setOpen({});
    setTripleStep({});
  }, [lesson.id, lesson.win.de]);

  const doneCount = Object.values(progress).filter(Boolean).length;
  const total = lesson.triples.length + lesson.homework.length + 2;

  function mark(id: string) {
    const next = { ...progress, [id]: true };
    setProgress(next);
    localStorage.setItem(storageKey(lesson.id), JSON.stringify(next));
  }

  function addToken(token: string, i: number) {
    setBuilt((prev) => [...prev, token]);
    setBank((prev) => prev.filter((_, idx) => idx !== i));
  }

  const builtOk = built.join(" ") === winTokens.join(" ");

  return (
    <>
      <div className="heft-kicker">Домашка · до {lesson.nextLabel}</div>
      <h1 className="heft-h1" style={{ color: "var(--cream)", marginTop: 8 }}>
        Вслух, не в тетради
      </h1>
      <p className="heft-lead" style={{ color: "var(--mute)" }}>
        {doneCount} из {total} закрыто. Кнопки большие — удобно и на маке, и на телефоне.
      </p>
      <div className="heft-progress">
        <i style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }} />
      </div>

      <section className="heft-paper">
        <h2 className="heft-h2">Собери выигрыш</h2>
        <p className="heft-lead">{lesson.win.note}</p>
        <div className="heft-build">
          {built.length === 0 ? <span style={{ color: "#8a7d6a" }}>Здесь соберётся фраза</span> : built.map((w, i) => <b key={`${w}-${i}`}>{w}</b>)}
        </div>
        <div className="heft-actions">
          {bank.map((token, i) => (
            <button className="heft-token" key={`${token}-${i}`} type="button" onClick={() => addToken(token, i)}>
              {token}
            </button>
          ))}
        </div>
        <div className="heft-actions" style={{ marginTop: 14 }}>
          <button
            className="heft-btn-ghost"
            type="button"
            onClick={() => {
              setBuilt([]);
              setBank(shuffle(winTokens));
            }}
          >
            Сбросить
          </button>
          {builtOk ? (
            <button className="heft-btn done" type="button" onClick={() => mark("win-order")}>
              Собрал верно
            </button>
          ) : null}
        </div>
        {builtOk ? <p className="heft-win-note">Да. Именно эта фраза с урока.</p> : null}
      </section>

      <section className="heft-section heft-paper">
        <h2 className="heft-h2">Тройки</h2>
        <p className="heft-lead">Жми карточку — откроется следующая ступень. Потом скажи вслух три раза.</p>
        {lesson.triples.map((t) => {
          const step = tripleStep[t.id] ?? 0;
          const shown = [t.base, t.comp, t.sup].slice(0, step + 1);
          return (
            <div key={t.id} style={{ marginBottom: 12 }}>
              <button
                type="button"
                onClick={() => setTripleStep((s) => ({ ...s, [t.id]: Math.min((s[t.id] ?? 0) + 1, 2) }))}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: 0,
                  background: "rgba(255,255,255,0.4)",
                  borderRadius: 16,
                  padding: 16,
                  cursor: "pointer",
                }}
              >
                <div className="heft-kicker">{t.ru}</div>
                <p className="heft-win-de" style={{ fontSize: 28, margin: "8px 0 0" }}>
                  {shown.join(" · ")}
                </p>
              </button>
              <button
                className={`heft-btn${progress[`tri-${t.id}`] ? " done" : ""}`}
                style={{ marginTop: 8 }}
                type="button"
                onClick={() => mark(`tri-${t.id}`)}
              >
                {progress[`tri-${t.id}`] ? "Сказал" : "Сказал три раза"}
              </button>
            </div>
          );
        })}
      </section>

      <section className="heft-section heft-paper">
        <h2 className="heft-h2">Фразы про твою неделю</h2>
        {lesson.homework.map((item) => (
          <div key={item.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px dashed rgba(26,20,16,0.1)" }}>
            <p className="heft-win-de" style={{ fontSize: 24 }}>{item.de}</p>
            {open[item.id] ? <p className="heft-win-ru">{item.ru}</p> : null}
            <div className="heft-actions" style={{ marginTop: 10 }}>
              <button className="heft-btn-ghost" type="button" onClick={() => setOpen((o) => ({ ...o, [item.id]: !o[item.id] }))} style={{ color: "var(--ink)", background: "rgba(26,20,16,0.06)" }}>
                {open[item.id] ? "Скрыть перевод" : "Перевод"}
              </button>
              <button className={`heft-btn${progress[item.id] ? " done" : ""}`} type="button" onClick={() => mark(item.id)}>
                {progress[item.id] ? "Вслух ✓" : "Сказал вслух"}
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="heft-section heft-paper">
        <h2 className="heft-h2">{lesson.rule.title}</h2>
        <p className="heft-lead">{lesson.rule.body}</p>
        <div className="heft-actions" style={{ marginTop: 16 }}>
          <button
            className="heft-btn-ghost"
            type="button"
            onClick={() => mark("plus-minus-ban")}
            style={{ color: "var(--ink)", background: "rgba(194,75,50,0.12)" }}
          >
            plus/minus
          </button>
          <button className={`heft-btn${progress["plus-minus-ban"] ? " done" : ""}`} type="button" onClick={() => mark("plus-minus-ban")}>
            Только ungefähr
          </button>
        </div>
      </section>
    </>
  );
}
