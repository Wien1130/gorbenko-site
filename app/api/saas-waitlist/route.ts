import { NextRequest, NextResponse } from "next/server";
import { notifyTelegramWaitlist, appendWaitlistRow, type WaitlistSignup } from "../../lib/saas-waitlist";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const data: WaitlistSignup = {
    name: String(body.name ?? "").trim(),
    contact: String(body.contact ?? "").trim(),
    plan: String(body.plan ?? "").trim(),
  };

  if (!data.name || !data.contact) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  const [telegramOk, githubOk] = await Promise.all([
    notifyTelegramWaitlist(data),
    appendWaitlistRow(data),
  ]);

  if (!telegramOk && !githubOk) {
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
