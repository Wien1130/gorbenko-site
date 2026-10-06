import { createHash } from "crypto";

/**
 * Пароль страницы /bi-markt.
 *
 * Задаётся ТОЛЬКО через env BI_MARKT_PASSWORD (Vercel → Settings → Environment
 * Variables). Дефолта в коде нет намеренно: репозиторий публичный, поэтому
 * любой фолбэк здесь стал бы опубликованным паролем. Если переменная не
 * задана — страница закрыта для всех (fail closed).
 */
export const BI_MARKT_PASSWORD = process.env.BI_MARKT_PASSWORD ?? "";

export const BI_MARKT_COOKIE = "gorbenko_bimarkt_auth";

/** Пароль вообще настроен на этом окружении. */
export function biMarktConfigured(): boolean {
  return BI_MARKT_PASSWORD.length > 0;
}

/** Токен, который кладётся в HttpOnly-cookie после ввода пароля. */
export function biMarktToken(): string {
  return createHash("sha256")
    .update(BI_MARKT_PASSWORD + ":gorbenko-bimarkt-v1")
    .digest("hex");
}
