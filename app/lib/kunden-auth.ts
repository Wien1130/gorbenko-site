import { createHash } from "crypto";

const SLUG = /^[a-z0-9-]{2,30}$/;

export function isClientSlug(client: string): boolean {
  return SLUG.test(client);
}

export function KUNDEN_COOKIE(client: string): string {
  return "gorbenko_kunden_" + client;
}

export function kundenPassword(client: string): string {
  return process.env["KUNDEN_PASSWORD_" + client.toUpperCase()] ?? "";
}

export function kundenToken(client: string): string {
  return createHash("sha256")
    .update(kundenPassword(client) + ":gorbenko-kunden-v1:" + client)
    .digest("hex");
}

/** Stay on this client's tree. Anything else falls back to the report. */
export function kundenNext(client: string, next: string): string {
  const base = `/kunden/${client}`;
  if (next === base || next.startsWith(`${base}/`) || next.startsWith(`${base}?`)) return next;
  return base;
}
