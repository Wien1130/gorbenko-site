"use client";

import { useState } from "react";
import type { ResistanceWithContext } from "../lib/resistance";

const BOT_URL = "https://t.me/andrii_assistant_bot?start=fear";

function formatTs(ts: string): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function FearCard({
  count,
  entries,
  variant,
}: {
  count: number;
  entries: ResistanceWithContext[];
  variant: "public" | "private";
}) {
  const isPublic = variant === "public";
  const [open, setOpen] = useState(false);
  const sorted = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="card fear-card">
      <div className="fear-top">
        <div className="fear-text">
          <div className="fear-title">😨 {isPublic ? "Иногда страшно — и это нормально" : "Мне страшно — поддержка"}</div>
          <p className="fear-sub">
            {isPublic
              ? "Перед каждым заходом иногда есть сопротивление. Вместо того чтобы отложить — наговариваю боту, что чувствую в теле, и иду. "
              : "Нажми и наговори голосом, что чувствуешь прямо сейчас — где в теле, чего боишься. Никуда, кроме этой CRM, не уйдёт. "}
            Счётчик: <span className="fear-count">{count}</span> {isPublic ? "раз(а) из 100 касаний" : "проработок за кампанию"}.
          </p>
        </div>
        <div className="fear-actions">
          {!isPublic && (
            <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="fear-btn">
              Открыть в Telegram →
            </a>
          )}
          {isPublic && (
            <a href="#saas-teaser" className="fear-btn fear-btn-alt">
              Хочу такого бота →
            </a>
          )}
        </div>
      </div>

      {entries.length > 0 && (
        <>
          <button className="fear-toggle" onClick={() => setOpen((v) => !v)}>
            {open ? "Скрыть записи ▲" : `Показать все записи (${entries.length}) ▼`}
          </button>
          {open && (
            <div className="fear-log">
              {sorted.map((e, i) => (
                <div key={i} className="fear-log-item">
                  <div className="fear-log-time">{formatTs(e.timestamp)}</div>
                  <div className="fear-log-body">
                    <div className="fear-log-row">
                      <span className="fear-log-label">Наговорил боту:</span> «{e.text}»
                    </div>
                    <div className="fear-log-row fear-log-context">
                      {e.matchedBusinessType
                        ? `Перед заходом: ${!isPublic && e.matchedBusiness ? e.matchedBusiness : e.matchedBusinessType}`
                        : "Контекст не привязан к конкретному заходу"}
                    </div>
                    <div className="fear-log-row fear-log-bot">
                      <span className="fear-log-label">Бот ответил:</span> {e.botReply}
                    </div>
                    {e.overcame && <div className="fear-log-outcome">✅ Преодолел и зашёл</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
