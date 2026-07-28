# REDESIGN-SPEC — Новый gorbenko.at (июль 2026)

ТЗ для стройки. Структура — на русском, весь копирайт сайта — на немецком (готов к вставке).
Цель сайта: **одна конверсия — Kostenlose Beratung** (онлайн или оффлайн: «я приеду к вам в бизнес в Вене»). Цен на сайте НЕТ нигде.

## 0. Технические рамки

- Репо: `agency-site`, Next.js 16 App Router + Tailwind 4, deploy Vercel → gorbenko.at.
- НЕ трогать: `/andrii`, `/olya`, `/crm`, `/cold-sales`, `/reports`, все `/api/*`, `/google-maps`, `/impressum`, `/datenschutz`, redirects `/ig|/tt|/yt`, GTM/Consent в `layout.tsx`.
- Анимации: пакет `motion` (`motion/react`), только transform/opacity, respect `prefers-reduced-motion`.
- Перф-бюджет: Lighthouse mobile 95+. Все картинки через `next/image`, скриншоты — AVIF/WebP.
- Язык: DE (de_AT). Обращение «Sie». От первого лица («ich»), т.к. бренд личный: Andrii Gorbenko.
- Контакты: WhatsApp `wa.me/436765920259`, Tel `+43 676 59 202 59`, `gorbenkomagic@gmail.com`, Telegram `@GorbenkoAndrey`, IG `@andrii_gorbenko` + `@ki.mit.andrii`, YouTube (ссылка через `/yt`).
- Форма консультации: POST `/api/consultation` (`name`, `business`, `request`, `phone`, `email`; phone или email обязателен) → Telegram-уведомление Андрею.

## 1. Дизайн-система

Тёмная премиум-тема, «colorful dark» (подтверждённое предпочтение Андрея): фон `#050508`, карточки `#0a0a0f`, границы `#1a1a22`, текст `#f0f0f0`, muted `#9ca3af` (поднять контраст с текущего `#6b7280`).
Акцент: emerald `#00d4aa`. Дополнительная палитра для карточек услуг: blue `#38bdf8`, violet `#a78bfa`, amber `#fbbf24`, rose `#fb7185`, lime `#a3e635`.
Типографика: Geist (уже подключён). H1 до 4.5rem, tracking -0.03em. Большие цифры — `font-mono`-таблично или Geist bold.

Motion-примитивы (`app/components/ui/`):
- `Reveal.tsx` — in-view fade+up, поддержка stagger (delay проп).
- `Counter.tsx` — count-up числа при попадании в viewport (поддержка префикса/суффикса: `€3.000`, `<10 s`, `95 %`).
- `Marquee.tsx` — бесконечный бегунок (CSS keyframes, duplicate list, pause on hover).
- `TiltGlowCard.tsx` — карточка с лёгким hover-glow (radial по курсору) — без тяжёлого 3D.
- `BrowserFrame.tsx` — рамка браузера (три точки + url-строка) вокруг скриншота.
- `PhoneFrame.tsx` — iPhone-рамка (notch, скруглённая) вокруг вертикального контента.
- `ScoreGauge.tsx` — круговой спидометр 0–100 (Lighthouse), анимированная дуга + Counter, цвет: 90+ зелёный.
- `FAQ.tsx` — аккордеон, рендерит и `FAQPage` JSON-LD.
- `CTASection.tsx` — переиспользуемый финальный блок консультации (см. §8).
- `SectionLabel.tsx` — uppercase-лейбл секции в акцентном цвете.

Header (`SiteHeader.tsx`): sticky, blur-фон при скролле. Лого «Gorbenko» + nav: Leistungen, Projekte, Über mich, Blog, кнопка «Kostenlose Beratung» → `/kontakt`. Mobile: fullscreen-меню.
Footer (`SiteFooter.tsx`): 4 колонки — бренд+соцсети, Leistungen (6 ссылок), Projekte (6 ссылок), Kontakt (WhatsApp/Tel/Mail/Adresse Wien) + Impressum/Datenschutz. Внизу: «Made in Wien · Gorbenko e.U.» (юрформу взять из Impressum).

## 2. Контент-модель

`app/lib/content.ts` — типизированные массивы `services[]` и `projects[]`, единый источник для страниц, навигации, sitemap, JSON-LD. Скриншоты в `public/portfolio/<slug>/…`. Lighthouse-скоры в `app/lib/lighthouse-scores.json` (генерируются скриптом, см. §9).

