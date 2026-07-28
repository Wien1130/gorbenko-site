import { NextRequest, NextResponse } from "next/server";
import { OLYA_COOKIE, OLYA_PASSWORD, olyaToken } from "../../lib/olya-auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/olya");
  const target = next.startsWith("/olya") ? next : "/olya";

  if (password !== OLYA_PASSWORD) {
    const url = new URL("/olya/login", req.url);
    url.searchParams.set("next", target);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const res = NextResponse.redirect(new URL(target, req.url), 303);
  res.cookies.set(OLYA_COOKIE, olyaToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/olya",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
