import { NextRequest, NextResponse } from "next/server";
import { CRM_COOKIE, CRM_PASSWORD, crmToken } from "../../lib/crm-auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/crm/login");

  const target = next.startsWith("/") ? next : "/crm/login";

  if (password !== CRM_PASSWORD) {
    const url = new URL("/crm/login", req.url);
    url.searchParams.set("next", target);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const res = NextResponse.redirect(new URL(target, req.url), 303);
  res.cookies.set(CRM_COOKIE, crmToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
