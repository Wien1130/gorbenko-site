import { requireBiMarktAuth } from "./auth-check";

export const metadata = {
  title: "BI-рынок DACH · Gorbenko",
  robots: { index: false, follow: false },
};

function Bar({
  label,
  value,
  max,
  display,
  tone = "accent",
}: {
  label: string;
  value: number;
  max: number;
  display: string;
  tone?: "accent" | "blue" | "amber" | "green";
}) {
  const toneMap = {
    accent: { bg: "var(--accent-dim)", edge: "var(--accent)" },
    blue: { bg: "var(--blue-bg)", edge: "var(--blue)" },
    amber: { bg: "var(--amber-bg)", edge: "var(--amber)" },
    green: { bg: "var(--green-bg)", edge: "var(--green)" },
  } as const;
  const c = toneMap[tone];
  const pct = Math.max(2, Math.round((value / max) * 100));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(110px, 210px) 1fr 92px",
        gap: 12,
        alignItems: "center",
        marginBottom: 9,
      }}
    >
      <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.35 }}>{label}</span>
      <div
        style={{
          height: 22,
          background: "var(--surface2)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: c.bg,
            borderRight: `2px solid ${c.edge}`,
            borderRadius: 6,
          }}
        />
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: "var(--text)",
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {display}
      </span>
    </div>
  );
}

