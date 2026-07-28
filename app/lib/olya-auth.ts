import { createHash } from "crypto";

export const OLYA_PASSWORD = process.env.OLYA_PASSWORD ?? "nesmotrivglaza";
export const OLYA_COOKIE = "gorbenko_olya_auth";

export function olyaToken(): string {
  return createHash("sha256")
    .update(OLYA_PASSWORD + ":gorbenko-olya-v1")
    .digest("hex");
}
