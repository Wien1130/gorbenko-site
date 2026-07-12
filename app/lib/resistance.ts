import { fetchCsv } from "./github-csv";
import type { LeadRow } from "./cold-leads";

const RESISTANCE_PATH = "knowledge/resistance_log.csv";
const BOT_REPLY = "Ты назвал страх словами — это уже половина дела. Теперь просто зайди. Дальше он станет тише.";
const MATCH_WINDOW_MS = 3 * 60 * 60 * 1000; // 3 часа — считаем, что заход после записи страха с ним связан

export const BUSINESS_TYPE_LABELS: Record<string, string> = {
  restaurant: "🍽️ ресторан",
  cafe: "☕ кофейня",
  shop: "🛍️ магазин",
  gallery: "🖼️ галерея",
  other: "🏢 бизнес",
};

export interface ResistanceEntry {
  timestamp: string;
  text: string;
}

export interface ResistanceWithContext extends ResistanceEntry {
  botReply: string;
  matchedBusiness: string | null; // название (только для private) или null
  matchedBusinessType: string | null; // анонимный тип — можно показывать публично
  overcame: boolean; // нашёлся ли заход сразу после записи страха
}

export async function fetchResistanceLog(): Promise<ResistanceEntry[]> {
  return fetchCsv<ResistanceEntry>(RESISTANCE_PATH);
}

/** Привязывает каждую запись страха к ближайшему заходу, случившемуся сразу после неё (тот самый "преодолел и зашёл"). */
export function matchResistanceContext(entries: ResistanceEntry[], rows: LeadRow[]): ResistanceWithContext[] {
  const withTs = rows
    .filter((r) => r.timestamp)
    .map((r) => ({ row: r, ts: new Date(r.timestamp).getTime() }))
    .filter((r) => !Number.isNaN(r.ts))
    .sort((a, b) => a.ts - b.ts);

  return entries.map((entry) => {
    const entryTs = new Date(entry.timestamp).getTime();
    let matched: LeadRow | null = null;
    if (!Number.isNaN(entryTs)) {
      for (const { row, ts } of withTs) {
        if (ts >= entryTs && ts - entryTs <= MATCH_WINDOW_MS) {
          matched = row;
          break;
        }
      }
    }
    return {
      ...entry,
      botReply: BOT_REPLY,
      matchedBusiness: matched?.business_name || null,
      matchedBusinessType: matched ? BUSINESS_TYPE_LABELS[matched.business_type] || BUSINESS_TYPE_LABELS.other : null,
      overcame: !!matched,
    };
  });
}
