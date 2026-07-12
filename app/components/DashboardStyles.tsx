export default function DashboardStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --bg: #0d0d0d;
        --surface: #141414;
        --surface2: #1a1a1a;
        --border: #222;
        --border-light: #1e1e1e;
        --text: #f0eefc;
        --text-2: #a09cc4;
        --text-3: #66617a;
        --accent: #7c6af0;
        --accent-dim: #2a2440;
        --green: #4ade80;
        --green-bg: #052e16;
        --amber: #fbbf24;
        --amber-bg: #1c1200;
        --red: #f87171;
        --red-bg: #2a0a0a;
      }
      body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; }

      .dash-main { min-height: 100vh; padding: 40px 24px 80px; max-width: 1080px; margin: 0 auto; }

      .dash-header { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 6px; }
      .page-label { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); }
      .page-title { font-size: 30px; font-weight: 800; color: var(--text); line-height: 1.2; margin: 6px 0; }
      .page-sub { font-size: 14px; color: var(--text-3); margin-bottom: 32px; }

      .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
      .badge.green { background: var(--green-bg); color: var(--green); }
      .badge.red { background: var(--red-bg); color: var(--red); }

      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 24px; }
      @media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
      .stat-box { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; }
      .stat-label { font-size: 11px; color: var(--text-3); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
      .stat-val { font-size: 24px; font-weight: 800; color: var(--text); margin-top: 6px; }
      .stat-note { font-size: 11px; color: var(--text-3); margin-top: 3px; }

      .progress-wrap { margin-bottom: 32px; }
      .progress-track { background: var(--surface2); border-radius: 999px; height: 12px; overflow: hidden; border: 1px solid var(--border); }
      .progress-fill { background: linear-gradient(90deg, var(--accent), var(--green)); height: 100%; border-radius: 999px; transition: width .3s; }
      .progress-caption { font-size: 12px; color: var(--text-3); margin-top: 8px; }

      .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; margin-bottom: 20px; }
      .card-title { font-size: 13px; font-weight: 700; color: var(--text-2); margin-bottom: 16px; text-transform: uppercase; letter-spacing: .06em; }

      .charts-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; }
      @media (max-width: 900px) { .charts-grid { grid-template-columns: 1fr; } }

      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th { text-align: left; padding: 10px 12px; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--text-3); border-bottom: 1px solid var(--border); }
      td { padding: 10px 12px; border-bottom: 1px solid var(--border-light); color: var(--text-2); vertical-align: top; }
      tr:last-child td { border-bottom: none; }
      td a { color: var(--accent); text-decoration: none; }

      .footer-note { text-align: center; font-size: 12px; color: var(--text-3); margin-top: 40px; }
      .footer-note a { color: var(--accent); text-decoration: none; }

      .timeline-day { margin-bottom: 18px; }
      .timeline-day:last-of-type { margin-bottom: 0; }
      .timeline-date { font-size: 12px; font-weight: 700; color: var(--text-2); text-transform: capitalize; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid var(--border-light); }
      .timeline-row { display: grid; grid-template-columns: 56px 1fr auto; align-items: center; gap: 12px; padding: 7px 4px; font-size: 13px; border-bottom: 1px solid var(--border-light); }
      .timeline-row:last-child { border-bottom: none; }
      .timeline-time { color: var(--text-3); font-size: 12px; font-variant-numeric: tabular-nums; }
      .timeline-type { color: var(--text); font-weight: 600; }
      .timeline-stage { font-size: 12px; font-weight: 700; text-align: right; }

      .promo-banner {
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        background: linear-gradient(120deg, var(--accent-dim), var(--surface));
        border: 1px solid var(--accent); border-radius: 14px;
        padding: 18px 22px; margin-bottom: 24px;
      }
      .promo-banner-title { font-size: 15px; font-weight: 800; color: var(--text); }
      .promo-banner-sub { font-size: 12.5px; color: var(--text-2); margin-top: 3px; }
      .promo-btn {
        flex-shrink: 0; background: var(--accent); color: #0d0d0d;
        font-size: 13px; font-weight: 700; padding: 9px 18px; border-radius: 999px;
        white-space: nowrap; text-decoration: none; display: inline-block;
        transition: transform .15s, box-shadow .15s;
      }
      .promo-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,106,240,0.35); }
      .page-label-link { color: inherit; text-decoration: none; transition: opacity .15s; }
      .page-label-link:hover { opacity: 0.75; }
      @media (max-width: 600px) {
        .promo-banner { flex-direction: column; align-items: flex-start; }
        .promo-btn { align-self: flex-start; }
      }

      .sales-card { border-color: var(--accent); background: linear-gradient(160deg, var(--accent-dim), var(--surface) 40%); }
      .sales-head { margin-bottom: 18px; }
      .sales-title { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
      .sales-sub { font-size: 13.5px; color: var(--text-2); line-height: 1.5; max-width: 520px; }

      .lead-form { display: flex; flex-direction: column; gap: 10px; }
      .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      @media (max-width: 560px) { .form-row { grid-template-columns: 1fr; } }
      .form-input {
        width: 100%; background: var(--surface2); border: 1px solid var(--border);
        border-radius: 9px; padding: 11px 14px; font-size: 14px; color: var(--text);
        font-family: inherit; outline: none; transition: border-color .15s;
      }
      .form-input::placeholder { color: var(--text-3); }
      .form-input:focus { border-color: var(--accent); }
      .form-textarea { resize: vertical; min-height: 64px; }
      .form-submit {
        margin-top: 4px; background: var(--accent); color: #0d0d0d; font-weight: 700;
        font-size: 15px; padding: 13px 20px; border: none; border-radius: 10px;
        cursor: pointer; transition: opacity .15s;
      }
      .form-submit:hover { opacity: 0.9; }
      .form-submit:disabled { opacity: 0.6; cursor: not-allowed; }
      .form-error { color: var(--red); font-size: 12.5px; }
      .callout-success {
        background: var(--green-bg); border: 1px solid #14532d; color: var(--green);
        border-radius: 10px; padding: 16px; font-size: 14px; font-weight: 600;
      }

      .contact-buttons { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-light); }
      .contact-or { display: block; font-size: 11px; color: var(--text-3); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 10px; }
      .contact-btn-row { display: flex; gap: 10px; flex-wrap: wrap; }
      .contact-btn {
        display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px;
        border-radius: 999px; font-size: 13.5px; font-weight: 700; text-decoration: none;
        transition: opacity .15s;
      }
      .contact-btn:hover { opacity: 0.85; }
      .contact-btn-telegram { background: #229ed9; color: #fff; }
      .contact-btn-whatsapp { background: #25d366; color: #06180d; }

      .table-toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
      .table-select {
        background: var(--surface2); border: 1px solid var(--border); color: var(--text);
        border-radius: 8px; padding: 7px 12px; font-size: 13px; font-family: inherit; outline: none;
      }
      .table-sort-btn {
        background: var(--surface2); border: 1px solid var(--border); color: var(--text-2);
        border-radius: 8px; padding: 7px 12px; font-size: 13px; font-family: inherit;
        cursor: pointer; transition: color .15s, border-color .15s;
      }
      .table-sort-btn:hover { color: var(--text); border-color: var(--accent); }
      .table-count { font-size: 12px; color: var(--text-3); margin-left: auto; }
      .table-expand-btn {
        display: block; width: 100%; margin-top: 14px; background: var(--surface2);
        border: 1px solid var(--border); color: var(--accent); font-weight: 700;
        font-size: 13px; padding: 10px; border-radius: 9px; cursor: pointer;
        font-family: inherit; transition: border-color .15s;
      }
      .table-expand-btn:hover { border-color: var(--accent); }

      .fear-card {
        border-color: #3a2a52; background: linear-gradient(150deg, #241a38, var(--surface) 55%);
        display: flex; flex-direction: column; gap: 14px;
      }
      .fear-top { display: flex; align-items: center; justify-content: space-between; gap: 18px; flex-wrap: wrap; }
      .fear-text { flex: 1; min-width: 220px; }
      .fear-title { font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 5px; }
      .fear-sub { font-size: 13px; color: var(--text-2); line-height: 1.5; }
      .fear-count { font-size: 28px; font-weight: 800; color: #c084fc; }
      .fear-actions { display: flex; flex-direction: column; gap: 8px; }
      .fear-btn {
        flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px;
        background: #7c3aed; color: #fff; font-weight: 700; font-size: 14px;
        padding: 13px 22px; border-radius: 999px; text-decoration: none;
        transition: transform .15s, box-shadow .15s; white-space: nowrap;
      }
      .fear-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,58,237,0.35); }
      .fear-btn-alt { background: #1a1330; border: 1px solid #7c3aed; color: #c084fc; }
      .fear-toggle {
        align-self: flex-start; background: none; border: 1px solid var(--border-light);
        color: var(--text-2); font-size: 12.5px; font-weight: 600; padding: 8px 14px;
        border-radius: 999px; cursor: pointer; font-family: inherit; transition: border-color .15s;
      }
      .fear-toggle:hover { border-color: #7c3aed; color: var(--text); }
      .fear-log { display: flex; flex-direction: column; gap: 10px; max-height: 420px; overflow-y: auto; }
      .fear-log-item {
        display: flex; gap: 12px; padding: 12px; background: rgba(0,0,0,0.18);
        border: 1px solid var(--border-light); border-radius: 10px;
      }
      .fear-log-time { flex-shrink: 0; font-size: 11.5px; color: var(--text-3); white-space: nowrap; padding-top: 2px; }
      .fear-log-body { display: flex; flex-direction: column; gap: 4px; font-size: 12.5px; color: var(--text-2); line-height: 1.5; }
      .fear-log-label { color: var(--text-3); font-weight: 600; }
      .fear-log-context { color: #a78bfa; font-size: 12px; }
      .fear-log-bot { font-style: italic; }
      .fear-log-outcome { color: #4ade80; font-weight: 700; font-size: 12px; margin-top: 2px; }

      .saas-teaser {
        border-color: #2a3f52; background: linear-gradient(150deg, #142230, var(--surface) 55%);
        display: flex; flex-direction: column; gap: 16px;
      }
      .saas-title { font-size: 16px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
      .saas-sub { font-size: 13px; color: var(--text-2); line-height: 1.6; }
      .saas-cta {
        align-self: flex-start; background: #0ea5e9; color: #06202e; font-weight: 800; font-size: 14px;
        padding: 13px 22px; border-radius: 999px; border: none; cursor: pointer; font-family: inherit;
        transition: transform .15s, box-shadow .15s;
      }
      .saas-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(14,165,233,0.3); }
      .saas-body { display: flex; flex-direction: column; gap: 16px; }
      .saas-plans { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
      .saas-plan {
        position: relative; text-align: left; background: rgba(0,0,0,0.2); border: 1px solid var(--border-light);
        border-radius: 12px; padding: 16px; cursor: pointer; font-family: inherit; transition: border-color .15s, transform .15s;
      }
      .saas-plan:hover { border-color: #0ea5e9; transform: translateY(-1px); }
      .saas-plan-selected { border-color: #0ea5e9; background: rgba(14,165,233,0.1); }
      .saas-plan-highlight { border-color: #38bdf8; }
      .saas-plan-badge {
        position: absolute; top: -9px; right: 12px; background: #0ea5e9; color: #06202e;
        font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .04em;
        padding: 3px 8px; border-radius: 999px;
      }
      .saas-plan-label { font-size: 12.5px; color: var(--text-3); font-weight: 600; margin-bottom: 6px; }
      .saas-plan-price { font-size: 24px; font-weight: 800; color: var(--text); }
      .saas-plan-period { font-size: 13px; color: var(--text-3); font-weight: 500; }
      .saas-plan-note { font-size: 11.5px; color: var(--text-3); margin-top: 6px; line-height: 1.4; }
      .saas-form { gap: 10px; }
      .saas-form-hint { font-size: 12.5px; color: var(--text-2); margin: 0; }

      .plan-card { margin-top: 8px; }
      .plan-hint { font-size: 12px; color: var(--text-3); line-height: 1.5; margin: -4px 0 16px; }
      .plan-form { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end; margin-bottom: 18px; }
      .plan-form .form-input { width: auto; min-width: 120px; }
      .plan-field { display: flex; flex-direction: column; gap: 5px; }
      .plan-field label { font-size: 11px; color: var(--text-3); text-transform: uppercase; letter-spacing: .05em; }
      .plan-row {
        display: grid; grid-template-columns: 90px 1fr 1fr 70px; gap: 10px; align-items: center;
        padding: 9px 4px; font-size: 13px; border-bottom: 1px solid var(--border-light);
      }
      .plan-row:last-child { border-bottom: none; }
      @media (max-width: 640px) { .plan-row { grid-template-columns: 70px 1fr 1fr 50px; font-size: 12px; } }
      .plan-date { color: var(--text-2); font-weight: 600; }
      .plan-metric { color: var(--text-3); }
      .plan-metric b { color: var(--text); font-weight: 700; }
      .plan-match { font-weight: 800; text-align: right; }
      .plan-match.good { color: var(--green); }
      .plan-match.mid { color: var(--amber); }
      .plan-match.bad { color: var(--red); }
      .plan-match.none { color: var(--text-3); font-weight: 500; }
    `}</style>
  );
}
