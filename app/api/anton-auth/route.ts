import { NextRequest, NextResponse } from "next/server";
import { ANTON_COOKIE, ANTON_PASSWORD, antonToken } from "../../lib/anton-auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/anton");
  const target = next.startsWith("/anton") ? next : "/anton";

  if (password !== ANTON_PASSWORD) {
    const url = new URL("/anton/login", req.url);
    url.searchParams.set("next", target);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const res = NextResponse.redirect(new URL(target, req.url), 303);
  res.cookies.set(ANTON_COOKIE, antonToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/anton",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
