import { NextRequest, NextResponse } from "next/server";
import {
  REPORTS_COOKIE,
  REPORTS_PASSWORD,
  reportsToken,
} from "../../lib/reports-auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/reports/login");

  // Открытый redirect наружу не допускаем — только свои пути.
  const target = next.startsWith("/") ? next : "/reports/login";

  if (password !== REPORTS_PASSWORD) {
    const url = new URL("/reports/login", req.url);
    url.searchParams.set("next", target);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const res = NextResponse.redirect(new URL(target, req.url), 303);
  res.cookies.set(REPORTS_COOKIE, reportsToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/reports",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
