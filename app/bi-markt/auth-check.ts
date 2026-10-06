import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  BI_MARKT_COOKIE,
  biMarktConfigured,
  biMarktToken,
} from "../lib/bi-markt-auth";

export async function requireBiMarktAuth(currentPath: string) {
  const store = await cookies();
  const cookie = store.get(BI_MARKT_COOKIE)?.value;
  if (!biMarktConfigured() || cookie !== biMarktToken()) {
    redirect(`/bi-markt/login?next=${encodeURIComponent(currentPath)}`);
  }
}
