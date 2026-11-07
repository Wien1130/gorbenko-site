"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Exhibitor, FairData, FairVisit, VisitStatus } from "../../../lib/crm/messe/data";
import { VISIT_STATUS_LABEL } from "../../../lib/crm/messe/data";
import CardFlow from "./CardFlow";
import VoiceNote from "./VoiceNote";
import TwoLetters from "./TwoLetters";

type Tab = "first" | "sites" | "route" | "vienna" | "munich" | "three";
const TAB_LABEL: Record<Tab, string> = { first: "⚡ Маршрут 1", sites: "Сайты", vienna: "Вена", munich: "Мюнхен", three: "3D / конструктор", route: "Все" };
const TABS: Tab[] = ["first", "sites", "vienna", "munich", "three", "route"];
type StatusFilter = "all" | "todo" | "talked" | "revisit" | "done";

/** Пять стендов с подтверждённой бедой сайта — их обходить первыми. */
const SITE_HEAD = ["38974", "13686", "40565", "36962", "35229"];
const SITE_GRADE = (p: string) => (p === "A" ? 0 : p === "B" ? 1 : p === "U" ? 2 : 3);

const CITY_ORDER = (c: string) => (c === "München" ? 0 : c === "Wien" ? 1 : 2);
const PRIO_ORDER = (p: string) => (p === "A" ? 0 : p === "B" ? 1 : 2);

function emptyVisit(event: string, id: string): FairVisit {
  return { event, exhibitor_id: id, status: "todo", note: "", lead_id: null, email_sent: false, updated_at: "" };
}

