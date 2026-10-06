import { requireAndriiAuth } from "../auth-check";
import AndriiShell from "../AndriiShell";
import CopyCaption from "./CopyCaption";
import { REEL_GROUPS, SCRIPTS, type ReelGroup } from "./scripts";

export const metadata = { robots: { index: false, follow: false } };

const CTA_HINT: Record<string, string> = {
  A: "CTA-A · подписка",
  B: "CTA-B · «Schreib KI» в директ",
  C: "CTA-C · «KI» в комментарии",
  D: "CTA-D · Blitz-Check 100 €",
  E: "CTA-E · «SITE», сайт от 2 дней",
};

export default async function AndriiReels2() {
  await requireAndriiAuth("/andrii/reels-2");

  return (
    <AndriiShell>
      <div className="page-label">Банк 2 · польза + подпись для IG</div>
      <h1 className="page-title">30 reels — посмотрел, внедрил, сохранил</h1>
      <p className="page-sub">
        Каждый ролик = одна механика, которую человек применяет за 2 минуты: точный промпт, формула или чек-лист.
        К каждому — готовая подпись в Instagram на немецком (+ перевод) и 5 хештегов, копируются одной кнопкой.
      </p>

      <div className="stat-strip">
        {REEL_GROUPS.map((g) => (
          <div className="stat-box" key={g.id}>
            <div className="stat-label">{g.emoji} Группа</div>
            <div className="stat-val" style={{ fontSize: 14, paddingTop: 4 }}>{g.id}</div>
            <div className="stat-note">{g.count} роликов · {g.note}</div>
          </div>
        ))}
      </div>

      <div className="callout green" style={{ marginBottom: 26 }}>
        <strong>Как пользоваться:</strong> DE-текст — опорные фразы, говоришь своими словами; в скобках русский, чтобы понимать смысл.
        Подпись под роликом копируешь кнопкой «Подпись + хештеги» — она уже с хештегами, ничего дописывать не надо.
        CTA-блоки те же, что в первом банке (A/B/C/D/E), сняты один раз и клеятся в монтаже.
      </div>

      {REEL_GROUPS.map((group) => (
        <section className="section" key={group.id}>
          <h2 className="section-title">
            {group.emoji} {group.id}
            <span className={`badge ${group.badge}`} style={{ marginLeft: "auto" }}>{group.count} роликов</span>
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: -8, marginBottom: 16 }}>{group.note}</p>

          {SCRIPTS.filter((s) => s.group === (group.id as ReelGroup)).map((s) => (
            <div className="script-card" key={s.num}>
              <div className="script-head">
                <div className="script-num">{s.num}</div>
                <div style={{ flex: 1 }}>
                  <div className="script-title">{s.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{CTA_HINT[s.cta]}</div>
                </div>
                <span className={`badge ${group.badge}`}>{group.emoji} {group.id}</span>
              </div>

              <div className="script-body">
                <div className="script-row">
                  <div className="script-row-label">Хук</div>
                  <div className="script-row-val">
                    <div className="de-line">«{s.hookDe}»</div>
                    <div className="ru-line">({s.hookRu})</div>
                  </div>
                </div>

                <div className="script-row">
                  <div className="script-row-label">Польза</div>
                  <div className="script-row-val">
                    <div className="de-line" style={{ fontWeight: 500 }}>{s.midDe}</div>
                    <div className="ru-line">({s.midRu})</div>
                  </div>
                </div>

                <div className="script-row">
                  <div className="script-row-label">CTA</div>
                  <div className="script-row-val"><strong>Блок CTA-{s.cta}</strong> — клеится в монтаже</div>
                </div>

                <div className="script-row">
                  <div className="script-row-label">💾 Сохранят</div>
                  <div className="script-row-val" style={{ color: "var(--text-3)", fontSize: 13 }}>{s.saveWhy}</div>
                </div>

                <div className="script-row">
                  <div className="script-row-label">🎬 Съёмка</div>
                  <div className="script-row-val" style={{ color: "var(--text-3)", fontSize: 13 }}>{s.shoot}</div>
                </div>

                <div className="cap-box">
                  <div className="cap-head">
                    <span>📝 Подпись в Instagram</span>
                    <CopyCaption
                      text={`${s.captionDe}\n\n${s.hashtags.join(" ")}`}
                      label="Подпись + хештеги"
                    />
                  </div>
                  <div className="cap-de">{s.captionDe}</div>
                  <div className="cap-tags">
                    {s.hashtags.map((h) => (
                      <span className="tag" key={h}>{h}</span>
                    ))}
                  </div>
                  <details className="cap-ru">
                    <summary>Перевод подписи на русский</summary>
                    <div className="cap-ru-body">{s.captionRu}</div>
                  </details>
                </div>
              </div>
            </div>
          ))}
        </section>
      ))}

      <section className="section">
        <h2 className="section-title">✅ Проверка перед съёмкой (банк 2)</h2>
        <div className="callout neutral">
          1 · Есть ли в ролике конкретная механика — промпт, формула, 3 шага? Если нет пользы «прямо сейчас» — не снимать. &nbsp;·&nbsp;
          2 · Захочет ли человек сохранить, чтобы вернуться? &nbsp;·&nbsp; 3 · Перешлёт ли коллеге / жене / владельцу бизнеса? &nbsp;·&nbsp;
          4 · Одна мысль на ролик, максимум 3 шага. &nbsp;·&nbsp; 5 · Хук без приветствия, конфликт за 0,5 сек. &nbsp;·&nbsp;
          6 · Субтитры DE обязательно, первая строка = хук. Подпись копируется отсюда целиком.
        </div>
      </section>
    </AndriiShell>
  );
}
