import { NextRequest, NextResponse } from "next/server";
import { notifyTelegram, appendConsultationRow, type ConsultationRequest } from "../../lib/consultation";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const data: ConsultationRequest = {
    name: String(body.name ?? "").trim(),
    business: String(body.business ?? "").trim(),
    request: String(body.request ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    email: String(body.email ?? "").trim(),
  };

  if (!data.name || !data.request || (!data.phone && !data.email)) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const [telegramOk, githubOk] = await Promise.all([
    notifyTelegram(data),
    appendConsultationRow(data),
  ]);

  if (!telegramOk && !githubOk) {
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
