"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AGENDA,
  BUREAU,
  CLIENTS,
  DAY,
  DAY_NOTE,
  DATES,
  EVENINGS,
  GOALS,
  KEY_TALK,
  MONEY,
  PARKING,
  PRICING,
  PRICING_RULES,
  PRINCIPLES,
  RITUALS,
  YEAR,
} from "./data";

// ── date utils ──
const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

function keyOf(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysUntil(iso: string, from: Date): number {
  const target = new Date(`${iso}T00:00:00`);
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86400000);
}

function agendaLabel(iso: string, from: Date): string {
  const diff = daysUntil(iso, from);
  const d = new Date(`${iso}T00:00:00`);
  const wd = WEEKDAYS[d.getDay()];
  const dm = `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
  if (diff === 0) return `сегодня · ${wd} ${dm}`;
  if (diff === 1) return `завтра · ${wd} ${dm}`;
  return `${wd} ${dm}`;
}

// ── localStorage helpers ──
function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota — не критично */
  }
}

const LS_RITUALS = "hq_rituals_v1"; // { "2026-08-21": ["gym", ...] }
const LS_MONEY = "hq_money_v1"; // ["card", ...]
const LS_FOCUS = "hq_focus_v1"; // { "2026-08-21": "текст" }

export default function HqClient() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());
  const [ritualLog, setRitualLog] = useState<Record<string, string[]>>({});
  const [moneyClosed, setMoneyClosed] = useState<string[]>([]);
  const [focusMap, setFocusMap] = useState<Record<string, string>>({});

  useEffect(() => {
    setNow(new Date());
    setRitualLog(loadJSON(LS_RITUALS, {}));
    setMoneyClosed(loadJSON(LS_MONEY, []));
    setFocusMap(loadJSON(LS_FOCUS, {}));
    setMounted(true);
  }, []);

  const todayKey = keyOf(now);
  const todayChecked = ritualLog[todayKey] ?? [];

  const toggleRitual = (id: string) => {
    setRitualLog((prev) => {
      const cur = new Set(prev[todayKey] ?? []);
      if (cur.has(id)) cur.delete(id);
      else cur.add(id);
      const next = { ...prev, [todayKey]: [...cur] };
      saveJSON(LS_RITUALS, next);
      return next;
    });
  };

  const toggleMoney = (id: string) => {
    setMoneyClosed((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveJSON(LS_MONEY, next);
      return next;
    });
  };

  const setFocus = (text: string) => {
    setFocusMap((prev) => {
      const next = { ...prev, [todayKey]: text };
      saveJSON(LS_FOCUS, next);
      return next;
    });
  };

  const streaks = useMemo(() => {
    const res: Record<string, number> = {};
    for (const r of RITUALS) {
      let streak = 0;
      const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // если сегодня ещё не отмечено — стрик считаем со вчера
      if (!(ritualLog[keyOf(cursor)] ?? []).includes(r.id)) {
        cursor.setDate(cursor.getDate() - 1);
      }
      while ((ritualLog[keyOf(cursor)] ?? []).includes(r.id)) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
      res[r.id] = streak;
    }
    return res;
  }, [ritualLog, now]);

  const moneyClosedSum = MONEY.items
    .filter((i) => moneyClosed.includes(i.id))
    .reduce((s, i) => s + i.amount, 0);
  const moneyPct = Math.min(100, Math.round((moneyClosedSum / MONEY.goal) * 100));

  const visibleAgenda = useMemo(
    () =>
      AGENDA.filter((a) => daysUntil(a.date, now) >= 0 && daysUntil(a.date, now) <= 14).sort(
        (a, b) => a.date.localeCompare(b.date)
      ),
    [now]
  );

  const dSprint = daysUntil(DATES.sprintEnd, now);

  return (
    <>
      <style>{`
        .hq-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 11px 14px; border-bottom: 1px solid var(--border-light);
          cursor: pointer; user-select: none; transition: background .12s;
        }
        .hq-row:last-child { border-bottom: none; }
        .hq-row:hover { background: var(--surface2); }
        .hq-check {
          width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
          border: 1.5px solid var(--text-3); margin-top: 1px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; color: transparent; transition: all .15s;
        }
        .hq-row.done .hq-check { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }
        .hq-row-main { flex: 1; min-width: 0; }
        .hq-row-label { font-size: 14px; color: var(--text); line-height: 1.45; }
        .hq-row.done .hq-row-label { color: var(--text-3); text-decoration: line-through; text-decoration-color: var(--text-3); }
        .hq-row-sub { font-size: 12px; color: var(--text-3); margin-top: 2px; }
        .hq-amount { font-size: 14px; font-weight: 700; color: var(--text); white-space: nowrap; }
        .hq-row.done .hq-amount { color: var(--green); }
        .hq-streak { font-size: 11px; font-weight: 700; color: var(--amber); white-space: nowrap; margin-top: 2px; }

        .hq-progress { height: 10px; border-radius: 6px; background: var(--surface2); border: 1px solid var(--border); overflow: hidden; }
        .hq-progress-fill { height: 100%; background: linear-gradient(90deg, #059669, var(--accent)); border-radius: 6px; transition: width .3s; }

        .hq-focus-input {
          width: 100%; font: inherit; font-size: 15px; font-weight: 600;
          background: var(--surface); color: var(--text);
          border: 1px solid var(--border); border-radius: 10px;
          padding: 12px 14px; outline: none;
        }
        .hq-focus-input:focus { border-color: var(--accent); }
        .hq-focus-input::placeholder { color: var(--text-3); font-weight: 400; }

        .hq-agenda-item {
          display: flex; gap: 12px; padding: 11px 14px;
          border-bottom: 1px solid var(--border-light); align-items: baseline;
        }
        .hq-agenda-item:last-child { border-bottom: none; }
        .hq-agenda-date { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--text-3); width: 108px; flex-shrink: 0; }
        .hq-agenda-date.today { color: var(--accent); }
        .hq-agenda-body { flex: 1; }
        .hq-agenda-title { font-size: 14px; color: var(--text); font-weight: 600; line-height: 1.4; }
        .hq-agenda-note { font-size: 12.5px; color: var(--text-3); margin-top: 2px; line-height: 1.5; }

        .hq-timeline-row { display: grid; grid-template-columns: 96px 1fr; gap: 12px; padding: 8px 14px; border-bottom: 1px solid var(--border-light); }
        .hq-timeline-row:last-child { border-bottom: none; }
        .hq-timeline-t { font-size: 12px; font-weight: 700; color: var(--accent); padding-top: 1px; white-space: nowrap; }
        .hq-timeline-label { font-size: 14px; color: var(--text-2); line-height: 1.5; }

        .hq-list { list-style: none; }
        .hq-list li { padding: 8px 0 8px 22px; position: relative; font-size: 14px; color: var(--text-2); line-height: 1.55; border-bottom: 1px solid var(--border-light); }
        .hq-list li:last-child { border-bottom: none; }
        .hq-list li::before { content: "→"; position: absolute; left: 0; color: var(--accent); font-weight: 700; }
        .hq-list.dots li::before { content: "·"; font-size: 20px; line-height: 1; }

        .hq-bureau-row { display: flex; gap: 10px; align-items: baseline; padding: 7px 0; font-size: 14px; color: var(--text-2); line-height: 1.5; border-bottom: 1px solid var(--border-light); }
        .hq-bureau-row:last-child { border-bottom: none; }
        .hq-bureau-mark { flex-shrink: 0; font-weight: 800; }
        .hq-bureau-row.ok { color: var(--text-3); }
        .hq-bureau-row.ok .hq-bureau-mark { color: var(--green); }
        .hq-bureau-row.todo .hq-bureau-mark { color: var(--amber); }
      `}</style>

      {/* ── шапка-статистика ── */}
      <div className="stat-strip">
        <div className="stat-box">
          <div className="stat-label">Спринт сентябрь</div>
          <div className="stat-val">{mounted ? (dSprint >= 0 ? `${dSprint} дн.` : "финиш") : "—"}</div>
          <div className="stat-note">до 30.09 — счета закрыты</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Деньги</div>
          <div className="stat-val">€{mounted ? moneyClosedSum.toLocaleString("de-AT") : "0"}</div>
          <div className="stat-note">из €{MONEY.goal.toLocaleString("de-AT")} закрыто</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Продажи недели</div>
          <div className="stat-val">3</div>
          <div className="stat-note">Эрик вт · Антон · Nagl (окт)</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Ритуалы сегодня</div>
          <div className="stat-val">
            {mounted ? todayChecked.length : 0}/{RITUALS.length}
          </div>
          <div className="stat-note">отмечай честно</div>
        </div>
      </div>

      {/* ── фокус дня ── */}
      <section className="section" style={{ marginBottom: 32 }}>
        <input
          className="hq-focus-input"
          placeholder="🎯 Главное дело сегодня — одно. Впиши и сделай."
          value={mounted ? focusMap[todayKey] ?? "" : ""}
          onChange={(e) => setFocus(e.target.value)}
        />
      </section>

      {/* ── агенда ── */}
      <section className="section">
        <h2 className="section-title">📅 Ближайшее</h2>
        <div className="card">
          {visibleAgenda.map((a, i) => {
            const isToday = daysUntil(a.date, now) === 0;
            return (
              <div className="hq-agenda-item" key={i}>
                <div className={`hq-agenda-date${isToday ? " today" : ""}`}>
                  {agendaLabel(a.date, now)}
                  {a.time ? <br /> : null}
                  {a.time}
                </div>
                <div className="hq-agenda-body">
                  <div className="hq-agenda-title">
                    <span className={`badge ${a.tone}`} style={{ marginRight: 8 }}>
                      ●
                    </span>
                    {a.title}
                  </div>
                  {a.note && <div className="hq-agenda-note">{a.note}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── деньги ── */}
      <section className="section">
        <h2 className="section-title">💶 Деньги — спринт {MONEY.deadlineLabel}</h2>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13, color: "var(--text-2)" }}>
          <span>
            Закрыто: <strong style={{ color: "var(--green)" }}>€{moneyClosedSum.toLocaleString("de-AT")}</strong>
          </span>
          <span>
            Осталось: <strong style={{ color: "var(--text)" }}>€{(MONEY.goal - moneyClosedSum).toLocaleString("de-AT")}</strong>
          </span>
        </div>
        <div className="hq-progress" style={{ marginBottom: 14 }}>
          <div className="hq-progress-fill" style={{ width: `${moneyPct}%` }} />
        </div>
        <div className="card">
          {MONEY.items.map((item) => {
            const done = moneyClosed.includes(item.id);
            return (
              <div className={`hq-row${done ? " done" : ""}`} key={item.id} onClick={() => toggleMoney(item.id)}>
                <div className="hq-check">✓</div>
                <div className="hq-row-main">
                  <div className="hq-row-label">{item.label}</div>
                </div>
                <div className="hq-amount">€{item.amount.toLocaleString("de-AT")}</div>
              </div>
            );
          })}
        </div>
        <div className="callout blue">{MONEY.path}</div>
      </section>

      {/* ── продажа недели ── */}
      <section className="section">
        <h2 className="section-title">🎯 Продажа недели: {KEY_TALK.title} · {KEY_TALK.when}</h2>
        <div className="callout green">
          <strong>Контекст:</strong> {KEY_TALK.context}
        </div>
        <div className="grid-2">
          <div className="card">
            <div className="card-head">Полы — ниже не иду</div>
            <div className="card-body">
              <ul className="hq-list">
                {KEY_TALK.floors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card">
            <div className="card-head">Лестница вариантов</div>
            <div className="card-body">
              <ul className="hq-list">
                {KEY_TALK.options.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-head">Забрать со встречи обязательно</div>
          <div className="card-body">
            <ul className="hq-list">
              {KEY_TALK.mustGet.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="callout purple">{KEY_TALK.mindset}</div>
      </section>

      {/* ── прайс ── */}
      <section className="section">
        <h2 className="section-title">💰 Прайс — ничего бесплатно</h2>
        <div className="card">
          {PRICING.map((p) => (
            <div className="hq-agenda-item" key={p.name}>
              <div className="hq-agenda-body">
                <div className="hq-agenda-title">{p.name}</div>
                <div className="hq-agenda-note">{p.note}</div>
              </div>
              <div className="hq-amount" style={{ alignSelf: "center" }}>{p.price}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-head">Правила продажи (выучены за €1.000+)</div>
          <div className="card-body">
            <ul className="hq-list">
              {PRICING_RULES.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="callout amber">
          Полный прайс с расчётами и лестницами по клиентам: <code>me/PRICING.md</code>
        </div>
      </section>

      {/* ── год в зеркале ── */}
      <section className="section">
        <h2 className="section-title">🪞 Год в зеркале — ответы на вопросы Алины (06.09)</h2>
        <div className="grid-2">
          <div className="card">
            <div className="card-head">Что принесло деньги</div>
            <div className="card-body">
              <ul className="hq-list">
                {YEAR.earned.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card">
            <div className="card-head">Что отдал бесплатно (больше нет)</div>
            <div className="card-body">
              <ul className="hq-list dots">
                {YEAR.free.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card">
            <div className="card-head">Что нравится — ответ Алине №1</div>
            <div className="card-body">
              <ul className="hq-list">
                {YEAR.liked.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card">
            <div className="card-head">Чем делюсь за деньги — ответ №2</div>
            <div className="card-body">
              <ul className="hq-list">
                {YEAR.forMoney.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── клиенты ── */}
      <section className="section">
        <h2 className="section-title">🤝 Клиенты и пайплайн</h2>
        {CLIENTS.map((c) => (
          <div className="card" key={c.name}>
            <div className="card-head">
              <span>{c.name}</span>
              <span className={`badge ${c.tone}`}>{c.badge}</span>
            </div>
            <div className="card-body">
              <p>
                <strong>Статус:</strong> {c.status}
              </p>
              <p>
                <strong>Дальше:</strong> {c.next}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ── ритуалы ── */}
      <section className="section">
        <h2 className="section-title">🔁 Ритуалы — сегодня</h2>
        <div className="card">
          {RITUALS.map((r) => {
            const done = todayChecked.includes(r.id);
            const streak = streaks[r.id] ?? 0;
            return (
              <div className={`hq-row${done ? " done" : ""}`} key={r.id} onClick={() => toggleRitual(r.id)}>
                <div className="hq-check">✓</div>
                <div className="hq-row-main">
                  <div className="hq-row-label">
                    {r.icon} {r.label}
                  </div>
                </div>
                {streak > 0 && <div className="hq-streak">🔥 {streak} дн.</div>}
              </div>
            );
          })}
        </div>
        <div className="callout neutral">
          Отметки живут в этом браузере (телефоне). Сорвался день — не драма: отметил что есть, продолжил. Стрик — мотивация, не кнут.
        </div>
      </section>

      {/* ── идеальный день ── */}
      <section className="section">
        <h2 className="section-title">🗓 Идеальный день — каркас</h2>
        <div className="card">
          {DAY.map((d, i) => (
            <div className="hq-timeline-row" key={i}>
              <div className="hq-timeline-t">{d.t}</div>
              <div className="hq-timeline-label">{d.label}</div>
            </div>
          ))}
        </div>
        <div className="callout blue">
          <strong>Вечера недели:</strong> {EVENINGS}
        </div>
        <div className="callout neutral">{DAY_NOTE}</div>
      </section>

      {/* ── цели ── */}
      <section className="section">
        <h2 className="section-title">🎯 Цели</h2>
        <div className="card">
          <div className="card-head">
            <span>Спринт — до 05.09</span>
            <span className="badge green">сейчас</span>
          </div>
          <div className="card-body">
            <ul className="hq-list">
              {GOALS.sprint.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <span>Осень — до 30.11</span>
            <span className="badge amber">горизонт</span>
          </div>
          <div className="card-body">
            <ul className="hq-list">
              {GOALS.autumn.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <span>Большие — без срока, без доказательств</span>
            <span className="badge purple">направление</span>
          </div>
          <div className="card-body">
            <ul className="hq-list dots">
              {GOALS.big.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── принципы ── */}
      <section className="section">
        <h2 className="section-title">🧠 Принципы — то, что раньше торчало</h2>
        <div className="grid-2">
          {PRINCIPLES.map((p) => (
            <div className="card" key={p.title}>
              <div className="card-head">{p.title}</div>
              <div className="card-body">{p.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── бюрократия ── */}
      <section className="section">
        <h2 className="section-title">📄 Документы / RWR+</h2>
        <div className="card">
          <div className="card-body">
            {BUREAU.map((b, i) => (
              <div className={`hq-bureau-row ${b.done ? "ok" : "todo"}`} key={i}>
                <span className="hq-bureau-mark">{b.done ? "✓" : "○"}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── паркинг ── */}
      <section className="section">
        <h2 className="section-title">🅿️ Паркинг — не сейчас, не потерять</h2>
        <div className="card">
          <div className="card-body">
            <ul className="hq-list dots">
              {PARKING.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="callout neutral">
          Обновление штаба: сказать в Cursor <strong>«обнови штаб»</strong> — правится <code>app/andrii/hq/data.ts</code>, деплой ~1 минута.
          Источник правды: <code>~/gorbenko/me/STATUS.md</code> · Обновлено: {DATES.updated}
        </div>
      </section>
    </>
  );
}
