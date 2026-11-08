"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Exhibitor, FairData, FairTab, FairVisit, VisitStatus } from "../../../lib/crm/messe/data";
import { FAIR_SWITCH, VISIT_STATUS_LABEL } from "../../../lib/crm/messe/data";
import CardFlow from "./CardFlow";
import VoiceNote from "./VoiceNote";
import TwoLetters from "./TwoLetters";
import { toast, type ToastKind } from "./toast";

const BLICKFANG_TABS: FairTab[] = [
  { id: "first", label: "⚡ Маршрут 1", note: "Маршрут 1 — кому идти сразу. Отбор по сайтам всех 156: не одиночка (юрлицо, UID, команда, дилеры/showroom, средний чек, работающий магазин) и есть повод (сайт A/B, закрыт, мобилка) или Вена/Мюнхен. Порядок — как идти ногами: EG по номерам стендов, затем OG. Четыре с мёртвым сайтом стоят здесь без оценки размера — смотри на стенд." },
  { id: "sites", label: "Сайты", note: "Сайты — обходить первыми. Сверху пять с конкретной бедой: WABISABI (магазин анонсирован, не открыт), Gerald Pahr (режим обслуживания), Georg Mähring (домен зарезервирован), macharten (магазин обещают открыть), Karaka (коллекция 2020/21). Дальше — по силе повода." },
  { id: "vienna", label: "Вена", note: "Вена — для локального контента и съёмки." },
  { id: "munich", label: "Мюнхен", note: "Мюнхен — все четыре." },
  { id: "three", label: "3D / конструктор", note: "3D / конструктор — только где у товара есть реальные варианты. У кого конфигуратор уже есть, не предлагать второй." },
  { id: "route", label: "Все", note: "Все 156: сначала маршрут из брифа, затем Мюнхен → Вена → остальные." },
];
type StatusFilter = "all" | "todo" | "talked" | "revisit" | "done";

/** Пять стендов с подтверждённой бедой сайта — их обходить первыми. */
const SITE_HEAD = ["38974", "13686", "40565", "36962", "35229"];
const SITE_GRADE = (p: string) => (p === "A" ? 0 : p === "B" ? 1 : p === "U" ? 2 : 3);

/** «18» = «018», «eh01» = «EH01», «31» находит и GH31, и GH31A. Пусто, если это не номер стенда. */
function parseBooth(raw: string): { prefix: string; num: string; suffix: string } | null {
  const m = raw.trim().toLowerCase().replace(/[\s-]+/g, "").match(/^([a-zäöü]*)(\d+)([a-zäöü]*)$/);
  if (!m) return null;
  return { prefix: m[1], num: String(Number(m[2])), suffix: m[3] };
}
function boothHit(query: string, booth: string): boolean {
  const q = parseBooth(query);
  const b = parseBooth(booth);
  if (!q || !b || q.num !== b.num) return false;
  if (q.prefix && q.prefix !== b.prefix) return false;
  if (q.suffix && q.suffix !== b.suffix) return false;
  return true;
}

const CITY_ORDER = (c: string) => (c === "München" ? 0 : c === "Wien" ? 1 : 2);
const PRIO_ORDER = (p: string) => (p === "A" ? 0 : p === "B" ? 1 : 2);

function parsePhotos(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((x) => typeof x === "string");
  if (typeof raw === "string" && raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function shrinkPhoto(file: File): Promise<File> {
  try {
    const bmp = await createImageBitmap(file);
    const max = 1600;
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bmp.width * scale));
    canvas.height = Math.max(1, Math.round(bmp.height * scale));
    canvas.getContext("2d")?.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.72));
    if (blob) return new File([blob], "stand.jpg", { type: "image/jpeg" });
  } catch {
    /* снимок с телефона иногда не сжимается — отправим как есть, если он небольшой */
  }
  return file;
}

