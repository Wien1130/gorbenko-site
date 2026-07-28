import { requireAndriiAuth } from "../auth-check";
import AndriiShell from "../AndriiShell";

export const metadata = { robots: { index: false, follow: false } };

const PILARS = [
  { id: 1, label: "KI löst das", badge: "accent", pct: "35%" },
  { id: 2, label: "Live-Check", badge: "blue", pct: "20%" },
  { id: 3, label: "Marketing & Verkauf", badge: "amber", pct: "20%" },
  { id: 4, label: "Wien / Journey", badge: "pink", pct: "15%" },
  { id: 5, label: "Mythen", badge: "purple", pct: "10%" },
] as const;

const CTA_BLOCKS = [
  {
    key: "A", name: "CTA-A · Подписка (рост)",
    de: "Ich bin Andrii. Ich zeige dir, wie KI deinen Alltag und dein Business einfacher macht — auf Deutsch, direkt aus Wien. Folg mir für mehr.",
    ru: "Я Андрей. Показываю, как ИИ упрощает твою жизнь и бизнес — на немецком, прямо из Вены. Подпишись.",
  },
  {
    key: "B", name: "CTA-B · Лид (бизнес)",
    de: "Willst du wissen, was die KI über dein Geschäft sagt? Schreib mir „KI“ — kostenloses Gespräch, du gehst mit 3 Ideen raus.",
    ru: "Хочешь узнать, что ИИ говорит о твоём бизнесе? Напиши мне «KI» в директ — бесплатная консультация, уйдёшь с 3 идеями.",
  },
  {
    key: "C", name: "CTA-C · Комментарий (охват)",
    de: "Schreib «KI» in die Kommentare — ich schicke dir die Anleitung.",
    ru: "Напиши «KI» в комментарии — пришлю инструкцию.",
  },
] as const;

type Script = {
  num: number; pilar: 1 | 2 | 3 | 4 | 5; title: string; priority?: string;
  hookDe: string; hookRu: string;
  midDe: string; midRu: string;
  cta: "A" | "B" | "C";
  shoot: string;
};

