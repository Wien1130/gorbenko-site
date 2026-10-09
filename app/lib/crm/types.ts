import { STAGE_ORDER, type Stage } from "../cold-leads-stats";

export { STAGE_ORDER };
export type { Stage };

export type BusinessType = "restaurant" | "cafe" | "shop" | "gallery" | "other";
export type EntryType = "cold_touch" | "followup";
export type ActivityKind = "visit" | "note" | "email" | "call";

export interface Lead {
  id: number;
  business_name: string;
  business_type: BusinessType;
  stage: Stage;
  address: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  next_action: string;
  meeting_datetime: string;
  deal_amount: number;
  notes: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
  updated_at: string;
}

export interface WorkSession {
  id: number;
  started_at: string;
  ended_at: string | null;
}

export interface DayStats {
  day: string; // YYYY-MM-DD по Вене
  hours: number;
  visits: number;
  followups: number;
  emails: number;
}

export interface MapPoint {
  id: number;
  business_name: string;
  stage: string;
  lat: number;
  lng: number;
  address: string;
  first_visit: string;
  visit_day: string;
}

export interface Activity {
  id: number;
  lead_id: number;
  kind: ActivityKind;
  entry_type: EntryType;
  stage_after: string;
  transcript: string;
  summary: string;
  photo_url: string;
  created_at: string;
}

export interface Reminder {
  id: number;
  lead_id: number | null;
  due_at: string;
  text: string;
  status: "pending" | "notified" | "done";
  created_at: string;
  business_name?: string;
}

export interface EmailRecord {
  id: number;
  lead_id: number;
  to_email: string;
  subject: string;
  body: string;
  lang: "ru" | "de";
  status: string;
  gmail_id: string;
  created_at: string;
}

/** Что вернул Claude после разбора захода — предложение, которое юзер подтверждает на экране. */
export interface VisitProposal {
  matched_lead_id: number | null;
  business_name: string;
  business_type: BusinessType;
  stage: Stage;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  next_action: string;
  /** ISO date (YYYY-MM-DD) когда напомнить о next_action, или "" */
  reminder_date: string;
  reminder_text: string;
  /** строго YYYY-MM-DD HH:MM если stage=meeting_confirmed, иначе свободный текст/"" */
  meeting_datetime: string;
  deal_amount: number;
  /** 1-2 предложения: что произошло */
  summary: string;
}

// ---------- Персональная страница (pitch) ----------

export type PitchFocus = "catering" | "gastro" | "general";

/** Структура контента персональной страницы — строго то, что генерирует Claude (DE). */
export interface PitchContent {
  headline: string;
  subline: string;
  /** Что Андрей увидел/услышал на месте — ТОЛЬКО из заметок, 0–4 пункта */
  observed: string[];
  proposals: { title: string; text: string }[];
  why_me: string;
  next_step: string;
  /** Текст, который клиент отправит в WhatsApp одним тапом */
  whatsapp_text: string;
  /** 1 предложение по-русски для Андрея: что на странице */
  summary_ru: string;
}

export interface Pitch {
  id: number;
  lead_id: number;
  slug: string;
  focus: PitchFocus;
  lang: "de";
  content: PitchContent;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface PitchEvent {
  id: number;
  pitch_id: number;
  kind: "view" | "cta_whatsapp" | "cta_call" | "cta_site" | "form";
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
  user_agent: string;
  payload: Record<string, string> | null;
  created_at: string;
}

export const PITCH_FOCUS_OPTIONS: { value: PitchFocus; label: string }[] = [
  { value: "catering", label: "Кейтеринг" },
  { value: "gastro", label: "Ресторан / кафе" },
  { value: "general", label: "Общий" },
];

export const BUSINESS_TYPE_OPTIONS: { value: BusinessType; label: string }[] = [
  { value: "restaurant", label: "Ресторан" },
  { value: "cafe", label: "Кафе" },
  { value: "shop", label: "Магазин" },
  { value: "gallery", label: "Галерея" },
  { value: "other", label: "Другое" },
];
