# HANDOFF — что доделать на gorbenko.at (для любой модели)

Статус на 28.07.2026: **редизайн полностью задеплоен на прод** (gorbenko.at).
Сделано: главная, 6 страниц услуг, 5 кейсов, «Обо мне», «Контакт» (форма → /api/consultation → Telegram), блог (3 статьи, MDX), sitemap/robots/llms.txt/JSON-LD/OG, скриншоты Nagl/GBike/Eisbären, Lighthouse-виджеты. Замер прода: **97/100/100/100 (mobile)**.

## Правила работы (читать перед любой задачей)

1. Источник правды по текстам и структуре: `REDESIGN-SPEC.md`. Весь контент услуг/кейсов: `app/lib/content.ts`. Посты блога: `app/blog/posts.ts` + `app/blog/(artikel)/<slug>/page.mdx`.
2. НЕ трогать: `/andrii`, `/olya`, `/crm`, `/cold-sales`, `/reports`, `/api/*`, `/google-maps`, redirects в `next.config.ts`, GTM в `layout.tsx`.
3. Перед деплоем всегда: `npm run build` (из `agency-site/`). Деплой: `npx vercel --prod`.
4. Держать Lighthouse 95+: никаких новых тяжёлых библиотек, картинки только через `next/image` (webp, в `public/portfolio/`), анимации только transform/opacity.
5. Немецкий: обращение «Sie», от первого лица («ich»), без слова «Bot» в клиентских текстах — только «digitaler Assistent» / «KI-Assistent».
6. UI-примитивы уже есть в `app/components/ui/` (Reveal, Counter, Marquee, BrowserFrame, PhoneFrame, ScoreGauge, FAQ, CTASection) — переиспользовать, не создавать новые.

## Блок 1 — Скриншоты Rubberik (когда будет доступ)

Staging `https://rubberik-storefront.vercel.app` закрыт Vercel-аутентификацией.
Когда Андрей даст доступ (или сайт задеплоится публично):
1. Добавить URL в `scripts/capture-portfolio.mjs` (slug `rubberik`), запустить `node scripts/capture-portfolio.mjs`, конвертнуть в webp (sharp-однострочник в конце скрипта истории — или просто `sharp(f).webp({quality:82})`).
2. Прописать пути в `app/lib/content.ts` → проект `rubberik` → `screenshots: { desktop: "/portfolio/rubberik/desktop.webp", mobile: "/portfolio/rubberik/mobile.webp" }`.
3. Отдельно снять экраны конфигуратора (выбор ткани, ввод мерок, live-цена) → можно добавить в кейс галереей.
4. Build + deploy.

## Блок 2 — Фото от Андрея (когда пришлёт)

1. Портрет: заменить `public/andrey.png` (главная) и `public/hero-portrait.png` (/ueber-mich) на новые (сохранить имена файлов — код не менять; сжать до ~150-300KB webp/png).
2. Фото со съёмок (проф. свет в мастерской/кафе): добавить секцию-галерею на `/leistungen/content-marketing` (3-4 фото в сетке, next/image) и/или в кейс Nagl.

## Блок 3 — Скрины статистики Instagram (когда пришлёт)

Скрины виральных рилсов Nagl/BlinHaus (просмотры, охваты) → в `PhoneFrame` на `/leistungen/content-marketing` (заменить текущий мини-кейс-блок) и в кейс `/projekte/nagl` в секцию Ergebnisse.

## Блок 4 — Согласование цитаты Штефана

В `content.ts` у проекта `nagl` стоит **черновик цитаты** (`quote`), Штефан её НЕ подтверждал. Андрей должен показать ему текст. Если не подтвердит — удалить поле `quote` у nagl (страница корректно рендерится без него).

## Блок 5 — Блог дальше (1-2 статьи в неделю)

Шаблон готов. Новая статья = 3 шага:
1. Добавить запись в `app/blog/posts.ts` (slug, title, description, date, tag, readingMinutes).
2. Создать `app/blog/(artikel)/<slug>/page.mdx` — скопировать структуру существующей статьи (import ArticleMeta + export metadata + контент + секция «Häufige Fragen» в конце — обязательна, это GEO).
3. Build + deploy. Sitemap подхватит автоматически.
Идеи следующих тем: «Warum Ihre Website für ChatGPT unsichtbar ist», «Click-to-Messenger: Werbung ohne verlorene Leads», «Digitalisierung eines Wiener Cafés: BlinHaus von innen», «Shopify oder eigener Shop?».

## Блок 6 — Регистрация в поисковиках (разово)

1. Google Search Console: подтвердить gorbenko.at, отправить `https://gorbenko.at/sitemap.xml`.
2. Bing Webmaster Tools: то же.
3. Проверить превью OG в Telegram (@WebpageBot) и WhatsApp.

## Блок 7 — Необязательное (потом)

- Calendly-виджет на /kontakt (когда Андрей заведёт аккаунт).
- EN-версия сайта (только после того как DE-версия наберёт трафик).
- Живой KI-ассистент на сайте вместо демо — ОБЯЗАТЕЛЬНО с раскрытием «digitaler Assistent» в первом сообщении (EU AI Act, см. скилл eu-ai-act-bot-disclosure).
- Реальные метрики рилсов/рекламы в кейсы, когда накопятся.
