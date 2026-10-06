import { CONTACT, projects, services } from "./content";
import { AI_DISCLOSURE_DE } from "./site-assist-copy";

export { AI_DISCLOSURE_DE };

export type ChatRole = "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT) return false;
  bucket.count += 1;
  return true;
}

export function ensureAiDisclosure(text: string, isFirstAssistant: boolean): string {
  if (!isFirstAssistant) return text;
  const lower = text.toLowerCase();
  if (
    lower.includes("digitale assistent") ||
    lower.includes("digitaler assistent") ||
    lower.includes("digital assistant")
  ) {
    return text;
  }
  return `${AI_DISCLOSURE_DE}\n\n${text}`;
}

function buildKnowledgePack(): string {
  const serviceLines = services
    .map((s) => `- ${s.name} (/leistungen/${s.slug}): ${s.teaser} Preis: ${s.priceFrom}.`)
    .join("\n");
  const projectLines = projects
    .map((p) => {
      const badge = p.badge ? ` [${p.badge}]` : "";
      return `- ${p.client}${badge} (/projekte/${p.slug}): ${p.headline} — ${p.teaser}`;
    })
    .join("\n");

  return `Leistungen:
${serviceLines}

Projekte / Case Studies:
${projectLines}

Kontakt:
- Kostenlose Beratung: /kontakt (online oder vor Ort in Wien)
- Telefon: ${CONTACT.phoneLabel}
- WhatsApp: ${CONTACT.whatsappLabel}
- E-Mail: ${CONTACT.email}
- Preise: alle Einstiegspreise stehen auf /preise (immer „ab“, netto). Nur diese Preise nennen, nie andere Zahlen erfinden; Fixpreis gibt es nach der kostenlosen Beratung.`;
}

export function buildSystemPrompt(): string {
  return `Du bist der digitale Assistent auf gorbenko.at (Agentur von Andrii Gorbenko, Wien).
REGEL №0 (EU AI Act): Im allerersten Antwortzug dieser Session beginne mit einer kurzen Klarstellung, dass du ein digitaler Assistent bist (nicht „Bot“ sagen). Danach nicht wiederholen.
Sprache: Deutsch (Sie), klar und kurz (2–5 Sätze), warm.
Du hilfst Besuchern bei Navigation und Orientierung: Leistungen, Projekte, Beratung buchen.
Wenn jemand einen Menschen will: Telefon ${CONTACT.phoneLabel} oder /kontakt nennen.
CTA: kostenlose Beratung auf /kontakt.
Kein Wort „Bot“. Keine erfundenen Zahlen. Preise nur als „ab“-Einstiegspreise aus den Fakten unten nennen und auf /preise verweisen.
Bei Rubberik: Shop ist „In Arbeit“, kein Live-Link auf den alten Shop.

Fakten:
${buildKnowledgePack()}`;
}

export async function askSiteAssistant(
  messages: ChatMessage[]
): Promise<{ reply: string } | { error: string; status: number }> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return { error: "not_configured", status: 503 };
  }

  const trimmed = messages
    .filter((m) => m.content.trim())
    .slice(-8)
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, 2000),
    }));

  if (trimmed.length === 0) {
    return { error: "empty", status: 400 };
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      system: buildSystemPrompt(),
      messages: trimmed,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("site-assist anthropic error", res.status, detail.slice(0, 300));
    return { error: "upstream", status: 502 };
  }

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = data.content?.find((c) => c.type === "text")?.text?.trim() ?? "";
  if (!text) return { error: "empty_reply", status: 502 };

  const hadAssistant = trimmed.some((m) => m.role === "assistant");
  return { reply: ensureAiDisclosure(text, !hadAssistant) };
}
