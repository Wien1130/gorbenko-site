import { requireOlyaAuth } from "../auth-check";
import OlyaShell from "../OlyaShell";

export const metadata = { robots: { index: false, follow: false } };

const REFS = [
  {
    handle: "@alinapugachevskaya",
    platform: "TikTok",
    subs: "162.5k",
    likes: "8.1 млн",
    emoji: "🍜",
    color: "pink",
    quote: "Сидишь, ешь борщ, и это настолько охрененно. Просто невозможно оторваться. Комфортный покой в душе.",
    what: "Разговорный контент с инсайтами о жизни. Ест на камеру. Как разговор с подругой за борщом. Берёт простую мысль — и подаёт её неожиданно.",
    take: "Главный ориентир по подаче и темпу. Формула: простая мысль → необычный разворот → история. Можно есть/пить в кадре.",
    formula: "Простая мысль → необычный разворот → эмоциональная история",
  },
  {
    handle: "@mayyes_1 · thequietquill",
    platform: "TikTok",
    subs: "6059",
    likes: "558.7k",
    emoji: "🖋️",
    color: "blue",
    quote: "Фильмографичная. Игра черно-белого рассвета, намёки на людей, но не полностью. Я хотела взять в свой опыт — присутствие персоналистики.",
    what: "Стихи. Чёрно-белая кинематографичная эстетика. Закреп 300–600k просмотров. Человек в кадре, но не виден полностью: рука, силуэт, спина.",
    take: "«Персоналистика» — Оля есть в кадре, но не в full-face весь ролик. Рука с книгой, силуэт у окна, фигура в проходе. Тёмный атмосферный тон.",
    formula: "Частичное присутствие + атмосфера = просмотры без сложного монтажа",
  },
  {
    handle: "@lordmatas",
    platform: "Instagram",
    subs: "40.1k",
    likes: "2 425",
    emoji: "🎭",
    color: "purple",
    quote: "Очень запоминающаяся бренд-идентика. Три слова в bio — и уже всё понятно кто он.",
    what: "Харизматичный контент о реакциях на жизнь. «esoteric eccentric egomaniac». Аутентичная негативность — не притворяется позитивным, но это атмосферно.",
    take: "Бренд-идентика в 3 словах. Придумать для Оли: «perceptive. obsessive. writing through it.» — обсудить. Не бояться быть «неудобной».",
    formula: "3 слова в bio = мгновенное понимание кто ты",
  },
  {
    handle: "@shishkinmax",
    platform: "Instagram",
    subs: "67.9k",
    likes: "1 165",
    emoji: "🎬",
    color: "amber",
    quote: "Главный человек, из-за которого я полюбила монтировать. Из-за того, как выглядел его профиль, пошла в блогинг.",
    what: "Режиссёр. Movie-трибьюты — монтаж кадров из разных фильмов под музыку + рейтинги. Кинематографичный профиль.",
    take: "Кинематографичность кадра: правило третей, движение, свет. Можно делать «трибьюты» — монтаж кадров из фильмов с голосом Оли про символизм.",
    formula: "Кинематографичный профиль = эталон качества визуала, к которому тянуться",
  },
  {
    handle: "@jasushka",
    platform: "Instagram",
    subs: "304k",
    likes: "458",
    emoji: "🎧",
    color: "green",
    quote: "Строит контент не вокруг профессии, а вокруг юмора. Millennial аудитории это смешно, потому что у всех было.",
    what: "DJ, но контент — про юмор. Миллениальные мемные наблюдения: «твоя мама на море привезла, чтобы воздухом подышала, а не у бассейна лежать».",
    take: "Периодически делать «узнай себя» — юморные наблюдения про писательство / отношения. Даёт охваты за пределами ядровой аудитории.",
    formula: "Профессия в фоне, юмор в фокусе → охваты за пределами нишевой аудитории",
  },
  {
    handle: "@margaritaizv",
    platform: "Instagram",
    subs: "6.9k",
    likes: "38",
    emoji: "💜",
    color: "pink",
    quote: "Я купила её гайд. Причём не знаю, до или после того, как приняла решение по личной ситуации. Реально помогло.",
    what: "Коуч/тексты, тема гиперфиксации. Воронка: стихи → мемы → привязанность → «а вот и гайд». Продаёт продукт прямо из контента. 6.9k подписчиков.",
    take: "Эталон воронки для Оли: отрывки → инсайты → узнавание → Чип Дина (бесплатно) → Telegram → гайд (платно) → книга. Малая аудитория + продукт + воронка > большая без продукта.",
    formula: "Контент → лид-магнит (бесплатно) → платный продукт — вся воронка в одном профиле",
  },
] as const;

export default async function OlyaReferences() {
  await requireOlyaAuth("/olya/references");

  return (
    <OlyaShell>
      <div className="page-label">Референсы</div>
      <h1 className="page-title">6 блогеров — что взять</h1>
      <p className="page-sub">Выбраны Олей · Разобраны по принципу «что именно брать для её стиля»</p>

      <div className="callout purple" style={{ marginBottom: 32 }}>
        <strong>Итоговая формула Оли:</strong> подача как у Алины · персоналистика как у thequietquill · бренд-идентика как у lordmatas · кинематографичность как у Шишкина · юмор как у Ясюшки · воронка как у Маргариты
      </div>

      <table style={{ marginBottom: 32 }}>
        <thead>
          <tr>
            <th>Что брать</th>
            <th>От кого</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["Подача: разговорно, как с подругой", "@alinapugachevskaya"],
            ["Визуал: персоналистика, не полное лицо", "thequietquill"],
            ["Бренд-идентика: 3 слова", "@lordmatas"],
            ["Кинематографичность кадра", "@shishkinmax"],
            ["Юмор / «узнай себя»", "@jasushka"],
            ["Воронка: контент → лид-магнит → платный продукт", "@margaritaizv"],
          ].map(([what, who]) => (
            <tr key={what}>
              <td>{what}</td>
              <td style={{ color: "var(--accent)", fontWeight: 600 }}>{who}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {REFS.map((r) => (
        <div className="ref-card" key={r.handle}>
          <div className="ref-head">
            <div className="ref-avatar">{r.emoji}</div>
            <div>
              <div className="ref-name">{r.handle}</div>
              <div className="ref-handle">{r.platform}</div>
            </div>
          </div>
          <div className="ref-stats">
            <span className={`badge ${r.color}`}>{r.subs} подписчиков</span>
            <span className="badge neutral">{r.likes} лайков</span>
          </div>
          <div className="ref-body">
            <p style={{ fontStyle: "italic", color: "var(--text-3)", marginBottom: 10 }}>
              «{r.quote}»
            </p>
            <p><strong>Что делает:</strong> {r.what}</p>
            <div className="ref-take">
              <strong>Взять для Оли:</strong> {r.take}<br />
              <span style={{ opacity: 0.7, fontSize: 12, marginTop: 4, display: "block" }}>Формула: {r.formula}</span>
            </div>
          </div>
        </div>
      ))}
    </OlyaShell>
  );
}