export default function MesseBoard({ fair, initialVisits }: { fair: FairData; initialVisits: FairVisit[] }) {
  const [visits, setVisits] = useState<Record<string, FairVisit>>(() =>
    Object.fromEntries(initialVisits.map((v) => [v.exhibitor_id, v])),
  );
  const [tab, setTab] = useState<Tab>("first");
  const [plan, setPlan] = useState(false);
  const [status, setStatus] = useState<StatusFilter>("all");
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

  /** Состав каждой вкладки (без фильтра статуса и поиска) — для счётчиков и плана. */
  const tabRows = useMemo<Record<Tab, Exhibitor[]>>(() => {
    const byId = new Map(fair.rows.map((r) => [r.id, r]));
    const sites = fair.rows
      .filter((r) => r.site_priority === "A" || r.site_priority === "B" || r.site_priority === "U")
      .sort(
        (a, b) =>
          SITE_GRADE(a.site_priority) - SITE_GRADE(b.site_priority) ||
          ((SITE_HEAD.indexOf(a.id) + 99) % 99) - ((SITE_HEAD.indexOf(b.id) + 99) % 99) ||
          (a.rank ?? 999) - (b.rank ?? 999),
      );
    const first = (fair.route1 ?? []).map((id) => byId.get(id)).filter(Boolean) as Exhibitor[];
    return {
      first,
      sites,
      vienna: ordered.filter((r) => r.city.startsWith("Wien") || r.city.includes("Вена")),
      munich: ordered.filter((r) => r.city === "München"),
      three: ordered.filter((r) => r.services.some((s) => s === "3D" || s === "конфигуратор") || r.configurator_fit === "yes"),
      route: ordered,
    };
  }, [fair, ordered]);

  const tabDone = (t: Tab) => tabRows[t].filter((r) => getVisit(r.id).status !== "todo").length;

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const base = tabRows[tab];
    return base.filter((r) => {
      const v = getVisit(r.id);
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
  }, [tabRows, visits, tab, status, q]);

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
    setPlan(false);
    setStatus("all");
    setQ("");
    if (!tabRows[tab].some((r) => r.id === id)) setTab("route");
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
          {TABS.map((t) => (
            <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
              {TAB_LABEL[t]} <small>{tabDone(t)}/{tabRows[t].length}</small>
            </button>
          ))}
          <span style={{ width: 6 }} />
          <button className={plan ? "on plan" : "plan"} onClick={() => setPlan(!plan)}>{plan ? "▦ План" : "▦ План"}</button>
          <span style={{ width: 6 }} />
          <button className={status === "todo" ? "on" : ""} onClick={() => setStatus(status === "todo" ? "all" : "todo")}>Не посещён</button>
          <button className={status === "revisit" ? "on" : ""} onClick={() => setStatus(status === "revisit" ? "all" : "revisit")}>Вернуться</button>
          <button className={status === "talked" ? "on" : ""} onClick={() => setStatus(status === "talked" ? "all" : "talked")}>Поговорил</button>
        </div>
        {!plan && (
          <div className="m-search">
            <input placeholder="Бренд, стенд, город, продукт…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        )}
      </div>

      <div className="m-main">
        {error && <div className="m-err">{error}</div>}

        {plan ? (
          <FloorPlan
            fair={fair}
            getVisit={getVisit}
            onPick={jumpTo}
            matchIds={new Set(filtered.map((r) => r.id))}
            filterOn={tab !== "route" || status !== "all" || q.trim() !== ""}
            label={`${TAB_LABEL[tab]}: отмечено ${tabDone(tab)} из ${tabRows[tab].length}`}
          />
        ) : (
          <>
            <div className="m-note">
              {tab === "first" && "Маршрут 1 — кому идти сразу. Отбор по сайтам всех 156: не одиночка (юрлицо, UID, команда, дилеры/showroom, средний чек, работающий магазин) и есть повод (сайт A/B, закрыт, мобилка) или Вена/Мюнхен. Порядок — как идти ногами: EG по номерам стендов, затем OG. Четыре с мёртвым сайтом стоят здесь без оценки размера — смотри на стенд."}
              {tab === "sites" && "Сайты — обходить первыми. Сверху пять с конкретной бедой: WABISABI (магазин анонсирован, не открыт), Gerald Pahr (режим обслуживания), Georg Mähring (домен зарезервирован), macharten (магазин обещают открыть), Karaka (коллекция 2020/21). Дальше — по силе повода."}
              {tab === "vienna" && "Вена — для локального контента и съёмки."}
              {tab === "munich" && "Мюнхен — все четыре."}
              {tab === "three" && "3D / конструктор — только где у товара есть реальные варианты. У кого конфигуратор уже есть, не предлагать второй."}
              {tab === "route" && "Все 156: сначала маршрут из брифа, затем Мюнхен → Вена → остальные."}
              {" "}Отмечено {tabDone(tab)} из {tabRows[tab].length}{filtered.length !== tabRows[tab].length ? `, показано ${filtered.length}` : ""}.
            </div>
            {filtered.map((r, i) => {
              const v = getVisit(r.id);
              return (
                <article key={r.id} id={`ex-${r.id}`} className={`m-card ${v.status}`}>
                  <div className="m-top">
                    <div>
                      <div className="m-name"><span className="m-order">{i + 1}.</span>{r.name}</div>
                      <div className="m-sub">{r.city} · {r.category}</div>
                    </div>
                    <div className="m-booth">{r.booth || "—"}<small>{r.floor}</small></div>
                  </div>
                  <div className="m-chips">
                    <span className={`m-chip ${r.priority}`}>Приоритет {r.priority}</span>
                    {r.site_priority && <span className={`m-chip ${r.site_priority}`}>Сайт: {r.site_priority}</span>}
                    {r.content_fit && <span className={`m-chip ${r.content_fit}`}>Контент: {r.content_fit}</span>}
                    {r.configurator_fit === "yes" && <span className="m-chip A">3D: да</span>}
                    {r.imprint_name && <span className="m-chip A" title={r.imprint_name_src}>👤 {r.imprint_name}</span>}
                    {typeof r.size_score === "number" && (
                      <span className={`m-chip ${r.size_score >= 7 ? "A" : r.size_score >= 4 ? "B" : ""}`} title={r.size_note}>
                        Размер: {r.size_score >= 7 ? "фирма" : r.size_score >= 4 ? "средний" : r.size_score > 0 ? "малый" : "?"}
                      </span>
                    )}
                    {r.verified ? <span className="m-chip">браузер ✓</span> : <span className="m-chip">не открыт</span>}
                    {r.geography_confidence && r.geography_confidence !== "high" && <span className="m-chip">гео: {r.geography_confidence}</span>}
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
                  {(r.observed || r.hypothesis || r.evidence_short?.length) && (
                    <details>
                      <summary>Что найдено и гипотеза</summary>
                      {r.size_note && <p><b>Размер по сайту:</b> {r.size_note}</p>}
                      {r.evidence_short?.map((f, k) => <p key={k}>• {f}</p>)}
                      {r.mobile_note && <p><b>390px:</b> {r.mobile_note}</p>}
                      {r.unresolved?.length ? <p><b>Не установлено:</b> {r.unresolved.join("; ")}</p> : null}
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
                  <VoiceNote
                    exhibitor={r}
                    visit={v}
                    fairTitle={fair.title}
                    onDone={({ note, leadId }) => {
                      const merged = [v.note.trim(), note].filter(Boolean).join("\n");
                      setVisits((s) => ({ ...s, [r.id]: { ...getVisit(r.id), note: merged, lead_id: leadId, status: "talked" } }));
                      void save(r.id, { note: merged, lead_id: leadId, status: "talked" });
                    }}
                  />
                  <div className="m-actions">
                    <button className="pink" onClick={() => setOpenFlow(openFlow === `2:${r.id}` ? null : `2:${r.id}`)}>
                      {v.email_sent ? "✉️✉️ Ещё два письма" : "✉️✉️ Два письма: сейчас + на дату"}
                    </button>
                    <button style={{ flex: "0 0 auto" }} title="Визитка → лид → одно письмо" onClick={() => setOpenFlow(openFlow === r.id ? null : r.id)}>📷</button>
                  </div>
                  <div className="m-notefield">
                    <textarea placeholder="Заметка: имя, задача, контакт, когда написать…" value={v.note} onChange={(e) => setNote(r.id, e.target.value)} />
                  </div>

                  {openFlow === `2:${r.id}` && (
                    <TwoLetters
                      exhibitor={r}
                      visit={v}
                      fairTitle={fair.title}
                      onLead={(leadId) => void save(r.id, { lead_id: leadId, status: "talked" })}
                      onDone={({ secondDate }) => {
                        const merged = [v.note.trim(), `✉️ 1 ушло · ✉️ 2 → ${secondDate.slice(8, 10)}.${secondDate.slice(5, 7)}`].filter(Boolean).join("\n");
                        setVisits((s) => ({ ...s, [r.id]: { ...getVisit(r.id), note: merged, email_sent: true, status: "talked" } }));
                        void save(r.id, { note: merged, email_sent: true, status: "talked" });
                      }}
                      onClose={() => setOpenFlow(null)}
                    />
                  )}
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

      {!plan && (
        <button className="m-fab" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
      )}
    </>
  );
}

/** Схема этажей по номерам стендов — покрытие обхода. Это порядок номеров, не геометрия зала. */
function FloorPlan({ fair, getVisit, onPick, matchIds, filterOn, label }: { fair: FairData; getVisit: (id: string) => FairVisit; onPick: (id: string) => void; matchIds: Set<string>; filterOn: boolean; label: string }) {
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
        <b>{label}.</b> Яркие плитки — стенды этой вкладки, остальные приглушены. EG — нижний уровень (001–066), OG — верхний (070–140);
        плитки идут по номерам, не по геометрии зала. Розовая рамка — приоритет A. Нажми плитку — откроется карточка.
      </div>
      <div className="m-legend">
        <span><i style={{ background: "#fff" }} />не посещён</span>
        <span><i style={{ background: "#d9eee5" }} />поговорил</span>
        <span><i style={{ background: "#fbefc9" }} />вернуться</span>
        <span><i style={{ background: "#eef1f3" }} />пропустить</span>
        <span>✉ письмо отправлено</span>
      </div>
      {floors.map(([floor, list]) => {
        const inSel = filterOn ? list.filter((r) => matchIds.has(r.id)) : list;
        const done = inSel.filter((r) => getVisit(r.id).status !== "todo").length;
        return (
          <section key={floor} className="m-floor">
            <h2>{floor === "EG" ? "EG — нижний уровень" : floor === "OG" ? "OG — верхний уровень" : "Этаж уточнить"}</h2>
            <div className="sub">отмечено {done} из {inSel.length}{filterOn ? ` на этом этаже (всего стендов ${list.length})` : ""}</div>
            <div className="m-grid">
              {list.map((r) => {
                const v = getVisit(r.id);
                return (
                  <div
                    key={r.id}
                    className={`m-tile ${v.status} ${r.priority === "A" ? "pA" : ""} ${v.email_sent ? "mail" : ""} ${filterOn && !matchIds.has(r.id) ? "dim" : ""}`}
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
