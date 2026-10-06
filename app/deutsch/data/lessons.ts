export type VocabItem = {
  id: string;
  de: string;
  ru: string;
  hint?: string;
  example?: string;
  exampleRu?: string;
};

export type Correction = {
  said: string;
  need: string;
  when: string;
  example: string;
  exampleRu: string;
};

export type Triple = {
  id: string;
  base: string;
  comp: string;
  sup: string;
  ru: string;
  example: string;
  exampleRu: string;
};

export type HomeworkSentence = {
  id: string;
  de: string;
  ru: string;
};

export type StreetMove = {
  id: string;
  step: string;
  when: string;
  de: string;
  ru: string;
};

export type Lesson = {
  id: string;
  number: number;
  date: string;
  dateLabel: string;
  teacher: string;
  nextIso: string;
  nextLabel: string;
  minutes: number;
  topic: string;
  topicDe: string;
  win: { de: string; ru: string; note: string; highlight?: string };
  triplesTitle?: string;
  wordOfDay?: { de: string; ru: string; note: string };
  strengths: string[];
  stuck: string[];
  outline: string[];
  corrections: Correction[];
  extras: VocabItem[];
  grammarPoints: string[];
  triples: Triple[];
  examples: HomeworkSentence[];
  homework: HomeworkSentence[];
  street: StreetMove[];
  rule: { title: string; body: string };
  noteForTeacher: string;
};

