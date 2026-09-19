import { createHash } from "crypto";

/** Пароль для /anton. На Vercel — env ANTON_PASSWORD. */
export const ANTON_PASSWORD = process.env.ANTON_PASSWORD ?? "Creatore41";
export const ANTON_COOKIE = "gorbenko_anton_auth";

export function antonToken(): string {
  return createHash("sha256")
    .update(ANTON_PASSWORD + ":gorbenko-anton-v1")
    .digest("hex");
}
