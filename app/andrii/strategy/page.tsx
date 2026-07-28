import { requireAndriiAuth } from "../auth-check";
import AndriiShell from "../AndriiShell";

export const metadata = { robots: { index: false, follow: false } };

const PILARS = [
  {
    id: 1, badge: "accent", pct: "35%", label: "KI löst das",
    desc: "«ИИ решает это» — бытовые и рабочие задачи за минуты: письмо в ведомство, договор, резюме, сайт, переговоры. Широкая аудитория — виральное ядро и путь к миллиону.",
  },
  {
    id: 2, badge: "blue", pct: "20%", label: "Live-Check",
    desc: "Фирменный формат: «Ich habe ChatGPT gefragt, wer der beste [Friseur] in Wien ist» — показать ответ, разобрать почему. Масштабируется на любую нишу и город. Приводит владельцев бизнеса.",
  },
  {
    id: 3, badge: "amber", pct: "20%", label: "Marketing & Verkauf",
    desc: "Продажи, холодные продажи, сайты, реклама, отзывы — конкретная механика для малого бизнеса DACH. Монетизационный слой: CTA на KI-Check.",
  },
  {
    id: 4, badge: "pink", pct: "15%", label: "Wien / Journey",
    desc: "«Ausländer-Business-Tagebuch»: иностранец строит бизнес в Вене с нуля, ходит к клиентам ногами, красивые фоны (Stephansplatz, Schönbrunn, каналы). Самоирония со словом Ausländer — фирменная провокация: половина Вены узнаёт в этом себя. Лицо и история — удержание и доверие.",
  },
  {
    id: 5, badge: "purple", pct: "10%", label: "Mythen",
    desc: "Провокации и разбор мифов: «SEO ist tot», «KI nimmt dir den Job», «Website kostet €10.000». Комментарии и споры = охваты.",
  },
] as const;

