import type { Exhibitor } from "./data";

/** Составной номер (B.l90, C.g10-P11) не прогоняем через Number: латинская l не становится 1. */
function legacyBoothParts(raw: string): { prefix: string; num: string; suffix: string } | null {
  if (/[.\-]/.test(raw)) return null;
  const m = raw.trim().toLowerCase().replace(/[\s]+/g, "").match(/^([a-zäöü]*)(\d+)([a-zäöü]*)$/);
  if (!m) return null;
  return { prefix: m[1], num: String(Number(m[2])), suffix: m[3] };
}

/** Поиск стенда. Точки и дефисы сохраняются. «18» по-прежнему находит «018», но не «118». */
export function matchBooth(query: string, booth: string): boolean {
  const q = query.trim().toLowerCase();
  const b = booth.trim().toLowerCase();
  if (!q || !b) return false;
  if (q.includes(".") || b.includes(".") || q.includes("-") || b.includes("-")) return b.includes(q);
  const qp = legacyBoothParts(query);
  const bp = legacyBoothParts(booth);
  if (qp && bp) {
    if (qp.num !== bp.num) return false;
    if (qp.prefix && qp.prefix !== bp.prefix) return false;
    if (qp.suffix && qp.suffix !== bp.suffix) return false;
    return true;
  }
  return b.includes(q);
}

export function isBoothQuery(query: string): boolean {
  const q = query.trim();
  if (!q) return false;
  if ((q.includes(".") || q.includes("-")) && /\d/.test(q)) return true;
  return legacyBoothParts(q) !== null;
}

export function boothsOf(row: Pick<Exhibitor, "booth" | "booths">): string[] {
  const extra = (row.booths ?? []).filter((b) => b && b !== row.booth);
  return [row.booth, ...extra].filter(Boolean);
}

/**
 * Состав вкладки. Неизвестный id при strictTabs пустой: иначе новая вкладка
 * молча показывала бы весь список, включая чужую сортировку.
 */
export function exhibitorsForTab(
  tabId: string,
  ordered: Exhibitor[],
  all: Exhibitor[],
  route1: string[],
  strict: boolean,
): Exhibitor[] {
  const byId = new Map(all.map((r) => [r.id, r]));
  const first = route1.map((id) => byId.get(id)).filter((r): r is Exhibitor => !!r);
  if (tabId === "all" || tabId === "route") return ordered;
  if (tabId === "first") return first;
  if (tabId === "vienna") return ordered.filter((r) => r.city.startsWith("Wien") || r.city.includes("Вена"));
  if (tabId === "munich") return ordered.filter((r) => r.city === "München");
  if (tabId === "three") return ordered.filter((r) => r.services.some((s) => s === "3D" || s === "конфигуратор") || r.configurator_fit === "yes");
  if (tabId === "video") return ordered.filter((r) => r.services.includes("видео"));
  if (tabId === "pages") return ordered.filter((r) => r.services.includes("проект"));
  if (tabId === "ru") return ordered.filter((r) => r.language_group === "RU-public" || r.name_cue === "ru-ua");
  if (tabId === "de") return ordered.filter((r) => r.language_group === "DE-market");
  if (tabId === "en") return ordered.filter((r) => r.language_group === "EN");
  if (tabId === "lang-unknown") return ordered.filter((r) => !r.language_group || r.language_group === "unknown");
  return strict ? [] : ordered;
}

const SPOKEN_LINE = /^Язык разговора: (DE|EN|RU)$/;

export function readSpoken(note: string): "" | "de" | "en" | "ru" {
  for (const line of (note || "").split("\n")) {
    const m = line.trim().match(SPOKEN_LINE);
    if (!m) continue;
    if (m[1] === "DE") return "de";
    if (m[1] === "EN") return "en";
    return "ru";
  }
  return "";
}

export function stripSpoken(note: string): string {
  return (note || "")
    .split("\n")
    .filter((line) => !SPOKEN_LINE.test(line.trim()))
    .join("\n")
    .trim();
}

export function withSpoken(note: string, lang: "" | "de" | "en" | "ru"): string {
  const body = stripSpoken(note);
  if (!lang) return body;
  const label = lang === "de" ? "DE" : lang === "en" ? "EN" : "RU";
  return body ? `Язык разговора: ${label}\n${body}` : `Язык разговора: ${label}`;
}
