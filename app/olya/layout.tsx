import type { ReactNode } from "react";

export default function OlyaLayout({ children }: { children: ReactNode }) {
  return (
    <>
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
          --blue: #60a5fa;
          --blue-bg: #0c1628;
          --pink: #f472b6;
          --pink-bg: #1c0a14;
        }
        body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; }

        .olya-shell { display: flex; min-height: 100vh; }

        /* ── Sidebar ── */
        .olya-sidebar {
          width: 220px; flex-shrink: 0;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          padding: 28px 0;
          position: sticky; top: 0; height: 100vh; overflow-y: auto;
        }
        .sidebar-brand {
          padding: 0 20px 24px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 16px;
        }
        .sidebar-brand-label {
          font-size: 10px; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; color: var(--accent); margin-bottom: 4px;
        }
        .sidebar-brand-name {
          font-size: 16px; font-weight: 800; color: var(--text); line-height: 1.2;
        }
        .sidebar-brand-sub { font-size: 12px; color: var(--text-3); margin-top: 2px; }
        .sidebar-nav { flex: 1; padding: 0 10px; }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 8px;
          font-size: 13px; font-weight: 500; color: var(--text-2);
          text-decoration: none; margin-bottom: 2px;
          transition: background .15s, color .15s;
        }
        .nav-item:hover { background: var(--surface2); color: var(--text); }
        .nav-item.active { background: var(--accent-dim); color: var(--accent); font-weight: 600; }
        .nav-icon { width: 18px; text-align: center; font-size: 15px; }
        .sidebar-footer {
          padding: 16px 20px 0;
          border-top: 1px solid var(--border);
          font-size: 11px; color: var(--text-3);
        }

        /* ── Main ── */
        .olya-main { flex: 1; min-width: 0; padding: 40px 40px 80px; max-width: 900px; }

        /* ── Typography ── */
        .page-label { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
        .page-title { font-size: 28px; font-weight: 800; color: var(--text); line-height: 1.2; margin-bottom: 6px; }
        .page-sub { font-size: 14px; color: var(--text-3); margin-bottom: 40px; }

        .section { margin-bottom: 44px; }
        .section-title {
          font-size: 15px; font-weight: 700; color: var(--text);
          margin-bottom: 18px; padding-bottom: 10px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 8px;
        }

        /* ── Cards ── */
        .card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; overflow: hidden; margin-bottom: 12px;
        }
        .card-head {
          padding: 10px 16px; border-bottom: 1px solid var(--border-light);
          font-size: 12px; font-weight: 600; color: var(--text-2);
          background: var(--surface2);
          display: flex; align-items: center; justify-content: space-between;
        }
        .card-body { padding: 16px; font-size: 14px; color: var(--text-2); line-height: 1.7; }
        .card-body p + p { margin-top: 8px; }
        .card-body strong { color: var(--text); font-weight: 600; }

        /* ── Stat strip ── */
        .stat-strip { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
        .stat-box {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 10px; padding: 14px 18px; flex: 1; min-width: 110px;
        }
        .stat-label { font-size: 11px; color: var(--text-3); font-weight: 600; text-transform: uppercase; letter-spacing: .08em; }
        .stat-val { font-size: 22px; font-weight: 800; color: var(--text); margin-top: 4px; }
        .stat-note { font-size: 11px; color: var(--text-3); margin-top: 2px; }

        /* ── Callout ── */
        .callout {
          border-radius: 10px; padding: 14px 16px;
          font-size: 14px; line-height: 1.65; margin-bottom: 14px;
        }
        .callout strong { font-weight: 700; }
        .callout.green  { background: var(--green-bg);  border: 1px solid #14532d;  color: var(--green); }
        .callout.amber  { background: var(--amber-bg);  border: 1px solid #451a00;  color: var(--amber); }
        .callout.blue   { background: var(--blue-bg);   border: 1px solid #1e3a5f;  color: var(--blue);  }
        .callout.purple { background: var(--accent-dim); border: 1px solid #3d3170; color: var(--accent); }
        .callout.pink   { background: var(--pink-bg);   border: 1px solid #500724;  color: var(--pink); }
        .callout.neutral{ background: var(--surface2);  border: 1px solid var(--border); color: var(--text-2); }

        /* ── Grid ── */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        @media (max-width: 700px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }

        /* ── Badge ── */
        .badge {
          display: inline-block; padding: 2px 8px; border-radius: 20px;
          font-size: 11px; font-weight: 700;
        }
        .badge.purple { background: var(--accent-dim); color: var(--accent); }
        .badge.green  { background: var(--green-bg);  color: var(--green); }
        .badge.amber  { background: var(--amber-bg);  color: var(--amber); }
        .badge.blue   { background: var(--blue-bg);   color: var(--blue); }
        .badge.pink   { background: var(--pink-bg);   color: var(--pink); }

        /* ── Script card ── */
        .script-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; margin-bottom: 14px; overflow: hidden;
        }
        .script-head {
          padding: 12px 16px; background: var(--surface2);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 10px;
        }
        .script-num {
          width: 26px; height: 26px; border-radius: 8px;
          background: var(--accent-dim); color: var(--accent);
          font-size: 12px; font-weight: 800;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .script-title { font-size: 14px; font-weight: 700; color: var(--text); }
        .script-body { padding: 16px; display: grid; gap: 10px; }
        .script-row { display: grid; grid-template-columns: 72px 1fr; gap: 10px; }
        .script-row-label {
          font-size: 11px; font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; color: var(--text-3); padding-top: 2px;
        }
        .script-row-val { font-size: 14px; color: var(--text-2); line-height: 1.65; }
        .script-row-val em { color: var(--text); font-style: italic; }
        .script-row-val strong { color: var(--accent); font-style: normal; }

        /* ── Storyboard (shots) ── */
        .shots { display: grid; gap: 8px; }
        .shot {
          display: flex; gap: 10px; align-items: flex-start;
          background: var(--surface2); border: 1px solid var(--border-light);
          border-radius: 8px; padding: 10px 12px;
        }
        .shot-num {
          width: 22px; height: 22px; border-radius: 6px; flex-shrink: 0;
          background: var(--accent-dim); color: var(--accent);
          font-size: 11px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .shot-text { min-width: 0; }
        .shot-show { font-size: 13px; color: var(--text); line-height: 1.55; }
        .shot-how { font-size: 12px; color: var(--text-3); line-height: 1.5; margin-top: 3px; }

        /* ── Ref card ── */
        .ref-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; padding: 18px; margin-bottom: 14px;
        }
        .ref-head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .ref-avatar {
          width: 40px; height: 40px; border-radius: 10px;
          background: var(--accent-dim); display: flex; align-items: center;
          justify-content: center; font-size: 18px; flex-shrink: 0;
        }
        .ref-name { font-size: 15px; font-weight: 700; color: var(--text); }
        .ref-handle { font-size: 12px; color: var(--text-3); margin-top: 1px; }
        .ref-stats { display: flex; gap: 8px; margin-bottom: 12px; }
        .ref-body { font-size: 13px; color: var(--text-2); line-height: 1.65; }
        .ref-take {
          margin-top: 12px; padding: 10px 14px;
          background: var(--accent-dim); border-radius: 8px;
          font-size: 13px; color: var(--accent);
        }
        .ref-take strong { font-weight: 700; }

        /* ── Table ── */
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th { text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--text-3); border-bottom: 1px solid var(--border); }
        td { padding: 10px 14px; border-bottom: 1px solid var(--border-light); color: var(--text-2); vertical-align: top; }
        tr:last-child td { border-bottom: none; }

        /* ── Mobile bottom nav (hidden on desktop) ── */
        .olya-mobile-nav { display: none; }

        @media (max-width: 768px) {
          .olya-sidebar { display: none; }
          .olya-main { padding: 24px 16px 96px; }

          .olya-mobile-nav {
            display: flex;
            position: fixed; left: 0; right: 0; bottom: 0;
            z-index: 50;
            background: rgba(20,20,20,0.96);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-top: 1px solid var(--border);
            padding: 8px 4px calc(8px + env(safe-area-inset-bottom));
            justify-content: space-around;
          }
          .m-nav-item {
            display: flex; flex-direction: column; align-items: center; gap: 3px;
            flex: 1 1 0; min-width: 0;
            text-decoration: none; text-align: center;
            color: var(--text-3); font-size: 10px; font-weight: 600;
            line-height: 1.1; padding: 4px 2px; border-radius: 10px;
            transition: color .15s, background .15s;
          }
          .m-nav-item.active { color: var(--accent); background: var(--accent-dim); }
          .m-nav-icon { font-size: 20px; }
        }
      `}</style>
      {children}
    </>
  );
}
