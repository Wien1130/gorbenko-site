"use client";

import { usePersistedState } from "../../lib/usePersistedState";
import {
  DRINKS_BOTTLED, DRINKS_HOT, PRODUCTS,
  eur, markup, parseNum, pct, portionCost,
} from "../../lib/finmodel-data";
import { Callout, DataTable, Divider, NumInput, SectionLabel, StatBox, Tag } from "./ui";

const K = (k: string) => `blinhaus_horeca_markup_${k}`;

export default function HorecaMarkupDashboard() {
  const [cafeBonusStr, setCafeBonusStr] = usePersistedState(K("cafe_bonus_pp"), "30");
  const cafeBonus = parseNum(cafeBonusStr);

  const [bottledPctStr, setBottledPctStr] = usePersistedState(K("drinks_bottled_pct"), "200");
  const [hotDrinksPctStr, setHotDrinksPctStr] = usePersistedState(K("drinks_hot_pct"), "700");
  const bottledPct = parseNum(bottledPctStr);
  const hotDrinksPct = parseNum(hotDrinksPctStr);

  const hotQty = DRINKS_HOT.reduce((s, d) => s + d.qty, 0);
  const hotSum = DRINKS_HOT.reduce((s, d) => s + d.sum, 0);
  const hotAvgPrice = hotQty > 0 ? hotSum / hotQty : 0;
  const hotImpliedCost = hotDrinksPct > 0 ? hotAvgPrice / (1 + hotDrinksPct / 100) : 0;

  const bottledQty = DRINKS_BOTTLED.reduce((s, d) => s + d.qty, 0);
  const bottledSum = DRINKS_BOTTLED.reduce((s, d) => s + d.sum, 0);
  const bottledAvgPrice = bottledQty > 0 ? bottledSum / bottledQty : 0;
  const bottledImpliedCost = bottledPct > 0 ? bottledAvgPrice / (1 + bottledPct / 100) : 0;

  const rawMarkups = PRODUCTS.map((p) => markup(p.optRaw, p.retailRaw)).filter((m): m is { eur: number; pct: number } => m !== null);
  const readyMarkups = PRODUCTS.map((p) => markup(p.optReady, p.retailReady)).filter((m): m is { eur: number; pct: number } => m !== null);
  const avgRawPct = rawMarkups.length ? rawMarkups.reduce((s, m) => s + m.pct, 0) / rawMarkups.length : 0;
  const avgReadyPct = readyMarkups.length ? readyMarkups.reduce((s, m) => s + m.pct, 0) / readyMarkups.length : 0;

  const realCafeMarkups: number[] = [];
  PRODUCTS.forEach((p) => {
    const mM = markup(p.cafeCostM ?? null, p.cafeMenuM ?? null);
    const mL = markup(p.cafeCostL ?? null, p.cafeMenuL ?? null);
    if (mM) realCafeMarkups.push(mM.pct);
    if (mL) realCafeMarkups.push(mL.pct);
  });
  const avgRealCafePct = realCafeMarkups.length
    ? realCafeMarkups.reduce((s, v) => s + v, 0) / realCafeMarkups.length
    : 0;

  const cafeRows: any[][] = [];
  PRODUCTS.forEach((p) => {
    const mM = markup(p.cafeCostM ?? null, p.cafeMenuM ?? null);
    const mL = markup(p.cafeCostL ?? null, p.cafeMenuL ?? null);
    if (mM || mL) {
      if (mM) {
        cafeRows.push([
          p.num, p.ru, p.cafeMenuL ? "M / 2 шт" : "порция",
          eur(p.cafeCostM, 2), eur(p.cafeMenuM, 2),
          <b key="p" style={{ color: "var(--accent)" }}>{pct(mM.pct)}</b>,
          <Tag key="t" tone="success">факт</Tag>,
        ]);
      }
      if (mL) {
        cafeRows.push([
          p.num, <span key="n" style={{ color: "var(--text-3)" }}>{p.ru}{p.cafeNote ? ` (${p.cafeNote})` : ""}</span>, "L / 3 шт",
          eur(p.cafeCostL, 2), eur(p.cafeMenuL, 2),
          <b key="p" style={{ color: "var(--accent)" }}>{pct(mL.pct)}</b>,
          <Tag key="t" tone="success">факт</Tag>,
        ]);
      }
      return;
    }
    const cost = portionCost(p);
    const mReady = markup(p.optReady, p.retailReady);
    const mRaw = markup(p.optRaw, p.retailRaw);
    const basePct = mReady ? mReady.pct : mRaw ? mRaw.pct : null;
    const cafePct = basePct !== null ? basePct + cafeBonus : null;
    const cafePrice = cost !== null && cafePct !== null ? cost * (1 + cafePct / 100) : null;
    if (cost === null) return;
    cafeRows.push([
      p.num, p.ru, "порция",
      eur(cost, 2), cafePrice !== null ? eur(cafePrice, 2) : "—",
      cafePct !== null ? <span key="p" style={{ color: "var(--amber)" }}>{pct(cafePct)}</span> : <span key="p" style={{ color: "var(--text-3)" }}>—</span>,
      <Tag key="t" tone="warning">гипотеза</Tag>,
    ]);
  });

  return (
    <main className="fm-main">
      <nav className="fm-nav">
        <a href="/reports/blinhaus-plan-sep-feb" className="fm-nav-primary">План сен–фев</a>
        <a href="/reports/blinhaus-finmodel">Финмодель</a>
        <a href="/reports/blinhaus-horeca-markup" className="active">Наценка и цены</a>
        <a href="/blinhaus-horeca-markup.xlsx" className="fm-nav-xlsx" download>⬇ Скачать Excel</a>
      </nav>

      <div>
        <h1 className="fm-h1">BlinHaus Vienna — наценка и цены (прайс HoReCa)</h1>
        <p className="fm-sub">
          Источники: прайс Prais Viena HoReCa (Novo Trade GmbH, TM BlinHaus, 46 позиций) + реальное меню кафе
          (фото 13.07.2026) + реальные продажи напитков ready2order · опт = закупочная цена, розница = цена на
          доставку наборов заморозки, меню кафе = факт цены в зале
        </p>
      </div>

      <div style={{ height: 20 }} />

      <div className="fm-grid-4">
        <StatBox value={`${PRODUCTS.length}`} label="Позиций в прайсе" />
        <StatBox value={pct(avgRawPct)} label="Средняя наценка — сырая заморозка" />
        <StatBox value={pct(avgReadyPct)} label="Средняя наценка — готовая продукция" />
        <StatBox value={pct(avgRealCafePct)} label="Наценка кафе по еде (факт, из меню)" tone="success" />
      </div>

      <div style={{ height: 20 }} />

      <Callout tone="success" title={`Наценка кафе по еде посчитана из реального меню — ${pct(avgRealCafePct)}`}>
        Сопоставил {realCafeMarkups.length} позиций себестоимости из прайса HoReCa с реальными ценами из
        меню кафе (фото 13.07.2026: пельмени, зразы, бендерики, блинчики, сырники, орешки, перепёлка) —
        средняя наценка по еде получилась {pct(avgRealCafePct)}. Разброс большой (от ~67% на перепёлку до ~250%
        на лосось со шпинатом — премиальные позиции держат наценку выше), таблица «Наценка кафе — по факту»
        ниже показывает всё построчно. Для позиций без цены в меню (вареники, чебуреки, супы и т.п.)
        оставлена гипотеза — наценка доставки + редактируемый бонус.
      </Callout>

      <div style={{ height: 24 }} />
      <SectionLabel>Наценка на доставку наборов заморозки (опт → розница)</SectionLabel>
      <div style={{ height: 12 }} />
      <DataTable
        headers={["№", "Продукт", "Опт замор. €/кг", "Розн. замор. €/кг", "Наценка", "Опт готовая €/кг", "Розн. готовая €/кг", "Наценка"]}
        columnAlign={["left", "left", "right", "right", "right", "right", "right", "right"]}
        striped
        stickyHeader
        rows={PRODUCTS.map((p) => {
          const mRaw = markup(p.optRaw, p.retailRaw);
          const mReady = markup(p.optReady, p.retailReady);
          return [
            p.num,
            p.ru,
            eur(p.optRaw, 2),
            eur(p.retailRaw, 2),
            mRaw ? `${eur(mRaw.eur, 2)} · ${pct(mRaw.pct)}` : <span style={{ color: "var(--text-3)" }}>—</span>,
            eur(p.optReady, 2),
            eur(p.retailReady, 2),
            mReady ? `${eur(mReady.eur, 2)} · ${pct(mReady.pct)}` : <span style={{ color: "var(--text-3)" }}>—</span>,
          ];
        })}
      />

      <Divider />

      <SectionLabel>Наценка кафе по еде — факт из меню + гипотеза для остальных позиций</SectionLabel>
      <div style={{ height: 12 }} />
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, flex: 1, minWidth: 260 }}>
            Где в меню кафе есть реальная цена — наценка посчитана напрямую (Цена меню − Себестоимость) ÷
            Себестоимость, помечено зелёным «факт». Для остальных позиций (вареники, чебуреки, супы, десерты —
            их нет в меню на фото) — гипотеза: наценка доставки по товару + бонус ниже, помечено оранжевым.
          </p>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <NumInput value={cafeBonusStr} onChange={setCafeBonusStr} width={70} />
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>п.п.</span>
          </span>
        </div>
      </div>
      <div style={{ height: 12 }} />
      <DataTable
        headers={["№", "Продукт", "Размер", "Себестоимость", "Цена кафе", "Наценка", "Источник"]}
        columnAlign={["left", "left", "left", "right", "right", "right", "left"]}
        striped
        stickyHeader
        rows={cafeRows}
      />

      <Divider />

      <SectionLabel>Напитки — разделены на 2 категории, себестоимость выведена автоматически</SectionLabel>
      <div style={{ height: 12 }} />
      <Callout tone="success" title="Себестоимость посчитана в обратную сторону">
        В прайсе HoReCa себестоимости напитков нет, но есть реальные продажи (ready2order, апр-июнь 2026) — из
        них берём фактическую среднюю цену продажи за порцию. Зная цену и желаемую наценку %, считаем
        подразумеваемую себестоимость: Себестоимость = Реальная цена ÷ (1 + Наценка / 100).
      </Callout>

      <div style={{ height: 16 }} />
      <div className="fm-grid-2">
        <div className="card">
          <div className="card-title">Штучные / бутилированные (вода, соки, лимонады, пиво)</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={{ fontSize: 13 }}>Наценка</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <NumInput value={bottledPctStr} onChange={setBottledPctStr} width={70} />
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>%</span>
            </span>
          </div>
          <div style={{ height: 12 }} />
          <div style={{ display: "flex", gap: 14 }}>
            <StatBox value={eur(bottledAvgPrice, 2)} label="Реальная средняя цена/порция" />
            <StatBox value={eur(bottledImpliedCost, 2)} label="Подразумеваемая себестоимость" tone="warning" />
          </div>
          <p style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 12, lineHeight: 1.5 }}>
            {bottledQty} порций продано за апр-июнь 2026 на {eur(bottledSum, 2)} · средняя цена {eur(bottledAvgPrice, 2)}
            {" "}за штуку → при наценке {bottledPct}% себестоимость ≈ {eur(bottledImpliedCost, 2)}/шт.
          </p>
        </div>
        <div className="card">
          <div className="card-title">Кофе / чай (готовится в кафе)</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={{ fontSize: 13 }}>Наценка</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <NumInput value={hotDrinksPctStr} onChange={setHotDrinksPctStr} width={70} />
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>%</span>
            </span>
          </div>
          <div style={{ height: 12 }} />
          <div style={{ display: "flex", gap: 14 }}>
            <StatBox value={eur(hotAvgPrice, 2)} label="Реальная средняя цена/порция" />
            <StatBox value={eur(hotImpliedCost, 2)} label="Подразумеваемая себестоимость" tone="warning" />
          </div>
          <p style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 12, lineHeight: 1.5 }}>
            {hotQty} порций продано за апр-июнь 2026 на {eur(hotSum, 2)} · средняя цена {eur(hotAvgPrice, 2)} за
            порцию → при наценке {hotDrinksPct}% себестоимость ≈ {eur(hotImpliedCost, 2)}/порция.
          </p>
        </div>
      </div>

      <div style={{ height: 16 }} />
      <div className="fm-grid-2">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <b style={{ fontSize: 13 }}>По напиткам — штучные / бутилированные</b>
          <DataTable
            headers={["Напиток", "Порций", "Реальная цена/шт", "Себест. (расч.)"]}
            columnAlign={["left", "right", "right", "right"]}
            striped
            rows={DRINKS_BOTTLED
              .slice()
              .sort((a, b) => b.sum - a.sum)
              .map((d) => {
                const price = d.qty > 0 ? d.sum / d.qty : 0;
                const cost = bottledPct > 0 ? price / (1 + bottledPct / 100) : 0;
                return [d.name, d.qty, eur(price, 2), eur(cost, 2)];
              })}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <b style={{ fontSize: 13 }}>По напиткам — кофе / чай</b>
          <DataTable
            headers={["Напиток", "Порций", "Реальная цена/порция", "Себест. (расч.)"]}
            columnAlign={["left", "right", "right", "right"]}
            striped
            rows={DRINKS_HOT
              .slice()
              .sort((a, b) => b.sum - a.sum)
              .map((d) => {
                const price = d.qty > 0 ? d.sum / d.qty : 0;
                const cost = hotDrinksPct > 0 ? price / (1 + hotDrinksPct / 100) : 0;
                return [d.name, d.qty, eur(price, 2), eur(cost, 2)];
              })}
          />
        </div>
      </div>

      <Divider />
      <p style={{ fontSize: 12, color: "var(--text-3)", fontStyle: "italic", lineHeight: 1.6 }}>
        Опт = наша закупочная цена (почём получаем). Розница = цена продажи на доставку наборов заморозки.
        Наценка % = (Розница − Опт) / Опт × 100. Все процентные поля редактируемые — значения сохраняются
        в этом браузере между визитами.
      </p>

      <p className="footer-note">Закрытый раздел gorbenko.at — не для шаринга.</p>
    </main>
  );
}
