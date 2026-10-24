import { NextRequest, NextResponse } from "next/server";
import { isClientSlug, KUNDEN_COOKIE, kundenNext, kundenPassword, kundenToken } from "../../lib/kunden-auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const client = String(form.get("client") ?? "");
  const next = String(form.get("next") ?? "");

  if (!isClientSlug(client) || client === "demo") {
    return new NextResponse("Not found", { status: 404 });
  }

  const target = kundenNext(client, next);
  const expected = kundenPassword(client);
  if (!expected || password !== expected) {
    const url = new URL(`/kunden/${client}/login`, req.url);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const res = NextResponse.redirect(new URL(target, req.url), 303);
  res.cookies.set(KUNDEN_COOKIE(client), kundenToken(client), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: `/kunden/${client}`,
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
