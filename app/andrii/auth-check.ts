import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ANDRII_COOKIE, andriiToken } from "../lib/andrii-auth";

export async function requireAndriiAuth(currentPath: string) {
  const store = await cookies();
  const cookie = store.get(ANDRII_COOKIE)?.value;
  if (cookie !== andriiToken()) {
    const url = `/andrii/login?next=${encodeURIComponent(currentPath)}`;
    redirect(url);
  }
}
