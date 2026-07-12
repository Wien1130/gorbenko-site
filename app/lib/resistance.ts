import { fetchCsv } from "./github-csv";

const RESISTANCE_PATH = "knowledge/resistance_log.csv";

export interface ResistanceEntry {
  timestamp: string;
  text: string;
}

export async function fetchResistanceLog(): Promise<ResistanceEntry[]> {
  return fetchCsv<ResistanceEntry>(RESISTANCE_PATH);
}
