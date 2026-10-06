import { emphasizeWin, getLesson } from "./data/lessons";

export default async function DeutschPage({
  searchParams,
}: {
  searchParams: Promise<{ l?: string }>;
}) {
  const { l } = await searchParams;
  const lesson = getLesson(l);
  const win = emphasizeWin(lesson.win.de, lesson.win.highlight);

  return (
    <>
      <article className="heft-paper">
        <div className="heft-kicker">Lektion {String(lesson.number).padStart(2, "0")} · {lesson.minutes} Min.</div>
        <h1 className="heft-h1">{lesson.topicDe}</h1>
        <p className="heft-lead">
          {lesson.dateLabel}. {lesson.topic}. Разбор после урока с {lesson.teacher.split(" ")[0]} — что запомнить, где споткнулся, что говорить до следующего часа.
        </p>

        <div className="heft-stats">
          <div className="heft-stat">
            <b>{lesson.corrections.length}</b>
            <span>слов починили</span>
          </div>
          <div className="heft-stat">
            <b>{lesson.wordOfDay ? lesson.wordOfDay.de : lesson.triples.length}</b>
            <span>{lesson.wordOfDay ? "слово дня" : "троек исключений"}</span>
          </div>
          <div className="heft-stat">
            <b>{lesson.homework.length}</b>
            <span>фраз дома</span>
          </div>
        </div>

        <div className="heft-win">
          <div className="heft-kicker">Главный выигрыш</div>
          <p className="heft-win-de">
            {win.before}
            {win.mark ? <em>{win.mark}</em> : null}
            {win.after}
          </p>
          <p className="heft-win-ru">{lesson.win.ru}</p>
          <p className="heft-win-note">{lesson.win.note}</p>
        </div>
      </article>

      {lesson.wordOfDay ? (
        <section className="heft-section heft-paper">
          <div className="heft-kicker">Wort des Tages</div>
          <h2 className="heft-h2">{lesson.wordOfDay.de}</h2>
          <p className="heft-lead">{lesson.wordOfDay.ru}. {lesson.wordOfDay.note}</p>
        </section>
      ) : null}

      <section className="heft-section heft-paper">
        <h2 className="heft-h2">На что смотреть</h2>
        <ul className="heft-list">
          {lesson.stuck.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="heft-section heft-paper">
        <h2 className="heft-h2">Что уже тянешь</h2>
        <ul className="heft-list">
          {lesson.strengths.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="heft-section heft-paper">
        <h2 className="heft-h2">Слова, которые чинили</h2>
        <div className="heft-grid">
          {lesson.corrections.map((row) => (
            <div className="heft-fix" key={row.need}>
              <s>{row.said}</s>
              <b>{row.need}</b>
              <span>{row.when}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="heft-section heft-paper">
        <h2 className="heft-h2">{lesson.triplesTitle ?? "Тройки"}</h2>
        {lesson.triples.map((t) => (
          <div className="heft-triple-row" key={t.id}>
            <div className="heft-chip">
              <small>обычно</small>
              <b>{t.base}</b>
            </div>
            <div className="heft-chip">
              <small>сравнительнее</small>
              <b>{t.comp}</b>
            </div>
            <div className="heft-chip">
              <small>больше всего</small>
              <b>{t.sup}</b>
            </div>
          </div>
        ))}
        {lesson.examples.length > 0 ? (
          <div className="heft-letter" style={{ marginTop: 16 }}>
            {lesson.examples.slice(0, 3).map((ex) => (
              <p key={ex.id} style={{ margin: "0 0 10px" }}>
                {ex.de}
              </p>
            ))}
          </div>
        ) : null}
      </section>

      <section className="heft-section heft-paper">
        <h2 className="heft-h2">Как шёл час</h2>
        <ul className="heft-list">
          {lesson.outline.map((item, i) => (
            <li key={item}>
              {i + 1}. {item}
            </li>
          ))}
        </ul>
        <div className="heft-letter">
          <div className="heft-kicker">Для Ксюши</div>
          <p style={{ margin: "8px 0 0" }}>{lesson.noteForTeacher}</p>
          <p style={{ margin: "12px 0 0" }}>
            <a href={`/deutsch/strasse?l=${lesson.id}`} style={{ color: "var(--wax)", fontWeight: 700 }}>
              Сегодня на улице →
            </a>
            {" · "}
            <a href="/deutsch/ksenia" style={{ color: "var(--wax)", fontWeight: 700 }}>
              Ксюша →
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
