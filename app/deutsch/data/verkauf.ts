// Фразы для двери: холодный заход, боль, один кейс, цена, ответы на возражения, выход.
// Источник — коуч-сессия 22.10.2026 + 4 ролевые симуляции (Installateur, Zahnärztin,
// Restaurant, Kosmetikstudio). Правила: Sie, B1, без «Bot», без обещаний цифр заявок,
// цена «ab», keine Umsatzsteuer, кейсы без цифр клиента без письменной freigabe.

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
    note: "Одна. Сразу после имени. Число заявок не называть — это обещание, которое ты не контролируешь.",
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
    note: "Коротко. Уважение в первые 5 секунд — хозяин занят, и это нормально.",
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
      {
        id: "ein-3",
        de: "Darf ich warten, bis Sie fertig sind?",
        ru: "Можно я подожду, пока вы закончите?",
        when: "Хозяин считает кассу, говорит по телефону, обслуживает. Ждёшь молча — это уже уважение.",
      },
      {
        id: "ein-4",
        de: "Ich habe mir Ihre Website vorher angeschaut — zwei Dinge sind mir aufgefallen.",
        ru: "Я заранее посмотрел ваш сайт — две вещи бросились в глаза.",
        when: "Если успел глянуть сайт перед дверью. Домашняя работа = уважение. Две вещи называешь только после его вопроса.",
      },
    ],
  },
  {
    id: "schmerz",
    title: "Боль — вопросы",
    note: "Сначала вопрос, потом всё остальное. «Weiß ich nicht» — лучший ответ: это и есть боль. Нежелание отвечать на все — не твой клиент.",
    phrases: [
      {
        id: "sch-1",
        de: "Wie viele Anfragen bekommen Sie im Monat?",
        ru: "Сколько заявок вы получаете в месяц?",
        when: "После главной фразы, если хозяин слушает.",
      },
      {
        id: "sch-2",
        de: "Wie viele Anfragen kommen im Monat über die Website?",
        ru: "Сколько заявок в месяц приходит через сайт?",
        when: "Если сайт уже есть. Почти всегда ответ «keine Ahnung» — это открывает разговор.",
      },
      {
        id: "sch-3",
        de: "Wissen Sie, woher Ihre neuen Kunden kommen?",
        ru: "Вы знаете, откуда приходят ваши новые клиенты?",
        when: "Вместо вопроса про деньги, если человек осторожный (врач, адвокат).",
      },
      {
        id: "sch-4",
        de: "Was ist ein neuer Kunde bei Ihnen wert?",
        ru: "Сколько для вас стоит один новый клиент?",
        when: "Только ПОСЛЕ первого вопроса и его ответа. Рано — вызывает защиту «зачем вам мои деньги».",
      },
      {
        id: "sch-5",
        de: "Ich frage, weil ich rechnen will, ob sich das bei Ihnen überhaupt lohnt. Wenn nicht, sage ich es Ihnen.",
        ru: "Спрашиваю, потому что хочу посчитать, окупится ли это у вас вообще. Если нет — так и скажу.",
        when: "Если на вопрос про деньги спросили «Warum fragen Sie?». Самая сильная фраза в симуляциях.",
      },
      {
        id: "sch-6",
        de: "Wie ist es bei Ihnen im Jänner, Februar?",
        ru: "Как у вас в январе-феврале?",
        when: "Ремесленники, строители, сервис. Зима — их боль, сами скажут.",
      },
      {
        id: "sch-7",
        de: "Was soll in einem halben Jahr anders sein?",
        ru: "Что должно быть по-другому через полгода?",
        when: "Отличает разовика от того, кто хочет расти.",
      },
    ],
  },
  {
    id: "spiegel",
    title: "Отражение боли",
    note: "Повторяешь его слова одним предложением. Он должен сказать «genau». Только после этого — кейс и цена.",
    phrases: [
      {
        id: "spi-1",
        de: "Also: Sie haben bezahlt und nicht gesehen, was passiert.",
        ru: "То есть: вы заплатили и не увидели, что происходит.",
        when: "Когда рассказал про прошлое агентство / SEO / сайт без результата.",
      },
      {
        id: "spi-2",
        de: "Also: Website da, Berichte unklar — und Sie wissen nicht, ob ein einziger Kunde daher kam.",
        ru: "То есть: сайт есть, отчёты непонятные — и вы не знаете, пришёл ли с него хоть один клиент.",
        when: "Есть сайт и агентство, но «не вижу пациентов/клиентов».",
      },
      {
        id: "spi-3",
        de: "Also: abends voll, mittags leer — und das Catering-Geld liegt auf der Straße.",
        ru: "То есть: вечером полно, в обед пусто — а деньги с кейтеринга лежат на улице.",
        when: "Рестораны. Переделай под его слова.",
      },
      {
        id: "spi-4",
        de: "Sie haben recht. Deshalb zeige ich Zahlen, nicht Versprechen.",
        ru: "Вы правы. Поэтому я показываю цифры, а не обещания.",
        when: "«Alle versprechen, keiner liefert». НЕ говорить «Kann sein» — эмоциональные это слышат как «вы преувеличиваете».",
      },
    ],
  },
  {
    id: "beweis",
    title: "Один кейс — 20 секунд",
    note: "Только ПОСЛЕ отражения боли. Один кейс, похожий на его бизнес. Без имени и цифр клиента, если нет письменной freigabe. Телефон не доставать.",
    phrases: [
      {
        id: "bew-1",
        de: "Ein Beispiel, 20 Sekunden: ein Handwerksbetrieb in Wien. Vorher alles über Stammkunden — wie bei Ihnen. Jetzt sieht er jeden Monat: so viel ausgegeben, so viele Anfragen.",
        ru: "Пример, 20 секунд: ремесленная мастерская в Вене. Раньше всё через постоянных — как у вас. Теперь каждый месяц видит: столько потратил, столько заявок.",
        when: "Формула кейса: кто (похож на него) → было как у него → что видит теперь. Без «красиво».",
      },
      {
        id: "bew-2",
        de: "Die Zahlen schicke ich Ihnen gern — mit seiner Freigabe.",
        ru: "Цифры с удовольствием пришлю — с его разрешения.",
        when: "Если просит цифры кейса. Защищает тебя юридически и звучит серьёзно.",
      },
      {
        id: "bew-3",
        de: "Wir zählen Anrufe und Formulare von Ihrer Seite, Monat für Monat, auf einer Seite.",
        ru: "Мы считаем звонки и формы с вашего сайта, месяц за месяцем, на одной странице.",
        when: "«Wie genau machen Sie das?» — отвечаешь ЧТО считаем и В КАКОМ ВИДЕ, не инструменты. Никаких Pixel, GA4, Tracking.",
      },
      {
        id: "bew-4",
        de: "Ich verspreche keine Zahl. Ich zeige Ihnen jeden Monat die echte.",
        ru: "Я не обещаю цифру. Я показываю вам каждый месяц настоящую.",
        when: "«Garantieren Sie mir Kunden?» Разворачивает всех — противоположность агентствам.",
      },
      {
        id: "bew-5",
        de: "Ich habe selbst ein Catering aufgebaut, von null. Ich weiß, was eine Firmenfeier bringt.",
        ru: "Я сам построил кейтеринг с нуля. Я знаю, что приносит корпоратив.",
        when: "Рестораны, кейтеринг. Держи готовый ответ в одно предложение на «Warum machen Sie es nicht mehr?» — иначе подозрение.",
      },
    ],
  },
  {
    id: "preis",
    title: "Цена",
    note: "Цена вслух, один раз, без извинений, на его языке: «одна Therme / одна Firmenfeier окупает сайт».",
    phrases: [
      {
        id: "pre-1",
        de: "So eine Website kostet ab 2.500 Euro, einmalig. Endbetrag, keine Umsatzsteuer.",
        ru: "Такой сайт стоит от 2.500 евро, один раз. Конечная сумма, без НДС.",
        when: "Когда спросили «сколько» — или сам, после отражения боли.",
      },
      {
        id: "pre-2",
        de: "Eine Firmenfeier zahlt die Seite. Eine Heizung zahlt die Seite.",
        ru: "Один корпоратив окупает сайт. Одно отопление окупает сайт.",
        when: "Сразу после цены. Подставь его продукт из ответа на «Was ist ein Kunde wert».",
      },
      {
        id: "pre-3",
        de: "Danach sehen Sie jeden Monat Ihre Zahlen. Wenn Sie mehr daraus machen wollen: Betreuung ab 500 Euro im Monat, jederzeit kündbar.",
        ru: "Потом вы каждый месяц видите свои цифры. Если захотите из этого больше: ведение от 500 евро в месяц, отменить можно в любой момент.",
        when: "Если спросили «а дальше?» — или если сайт у него уже есть и новый не нужен.",
      },
      {
        id: "pre-4",
        de: "Das Werbebudget geht an Google oder Meta, nicht an mich.",
        ru: "Рекламный бюджет идёт в Google или Meta, не мне.",
        when: "Вместе с Betreuung. Снимает подозрение «500 — и ещё реклама?».",
      },
      {
        id: "pre-5",
        de: "Die Hälfte am Anfang, die Hälfte bei der Übergabe.",
        ru: "Половина в начале, половина при сдаче.",
        when: "Если спросили, как платить.",
      },
    ],
  },
  {
    id: "kontakt",
    title: "Контакт — сегодня",
    note: "Без e-mail или номера, записанного при нём, из двери не выходишь. Это и есть засчитанный заход. Письмо — сегодня вечером, одна страница.",
    phrases: [
      {
        id: "kon-1",
        de: "Darf ich Ihnen heute eine kurze Mail schicken — eine Seite, was ich bei Ihnen zuerst machen würde?",
        ru: "Можно я пришлю вам сегодня короткое письмо — одна страница, что бы я у вас сделал в первую очередь?",
        when: "Всегда. «Одна страница» обещает, что не будет брошюры.",
      },
      {
        id: "kon-2",
        de: "Welche Adresse ist die richtige? Ich schreibe sie gleich auf.",
        ru: "Какой адрес правильный? Я сразу запишу.",
        when: "Достаёшь телефон, записываешь при нём.",
      },
      {
        id: "kon-3",
        de: "Nächste Woche 20 Minuten — Dienstag oder Donnerstag?",
        ru: "На следующей неделе 20 минут — вторник или четверг?",
        when: "Два варианта, не «когда вам удобно».",
      },
    ],
  },
  {
    id: "einwand",
    title: "Если разговор свернёт",
    note: "Один ответ на одно возражение. Второй раз не спорить — прощаться. Торг у итальянца — ритуал; «не клиент» — если торгуется ПОСЛЕ твёрдого ответа.",
    phrases: [
      {
        id: "ew-1",
        de: "Gut — dann brauchen Sie keine neue. Wie viele Anfragen kommen im Monat darüber?",
        ru: "Хорошо — тогда новый вам не нужен. Сколько заявок в месяц приходит через него?",
        when: "«Wir haben schon eine Website». Снимает страх «впарит сайт» и ведёт к Betreuung.",
      },
      {
        id: "ew-2",
        de: "Das Wie ist meine Arbeit. Was Sie bekommen und was es kostet, sage ich Ihnen jetzt.",
        ru: "«Как» — это моя работа. Что вы получите и сколько это стоит, я скажу сейчас.",
        when: "Когда просят показать структуру, промпт, план — ДО денег.",
      },
      {
        id: "ew-3",
        de: "Ich arbeite nur mit Zahlen. Ohne Zahlen kann ich Ihnen nicht sagen, was funktioniert.",
        ru: "Я работаю только с цифрами. Без цифр я не могу вам сказать, что работает.",
        when: "Не хочет говорить про заявки и клиентов.",
      },
      {
        id: "ew-4",
        de: "Der Preis bleibt. Weniger geht — zum Beispiel nur eine Seite mit Formular.",
        ru: "Цена остаётся. Меньше можно — например, только одна страница с формой.",
        when: "«А дешевле?» во второй раз. Обязательно назвать, ЧТО конкретно меньше — иначе фраза «кирпич».",
      },
      {
        id: "ew-5",
        de: "Stimmt, das gibt es. Bei mir sehen Sie jeden Monat, was die Seite bringt. Das ist der Unterschied.",
        ru: "Верно, такое есть. У меня вы каждый месяц видите, что приносит сайт. В этом разница.",
        when: "«Andere machen das für 500». С улыбкой.",
      },
      {
        id: "ew-6",
        de: "Gern. Ich schicke Ihnen heute Abend eine Seite — was ich anschaue, was es kostet — damit Sie es zeigen können. Und nächste Woche 20 Minuten, gern zu dritt.",
        ru: "Конечно. Сегодня вечером пришлю одну страницу — что смотрю, сколько стоит, — чтобы вы могли показать. И на следующей неделе 20 минут, можно втроём.",
        when: "«Ich muss das mit meinem Mann / meiner Frau besprechen». Даёшь вещь для показа + срок. НЕ «wann darf ich anrufen».",
      },
      {
        id: "ew-7",
        de: "Verstehe. Wann passt es besser — morgen Vormittag oder Nachmittag?",
        ru: "Понимаю. Когда удобнее — завтра до обеда или после?",
        when: "«Сейчас нет времени».",
      },
      {
        id: "ew-8",
        de: "Für Ärzte gilt: nur sachliche Information, keine Vergleiche, keine Lockangebote — das kenne ich.",
        ru: "Для врачей правило: только фактическая информация, без сравнений и зазывал — я это знаю.",
        when: "Врачи, адвокаты. Снимает страх перед Ärztekammer / Werberichtlinie.",
      },
    ],
  },
  {
    id: "ausgang",
    title: "Выход",
    note: "Уходишь первым, спокойно. Не-клиенту — причину и похвалу конкретному, иначе обидно. И всегда просьба о рекомендации.",
    phrases: [
      {
        id: "aus-1",
        de: "Danke für Ihre Zeit. Sie hören heute noch von mir.",
        ru: "Спасибо за ваше время. Сегодня вы ещё обо мне услышите.",
        when: "Контакт записан.",
      },
      {
        id: "aus-2",
        de: "Danke, ich bleibe kurz — ich habe noch Termine.",
        ru: "Спасибо, я коротко — у меня ещё встречи.",
        when: "Предлагают кофе, сесть, поболтать. Стоя — 3 минуты. Сидя — час и ноль.",
      },
      {
        id: "aus-3",
        de: "Bei diesem Preis pro Kunde rechnet sich eine Website nicht — das sage ich Ihnen ehrlich. Ihr Instagram passt. Machen Sie weiter so.",
        ru: "При такой цене за клиента сайт не окупится — говорю честно. Ваш Instagram подходит. Продолжайте.",
        when: "Не клиент (чек €40–60, одно кресло). Причина + похвала = уходишь тепло, он расскажет о тебе хорошее.",
      },
      {
        id: "aus-4",
        de: "Für 300 kann ich nichts Gutes machen — das wäre nicht fair Ihnen gegenüber.",
        ru: "За 300 ничего хорошего не сделаю — это было бы нечестно по отношению к вам.",
        when: "«А можно что-то маленькое за 200–300?»",
      },
      {
        id: "aus-5",
        de: "Kennen Sie zwei Betriebe, denen so eine Seite auch helfen würde?",
        ru: "Вы знаете два предприятия, которым такой сайт тоже помог бы?",
        when: "ВСЕГДА при выходе — и у клиента, и у не-клиента. Хозяйка салона — узел района: в кресле сидят владелицы бизнесов.",
      },
      {
        id: "aus-6",
        de: "Alles klar, kein Problem. Schönen Tag noch!",
        ru: "Всё ясно, без проблем. Хорошего дня!",
        when: "Твёрдое «нет». Без второго захода на спор.",
      },
    ],
  },
];

export const VERKAUF_TOTAL = VERKAUF_BLOCKS.reduce((n, b) => n + b.phrases.length, 0);
