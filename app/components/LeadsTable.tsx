"use client";

import { useMemo, useState } from "react";
import type { LeadRow } from "../lib/cold-leads";
import { STAGE_ORDER, STAGE_LABELS, STAGE_COLORS, type Stage } from "../lib/cold-leads-stats";
import { maskValue } from "../lib/mask";

const PREVIEW_ROWS = 7;

function formatDateTime(row: LeadRow): string {
  if (row.timestamp) {
    const t = new Date(row.timestamp);
    if (!isNaN(t.getTime())) {
      return t.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    }
  }
  return row.date || "—";
}

export default function LeadsTable({ rows, masked }: { rows: LeadRow[]; masked: boolean }) {
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [expanded, setExpanded] = useState(!masked);

  const filtered = useMemo(() => {
    let list = rows.filter((r) => stageFilter === "all" || r.stage === stageFilter);
    list = [...list].sort((a, b) => {
      const an = Number(a.touch_number) || 0;
      const bn = Number(b.touch_number) || 0;
      return sortOrder === "newest" ? bn - an : an - bn;
    });
    return list;
  }, [rows, stageFilter, sortOrder]);

  const visible = expanded ? filtered : filtered.slice(0, PREVIEW_ROWS);
  const hasMore = filtered.length > PREVIEW_ROWS;

  return (
    <div className="card">
      <div className="card-title">
        {masked ? "Хронология — как это работает вживую" : `Все касания (${rows.length})`}
      </div>

      <div className="table-toolbar">
        <select className="table-select" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
          <option value="all">Все стадии</option>
          {STAGE_ORDER.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          className="table-sort-btn"
          onClick={() => setSortOrder((o) => (o === "newest" ? "oldest" : "newest"))}
        >
          {sortOrder === "newest" ? "↓ Сначала новые" : "↑ Сначала старые"}
        </button>
        <span className="table-count">{filtered.length} из {rows.length}</span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Когда</th>
              <th>Бизнес</th>
              <th>Стадия</th>
              <th>Контакт</th>
              <th>Что делать</th>
              <th>Встреча</th>
              {!masked && <th>Заметки</th>}
              {!masked && <th>Фото</th>}
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const stage = (r.stage as Stage) in STAGE_LABELS ? (r.stage as Stage) : "warm_followup";
              return (
                <tr key={r.touch_number}>
                  <td>{r.entry_type === "followup" ? "✉️" : r.touch_number}</td>
                  <td>{formatDateTime(r)}</td>
                  <td>
                    {r.business_name}
                    {r.entry_type === "followup" && (
                      <span style={{ color: "var(--text-3)", fontSize: 11, marginLeft: 6 }}>follow-up</span>
                    )}
                  </td>
                  <td style={{ color: STAGE_COLORS[stage], fontWeight: 600 }}>{STAGE_LABELS[stage]}</td>
                  <td>{masked ? maskValue(r.contact_name) : r.contact_name}</td>
                  <td>{r.next_action}</td>
                  <td>{r.meeting_datetime}</td>
                  {!masked && <td style={{ maxWidth: 260 }}>{r.notes || r.raw_text}</td>}
                  {!masked && (
                    <td>
                      {r.photo_url ? (
                        <a href={r.photo_url} target="_blank" rel="noreferrer">
                          фото
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <button className="table-expand-btn" onClick={() => setExpanded((e) => !e)}>
          {expanded ? "Скрыть" : `Показать все (${filtered.length})`}
        </button>
      )}

      {masked && (
        <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 12 }}>
          Имена контактов скрыты звёздочками. Заметки и фото — только в закрытой CRM.
        </p>
      )}
    </div>
  );
}