function lookAt(r: Exhibitor): { site: string; siteKnown: boolean; instagram: string; instagramKnown: boolean; reviews: string } {
  const siteKnown = !!r.website && !/instagram\.com/i.test(r.website);
  const instagramKnown = r.instagram || (/instagram\.com/i.test(r.website) ? r.website : "");
  const q = (extra: string) => encodeURIComponent([r.name, r.city, extra].filter(Boolean).join(" "));
  return {
    site: siteKnown ? r.website : `https://www.google.com/search?q=${q("")}`,
    siteKnown,
    instagram: instagramKnown || `https://www.google.com/search?q=${q("instagram")}`,
    instagramKnown: !!instagramKnown,
    reviews: `https://www.google.com/maps/search/?api=1&query=${q("")}`,
  };
}

function emptyVisit(event: string, id: string): FairVisit {
  return { event, exhibitor_id: id, status: "todo", note: "", lead_id: null, email_sent: false, updated_at: "" };
}

export default function MesseBoard({ fair, initialVisits }: { fair: FairData; initialVisits: FairVisit[] }) {
  const [visits, setVisits] = useState<Record<string, FairVisit>>(() =>
    Object.fromEntries(initialVisits.map((v) => [v.exhibitor_id, { ...v, photos: parsePhotos(v.photos) }])),
  );
  const tabs = fair.tabs?.length ? fair.tabs : BLICKFANG_TABS;
  const [tab, setTab] = useState(tabs[0]?.id ?? "first");
  const visitsRef = useRef(visits);
  const [plan, setPlan] = useState(false);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [q, setQ] = useState("");
  const [openFlow, setOpenFlow] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [toastMsg, setToastMsg] = useState<{ kind: ToastKind; text: string } | null>(null);
  const [photoBusy, setPhotoBusy] = useState<string | null>(null);
  const noteTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { visitsRef.current = visits; }, [visits]);

  useEffect(() => {
    const flush = () => {
      for (const id of Object.keys(noteTimers.current)) {
        clearTimeout(noteTimers.current[id]);
        delete noteTimers.current[id];
        const note = visitsRef.current[id]?.note;
        if (note == null) continue;
        void fetch("/api/crm/messe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: fair.event, exhibitor_id: id, note }),
          keepalive: true,
        });
      }
    };
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, [fair.event]);

  useEffect(() => {
    const onToast = (e: Event) => {
      const d = (e as CustomEvent<{ kind: ToastKind; text: string }>).detail;
      setToastMsg(d);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (d.kind !== "busy") toastTimer.current = setTimeout(() => setToastMsg(null), d.kind === "err" ? 12000 : 6000);
    };
    window.addEventListener("messe-toast", onToast);
    return () => window.removeEventListener("messe-toast", onToast);
  }, []);

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
  const tabRows = useMemo<Record<string, Exhibitor[]>>(() => {
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
    const pick = (id: string): Exhibitor[] => {
      if (id === "all" || id === "route") return ordered;
      if (id === "first") return first;
      if (id === "sites") return sites;
      if (id === "vienna") return ordered.filter((r) => r.city.startsWith("Wien") || r.city.includes("Вена"));
      if (id === "munich") return ordered.filter((r) => r.city === "München");
      if (id === "three") return ordered.filter((r) => r.services.some((s) => s === "3D" || s === "конфигуратор") || r.configurator_fit === "yes");
      if (id === "video") return ordered.filter((r) => r.services.includes("видео"));
      if (id === "pages") return ordered.filter((r) => r.services.includes("проект"));
      return ordered;
    };
    return Object.fromEntries(tabs.map((t) => [t.id, pick(t.id)]));
  }, [fair, ordered, tabs]);

  const tabDone = (t: string) => (tabRows[t] ?? []).filter((r) => getVisit(r.id).status !== "todo").length;
  const tabLabel = (t: string) => tabs.find((x) => x.id === t)?.label ?? t;

  const boothLookup = parseBooth(q) !== null;
  const filtered = useMemo(() => {
    if (boothLookup) return fair.rows.filter((r) => boothHit(q, r.booth));
    const needle = q.trim().toLowerCase();
    const base = tabRows[tab] ?? [];
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
  }, [tabRows, visits, tab, status, q, boothLookup, fair.rows]);

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

  async function undo(id: string, leadId: number) {
    if (!window.confirm("Стереть последнюю запись с этой карточки? Уйдёт лид, заметка и напоминание за последние 30 минут.")) return;
    setError("");
    try {
      const res = await fetch("/api/crm/messe/undo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`);
      if (j.lead_deleted) {
        await save(id, { status: "todo", note: "", lead_id: null, email_sent: false });
      } else {
        setError("Последняя запись снята с лида. Текст заметки на карточке поправь руками.");
      }
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    }
  }

  async function addPhoto(id: string, file: File) {
    setPhotoBusy(id);
    toast("busy", "Сохраняю фото на карточку…");
    try {
      const small = await shrinkPhoto(file);
      const fd = new FormData();
      fd.append("photo", small);
      fd.append("event", fair.event);
      fd.append("exhibitor_id", id);
      const leadId = getVisit(id).lead_id;
      if (leadId) fd.append("lead_id", String(leadId));
      const res = await fetch("/api/crm/messe/photo", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setVisits((s) => ({ ...s, [id]: { ...getVisit(id), photos: json.photos as string[] } }));
      toast("ok", "Фото на карточке");
    } catch (e) {
      toast("err", String(e instanceof Error ? e.message : e));
    } finally {
      setPhotoBusy(null);
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
    if (!(tabRows[tab] ?? []).some((r) => r.id === id)) setTab(fair.allTab || "route");
    setTimeout(() => document.getElementById(`ex-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(""), 6000);
    return () => clearTimeout(t);
  }, [error]);

  const visitedPct = counts.total ? Math.round(((counts.talked + counts.revisit + counts.skip) / counts.total) * 100) : 0;

  async function goFair(event: string) {
    if (event === fair.event) return;
    if (openFlow && !window.confirm("На карточке открыта форма. Переключить выставку и закрыть её?")) return;
    for (const id of Object.keys(noteTimers.current)) {
      clearTimeout(noteTimers.current[id]);
      delete noteTimers.current[id];
      const note = visitsRef.current[id]?.note ?? "";
      await save(id, { note });
    }
    window.location.href = `/crm/messe?event=${event}`;
  }

  return (
    <>
      <header className="m-head">
        <small>
          {fair.dateLabel || fair.date} · {fair.venue || ""}
          {fair.address ? ` · ${fair.address}` : ""} · <a href="/crm" style={{ color: "#9bd4d1" }}>← CRM</a>
          {" · "}<a href="/crm/emails" style={{ color: "#9bd4d1" }}>очередь писем</a>
        </small>
        <div className="m-tabs" style={{ margin: "8px 0" }}>
          {FAIR_SWITCH.map((f) => (
            <button key={f.event} className={f.event === fair.event ? "on" : ""} onClick={() => void goFair(f.event)}>{f.title}</button>
          ))}
        </div>
        <h1>{fair.title} — обход</h1>
        <div className="sub">
          {fair.headerSub || "Статусы и лиды сохраняются в CRM."}{" "}
          {fair.catalogUrl && <a href={fair.catalogUrl} target="_blank" rel="noreferrer">каталог</a>}
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
          {tabs.map((t) => (
            <button key={t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>
              {t.label} <small>{tabDone(t.id)}/{(tabRows[t.id] ?? []).length}</small>
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
            <input inputMode="search" placeholder="Номер стенда: 18 или EH01" value={q} onChange={(e) => setQ(e.target.value)} />
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
            label={`${tabLabel(tab)}: отмечено ${tabDone(tab)} из ${(tabRows[tab] ?? []).length}`}
          />
        ) : (
          <>
            <div className="m-note">
              {boothLookup
                ? (filtered.length ? `Стенд ${q.trim()} — по всем участникам, не только эта вкладка.` : `Стенда ${q.trim()} нет.`)
                : tabs.find((t) => t.id === tab)?.note}{" "}
              {boothLookup ? "" : <>Отмечено {tabDone(tab)} из {(tabRows[tab] ?? []).length}{filtered.length !== (tabRows[tab] ?? []).length ? `, показано ${filtered.length}` : ""}.</>}
            </div>
            {filtered.map((r, i) => {
              const v = getVisit(r.id);
              const look = lookAt(r);
              return (
                <article key={r.id} id={`ex-${r.id}`} className={`m-card ${v.status}`}>
                  <div className="m-top">
                    <div>
                      <div className="m-name"><span className="m-order">{i + 1}.</span>{r.name}</div>
                      <div className="m-sub">{[r.city, r.category].filter(Boolean).join(" · ")}</div>
                    </div>
                    <div className="m-booth">{r.booth || "—"}<small>{r.floor}</small></div>
                  </div>
                  <div className="m-look">
                    <a className={look.siteKnown ? "" : "miss"} href={look.site} target="_blank" rel="noreferrer" title={look.siteKnown ? "Открыть сайт" : "Сайта в каталоге нет — поиск"}>Сайт</a>
                    <a className={look.instagramKnown ? "" : "miss"} href={look.instagram} target="_blank" rel="noreferrer" title={look.instagramKnown ? "Открыть Instagram" : "Ссылки на Instagram при обходе не было — поиск"}>Instagram</a>
                    <a href={look.reviews} target="_blank" rel="noreferrer" title="Открыть место в Google Картах, отзывы там">Отзывы</a>
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
                    {r.review_label
                      ? <span className="m-chip">{r.review_label}</span>
                      : r.verified ? <span className="m-chip">браузер ✓</span> : <span className="m-chip">не открыт</span>}
                    {r.geography_confidence && r.geography_confidence !== "high" && <span className="m-chip">гео: {r.geography_confidence}</span>}
                    {v.status !== "todo" && <span className={`m-chip st-${v.status}`}>{VISIT_STATUS_LABEL[v.status]}</span>}
                    {v.email_sent && <span className="m-chip st-mail">письмо 1 ✓</span>}
                  </div>
                  {r.ask_who && <div className="m-offer"><span className="m-label">Кого спросить (каталог, не факт разговора)</span>{r.ask_who}</div>}
                  {r.observed && <div className="m-offer"><span className="m-label">Факт</span>{r.observed}</div>}
                  <div className="m-offer"><span className="m-label">Гипотеза предложения</span>{r.offer}</div>
                  {r.opening_de && (
                    <div className="m-q">
                      <span>{r.opening_de}</span>
                      <button className="ghost" title="Скопировать" onClick={() => navigator.clipboard?.writeText(r.opening_de)}>⧉</button>
                    </div>
                  )}
                  <div className="m-links">
                    {r.profile_url && <a href={r.profile_url} target="_blank" rel="noreferrer">{fair.profileLinkLabel || "Профиль"}</a>}
                    {r.sources?.slice(0, 3).map((src) => <a key={src} href={src} target="_blank" rel="noreferrer">источник</a>)}
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
                      {r.hypothesis && <p><b>Почему это гипотеза:</b> {r.hypothesis}</p>}
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
                    venue={fair.venue || ""}
                    onDone={({ note, leadId }) => {
                      const merged = [v.note.trim(), note].filter(Boolean).join("\n");
                      setVisits((s) => ({ ...s, [r.id]: { ...getVisit(r.id), note: merged, lead_id: leadId, status: "talked" } }));
                      void save(r.id, { note: merged, lead_id: leadId, status: "talked" });
                    }}
                  />
                  <div className="m-actions">
                    <button className="pink" onClick={() => setOpenFlow(openFlow === `2:${r.id}` ? null : `2:${r.id}`)}>
                      {v.email_sent ? "✉️ Ещё письмо" : "✉️ Письмо сейчас + черновик"}
                    </button>
                    <button style={{ flex: "0 0 auto" }} title="Визитка → лид → одно письмо" onClick={() => setOpenFlow(openFlow === r.id ? null : r.id)}>📷</button>
                  </div>
                  <div className="m-shots">
                    {(v.photos ?? []).map((path) => (
                      <a key={path} href={`/api/crm/messe/photo?path=${encodeURIComponent(path)}`} target="_blank" rel="noreferrer">
                        <img src={`/api/crm/messe/photo?path=${encodeURIComponent(path)}`} alt="" />
                      </a>
                    ))}
                    <label className={`m-shot-add ${photoBusy === r.id ? "busy" : ""}`}>
                      {photoBusy === r.id ? "…" : "📷 Фото"}
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        disabled={photoBusy === r.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = "";
                          if (file) void addPhoto(r.id, file);
                        }}
                      />
                    </label>
                  </div>
                  <div className="m-notefield">
                    <textarea placeholder="Заметка: имя, задача, контакт, когда написать…" value={v.note} onChange={(e) => setNote(r.id, e.target.value)} />
                    {v.lead_id && (
                      <button className="ghost" style={{ marginTop: 4, fontSize: 13 }} onClick={() => void undo(r.id, v.lead_id!)}>↩ Отменить запись</button>
                    )}
                  </div>

                  {openFlow === `2:${r.id}` && (
                    <TwoLetters
                      exhibitor={r}
                      visit={v}
                      fairTitle={fair.title}
                      venue={fair.venue || ""}
                      talkDateLabel={fair.talkDateLabel || ""}
                      onLead={(leadId) => void save(r.id, { lead_id: leadId, status: "talked" })}
                      onDone={({ mode, secondDate }) => {
                        const mark = mode === "scheduled" && secondDate
                          ? `✉️ 1 ушло · ✉️ 2 → ${secondDate.slice(8, 10)}.${secondDate.slice(5, 7)}`
                          : "✉️ 1 ушло · ✉️ 2 на проверке";
                        const merged = [v.note.trim(), mark].filter(Boolean).join("\n");
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
                      venue={fair.venue || ""}
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
      {toastMsg && (
        <div className={`m-toast ${toastMsg.kind}`} onClick={() => setToastMsg(null)}>
          {toastMsg.kind === "busy" ? "⏳ " : toastMsg.kind === "ok" ? "✅ " : "⚠️ "}{toastMsg.text}
        </div>
      )}
    </>
  );
}

/** Группы стендов. Для BLICKFANG это EG/OG по номерам, не чертёж зала. Для другой выставки — буквы зон, не этажи. */
function FloorPlan({ fair, getVisit, onPick, matchIds, filterOn, label }: { fair: FairData; getVisit: (id: string) => FairVisit; onPick: (id: string) => void; matchIds: Set<string>; filterOn: boolean; label: string }) {
  const zones = fair.layout === "zones";
  const floors = useMemo(() => {
    const m = new Map<string, Exhibitor[]>();
    for (const r of fair.rows) {
      const f = r.floor || (zones ? "без номера" : "Уточнить");
      if (!m.has(f)) m.set(f, []);
      m.get(f)!.push(r);
    }
    for (const list of m.values()) list.sort((a, b) => a.booth.localeCompare(b.booth, "de") || a.name.localeCompare(b.name, "de"));
    const order = zones ? ["EH", "AH", "AHA", "AHB", "GH", "GHA", "EC", "WL", "без номера"] : ["EG", "OG"];
    return [...m.entries()].sort((a, b) => {
      const ia = order.indexOf(a[0]);
      const ib = order.indexOf(b[0]);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  }, [fair, zones]);

  return (
    <>
      <div className="m-note">
        <b>{label}.</b>{" "}
        {zones
          ? "Группы стендов из каталога (EH, AH, GH, EC, WL). Это не этажи и не чертёж зала. Буквенные суффиксы сохранены, пустой номер допустим."
          : "EG — нижний уровень (001–066), OG — верхний (070–140). Плитки идут по номерам, не по геометрии зала."}
        {" "}Розовая рамка — приоритет A. Нажми плитку — откроется карточка.
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
            <h2>{zones ? `Группа ${floor}` : floor === "EG" ? "EG — нижний уровень" : floor === "OG" ? "OG — верхний уровень" : floor}</h2>
            <div className="sub">отмечено {done} из {inSel.length}{filterOn ? ` в этой группе (всего ${list.length})` : ""}</div>
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