export const LESSONS: Lesson[] = [
  {
    id: "2026-09-19",
    number: 1,
    date: "2026-09-19",
    dateLabel: "19. September 2026",
    teacher: "Ksenija Kanapelka",
    nextIso: "2026-09-22T08:00:00+02:00",
    nextLabel: "Dienstag, 22.09 · 08:00",
    minutes: 66,
    topic: "Степени сравнения прилагательных",
    topicDe: "Komparativ & Superlativ",
    win: {
      de: "Ich muss denken, was ich in meinem professionellen Leben machen muss.",
      ru: "Мне нужно подумать, что я должен делать в своей профессиональной жизни.",
      note: "В утверждении muss на 2-м месте. Во вложенном вопросе с was — в самом конце.",
      highlight: "machen muss",
    },
    triplesTitle: "Тройки до вторника",
    strengths: [
      "Говоришь долго своими темами — работа, семья, деньги. Не прячешься в ja/nein.",
      "Ксюша понимает с первого раза.",
      "После подсказки сам собрал фразу с muss в конце.",
    ],
    stuck: [
      "Мысль уже есть, а глагол не доезжает до конца.",
      "plus/minus вместо ungefähr.",
      "gern / lieber / am liebsten — ступени путались, пока не разложили на кофе, чай и сок.",
    ],
    outline: [
      "BlinHaus, год самозанятости, что делать самому",
      "Порядок слов с muss",
      "Племянник, брат Юра, Азия, Япония",
      "Новая тема: Komparativ und Superlativ",
      "Упражнения: DACH, кухня, кофе и пиво",
    ],
    corrections: [
      { said: "plus/minus", need: "ungefähr", when: "примерно", example: "Die Kampagne läuft ungefähr drei Wochen.", exampleRu: "Кампания идёт примерно три недели." },
      { said: "Nefte", need: "der Neffe", when: "племянник — сын брата", example: "Der Neffe übernimmt bald das Geschäft.", exampleRu: "Племянник скоро берёт фирму." },
      { said: "erklären", need: "erzählen", when: "расскажет всё", example: "Ich erzähle kurz, was die KI macht.", exampleRu: "Коротко расскажу, что делает ИИ." },
      { said: "von Januar", need: "seit Januar", when: "с января и до сих пор", example: "Wir schalten seit Januar Werbung.", exampleRu: "Мы крутим рекламу с января." },
      { said: "umzogen / wann", need: "umgezogen ist / wenn", when: "когда брат переехал", example: "Wenn der Betrieb umgezogen ist, braucht er eine neue Website.", exampleRu: "Если фирма переехала — нужна новая сайт-страница." },
      { said: "Star", need: "die Stadt", when: "в каком городе", example: "In welcher Stadt haben Sie mehr Anfragen?", exampleRu: "В каком городе больше заявок?" },
      { said: "Japonia", need: "Japan", when: "страна", example: "Japan ist für uns kein Markt.", exampleRu: "Япония для нас не рынок." },
      { said: "Welche Kunde", need: "welche Kunden", when: "какие клиенты", example: "Welche Kunden kommen aus Reels?", exampleRu: "Какие клиенты приходят с Reels?" },
      { said: "keine Wochenende", need: "kein Wochenende", when: "без выходных", example: "Kaltakquise kennt kein Wochenende.", exampleRu: "Холодные продажи не знают выходных." },
    ],
    extras: [
      { id: "ausgaben", de: "die Ausgaben", ru: "расходы", example: "Ads ohne Angebot erhöhen die Ausgaben.", exampleRu: "Реклама без оффера только жрёт бюджет." },
      { id: "gehalt", de: "das Gehalt / die Gehälter", ru: "зарплата", example: "KI ersetzt kein Gehalt, sie spart Zeit.", exampleRu: "ИИ не вместо зарплаты — он экономит время." },
      { id: "bekannt", de: "bekannt", ru: "известный", example: "In Wien sind Sie schon bekannt.", exampleRu: "В Вене вас уже знают." },
      { id: "insgesamt", de: "insgesamt", ru: "в целом", example: "Insgesamt bringen Reels mehr Termine.", exampleRu: "В целом Reels дают больше встреч." },
      { id: "haengt", de: "Das hängt vom Gericht ab.", ru: "Зависит от блюда.", example: "Das hängt vom Angebot ab.", exampleRu: "Это зависит от оффера." },
      { id: "chen", de: "-chen → das", ru: "Würstchen, Kätzchen — всегда das", example: "Das Angebotskärtchen liegt auf dem Tisch.", exampleRu: "Карточка оффера лежит на столе." },
      { id: "nichte", de: "die Nichte", ru: "племянница", example: "Die Nichte macht bei euch das Marketing.", exampleRu: "Племянница у вас ведёт маркетинг." },
      { id: "entscheiden", de: "Haben Sie etwas entschieden?", ru: "Вы что-то решили?", example: "Haben Sie sich für die Website entschieden?", exampleRu: "Вы уже решили по сайту?" },
    ],
    grammarPoints: [
      "Komparativ: прилагательное + er → schön → schöner.",
      "Короткое слово с a/o/u часто берёт умлаут: jung → jünger, alt → älter.",
      "Сравниваем через als: Auto 2 ist schneller als Auto 1.",
      "Если одинаково: genauso / so / gleich + прилагательное + wie.",
      "am liebsten — не «охотнее», а охотнее всего.",
      "mehr, не vieler: Deutschland hat mehr Einwohner.",
    ],
    triples: [
      { id: "gut", base: "gut", comp: "besser", sup: "am besten", ru: "хорошо / лучше / лучше всего", example: "Reels wirken besser als Posts.", exampleRu: "Reels работают лучше постов." },
      { id: "gern", base: "gern", comp: "lieber", sup: "am liebsten", ru: "охотно / охотнее / охотнее всего", example: "Kunden zahlen lieber für ein System.", exampleRu: "Клиенты охотнее платят за систему." },
      { id: "viel", base: "viel", comp: "mehr", sup: "am meisten", ru: "много / больше / больше всего", example: "Wir brauchen mehr Termine diese Woche.", exampleRu: "На этой неделе нужно больше встреч." },
      { id: "gross", base: "groß", comp: "größer", sup: "am größten", ru: "большой / больше / самый большой", example: "Der Betrieb ist größer als gedacht.", exampleRu: "Фирма больше, чем казалось." },
      { id: "hoch", base: "hoch", comp: "höher", sup: "am höchsten", ru: "высокий / выше / самый высокий", example: "Die Klickrate ist höher als im August.", exampleRu: "Кликабельность выше, чем в августе." },
      { id: "nah", base: "nah", comp: "näher", sup: "am nächsten", ru: "близкий / ближе / самый близкий", example: "Der nächste Schritt ist ein kurzer Termin.", exampleRu: "Следующий шаг — короткая встреча." },
    ],
    examples: [
      { id: "kaffee", de: "Ich trinke Kaffee gern.", ru: "Я охотно пью кофе." },
      { id: "tee", de: "Ich trinke Kaffee lieber als Tee.", ru: "Кофе я пью охотнее, чем чай." },
      { id: "saft", de: "Aber Saft trinke ich am liebsten.", ru: "Но сок я пью охотнее всего." },
      { id: "at", de: "Österreich ist größer als die Schweiz, aber kleiner als Deutschland.", ru: "Австрия больше Швейцарии, но меньше Германии." },
      { id: "bier", de: "In Deutschland trinkt man mehr Bier als Kaffee.", ru: "В Германии пьют больше пива, чем кофе." },
    ],
    homework: [
      { id: "h1", de: "Ich muss denken, was ich diese Woche selbst machen muss.", ru: "Мне нужно подумать, что я должен сделать сам на этой неделе." },
      { id: "h2", de: "Im September arbeite ich ungefähr ein Jahr als Selbstständiger.", ru: "В сентябре я работаю самозанятым уже примерно год." },
      { id: "h3", de: "Mein Neffe ist 24 und fliegt nach Asien.", ru: "Моему племяннику 24, он летит в Азию." },
      { id: "h4", de: "Mein älterer Bruder wohnt in Polen.", ru: "Мой старший брат живёт в Польше." },
      { id: "h5", de: "Japan interessiert mich mehr als China.", ru: "Япония мне интереснее, чем Китай." },
      { id: "h6", de: "In Wien ist das Hotel teurer als in Asien.", ru: "В Вене отель дороже, чем в Азии." },
      { id: "h7", de: "Ich trinke Kaffee gern, aber Wasser trinke ich am liebsten.", ru: "Кофе пью охотно, но воду — охотнее всего." },
      { id: "h8", de: "Das hängt von den Kunden ab.", ru: "Это зависит от клиентов." },
    ],
    street: [
      {
        id: "door",
        step: "Дверь",
        when: "Зашёл, назвался. Первая немецкая фраза — не про погоду.",
        de: "Ich erzähle kurz, was die KI macht.",
        ru: "Коротко расскажу, что делает ИИ.",
      },
      {
        id: "ask",
        step: "Вопрос",
        when: "Хозяин: «у нас и так клиенты есть».",
        de: "Welche Kunden kommen aus Reels?",
        ru: "Какие клиенты приходят с Reels?",
      },
      {
        id: "hinge",
        step: "Мостик",
        when: "Спрашивают «а вам что с того» или «это зависит».",
        de: "Das hängt vom Angebot ab.",
        ru: "Это зависит от оффера.",
      },
      {
        id: "hit",
        step: "Удар",
        when: "«Мы и так постим в инсту».",
        de: "Kunden zahlen lieber für ein System.",
        ru: "Клиенты охотнее платят за систему.",
      },
      {
        id: "close",
        step: "Выход",
        when: "Пора уходить или слышишь «надо подумать».",
        de: "Haben Sie sich für einen kurzen Termin entschieden?",
        ru: "Вы уже решили насчёт короткой встречи?",
      },
    ],
    rule: {
      title: "Plus/minus закрыт",
      body: "Услышал «примерно» — только ungefähr. Так Ксюша и сказала: plus/minus по-немецки не понятно.",
    },
    noteForTeacher:
      "Hallo Ksenija, danke für die Stunde. Die Aufnahme ist nur fürs Lernen. Nächstes Mal Dienstag um 8. Ich übe Komparativ und die Satzstellung mit „muss“.",
  },
  {
    id: "2026-09-22",
    number: 2,
    date: "2026-09-22",
    dateLabel: "22. September 2026",
    teacher: "Ksenija Kanapelka",
    nextIso: "2026-09-27T08:00:00+02:00",
    nextLabel: "Sonntag, 27.09 · 08:00",
    minutes: 60,
    topic: "Мнение, одинаково и gefallen",
    topicDe: "Meiner Meinung nach & gefallen",
    triplesTitle: "Тройки ещё раз + одинаково",
    win: {
      de: "Gefällt Ihnen das Ergebnis Ihrer Werbung?",
      ru: "Вам нравится результат вашей рекламы?",
      note: "Слово дня. Единственное — gefällt. Множественное — gefallen. Вам — Ihnen. Это можно сказать сегодня у двери.",
      highlight: "Gefällt Ihnen",
    },
    wordOfDay: {
      de: "gefallen",
      ru: "нравиться",
      note: "Тебе / вам + 3-е лицо. Книга — gefällt dir. Очки — gefallen dir. Реклама хозяину — Gefällt Ihnen das?",
    },
    strengths: [
      "Снова говоришь своими темами: сайт, ИИ, английский, Австрия. Не прячешься в ja/nein.",
      "Тройки с субботы почти собрал сам: gut — besser — am besten.",
      "Ксюша чинит одно слово и возвращает тебя в фразу. Ты это держишь.",
    ],
    stuck: [
      "möglich вместо vielleicht — «возможно», не «возможный».",
      "Одинаковые вещи через als. Надо wie: genauso groß wie.",
      "in meine Tasse — Dativ: in meiner Tasse.",
    ],
    outline: [
      "Ксюша смотрела тетрадь: карточки зашли, «возраст» на ungefähr сбил",
      "Сайт, ИИ, домашка с KI-Frau, подъём в 5:30",
      "Meiner Meinung nach / meine Meinung über",
      "Немецкий в кассе и Welche Sprache finden Sie schöner?",
      "Повтор троек и новое: genauso … wie",
      "Чашки, сон, здания, Франкфурт, слово дня gefallen",
    ],
    corrections: [
      { said: "möglich Deutsch", need: "vielleicht Deutsch", when: "возможно, не «возможный»", example: "Vielleicht brauchen Sie eine neue Website.", exampleRu: "Возможно, вам нужен новый сайт." },
      { said: "plus/minus", need: "ungefähr", when: "примерно, уровень", example: "Mein Englisch ist ungefähr Niveau A1.", exampleRu: "Мой английский примерно уровень A1." },
      { said: "Level", need: "das Niveau", when: "уровень языка", example: "Welches Niveau haben Ihre Kunden?", exampleRu: "Какой уровень у ваших клиентов?" },
      { said: "in meine Tasse", need: "in meiner Tasse", when: "где, Dativ", example: "In meiner Tasse ist mehr Kaffee.", exampleRu: "В моей чашке больше кофе." },
      { said: "genauso … als", need: "genauso … wie", when: "одинаково, не больше", example: "Die Seite muss genauso klar sein wie das Gespräch.", exampleRu: "Страница должна быть такой же ясной, как разговор." },
      { said: "größer (одинаковые)", need: "genauso groß wie", when: "башня = небоскрёб", example: "Der Kirchturm ist genauso groß wie das Hochhaus.", exampleRu: "Церковная башня такого же размера, как небоскрёб." },
      { said: "schleift", need: "schläft", when: "она спит", example: "Mia schläft länger als Lena.", exampleRu: "Мия спит дольше Лены." },
      { said: "passt oder nein", need: "passt oder nicht", when: "подходит или нет", example: "Passt das Angebot oder nicht?", exampleRu: "Оффер подходит или нет?" },
      { said: "in der Website", need: "auf der Website", when: "на сайте", example: "Auf der Website sieht man die Preise.", exampleRu: "На сайте видны цены." },
    ],
    extras: [
      { id: "meinung", de: "meiner Meinung nach", ru: "по моему мнению", example: "Meiner Meinung nach brauchen Sie ein System.", exampleRu: "По моему мнению, вам нужна система." },
      { id: "ueber", de: "meine Meinung über", ru: "моё мнение о", example: "Meine Meinung über Reels: sie bringen Termine.", exampleRu: "Моё мнение о Reels: они дают встречи." },
      { id: "gefallen", de: "gefallen / gefällt", ru: "нравиться", example: "Gefällt Ihnen das Ergebnis Ihrer Werbung?", exampleRu: "Вам нравится результат вашей рекламы?" },
      { id: "gebaeude", de: "das Gebäude", ru: "здание", example: "Gefällt Ihnen dieses Gebäude?", exampleRu: "Вам нравится это здание?" },
      { id: "gesicht", de: "das Gesicht", ru: "лицо", example: "Das Gesicht der Marke muss klar sein.", exampleRu: "Лицо марки должно быть ясным." },
      { id: "gesetz", de: "das Gesetz", ru: "закон", example: "Das Gesetz in Österreich ist streng.", exampleRu: "Закон в Австрии строгий." },
      { id: "gedicht", de: "das Gedicht", ru: "стих", example: "Ein Gedicht auf der Speisekarte bleibt im Kopf.", exampleRu: "Стих в меню остаётся в голове." },
      { id: "geschichte", de: "die Geschichte", ru: "история (исключение)", example: "Erzählen Sie kurz die Geschichte Ihres Betriebs.", exampleRu: "Коротко расскажите историю фирмы." },
      { id: "brille", de: "die Brille", ru: "очки", example: "Gefällt dir diese Brille?", exampleRu: "Тебе нравятся эти очки?" },
      { id: "aufstehen", de: "aufstehen / aufgestanden", ru: "вставать", example: "Ich bin um halb sechs aufgestanden.", exampleRu: "Я встал в половине шестого." },
      { id: "lachen", de: "lachen über", ru: "смеяться над", example: "Sie lacht über meine deutschen Wörter.", exampleRu: "Она смеётся над моими немецкими словами." },
    ],
    grammarPoints: [
      "Meiner Meinung nach + глагол: Meiner Meinung nach ist Deutsch jetzt wichtiger.",
      "Meine Meinung über + Akk: meine Meinung über Englisch.",
      "Разное: Komparativ + als. Одинаковое: прилагательное как есть + genauso … wie.",
      "Ксюша так и сказала: пиши genauso wie, не gleich wie и не genau wie.",
      "in + где = Dativ: in meiner Tasse, in deiner Tasse.",
      "gefallen: единственное gefällt, множественное gefallen. Вам — Ihnen.",
      "Ge- часто das: Gebäude, Gesicht, Gesetz, Gedicht. Исключение: die Geschichte.",
      "Алкоголь почти всегда der, кроме das Bier.",
    ],
    triples: [
      { id: "gut", base: "gut", comp: "besser", sup: "am besten", ru: "хорошо / лучше / лучше всего", example: "Reels wirken besser als Posts.", exampleRu: "Reels работают лучше постов." },
      { id: "gern", base: "gern", comp: "lieber", sup: "am liebsten", ru: "охотно / охотнее / охотнее всего", example: "Ich gehe lieber ins Gespräch als in die Werbung.", exampleRu: "Я охотнее иду в разговор, чем в рекламу." },
      { id: "viel", base: "viel", comp: "mehr", sup: "am meisten", ru: "много / больше / больше всего", example: "In Ihrer Tasse ist mehr Kaffee.", exampleRu: "В вашей чашке больше кофе." },
      { id: "gross", base: "groß", comp: "größer", sup: "am größten", ru: "большой / больше / самый большой", example: "Englisch öffnet größere Möglichkeiten.", exampleRu: "Английский открывает большие возможности." },
      { id: "nah", base: "nah", comp: "näher", sup: "am nächsten", ru: "близкий / ближе / самый близкий", example: "Der nächste Schritt ist ein kurzer Termin.", exampleRu: "Следующий шаг — короткая встреча." },
      { id: "lang", base: "lang", comp: "länger", sup: "am längsten", ru: "долгий / дольше / дольше всего", example: "Mia schläft länger als Lena.", exampleRu: "Мия спит дольше Лены." },
    ],
    examples: [
      { id: "gleich", de: "Auto 1 ist genauso schnell wie Auto 2.", ru: "Первая машина такая же быстрая, как вторая." },
      { id: "tasse", de: "In meiner Tasse ist genauso viel Kaffee wie in Ihrer.", ru: "В моей чашке столько же кофе, сколько в вашей." },
      { id: "turm", de: "Der Kirchturm ist genauso groß wie das Hochhaus.", ru: "Башня такого же размера, как небоскрёб." },
      { id: "schoener", de: "Welche Sprache finden Sie schöner — Deutsch oder Englisch?", ru: "Какой язык вам кажется красивее — немецкий или английский?" },
      { id: "gefällt", de: "Gefällt dir dieses Gebäude?", ru: "Тебе нравится это здание?" },
    ],
    homework: [
      { id: "h1", de: "Meiner Meinung nach ist Deutsch jetzt wichtiger.", ru: "По моему мнению, немецкий сейчас важнее." },
      { id: "h2", de: "Meine Meinung über Englisch: es öffnet größere Möglichkeiten.", ru: "Моё мнение об английском: он открывает большие возможности." },
      { id: "h3", de: "Vielleicht Deutsch. Für mich ist es praktischer.", ru: "Возможно, немецкий. Для меня он практичнее." },
      { id: "h4", de: "In meiner Tasse ist genauso viel Kaffee wie in Ihrer.", ru: "В моей чашке столько же кофе, сколько в вашей." },
      { id: "h5", de: "Mia schläft länger als Lena.", ru: "Мия спит дольше Лены." },
      { id: "h6", de: "Gefällt Ihnen das Ergebnis Ihrer Werbung?", ru: "Вам нравится результат вашей рекламы?" },
      { id: "h7", de: "Der Kirchturm ist genauso groß wie das Hochhaus.", ru: "Башня такого же размера, как небоскрёб." },
      { id: "h8", de: "Ich bin heute um halb sechs aufgestanden.", ru: "Сегодня я встал в половине шестого." },
    ],
    street: [
      {
        id: "door",
        step: "Дверь",
        when: "Зашёл. Первая фраза — мнение, не погода.",
        de: "Meiner Meinung nach brauchen Sie zwei Minuten.",
        ru: "По моему мнению, вам нужны две минуты.",
      },
      {
        id: "ask",
        step: "Вопрос",
        when: "Хозяин кивает или спрашивает, зачем ты здесь.",
        de: "Gefällt Ihnen das Ergebnis Ihrer Werbung?",
        ru: "Вам нравится результат вашей рекламы?",
      },
      {
        id: "hinge",
        step: "Мостик",
        when: "«Ну так себе» или «это зависит».",
        de: "Das hängt davon ab, wie klar das Angebot ist.",
        ru: "Это зависит от того, насколько ясный оффер.",
      },
      {
        id: "hit",
        step: "Удар",
        when: "«У нас и так сайт есть».",
        de: "Die Seite muss genauso klar sein wie das Gespräch an der Tür.",
        ru: "Страница должна быть такой же ясной, как разговор у двери.",
      },
      {
        id: "close",
        step: "Выход",
        when: "Пора уходить. Не plus/minus — ungefähr.",
        de: "Wann treffen wir uns das nächste Mal? Ungefähr zehn Minuten.",
        ru: "Когда встретимся в следующий раз? Примерно десять минут.",
      },
    ],
    rule: {
      title: "Одинаково — wie, не als",
      body: "Две одинаковые вещи: прилагательное как есть и genauso … wie. als только когда одно больше. Ксюша так и сказала: пиши genauso wie.",
    },
    noteForTeacher:
      "Hallo Ksenija, danke für die Stunde und dass du die Seite angeschaut hast. Die Karte «ungefähr» ist jetzt ohne «возраст». Nächstes Mal Sonntag 27.09 um 8. Ich übe meiner Meinung nach, genauso … wie und gefallen.",
  },
];

