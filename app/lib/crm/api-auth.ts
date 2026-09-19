import { cookies } from "next/headers";
import { CRM_COOKIE, crmToken } from "../crm-auth";

/** Проверка CRM-cookie в API-роутах. Возвращает true если авторизован. */
export async function isCrmAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(CRM_COOKIE)?.value === crmToken();
}

export function unauthorized(): Response {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}
