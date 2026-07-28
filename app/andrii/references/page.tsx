import { requireAndriiAuth } from "../auth-check";
import AndriiShell from "../AndriiShell";

export const metadata = { robots: { index: false, follow: false } };

const REFS = [
  {
    icon: "🏋️", name: "Pamela Reif", handle: "@pamela_rf · IG ~9,8 млн (июнь 2026)",
    stats: [{ t: "Потолок DACH", b: "green" }, { t: "10+ лет", b: "blue" }],
    body: "Доказательство, что немецкоязычный креатор добирается до 10 млн. Ключ: один повторяемый формат (follow-along workout), железная регулярность годами, DE+EN расширяет потолок.",
    take: "Забрать: серийность и регулярность бьют креативность. Формат, который можно повторить 1000 раз.",
  },
  {
    icon: "🎭", name: "Juan Daniel Bergman", handle: "wordless reels · +2,95 млн за полгода 2025",
    stats: [{ t: "Рост №1 в DE", b: "green" }, { t: "Без слов", b: "amber" }],
    body: "Самый быстрорастущий аккаунт Германии — реакции на поп-культуру вообще без речи. Урок для нас обратный: язык — барьер и фильтр. Но визуальная понятность хука (конфликт видно без звука) — обязательна.",
    take: "Забрать: хук должен работать даже без звука — 60%+ смотрят без него. Текст хука на экране с первого кадра.",
  },
  {
    icon: "🚀", name: "Fredrik Harkort", handle: "@fredrikharkort · Berlin · +268%/мес (март 2026)",
    stats: [{ t: "Entrepreneur-нишa", b: "blue" }, { t: "Ближайший аналог", b: "green" }],
    body: "Серийный предприниматель, документирует свой путь и делится знаниями — ровно наша модель «Business-Tagebuch». Показывает, что B2B-фигура растёт на личной истории, а не на советах в вакууме.",
    take: "Забрать: документировать реальный путь (цифры, отказы, победы) — это и есть дифференциация от «гуру».",
  },
  {
    icon: "💰", name: "Finanzfluss", handle: "YouTube ~1,5 млн · IG сотни тыс.",
    stats: [{ t: "Образование", b: "blue" }, { t: "Доверие → продукт", b: "amber" }],
    body: "Сухая тема (финансы) → миллионная аудитория через простое объяснение сложного. Модель монетизации: бесплатная польза строит доверие, продукт продаётся сам. Наш аналог: KI-польза → KI-Check.",
    take: "Забрать: «объясни как другу» — тон, который делает сложное виральным. И структура: одна проблема = один ролик.",
  },
  {
    icon: "✨", name: "Younes Zarou", handle: "@youneszarou · IG ~5 млн+, TikTok десятки млн",
    stats: [{ t: "Мультиплатформа", b: "green" }, { t: "3/день", b: "amber" }],
    body: "Немец, ставший мировым через визуальные трюки и темп публикаций (несколько в день). Его цифры сделал TikTok, IG подтянулся следом — подтверждение мультиплатформенной стратегии для 1M.",
    take: "Забрать: темп 3/день — это его норма, а не подвиг. И: TikTok прощает сырость, начинать там проще.",
  },
] as const;

export default async function AndriiReferences() {
  await requireAndriiAuth("/andrii/references");

  return (
    <AndriiShell>
      <div className="page-label">Референсы</div>
      <h1 className="page-title">У кого учимся (DACH, 2026)</h1>
      <p className="page-sub">Цифры — по открытым данным на июль 2026, перепроверять раз в квартал</p>

      <div className="callout blue" style={{ marginBottom: 28 }}>
        <strong>Главный вывод рейтингов DACH 2025–2026</strong> (HypeAuditor/Netzschreier, Kolsquare): растут не самые
        громкие, а те, у кого <strong>чёткая позиция + повторяемый формат</strong>. Micro-аккаунты (10–50k) дают самые
        высокие проценты роста — наше окно возможностей на старте.
      </div>

      {REFS.map((r) => (
        <div className="ref-card" key={r.name}>
          <div className="ref-head">
            <div className="ref-avatar">{r.icon}</div>
            <div>
              <div className="ref-name">{r.name}</div>
              <div className="ref-handle">{r.handle}</div>
            </div>
          </div>
          <div className="ref-stats">
            {r.stats.map((s) => (
              <span className={`badge ${s.b}`} key={s.t}>{s.t}</span>
            ))}
          </div>
          <div className="ref-body">{r.body}</div>
          <div className="ref-take"><strong>→</strong> {r.take}</div>
        </div>
      ))}

      <section className="section" style={{ marginTop: 36 }}>
        <h2 className="section-title">🔍 Домашка: найти 5 прямых DACH-конкурентов</h2>
        <div className="card">
          <div className="card-body">
            <p>Прямых «KI-хаки на немецком» креаторов надо отсмотреть руками в IG/TikTok (алгоритм покажет лучше любого
            списка): поискать по «KI Tipps», «ChatGPT Trick deutsch», «KI für Unternehmen». На каждого — 3 вопроса:</p>
            <p><strong>1 ·</strong> Какой у них самый виральный ролик за 90 дней (сортировка по популярным)?
            <strong> 2 ·</strong> Какой формат повторяется? <strong>3 ·</strong> Что они НЕ делают из нашего
            (Вена-лайфстайл, Live-Check, журнал бизнеса)? Найденных — кидать голосом в Telegram-бот, я разберу и добавлю сюда.</p>
          </div>
        </div>
      </section>
    </AndriiShell>
  );
}
