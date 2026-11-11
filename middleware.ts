import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname !== "/klassisch" && !pathname.startsWith("/klassisch/")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const rest = pathname.slice("/klassisch".length);
  url.pathname = rest === "" ? "/" : rest;

  const headers = new Headers(request.headers);
  headers.set("x-site-variant", "klassisch");
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/klassisch", "/klassisch/:path*"],
};
