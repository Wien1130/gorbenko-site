import blickfangRaw from "./blickfang-2026.json";
import ersteRaw from "./erste-wohnmesse-2026.json";
import enlitRaw from "./enlit-europe-2026.json";

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
  /** Профиль Instagram, снятый со ссылки на сайте при обходе. Посты и reels сюда не пишутся. */
  instagram?: string;
  email: string;
  rank: number | null;
  profile_url: string;
  fetch_status: string;
  /** Все места стенда. id компании не склеивается по номеру: A.a40 — несколько карточек. */
  booths?: string[];
  /** RU-public / DE-market / EN / unknown. Это не язык конкретного сотрудника. */
  language_group?: string;
  /** ru-ua: имя на публичном профиле похоже на русское или украинское. Язык человека не доказан. */
  name_cue?: string;
  language_evidence?: string;
  personal_language_confirmed?: boolean;
  checked_at?: string;
  review_depth?: string;
  site_quality?: string;
  /** shortlist — отобранные заранее; catalog — только строка каталога; reviewed — отдельно проверенные. */
  tier?: "shortlist" | "catalog" | "reviewed";
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
  /** floors = EG/OG BLICKFANG. zones = группы стендов. halls = залы без координат на карте. */
  layout?: "floors" | "zones" | "halls";
  talkDateLabel?: string;
  profileLinkLabel?: string;
  headerSub?: string;
  allTab?: string;
  tabs?: FairTab[];
  mapUrl?: string;
  /** Неизвестный id вкладки не подменяется всем списком. */
  strictTabs?: boolean;
  /** Черновик письма можно собрать на DE, EN или RU. EN отправляющий слой не шлёт. */
  letterLangs?: boolean;
  /** Дата разговора берётся в день визита, а не из фиксированной подписи вроде Mittwoch. */
  flexibleTalkDate?: boolean;
  trackSpokenLang?: boolean;
  showShortlistCount?: boolean;
  searchPlaceholder?: string;
  planNote?: string;
  dateStart?: string;
  dateEnd?: string;
  /** Часы только для дат, которые реально сверены. Остальные дни не дописывать. */
  hoursByDate?: Record<string, string>;
  visitPlan?: FairVisitPlan;
}

export interface FairVisitPlan {
  validOn: string;
  title: string;
  note: string;
  ruFirst: string[];
  ruFirstNote: string;
  steps: { hall: string; when: string; ids: string[]; note: string }[];
  happyHour?: { booth: string; when: string; note: string; url?: string };
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
const enlit = enlitRaw as FairData;

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
  "enlit-europe-2026": enlit,
};

export function getFair(event?: string | null): FairData {
  if (event && FAIRS[event]) return FAIRS[event];
  return FAIRS["blickfang-2026"];
}

export const FAIR: FairData = FAIRS["blickfang-2026"];

export const FAIR_SWITCH = [
  { event: "blickfang-2026", title: "BLICKFANG" },
  { event: "erste-wohnmesse-2026", title: "Erste Wohnmesse" },
  { event: "enlit-europe-2026", title: "Enlit" },
] as const;

export const VISIT_STATUS_LABEL: Record<VisitStatus, string> = {
  todo: "Не посещён",
  talked: "Поговорил",
  revisit: "Вернуться",
  skip: "Пропустить",
};
