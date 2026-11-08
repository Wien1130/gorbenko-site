import { callClaude, EMAIL_LEGAL } from "../ai";
import { messeLetterSystem, messeLetterUser, type MesseLettersInput } from "./letters-prompt";

export type { MesseLettersInput };

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
    letter1_subject: { type: "string", description: "Тема первого письма, до 70 знаков, с названием этой выставки" },
    letter1_body: { type: "string", description: "Первое письмо: 3-5 коротких предложений, без обещания автоматической даты" },
    letter2_subject: { type: "string", description: "Тема черновика второго письма, до 70 знаков" },
    letter2_body: { type: "string", description: "Черновик: одна главная идея и один следующий шаг" },
    summary_ru: { type: "string", description: "1 фраза по-русски для Андрея: о чём оба письма" },
  },
} as const;

/** Два письма с выставки: №1 можно отправить сразу; №2 остаётся черновиком, пока Андрей отдельно не запланирует его. */
export async function draftMesseLetters(i: MesseLettersInput): Promise<MesseLetters> {
  const system = `${messeLetterSystem(i)} ${EMAIL_LEGAL}`;
  return callClaude<MesseLetters>({
    system,
    content: [{ type: "text", text: messeLetterUser(i) }],
    schema: SCHEMA as unknown as Record<string, unknown>,
    maxTokens: 1800,
  });
}
