import type { ReactNode } from "react";

export const metadata = { robots: { index: false, follow: false } };

export default function BiMarktLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        .bm *, .bm *::before, .bm *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .bm {
          --bg: #0d0d0d;
          --surface: #141414;
          --surface2: #1a1a1a;
          --border: #222;
          --border-light: #1e1e1e;
          --text: #eef6f2;
          --text-2: #9cc4b4;
          --text-3: #617a6e;
          --accent: #34d399;
          --accent-dim: #0d2b1f;
          --green: #4ade80;
          --green-bg: #052e16;
          --amber: #fbbf24;
          --amber-bg: #1c1200;
          --blue: #60a5fa;
          --blue-bg: #0c1628;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
        }
        .bm-main { max-width: 900px; margin: 0 auto; padding: 40px 40px 80px; }
        @media (max-width: 768px) { .bm-main { padding: 24px 16px 56px; } }

        .bm .topbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
          padding-bottom: 20px; margin-bottom: 28px;
          border-bottom: 1px solid var(--border);
        }
        .bm .topbar-brand { font-size: 13px; font-weight: 700; color: var(--text); }
        .bm .topbar-sub { font-size: 12px; color: var(--text-3); margin-top: 2px; }
        .bm .topbar-link { font-size: 12px; color: var(--text-3); text-decoration: none; }
        .bm .topbar-link:hover { color: var(--accent); }

        .bm .page-label { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
        .bm .page-title { font-size: 28px; font-weight: 800; color: var(--text); line-height: 1.2; margin-bottom: 6px; }
        .bm .page-sub { font-size: 14px; color: var(--text-3); margin-bottom: 36px; }

        .bm .section { margin-bottom: 44px; }
        .bm .section-title {
          font-size: 15px; font-weight: 700; color: var(--text);
          margin-bottom: 18px; padding-bottom: 10px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 8px;
        }

        .bm .card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; overflow: hidden; margin-bottom: 12px;
        }
        .bm .card-head {
          padding: 10px 16px; border-bottom: 1px solid var(--border-light);
          font-size: 12px; font-weight: 600; color: var(--text-2);
          background: var(--surface2);
        }
        .bm .card-body { padding: 16px; font-size: 14px; color: var(--text-2); line-height: 1.7; }
        .bm .card-body p + p { margin-top: 8px; }
        .bm .card-body strong { color: var(--text); font-weight: 600; }

        .bm .stat-strip { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
        .bm .stat-box {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 10px; padding: 14px 18px; flex: 1; min-width: 130px;
        }
        .bm .stat-label { font-size: 11px; color: var(--text-3); font-weight: 600; text-transform: uppercase; letter-spacing: .08em; }
        .bm .stat-val { font-size: 22px; font-weight: 800; color: var(--text); margin-top: 4px; }
        .bm .stat-note { font-size: 11px; color: var(--text-3); margin-top: 2px; }

        .bm .callout {
          border-radius: 10px; padding: 14px 16px;
          font-size: 14px; line-height: 1.65; margin-bottom: 14px;
        }
        .bm .callout strong { font-weight: 700; }
        .bm .callout.green  { background: var(--green-bg); border: 1px solid #14532d; color: var(--green); }
        .bm .callout.amber  { background: var(--amber-bg); border: 1px solid #451a00; color: var(--amber); }
        .bm .callout.blue   { background: var(--blue-bg);  border: 1px solid #1e3a5f; color: var(--blue); }
        .bm .callout.neutral{ background: var(--surface2); border: 1px solid var(--border); color: var(--text-2); }

        .bm .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        @media (max-width: 700px) { .bm .grid-3 { grid-template-columns: 1fr; } }

        .bm .badge {
          display: inline-block; padding: 2px 8px; border-radius: 20px;
          font-size: 11px; font-weight: 700; white-space: nowrap;
        }
        .bm .badge.amber  { background: var(--amber-bg); color: var(--amber); }
        .bm .badge.accent { background: var(--accent-dim); color: var(--accent); }

        .bm .table-wrap { overflow-x: auto; }
        .bm table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 560px; }
        .bm th { text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--text-3); border-bottom: 1px solid var(--border); }
        .bm td { padding: 10px 14px; border-bottom: 1px solid var(--border-light); color: var(--text-2); vertical-align: top; }
        .bm tr:last-child td { border-bottom: none; }
      `}</style>
      <div className="bm">
        <div className="bm-main">{children}</div>
      </div>
    </>
  );
}
