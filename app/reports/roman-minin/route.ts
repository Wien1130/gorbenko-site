import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { REPORTS_COOKIE, reportsToken } from "../../lib/reports-auth";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(REPORTS_COOKIE)?.value;
  if (cookie !== reportsToken()) {
    const url = new URL("/reports/login", req.url);
    url.searchParams.set("next", "/reports/roman-minin");
    return NextResponse.redirect(url, 303);
  }

  const html = await readFile(
    path.join(process.cwd(), "private-reports", "roman-minin.html"),
    "utf-8",
  );
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "private, no-store",
    },
  });
}
