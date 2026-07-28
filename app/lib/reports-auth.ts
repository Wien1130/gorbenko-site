import { createHash } from "crypto";

/** Пароль для раздела /reports. Меняется через env REPORTS_PASSWORD на Vercel. */
export const REPORTS_PASSWORD = process.env.REPORTS_PASSWORD ?? "blinhaus2026";

export const REPORTS_COOKIE = "gorbenko_reports_auth";

/** Токен, который кладётся в HttpOnly-cookie после ввода пароля. */
export function reportsToken(): string {
  return createHash("sha256")
    .update(REPORTS_PASSWORD + ":gorbenko-reports-v1")
    .digest("hex");
}
