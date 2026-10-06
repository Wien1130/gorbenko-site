import { NextRequest, NextResponse } from "next/server";
import {
  askSiteAssistant,
  checkRateLimit,
  type ChatMessage,
} from "../../lib/site-assist";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  if (!checkRateLimit(clientIp(req))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.messages)) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const messages: ChatMessage[] = body.messages
    .filter(
      (m: unknown) =>
        m &&
        typeof m === "object" &&
        ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
        typeof (m as ChatMessage).content === "string"
    )
    .map((m: ChatMessage) => ({
      role: m.role,
      content: String(m.content),
    }));

  const result = await askSiteAssistant(messages);
  if ("error" in result) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
  }
  return NextResponse.json({ ok: true, reply: result.reply });
}