## 3. Главная `/`

1. **Hero.** Лейбл: `KI-Automatisierung & Marketing · Wien`. H1: `Ihr Business, digital auf Autopilot.` Sub: `Ich baue Websites, KI-Chatbots, Content und Werbung für Wiener Betriebe — alles aus einer Hand. Sie kümmern sich um Ihr Geschäft, die Technik übernehme ich.` CTA primär: `Kostenlose Beratung` (→ /kontakt), sekundär: `Projekte ansehen` (→ /projekte). Под CTA строка: `✓ Online oder direkt bei Ihnen im Betrieb in Wien · ✓ Unverbindlich · ✓ Antwort in 24 h`. Справа — улучшенный живой чат-демо (взять из старого Hero, печатающийся эффект, зациклить сценарии Nagl/BlinHaus).
2. **Marquee клиентов** (текстовые wordmarks): Messerschmiede Nagl · BlinHaus Vienna · Rubberik · G-Bike Wien · Zum Eisbären. Заголовок: `Betriebe in Wien, die mir vertrauen`. (Colombo Hoppers удалён по решению Андрея 28.07.2026 — не клиент.)
3. **Цифры** (Counter-ряд): `6+ laufende Kundenprojekte` · `24/7 KI-Assistenten im Einsatz` · `>1 Mio. erreichte Views für Kunden` (если спорно — заменить на `3 Werbeplattformen: Meta, Google, TikTok`) · `15 Jahre Unternehmer-Erfahrung`.
4. **Услуги bento** — 6 карточек (цвет из палитры, иконка, 1 предложение, ссылка). Заголовок секции: `Was ich für Sie tun kann`. Тексты карточек — §4 (короткие версии).
5. **Featured-кейсы** — 3 больших карточки (Nagl, BlinHaus, Rubberik): скриншот в рамке, 2 метрики, ссылка. Заголовок: `Ausgewählte Projekte`.
6. **Как проходит консультация** — 3 шага: `1 · Sie erzählen — ich höre zu` (30 Min, online oder bei Ihnen vor Ort in Wien) / `2 · Sie bekommen einen konkreten Plan` (was sich in Ihrem Betrieb automatisieren lässt, was es bringt) / `3 · Ich setze um — Sie sehen Ergebnisse` (erste Resultate in 2–4 Wochen). Плашка: `Ich komme gerne persönlich in Ihren Betrieb — Kaffee genügt.`
7. **Обо мне тизер**: фото + 3 строки (см. §6) + ссылка `Mehr über mich`.
8. **FAQ** (5 вопросов, см. §8) + **CTASection**.

## 4. Услуги — `/leistungen` + 6 подстраниц

Обзорная `/leistungen`: hero-строка `Leistungen` + сетка 6 карточек (расширенные описания) + CTASection.
Шаблон подстраницы: Hero (лейбл, H1, sub) → «Kennen Sie das?» (3 боли) → «Was ich mache» (3–5 пунктов) → визуальный блок (скриншоты/мокапы/gauge) → мини-кейс (цифры + ссылка на проект) → FAQ (3–4) → CTASection.

### 4.1 `/leistungen/ki-chatbots` — KI-Chatbots & Automatisierung
- H1: `Ein KI-Assistent, der Ihre Kunden bedient — 24/7.` Sub: `Auf Facebook, Instagram und WhatsApp: beantwortet Fragen, nimmt Bestellungen auf, kennt Ihre Preise, Produkte und Lieferzeiten — in Ihrem Ton.`
- Боли: `Nachrichten kommen abends und am Wochenende — Sie können nicht immer antworten.` / `Jede unbeantwortete Anfrage ist eine verlorene Bestellung.` / `Immer dieselben Fragen: Preise, Öffnungszeiten, Lieferung.`
- Что делаю: обучение на данных бизнеса (Sortiment, Preise, Lieferprozesse, Größen), приём заказов + уведомления владельцу, Übergabe an Menschen bei Bedarf, monatliche Pflege. Плюс: `Auf Wunsch bringe ich Ihnen und Ihrem Team bei, selbst mit KI zu arbeiten — ohne Angst vor der Technik.`
- Визуал: PhoneFrame с чат-сценарием бота Nagl (знает Lieferung, Stahlsorten, nimmt Bestellung an) + BlinHaus-чат.
- Мини-кейс: BlinHaus — `€3.000 Mehrumsatz in 15 Tagen`, `95 % automatisch beantwortet`, `<10 s Antwortzeit`.
- Hinweis-строка внизу: `Übrigens: Jeder meiner Assistenten sagt Ihren Kunden transparent, dass er ein digitaler Assistent ist — so, wie es der EU AI Act verlangt.`