const SCRIPTS: Script[] = [
  // ── СЕГОДНЯ ──
  {
    num: 1, pilar: 4, title: "Ausländer dreht auf Deutsch (манифест)", priority: "⭐⭐⭐ СЕГОДНЯ · №1",
    hookDe: "Ich bin Ausländer. Mein Deutsch ist nicht perfekt. Und ich drehe trotzdem jeden Tag drei Videos auf Deutsch.",
    hookRu: "Я иностранец. Мой немецкий не идеален. И я всё равно снимаю три видео в день на немецком.",
    midDe: "Ich baue mein Business in Wien auf — mit KI, Marketing und Websites. Meine Kunden sind hier. Also lerne ich eure Sprache — vor der Kamera, mit Fehlern. Und wir finden zusammen raus, wie KI unsere Alltagsprobleme löst: Briefe vom Amt, Verträge, Business. Schau zu.",
    midRu: "Строю бизнес в Вене — ИИ, маркетинг, сайты. Мои клиенты здесь. Поэтому учу ваш язык — перед камерой, с ошибками. И мы вместе разберёмся, как ИИ решает наши жизненные вопросы: письма из ведомств, договоры, бизнес. Смотри.",
    cta: "A",
    shoot: "Прямо в камеру, красивый венский фон (Stephansplatz / канал). Искренне, без монтажной полировки. Личный ролик = лучший старт аккаунта.",
  },
  {
    num: 2, pilar: 2, title: "Live-Check: Café Wien", priority: "⭐⭐⭐ СЕГОДНЯ · №2",
    hookDe: "Ich habe ChatGPT gefragt: Wo ist das beste Café in Wien? Die Antwort ist ein Problem für 90% der Lokale.",
    hookRu: "Я спросил ChatGPT: где лучшее кафе в Вене? Ответ — проблема для 90% заведений.",
    midDe: "Schau: ChatGPT empfiehlt diese drei Cafés. Warum genau diese? Gute Google-Bewertungen, klare Website, Presse-Erwähnungen. Tausende andere Lokale existieren für die KI einfach nicht. Deine Gäste fragen heute die KI — nicht mehr nur Google.",
    midRu: "Смотри: ChatGPT рекомендует эти три кафе. Почему именно их? Хорошие отзывы в Google, понятный сайт, упоминания в прессе. Тысячи других заведений для ИИ просто не существуют. Гости сегодня спрашивают ИИ, а не только Google.",
    cta: "B",
    shoot: "Запись экрана с ответом ChatGPT + talking head. Можно снять у витрины кафе. Конфликт виден за 0,5 сек. Формат-серия: дальше любая ниша.",
  },
  {
    num: 31, pilar: 4, title: "Blick auf Wien — was ich hier mache", priority: "⭐⭐⭐ СЕГОДНЯ · №3 (со ступенек)",
    hookDe: "Von hier oben sieht Wien perfekt aus. Aber ich sehe 10.000 Geschäfte, die niemand findet.",
    hookRu: "Отсюда сверху Вена выглядит идеально. Но я вижу десять тысяч бизнесов, которых никто не находит.",
    midDe: "Ich mache Marketing in Wien — Websites, Werbung, KI. Und jeden Tag sehe ich das Gleiche: tolles Café, tolle Arbeit — aber keine Bewertungen, keine Website. Für ChatGPT existieren sie nicht. Die besten Geschäfte sind oft unsichtbar. Genau das ändere ich — und hier zeige ich, wie. Jeden Tag, drei Videos.",
    midRu: "Я делаю маркетинг в Вене — сайты, реклама, ИИ. И каждый день вижу одно и то же: отличное кафе, отличная работа — но нет отзывов, нет сайта. Для ChatGPT их не существует. Лучшие бизнесы часто невидимы. Именно это я меняю — и здесь показываю как. Каждый день, три видео.",
    cta: "A",
    shoot: "Первые 2 сек — чистая панорама города (стоп-скролл), потом разворот на себя, город за плечом. Говори по опорам, не дословно. Одна ошибка в DE — не переснимай. CTA A клеится в монтаже; если блоков ещё нет — снять A/B/C там же на ступеньках (фон шикарный).",
  },
  {
    num: 3, pilar: 1, title: "Brief vom Amt → KI übersetzt", priority: "⭐ ЗАВТРА · первый",
    hookDe: "Brief vom Finanzamt bekommen und nichts verstanden? Mach genau das.",
    hookRu: "Получил письмо из налоговой и ничего не понял? Сделай вот что.",
    midDe: "Foto vom Brief machen. In ChatGPT hochladen. Schreiben: «Erkläre mir diesen Brief in einfachen Worten. Was muss ich tun und bis wann?» Fertig. Die KI erklärt Amtsdeutsch besser als das Amt selbst. Funktioniert auch mit Verträgen.",
    midRu: "Сфотографируй письмо. Загрузи в ChatGPT. Напиши: «Объясни это письмо простыми словами. Что мне делать и до когда?» Готово. ИИ объясняет канцелярский немецкий лучше самого ведомства. Работает и с договорами.",
    cta: "C",
    shoot: "Экран телефона крупно: фото письма → ответ. Боль каждого в DACH (даже носителей!). Огромный виральный потенциал.",
  },

  // ── Пилар 1 · KI löst das ──
  {
    num: 4, pilar: 1, title: "200 € für 30 Sekunden Arbeit",
    hookDe: "Du zahlst 200 Euro für etwas, das dein Handy in 30 Sekunden kostenlos macht.",
    hookRu: "Ты платишь 200 евро за то, что твой телефон делает за 30 секунд бесплатно.",
    midDe: "Bewerbungsfoto? KI. Text für die Website? KI. Logo-Entwurf? KI. Übersetzung? KI. Ich zeige dir ein Beispiel live: [одна задача на выбор — показать от и до]. Nicht perfekt? Doch — gut genug für den Start. Und der Start ist alles.",
    midRu: "Фото на резюме? ИИ. Текст для сайта? ИИ. Черновик логотипа? ИИ. Перевод? ИИ. Показываю один пример вживую от и до. Не идеально? Нет — достаточно хорошо для старта. А старт — это всё.",
    cta: "A",
    shoot: "Динамично, экран + лицо. Каждый подпункт потом раскрутить в отдельный ролик.",
  },
  {
    num: 5, pilar: 1, title: "Vertrag-Fallen finden",
    hookDe: "Unterschreib keinen Vertrag, bevor du das gemacht hast.",
    hookRu: "Не подписывай договор, пока не сделал вот это.",
    midDe: "Vertrag fotografieren, in die KI laden: «Wo sind die Risiken für mich? Welche Klauseln sind unüblich?» Die KI findet die Kündigungsfrist, die versteckten Kosten, die automatische Verlängerung. Kein Ersatz für einen Anwalt — aber der beste erste Check für null Euro.",
    midRu: "Сфотографируй договор, загрузи в ИИ: «Где риски для меня? Какие пункты нетипичны?» ИИ найдёт срок расторжения, скрытые платежи, автопродление. Это не замена юристу — но лучшая первая проверка за ноль евро.",
    cta: "C",
    shoot: "Серьёзный тон, палец по пунктам договора. Fitnessstudio-Vertrag как пример — все узнают себя.",
  },
  {
    num: 6, pilar: 1, title: "Bewerbung in 10 Minuten",
    hookDe: "Deine Bewerbung dauert 3 Stunden? Meine dauert 10 Minuten — und sie ist besser.",
    hookRu: "Твоё резюме занимает 3 часа? Моё — 10 минут, и оно лучше.",
    midDe: "Stellenanzeige kopieren. Deinen alten Lebenslauf hochladen. Prompt: «Passe meinen Lebenslauf an diese Stelle an und schreib ein Anschreiben — ehrlich, ohne Übertreibung.» Dann 5 Minuten selbst lesen und korrigieren. Das ist der Punkt: KI macht den Entwurf, du machst die Wahrheit.",
    midRu: "Скопируй вакансию. Загрузи старое резюме. Промпт: «Адаптируй моё резюме под эту вакансию и напиши сопроводительное — честно, без преувеличений». Потом 5 минут сам читаешь и правишь. В этом суть: ИИ делает черновик, ты делаешь правду.",
    cta: "A",
    shoot: "Таймер на экране. Темп быстрый. Широчайшая аудитория: студенты, соискатели.",
  },
  {
    num: 7, pilar: 1, title: "Preisverhandlung per E-Mail",
    hookDe: "Der Handwerker wollte 4.800 Euro. Nach einer E-Mail waren es 3.900. Die E-Mail hat KI geschrieben.",
    hookRu: "Мастер хотел 4 800 евро. После одного письма стало 3 900. Письмо написал ИИ.",
    midDe: "Angebot in die KI laden: «Schreib eine höfliche Antwort: Ich habe ein günstigeres Vergleichsangebot. Frag, ob beim Preis etwas möglich ist. Deutsch, kurz, respektvoll.» Höflich verhandeln funktioniert in Österreich — man muss nur die richtigen Worte finden. Die KI findet sie.",
    midRu: "Загрузи смету в ИИ: «Напиши вежливый ответ: у меня есть предложение дешевле. Спроси, возможно ли что-то по цене. По-немецки, коротко, уважительно». Вежливый торг в Австрии работает — надо лишь найти правильные слова. ИИ их находит.",
    cta: "C",
    shoot: "История с цифрами на экране. Числа в хуке = стоп-скролл.",
  },
  {
    num: 8, pilar: 1, title: "Website in 15 Minuten (live)",
    hookDe: "Eine Agentur sagt: 3.000 Euro und 6 Wochen. Ich baue dir jetzt eine Website in 15 Minuten.",
    hookRu: "Агентство говорит: 3 000 евро и 6 недель. Я сейчас соберу сайт за 15 минут.",
    midDe: "Live und ohne Schnitt-Tricks: Business beschreiben, KI generiert die Seite, Texte anpassen, Domain verbinden. Ist das eine perfekte Website? Nein. Ist sie besser als keine Website? Tausendmal ja. Und für die perfekte — weißt du, wo du mich findest.",
    midRu: "Вживую и без монтажных трюков: описываю бизнес, ИИ генерирует страницу, правлю тексты, подключаю домен. Это идеальный сайт? Нет. Лучше, чем никакого? В тысячу раз. А за идеальным — знаешь, где меня найти.",
    cta: "B",
    shoot: "Таймлапс экрана + перебивки лица. Самоирония про агентство — я же и есть агентство.",
  },
  {
    num: 9, pilar: 1, title: "Speisekarte-Trick im Urlaub",
    hookDe: "Dieser Trick spart dir im Urlaub Geld und schlechtes Essen.",
    hookRu: "Этот трюк в отпуске сэкономит тебе деньги и спасёт от плохой еды.",
    midDe: "Speisekarte fotografieren → KI: «Übersetze, markiere lokale Spezialitäten und typische Touristenfallen.» Bonus: «Fasse die Google-Bewertungen von diesem Restaurant zusammen — was loben alle, was kritisieren alle?» Zwei Minuten — und du isst wie ein Local.",
    midRu: "Сфотографируй меню → ИИ: «Переведи, отметь локальные блюда и типичные туристические ловушки». Бонус: «Суммируй отзывы Google об этом ресторане — что все хвалят, что ругают?» Две минуты — и ешь как местный.",
    cta: "A",
    shoot: "Снять в венском ресторане/кафе. Сезонный (лето, отпуска) — выпустить быстро.",
  },
  {
    num: 10, pilar: 1, title: "KI plant deine Woche",
    hookDe: "Sonntag, 20 Uhr. Ich plane meine ganze Woche in 5 Minuten — mit einem Prompt.",
    hookRu: "Воскресенье, 20:00. Планирую всю неделю за 5 минут — одним промптом.",
    midDe: "Ich diktiere der KI alles, was ansteht — chaotisch, wie es mir einfällt. Prompt: «Mach daraus einen Wochenplan: wichtig zuerst, ähnliche Aufgaben zusammen, realistische Zeiten, Pausen.» Das Ergebnis kommt in meinen Kalender. Chaos rein, Plan raus.",
    midRu: "Надиктовываю ИИ всё, что предстоит — хаотично, как приходит в голову. Промпт: «Сделай из этого недельный план: важное сначала, похожие задачи вместе, реалистичное время, паузы». Результат — в календарь. Хаос на входе, план на выходе.",
    cta: "C",
    shoot: "Вечер, уютно, экран телефона. Показать реальный свой план (это и есть лайфстайл-нить).",
  },
  {
    num: 11, pilar: 1, title: "Produktfotos ohne Fotograf",
    hookDe: "Dieses Produktfoto hat keinen Fotografen gesehen. Es hat 0 Euro gekostet.",
    hookRu: "Это продуктовое фото не видело фотографа. Оно стоило 0 евро.",
    midDe: "Produkt auf den Tisch, Handyfoto bei Tageslicht. Dann KI: Hintergrund weg, neuer Hintergrund — Studio, Marmor, Natur. Vorher-Nachher nebeneinander. Für Instagram und Web-Shop reicht das zu 100%. Kleine Geschäfte in Wien: ihr braucht dafür niemanden mehr.",
    midRu: "Товар на стол, фото на телефон при дневном свете. Потом ИИ: убрать фон, новый фон — студия, мрамор, природа. До/после рядом. Для Instagram и интернет-магазина этого хватает на 100%. Малый бизнес Вены: вам для этого больше никто не нужен.",
    cta: "B",
    shoot: "До/после — сплит-скрин. Взять реальный товар (нож Штефана? латекс не надо 🙂).",
  },
  {
    num: 12, pilar: 1, title: "Serie: 1 Prompt pro Tag",
    hookDe: "Ein Prompt pro Tag, der dir eine Stunde spart. Tag 1.",
    hookRu: "Один промпт в день, который экономит тебе час. День 1.",
    midDe: "Heute: «Fasse diesen Text / dieses PDF / dieses YouTube-Video in 5 Punkten zusammen. Dann stell mir 3 Fragen, um zu prüfen, ob ich es verstanden habe.» Der zweite Satz ist der Trick — die KI wird dein Lehrer, nicht dein Ersatz.",
    midRu: "Сегодня: «Суммируй этот текст / PDF / видео в 5 пунктах. Потом задай мне 3 вопроса — проверь, понял ли я». Второе предложение — и есть трюк: ИИ становится твоим учителем, а не заменой.",
    cta: "A",
    shoot: "Рубрика-сериал с единой обложкой «Tag N». Серии = подписки и возвраты (проверено на проекте Оли).",
  },

  // ── Пилар 2 · Live-Check ──
  {
    num: 13, pilar: 2, title: "Live-Check: Zahnarzt Wien",
    hookDe: "ChatGPT, ich brauche einen Zahnarzt in Wien. Wen empfiehlst du? Das Ergebnis überrascht.",
    hookRu: "ChatGPT, мне нужен стоматолог в Вене. Кого посоветуешь? Результат удивляет.",
    midDe: "Drei Namen. Ich prüfe: Warum diese? Nummer eins hat 400 Bewertungen und eine FAQ-Seite, die Fragen wirklich beantwortet. Und jetzt das Verrückte: die größte Klinik der Stadt ist NICHT dabei. Teuerste Werbung, null KI-Sichtbarkeit.",
    midRu: "Три имени. Проверяю: почему эти? Номер один — 400 отзывов и FAQ-страница, которая реально отвечает на вопросы. А теперь безумное: самой большой клиники города в списке НЕТ. Самая дорогая реклама — ноль видимости в ИИ.",
    cta: "B",
    shoot: "Экран + лицо. Драматургия: №1 похвалить → отсутствие гиганта = твист.",
  },
  {
    num: 14, pilar: 2, title: "Dein Geschäft ist unsichtbar",
    hookDe: "Dein Geschäft hat für die KI... falsche Öffnungszeiten. Seit zwei Jahren.",
    hookRu: "У твоего бизнеса для ИИ… неправильные часы работы. Уже два года.",
    midDe: "Ich frage die KI nach einem echten Wiener Geschäft: Öffnungszeiten falsch, Preise von 2023, alte Adresse. Der Besitzer weiß nichts davon. Aber seine Kunden bekommen genau diese Antworten. Die KI lügt nicht — sie liest nur, was im Netz steht. Und bei dir steht Müll.",
    midRu: "Спрашиваю ИИ о реальном венском бизнесе: часы неверные, цены 2023 года, старый адрес. Владелец об этом не знает. А клиенты получают именно эти ответы. ИИ не врёт — он читает то, что лежит в сети. А у тебя там лежит мусор.",
    cta: "B",
    shoot: "Страх-фактор для владельцев. Бизнес не называть/замазать — показать механику, не позорить.",
  },
  {
    num: 15, pilar: 2, title: "Live-Check: Restaurant-Abend",
    hookDe: "Wir lassen heute die KI entscheiden, wo wir essen. Komm mit.",
    hookRu: "Сегодня пусть ИИ решает, где мы ужинаем. Пойдём со мной.",
    midDe: "Prompt: «Bestes Abendessen in Wien für zwei, nicht touristisch, unter 80 Euro.» KI wählt — wir gehen hin. Vlog: War die Empfehlung gut? Und am Ende die Business-Frage: Warum hat die KI DIESES Restaurant gewählt? Bewertungen, Presse, Website.",
    midRu: "Промпт: «Лучший ужин в Вене на двоих, не туристический, до 80 евро». ИИ выбирает — идём. Влог: хороша ли рекомендация? И в конце бизнес-вопрос: почему ИИ выбрал ИМЕННО этот ресторан? Отзывы, пресса, сайт.",
    cta: "A",
    shoot: "Вечерняя Вена, влог-формат, можно с Алиной. Развлечение снаружи, бизнес-урок внутри.",
  },
  {
    num: 16, pilar: 2, title: "Meta: Agentur-Check (самоирония)",
    hookDe: "Ich habe ChatGPT gefragt, welche Marketing-Agentur in Wien gut ist. Meine war nicht dabei. Autsch.",
    hookRu: "Я спросил ChatGPT, какое маркетинговое агентство в Вене хорошее. Моего в списке не было. Ауч.",
    midDe: "Ehrlich: Ich helfe Firmen, in KI-Antworten sichtbar zu werden — und bin selbst noch nicht drin. Warum? Mein Business ist neu. Also dokumentiere ich es: Jeden Monat frage ich die KI wieder. Ihr seht live, wie lange es dauert und was genau funktioniert.",
    midRu: "Честно: я помогаю фирмам становиться видимыми в ответах ИИ — а сам ещё не там. Почему? Бизнес новый. Поэтому документирую: каждый месяц спрашиваю ИИ заново. Вы вживую увидите, сколько это занимает и что именно работает.",
    cta: "A",
    shoot: "Самоирония + сериал «эксперимент над собой». Максимальное доверие: продаю то, что делаю себе.",
  },
  {
    num: 17, pilar: 2, title: "Vorher/Nachher: der Messerschmied",
    hookDe: "Vor drei Monaten kannte die KI diesen Wiener Handwerker nicht. Heute empfiehlt sie ihn. Das haben wir gemacht.",
    hookRu: "Три месяца назад ИИ не знал этого венского мастера. Сегодня — рекомендует. Вот что мы сделали.",
    midDe: "Kurz die drei Schritte: Bewertungen systematisch sammeln, eine Expertenseite, konsistente Daten überall. Keine Magie, kein Trick — Handwerk. Screenshots vorher/nachher mit Datum.",
    midRu: "Коротко три шага: системный сбор отзывов, одна экспертная страница, одинаковые данные везде. Никакой магии и трюков — ремесло. Скриншоты до/после с датами.",
    cta: "B",
    shoot: "⚠️ Снимать ПОСЛЕ согласия Штефана и реальных результатов пилота Nagl. Пока — в очереди.",
  },

  // ── Пилар 3 · Marketing & Verkauf ──
  {
    num: 18, pilar: 3, title: "Ich war in 30 Geschäften",
    hookDe: "Ich bin in 30 Wiener Geschäfte gegangen und habe versucht, etwas zu verkaufen. Das habe ich gelernt.",
    hookRu: "Я зашёл в 30 венских бизнесов и попробовал продать. Вот что я понял.",
    midDe: "Die Zahlen: 30 Besuche, 15 Gespräche, 5 Termine, 1 Kunde. Die drei Fehler, die ich gemacht habe — und der eine Satz, der Türen öffnet: «Ich habe eine konkrete Idee für Ihr Geschäft — 2 Minuten?» Kaltakquise ist nicht tot. Sie ist nur ehrlich geworden.",
    midRu: "Цифры: 30 визитов, 15 разговоров, 5 встреч, 1 клиент. Три моих ошибки — и одна фраза, открывающая двери: «У меня конкретная идея для вашего бизнеса — 2 минуты?» Холодные продажи не умерли. Они просто стали честными.",
    cta: "A",
    shoot: "Реальные цифры из твоей CRM (cold-sales). Ходьба по Вене, перебивки улиц. Дневник + польза.",
  },
  {
    num: 19, pilar: 3, title: "3 Website-Fehler = keine Anrufe",
    hookDe: "Deine Website ist schön. Und trotzdem ruft niemand an. Hier sind die drei Gründe.",
    hookRu: "Твой сайт красивый. И всё равно никто не звонит. Вот три причины.",
    midDe: "Eins: Die Nummer ist nicht klickbar — am Handy ist das tödlich. Zwei: Keine Preise, nicht mal «ab». Der Kunde denkt: zu teuer. Drei: «Willkommen auf unserer Website» statt einer Antwort auf seine Frage. Dein erster Satz muss sein Problem nennen — nicht deinen Namen.",
    midRu: "Раз: номер телефона некликабельный — на мобильном это смертельно. Два: нет цен, даже «от». Клиент думает: дорого. Три: «Добро пожаловать на наш сайт» вместо ответа на его вопрос. Первая фраза должна называть его проблему, а не твоё имя.",
    cta: "B",
    shoot: "Показать примеры на экране (анонимно). Список из 3 — динамично, цифры на экране.",
  },
  {
    num: 20, pilar: 3, title: "Bewertungen: die 1-Satz-Maschine",
    hookDe: "Dein Konkurrent hat 200 Google-Bewertungen, du hast 12. Er macht nur eine Sache anders.",
    hookRu: "У конкурента 200 отзывов в Google, у тебя 12. Он делает лишь одну вещь иначе.",
    midDe: "Er FRAGT. Nach jedem Auftrag, ein Satz: «Wenn Sie zufrieden waren — eine Google-Bewertung hilft mir enorm» — plus QR-Code auf der Rechnung. Das ist alles. Bewertungen sind heute doppelt wichtig: Menschen lesen sie und die KI liest sie auch.",
    midRu: "Он ПРОСИТ. После каждого заказа одна фраза: «Если вы довольны — отзыв в Google мне очень поможет» — плюс QR-код на счёте. Это всё. Отзывы сегодня важны вдвойне: их читают люди и их читает ИИ.",
    cta: "C",
    shoot: "Просто и прикладно. QR-код показать физически. Владельцы пересылают друг другу.",
  },
  {
    num: 21, pilar: 3, title: "10 € Werbung pro Tag — ehrlich",
    hookDe: "Was bringen 10 Euro Werbung pro Tag wirklich? Ich zeige dir echte Zahlen.",
    hookRu: "Что реально дают 10 евро рекламы в день? Показываю настоящие цифры.",
    midDe: "Echte Kampagne: 300 Euro im Monat → so viele Klicks → so viele Anfragen → so viele Kunden. Wann 10 Euro reichen (lokales Geschäft, klares Angebot) und wann sie Geldverbrennung sind (keine gute Website, kein Angebot). Werbung verstärkt — sie repariert nicht.",
    midRu: "Реальная кампания: 300 евро в месяц → столько-то кликов → заявок → клиентов. Когда 10 евро хватает (локальный бизнес, понятный оффер) и когда это сжигание денег (нет нормального сайта и оффера). Реклама усиливает — она не чинит.",
    cta: "B",
    shoot: "Цифры из реальных кампаний (Rubberik/Colombo — анонимно). Скрины Ads Manager.",
  },
  {
    num: 22, pilar: 3, title: "«Zu teuer» — die richtige Antwort",
    hookDe: "Kunde sagt: «Zu teuer.» Die meisten antworten falsch. So geht's richtig.",
    hookRu: "Клиент говорит: «Дорого». Большинство отвечает неправильно. Вот как надо.",
    midDe: "Falsch: sofort Rabatt. Damit sagst du: Mein Preis war gelogen. Richtig: eine Frage zurück — «Zu teuer im Vergleich wozu?» Dann hörst du das echte Problem. Meistens ist es nicht der Preis — es ist Unsicherheit. Und Unsicherheit löst man mit Beispielen, nicht mit Rabatten.",
    midRu: "Неправильно: сразу скидка. Этим ты говоришь: моя цена была враньём. Правильно: вопрос в ответ — «Дорого по сравнению с чем?» И ты услышишь настоящую проблему. Чаще всего это не цена — это неуверенность. А её лечат примерами, не скидками.",
    cta: "A",
    shoot: "Разыграть диалог за двоих (смена ракурса). Продажники и мастера пересылают друг другу.",
  },
  {
    num: 23, pilar: 3, title: "Dein Angebot in 1 Satz",
    hookDe: "Wenn du dein Angebot nicht in einem Satz sagen kannst, verlierst du jeden Tag Kunden.",
    hookRu: "Если не можешь сказать своё предложение одной фразой — теряешь клиентов каждый день.",
    midDe: "Test: «Wir sind ein innovatives Unternehmen für individuelle Lösungen» — was verkauft diese Firma? Keine Ahnung. Formel: Ich helfe [wem] bei [Problem] — [wie]. «Ich schärfe Wiener Küchenmesser in 24 Stunden.» Sofort klar. Schreib deinen Satz in die Kommentare — ich gebe Feedback.",
    midRu: "Тест: «Мы инновационная компания индивидуальных решений» — что продаёт эта фирма? Непонятно. Формула: я помогаю [кому] с [проблемой] — [как]. «Точу венские кухонные ножи за 24 часа». Сразу ясно. Напиши свою фразу в комментарии — дам обратную связь.",
    cta: "C",
    shoot: "CTA в комментарии = вовлечение + лиды одновременно. Отвечать на все комментарии!",
  },

  // ── Пилар 4 · Wien / Journey ──
  {
    num: 24, pilar: 4, title: "Serie: Ausländer-Business-Tagebuch",
    hookDe: "Ein Ausländer baut in Wien ein Business auf — von null. Woche 1: die ehrlichen Zahlen.",
    hookRu: "Иностранец строит бизнес в Вене — с нуля. Неделя 1: честные цифры.",
    midDe: "Was diese Woche passiert ist: so viele Gespräche, so viele Absagen, so viel verdient. Was funktioniert hat, was nicht. Keine Erfolgs-Show — ein Logbuch. Nächste Woche: [конкретная цель недели].",
    midRu: "Что случилось за неделю: столько-то разговоров, отказов, заработано. Что сработало, что нет. Не шоу успеха — бортовой журнал. На следующей неделе: [конкретная цель].",
    cta: "A",
    shoot: "Еженедельная рубрика, единая обложка «Woche N». Цифры из CRM. Уязвимость = удержание.",
  },
  {
    num: 25, pilar: 4, title: "Wien-Spot + 1 Business-Lektion",
    hookDe: "Der schönste Arbeitsplatz der Welt ist kostenlos. Und hier habe ich heute etwas Wichtiges verstanden.",
    hookRu: "Красивейшее рабочее место в мире — бесплатное. И здесь я сегодня понял кое-что важное.",
    midDe: "[Место: Schönbrunn / Donaukanal / Kahlenberg / Karlsplatz…] + одна мысль дня из реальной работы: урок из встречи, отказа, разговора с клиентом. Kurz, persönlich, ein Gedanke.",
    midRu: "Красивое место Вены + одна мысль дня из реальной работы: урок из встречи, отказа, разговора. Коротко, лично, одна мысль. Формат-заготовка: каждый раз новое место и новый урок.",
    cta: "A",
    shoot: "Формат-конструктор на каждый день, когда нет времени: место + мысль = готовый ролик за 10 минут.",
  },
  {
    num: 26, pilar: 4, title: "Was kostet Business in Wien",
    hookDe: "Was kostet es wirklich, in Wien ein Business zu starten? Alle Zahlen, ohne Filter.",
    hookRu: "Сколько реально стоит запустить бизнес в Вене? Все цифры без фильтров.",
    midDe: "Gewerbeschein: so viel. SVS-Versicherung: so viel pro Monat (die Zahl schockiert jeden). Steuerberater, WKO, Software. Gesamt: Zahl. Und was davon man am Anfang wirklich braucht — und was warten kann.",
    midRu: "Лицензия: столько. Страховка SVS: столько в месяц (эта цифра шокирует всех). Бухгалтер, WKO, софт. Итого: цифра. И что из этого реально нужно на старте, а что подождёт.",
    cta: "C",
    shoot: "Цифры крупно на экране. Мечтающие об эмиграции + местные начинающие — огромный сегмент.",
  },
  {
    num: 27, pilar: 4, title: "Stephansplatz: unsichtbare Geschäfte",
    hookDe: "Ich stehe am Stephansplatz. Um mich herum: 50 Geschäfte. Für die KI existiert die Hälfte nicht.",
    hookRu: "Стою на Штефансплац. Вокруг — 50 бизнесов. Для ИИ половины не существует.",
    midDe: "Live-Test mitten in Wien: Ich frage die KI nach Geschäften genau hier. Wer wird empfohlen, wer ist unsichtbar? Das teuerste Pflaster Österreichs — und digital sind viele ein leeres Grundstück.",
    midRu: "Живой тест в центре Вены: спрашиваю ИИ о бизнесах прямо здесь. Кого рекомендует, кто невидим? Самая дорогая земля Австрии — а в цифре многие из них пустырь.",
    cta: "B",
    shoot: "Красивейший фон города + фирменный Live-Check = пилар 4 встречает пилар 2. Туристы в кадре — динамика.",
  },

  // ── Пилар 5 · Mythen ──
  {
    num: 28, pilar: 5, title: "Mythos: SEO ist tot",
    hookDe: "«SEO ist tot, jetzt ist alles KI.» Wer dir das sagt, will dir etwas verkaufen.",
    hookRu: "«SEO умерло, теперь всё — ИИ». Кто тебе это говорит — хочет тебе что-то продать.",
    midDe: "Die Wahrheit: Die KI liest dieselben Quellen, die Google rankt. Gutes SEO ist das Fundament der KI-Sichtbarkeit — sie sind Geschwister, keine Feinde. Wer sein SEO löscht, verschwindet aus BEIDEN Welten.",
    midRu: "Правда: ИИ читает те же источники, которые ранжирует Google. Хорошее SEO — фундамент видимости в ИИ, они братья, а не враги. Кто бросает SEO — исчезает из ОБОИХ миров.",
    cta: "B",
    shoot: "Уверенный экспертный тон. Споры в комментариях = охват.",
  },
  {
    num: 29, pilar: 5, title: "Mythos: KI nimmt dir den Job",
    hookDe: "Die KI nimmt dir nicht deinen Job. Aber jemand anderes wird ihn nehmen.",
    hookRu: "ИИ не заберёт твою работу. Но её заберёт кое-кто другой.",
    midDe: "Nämlich: der Mensch, der KI benutzt — und du nicht. Der Friseur mit KI-Terminplanung. Die Buchhalterin, die Belege automatisch sortiert. Es ist wie 1995 mit dem Computer: Nicht der PC hat Jobs genommen — die Leute mit PC-Kenntnissen haben sie bekommen.",
    midRu: "А именно: человек, который использует ИИ, пока ты — нет. Парикмахер с ИИ-записью. Бухгалтер с автосортировкой документов. Это как 1995-й с компьютером: работу забрал не ПК — её получили люди, умеющие с ним работать.",
    cta: "A",
    shoot: "Хук с паузой после первой фразы. Самый широковещательный ролик пилара — все боятся этой темы.",
  },
  {
    num: 30, pilar: 5, title: "Mythos: Website = 10.000 €",
    hookDe: "«Eine gute Website kostet 10.000 Euro.» Nein. Hier ist die ehrliche Preisliste.",
    hookRu: "«Хороший сайт стоит 10 000 евро». Нет. Вот честный прайс.",
    midDe: "Selbst mit KI: 0–50 Euro. Baukasten: 20 Euro im Monat. Freelancer: 500–1.500. Agentur: ab 3.000. Und jetzt der Punkt: Der Preis sagt NICHTS über das Ergebnis. Ich habe 10.000-Euro-Websites gesehen, die keinen einzigen Anruf bringen. Entscheidend ist der erste Satz, die Nummer, das Angebot.",
    midRu: "Сам с ИИ: 0–50 евро. Конструктор: 20 евро в месяц. Фрилансер: 500–1 500. Агентство: от 3 000. И главное: цена НИЧЕГО не говорит о результате. Я видел сайты за 10 000, не приносящие ни одного звонка. Решают первая фраза, номер телефона и оффер.",
    cta: "B",
    shoot: "Прайс-лестница на экране. Честность против рынка = доверие + пересылки.",
  },
];

