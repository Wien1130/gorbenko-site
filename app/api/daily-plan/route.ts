import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CRM_COOKIE, crmToken } from "../../lib/crm-auth";
import { saveDailyPlan } from "../../lib/plans";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get(CRM_COOKIE)?.value !== crmToken()) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const date = String(body.date ?? "").trim();
  const plannedHours = Number(body.plannedHours ?? 0);
  const plannedTouches = Number(body.plannedTouches ?? 0);
  const note = String(body.note ?? "").trim();

  if (!date || (!plannedHours && !plannedTouches)) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const ok = await saveDailyPlan({ date, plannedHours, plannedTouches, note });
  if (!ok) {
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
