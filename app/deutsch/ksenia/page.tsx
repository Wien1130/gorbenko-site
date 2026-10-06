import { ANDRII_AS_STUDENT, TEACHER_RITUAL, nextHourForTeacher } from "../data/teacher";

export default function KseniaPage() {
  const next = nextHourForTeacher();

  return (
    <>
      <article className="heft-paper">
        <div className="heft-kicker">Für die Lehrerin</div>
        <h1 className="heft-h1">Ксюша</h1>
        <p className="heft-lead">{ANDRII_AS_STUDENT.greetingDe}</p>
        <p className="heft-lead" style={{ marginTop: 10 }}>
          Это не домашка Андрея. Это шпаргалка, как его учить быстрее: что уже работает, куда он сваливается, чем открыть следующий час.
        </p>
      </article>

      <section className="heft-section heft-paper">
        <h2 className="heft-h2">Как он учится</h2>
        <ul className="heft-list">
          {ANDRII_AS_STUDENT.howHeLearns.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="heft-section heft-paper">
        <h2 className="heft-h2">Что у тебя уже зашло</h2>
        <ul className="heft-list">
          {ANDRII_AS_STUDENT.works.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="heft-section heft-paper">
        <h2 className="heft-h2">Лучше не делать</h2>
        <ul className="heft-list">
          {ANDRII_AS_STUDENT.avoid.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="heft-section heft-paper">
        <div className="heft-kicker">Nächste Stunde</div>
        <h2 className="heft-h2">Следующий час · {next.when}</h2>
        <p className="heft-lead">Прошлый час: {next.lastTopic}. Разминка 5 минут, потом новая тема на его словах.</p>
        <h3 className="heft-kicker" style={{ marginTop: 18 }}>Разминка</h3>
        <ul className="heft-list" style={{ marginTop: 8 }}>
          {next.warmup.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3 className="heft-kicker" style={{ marginTop: 18 }}>Держать в ухе</h3>
        <ul className="heft-list" style={{ marginTop: 8 }}>
          {next.drill.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="heft-letter">
          <div className="heft-kicker">Слова, которые он ломал {next.lastDate}</div>
          <p style={{ margin: "8px 0 0" }}>{next.watch.join(" · ")}</p>
        </div>
      </section>

      <section className="heft-section heft-paper">
        <h2 className="heft-h2">Ритуал на каждый урок</h2>
        {TEACHER_RITUAL.map((note) => (
          <div key={note.title} className="heft-fix" style={{ marginBottom: 10 }}>
            <b>{note.title}</b>
            <span>{note.body}</span>
          </div>
        ))}
      </section>
    </>
  );
}
