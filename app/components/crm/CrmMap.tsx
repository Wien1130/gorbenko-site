"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, LayerGroup } from "leaflet";
import { STAGE_COLORS, STAGE_LABELS, type Stage } from "../../lib/cold-leads-stats";
import type { MapPoint } from "../../lib/crm/types";

const VIENNA: [number, number] = [48.2082, 16.3738];

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function dayLabel(day: string): string {
  return new Date(day + "T12:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "short", weekday: "short" });
}

export default function CrmMap({ points }: { points: MapPoint[] }) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const [day, setDay] = useState<string>("all");

  const days = useMemo(() => Array.from(new Set(points.map((p) => p.visit_day).filter(Boolean))).sort().reverse(), [points]);
  const shown = useMemo(() => (day === "all" ? points : points.filter((p) => p.visit_day === day)), [points, day]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !elRef.current) return;
      if (!mapRef.current) {
        mapRef.current = L.map(elRef.current, { zoomControl: true }).setView(VIENNA, 13);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: "&copy; OpenStreetMap &copy; CARTO",
          maxZoom: 20,
        }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }
      const map = mapRef.current;
      const layer = layerRef.current!;
      layer.clearLayers();

      const latlngs: [number, number][] = [];
      shown.forEach((p, i) => {
        const color = STAGE_COLORS[p.stage as Stage] ?? "#9ca3af";
        const ll: [number, number] = [p.lat, p.lng];
        latlngs.push(ll);
        const gmaps = `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
        L.circleMarker(ll, { radius: 9, color: "#0d0d0d", weight: 2, fillColor: color, fillOpacity: 0.95 })
          .bindPopup(
            `<b>${day === "all" ? "" : `${i + 1}. `}${esc(p.business_name)}</b><br/>` +
              `${esc(STAGE_LABELS[p.stage as Stage] ?? p.stage)}<br/>` +
              (p.address ? `${esc(p.address)}<br/>` : "") +
              `<a href="/crm/lead/${p.id}">Карточка →</a> · <a href="${gmaps}" target="_blank" rel="noreferrer">Google Maps</a>`,
          )
          .addTo(layer);
      });
      if (day !== "all" && latlngs.length > 1) {
        L.polyline(latlngs, { color: "#ef4444", weight: 3, opacity: 0.7, dashArray: "6 6" }).addTo(layer);
      }
      if (latlngs.length) map.fitBounds(L.latLngBounds(latlngs).pad(0.2), { maxZoom: 16 });
    })();
    return () => { cancelled = true; };
  }, [shown, day]);

  useEffect(() => () => { mapRef.current?.remove(); mapRef.current = null; }, []);

  const routeUrl =
    shown.length > 1
      ? "https://www.google.com/maps/dir/" + shown.slice(0, 10).map((p) => `${p.lat},${p.lng}`).join("/")
      : "";

  function downloadCsv() {
    const rows = [["Name", "Latitude", "Longitude", "Status", "Address", "Day"]];
    for (const p of shown) {
      rows.push([p.business_name, String(p.lat), String(p.lng), STAGE_LABELS[p.stage as Stage] ?? p.stage, p.address, p.visit_day]);
    }
    const csv = rows.map((r) => r.map((c) => `"${(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `cold-sales-points-${day}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="crm-filters">
        <button className={`crm-chip ${day === "all" ? "on" : ""}`} onClick={() => setDay("all")}>Все ({points.length})</button>
        {days.map((d) => (
          <button key={d} className={`crm-chip ${day === d ? "on" : ""}`} onClick={() => setDay(d)}>
            {dayLabel(d)} ({points.filter((p) => p.visit_day === d).length})
          </button>
        ))}
      </div>

      <div ref={elRef} className="crm-map" />

      {points.length === 0 && (
        <div className="crm-sub" style={{ textAlign: "center", padding: 14 }}>
          Пока нет точек. Каждый заход с включённым GPS (или с адресом) появится здесь.
        </div>
      )}

      <div className="crm-row-btns" style={{ marginTop: 12 }}>
        {routeUrl && (
          <a href={routeUrl} target="_blank" rel="noreferrer" className="crm-go" style={{ textAlign: "center", textDecoration: "none", marginTop: 0 }}>
            🧭 {day === "all" ? "Первые 10" : "Маршрут дня"} в Google Maps
          </a>
        )}
        {shown.length > 0 && (
          <button className="crm-go" style={{ marginTop: 0, background: "#161616", color: "#bbb" }} onClick={downloadCsv}>
            📥 CSV для Google My Maps
          </button>
        )}
      </div>
    </div>
  );
}
