/**
 * Секрет в ссылке: /angebot/<slug>?k=…
 * Задаётся через ANGEBOT_KEY (Vercel env). В проде без ключа — страница закрыта.
 * Локально без env — dev-angebot, чтобы собирать и проверять.
 */
export function angebotKey(): string {
  if (process.env.ANGEBOT_KEY) return process.env.ANGEBOT_KEY;
  if (process.env.NODE_ENV !== "production") return "dev-angebot";
  return "";
}

export function isValidAngebotKey(k: string | undefined | null): boolean {
  const expected = angebotKey();
  if (!expected || !k) return false;
  return k === expected;
}