### 4.2 `/leistungen/websites` — Websites & Online-Shops
- H1: `Websites, die in einer Sekunde laden — und Kunden bringen.` Sub: `Vom Landingpage bis zum Online-Shop mit Konfigurator. Modern, blitzschnell, auf ein Ziel fokussiert: Anfragen für Ihr Geschäft.`
- Боли: alte Website lädt langsam / sieht am Handy schlecht aus / bringt keine Anfragen.
- Что делаю: Landingpages (Beispiel Nagl), Online-Shops (Shopify: G-Bike, Zum Eisbären), individuelle Shops mit Konfigurator (Rubberik), Ladezeit-Optimierung, Analytics & Pixel.
- Визуал: BrowserFrame-скриншоты Nagl/G-Bike/Eisbären + **ScoreGauge-ряд с реальными Lighthouse-скорами** (подпись: `Gemessen mit Google Lighthouse, <Datum>`).
- Мини-кейс: Nagl (ссылка на кейс + live-ссылка custom.nagl-messer.at).

### 4.3 `/leistungen/content-marketing` — Content & Virale Reels
- H1: `Content, den Ihre Kunden wirklich sehen.` Sub: `Ich komme mit professionellem Licht und Kamera in Ihren Betrieb, drehe Reels und führe Ihren Instagram-Kanal — Strategie, Dreh, Schnitt, Posting.`
- Боли: `Sie wissen, dass Sie „etwas mit Social Media" machen sollten — aber wann?` / `Selbst gedrehte Videos wirken nicht professionell.` / `Der Kanal ist seit Monaten still.`
- Что делаю: Content-Strategie, Drehtag vor Ort (Profi-Licht, Ton), Schnitt & Untertitel, virale Hooks, Posting-Plan, Community-Antworten (mit KI-Assistent).
- Визуал: PhoneFrame с рилсами/статистикой IG (плейсхолдеры до получения скринов от Андрея), фото со съёмок.
- Мини-кейс: Instagram Messerschmiede Nagl (@messerschmiedenagl) + BlinHaus.

### 4.4 `/leistungen/meta-ads` — Werbung auf Facebook & Instagram
- H1: `Werbung, die direkt in Bestellungen mündet.` Sub: `Meta-Kampagnen mit Click-to-Messenger: Der Interessent klickt auf die Anzeige — und mein KI-Assistent übernimmt sofort das Gespräch. Keine verlorenen Leads.`
- Боли: `Schon mal „boosten" probiert — Geld weg, nichts passiert.` / `Agenturen verlangen Monatsbudgets, die sich ein KMU nicht leisten kann.` / `Keine Ahnung, was die Werbung wirklich bringt.`
- Что делаю: Strategie & Zielgruppen (Wien/AT, Sprachen), Kreative aus echtem Content, Click-to-Messenger → KI-Assistent, Pixel & Tracking, wöchentliches Reporting. Auch Google Ads (Nagl) und TikTok (G-Bike).
- Мини-кейс: Kampagnen für Nagl, BlinHaus, Rubberik.

### 4.5 `/leistungen/geo-ai-sichtbarkeit` — GEO: Sichtbar in ChatGPT & Co.
- H1: `Wenn jemand ChatGPT fragt — wird Ihr Betrieb empfohlen?` Sub: `Immer mehr Kunden suchen nicht mehr bei Google, sondern fragen KI. GEO (Generative Engine Optimization) sorgt dafür, dass KI-Assistenten Ihren Betrieb kennen und empfehlen.`
- Боли: `Kunden fragen ChatGPT nach „bestem Friseur in Wien" — Sie kommen nicht vor.` / `Ihre Website ist für KI-Crawler unsichtbar.` / `SEO allein reicht 2026 nicht mehr.`
- Что делаю: GEO-Audit (wie sichtbar ist Ihr Betrieb in ChatGPT, Perplexity, Google AI), strukturierte Daten (JSON-LD), llms.txt, Inhalte, die KI zitieren kann, Monitoring.
- Визуал/proof: `Diese Website ist selbst nach GEO-Prinzipien gebaut — fragen Sie ChatGPT nach einer KI-Agentur in Wien.` (+ блок «Was diese Seite dafür tut»: sitemap, llms.txt, Schema, FAQ).
- Мини-кейс: rubberik.at (E-Com-Lab) / Nagl als Pilot.