export default async function AndriiStrategy() {
  await requireAndriiAuth("/andrii/strategy");

  return (
    <AndriiShell>
      <div className="page-label">Стратегия</div>
      <h1 className="page-title">Как растёт аккаунт в DACH</h1>
      <p className="page-sub">Цифры рынка · математика 10k и 1M · пилары · платформы · темп</p>

      <section className="section">
        <h2 className="section-title">🌍 Сколько вообще людей в DACH</h2>
        <div className="stat-strip">
          <div className="stat-box">
            <div className="stat-label">Носители немецкого</div>
            <div className="stat-val">~100 млн</div>
            <div className="stat-note">DE 84 + AT 9 + CH 6 (нем.) + LU/IT</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Instagram DACH</div>
            <div className="stat-val">~40 млн</div>
            <div className="stat-note">DE 32,5 + AT ~4,5 + CH ~4</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">TikTok DE</div>
            <div className="stat-val">~21 млн</div>
            <div className="stat-note">рост быстрее, чем в IG</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Проф. креаторы DE</div>
            <div className="stat-val">~500 тыс</div>
            <div className="stat-note">DE-контент — меньше конкуренции, чем EN</div>
          </div>
        </div>
        <div className="callout blue">
          <strong>Почему немецкий — преимущество.</strong> Аудитория в 40 млн — достаточно большая для миллиона
          подписчиков, но DE-контента про ИИ и маркетинг в разы меньше, чем англоязычного. Алгоритм заперт в языковом
          пузыре: твой конкурент — не MrBeast, а несколько сотен немецких бизнес-креаторов, большинство из которых снимает
          скучно и по-корпоративному.
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🧮 Математика: 10 000 подписчиков</h2>
        <div className="card">
          <div className="card-body">
            <p><strong>Конверсия просмотр → подписка</strong> у нишевых экспертных аккаунтов ≈ 0,5–2%.
            Значит 10k подписчиков ≈ 1–2 млн суммарных просмотров.</p>
            <p><strong>При 3 reels/день (90/мес):</strong> даже если средний ролик даёт скромные 2–5k просмотров,
            за 2–3 месяца статистически «выстреливают» 3–5 роликов на 100–500k+. Один виральный Live-Check может
            принести 3–5k подписчиков за неделю.</p>
            <p><strong>Реалистичный срок: 3–5 месяцев.</strong> Быстрее — если серия Live-Check зацепит (формат
            с готовым конфликтом: «кого рекомендует ChatGPT, а кого игнорирует»).</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🏔 Математика: 1 000 000 в DACH — честный разбор</h2>
        <div className="card">
          <div className="card-body">
            <p><strong>Возможно ли? Да, прецеденты есть.</strong> В DACH на миллион+ вышли креаторы с широкими темами:
            фитнес (Pamela Reif, 9,8 млн), развлечения, финансы для всех (Finanzfluss ~1,5 млн на YouTube).
            Узкий B2B-маркетинг миллион в DACH не набирает — потолок ниши ~100–300k.</p>
            <p><strong>Что нужно:</strong> ~1000–2000 опубликованных роликов (2–3/день на протяжении 18–36 месяцев),
            из них 15–25 мега-виральных (3–10 млн просмотров каждый). Суммарно ~100–200 млн просмотров.</p>
            <p><strong>Поэтому пилар «KI löst das» — 35% и главный.</strong> «Как ИИ пишет письмо в Finanzamt» смотрит
            вся Германия, «как настроить рекламу» — только предприниматели. Широкое ядро тянет цифры, бизнес-слой
            конвертирует в деньги. Мотивационную жвачку не делаем — вместо неё <em>польза + история</em> (журнал
            «строю бизнес в Вене»), это та же широкая эмоция, но с лицом.</p>
            <p><strong>Вилка честно:</strong> 1M за 24 месяца — агрессивный сценарий (нужно 2–3 формата-хита и выход
            на TikTok+Shorts одновременно). 36 месяцев — рабочий. Без мультиплатформенности — не выйдет.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🧭 5 пиларов (групп контента)</h2>
        {PILARS.map((p) => (
          <div className="card" key={p.id}>
            <div className="card-head">
              <span>Пилар {p.id} · {p.label}</span>
              <span className={`badge ${p.badge}`}>{p.pct}</span>
            </div>
            <div className="card-body">{p.desc}</div>
          </div>
        ))}
        <div className="callout neutral">
          <strong>Как работают группы:</strong> каждый день берём 3 сценария из разных пиларов (банк отсортирован так,
          что рубрики чередуются сами). Раз в месяц смотрим статистику по пиларам: у какого лучшее удержание первых 3 сек
          и досматываемость — тому +10% доли, худшему −10%. Так портфель сам «переливается» в то, что работает.
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">📱 Платформы (одно видео → 5 площадок)</h2>
        <div className="card">
          <table>
            <thead>
              <tr><th>Площадка</th><th>Роль</th><th>Когда</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Instagram Reels</strong></td><td>Ядро: подписчики + inbound-лиды, ссылка в био на KI-Check</td><td>с сегодня</td></tr>
              <tr><td><strong>TikTok</strong></td><td>Самый быстрый органический рост в DACH, обязателен для цели 1M</td><td>неделя 1–2</td></tr>
              <tr><td><strong>YouTube Shorts</strong></td><td>Долгий хвост + поиск; видео индексируются и цитируются ИИ (наш же GEO-тезис)</td><td>неделя 1–2</td></tr>
              <tr><td><strong>Facebook Reels</strong></td><td>DACH-аудитория 40+, владельцы бизнеса; автокросспост из IG — ноль усилий</td><td>с сегодня (галочка)</td></tr>
              <tr><td><strong>LinkedIn</strong></td><td>Не reels, а тот же смысл текстом/нативным видео — B2B-лиды по плану 90 дней</td><td>2–3 лучших/нед</td></tr>
              <tr><td><strong>Pinterest</strong></td><td>Слабо для говорящих видео в DACH — низкий приоритет; вернёмся, если будут гайды/чек-листы</td><td>позже / скип</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">📈 Бенчмарки engagement (Instagram DE, 2026)</h2>
        <div className="card">
          <table>
            <thead>
              <tr><th>Подписчиков</th><th>Engagement</th><th>Что это значит для нас</th></tr>
            </thead>
            <tbody>
              <tr><td>1–10k</td><td>4,8%</td><td>стартовая фаза: каждый комментарий отрабатываем — алгоритм это любит</td></tr>
              <tr><td>10–50k</td><td>3,6%</td><td>зона первой цели; reels дают самый высокий охват из всех форматов (4,5%)</td></tr>
              <tr><td>50–200k</td><td>2,8%</td><td>сюда выводит серийность: повторяемые форматы-рубрики</td></tr>
              <tr><td>500k–1M+</td><td>1,4–1,8%</td><td>масштаб только через широкие темы + мультиплатформу</td></tr>
            </tbody>
          </table>
        </div>
        <div className="callout amber">
          <strong>Ориентиры темпа</strong> (проверять по своим цифрам, не по чужим): удержание первых 3 сек ≥ 70%,
          досматываемость ≥ 40%, пересылки — главный сигнал виральности. Ролик сильно выше среднего → закрепить в сетке
          и сделать 2–3 продолжения в течение недели, пока алгоритм тёплый.
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🚫 Что НЕ делаем</h2>
        <div className="grid-2">
          <div className="callout pink">Представление в начале ролика · длинные предыстории · перечисления 5+ пунктов · гладкий ИИ-текст без личности</div>
          <div className="callout pink">Покупка подписчиков и гивы · мотивационная жвачка без пользы · перфекционизм в монтаже (объём бьёт полировку)</div>
        </div>
      </section>
    </AndriiShell>
  );
}
