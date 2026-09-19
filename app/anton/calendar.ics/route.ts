import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { ANTON_COOKIE, antonToken } from "../../lib/anton-auth";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(ANTON_COOKIE)?.value;
  if (cookie !== antonToken()) {
    const url = new URL("/anton/login", req.url);
    url.searchParams.set("next", "/anton/calendar.ics");
    return NextResponse.redirect(url, 303);
  }

  const ics = await readFile(
    path.join(process.cwd(), "private-anton", "calls.ics"),
  );
  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="CALLS-Anton-Andrii-2026.ics"',
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "private, no-store",
    },
  });
}