const BADGE: Record<number, string> = { 1: "accent", 2: "blue", 3: "amber", 4: "pink", 5: "purple" };

export default async function AndriiReels() {
  await requireAndriiAuth("/andrii/reels");

  return (
    <AndriiShell>
      <div className="page-label">Банк сценариев · DE + RU</div>
      <h1 className="page-title">30 reels — готово к съёмке</h1>
      <p className="page-sub">Хук → Польза → CTA · Немецкий текст = опорные фразы, говорить своими словами · Перевод в скобках — понять смысл</p>

      <div className="stat-strip">
        {PILARS.map((p) => (
          <div className="stat-box" key={p.id}>
            <div className="stat-label">Пилар {p.id}</div>
            <div className="stat-val" style={{ fontSize: 14, paddingTop: 4 }}>{p.label}</div>
            <div className="stat-note">{p.pct} контента</div>
          </div>
        ))}
      </div>

      <div className="callout green" style={{ marginBottom: 18 }}>
        <strong>Сегодня (27.07):</strong> №1 «Ausländer-манифест» → №2 «Live-Check Café» → №31 «Blick auf Wien» (со ступенек).
        Плюс снять один раз три CTA-блока ниже (по 2 дубля) — дальше они клеятся в монтаже. «Brief vom Amt» — завтра первым.
      </div>

      <section className="section" style={{ marginBottom: 32 }}>
        <h2 className="section-title">📣 CTA-блоки (снять 1 раз, клеить всегда)</h2>
        {CTA_BLOCKS.map((c) => (
          <div className="card" key={c.key}>
            <div className="card-head">{c.name}</div>
            <div className="card-body">
              <div className="de-line">«{c.de}»</div>
              <div className="ru-line">({c.ru})</div>
            </div>
          </div>
        ))}
      </section>

      {SCRIPTS.map((s) => (
        <div className={`script-card${s.priority?.includes("СЕГОДНЯ") ? " today" : ""}`} key={s.num}>
          <div className="script-head">
            <div className="script-num">{s.num}</div>
            <div style={{ flex: 1 }}>
              <div className="script-title">{s.title}</div>
              {s.priority && (
                <div style={{ fontSize: 11, color: "var(--green)", fontWeight: 700, marginTop: 2 }}>{s.priority}</div>
              )}
            </div>
            <span className={`badge ${BADGE[s.pilar]}`}>Пилар {s.pilar}</span>
          </div>
          <div className="script-body">
            <div className="script-row">
              <div className="script-row-label">Хук</div>
              <div className="script-row-val">
                <div className="de-line">«{s.hookDe}»</div>
                <div className="ru-line">({s.hookRu})</div>
              </div>
            </div>
            <div className="script-row">
              <div className="script-row-label">Польза</div>
              <div className="script-row-val">
                <div className="de-line" style={{ fontWeight: 500 }}>{s.midDe}</div>
                <div className="ru-line">({s.midRu})</div>
              </div>
            </div>
            <div className="script-row">
              <div className="script-row-label">CTA</div>
              <div className="script-row-val"><strong>Блок CTA-{s.cta}</strong> — клеится в монтаже</div>
            </div>
            <div className="script-row">
              <div className="script-row-label">🎬 Съёмка</div>
              <div className="script-row-val" style={{ color: "var(--text-3)", fontSize: 13 }}>{s.shoot}</div>
            </div>
          </div>
        </div>
      ))}

      <section className="section" style={{ marginTop: 40 }}>
        <h2 className="section-title">🪝 Шаблоны хуков (подставляй тему)</h2>
        <div className="grid-2">
          {[
            { de: "Du zahlst [X] Euro für etwas, das dein Handy kostenlos macht.", ru: "Ты платишь [X] евро за то, что твой телефон делает бесплатно." },
            { de: "Ich habe ChatGPT gefragt, wer der beste [X] in Wien ist.", ru: "Я спросил ChatGPT, кто лучший [X] в Вене." },
            { de: "Mach das nie wieder, bevor du [X] geprüft hast.", ru: "Никогда больше не делай этого, не проверив [X]." },
            { de: "Dein Konkurrent macht nur eine Sache anders.", ru: "Твой конкурент делает лишь одну вещь иначе." },
            { de: "Alle sagen [X]. Ich habe das Gegenteil gemacht — und hier ist das Ergebnis.", ru: "Все говорят [X]. Я сделал наоборот — вот результат." },
            { de: "Das kostet dich jeden Tag Kunden — und du siehst es nicht.", ru: "Это каждый день стоит тебе клиентов — а ты этого не видишь." },
            { de: "[Zahl] + [Zahl] = Geschichte: konkrete Zahlen im ersten Satz stoppen den Daumen.", ru: "Цифры в первой фразе останавливают скролл: «30 визитов, 1 клиент»." },
            { de: "Woche [N]: die ehrlichen Zahlen meines Business in Wien.", ru: "Неделя [N]: честные цифры моего бизнеса в Вене." },
          ].map((h) => (
            <div className="callout neutral" key={h.de} style={{ marginBottom: 8 }}>
              <em>«{h.de}»</em>
              <div className="ru-line">({h.ru})</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">✅ Чек виральности перед съёмкой</h2>
        <div className="callout neutral">
          1 · Перешлют ли этот ролик другу? («смотри, как просто» / «это же про тебя») &nbsp;·&nbsp;
          2 · Конфликт понятен за 0,5 сек? &nbsp;·&nbsp; 3 · Один ролик = одна мысль? &nbsp;·&nbsp;
          4 · Механика, а не вдохновение? &nbsp;·&nbsp; 5 · Без представления в начале? &nbsp;·&nbsp;
          Субтитры DE, первая строка = хук. Не тратить время на: музыку, хештеги, обложку, время публикации.
        </div>
      </section>
    </AndriiShell>
  );
}