export default async function BiMarktPage() {
  await requireBiMarktAuth("/bi-markt");

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-brand">Gorbenko · закрытый материал</div>
          <div className="topbar-sub">Только по ссылке и паролю · не индексируется</div>
        </div>
        <a className="topbar-link" href="/andrii">
          ← личный кабинет
        </a>
      </div>

      <div className="page-label">Рынок · исследование</div>
      <h1 className="page-title">Кому в DACH продавать Power BI</h1>
      <p className="page-sub">
        Размер рынка среднего бизнеса · 30.07.2026 · Destatis, KMU im Fokus 2025, BFS STATENT
      </p>

      <div className="stat-strip">
        <div className="stat-box">
          <div className="stat-label">Ядро DACH</div>
          <div className="stat-val">~101 000</div>
          <div className="stat-note">компаний 50–249 сотрудников</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Широкий охват</div>
          <div className="stat-val">~290 000</div>
          <div className="stat-note">20–249 сотрудников</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Квалифицированные</div>
          <div className="stat-val">~47 000</div>
          <div className="stat-note">из ядра — без работающей BI</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Вена · твой радиус</div>
          <div className="stat-val">~650</div>
          <div className="stat-note">≈ €13 млн ёмкости в год</div>
        </div>
      </div>

      <div className="callout green">
        <strong>Главный вывод.</strong> Рынок не является ограничением ни в одном сценарии. Чтобы
        направление приносило €500k в год при среднем чеке €20k, нужно 25 клиентов — это 4% от
        венского списка. Узкое место не в количестве компаний, а в доступе к правильным 650 фирмам и
        в умении объяснить ценность за двадцать минут.
      </div>

      <section className="section">
        <h2 className="section-title">📏 Где именно проходит окно</h2>
        <div className="callout neutral">
          Оборот — плохой первичный фильтр. Торговая контора с восемью сотрудниками легко делает
          €5 млн, и анализировать ей нечего. У производственника с теми же €5 млн будет 30 человек и
          втрое больше процессов. Считать надо по количеству сотрудников, оборот — вторичная проверка
          платёжеспособности.
        </div>
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Размер</th>
                  <th>Оборот</th>
                  <th>Что у них с данными</th>
                  <th>Вердикт</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>до 10 чел.</td>
                  <td>до €1–2 млн</td>
                  <td>Собственник держит всё в голове, одна касса</td>
                  <td>Мимо — ни боли, ни бюджета</td>
                </tr>
                <tr>
                  <td>10–19 чел.</td>
                  <td>€1–3 млн</td>
                  <td>Появился ERP, Excel ещё справляется</td>
                  <td>Мимо — платят €2–5k, продажа не окупается</td>
                </tr>
                <tr>
                  <td>20–49 чел.</td>
                  <td>€3–10 млн</td>
                  <td>ERP + CRM + склад, начинается ручная склейка</td>
                  <td>
                    <span className="badge amber">Нижняя граница</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong style={{ color: "var(--text)" }}>50–249 чел.</strong>
                  </td>
                  <td>
                    <strong style={{ color: "var(--text)" }}>€10–50 млн</strong>
                  </td>
                  <td>4–8 систем, есть контроллер, нет ни одного дата-специалиста</td>
                  <td>
                    <span className="badge accent">Sweet spot</span>
                  </td>
                </tr>
                <tr>
                  <td>250–999 чел.</td>
                  <td>€50–250 млн</td>
                  <td>Нанимают первого BI-специалиста, но покупают и снаружи</td>
                  <td>Цикл 6–12 мес., там уже adesso</td>
                </tr>
                <tr>
                  <td>1000+ чел.</td>
                  <td>&gt; €250 млн</td>
                  <td>Своё дата-подразделение, свой Databricks</td>
                  <td>Мимо — проиграешь Accenture</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="callout blue">
          <strong>Почему потолок именно 250.</strong> Нанять BI-специалиста в DACH стоит €70–90k в
          год брутто. Фирма на 120 человек такую ставку не открывает — и именно поэтому покупает
          снаружи. Выше 250 сотрудников ставка появляется, и ты превращаешься из решения в
          конкурента их же сотруднику.
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🌍 Сколько таких компаний физически существует</h2>
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Класс по сотрудникам</th>
                  <th>Германия</th>
                  <th>Австрия</th>
                  <th>Швейцария</th>
                  <th>DACH</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>до 10</td>
                  <td>3 011 214</td>
                  <td>~555 800</td>
                  <td>561 952</td>
                  <td>~4 129 000</td>
                </tr>
                <tr>
                  <td>10–49</td>
                  <td>429 318</td>
                  <td>~42 300</td>
                  <td>52 476</td>
                  <td>~524 000</td>
                </tr>
                <tr>
                  <td>в т.ч. 20–49</td>
                  <td>~155 800*</td>
                  <td>~15 400*</td>
                  <td>19 054</td>
                  <td>~190 000</td>
                </tr>
                <tr>
                  <td>
                    <strong style={{ color: "var(--accent)" }}>50–249</strong>
                  </td>
                  <td>
                    <strong style={{ color: "var(--accent)" }}>84 701</strong>
                  </td>
                  <td>
                    <strong style={{ color: "var(--accent)" }}>6 400</strong>
                  </td>
                  <td>
                    <strong style={{ color: "var(--accent)" }}>9 791</strong>
                  </td>
                  <td>
                    <strong style={{ color: "var(--accent)" }}>100 892</strong>
                  </td>
                </tr>
                <tr>
                  <td>250 и больше</td>
                  <td>18 632</td>
                  <td>~1 800</td>
                  <td>1 814</td>
                  <td>~22 200</td>
                </tr>
                <tr>
                  <td>Всего компаний</td>
                  <td>3 543 865</td>
                  <td>~605 900</td>
                  <td>626 033</td>
                  <td>~4 776 000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="callout neutral">
          * Официальная статистика Германии и Австрии даёт единый класс 10–49; разбивка 20–49
          экстраполирована по швейцарской пропорции (20–49 = 36% от класса 10–49). Германия — данные
          2024, с этого года Destatis перешёл на «Jobkonzept» и считает каждое трудовое отношение
          отдельно, поэтому классы 10–49 и 50–249 выше прошлогодних примерно на 5–10% без реального
          роста экономики. Австрия — KMU im Fokus 2025 (данные 2024, рыночная экономика). Швейцария —
          BFS STATENT, данные 2023.
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">💶 Если всё-таки считать по обороту (Германия)</h2>
        <div className="card">
          <div className="card-body">
            <p style={{ marginBottom: 16 }}>
              Порог «от €1 млн» отсекает почти ничего: под него попадает <strong>492 963</strong>{" "}
              немецкие фирмы, и почти все они — микробизнес на 5–10 человек. Реальный водораздел
              проходит между €10 и €50 млн — и этот класс почти точно накладывается на 50–249
              сотрудников.
            </p>
            <Bar label="€1–2 млн" value={199000} max={235000} display="199 000" tone="blue" />
            <Bar label="€2–10 млн" value={235000} max={235000} display="235 000" tone="blue" />
            <Bar label="€10–50 млн" value={38000} max={235000} display="38 000" tone="accent" />
            <Bar label="больше €50 млн" value={21000} max={235000} display="21 000" tone="amber" />
            <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 14, lineHeight: 1.6 }}>
              Количество юридических единиц по классам годового оборота. Источник: Statistisches
              Bundesamt, Umsatzsteuerstatistik / Unternehmensregister, отчётный год 2024. Полосы
              получены вычитанием кумулятивных долей: больше €1 млн — 13,9%, больше €2 млн — 8,3%,
              от €10 млн — 59 371 фирма, больше €50 млн — 0,6%.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🔻 От 101 тысячи к тем, кому реально нечем закрыть задачу</h2>
        <div className="card">
          <div className="card-body">
            <Bar
              label="50–249 сотрудников в DACH"
              value={100892}
              max={100892}
              display="100 892"
              tone="blue"
            />
            <Bar
              label="минус дочки концернов"
              value={80700}
              max={100892}
              display="~80 700"
              tone="blue"
            />
            <Bar
              label="минус те, у кого BI работает"
              value={47000}
              max={100892}
              display="~47 000"
              tone="accent"
            />
            <Bar label="Австрия целиком" value={6400} max={100892} display="6 400" tone="amber" />
            <Bar
              label="Вена, квалифицированные"
              value={650}
              max={100892}
              display="~650"
              tone="green"
            />
            <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 14, lineHeight: 1.6 }}>
              Шаг 2 — минус 20% на дочерние предприятия групп, которые получают отчётность из
              головного офиса (оценка). Шаг 3 — по Digitalisierungsstudie 2024/25 (314 KMU, 30–1200
              сотрудников, €10–500 млн) BI-инструменты используют 42%, значит 58% не используют
              ничего.
            </p>
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: 14 }}>
          <div className="card">
            <div className="card-head">Что говорит статистика о боли</div>
            <div className="card-body">
              <p>
                <strong>73%</strong> среднего бизнеса в Германии принимают стратегические решения по
                Excel и по ощущениям.
              </p>
              <p>
                <strong>75%</strong> не имеют системной дата-стратегии — при том что{" "}
                <strong>82%</strong> считают аналитику стратегически важной.
              </p>
              <p>
                Контроллер тратит <strong>40%</strong> рабочего времени на сбор и склейку данных
                вместо анализа.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-head">Почему не делают сами</div>
            <div className="card-body">
              <p>
                <strong>53%</strong> называют главным барьером нехватку технического know-how
                (Bitkom 2025).
              </p>
              <p>
                <strong>51%</strong> — нехватку людей. У фирмы на 120 человек нет ставки под
                дата-инженера.
              </p>
              <p>
                Свой BI-специалист стоит <strong>€70–90k</strong> в год. Твой проект дешевле его двух
                месяцев.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-head">Признаки квалифицированного лида</div>
            <div className="card-body">
              <p>Есть ERP: SAP Business One, BMD, Sage, Odoo, DATEV.</p>
              <p>Минимум две системы, которые не разговаривают друг с другом.</p>
              <p>Есть контроллер или Kaufmännischer Leiter — но нет IT-отдела.</p>
              <p>Месячная отчётность собирается вручную и приходит с опозданием.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">💰 Что это значит в деньгах</h2>
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Уровень</th>
                  <th>Компаний</th>
                  <th>Чек за 1-й год</th>
                  <th>Ёмкость в год</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Весь DACH, квалифицированные</td>
                  <td>~47 000</td>
                  <td>€20 000</td>
                  <td>~€940 млн</td>
                </tr>
                <tr>
                  <td>Австрия, 50–249 сотрудников</td>
                  <td>6 400</td>
                  <td>€20 000</td>
                  <td>~€128 млн</td>
                </tr>
                <tr>
                  <td>Австрия, квалифицированные</td>
                  <td>~3 000</td>
                  <td>€20 000</td>
                  <td>~€60 млн</td>
                </tr>
                <tr>
                  <td>Вена, 50–249 сотрудников</td>
                  <td>~1 400</td>
                  <td>€20 000</td>
                  <td>~€28 млн</td>
                </tr>
                <tr>
                  <td>
                    <strong style={{ color: "var(--accent)" }}>Вена, квалифицированные</strong>
                  </td>
                  <td>
                    <strong style={{ color: "var(--accent)" }}>~650</strong>
                  </td>
                  <td>
                    <strong style={{ color: "var(--accent)" }}>€20 000</strong>
                  </td>
                  <td>
                    <strong style={{ color: "var(--accent)" }}>~€13 млн</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="callout neutral">
          Средний чек: внедрение Power BI в среднем бизнесе — €8–25k на старте плюс €500–2 500 в
          месяц на поддержку и развитие. Доля Вены оценена как ~22% от австрийских компаний этого
          класса. «Квалифицированные» — с поправкой на воронку выше.
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">🎯 Практический порядок действий</h2>
        <div className="card">
          <div className="card-body">
            <p>
              <strong>1 ·</strong> Взять не всё окно, а одну отрасль. Производство и оптовая торговля
              с 50–249 сотрудниками — больше всего систем и меньше всего IT. В Австрии это примерно
              1 800 компаний, список выгружается из WKO Firmen A–Z и Herold по NACE-кодам.
            </p>
            <p>
              <strong>2 ·</strong> Не продавать Power BI. Продавать конкретный отчёт, которого у них
              нет: маржа по клиенту, загрузка производства, ликвидность на 13 недель вперёд. Power BI
              — то, на чём ты его сделаешь, а не то, что они покупают.
            </p>
            <p>
              <strong>3 ·</strong> Заходить через фиксированный первый шаг — Datencheck за
              €1 500–2 500 на две недели. Это снимает главное возражение среднего бизнеса: «мы не
              понимаем, во что ввязываемся». Из него вырастает внедрение.
            </p>
            <p>
              <strong>4 ·</strong> AI пристёгивать вторым слоем, не первым. Сначала данные в одном
              месте, потом Copilot поверх них. Наоборот не работает: по Gartner 60–80% AI-бюджетов
              уходят на интеграцию данных, а не на модели.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
