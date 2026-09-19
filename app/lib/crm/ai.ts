import type { Lead, Activity, VisitProposal } from "./types";

/**
 * Мозг CRM — Anthropic Claude со structured outputs (output_config.format).
 * Constrained decoding гарантирует валидный JSON по схеме — класс ошибок
 * старого бота (обрезанный/битый JSON от Groq) невозможен by design.
 */

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.CRM_AI_MODEL ?? "claude-sonnet-4-5";

interface ClaudeContentBlock {
  type: string;
  text?: string;
  source?: { type: "base64"; media_type: string; data: string };
}

async function callClaude<T>(opts: {
  system: string;
  content: ClaudeContentBlock[];
  schema: Record<string, unknown>;
  maxTokens?: number;
}): Promise<T> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY не задан");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: opts.maxTokens ?? 2000,
      system: opts.system,
      messages: [{ role: "user", content: opts.content }],
      output_config: { format: { type: "json_schema", schema: opts.schema } },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Claude API ${res.status}: ${detail.slice(0, 300)}`);
  }
  const json = await res.json();
  const text = (json.content ?? []).find((b: { type: string }) => b.type === "text")?.text ?? "";
  return JSON.parse(text) as T;
}

// ---------- Разбор захода ----------

const VISIT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "matched_lead_id", "business_name", "business_type", "stage",
    "contact_name", "contact_email", "contact_phone", "address",
    "next_action", "reminder_date", "reminder_text",
    "meeting_datetime", "deal_amount", "summary",
  ],
  properties: {
    matched_lead_id: { type: ["integer", "null"], description: "id существующего лида, если это ТОТ ЖЕ бизнес; иначе null" },
    business_name: { type: "string", description: "Название бизнеса. НИКОГДА не включай имя контакта-человека" },
    business_type: { type: "string", enum: ["restaurant", "cafe", "shop", "gallery", "other"] },
    stage: { type: "string", enum: ["lost", "warm_followup", "meeting_tentative", "meeting_confirmed", "meeting_done", "proposal_sent", "won"] },
    contact_name: { type: "string" },
    contact_email: { type: "string" },
    contact_phone: { type: "string" },
    address: { type: "string" },
    next_action: { type: "string", description: "Следующий шаг Андрея, коротко, по-русски. Пусто если нет" },
    reminder_date: { type: "string", description: "YYYY-MM-DD когда напомнить о следующем шаге. Пусто если напоминание не нужно" },
    reminder_text: { type: "string", description: "Текст напоминания, коротко. Пусто если reminder_date пуст" },
    meeting_datetime: { type: "string", description: "СТРОГО 'YYYY-MM-DD HH:MM' если stage=meeting_confirmed, иначе свободный текст или пусто" },
    deal_amount: { type: "number", description: "Сумма сделки в EUR, 0 если нет" },
    summary: { type: "string", description: "1-2 предложения по-русски: что произошло" },
  },
} as const;

const OUTCOME_STAGE_HINT: Record<string, string> = {
  lost: "Андрей нажал кнопку «Отказ» — stage почти наверняка lost.",
  warm_followup: "Андрей нажал кнопку «Тёплый» — stage почти наверняка warm_followup.",
  meeting_tentative: "Андрей нажал кнопку «Встреча» — stage meeting_tentative, или meeting_confirmed если из текста ясны точные дата и время.",
  won: "Андрей нажал кнопку «Продажа» — stage won, вытащи сумму сделки если названа.",
};

export async function parseVisit(opts: {
  transcript: string;
  typedText: string;
  outcome: string; // "" | lost | warm_followup | meeting_tentative | won
  photoBase64?: { mediaType: string; data: string };
  existingLeads: Pick<Lead, "id" | "business_name" | "stage">[];
  currentLead?: Lead | null;
}): Promise<VisitProposal> {
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Vienna" });
  const weekday = new Date().toLocaleDateString("ru-RU", { weekday: "long", timeZone: "Europe/Vienna" });

  const system = `Ты — движок CRM Андрея Горбенко. Андрей делает холодные продажи в Вене:
заходит в рестораны/кафе/магазины, предлагает услуги своего агентства (сайты, AI-боты, реклама, аналитика),
после захода наговаривает или печатает что произошло, иногда фотографирует визитку/вывеску/бумажку.
Твоя задача — разобрать это в структурированную карточку. Сегодня ${today} (${weekday}), таймзона Europe/Vienna.

