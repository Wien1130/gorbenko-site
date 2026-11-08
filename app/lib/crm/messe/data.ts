import blickfangRaw from "./blickfang-2026.json";
import ersteRaw from "./erste-wohnmesse-2026.json";

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
  /** Поля браузерной проверки 07.11.2026 (добавляются tools/merge.py; могут отсутствовать) */
  verified?: boolean;
  content_fit?: string;
  configurator_fit?: string;
  geography_confidence?: string;
  evidence_short?: string[];
  mobile_note?: string;
  unresolved?: string[];
  /** Сигналы размера/платёжеспособности с сайта (юрлицо, UID, дилеры, чек, магазин). 0 = сигналов нет. */
  /** Имя владельца / Geschäftsführer из импрессума сайта (эвристика по скачанному тексту, 07.11). */
  imprint_name?: string;
  imprint_name_src?: string;
  size_score?: number;
  size_note?: string;
  route1_score?: number;
  /** Кого искать по каталогу. Это не человек, с которым уже поговорили. */
  ask_who?: string;
  /** Насколько разобрана карточка: частично или только каталог. */
  review_label?: string;
  sources?: string[];
}

export interface FairTab {
  id: string;
  label: string;
  note: string;
}

export interface FairData {
  event: string;
  title: string;
  date: string;
  route: string[];
  /** «Маршрут 1» у BLICKFANG. У другой выставки — список «сначала». */
  route1?: string[];
  rows: Exhibitor[];
  venue?: string;
  address?: string;
  dateLabel?: string;
  hours?: string;
  catalogUrl?: string;
  /** floors = EG/OG BLICKFANG. zones = группы стендов без выдуманной карты. */
  layout?: "floors" | "zones";
  talkDateLabel?: string;
  profileLinkLabel?: string;
  headerSub?: string;
  allTab?: string;
  tabs?: FairTab[];
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
  /** Пути фото стенда в репозитории. Показ через /api/crm/messe/photo. */
  photos?: string[];
}

const blickfang = blickfangRaw as FairData;
const erste = ersteRaw as FairData;

export const FAIRS: Record<string, FairData> = {
  "blickfang-2026": {
    ...blickfang,
    venue: "MAK Wien",
    address: "MAK, Wien",
    dateLabel: "7–8 ноября 2026",
    catalogUrl: "https://blickfang.com/wp-content/uploads/Blickfang-2026-Wien-Katalog-165x210mm-web.pdf",
    layout: "floors",
    talkDateLabel: "Samstag, 07.11.2026",
    profileLinkLabel: "Профиль BLICKFANG",
    headerSub: "Мюнхен → Вена → остальные. Статусы и лиды сохраняются в CRM.",
    allTab: "route",
  },
  "erste-wohnmesse-2026": erste,
};

export function getFair(event?: string | null): FairData {
  if (event && FAIRS[event]) return FAIRS[event];
  return FAIRS["blickfang-2026"];
}

export const FAIR: FairData = FAIRS["blickfang-2026"];

export const FAIR_SWITCH = [
  { event: "blickfang-2026", title: "BLICKFANG" },
  { event: "erste-wohnmesse-2026", title: "Erste Wohnmesse" },
] as const;

export const VISIT_STATUS_LABEL: Record<VisitStatus, string> = {
  todo: "Не посещён",
  talked: "Поговорил",
  revisit: "Вернуться",
  skip: "Пропустить",
};
