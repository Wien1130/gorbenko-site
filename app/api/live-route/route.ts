import { NextRequest, NextResponse } from "next/server";
import { VIENNA_AREAS, findLiveCandidates, buildMapsRouteUrl } from "../../lib/live-route";
import { fetchLeadRows } from "../../lib/cold-leads";

const USED_COOKIE = "live_route_used";

export async function POST(req: NextRequest) {
  const alreadyUsed = req.cookies.get(USED_COOKIE)?.value === "1";
  if (alreadyUsed) {
    return NextResponse.json({ ok: false, error: "already_used" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const areaId = body?.areaId as string | undefined;
  const area = VIENNA_AREAS.find((a) => a.id === areaId);
  if (!area) {
    return NextResponse.json({ ok: false, error: "bad_area" }, { status: 400 });
  }

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const rows = await fetchLeadRows();
  const knownNames = rows.map((r) => (r.business_name || "").trim().toLowerCase());

  const candidates = await findLiveCandidates(area, knownNames);
  if (candidates.length === 0) {
    return NextResponse.json({ ok: true, candidates: [], mapsUrl: null });
  }

  const mapsUrl = buildMapsRouteUrl(area, candidates);
  const res = NextResponse.json({ ok: true, candidates, mapsUrl, area: area.label });
  res.cookies.set(USED_COOKIE, "1", {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
