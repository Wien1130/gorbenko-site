import { requireOlyaAuth } from "./auth-check";
import OlyaShell from "./OlyaShell";

export const metadata = { robots: { index: false, follow: false } };

export default async function OlyaOverview() {
  await requireOlyaAuth("/olya");

  return (
    <OlyaShell>
      <div className="page-label">Обзор проекта</div>
      <h1 className="page-title">Оля — писательница</h1>
      <p className="page-sub">Личный бренд · Instagram / TikTok · Книга «Не смотри в глаза. Рождение»</p>

      <div className="stat-strip">
        <div className="stat-box">
          <div className="stat-label">Подписчиков</div>
          <div className="stat-val">71</div>
          <div className="stat-note">старт проекта</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Цель за 2 мес.</div>
          <div className="stat-val">10k</div>
          <div className="stat-note">+9 929 подписчиков</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Reels / день</div>
          <div className="stat-val">3</div>
          <div className="stat-note">по договорённости</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Книга готова</div>
          <div className="stat-val">80 стр</div>
          <div className="stat-note">цель 250–300</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Сценариев</div>
          <div className="stat-val">22</div>
          <div className="stat-note">готово к съёмке</div>
        </div>
      </div>

      <section className="section">
        <h2 className="section-title">🎯 Кто такая Оля</h2>
        <div className="callout purple">
          <strong>Позиционирование в одной строке:</strong>
          Писательница, которая показывает, как травмы искажают восприятие любви, дружбы, семьи и работы — и учит видеть это в историях и в жизни.
        </div>
        <div className="grid-2" style={{ marginTop: 14 }}>
          <div className="card">
            <div className="card-head">📚 Книга</div>
            <div className="card-body">
              <p><strong>«Не смотри в глаза. Рождение»</strong> — Том 1</p>
              <p>3-е лицо. Главная героиня — <strong>Кира</strong>. Второй персонаж — <strong>Дин</strong>.</p>
              <p>Травма: <strong>КПТСР</strong> у двух персонажей. Флёр пограничного расстройства личности.</p>
              <p>Первая фраза: <em>«Господи, какой идиот, в жизни не буду с ним общаться»</em></p>
            </div>
          </div>
          <div className="card">
            <div className="card-head">🤝 Договорённость (бартер) · win-win</div>
            <div className="card-body">
              <p style={{ marginBottom: 12 }}>Честный обмен — каждый усиливает другого.</p>

              <div className="callout neutral" style={{ marginBottom: 10 }}>
                <strong>Снимают вместе — 2 месяца:</strong> по <strong>3 видео/день</strong> каждому (Оля и Андрей) = <strong>21 видео/неделю</strong> на каждого.
              </div>

              <div className="callout pink" style={{ marginBottom: 10 }}>
                <strong>Оля → Андрею</strong>
                <ul style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.7 }}>
                  <li>Монтаж своих reels + видео Андрея</li>
                  <li><strong>4 съёмочных дня</strong> — по 21 видео за день = <strong>84 видео</strong> для клиентов Андрея + их монтаж</li>
                  <li>Монтаж <strong>горизонтальных видео</strong> для YouTube-канала Андрея</li>
                </ul>
              </div>

              <div className="callout blue" style={{ marginBottom: 0 }}>
                <strong>Андрей → Оле</strong>
                <ul style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.7 }}>
                  <li>Снимает Олю, помогает со структурой и сценариями</li>
                  <li>Собрал персональную <strong>AI-систему контента</strong> (этот сайт + бот)</li>
                </ul>
                <p style={{ marginTop: 10, lineHeight: 1.65 }}>
                  Оля наговаривает идею голосом в Telegram — система сама расшифровывает её, превращает в готовый сценарий reels (Хук / Середина / CTA) и публикует на этом сайте вместе со стратегией, банком идей и референсами. Оле остаётся только говорить и снимать — структура появляется сама.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🎬 Три слоя контента (почему подписываются)</h2>
        <div className="grid-3">
          <div className="card">
            <div className="card-head"><span className="badge purple">Пилар 1</span></div>
            <div className="card-body">
              <p><strong>Ремесло письма</strong></p>
              <p>Символизм, клише, первые фразы, микрореакции. Экспертность → сохранения, виральность.</p>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><span className="badge pink">Пилар 2</span></div>
            <div className="card-body">
              <p><strong>Травмы и восприятие</strong></p>
              <p>Как прошлое искажает любовь, дружбу, семью, работу. Эмоция → комментарии.</p>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><span className="badge amber">Пилар 3</span></div>
            <div className="card-body">
              <p><strong>Закулисье автора</strong></p>
              <p>Курс, перфекционизм, жертвы ради мечты. Привязанность, личный бренд.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">⭐ Три reels снять первыми</h2>
        <div className="callout green">
          <strong>#16 — История про склады (ЗАКРЕП #1)</strong>
          Зима, дрожащие руки, Zoom-собеседование на улице. День на складах в пыли. «Богемская рапсодия». Самый сильный эмоционально.
        </div>
        <div className="callout blue">
          <strong>#20 — Микрореакции Дина (ЛИДМАГНИТ)</strong>
          «Пиши "Дин нахмурил рот", а не "он выглядел обиженно"». В комментах — «хочу чип» → трафик в Telegram.
        </div>
        <div className="callout purple">
          <strong>#22 — Первая фраза (ВИРАЛЬНЫЙ)</strong>
          «Женщина пишет: мой муж мёртв 3 года, а вчера я увидела его в аптеке…» → и своя первая фраза книги.
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">💰 Воронка монетизации</h2>
        <div className="card">
          <div className="card-body">
            <p>
              <strong>Reels</strong> →{" "}
              <strong>Чип Дина (бесплатный PDF)</strong> →{" "}
              <strong>Telegram-канал</strong> →{" "}
              <strong>Гайд «Как понять, что из отношений что-то выйдет»</strong> →{" "}
              <strong>Ранний доступ к книге</strong>
            </p>
            <p style={{ marginTop: 10 }}>
              Telegram: уже есть личный канал, 14 подписчиков. Переупаковать под писательскую тему.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">❓ Открытые вопросы</h2>
        <div className="grid-2">
          {[
            ["Ссылка на аккаунт", "Проверить bio и закреп до первой публикации"],
            ["Дата первой батч-съёмки", "Договориться на конкретный день/время"],
            ["Готовые отрывки для reels", "Сцены из книги, которые можно зачитать прямо сейчас"],
            ["Чип Дина", "Она готова сделать список 15–20 микрореакций сейчас?"],
            ["Название Telegram-канала", "Переупаковать под писателя или оставить личным?"],
            ["Хэштег курса", "Точный хэштег для первого reels по заданию"],
          ].map(([q, a]) => (
            <div className="card" key={q}>
              <div className="card-head">{q}</div>
              <div className="card-body"><p>{a}</p></div>
            </div>
          ))}
        </div>
      </section>
    </OlyaShell>
  );
}
