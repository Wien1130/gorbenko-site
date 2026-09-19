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
  created_at: string;
  updated_at: string;
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

export const BUSINESS_TYPE_OPTIONS: { value: BusinessType; label: string }[] = [
  { value: "restaurant", label: "Ресторан" },
  { value: "cafe", label: "Кафе" },
  { value: "shop", label: "Магазин" },
  { value: "gallery", label: "Галерея" },
  { value: "other", label: "Другое" },
];
