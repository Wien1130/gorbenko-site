import { createHash } from "crypto";

/** Пароль для приватной CRM /crm. Меняется через env CRM_PASSWORD на Vercel. */
export const CRM_PASSWORD = process.env.CRM_PASSWORD ?? "coldsales2026";

export const CRM_COOKIE = "gorbenko_crm_auth";

export function crmToken(): string {
  return createHash("sha256")
    .update(CRM_PASSWORD + ":gorbenko-crm-v1")
    .digest("hex");
}
