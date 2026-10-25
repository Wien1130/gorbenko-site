// Семь фраз для одной двери. Всё, что нужно в первую неделю.
// Полный набор (50 фраз) — ./verkauf.ts. Здесь только то, что повторяется каждый день.

export type SiebenPhrase = {
  id: string;
  step: string; // шаг в двери
  de: string;
  ru: string;
  when: string;
};

export const SIEBEN_PHRASES: SiebenPhrase[] = [
  {
    id: "s1",
    step: "Вход",
    de: "Grüß Gott, ich bin Andrii Gorbenko, ich mache Websites hier im Bezirk. Haben Sie zwei Minuten?",
    ru: "Здравствуйте, я Андрей Горбенко, делаю сайты здесь в районе. У вас есть две минуты?",
    when: "Первые пять секунд. Имя и что ты — сразу, чтобы взгляд «что это?» сменился на «ага».",
  },
  {
    id: "s2",
    step: "Главная — сайта нет",
    de: "Ich mache Websites, die Anfragen bringen — und Sie sehen jeden Monat in Zahlen, was sie bringen.",
    ru: "Я делаю сайты, которые приносят заявки, — и вы каждый месяц видите в цифрах, что они приносят.",
    when: "Если Google Maps показал: сайта нет или он мёртвый.",
  },
  {
    id: "s3",
    step: "Главная — сайт есть",
    de: "Sie haben eine Website. Wissen Sie, was sie Ihnen im Monat bringt? Genau das zeige ich Ihnen — in Zahlen.",
    ru: "У вас есть сайт. Вы знаете, что он вам приносит в месяц? Именно это я и показываю — в цифрах.",
    when: "Если сайт есть. Семь дверей из десяти в Вене — этот вариант.",
  },
  {
    id: "s4",
    step: "Вопрос",
    de: "Woher kommen heute Ihre Kunden — eher Empfehlung oder Google?",
    ru: "Откуда сегодня приходят ваши клиенты — скорее по рекомендации или через Google?",
    when: "Один вопрос с выбором из двух. Ответ ты поймёшь. Дальше — слушать.",
  },
  {
    id: "s5",
    step: "Почта",
    de: "Darf ich Ihnen das per E-Mail schicken? Welche Adresse passt?",
    ru: "Можно я пришлю это вам на почту? Какой адрес подходит?",
    when: "Победа двери — почта, не «да». Записал — уходишь первым.",
  },
  {
    id: "s6",
    step: "Спасательная 1",
    de: "Langsamer bitte — mein Deutsch ist noch im Aufbau.",
    ru: "Помедленнее, пожалуйста, — мой немецкий ещё строится.",
    when: "Когда не понял. Это не слабость, а уважение — австрийцы реагируют хорошо.",
  },
  {
    id: "s7",
    step: "Спасательная 2",
    de: "Verstehe ich richtig: …?",
    ru: "Я правильно понимаю: …?",
    when: "Повторяешь его слова своими. Проверяешь, что понял, и выигрываешь секунду подумать.",
  },
];

export const SIEBEN_GOAL = 10; // повторений каждой фразы в день