export function latestLesson(): Lesson {
  return LESSONS[LESSONS.length - 1];
}

export function getLesson(id?: string | null): Lesson {
  if (!id) return latestLesson();
  return LESSONS.find((item) => item.id === id) ?? latestLesson();
}

export function lessonCards(lesson: Lesson): VocabItem[] {
  const fromCorrections = lesson.corrections.map((c, i) => ({
    id: `${lesson.id}-fix-${i}`,
    de: c.need,
    ru: c.when,
    hint: `Ты говорил: ${c.said}`,
    example: c.example,
    exampleRu: c.exampleRu,
  }));
  const fromExtras = lesson.extras.map((item) => ({
    ...item,
    id: `${lesson.id}-${item.id}`,
  }));
  const fromTriples = lesson.triples.map((t) => ({
    id: `${lesson.id}-tri-${t.id}`,
    de: `${t.base} · ${t.comp} · ${t.sup}`,
    ru: t.ru,
    example: t.example,
    exampleRu: t.exampleRu,
  }));
  return [...fromCorrections, ...fromExtras, ...fromTriples];
}

export function emphasizeWin(text: string, highlight?: string) {
  if (!highlight || !text.includes(highlight)) {
    return { before: text, mark: "", after: "" };
  }
  const at = text.indexOf(highlight);
  return {
    before: text.slice(0, at),
    mark: highlight,
    after: text.slice(at + highlight.length),
  };
}
