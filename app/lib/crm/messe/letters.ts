import { callClaude, EMAIL_LEGAL } from "../ai";

export interface MesseLettersInput {
  fairTitle: string;
  booth: string;
  exhibitor: string;
  city: string;
  offer: string;
  openingDe: string;
  contactName: string;
  /** Коротко по-русски: о чём говорили на стенде (голос/заметка Андрея). */
  talk: string;
  /** Дата второго письма, YYYY-MM-DD — чтобы первое письмо честно сказало, когда придёт второе. */
  secondDate: string;
  secondWeekdayDe: string;
}

export interface MesseLetters {
  letter1_subject: string;
  letter1_body: string;
  letter2_subject: string;
  letter2_body: string;
  summary_ru: string;
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["letter1_subject", "letter1_body", "letter2_subject", "letter2_body", "summary_ru"],
  properties: {
    letter1_subject: { type: "string", description: "Тема первого письма, до 60 знаков, с упоминанием BLICKFANG" },
    letter1_body: { type: "string", description: "Первое письмо: 3-5 коротких предложений, см. структуру" },
    letter2_subject: { type: "string", description: "Тема второго письма, до 60 знаков" },
    letter2_body: { type: "string", description: "Второе письмо: 5-8 предложений с двумя конкретными идеями" },
    summary_ru: { type: "string", description: "1 фраза по-русски для Андрея: о чём оба письма" },
  },
} as const;

/** Два письма с выставки одним вызовом: №1 — «мы только что говорили», уходит сразу; №2 — две идеи, уходит в назначенный день. */
export async function draftMesseLetters(i: MesseLettersInput): Promise<MesseLetters> {
  const system = `Ты пишешь ДВА деловых письма ПО-НЕМЕЦКИ (Sie-Form, венский деловой стиль, тепло, коротко, без канцелярита и без клише вроде «ich hoffe, diese E-Mail erreicht Sie gut») от имени Андрея Горбенко — Inhaber einer Werbeagentur in Wien (Websites, Content & Reels, digitale Assistenten, Werbung, gorbenko.at). Оба письма — после личного разговора СЕГОДНЯ на стенде выставки ${i.fairTitle} im MAK Wien. Это не визит в заведение.

ПИСЬМО 1 (уходит сразу после разговора, пока собеседник ещё на стенде). Структура строго:
1) «Wir haben gerade an Ihrem Stand auf der BLICKFANG gesprochen» (без номера стенда).
2) Кто пишет: «ich bin Andrii Gorbenko, Werbeagentur in Wien» — одна фраза, без перечисления всех услуг.
3) О чём говорили — одна конкретная фраза из заметки Андрея (переведи смысл, не дословно).
4) Зачем письмо: чтобы у собеседника был контакт, и что ${i.secondWeekdayDe} (${i.secondDate}) Андрей пришлёт две конкретные идеи к обсуждённому.
5) Короткое пожелание успешной выставки.
Всего 3-5 предложений. Никаких предложений услуг, никаких цен, никаких вопросов, требующих ответа.

ПИСЬМО 2 (уйдёт ${i.secondWeekdayDe}, ${i.secondDate}). Первое предложение — отсылка к разговору на выставке в прошедшем времени («am Samstag auf der BLICKFANG»). Затем две конкретные идеи под их продукт и то, что обсуждали, каждая в 1-2 предложения с понятным эффектом для них; идеи должны вырастать из разговора и из «Предложения». Без негативной оценки их сайта. Закончить предложением 15-минутного разговора на этой неделе с двумя вариантами (например Dienstag oder Mittwoch Vormittag). 5-8 предложений.

Обращение: если имя контакта есть — «Sehr geehrte Frau X» / «Sehr geehrter Herr X» (по фамилии; пол по имени); если имени нет — «Guten Tag». В обоих письмах БЕЗ прощальной формулы и БЕЗ подписи — их добавит система. ${EMAIL_LEGAL}`;

  const user = [
    `Участник: «${i.exhibitor}», Stand ${i.booth}, ${i.city}.`,
    i.contactName ? `Контакт: ${i.contactName}` : "Имя контакта неизвестно.",
    `О чём говорили (заметка Андрея, по-русски): ${i.talk || "общий разговор о продукте и о том, как его показывают онлайн"}`,
    i.offer ? `Предложение из подготовки (идея для письма 2): ${i.offer}` : "",
    i.openingDe ? `Заготовленный первый вопрос (контекст): ${i.openingDe}` : "",
  ].filter(Boolean).join("\n\n");

  return callClaude<MesseLetters>({ system, content: [{ type: "text", text: user }], schema: SCHEMA as unknown as Record<string, unknown>, maxTokens: 1800 });
}