### 4.6 `/leistungen/digitalisierung` — Digitalisierung & Dashboards
- H1: `Ihre Zahlen. Endlich auf einen Blick.` Sub: `Finanzmodelle, Live-Dashboards und automatisierte Berichte statt Zettelwirtschaft. Ich digitalisiere Ihre Abläufe — von der Bestellung bis zur Auswertung.`
- Боли: Zahlen in Heften/Excel verstreut / keine Ahnung, welches Produkt sich lohnt / Prozesse hängen an einer Person.
- Что делаю: Finanzmodelle & Unit Economics, Live-Dashboards, Prozess-Analyse (`Ich schaue mir Ihren Betrieb an und finde, was sich automatisieren lässt`), Schulung des Teams (`damit Sie es selbst bedienen können — ohne Angst vor der Technik`).
- Мини-кейс: BlinHaus (Finanzmodell, Lieferdienst-Reports, Kassa-Auswertung).

## 5. Кейсы — `/projekte` + 5 подстраниц

Обзорная: сетка карточек (скриншот, теги услуг, 1 метрика). Шаблон кейса: Hero (клиент, локация, теги, live-ссылка) → `Ausgangslage` → `Was wir gemacht haben` (таймлайн-список) → `Ergebnisse` (Counter-ряд) → галерея (BrowserFrame/PhoneFrame/ScoreGauge) → цитата (если есть) → «weitere Projekte» → CTASection.

### 5.1 Nagl (флагман) — `Messerschmiede Stefan Nagl`
- Wien 1140 · Handwerk. Теги: Website, KI-Chatbot, Content, Ads. Live: custom.nagl-messer.at.
- Ausgangslage: traditionsreiche Messerschmiede (Standort mit über 150-jähriger Handwerksgeschichte, Betrieb seit 40+ Jahren), aber digital kaum sichtbar; Custom-Messer-Geschäft brauchte eigenen Auftritt.
- Gemacht: Landingpage (Video-Hero, Testimonials von Wiener Köchen, FAQ, WhatsApp-Direktkontakt), blitzschnelle Ladezeit; KI-Assistent (kennt Stahlsorten, Preisklassen, Lieferung, nimmt Anfragen auf); Instagram @messerschmiedenagl (virale Reels, Drehtage mit Profi-Licht in der Werkstatt); Google Ads + Meta-Kampagnen; kostenlose Beratungstermine als Conversion-Ziel.
- Ergebnisse-числа: Ladezeit/Lighthouse (реальные из замера), `9 Video-Clips + Interview produziert`, `Anfragen direkt über WhatsApp`, остальное фактологично, без выдуманных сумм.
- Цитата: draft `„Andrii hat aus meiner Werkstatt einen digitalen Betrieb gemacht — Website, Videos, Werbung. Ich schmiede, er kümmert sich um den Rest." — Stefan Nagl` (пометить: согласовать!).

### 5.2 BlinHaus — `BlinHaus Vienna` — Café & Lieferservice, Wien.
Теги: KI-Chatbot, Content, Ads, Digitalisierung. Gemacht: KI-Assistent (IG/FB, nimmt Bestellungen an, kennt Speisekarte & Lieferzeiten), Content-Marketing, Meta-Kampagnen, digitalisierte Lieferprozesse + Finanzmodell/Reports. Ergebnisse: `€3.000 Mehrumsatz in 15 Tagen`, `95 % automatisch beantwortet`, `<10 s Antwortzeit`, `24/7`. Цитата Anatoly (есть, взять из старого CaseStudy).

