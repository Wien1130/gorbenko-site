import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { ANTON_COOKIE, antonToken } from "../lib/anton-auth";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(ANTON_COOKIE)?.value;
  if (cookie !== antonToken()) {
    const url = new URL("/anton/login", req.url);
    url.searchParams.set("next", "/anton");
    return NextResponse.redirect(url, 303);
  }

  const html = await readFile(
    path.join(process.cwd(), "private-anton", "offer.html"),
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
