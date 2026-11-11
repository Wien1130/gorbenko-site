/** Светлая тема страницы обхода выставки (/crm/messe) — отдельно от тёмной CRM. */
export default function MesseStyles() {
  return (
    <style>{`
      .messe { --ink:#15273c; --muted:#536578; --pink:#d42764; --paper:#f5f3ee; --line:#d9dfe3; --green:#176d5a; --amber:#9a6b0a; --grey:#62707b;
        min-height:100vh; background:var(--paper); color:var(--ink); font:15px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif; }
      .messe * { box-sizing:border-box; }
      .messe a { color:#17627f; text-underline-offset:3px; }
      .messe button, .messe input, .messe select, .messe textarea { font:inherit; color:var(--ink); }
      .messe button { cursor:pointer; border:1px solid #bcc8d0; border-radius:8px; background:#fff; padding:8px 12px; white-space:nowrap; }
      .messe button:disabled { opacity:.5; cursor:default; }
      .messe button.on { background:var(--ink); color:#fff; border-color:var(--ink); }
      .messe button.pink { background:var(--pink); color:#fff; border-color:var(--pink); font-weight:700; }
      .messe button.ghost { border-color:transparent; background:transparent; color:#17627f; padding:4px 6px; }
      .messe input, .messe textarea, .messe select { border:1px solid #bcc8d0; border-radius:8px; background:#fff; padding:9px 11px; width:100%; min-width:0; }
      .messe textarea { min-height:64px; resize:vertical; }

      .m-head { background:var(--ink); color:#fff; padding:18px 16px 16px; }
      .m-head small { color:#9bd4d1; letter-spacing:.12em; font-size:11px; text-transform:uppercase; }
      .m-head h1 { margin:6px 0 4px; font-size:22px; line-height:1.15; }
      .m-head .sub { color:#c9d6e2; font-size:13px; }
      .m-head .sub a { color:#c5eef1; }
      .m-stats { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
      .m-stat { border:1px solid #4c6175; border-radius:9px; padding:6px 10px; font-size:13px; }
      .m-stat b { font-size:18px; margin-right:4px; }
      .m-progress { height:6px; background:#2b4157; border-radius:3px; margin-top:12px; overflow:hidden; display:flex; }
      .m-progress i { display:block; height:100%; }

      .m-bar { position:sticky; top:0; z-index:5; background:#f5f3eef2; backdrop-filter:blur(8px); border-bottom:1px solid var(--line); padding:10px 16px; }
      .m-tabs { display:flex; gap:6px; overflow-x:auto; -webkit-overflow-scrolling:touch; padding-bottom:6px; }
      .m-tabs button { flex:0 0 auto; font-size:13px; padding:7px 11px; }
      .m-tabs button small { font-size:11px; opacity:.7; margin-left:2px; }
      .m-tabs button.plan { border-color:var(--pink); color:var(--pink); font-weight:700; }
      .m-tabs button.plan.on { background:var(--pink); color:#fff; }
      .m-search { margin-top:6px; }
      .m-map { display:inline-block; background:#d42764; color:#fff !important; text-decoration:none; font-weight:700; border-radius:999px; padding:8px 14px; }

      .m-main { max-width:760px; margin:0 auto; padding:14px 14px 90px; }
      .m-note { background:#e5eeef; border-radius:10px; padding:10px 14px; font-size:13px; color:#2f4a5a; margin-bottom:12px; }

      .m-card { background:#fff; border:1px solid var(--line); border-radius:14px; padding:14px; margin-bottom:10px; scroll-margin-top:120px; }
      .m-card.talked { border-color:#8fc9b5; }
      .m-card.revisit { border-color:#e3c46d; }
      .m-card.skip { opacity:.55; }
      .m-top { display:flex; gap:10px; align-items:flex-start; justify-content:space-between; }
      .m-name { font-size:17px; font-weight:700; line-height:1.2; }
      .m-order { color:var(--muted); font-weight:400; font-size:14px; margin-right:4px; }
      .m-booth { background:var(--ink); color:#fff; min-width:58px; text-align:center; border-radius:9px; padding:5px 6px; font-size:18px; line-height:1.05; flex:0 0 auto; }
      .m-booth small { display:block; font-size:10px; color:#bfd1dc; margin-top:2px; }
      .m-sub { color:var(--muted); font-size:13px; margin-top:4px; }
      .m-chips { display:flex; gap:5px; flex-wrap:wrap; margin:8px 0 4px; }
      .m-chip { background:#edf1f4; color:#3b5267; border-radius:5px; padding:2px 7px; font-size:11.5px; }
      .m-chip.A { background:#d9eee5; color:#15634e; } .m-chip.B { background:#f3e8cf; color:#765515; } .m-chip.C { background:#e9edf0; color:#62707b; }
      .m-chip.st-talked { background:#d9eee5; color:#15634e; font-weight:600; }
      .m-chip.st-revisit { background:#fbefc9; color:#7a5a07; font-weight:600; }
      .m-chip.st-skip { background:#e9edf0; color:#62707b; }
      .m-chip.st-mail { background:#dcebf7; color:#1d4f7a; font-weight:600; }
      .m-offer { border-left:3px solid var(--pink); padding-left:10px; margin:10px 0; font-size:14px; }
      .m-label { font-size:11px; text-transform:uppercase; letter-spacing:.07em; color:#687a89; display:block; margin-bottom:2px; }
      .m-q { background:#f2f5f6; border-radius:8px; padding:9px 10px; font-size:14px; display:flex; gap:8px; align-items:flex-start; }
      .m-q span { flex:1; }
      .m-look { display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; margin-top:10px; }
      .m-look a { display:flex; align-items:center; justify-content:center; min-height:44px; padding:8px 4px; border-radius:10px; background:#17343a; color:#fff; font-weight:700; font-size:13px; text-decoration:none; text-align:center; line-height:1.15; }
      .m-look a.miss { background:#fff; color:#5c6b73; border:1px dashed #bcc8d0; }
      .m-links { display:flex; gap:12px; flex-wrap:wrap; font-size:13px; margin-top:8px; }
      .m-card details { margin-top:8px; font-size:13px; color:#485b6d; }
      .m-card summary { cursor:pointer; font-weight:600; color:var(--ink); }
      .m-card details p { margin:6px 0; }

      .m-status { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-top:12px; }
      .m-status button { padding:9px 4px; font-size:12.5px; }
      .m-status button.on.talked { background:var(--green); border-color:var(--green); }
      .m-status button.on.revisit { background:#b8860b; border-color:#b8860b; }
      .m-status button.on.skip { background:var(--grey); border-color:var(--grey); }
      .m-actions { display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; }
      .m-actions button { flex:1 1 140px; padding:12px 8px; font-weight:700; white-space:normal; line-height:1.25; }
      .m-actions button.pink { flex:1 1 100%; order:2; padding:14px 10px; font-size:16px; }
      .m-flow { padding-bottom:calc(24px + env(safe-area-inset-bottom)); }
      .m-main { padding-bottom:calc(120px + env(safe-area-inset-bottom)); }
      .m-toast { position:fixed; left:10px; right:10px; bottom:calc(14px + env(safe-area-inset-bottom)); z-index:60; padding:14px 16px; border-radius:14px; font-size:15px; font-weight:700; color:#fff; background:var(--ink); box-shadow:0 8px 28px rgba(0,0,0,.25); }
      .m-toast.ok { background:var(--green); }
      .m-toast.err { background:#b3261e; }
      .m-toast.busy { background:var(--ink); }
      .m-notefield { margin-top:8px; }
      .m-notefield textarea { min-height:44px; font-size:14px; }
      .m-shots { display:flex; gap:8px; overflow-x:auto; margin-top:10px; }
      .m-shots img { width:84px; height:84px; object-fit:cover; border-radius:10px; background:#eee; display:block; }
      .m-shot-add { flex:0 0 auto; width:84px; height:84px; border:2px dashed #bcc8d0; border-radius:10px; display:flex; align-items:center; justify-content:center; text-align:center; font-size:12px; font-weight:700; color:var(--muted); background:#fff; cursor:pointer; }
      .m-shot-add input { display:none; }
      .m-shot-add.busy { opacity:.5; }

      .m-flow { margin-top:12px; border-top:1px dashed var(--line); padding-top:12px; }
      .m-steps { display:flex; gap:6px; font-size:12px; color:var(--muted); margin-bottom:10px; }
      .m-steps b { color:var(--ink); }
      .m-steps i { font-style:normal; color:#b4bfc8; }
      .m-flow .row { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px; }
      .m-flow .field { margin-bottom:8px; }
      .m-flow .field input, .m-flow .field textarea { font-size:14px; }
      .m-busy { color:var(--muted); font-size:14px; padding:10px 0; display:flex; align-items:center; gap:8px; }
      .m-busy::before { content:""; width:14px; height:14px; border:2px solid #bcc8d0; border-top-color:var(--ink); border-radius:50%; animation:mspin .8s linear infinite; }
      @keyframes mspin { to { transform:rotate(360deg); } }
      .m-err { background:#fbe9ee; border:1px solid #efb4c4; color:#8a1d3c; border-radius:8px; padding:8px 10px; font-size:13px; margin:8px 0; white-space:pre-wrap; }
      .m-ok { background:#e2f3ec; border:1px solid #9fd6bd; color:#15634e; border-radius:8px; padding:10px 12px; font-size:14px; margin:8px 0; }
      .m-sig { color:var(--muted); font-size:12.5px; white-space:pre-wrap; margin-top:4px; }
      .m-thumb { width:100%; max-height:160px; object-fit:cover; border-radius:8px; border:1px solid var(--line); margin-bottom:8px; }
      .m-filelabel { display:block; border:2px dashed #bcc8d0; border-radius:12px; padding:18px; text-align:center; font-weight:700; cursor:pointer; background:#fff; }
      .m-filelabel + .m-filelabel { margin-top:8px; background:#f4f7f8; }
      .m-filelabel input { display:none; }
      .m-mic { display:block; width:100%; margin-bottom:10px; padding:18px; border-radius:12px; border:2px solid var(--pink); background:var(--pink); color:#fff; font-weight:800; font-size:16px; }
      .m-mic.rec { background:#fff; color:var(--pink); animation:mpulse 1.2s ease-in-out infinite; }
      .m-mic.small { width:auto; padding:10px 14px; font-size:14px; margin:0; }
      .m-mic:disabled { opacity:.6; }
      @keyframes mpulse { 0%,100% { box-shadow:0 0 0 0 rgba(212,39,100,.35); } 50% { box-shadow:0 0 0 10px rgba(212,39,100,0); } }
      .m-voice { margin-top:10px; }
      .m-voice .m-mic { margin-bottom:4px; padding:14px; }
      .m-hint { font-size:13px; color:var(--muted); margin:4px 0 10px; line-height:1.4; }
      .m-letter { border:1px solid #dfe5e9; border-radius:12px; padding:10px; margin-top:10px; background:#fff; }
      .m-letter-head { font-size:13px; color:var(--muted); margin-bottom:6px; }
      .m-letter input { width:100%; font-weight:700; margin-bottom:6px; }
      .m-letter textarea { width:100%; }
      .m-when { margin-top:10px; }
      .m-when-row { display:flex; gap:6px; align-items:center; flex-wrap:wrap; }
      .m-when-row button { padding:8px 12px; font-size:13px; }
      .m-when-row button.on { background:var(--ink); color:#fff; border-color:var(--ink); }
      .m-when-row input[type=date] { flex:1; min-width:140px; padding:8px; }

      /* План залов */
      .m-floor { background:#fff; border:1px solid var(--line); border-radius:14px; padding:14px; margin-bottom:12px; }
      .m-floor h2 { margin:0 0 4px; font-size:18px; }
      .m-floor .sub { color:var(--muted); font-size:13px; margin-bottom:10px; }
      .m-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(64px,1fr)); gap:6px; }
      .m-tile { border:1px solid var(--line); border-radius:8px; padding:6px 4px; text-align:center; background:#fff; cursor:pointer; min-height:54px; display:flex; flex-direction:column; justify-content:center; }
      .m-tile b { font-size:15px; display:block; }
      .m-tile span { display:block; font-size:9.5px; color:var(--muted); line-height:1.15; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .m-tile.talked { background:#d9eee5; border-color:#8fc9b5; }
      .m-tile.revisit { background:#fbefc9; border-color:#e3c46d; }
      .m-tile.skip { background:#eef1f3; color:#9aa6b0; }
      .m-tile.pA { box-shadow: inset 0 0 0 2px var(--pink); }
      .m-tile.mail::after { content:"✉"; font-size:10px; color:#1d4f7a; }
      .m-tile.dim { opacity:.16; }
      .m-legend { display:flex; gap:10px; flex-wrap:wrap; font-size:12px; color:var(--muted); margin-bottom:10px; }
      .m-legend i { display:inline-block; width:12px; height:12px; border-radius:3px; vertical-align:-2px; margin-right:4px; border:1px solid var(--line); }

      .m-fab { position:fixed; right:14px; bottom:max(16px, env(safe-area-inset-bottom)); z-index:6; background:var(--ink); color:#fff; border:none; border-radius:999px; padding:12px 16px; font-weight:700; box-shadow:0 6px 20px rgba(21,39,60,.3); }
    `}</style>
  );
}
