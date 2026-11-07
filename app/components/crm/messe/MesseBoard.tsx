"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Exhibitor, FairData, FairVisit, VisitStatus } from "../../../lib/crm/messe/data";
import { VISIT_STATUS_LABEL } from "../../../lib/crm/messe/data";
import CardFlow from "./CardFlow";

type View = "route" | "plan";
type CityFilter = "all" | "München" | "Wien" | "other";
type StatusFilter = "all" | "todo" | "talked" | "revisit" | "done";

const CITY_ORDER = (c: string) => (c === "München" ? 0 : c === "Wien" ? 1 : 2);
const PRIO_ORDER = (p: string) => (p === "A" ? 0 : p === "B" ? 1 : 2);

function emptyVisit(event: string, id: string): FairVisit {
  return { event, exhibitor_id: id, status: "todo", note: "", lead_id: null, email_sent: false, updated_at: "" };
}

export default function MesseBoard({ fair, initialVisits }: { fair: FairData; initialVisits: FairVisit[] }) {
  const [visits, setVisits] = useState<Record<string, FairVisit>>(() =>
    Object.fromEntries(initialVisits.map((v) => [v.exhibitor_id, v])),
  );
  const [view, setView] = useState<View>("route");
  const [city, setCity] = useState<CityFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [onlyA, setOnlyA] = useState(false);
  const [q, setQ] = useState("");
  const [openFlow, setOpenFlow] = useState<string | null>(null);
  const [error, setError] = useState("");
  const noteTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const getVisit = (id: string) => visits[id] ?? emptyVisit(fair.event, id);

  /** Порядок обхода: маршрут из брифа, затем Мюнхен → Вена → остальные, внутри — A/B/C и rank. */
  const ordered = useMemo(() => {
    const byId = new Map(fair.rows.map((r) => [r.id, r]));
    const head = fair.route.map((id) => byId.get(id)).filter(Boolean) as Exhibitor[];
    const headIds = new Set(head.map((r) => r.id));
    const rest = fair.rows
      .filter((r) => !headIds.has(r.id))
      .sort(
        (a, b) =>
          CITY_ORDER(a.city) - CITY_ORDER(b.city) ||
          PRIO_ORDER(a.priority) - PRIO_ORDER(b.priority) ||
          (a.rank ?? 999) - (b.rank ?? 999) ||
          a.booth.localeCompare(b.booth),
      );
    return [...head, ...rest];
  }, [fair]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ordered.filter((r) => {
      const v = getVisit(r.id);
      if (city === "München" && r.city !== "München") return false;
      if (city === "Wien" && r.city !== "Wien") return false;
      if (city === "other" && (r.city === "Wien" || r.city === "München")) return false;
      if (onlyA && r.priority !== "A") return false;
      if (status === "todo" && v.status !== "todo") return false;
      if (status === "talked" && v.status !== "talked") return false;
      if (status === "revisit" && v.status !== "revisit") return false;
      if (status === "done" && v.status === "todo") return false;
      if (needle) {
        const hay = `${r.name} ${r.booth} ${r.city} ${r.category} ${r.offer}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordered, visits, city, status, onlyA, q]);

  const counts = useMemo(() => {
    const c = { total: fair.rows.length, talked: 0, revisit: 0, skip: 0, mails: 0, leads: 0 };
    for (const r of fair.rows) {
      const v = getVisit(r.id);
      if (v.status === "talked") c.talked++;
      if (v.status === "revisit") c.revisit++;
      if (v.status === "skip") c.skip++;
      if (v.email_sent) c.mails++;
      if (v.lead_id) c.leads++;
    }
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visits, fair]);

  async function save(id: string, patch: Partial<Pick<FairVisit, "status" | "note" | "lead_id" | "email_sent">>) {
    const prev = getVisit(id);
    const next = { ...prev, ...patch, updated_at: new Date().toISOString() };
    setVisits((s) => ({ ...s, [id]: next }));
    try {
      const res = await fetch("/api/crm/messe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: fair.event, exhibitor_id: id, ...patch }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      setError("");
    } catch (e) {
      setError(`Не сохранилось: ${String(e instanceof Error ? e.message : e)}`);
      setVisits((s) => ({ ...s, [id]: prev }));
    }
  }

  function setNote(id: string, note: string) {
    setVisits((s) => ({ ...s, [id]: { ...getVisit(id), note } }));
    clearTimeout(noteTimers.current[id]);
    noteTimers.current[id] = setTimeout(() => void save(id, { note }), 700);
  }

  function jumpTo(id: string) {
    setView("route");
    setCity("all");
    setStatus("all");
    setOnlyA(false);
    setQ("");
    setTimeout(() => document.getElementById(`ex-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(""), 6000);
    return () => clearTimeout(t);
  }, [error]);

  const visitedPct = Math.round(((counts.talked + counts.revisit + counts.skip) / counts.total) * 100);

  return (
    <>
      <header className="m-head">
        <small>7–8 ноября 2026 · MAK Wien · <a href="/crm" style={{ color: "#9bd4d1" }}>← CRM</a></small>
        <h1>{fair.title} — обход</h1>
        <div className="sub">
          Мюнхен → Вена → остальные. Статусы и лиды сохраняются в CRM.{" "}
          <a href="https://blickfang.com/wp-content/uploads/Blickfang-2026-Wien-Katalog-165x210mm-web.pdf" target="_blank" rel="noreferrer">каталог</a>
        </div>
        <div className="m-stats">
          <div className="m-stat"><b>{counts.talked}</b>поговорил</div>
          <div className="m-stat"><b>{counts.mails}</b>писем</div>
          <div className="m-stat"><b>{counts.revisit}</b>вернуться</div>
          <div className="m-stat"><b>{counts.total - counts.talked - counts.revisit - counts.skip}</b>осталось</div>
        </div>
        <div className="m-progress" title={`${visitedPct}% обойдено`}>
          <i style={{ width: `${(counts.talked / counts.total) * 100}%`, background: "#4fc3a1" }} />
          <i style={{ width: `${(counts.revisit / counts.total) * 100}%`, background: "#e3c46d" }} />
          <i style={{ width: `${(counts.skip / counts.total) * 100}%`, background: "#7f8f9b" }} />
        </div>
      </header>

      <div className="m-bar">
        <div className="m-tabs">
          <button className={view === "route" ? "on" : ""} onClick={() => setView("route")}>Порядок обхода</button>
          <button className={view === "plan" ? "on" : ""} onClick={() => setView("plan")}>План залов</button>
          <span style={{ width: 6 }} />
          <button className={city === "München" ? "on" : ""} onClick={() => setCity(city === "München" ? "all" : "München")}>Мюнхен</button>
          <button className={city === "Wien" ? "on" : ""} onClick={() => setCity(city === "Wien" ? "all" : "Wien")}>Вена</button>
          <button className={city === "other" ? "on" : ""} onClick={() => setCity(city === "other" ? "all" : "other")}>Другие</button>
          <button className={onlyA ? "on" : ""} onClick={() => setOnlyA(!onlyA)}>Только A</button>
          <button className={status === "todo" ? "on" : ""} onClick={() => setStatus(status === "todo" ? "all" : "todo")}>Не посещён</button>
          <button className={status === "revisit" ? "on" : ""} onClick={() => setStatus(status === "revisit" ? "all" : "revisit")}>Вернуться</button>
          <button className={status === "talked" ? "on" : ""} onClick={() => setStatus(status === "talked" ? "all" : "talked")}>Поговорил</button>
        </div>
        {view === "route" && (
          <div className="m-search">
            <input placeholder="Бренд, стенд, город, продукт…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        )}
      </div>

      <div className="m-main">
        {error && <div className="m-err">{error}</div>}

        {view === "plan" ? (
          <FloorPlan fair={fair} getVisit={getVisit} onPick={jumpTo} />
        ) : (
          <>
            <div className="m-note">
              Показано {filtered.length} из {fair.rows.length}. Первые 18 — маршрут из брифа. Цель на стенде — договориться о следующем разговоре,
              визитка → письмо прямо здесь.
            </div>
            {filtered.map((r, i) => {
              const v = getVisit(r.id);
              return (
                <article key={r.id} id={`ex-${r.id}`} className={`m-card ${v.status}`}>
                  <div className="m-top">
                    <div>
                      <div className="m-name"><span className="m-order">{ordered.indexOf(r) + 1}.</span>{r.name}</div>
                      <div className="m-sub">{r.city} · {r.category}</div>
                    </div>
                    <div className="m-booth">{r.booth || "—"}<small>{r.floor}</small></div>
                  </div>
                  <div className="m-chips">
                    <span className={`m-chip ${r.priority}`}>Приоритет {r.priority}</span>
                    {r.site_priority && <span className={`m-chip ${r.site_priority}`}>Сайт: {r.site_priority}</span>}
                    {r.services.map((s) => <span key={s} className="m-chip">{s}</span>)}
                    {v.status !== "todo" && <span className={`m-chip st-${v.status}`}>{VISIT_STATUS_LABEL[v.status]}</span>}
                    {v.email_sent && <span className="m-chip st-mail">письмо ✓</span>}
                  </div>
                  <div className="m-offer"><span className="m-label">Предложение</span>{r.offer}</div>
                  {r.opening_de && (
                    <div className="m-q">
                      <span>{r.opening_de}</span>
                      <button className="ghost" title="Скопировать" onClick={() => navigator.clipboard?.writeText(r.opening_de)}>⧉</button>
                    </div>
                  )}
                  <div className="m-links">
                    {r.website && <a href={r.website} target="_blank" rel="noreferrer">Сайт</a>}
                    {r.profile_url && <a href={r.profile_url} target="_blank" rel="noreferrer">Профиль BLICKFANG</a>}
                    {v.lead_id && <a href={`/crm/lead/${v.lead_id}`}>Лид #{v.lead_id} в CRM</a>}
                    {r.email && <a href={`mailto:${r.email}`}>{r.email}</a>}
                  </div>
                  {(r.observed || r.hypothesis) && (
                    <details>
                      <summary>Что найдено и гипотеза</summary>
                      {r.observed && <p>{r.observed}</p>}
                      {r.hypothesis && <p><b>Гипотеза:</b> {r.hypothesis}</p>}
                    </details>
                  )}

                  <div className="m-status">
                    {(["todo", "talked", "revisit", "skip"] as VisitStatus[]).map((s) => (
                      <button key={s} className={`${v.status === s ? "on" : ""} ${s}`} onClick={() => void save(r.id, { status: s })}>
                        {VISIT_STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                  <div className="m-actions">
                    <button className="pink" onClick={() => setOpenFlow(openFlow === r.id ? null : r.id)}>
                      {v.lead_id ? (v.email_sent ? "✉️ Ещё письмо" : "✉️ Письмо") : "📷 Визитка → письмо"}
                    </button>
                  </div>
                  <div className="m-notefield">
                    <textarea placeholder="Заметка: имя, задача, контакт, когда написать…" value={v.note} onChange={(e) => setNote(r.id, e.target.value)} />
                  </div>

                  {openFlow === r.id && (
                    <CardFlow
                      exhibitor={r}
                      visit={v}
                      fairTitle={fair.title}
                      onLead={(leadId) => void save(r.id, { lead_id: leadId, status: "talked" })}
                      onEmailSent={() => void save(r.id, { email_sent: true, status: "talked" })}
                      onClose={() => setOpenFlow(null)}
                    />
                  )}
                  {i === filtered.length - 1 && <div style={{ height: 8 }} />}
                </article>
              );
            })}
          </>
        )}
      </div>

      {view === "route" && (
        <button className="m-fab" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
      )}
    </>
  );
}

/** Схема этажей по номерам стендов — покрытие обхода. Это порядок номеров, не геометрия зала. */
function FloorPlan({ fair, getVisit, onPick }: { fair: FairData; getVisit: (id: string) => FairVisit; onPick: (id: string) => void }) {
  const floors = useMemo(() => {
    const m = new Map<string, Exhibitor[]>();
    for (const r of fair.rows) {
      const f = r.floor || "Уточнить";
      if (!m.has(f)) m.set(f, []);
      m.get(f)!.push(r);
    }
    for (const list of m.values()) list.sort((a, b) => a.booth.localeCompare(b.booth) || a.name.localeCompare(b.name));
    const order = ["EG", "OG"];
    return [...m.entries()].sort((a, b) => (order.indexOf(a[0]) + 10) % 10 - (order.indexOf(b[0]) + 10) % 10);
  }, [fair]);

  return (
    <>
      <div className="m-note">
        EG — нижний уровень (стенды 001–066), OG — верхний (070–140). Плитки идут по номерам стендов, не по геометрии зала —
        план организатора уточни на info desk. Розовая рамка — приоритет A.
      </div>
      <div className="m-legend">
        <span><i style={{ background: "#fff" }} />не посещён</span>
        <span><i style={{ background: "#d9eee5" }} />поговорил</span>
        <span><i style={{ background: "#fbefc9" }} />вернуться</span>
        <span><i style={{ background: "#eef1f3" }} />пропустить</span>
        <span>✉ письмо отправлено</span>
      </div>
      {floors.map(([floor, list]) => {
        const done = list.filter((r) => getVisit(r.id).status !== "todo").length;
        return (
          <section key={floor} className="m-floor">
            <h2>{floor === "EG" ? "EG — нижний уровень" : floor === "OG" ? "OG — верхний уровень" : "Этаж уточнить"}</h2>
            <div className="sub">{done} из {list.length} отмечено</div>
            <div className="m-grid">
              {list.map((r) => {
                const v = getVisit(r.id);
                return (
                  <div
                    key={r.id}
                    className={`m-tile ${v.status} ${r.priority === "A" ? "pA" : ""} ${v.email_sent ? "mail" : ""}`}
                    onClick={() => onPick(r.id)}
                    title={`${r.booth} ${r.name} — ${VISIT_STATUS_LABEL[v.status]}`}
                  >
                    <b>{r.booth || "—"}</b>
                    <span>{r.name}</span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
