import raw from "./blickfang-2026.json";

/** Один участник выставки — срез скрининга (статичные данные, см. ~/Documents/Codex/.../BLICKFANG-2026-leads.json). */
export interface Exhibitor {
  id: string;
  name: string;
  booth: string;
  floor: string;
  category: string;
  city: string;
  priority: string;
  site_priority: string;
  services: string[];
  offer: string;
  opening_de: string;
  observed: string;
  hypothesis: string;
  website: string;
  email: string;
  rank: number | null;
  profile_url: string;
  fetch_status: string;
}

export interface FairData {
  event: string;
  title: string;
  date: string;
  route: string[];
  rows: Exhibitor[];
}

export type VisitStatus = "todo" | "talked" | "revisit" | "skip";

export interface FairVisit {
  event: string;
  exhibitor_id: string;
  status: VisitStatus;
  note: string;
  lead_id: number | null;
  email_sent: boolean;
  updated_at: string;
}

export const FAIR: FairData = raw as FairData;

export const VISIT_STATUS_LABEL: Record<VisitStatus, string> = {
  todo: "Не посещён",
  talked: "Поговорил",
  revisit: "Вернуться",
  skip: "Пропустить",
};
