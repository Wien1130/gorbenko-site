// Фразы для двери: холодный заход, фильтр клиента, цена, ответы на возражения.
// Источник решений — чат 22.10.2026 (коуч-сессия) и PRICING.md.
// Правила: Sie, B1, без «Bot», без обещаний цифр заявок, цена «ab», keine Umsatzsteuer.

export type SalesPhrase = {
  id: string;
  de: string;
  ru: string;
  when: string;
};

export type SalesBlock = {
  id: string;
  title: string;
  note: string;
  phrases: SalesPhrase[];
};

export const VERKAUF_BLOCKS: SalesBlock[] = [
  {
    id: "kern",
    title: "Главная фраза",
    note: "Одна. Говорится сразу после имени. Число заявок не называть — это обещание, которое ты не контролируешь.",
    phrases: [
      {
        id: "kern-1",
        de: "Ich mache Websites, die Anfragen bringen — und Sie sehen jeden Monat in Zahlen, was sie bringen.",
        ru: "Я делаю сайты, которые приносят заявки, — и вы каждый месяц видите в цифрах, что они приносят.",
        when: "Сразу после «Grüß Gott, ich bin Andrii Gorbenko».",
      },
    ],
  },
  {
    id: "eingang",
    title: "Вход",
    note: "Короткий. Не про погоду.",
    phrases: [
      {
        id: "ein-1",
        de: "Grüß Gott, ich bin Andrii Gorbenko. Haben Sie zwei Minuten?",
        ru: "Здравствуйте, я Андрей Горбенко. У вас есть две минуты?",
        when: "Зашёл. Смотришь на хозяина, не на продавца.",
      },
      {
        id: "ein-2",
        de: "Ist der Chef oder die Chefin da?",
        ru: "Шеф или шефиня на месте?",
        when: "Если за стойкой явно сотрудник.",
      },
    ],
  },
  {
    id: "filter",
    title: "Два вопроса — фильтр клиента",
    note: "«Weiß ich nicht» — нормальный ответ, дальше работаешь ты. Нежелание отвечать на оба — не твой клиент.",
    phrases: [
      {
        id: "fil-1",
        de: "Wie viele Anfragen bekommen Sie im Monat?",
        ru: "Сколько заявок вы получаете в месяц?",
        when: "После главной фразы, если хозяин слушает.",
      },
      {
        id: "fil-2",
        de: "Was ist ein neuer Kunde bei Ihnen wert?",
        ru: "Сколько для вас стоит один новый клиент?",
        when: "Второй вопрос, сразу за первым.",
      },
      {
        id: "fil-3",
        de: "Was soll in einem halben Jahr anders sein?",
        ru: "Что должно быть по-другому через полгода?",
        when: "Отличает разовика от того, кто хочет расти.",
      },
    ],
  },
  {
    id: "preis",
    title: "Цена",
    note: "Цена вслух, один раз, без извинений. Kleinunternehmer: Endbetrag, keine Umsatzsteuer.",
    phrases: [
      {
        id: "pre-1",
        de: "So eine Website kostet ab 2.500 Euro, einmalig. Endbetrag, keine Umsatzsteuer.",
        ru: "Такой сайт стоит от 2.500 евро, один раз. Конечная сумма, без НДС.",
        when: "Когда спросили «сколько» — или сам, после двух вопросов.",
      },
      {
        id: "pre-2",
        de: "Danach sehen Sie jeden Monat Ihre Zahlen. Wenn Sie mehr daraus machen wollen: Betreuung ab 500 Euro im Monat, jederzeit kündbar.",
        ru: "Потом вы каждый месяц видите свои цифры. Если захотите из этого больше: ведение от 500 евро в месяц, отменить можно в любой момент.",
        when: "Если спросили «а дальше?».",
      },
      {
        id: "pre-3",
        de: "Die Hälfte am Anfang, die Hälfte bei der Übergabe.",
        ru: "Половина в начале, половина при сдаче.",
        when: "Если спросили, как платить.",
      },
    ],
  },
  {
    id: "kontakt",
    title: "Контакт — сегодня",
    note: "Без e-mail или номера, записанного при нём, из двери не выходишь. Это и есть засчитанный заход.",
    phrases: [
      {
        id: "kon-1",
        de: "Darf ich Ihnen heute eine kurze Mail schicken? Welche Adresse ist die richtige?",
        ru: "Можно я пришлю вам сегодня короткое письмо? Какой адрес правильный?",
        when: "Всегда. Даже если «нет времени».",
      },
      {
        id: "kon-2",
        de: "Ich schreibe die Adresse gleich auf — Moment.",
        ru: "Я сразу запишу адрес — секунду.",
        when: "Достаёшь телефон, записываешь при нём.",
      },
    ],
  },
  {
    id: "einwand",
    title: "Если разговор свернёт",
    note: "Один ответ на одно возражение. Второй раз не спорить — прощаться.",
    phrases: [
      {
        id: "ew-1",
        de: "Das Wie ist meine Arbeit. Was Sie bekommen und was es kostet, sage ich Ihnen jetzt.",
        ru: "«Как» — это моя работа. Что вы получите и сколько это стоит, я скажу сейчас.",
        when: "«Покажи, как ты это делаешь» / «набросай структуру».",
      },
      {
        id: "ew-2",
        de: "Ich arbeite nur mit Zahlen. Ohne Zahlen kann ich Ihnen nicht sagen, was funktioniert.",
        ru: "Я работаю только с цифрами. Без цифр я не могу вам сказать, что работает.",
        when: "Не хочет говорить про заявки и клиентов.",
      },
      {
        id: "ew-3",
        de: "Der Preis bleibt. Weniger Umfang geht — weniger Preis nicht.",
        ru: "Цена остаётся. Меньше объём — можно, меньше цену — нет.",
        when: "«А дешевле?» во второй раз.",
      },
      {
        id: "ew-4",
        de: "Kann sein. Bei mir sehen Sie jeden Monat, was die Seite bringt. Das ist der Unterschied.",
        ru: "Может быть. У меня вы каждый месяц видите, что приносит сайт. В этом разница.",
        when: "«Другие делают за 500».",
      },
      {
        id: "ew-5",
        de: "Gut. Wissen Sie, wie viele Anfragen sie im Monat bringt?",
        ru: "Хорошо. Вы знаете, сколько заявок он приносит в месяц?",
        when: "«У нас уже есть сайт».",
      },
      {
        id: "ew-6",
        de: "Gerne. Wann darf ich mich melden — Dienstag oder Donnerstag?",
        ru: "Конечно. Когда мне можно написать — во вторник или в четверг?",
        when: "«Нам надо подумать».",
      },
      {
        id: "ew-7",
        de: "Verstehe. Wann passt es besser — morgen Vormittag oder Nachmittag?",
        ru: "Понимаю. Когда удобнее — завтра до обеда или после?",
        when: "«Сейчас нет времени».",
      },
    ],
  },
  {
    id: "ausgang",
    title: "Выход",
    note: "Уходишь первым, спокойно. Письмо — сегодня вечером, иначе заход не засчитан.",
    phrases: [
      {
        id: "aus-1",
        de: "Danke für Ihre Zeit. Sie hören heute noch von mir.",
        ru: "Спасибо за ваше время. Сегодня вы ещё обо мне услышите.",
        when: "Контакт записан.",
      },
      {
        id: "aus-2",
        de: "Alles klar, kein Problem. Schönen Tag noch!",
        ru: "Всё ясно, без проблем. Хорошего дня!",
        when: "«Нет» или не твой клиент. Без второго захода на спор.",
      },
    ],
  },
];

export const VERKAUF_TOTAL = VERKAUF_BLOCKS.reduce((n, b) => n + b.phrases.length, 0);
