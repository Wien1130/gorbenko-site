"use client";

import { useState } from "react";

const AREAS = [
  { id: "center", label: "Центр (1. Innere Stadt)" },
  { id: "mariahilf", label: "Mariahilf / Neubau (6-7)" },
  { id: "josefstadt", label: "Josefstadt / Alsergrund (8-9)" },
  { id: "landstrasse", label: "Landstraße (3)" },
  { id: "hietzing", label: "Hietzing (13)" },
  { id: "waehring", label: "Hernals / Währing (17-18)" },
];

interface Candidate {
  name: string;
  address: string;
  rating: number;
  reviews: number;
  hasWebsite: boolean;
  pain: string;
}

type Status = "idle" | "loading" | "success" | "used" | "error" | "empty";

export default function LiveRouteDemo() {
  const [areaId, setAreaId] = useState(AREAS[0].id);
  const [status, setStatus] = useState<Status>("idle");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [mapsUrl, setMapsUrl] = useState<string | null>(null);
  const [areaLabel, setAreaLabel] = useState("");

  async function handleRun() {
    setStatus("loading");
    try {
      const res = await fetch("/api/live-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ areaId }),
      });
      if (res.status === 403) {
        setStatus("used");
        return;
      }
      const data = await res.json();
      if (!data.ok) {
        setStatus("error");
        return;
      }
      if (!data.candidates || data.candidates.length === 0) {
        setStatus("empty");
        return;
      }
      setCandidates(data.candidates);
      setMapsUrl(data.mapsUrl);
      setAreaLabel(data.area);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="card live-route">
      <div className="live-route-head">
        <div className="card-title">🗺️ Как я нахожу клиентов вживую</div>
        <p className="live-route-sub">
          Прямо сейчас бот может найти открытые СЕЙЧАС бизнесы рядом — по тем же
          признакам, что и мои реальные холодные заходы: невысокий рейтинг, мало
          отзывов, нет сайта. Себе я говорю это голосом в Telegram (команда{" "}
          <code>/find</code>) — он ищет точки и присылает маршрут на мопед.
          Затести это сам, один раз бесплатно, прямо тут:
        </p>
      </div>

      {status === "used" ? (
        <div className="callout-info">
          🔒 Демо доступно один раз на устройство — ты уже попробовал. Хочешь такое
          для своего бизнеса (искать клиентов, а не заявки ждать)? {" "}
          <a href="#consultation">Оставь заявку</a>.
        </div>
      ) : (
        <>
          <div className="live-route-controls">
            <select className="table-select" value={areaId} onChange={(e) => setAreaId(e.target.value)} disabled={status === "loading" || status === "success"}>
              {AREAS.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
            <button className="saas-cta" onClick={handleRun} disabled={status === "loading" || status === "success"}>
              {status === "loading" ? "Ищу…" : "Найти 5 точек сейчас"}
            </button>
          </div>

          {status === "error" && (
            <p className="form-error">Не получилось — попробуй другой район или чуть позже.</p>
          )}
          {status === "empty" && (
            <p className="form-error">Сейчас рядом не нашлось ничего открытого и подходящего — попробуй другой район.</p>
          )}

          {status === "success" && (
            <div className="live-route-results">
              <div className="table-count">Нашёл {candidates.length} точек рядом с «{areaLabel}», открыты сейчас:</div>
              {candidates.map((c, i) => (
                <div className="live-route-item" key={i}>
                  <div className="live-route-item-name">{i + 1}. {c.name}</div>
                  <div className="live-route-item-meta">
                    ⭐{c.rating || "—"} · {c.reviews} отз. · {c.hasWebsite ? "есть сайт" : "нет сайта"}
                  </div>
                  <div className="live-route-item-pain">💡 {c.pain}</div>
                  <div className="live-route-item-addr">📍 {c.address}</div>
                </div>
              ))}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="fear-btn" style={{ marginTop: 8 }}>
                  Открыть маршрут в Google Maps →
                </a>
              )}
              <p className="live-route-note">
                Это демо на реальных, публичных данных Google Maps — ровно так же
                выглядит то, что прилетает мне в Telegram перед выездом.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
