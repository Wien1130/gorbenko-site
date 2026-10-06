"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

type ZoneKey = "brust" | "taille" | "huefte";

const BODY_PATH =
  "M130,16 C144,16 153,28 153,44 C153,58 146,69 138,75 L137,88 " +
  "C150,92 174,95 186,102 C196,107 201,116 204,138 C207,160 209,178 211,196 " +
  "C213,214 215,236 216,258 C217,272 218,286 220,300 C222,312 220,322 214,326 " +
  "C208,330 203,324 202,314 " +
  "C200,292 198,268 196,248 C194,228 192,212 190,198 C187,176 184,156 180,140 L176,130 " +
  "C171,152 167,170 166,190 C166,208 172,220 177,232 " +
  "C180,252 178,280 174,306 C170,330 165,348 162,366 C158,390 155,414 152,434 L150,452 " +
  "C149,462 152,468 160,472 L162,478 C155,482 145,482 141,477 L140,456 " +
  "C141,430 141,402 140,376 C139,350 137,318 135,296 C134,284 132,274 130,266 " +
  "C128,274 126,284 125,296 C123,318 121,350 120,376 C119,402 119,430 120,456 L119,477 " +
  "C115,482 105,482 98,478 L100,472 C108,468 111,462 110,452 L108,434 " +
  "C105,414 102,390 98,366 C95,348 90,330 86,306 C82,280 80,252 83,232 " +
  "C88,220 94,208 94,190 C93,170 89,152 84,130 L80,140 " +
  "C76,156 73,176 70,198 C68,212 66,228 64,248 C62,268 60,292 58,314 " +
  "C57,324 52,330 46,326 C40,322 38,312 40,300 C42,286 43,272 44,258 " +
  "C45,236 47,214 49,196 C51,178 53,160 56,138 C59,116 64,107 74,102 " +
  "C86,95 110,92 123,88 L122,75 C114,69 107,58 107,44 C107,28 116,16 130,16 Z";

const ZONES: {
  key: ZoneKey;
  label: string;
  tip: string;
  y: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}[] = [
  {
    key: "brust",
    label: "Brust",
    tip: "Brustumfang — waagrecht über die breiteste Stelle.",
    y: 140,
    cx: 130,
    cy: 140,
    rx: 48,
    ry: 9,
  },
  {
    key: "taille",
    label: "Taille",
    tip: "Taillenumfang — schmalste Stelle, normal atmen.",
    y: 191,
    cx: 130,
    cy: 191,
    rx: 36,
    ry: 7,
  },
  {
    key: "huefte",
    label: "Hüfte",
    tip: "Hüftumfang — breiteste Stelle über dem Gesäß.",
    y: 227,
    cx: 130,
    cy: 227,
    rx: 46,
    ry: 9,
  },
];

/** Interactive Maß silhouette — simplified port of Rubberik MassTeaser (3 zones). */
export default function MassFigureDemo({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<ZoneKey>("brust");
  const [hovering, setHovering] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (hovering || reduceMotion) return;
    const id = window.setInterval(() => {
      setActiveKey((current) => {
        const idx = ZONES.findIndex((z) => z.key === current);
        return ZONES[(idx + 1) % ZONES.length].key;
      });
    }, 2200);
    return () => window.clearInterval(id);
  }, [hovering, reduceMotion]);

  const active = ZONES.find((z) => z.key === activeKey) ?? ZONES[0];

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;

    if (!reduceMotion) {
      setTilt({
        x: Math.max(-1, Math.min(1, ny)) * 4,
        y: Math.max(-1, Math.min(1, nx)) * -6,
      });
    }

    const viewY = ((event.clientY - rect.top) / rect.height) * 520;
    let nearest: ZoneKey = ZONES[0].key;
    let best = Infinity;
    for (const zone of ZONES) {
      const distance = Math.abs(zone.y - viewY);
      if (distance < best) {
        best = distance;
        nearest = zone.key;
      }
    }
    setActiveKey(nearest);
  };

  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] ${className}`}
    >
      <div
        ref={stageRef}
        onPointerEnter={() => setHovering(true)}
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          setHovering(false);
          setTilt({ x: 0, y: 0 });
        }}
        className={`flex flex-col items-center gap-8 px-6 py-10 sm:flex-row sm:items-center sm:gap-10 sm:px-10 ${
          compact ? "lg:gap-10" : "lg:gap-14"
        }`}
      >
        <div className="flex shrink-0 flex-col items-center sm:flex-row sm:items-center sm:gap-4">
          <div
            style={{
              transform: reduceMotion
                ? undefined
                : `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: hovering ? "transform 80ms linear" : "transform 500ms ease-out",
            }}
          >
            <svg
              viewBox="0 0 260 520"
              role="img"
              aria-label={`Maßfigur — aktiv: ${active.label}`}
              className={compact ? "h-[220px] w-auto md:h-[280px]" : "h-[240px] w-auto md:h-[320px]"}
            >
              <style>{`
                .mass-demo-pulse{animation:mass-demo-draw .55s ease-out forwards,mass-demo-pulse 1.8s ease-in-out .55s infinite}
                @keyframes mass-demo-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
                @keyframes mass-demo-pulse{0%,100%{opacity:1}50%{opacity:.45}}
                @media (prefers-reduced-motion:reduce){
                  .mass-demo-pulse{animation:none;stroke-dashoffset:0;opacity:1}
                }
              `}</style>
              <path
                d={BODY_PATH}
                fill="var(--foreground)"
                fillOpacity={0.06}
                stroke="var(--muted)"
                strokeOpacity={0.45}
                strokeWidth={1.1}
              />
              {ZONES.map((zone) => {
                const isActive = zone.key === activeKey;
                return (
                  <ellipse
                    key={zone.key}
                    cx={zone.cx}
                    cy={zone.cy}
                    rx={zone.rx}
                    ry={zone.ry}
                    fill="none"
                    stroke={isActive ? "var(--accent)" : "var(--muted)"}
                    strokeWidth={isActive ? 2.4 : 1}
                    opacity={isActive ? 1 : 0.28}
                    pathLength={1}
                    strokeDasharray={isActive && !reduceMotion ? "1" : undefined}
                    className={isActive && !reduceMotion ? "mass-demo-pulse" : undefined}
                  />
                );
              })}
            </svg>
          </div>
          <p className="mt-3 w-16 text-center text-[10px] uppercase tracking-[0.22em] text-[var(--accent)] sm:mt-0 sm:text-left">
            {active.label}
          </p>
        </div>

        <div className="flex min-w-0 flex-col items-start gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
            Interaktiv
          </p>
          <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
            Maße verstehen — ohne E-Mail-Pingpong
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-[var(--muted)]">
            {active.tip}
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {ZONES.map((zone) => (
              <button
                key={zone.key}
                type="button"
                onClick={() => setActiveKey(zone.key)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  zone.key === activeKey
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40"
                }`}
              >
                {zone.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
            Interaktives Beispiel aus einem Shop in Arbeit — so erklärt der
            Konfigurator Maße.
          </p>
        </div>
      </div>
    </div>
  );
}
