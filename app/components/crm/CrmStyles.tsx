/** Мобильные стили новой CRM (тот же тёмный стиль, что DashboardStyles, но mobile-first). */
export default function CrmStyles() {
  return (
    <style>{`
      .crm-wrap { max-width: 640px; margin: 0 auto; padding: 16px 16px 96px; color: #eee; }
      .crm-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 14px; }
      .crm-title { font-size: 1.15rem; font-weight: 700; }
      .crm-sub { color: #888; font-size: 0.8rem; }
      .crm-links { display: flex; gap: 10px; font-size: 0.78rem; }
      .crm-links a { color: #9ca3af; text-decoration: none; border: 1px solid #333; border-radius: 8px; padding: 4px 8px; }

      .crm-fab { position: fixed; left: 50%; transform: translateX(-50%); bottom: max(20px, env(safe-area-inset-bottom));
        background: #ef4444; color: #fff; font-size: 1.05rem; font-weight: 700; border: none; border-radius: 999px;
        padding: 16px 34px; box-shadow: 0 6px 24px rgba(239,68,68,.45); text-decoration: none; z-index: 50; }

      .crm-remind { background: #1c1917; border: 1px solid #78350f; border-radius: 14px; padding: 12px 14px; margin-bottom: 14px; }
      .crm-remind-title { color: #fbbf24; font-size: 0.8rem; font-weight: 700; margin-bottom: 8px; }
      .crm-remind-item { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 0; border-top: 1px solid #292524; font-size: 0.88rem; }
      .crm-remind-item:first-of-type { border-top: none; }
      .crm-remind-item a { color: #eee; text-decoration: none; flex: 1; }
      .crm-remind-item small { display: block; color: #a8a29e; }

      .crm-filters { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 6px; -webkit-overflow-scrolling: touch; }
      .crm-chip { flex: 0 0 auto; border: 1px solid #333; background: #161616; color: #bbb; border-radius: 999px; padding: 6px 12px; font-size: 0.78rem; cursor: pointer; }
      .crm-chip.on { background: #eee; color: #111; border-color: #eee; font-weight: 600; }

      .crm-lead { display: block; background: #141414; border: 1px solid #262626; border-radius: 14px; padding: 12px 14px; margin-bottom: 10px; text-decoration: none; color: #eee; }
      .crm-lead-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
      .crm-lead-name { font-weight: 700; font-size: 0.98rem; }
      .crm-stage { font-size: 0.7rem; font-weight: 700; padding: 3px 9px; border-radius: 999px; white-space: nowrap; }
      .crm-lead-meta { color: #8b8b8b; font-size: 0.8rem; margin-top: 5px; display: flex; flex-wrap: wrap; gap: 4px 12px; }

      .crm-stats-mini { display: flex; gap: 8px; margin-bottom: 14px; }
      .crm-stat { flex: 1; background: #141414; border: 1px solid #262626; border-radius: 12px; padding: 10px; text-align: center; }
      .crm-stat b { display: block; font-size: 1.25rem; }
      .crm-stat span { color: #888; font-size: 0.68rem; }

      /* Экран захода */
      .crm-outcomes { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
      .crm-outcome { border: 2px solid #333; background: #161616; color: #eee; border-radius: 16px; padding: 18px 10px; font-size: 1rem; font-weight: 700; cursor: pointer; text-align: center; }
      .crm-outcome.on { border-color: #ef4444; background: #27150f; }
      .crm-inputs { display: flex; flex-direction: column; gap: 12px; }
      .crm-rec { display: flex; align-items: center; gap: 12px; }
      .crm-rec-btn { flex: 1; border: 2px dashed #444; background: #141414; color: #eee; border-radius: 16px; padding: 20px; font-size: 1.02rem; font-weight: 700; cursor: pointer; }
      .crm-rec-btn.recording { border-color: #ef4444; background: #2a0f0f; color: #fca5a5; animation: crmpulse 1.2s infinite; }
      @keyframes crmpulse { 50% { opacity: .65; } }
      .crm-photo-row { display: flex; align-items: center; gap: 10px; }
      .crm-photo-label { border: 2px dashed #444; background: #141414; color: #bbb; border-radius: 16px; padding: 14px; text-align: center; cursor: pointer; flex: 1; font-size: 0.92rem; }
      .crm-photo-thumb { width: 62px; height: 62px; object-fit: cover; border-radius: 12px; border: 1px solid #333; }
      .crm-textarea, .crm-input, .crm-select { width: 100%; background: #141414; border: 1px solid #333; color: #eee; border-radius: 12px; padding: 11px 12px; font-size: 0.95rem; font-family: inherit; }
      .crm-textarea { min-height: 74px; resize: vertical; }
      .crm-go { width: 100%; background: #eee; color: #111; border: none; border-radius: 14px; padding: 16px; font-size: 1.05rem; font-weight: 800; cursor: pointer; margin-top: 14px; }
      .crm-go:disabled { opacity: .45; }
      .crm-go.red { background: #ef4444; color: #fff; }

      .crm-field { margin-bottom: 10px; }
      .crm-field label { display: block; color: #8b8b8b; font-size: 0.72rem; margin-bottom: 4px; text-transform: uppercase; letter-spacing: .04em; }
      .crm-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .crm-banner { background: #0f1f2a; border: 1px solid #1e40af; color: #93c5fd; border-radius: 12px; padding: 10px 12px; font-size: 0.85rem; margin-bottom: 12px; }
      .crm-error { background: #2a0f0f; border: 1px solid #7f1d1d; color: #fca5a5; border-radius: 12px; padding: 10px 12px; font-size: 0.85rem; margin: 10px 0; white-space: pre-wrap; }
      .crm-ok { background: #0d2416; border: 1px solid #166534; color: #86efac; border-radius: 12px; padding: 10px 12px; font-size: 0.85rem; margin: 10px 0; }

      /* Карточка лида */
      .crm-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 14px 0; }
      .crm-action { border: 1px solid #333; background: #161616; color: #eee; border-radius: 14px; padding: 12px 4px; text-align: center; text-decoration: none; font-size: 0.78rem; cursor: pointer; }
      .crm-action b { display: block; font-size: 1.25rem; margin-bottom: 3px; }
      .crm-action:disabled, .crm-action.off { opacity: .35; pointer-events: none; }
      .crm-timeline { margin-top: 6px; }
      .crm-tl-item { border-left: 2px solid #2b2b2b; padding: 2px 0 14px 14px; margin-left: 6px; position: relative; font-size: 0.88rem; }
      .crm-tl-item::before { content: ""; position: absolute; left: -6px; top: 5px; width: 10px; height: 10px; border-radius: 50%; background: #444; }
      .crm-tl-date { color: #777; font-size: 0.72rem; }
      .crm-tl-photo { color: #93c5fd; font-size: 0.78rem; }
      .crm-section-title { font-size: 0.8rem; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: .05em; margin: 20px 0 10px; }
      .crm-sig { color: #777; font-size: 0.82rem; white-space: pre-wrap; border-top: 1px dashed #333; margin-top: 6px; padding-top: 6px; }
      .crm-row-btns { display: flex; gap: 8px; }
      .crm-row-btns .crm-go { margin-top: 0; }
      .crm-mini-btn { border: 1px solid #333; background: #161616; color: #bbb; border-radius: 10px; padding: 6px 12px; font-size: 0.78rem; cursor: pointer; }
    `}</style>
  );
}