### 5.3 Rubberik — `Rubberik — Mode-Atelier mit Online-Konfigurator`, Wien.
Теги: Online-Shop, Konfigurator, Ads. Осторожная подача (latex fashion → `Wiener Atelier für maßgefertigte Designer-Mode`): neuer Shop (Launch 2026) mit Produkt-Konfigurator — Material & Farbe wählen, Maße online erfassen, Preis live berechnet; moderne Architektur (Headless: Medusa + Next.js); Meta-Kampagnen laufen. Скриншоты конфигуратора/выбора тканей — из локальной сборки (или стилизованные мокапы, если сборка не поднимется). Метка `Launch in Kürze`.

### 5.4 G-Bike Wien — E-Scooter-Store, Staglgasse 12, 1150 Wien. gbikewien.at.
Теги: Online-Shop, TikTok. Gemacht: Shopify-Shop (Katalog, Bestellungen), TikTok-Kanal eingeführt. Скриншот сайта.

### 5.5 Zum Eisbären — Parfümerie & Kosmetik, Hietzinger Hauptstraße 72, 1130 Wien. zum-eisbaeren.at.
Теги: Online-Shop. Gemacht: Shopify-Shop für Traditionsbetrieb (50+ Jahre): Sortiment online, Events & Aktionen, Newsletter, Magazin-Bereich. Скриншот сайта.

## 6. Обо мне — `/ueber-mich`

H1: `Unternehmer zuerst. Dann Marketer.` Портрет (есть `public/andrey.png`, `hero-portrait.png`).
История (3 абзаца): 15 Jahre eigenes Business in der Ukraine (u. a. Trainingsunternehmen aufgebaut und geführt) → `Ich weiß, wie es ist, Verantwortung für Umsatz und Mitarbeiter zu tragen — deshalb rede ich mit Unternehmern auf Augenhöhe, nicht in Agentur-Floskeln.` → Seit September 2025 in Wien voll auf Marketing & KI fokussiert: `Ich habe jedes Werkzeug, das ich Kunden empfehle, zuerst selbst gebaut und getestet.`
Prinzipien (4 карточки): `Alles aus einer Hand` / `Erst Ergebnis, dann Vertrag` (Beratung kostenlos, ohne Druck) / `Ich komme zu Ihnen` (vor Ort in Wien) / `Keine Buzzwords` (ich erkläre alles so, dass es jeder versteht).
Соцблок: Instagram @andrii_gorbenko, @ki.mit.andrii (`Dort zeige ich täglich, wie ich mit KI arbeite — auf Deutsch`), YouTube, WhatsApp. + CTASection.

## 7. Контакт — `/kontakt`

H1: `Kostenlose Beratung — online oder bei Ihnen in Wien.` Sub: `30 Minuten. Sie erzählen von Ihrem Betrieb, ich zeige Ihnen konkret, was sich automatisieren lässt und was es bringen kann. Unverbindlich.`
Два tab/карточки-пути: **Online** (`Video-Call oder Telefon — noch heute möglich`) и **Vor Ort** (`Ich komme in Ihren Betrieb — 1., bis 23. Bezirk. Kaffee genügt.`).
Слева контакты (WhatsApp primär, Tel, Mail, Telegram), справа форма: Name*, Unternehmen, Telefon oder E-Mail*, `Was beschäftigt Sie gerade?` (textarea) → POST `/api/consultation` (map: message→request; контакт с `@` → email, иначе phone). Success-стейт: `Danke! Ich melde mich innerhalb von 24 Stunden.`
Footer-строка: `Termine vor Ort: Montag–Samstag, ganz Wien.`

## 8. Переиспользуемые блоки

**CTASection** (на каждой странице внизу): H2 `Lassen Sie uns über Ihr Geschäft reden.` Text: `Kostenlose Erstberatung — online oder direkt bei Ihnen im Betrieb in Wien. Sie bekommen konkrete Ideen, keine Verkaufsshow.` Кнопки: `Kostenlose Beratung` (→/kontakt) + `WhatsApp schreiben` (wa.me). Мелко: `Unverbindlich · Antwort innerhalb von 24 h · Deutsch, Englisch, Russisch, Ukrainisch`.