Правила:
- business_name: короткое название заведения, НИКОГДА не вставляй имя человека-контакта в название.
- Если на фото визитка/бумажка — вытащи оттуда email, телефон, имя, адрес.
- Сопоставление с существующими лидами: matched_lead_id только если это явно ТОТ ЖЕ бизнес (похожее название/контекст «вернулся», «follow-up», «написал им»). Сомневаешься — null.
- reminder_date: если есть следующий шаг, предложи разумную дату (обычно +2..4 дня; «через неделю» = +7 дней; перед встречей — в день встречи утром). Формат YYYY-MM-DD.
- meeting_datetime: СТРОГО 'YYYY-MM-DD HH:MM' только при stage=meeting_confirmed (нужно для календаря). Разрешай относительные даты («завтра в 15») от сегодняшней даты.
- Если информации мало — заполняй пустыми строками, НЕ выдумывай.
- Все тексты (summary, next_action, reminder_text) — по-русски, коротко.`;

  const parts: string[] = [];
  if (opts.currentLead) {
    parts.push(`ЭТО ЗАПИСЬ ПО УЖЕ ОТКРЫТОМУ ЛИДУ #${opts.currentLead.id} «${opts.currentLead.business_name}» (stage: ${opts.currentLead.stage}). matched_lead_id = ${opts.currentLead.id}, если Андрей явно не говорит про другой бизнес.`);
  }
  if (opts.outcome && OUTCOME_STAGE_HINT[opts.outcome]) parts.push(OUTCOME_STAGE_HINT[opts.outcome]);
  if (opts.existingLeads.length) {
    parts.push(
      "Существующие лиды (id | название | stage):\n" +
        opts.existingLeads.map((l) => `${l.id} | ${l.business_name} | ${l.stage}`).join("\n"),
    );
  }
  if (opts.transcript) parts.push(`Голосовая запись Андрея (транскрипция):\n${opts.transcript}`);
  if (opts.typedText) parts.push(`Текст Андрея:\n${opts.typedText}`);
  if (!opts.transcript && !opts.typedText && opts.photoBase64) parts.push("Текста нет — разбери только фото.");

  const content: ClaudeContentBlock[] = [];
  if (opts.photoBase64) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: opts.photoBase64.mediaType, data: opts.photoBase64.data },
    });
  }
  content.push({ type: "text", text: parts.join("\n\n") });

  return callClaude<VisitProposal>({ system, content, schema: VISIT_SCHEMA as unknown as Record<string, unknown> });
}

// ---------- Письма ----------

const EMAIL_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["subject", "body"],
  properties: {
    subject: { type: "string" },
    body: { type: "string", description: "Тело письма БЕЗ подписи и БЕЗ прощальной формулы — они добавляются программно" },
  },
} as const;

export const EMAIL_SIGNATURE_RU = "\n\nС уважением,\nАндрей Горбенко\n+43 676 59 202 59\nhttps://gorbenko.at";
export const EMAIL_SIGNATURE_DE = "\n\nMit freundlichen Grüßen\nAndrii Gorbenko\n+43 676 59 202 59\nhttps://gorbenko.at";

export function withSignature(body: string, lang: "ru" | "de"): string {
  return body.trimEnd() + (lang === "de" ? EMAIL_SIGNATURE_DE : EMAIL_SIGNATURE_RU);
}

export async function draftEmail(opts: {
  lead: Lead;
  activities: Activity[];
  lang: "ru" | "de";
  instruction?: string;
  priorDraft?: { subject: string; body: string };
}): Promise<{ subject: string; body: string }> {
  const { lead, lang } = opts;
  const history = opts.activities
    .slice(0, 6)
    .map((a) => `- [${a.created_at}] ${a.summary || a.transcript}`.slice(0, 300))
    .join("\n");

  const system =
    lang === "de"
      ? `Ты пишешь деловое follow-up письмо ПО-НЕМЕЦКИ (Sie-Form, венский деловой стиль, тепло но коротко) от имени Андрея Горбенко — владельца digital-агентства в Вене (сайты, AI-ассистенты, реклама, аналитика, gorbenko.at). Письмо после холодного визита в заведение. 4-8 предложений. БЕЗ прощальной формулы и БЕЗ подписи — их добавит система.`
      : `Ты пишешь деловое follow-up письмо ПО-РУССКИ от имени Андрея Горбенко — владельца digital-агентства в Вене (сайты, AI-ассистенты, реклама, аналитика, gorbenko.at). Письмо после холодного визита в заведение. Тепло, по делу, 4-8 предложений. БЕЗ прощальной формулы и БЕЗ подписи — их добавит система.`;

  const parts = [
    `Лид: «${lead.business_name}» (${lead.business_type}), stage: ${lead.stage}.`,
    lead.contact_name ? `Контакт: ${lead.contact_name}` : "",
    lead.next_action ? `Следующий шаг: ${lead.next_action}` : "",
    lead.notes ? `Заметки: ${lead.notes}` : "",
    history ? `История касаний:\n${history}` : "",
    opts.priorDraft ? `ТЕКУЩИЙ ЧЕРНОВИК (перепиши с учётом инструкции, не с нуля):\nSubject: ${opts.priorDraft.subject}\n${opts.priorDraft.body}` : "",
    opts.instruction ? `Инструкция Андрея: ${opts.instruction}` : "",
  ].filter(Boolean);

  return callClaude<{ subject: string; body: string }>({
    system,
    content: [{ type: "text", text: parts.join("\n\n") }],
    schema: EMAIL_SCHEMA as unknown as Record<string, unknown>,
    maxTokens: 1500,
  });
}
