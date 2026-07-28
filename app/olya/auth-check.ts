import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OLYA_COOKIE, olyaToken } from "../lib/olya-auth";

export async function requireOlyaAuth(currentPath: string) {
  const store = await cookies();
  const cookie = store.get(OLYA_COOKIE)?.value;
  if (cookie !== olyaToken()) {
    const url = `/olya/login?next=${encodeURIComponent(currentPath)}`;
    redirect(url);
  }
}
