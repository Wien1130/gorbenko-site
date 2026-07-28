import { requireOlyaAuth } from "../auth-check";
import OlyaShell from "../OlyaShell";

export const metadata = { robots: { index: false, follow: false } };

export default async function OlyaStrategy() {
  await requireOlyaAuth("/olya/strategy");

  return (
    <OlyaShell>
      <div className="page-label">Стратегия блога</div>
      <h1 className="page-title">Instagram + TikTok</h1>
      <p className="page-sub">Позиционирование · Пилары · CTA · План на 2 месяца</p>

      <section className="section">
        <h2 className="section-title">🎯 Позиционирование</h2>
        <div className="callout purple" style={{ fontSize: 16, fontWeight: 600 }}>
          «Писательница, которая показывает, как травмы искажают восприятие любви,
          дружбы, семьи и работы — и учит видеть это в историях и в жизни.»
        </div>
        <div className="callout neutral" style={{ marginTop: 8 }}>
          <strong>Три причины подписаться (три слоя):</strong><br />
          1 · Ремесло письма — символизм, клише, приёмы. Экспертность.<br />
          2 · Психология травм — тема книги, попадает в боль массовой аудитории.<br />
          3 · Путь автора — закулисье, перфекционизм, жертвы ради мечты. Эмоция.
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">👥 Аудитория</h2>
        <div className="card">
          <div className="card-body">
            <p><strong>Ядро:</strong> девушки 18–35, читающие, рефлексирующие, любят атмосферу, сторителлинг, «эстетику смысла».</p>
            <p style={{ marginTop: 8 }}>
              <strong>Пишущие / мечтающие писать</strong> — им заходит ремесло.<br />
              <strong>Любители «глубокого» контента про отношения</strong> — им заходит тема травм.<br />
              <strong>Люди, наблюдающие за чужой мечтой</strong> — им заходит её история.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">📊 Контент-пилары (4 рубрики)</h2>
        <table>
          <thead>
            <tr>
              <th>Пилар</th>
              <th>О чём</th>
              <th>Зачем</th>
              <th>Доля</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="badge purple">1 · Ремесло</span></td>
              <td>Символизм, клише, первые фразы, микрореакции</td>
              <td>Экспертность, сохранения, виральность</td>
              <td><strong style={{ color: "#7c6af0" }}>40%</strong></td>
            </tr>
            <tr>
              <td><span className="badge pink">2 · Травмы</span></td>
              <td>Как прошлое искажает любовь/дружбу/семью/работу</td>
              <td>Эмоция, комментарии, ЦА книги</td>
              <td><strong style={{ color: "#f472b6" }}>25%</strong></td>
            </tr>
            <tr>
              <td><span className="badge amber">3 · Закулисье</span></td>
              <td>Курс, перфекционизм, жертвы, путь к изданию</td>
              <td>Привязанность, личный бренд</td>
              <td><strong style={{ color: "#fbbf24" }}>20%</strong></td>
            </tr>
            <tr>
              <td><span className="badge blue">4 · Книга</span></td>
              <td>Цитаты, сцены, открытки→текст, тизеры</td>
              <td>Прогрев к книге, узнаваемость стиля</td>
              <td><strong style={{ color: "#60a5fa" }}>15%</strong></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2 className="section-title">🪝 Структура любого reels</h2>
        <div className="grid-3">
          <div className="card">
            <div className="card-head"><span className="badge pink">ХУК · 0–3 сек</span></div>
            <div className="card-body">
              <p>Вопрос / провокация / обещание. Зритель должен остаться.</p>
              <p style={{ marginTop: 8 }}><em>«Ты используешь символизм? А делаешь это правильно?»</em></p>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><span className="badge amber">СЕРЕДИНА · 3–20 сек</span></div>
            <div className="card-body">
              <p>Один конкретный пример. Контраст «плохо → хорошо».</p>
              <p style={{ marginTop: 8 }}>Одно reels = <strong>одна мысль</strong>. Не пихать всё.</p>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><span className="badge green">CTA · 2–4 сек</span></div>
            <div className="card-body">
              <p>Кто я → для кого блог → что получишь → действие.</p>
              <p style={{ marginTop: 8 }}>Ключевое: дать зрителю <strong>повод узнать себя</strong>.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">📣 CTA — улучшенные варианты</h2>
        <div className="callout neutral">
          <strong>Что сейчас:</strong> «Подписывайтесь, чтобы я делилась полезным атмосферным контентом» → размыто, нет идентичности зрителя.
        </div>
        {[
          ["Под пилар «Ремесло»", "Я Оля, пишу книгу и учусь у настоящих писателей. Если ты тоже пишешь — подпишись, тут я разбираю, как не скатиться в клише и цеплять с первой строки."],
          ["Под пилар «Травмы»", "Я Оля. Пишу книгу о том, как старые травмы управляют нашими отношениями. Если узнала себя — подпишись, тут мы про это честно."],
          ["Короткий универсальный", "Я Оля. Подпишись, если любишь истории, в которых за словами есть второе дно."],
          ["С интригой к книге", "Я Оля, пишу книгу, которая начинается с фразы «Господи, какой идиот, в жизни не буду с ним общаться». Подпишись — буду показывать, как она рождается."],
        ].map(([label, text]) => (
          <div className="callout purple" key={label} style={{ marginBottom: 10 }}>
            <strong>{label}</strong><br />{text}
          </div>
        ))}
      </section>

      <section className="section">
        <h2 className="section-title">📅 План на 2 месяца</h2>
        <table>
          <thead>
            <tr><th>Фаза</th><th>Фокус</th><th>Задача</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="badge purple">Нед. 1</span></td>
              <td>Фундамент</td>
              <td>Переупаковать профиль (bio, аватар, закреп). Первые 3 «якорных» reels: склады / символизм / тизер книги.</td>
            </tr>
            <tr>
              <td><span className="badge blue">Нед. 2–4</span></td>
              <td>Объём + тесты</td>
              <td>Гнать пилар 1 и 2. Замерять, что залетает. Закрепить 2–3 формата-шаблона для быстрой съёмки.</td>
            </tr>
            <tr>
              <td><span className="badge amber">Нед. 5–6</span></td>
              <td>Серии</td>
              <td>Запустить рубрику-сериал: «Клише недели» или «Разбор сцены». Серии = возвраты и подписки.</td>
            </tr>
            <tr>
              <td><span className="badge green">Нед. 7–8</span></td>
              <td>Прогрев к книге</td>
              <td>Больше пилара 4. Собрать тёплых в Telegram-канал — «узнавать первыми про книгу».</td>
            </tr>
          </tbody>
        </table>
        <div className="callout neutral" style={{ marginTop: 14 }}>
          <strong>Метрики (смотреть еженедельно):</strong> удержание на хуке (первые 3 сек), досмотры, сохранения, репосты, прирост подписок, комментарии. Виральность даёт пилар 1 — масштабировать то, что зашло.
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🎙️ Оформление профиля (до первой публикации)</h2>
        <div className="card">
          <div className="card-head">Bio (черновик)</div>
          <div className="card-body">
            <p style={{ fontStyle: "italic", fontSize: 15 }}>
              Пишу книгу о том, как травмы искажают любовь, дружбу, семью и работу.<br />
              Учусь писать так, чтобы невозможно было оторваться.<br />
              Тут — ремесло, смыслы, путь к изданию.
            </p>
          </div>
        </div>
        <div className="grid-3" style={{ marginTop: 12 }}>
          <div className="card">
            <div className="card-head">Закреп #1</div>
            <div className="card-body"><p>Кто я / зачем блог</p></div>
          </div>
          <div className="card">
            <div className="card-head">Закреп #2</div>
            <div className="card-body"><p>История со складами (самый сильный)</p></div>
          </div>
          <div className="card">
            <div className="card-head">Закреп #3</div>
            <div className="card-body"><p>Тизер книги / первая фраза</p></div>
          </div>
        </div>
      </section>
    </OlyaShell>
  );
}
