import { requireAndriiAuth } from "../auth-check";
import AndriiShell from "../AndriiShell";
import { FACTS, INTRO, TEXTS } from "./texts";

export const metadata = {
  title: "Дом мечты · тексты",
  robots: { index: false, follow: false },
};

export default async function AndriiDom() {
  await requireAndriiAuth("/andrii/dom");

  return (
    <AndriiShell>
      <div className="page-label">Дом мечты · 24.09.2026</div>
      <h1 className="page-title">Тексты для перечитывания</h1>
      <p className="page-sub">{INTRO}</p>

      <section className="section">
        <div className="stat-strip">
          {FACTS.map((f) => (
            <div className="stat-box" key={f.label}>
              <div className="stat-val">{f.value}</div>
              <div className="stat-label">{f.label}</div>
              <div className="stat-note">{f.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="callout">
          <strong>Принцип №7 — С собой как с Алиной.</strong> Перед любым вердиктом себе («хватит», «дорого»,
          «не заслужил», «не получится») один вопрос: сказал бы я это Алине и остался спокоен? Нет — значит, и себе нет.
        </div>
      </section>

      {TEXTS.map((t) => (
        <section className="section" key={t.id} id={t.id}>
          <div className="card">
            <div className="card-head">
              {t.tag ? <span className="badge accent">{t.tag}</span> : null}
              <span>{t.title}</span>
            </div>
            <div className="card-body">
              {t.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="callout">
          <strong>Как читать.</strong> Не всё за раз. Один-два раздела вечером с Алиной, пока не станет скучно. Скучно
          = усвоено. Разделы 1–2 — главные. Полная смета и планы дома — в канве Cursor «dream-house».
        </div>
      </section>
    </AndriiShell>
  );
}
