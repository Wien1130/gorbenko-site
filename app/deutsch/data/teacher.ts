import { latestLesson } from "./lessons";

export type TeacherNote = {
  title: string;
  body: string;
};

export const ANDRII_AS_STUDENT = {
  name: "Andrii",
  greetingDe: "Liebe Ksenija — das ist Ihre Seite. Kurz, ehrlich, nur zum Unterrichten.",
  howHeLearns: [
    "Говорит долго своими темами: работа, клиенты, семья, деньги. Учебник его хуже держит, чем живая история.",
    "Не прячется в ja/nein. Если молчит — обычно ищет слово, а не мысль.",
    "Когда слова нет, крутит одно и то же или уходит в русский. Дай слово — и сразу верни его в немецкое предложение до точки.",
    "После одной точной подсказки часто собирает фразу сам. Не разбирай за него весь абзац.",
  ],
  works: [
    "Картинка из его жизни: кофе / чай / сок для gern — lieber — am liebsten зашло сразу.",
    "Правило + одна его фраза: «Ich muss denken, was ich … machen muss».",
    "22.09: чашки кофе для genauso … wie и «gefallen» сразу на его рекламу.",
    "Короткий русский, потом снова немецкая речь. Так ты и вела 19.09 и 22.09 — это его темп.",
  ],
  avoid: [
    "Не отпускать plus/minus. Он ставит его на любое «примерно». Только ungefähr.",
    "Не отпускать möglich вместо vielleicht. И in meine вместо in meiner.",
    "Не чинить каждое слово посреди рассказа — запиши, вернись в конце блока.",
    "Не абстрактные Auto 1 / Auto 2, если можно спросить про Wien, Kunden, Werbung.",
  ],
};

export function nextHourForTeacher() {
  const lesson = latestLesson();
  return {
    when: lesson.nextLabel,
    lastTopic: lesson.topicDe,
    lastDate: lesson.dateLabel,
    warmup: [
      "2 минуты: Meiner Meinung nach … — лови möglich вместо vielleicht.",
      "Одна фраза к двери: «Gefällt Ihnen das Ergebnis Ihrer Werbung?»",
      "Одинаково: genauso + прилагательное + wie. Не als.",
    ],
    drill: [
      "Dativ: in meiner Tasse, nicht in meine Tasse.",
      "gefallen: gefällt dir / gefallen dir / Gefällt Ihnen.",
      "Ge-: das Gebäude, das Gesicht, das Gesetz, das Gedicht — но die Geschichte.",
    ],
    watch: lesson.corrections.map((c) => `${c.said} → ${c.need}`),
  };
}

export const TEACHER_RITUAL: TeacherNote[] = [
  {
    title: "Как открывать час",
    body: "Сначала его жизнь на немецком 5–7 минут. Потом грамматика на тех же словах. Так он не «учит тему», а говорит то, что и так скажет на улице.",
  },
  {
    title: "Как чинить",
    body: "Одно исправление — одно повторение полной фразы. Если дала только слово, он его кивнёт и потеряет.",
  },
  {
    title: "Эта тетрадь",
    body: "После урока цифровой помощник заливает разбор сюда. Тебе не надо ничего заполнять. Перед следующим часом достаточно этой вкладки и блока «следующий час».",
  },
];
