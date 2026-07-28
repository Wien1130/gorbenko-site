import { NextRequest, NextResponse } from "next/server";
import { ANDRII_COOKIE, ANDRII_PASSWORD, andriiToken } from "../../lib/andrii-auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/andrii");
  const target = next.startsWith("/andrii") ? next : "/andrii";

  if (password !== ANDRII_PASSWORD) {
    const url = new URL("/andrii/login", req.url);
    url.searchParams.set("next", target);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const res = NextResponse.redirect(new URL(target, req.url), 303);
  res.cookies.set(ANDRII_COOKIE, andriiToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/andrii",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