**FAQ главной** (5):
1. `Was kostet das?` → `Jedes Projekt ist anders — deshalb nenne ich keine Pauschalpreise auf der Website. In der kostenlosen Beratung bekommen Sie eine klare, ehrliche Einschätzung, was Ihr Vorhaben kostet und was es bringt.`
2. `Für wen arbeiten Sie?` → kleine und mittlere Betriebe in Wien und Umgebung: Handwerk, Gastronomie, Handel, Dienstleistung.
3. `Muss ich technisch fit sein?` → `Nein. Ich baue alles auf, erkläre es verständlich und bringe Ihnen bei Bedarf bei, es selbst zu bedienen.`
4. `Wie schnell sehe ich Ergebnisse?` → erste Ergebnisse (Website, Assistent, erste Kampagne) в 2–4 Wochen.
5. `Was passiert in der kostenlosen Beratung?` → 30 Min, online oder vor Ort; konkreter Plan; keine Verpflichtung.

## 9. Ассеты и скрипты

- `scripts/capture-portfolio.mjs` (playwright): скриншоты desktop 1440×900 + mobile 390×844 → `public/portfolio/<slug>/`: custom.nagl-messer.at, gbikewien.at, zum-eisbaeren.at (+ rubberik локально, если поднимется). Конвертация в WebP.
- `scripts/run-lighthouse.mjs`: `npx lighthouse` (mobile) для custom.nagl-messer.at и gorbenko.at → `app/lib/lighthouse-scores.json` `{slug: {performance, seo, bestPractices, accessibility, date}}`. Показывать только реальные числа.
- OG: `app/opengraph-image.tsx` (ImageResponse: тёмный фон, «Gorbenko — KI & Marketing, Wien», emerald-акцент). Подстраницы наследуют.
- От Андрея позже (ставить плейсхолдеры со сгенерированной заглушкой): фото со съёмок, IG-статистика рилсов, согласование цитат клиентов.

## 10. Блог — `/blog`

MDX (`@next/mdx`). Layout статьи: заголовок, дата, время чтения, оглавление не нужно, внизу CTASection. Список: карточки с тегом и датой. Статьи-старт (3, DE, 600–900 слов, с FAQ-блоком в конце для GEO):
1. `was-kostet-ein-ki-chatbot` — Was kostet ein KI-Chatbot für ein KMU wirklich? (Faktoren statt Preise, versteckte Kosten von „billig", Nagl/BlinHaus als Beispiele, CTA Beratung.)
2. `geo-statt-seo` — GEO statt SEO: Wie Ihr Betrieb von ChatGPT empfohlen wird. (Suchverhalten 2026, was KI-Crawler lesen, llms.txt/Schema einfach erklärt, Checkliste.)
3. `virale-reels-fuer-lokale-betriebe` — Virale Reels für lokale Betriebe: Learnings aus einer Wiener Messerschmiede. (Hook-Formate, Drehtag-Ablauf, warum Authentizität schlägt Hochglanz.)

## 11. SEO/GEO-слой

- `app/sitemap.ts` (все публичные роуты из content.ts + blog), `app/robots.ts` (Disallow: /andrii, /olya, /crm, /reports, /api; Allow остальное; Sitemap-ссылка).
- `public/llms.txt` — краткое описание: кто, что, для кого, услуги со ссылками, контакты. `public/llms-full.txt` — расширенно (услуги + кейсы текстом).
- JSON-LD: `ProfessionalService`+`Person` (layout, Wien, sameAs: IG/YouTube), `Service` на каждой услуге, `FAQPage` через FAQ-компонент, `Article` в блоге, `BreadcrumbList` на подстраницах.
- `metadataBase: https://gorbenko.at`, canonical, title-шаблон `%s — Gorbenko | KI & Marketing Wien`.
- Кластеры: главная `KI Agentur Wien / Digitalagentur Wien`; ki-chatbots `KI Chatbot für Unternehmen`; websites `Website erstellen lassen Wien`; content `Social Media Agentur Wien / Reels Produktion`; meta-ads `Facebook Instagram Werbung Wien`; geo `GEO Agentur / AI SEO Österreich`; digitalisierung `Digitalisierung KMU Wien`.

## 12. Порядок стройки

1. ui-примитивы + Header/Footer + globals (палитра, keyframes).
2. content.ts (все тексты из этой спеки).
3. Главная. 4. /leistungen. 5. /projekte. 6. /ueber-mich + /kontakt. 7. blog. 8. SEO-слой. 9. скрипты ассетов + реальные скрины/скоры. 10. build, Lighthouse самого сайта, деплой.
Старые компоненты (Hero, Problem, Process, CaseStudy, Pricing, About, Contact) после замены удалить, если нигде больше не используются (grep!). `/google-maps` остаётся как есть.
