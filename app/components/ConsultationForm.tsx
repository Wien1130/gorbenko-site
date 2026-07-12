"use client";

import { useState, type FormEvent } from "react";

const TELEGRAM_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME ?? "";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

type Status = "idle" | "submitting" | "success" | "error";

export default function ConsultationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", business: "", request: "", phone: "", email: "" });

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="card sales-card" id="consultation">
      <div className="sales-head">
        <div className="sales-title">🎁 Бесплатная консультация</div>
        <p className="sales-sub">
          Этот дашборд — просто один пример. Делаю ботов, дашборды и автоматизацию под
          любую задачу бизнеса: доставка, кафе, услуги, что угодно — не обязательно
          холодные продажи. Расскажите, что у вас болит — оставьте заявку, отвечу
          лично и обсудим бесплатно, что можно сделать конкретно для вас.
        </p>
      </div>

      {status === "success" ? (
        <div className="callout-success">
          ✅ Заявка отправлена! Свяжусь с вами в ближайшее время.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="lead-form">
          <div className="form-row">
            <input
              className="form-input"
              placeholder="Как вас зовут?"
              required
              value={form.name}
              onChange={update("name")}
            />
            <input
              className="form-input"
              placeholder="Чем занимается ваш бизнес?"
              value={form.business}
              onChange={update("business")}
            />
          </div>
          <textarea
            className="form-input form-textarea"
            placeholder="Какой у вас запрос? Что хотите автоматизировать/улучшить?"
            required
            value={form.request}
            onChange={update("request")}
          />
          <div className="form-row">
            <input
              className="form-input"
              type="tel"
              placeholder="Телефон"
              value={form.phone}
              onChange={update("phone")}
            />
            <input
              className="form-input"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={update("email")}
            />
          </div>
          <button type="submit" className="form-submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Отправляю…" : "Записаться на консультацию"}
          </button>
          {status === "error" && (
            <p className="form-error">Не получилось отправить — напишите напрямую в Telegram или WhatsApp ниже.</p>
          )}
        </form>
      )}

      {(TELEGRAM_USERNAME || WHATSAPP_NUMBER) && (
        <div className="contact-buttons">
          <span className="contact-or">или напишите напрямую</span>
          <div className="contact-btn-row">
            {TELEGRAM_USERNAME && (
              <a
                className="contact-btn contact-btn-telegram"
                href={`https://t.me/${TELEGRAM_USERNAME}`}
                target="_blank"
                rel="noreferrer"
              >
                ✈️ Telegram
              </a>
            )}
            {WHATSAPP_NUMBER && (
              <a
                className="contact-btn contact-btn-whatsapp"
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
              >
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
