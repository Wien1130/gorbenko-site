import { createHash } from "crypto";

export const ANDRII_PASSWORD = process.env.ANDRII_PASSWORD ?? "dachmillion";
export const ANDRII_COOKIE = "gorbenko_andrii_auth";

export function andriiToken(): string {
  return createHash("sha256")
    .update(ANDRII_PASSWORD + ":gorbenko-andrii-v1")
    .digest("hex");
}
