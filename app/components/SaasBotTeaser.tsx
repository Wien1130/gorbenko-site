"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const PLANS = [
  {
    id: "monthly",
    label: "Помесячно",
    price: "5€",
    period: "/мес",
    note: "Можно отменить в любой момент",
  },
  {
    id: "annual",
    label: "Год сразу",
    price: "2€",
    period: "/мес",
    note: "24€ за 12 месяцев — дешевле на 60%",
    highlight: true,
  },
];

export default function SaasBotTeaser() {
  const [expanded, setExpanded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", contact: "" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedPlan) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/saas-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, plan: selectedPlan }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  const planLabel = PLANS.find((p) => p.id === selectedPlan)?.label ?? "";

  return (
    <div className="card saas-teaser" id="saas-teaser">
      <div className="saas-head">
        <div className="saas-title">🧠 Иногда лень, страшно, хочется всё бросить — и это у всех</div>
        <p className="saas-sub">
          Прокрастинация, вредные привычки, страх сделать шаг, желание сбежать в телефон
          вместо дела — это то, с чем я справляюсь на своих холодных заходах через диалог
          с ботом (см. блок выше). Делаю из этого отдельный продукт: бот, которому можно
          наговорить всё, что мешает — лень, страх, тревогу, желание отложить, — и который
          поможет назвать это, прожить и всё равно сделать следующий шаг. Не терапия,
          а маленький инструмент дисциплины и поддержки под рукой 24/7.
        </p>
      </div>

      {!expanded ? (
        <button className="saas-cta" onClick={() => setExpanded(true)}>
          Хочу такого бота — смотреть тарифы →
        </button>
      ) : (
        <div className="saas-body">
          <div className="saas-plans">
            {PLANS.map((p) => (
              <button
                key={p.id}
                className={`saas-plan ${p.highlight ? "saas-plan-highlight" : ""} ${selectedPlan === p.id ? "saas-plan-selected" : ""}`}
                onClick={() => setSelectedPlan(p.id)}
                type="button"
              >
                {p.highlight && <span className="saas-plan-badge">выгоднее</span>}
                <div className="saas-plan-label">{p.label}</div>
                <div className="saas-plan-price">
                  {p.price}
                  <span className="saas-plan-period">{p.period}</span>
                </div>
                <div className="saas-plan-note">{p.note}</div>
              </button>
            ))}
          </div>

          {status === "success" ? (
            <div className="callout-success">
              ✅ Записал! Как только бот будет готов — напишу тебе первому и включу тариф «{planLabel}».
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="lead-form saas-form">
              <p className="saas-form-hint">
                {selectedPlan
                  ? `Выбран тариф: «${planLabel}». Оставь контакт — сообщу, когда бот будет готов.`
                  : "Выбери тариф выше, чтобы записаться в лист ожидания."}
              </p>
              <div className="form-row">
                <input
                  className="form-input"
                  placeholder="Как тебя зовут?"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <input
                  className="form-input"
                  placeholder="Telegram / email / телефон"
                  required
                  value={form.contact}
                  onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                />
              </div>
              <button type="submit" className="form-submit" disabled={!selectedPlan || status === "submitting"}>
                {status === "submitting" ? "Записываю…" : "Записаться в лист ожидания"}
              </button>
              {status === "error" && (
                <p className="form-error">Не получилось отправить — напиши напрямую в Telegram.</p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
