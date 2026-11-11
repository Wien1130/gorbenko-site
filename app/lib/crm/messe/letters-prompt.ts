export interface MesseLettersInput {
  fairTitle: string;
  venue: string;
  booth: string;
  exhibitor: string;
  city: string;
  offer: string;
  openingDe: string;
  contactName: string;
  /** Коротко по-русски: о чём говорили на стенде. */
  talk: string;
  /** Дата, которую Андрей выбрал как ориентир. Письмо 2 само не уходит. */
  secondDate: string;
  secondWeekdayDe: string;
  /** Календарный день разговора, например «Sonntag, 08.11.2026». Не фиксировать день недели выставки. */
  talkDateLabel: string;
  /** de — обычная отправка. ru — отправка с русской подписью. en — только черновик, подписи нет. */
  lang?: "de" | "en" | "ru";
}

export function messeLetterSystem(i: MesseLettersInput): string {
  const place = [i.fairTitle, i.venue].filter(Boolean).join(", ");
  const lang = i.lang || "de";
  if (lang === "en") return englishSystem(i, place);
  if (lang === "ru") return russianSystem(i, place);
  return `Ты пишешь ДВА деловых письма ПО-НЕМЕЦКИ (Sie-Form, венский деловой стиль, тепло, коротко, без канцелярита и без клише вроде «ich hoffe, diese E-Mail erreicht Sie gut») от имени Андрея Горбенко — Inhaber einer Werbeagentur in Wien (Websites, Content & Reels, digitale Assistenten, Werbung, gorbenko.at). Оба письма — после личного разговора на стенде выставки ${place}. Это не визит в заведение. День разговора: ${i.talkDateLabel || "сегодня"}.

ПИСЬМО 1 (уходит сразу после разговора). Структура:
1) Что вы только что говорили на стенде этой выставки. Название выставки — «${i.fairTitle}». Место, если уместно, — «${i.venue}». Без номера стенда.
2) Кто пишет: «ich bin Andrii Gorbenko, Werbeagentur in Wien» — одна фраза, без перечисления всех услуг.
3) О чём говорили — одна конкретная фраза из заметки Андрея (переведи смысл, не дословно). Если заметка пустая — не выдумывай детали разговора.
4) Зачем письмо: чтобы у собеседника был контакт. Андрей пришлёт одну конкретную идею, когда ещё раз посмотрит разговор. Не обещай день, час и автоматическую отправку.
5) Короткое пожелание хорошего дня на выставке.
Всего 3-5 предложений. Никаких цен и никаких вопросов, требующих ответа.

ПИСЬМО 2 — черновик на ручную проверку, само не отправляется. Первое предложение — отсылка к разговору ${i.talkDateLabel || "на выставке"} на ${i.fairTitle}, в прошедшем времени. Затем ОДНА главная идея под этот разговор, в 1-2 предложения, с понятным эффектом для их бизнеса. Вторую идею добавляй только если она прямо следует из заметки; не заполняй шаблон «две идеи» насильно. Без негативной оценки их сайта. Закончить одним конкретным следующим шагом: короткий разговор, без давления. Не обещай, что письмо уйдёт ${i.secondWeekdayDe} автоматически. 4-7 предложений.

Обращение: если имя контакта есть — «Sehr geehrte Frau X» / «Sehr geehrter Herr X» (по фамилии); если имени нет — «Guten Tag». В обоих письмах БЕЗ прощальной формулы и БЕЗ подписи — их добавит система. Не называй себя Bot. Не пиши «garantiert», «Nr. 1», «führend». Не упоминай другую выставку и не подставляй MAK, если место не MAK. Не обещай инженерный digital twin, сертификацию или рост продаж.`;
}

function englishSystem(i: MesseLettersInput, place: string): string {
  return `Write TWO short business emails in English from Andrii Gorbenko, a one-person advertising studio in Vienna (websites, product videos, digital assistant, gorbenko.at). Both follow a conversation at a stand at ${place}. This is not a visit to a shop. Conversation date: ${i.talkDateLabel || "today"}.

EMAIL 1 is a draft only. The sending system has no English signature and will not send this email. Say you just spoke at «${i.fairTitle}»${i.venue ? ` (${i.venue})` : ""}. One sentence: who Andrii is. One sentence from Andrii's note. Do not invent the conversation. No prices, no booth number.

EMAIL 2 is also a manual draft and will not be sent automatically. One main idea from the note or the prepared hypothesis, framed as a proposal, not a fact. One calm next step. Do not promise it goes out on ${i.secondWeekdayDe}. Do not promise an engineering digital twin, certification, or sales growth.

If a person's name was given as someone Andrii actually spoke with, use it. If not, use "Hello" and do not copy a name from the exhibitor catalogue. No sign-off and no signature. Do not call yourself a bot. Do not write "guaranteed", "No. 1", or "leading". Do not mention a different fair or MAK unless the venue is MAK.`;
}

function russianSystem(i: MesseLettersInput, place: string): string {
  return `Ты пишешь ДВА деловых письма ПО-РУССКИ (на «вы», коротко, тепло, без канцелярита) от имени Андрея Горбенко — рекламная студия в Вене (сайты, продуктовые видео, цифровой помощник, gorbenko.at). Оба письма — после личного разговора на стенде ${place}. Это не визит в заведение. День разговора: ${i.talkDateLabel || "сегодня"}. Русский выбран для этого письма. Это не доказательство, что сотрудник говорит по-русски, если Андрей сам этого не записал.

ПИСЬМО 1 (можно отправить: у отправки есть русская подпись). 3–5 предложений: что только что говорили на «${i.fairTitle}»${i.venue ? `, место «${i.venue}»` : ""}; кто пишет — одна фраза; одна конкретная деталь из заметки, без выдумки; зачем письмо — чтобы остался контакт, одну идею Андрей пришлёт отдельно. Не обещай день и час. Без номера стенда, цен и вопросов.

ПИСЬМО 2 — черновик на ручную проверку, само не отправляется. Отсылка к разговору ${i.talkDateLabel || "на выставке"} в прошедшем времени. Одна главная идея как предложение, не как факт. Один спокойный следующий шаг. Не обещай, что письмо уйдёт ${i.secondWeekdayDe} автоматически. Не обещай инженерный digital twin, сертификацию или рост продаж.

Если имени собеседника нет — «Здравствуйте», не подставляй имя из каталога. Без прощальной формулы и без подписи. Не называй себя ботом. Не пиши «гарантируем», «№ 1», «лучшие». Не упоминай другую выставку и не подставляй MAK, если место не MAK.`;
}

export function messeLetterUser(i: MesseLettersInput): string {
  return [
    `Участник: «${i.exhibitor}», Stand ${i.booth}${i.city ? `, ${i.city}` : ""}.`,
    i.contactName ? `Имя для обращения, если это человек с кем говорили, а не имя из каталога: ${i.contactName}` : "Имя собеседника неизвестно — не подставляй имя из каталога.",
    `О чём говорили (заметка Андрея, по-русски): ${i.talk || "заметка пустая — не выдумывай содержание разговора"}`,
    i.offer ? `Гипотеза из подготовки (можно взять как идею письма 2, пометив её как предложение, не как факт): ${i.offer}` : "",
    i.openingDe ? `Заготовленный первый вопрос (контекст, не цитировать как сказанное ими): ${i.openingDe}` : "",
  ].filter(Boolean).join("\n\n");
}
