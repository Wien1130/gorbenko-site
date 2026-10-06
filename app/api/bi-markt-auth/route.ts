import { NextRequest, NextResponse } from "next/server";
import {
  BI_MARKT_COOKIE,
  BI_MARKT_PASSWORD,
  biMarktConfigured,
  biMarktToken,
} from "../../lib/bi-markt-auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/bi-markt");
  const target = next.startsWith("/bi-markt") ? next : "/bi-markt";

  if (!biMarktConfigured() || password !== BI_MARKT_PASSWORD) {
    const url = new URL("/bi-markt/login", req.url);
    url.searchParams.set("next", target);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const res = NextResponse.redirect(new URL(target, req.url), 303);
  res.cookies.set(BI_MARKT_COOKIE, biMarktToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/bi-markt",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
