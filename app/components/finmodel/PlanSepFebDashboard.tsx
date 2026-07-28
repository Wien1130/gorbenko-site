"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { eur } from "../../lib/finmodel-data";
import { Callout, DataTable, Divider, NumInput, PillToggle, SectionLabel, StatBox } from "./ui";

// ─── Персистентное JSON-состояние (localStorage) ─────────────────────────────

const K = (k: string) => `blinhaus_plan_sepfeb_v5_${k}`;

function useJson<T>(key: string, initial: T): [T, (u: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) setValue(JSON.parse(stored) as T);
    } catch {
      // localStorage недоступен — остаёмся на дефолте
    }
  }, [key]);
  const update = useCallback(
    (u: T | ((p: T) => T)) => {
      setValue((prev) => {
        const next = typeof u === "function" ? (u as (p: T) => T)(prev) : u;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [key],
  );
  return [value, update];
}

// ─── Глобальные константы конструктора ───────────────────────────────────────

const GLOBAL_DEFAULTS: Record<string, number> = {
  pasha: 2686.68,
  svetlana: 2296.38,
  iryna: 1922.38,
  natasha: 2406.67,
  marketingFix: 1500,
  marketingAds: 900,
  packaging: 350,
  courierPerOrder: 6.5,
  avgCheck: 60,
  andreiPct: 10,
  platformCommPct: 30,
  bookingCost: 220,
  managerAccrual: 2500,
};

const GLOBAL_ITEMS: Array<{ id: string; label: string; suffix: string }> = [
  { id: "pasha", label: "Зарплата: Паша (директор + доставка)", suffix: "€" },
  { id: "svetlana", label: "Зарплата: Света (зал)", suffix: "€" },
  { id: "iryna", label: "Зарплата: Ира (зал)", suffix: "€" },
  { id: "natasha", label: "Зарплата: Наташа (повар)", suffix: "€" },
  { id: "marketingFix", label: "Маркетинг — 1 500 фикс", suffix: "€" },
  { id: "marketingAds", label: "Маркетинг — рекламный бюджет Meta", suffix: "€" },
  { id: "packaging", label: "Упаковка / расходники", suffix: "€" },
  { id: "courierPerOrder", label: "Курьер — оплата за 1 доставку", suffix: "€" },
  { id: "avgCheck", label: "Средний чек доставки наборов", suffix: "€" },
  { id: "andreiPct", label: "10% от оборота доставки — маркетинг", suffix: "%" },
  { id: "platformCommPct", label: "Комиссия платформ (Wolt и др.)", suffix: "%" },
  { id: "bookingCost", label: "Бронирование столиков, €/мес", suffix: "€" },
  { id: "managerAccrual", label: "Управляющий — отложенная часть счёта", suffix: "€" },
];

type Globals = Record<string, number>;
const G = (g: Globals, id: string) => g[id] ?? GLOBAL_DEFAULTS[id];

// ─── Мелкие фиксированные расходы ────────────────────────────────────────────

const FIXED_ITEMS: Array<{ id: string; label: string; amount: number }> = [
  { id: "rent", label: "Аренда (Schönbrunner Str. 129)", amount: 1500 },
  { id: "betriebskosten", label: "Коммунальные (Betriebskosten)", amount: 749 },
  { id: "internet", label: "Связь (интернет + телефон)", amount: 143 },
  { id: "legal", label: "Юридическое сопровождение (фирма)", amount: 261 },
  { id: "accountant", label: "Бухгалтерия", amount: 723 },
  { id: "insurance", label: "Страховка (Versicherung)", amount: 250 },
  { id: "bank", label: "Банк / эквайринг", amount: 80 },
  { id: "pos", label: "Кассы / POS / Registrierkassa (2 шт)", amount: 112 },
  { id: "wko", label: "WKO / Kammerumlage (80 €/год ÷ 12)", amount: Math.round((80 / 12) * 100) / 100 },
  { id: "cleaning", label: "Чистящие средства / гигиена", amount: 150 },
  { id: "uniform", label: "Форма / спецодежда", amount: 50 },
  { id: "repairs", label: "Ремонт и техобслуживание", amount: 150 },
  { id: "garbage", label: "Вывоз мусора", amount: 80 },
  { id: "misc", label: "Канцтовары / расходники", amount: 63 },
];
const FIXED_DEFAULTS: Record<string, number> = Object.fromEntries(
  FIXED_ITEMS.map((i) => [i.id, i.amount]),
);
type CustomRow = { id: string; label: string; amount: number };
const sumFixed = (v: Record<string, number>, custom: CustomRow[]) =>
  FIXED_ITEMS.reduce((s, i) => s + (v[i.id] ?? i.amount), 0) +
  custom.reduce((s, c) => s + (c.amount || 0), 0);

// ─── Параметры сценария ──────────────────────────────────────────────────────

type Params = {
  cafe: number;
  delivery: number;
  platforms: number;
  cogsCafePct: number; // себестоимость кухни, % от кухонной части кассы
  cogsDrinksPct: number;
  drinksSharePct: number;
  cogsDeliveryPct: number;
  fridman: number;
  bookingOn: boolean;
  bookingFraction: number; // 1 = полный месяц; 1/3 = только декабрь в среднем дек–фев
  pashaOn: boolean;
  svetlanaOn: boolean;
  irynaOn: boolean;
  natashaOn: boolean;
  managerCash: number;
  externalCourier: boolean;
};

const BASELINE: Params = {
  cafe: 10597,
  delivery: 2116,
  platforms: 985,
  cogsCafePct: 49.8,
  cogsDrinksPct: 18.5,
  drinksSharePct: 14.6,
  cogsDeliveryPct: 66.8,
  fridman: 1400,
  bookingOn: true,
  bookingFraction: 1,
  pashaOn: true,
  svetlanaOn: true,
  irynaOn: true,
  natashaOn: true,
  managerCash: 0,
  externalCourier: false,
};

// Бронь: контракт до конца года (сен–дек), с января можно отключить.
const SCENARIO_BASE = {
  platforms: 0,
  cogsCafePct: 33,
  cogsDrinksPct: 18.5,
  drinksSharePct: 14.6,
  cogsDeliveryPct: 40,
  bookingOn: true,
  bookingFraction: 1,
  pashaOn: false,
  svetlanaOn: true,
  irynaOn: true,
  natashaOn: false,
  managerCash: 2500,
  externalCourier: true,
};

const NOV_PESS: Params = {
  ...SCENARIO_BASE,
  cafe: 13500,
  delivery: 5500,
  fridman: 1400,
  bookingOn: true,
  bookingFraction: 1,
};
const NOV_OPT: Params = {
  ...SCENARIO_BASE,
  cafe: 18600,
  delivery: 7000,
  fridman: 1400,
  bookingOn: true,
  bookingFraction: 1,
};
const FEB_PESS: Params = {
  ...SCENARIO_BASE,
  cafe: 15500,
  delivery: 8000,
  fridman: 1400,
  bookingOn: true,
  bookingFraction: 1 / 3,
};
const FEB_OPT: Params = {
  ...SCENARIO_BASE,
  cafe: 23100,
  delivery: 12000,
  fridman: 1400,
  bookingOn: true,
  bookingFraction: 1 / 3,
};

// ─── Расчёт ──────────────────────────────────────────────────────────────────

function calc(p: Params, otherFixed: number, g: Globals) {
  const share = (p.drinksSharePct ?? 0) / 100;
  const cogsDrinks = (p.cogsDrinksPct ?? p.cogsCafePct) / 100;
  const kitchenRev = p.cafe * (1 - share);
  const drinksRev = p.cafe * share;
  const contribKitchen = kitchenRev * (1 - p.cogsCafePct / 100);
  const contribDrinks = drinksRev * (1 - cogsDrinks);
  const blendedCogs = (1 - share) * (p.cogsCafePct / 100) + share * cogsDrinks;
  const cafeMargin = 1 - blendedCogs;

  const courierCost = p.externalCourier
    ? (p.delivery / G(g, "avgCheck")) * G(g, "courierPerOrder")
    : 0;
  const contribDelivery =
    p.delivery * (1 - p.cogsDeliveryPct / 100 - G(g, "andreiPct") / 100) - courierCost;

  const contribPlatforms = p.platforms * (1 - blendedCogs - G(g, "platformCommPct") / 100);

  const revenue = p.cafe + p.delivery + p.platforms;
  const contribution = contribKitchen + contribDrinks + contribDelivery + contribPlatforms;

  const staff =
    ((p.svetlanaOn ?? true) ? G(g, "svetlana") : 0) +
    ((p.irynaOn ?? true) ? G(g, "iryna") : 0) +
    (p.pashaOn ? G(g, "pasha") : 0) +
    (p.natashaOn ? G(g, "natasha") : 0);
  const bookingCost = p.bookingOn
    ? G(g, "bookingCost") * (p.bookingFraction ?? 1)
    : 0;
  const fixed = otherFixed + p.fridman + bookingCost;
  const marketing = G(g, "marketingFix") + G(g, "marketingAds");
  const costs = staff + p.managerCash + fixed + marketing + G(g, "packaging");

  const cash = contribution - costs;
  const gapCafeRevenue = cash < 0 ? -cash / cafeMargin : 0;

  return {
    revenue,
    contribKitchen,
    contribDrinks,
    contribDelivery,
    contribPlatforms,
    courierCost,
    contribution,
    blendedCogs,
    staff,
    fixed,
    marketing,
    costs,
    cash,
    cafeMargin,
    gapCafeRevenue,
  };
}

const eurSigned = (n: number) => (n > 0 ? `+${eur(n)}` : eur(n));
const pct1 = (n: number) => `${Math.round(n * 10) / 10}%`;

// ─── Мелкие контролы ─────────────────────────────────────────────────────────

function FieldRow({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ flex: 1, minWidth: 0, fontSize: 13, color: "var(--text-2)" }}>{label}</span>
      <NumInput value={String(value)} onChange={(v) => onChange(Number(v) || 0)} />
      {suffix ? <span style={{ width: 14, fontSize: 13, color: "var(--text-3)" }}>{suffix}</span> : null}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ flex: 1, minWidth: 0, fontSize: 13, color: "var(--text-2)" }}>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 18, height: 18, accentColor: "var(--accent)" }}
      />
    </div>
  );
}

function GhostButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="fm-pill">
      {children}
    </button>
  );
}

// ─── Сценарий ────────────────────────────────────────────────────────────────

function ScenarioCard({
  title,
  subtitle,
  stateKey,
  months,
  pessDefaults,
  optDefaults,
  fixedVals,
  customFixed,
  globals,
}: {
  title: string;
  subtitle: string;
  stateKey: string;
  months: number;
  pessDefaults: Params;
  optDefaults: Params;
  fixedVals: Record<string, number>;
  customFixed: CustomRow[];
  globals: Globals;
}) {
  const [variant, setVariant] = useJson<"pess" | "opt">(K(`${stateKey}-variant`), "opt");
  const [pPess, setPPess] = useJson<Params>(K(`${stateKey}-pess`), pessDefaults);
  const [pOpt, setPOpt] = useJson<Params>(K(`${stateKey}-opt`), optDefaults);

  const isOpt = variant === "opt";
  const p = isOpt ? pOpt : pPess;
  const setP = isOpt ? setPOpt : setPPess;
  const defaults = isOpt ? optDefaults : pessDefaults;
  const r = calc(p, sumFixed(fixedVals, customFixed), globals);
  const accrual = G(globals, "managerAccrual");
  const set = (patch: Partial<Params>) => setP((prev) => ({ ...prev, ...patch }));

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
        <div className="card-title" style={{ marginBottom: 0 }}>{title}</div>
        <span style={{ fontSize: 12, color: "var(--text-3)" }}>{subtitle}</span>
      </div>
      <div style={{ height: 14 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <PillToggle active={isOpt} tone="ok" onClick={() => setVariant("opt")}>Оптимизм</PillToggle>
          <PillToggle active={!isOpt} tone="warn" onClick={() => setVariant("pess")}>Пессимизм</PillToggle>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <StatBox value={eur(r.revenue)} label="Выручка / мес" />
          <StatBox
            value={eurSigned(r.cash)}
            label="Денежный результат / мес"
            tone={r.cash >= 0 ? "success" : "danger"}
          />
        </div>

        {r.cash < 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-3)", margin: 0 }}>
            До нуля не хватает {eur(-r.cash)} вклада ≈ ещё {eur(r.gapCafeRevenue)} кассы кафе
            (при марже кассы {Math.round(r.cafeMargin * 100)}%).
          </p>
        ) : null}

        <Divider />

        <SectionLabel>Выручка по каналам</SectionLabel>
        <FieldRow label="Кафе (касса: кухня + напитки)" value={p.cafe} onChange={(v) => set({ cafe: v })} suffix="€" />
        <FieldRow label="Доставка наборов" value={p.delivery} onChange={(v) => set({ delivery: v })} suffix="€" />
        <FieldRow label="Wolt / Foodora / Lieferando" value={p.platforms} onChange={(v) => set({ platforms: v })} suffix="€" />

        <SectionLabel>Маржа</SectionLabel>
        <FieldRow label="Себестоимость кухни (договорённость: 30–33%)" value={p.cogsCafePct} onChange={(v) => set({ cogsCafePct: v })} suffix="%" />
        <FieldRow label="Себестоимость напитков (наценка 200% / 700%)" value={p.cogsDrinksPct ?? 18.5} onChange={(v) => set({ cogsDrinksPct: v })} suffix="%" />
        <FieldRow label="Доля напитков в кассе кафе" value={p.drinksSharePct ?? 14.6} onChange={(v) => set({ drinksSharePct: v })} suffix="%" />
        <FieldRow label="Себестоимость наборов на доставку (договорённость: до 40%)" value={p.cogsDeliveryPct} onChange={(v) => set({ cogsDeliveryPct: v })} suffix="%" />
        <p style={{ fontSize: 12, color: "var(--text-3)", margin: 0 }}>
          Блендед себестоимость кассы кафе: {pct1(r.blendedCogs * 100)} (кухня {pct1(p.cogsCafePct)} ×{" "}
          {pct1(100 - (p.drinksSharePct ?? 14.6))} кассы + напитки {pct1(p.cogsDrinksPct ?? 18.5)} ×{" "}
          {pct1(p.drinksSharePct ?? 14.6)}).
        </p>

        <SectionLabel>Штат и расходы</SectionLabel>
        <ToggleRow label={`Паша — директор + доставка (${eur(G(globals, "pasha"))})`} checked={p.pashaOn} onChange={(v) => set({ pashaOn: v })} />
        <ToggleRow label={`Света — зал (${eur(G(globals, "svetlana"))})`} checked={p.svetlanaOn ?? true} onChange={(v) => set({ svetlanaOn: v })} />
        <ToggleRow label={`Ира — зал (${eur(G(globals, "iryna"))})`} checked={p.irynaOn ?? true} onChange={(v) => set({ irynaOn: v })} />
        <ToggleRow label={`Наташа — повар (${eur(G(globals, "natasha"))})`} checked={p.natashaOn} onChange={(v) => set({ natashaOn: v })} />
        <ToggleRow label={`Курьер на заказ (${G(globals, "courierPerOrder")} € / доставку)`} checked={p.externalCourier} onChange={(v) => set({ externalCourier: v })} />
        <ToggleRow
          label={`Бронирование столиков (${eur(G(globals, "bookingCost") * (p.bookingFraction ?? 1))}${
            (p.bookingFraction ?? 1) < 1 ? " в среднем" : ""
          })`}
          checked={p.bookingOn}
          onChange={(v) => set({ bookingOn: v })}
        />
        <p style={{ fontSize: 12, color: "var(--text-3)", margin: 0 }}>
          {(p.bookingFraction ?? 1) < 1
            ? `Контракт до конца года: в среднем дек–фев учтена ⅓ (${eur(G(globals, "bookingCost"))} только в декабре; янв–фев без брони).`
            : `Контракт до конца года: сен–дек нельзя отключить; с января можно не считать.`}
        </p>
        <FieldRow label="Лицензиат (сейчас Фридман, 1 400)" value={p.fridman} onChange={(v) => set({ fridman: v })} suffix="€" />
        <FieldRow label="Управляющий — оплачивается по счёту" value={p.managerCash} onChange={(v) => set({ managerCash: v })} suffix="€" />
        <p style={{ fontSize: 12, color: "var(--text-3)", margin: 0 }}>
          + ещё {eur(accrual)} / мес накапливается как опцион (за {months} мес — {eur(accrual * months)});
          в результат не входит.
        </p>

        <Divider />

        <DataTable
          headers={["Строка", "€ / мес"]}
          columnAlign={["left", "right"]}
          rows={[
            ["Вклад кухни кафе", eur(r.contribKitchen)],
            ["Вклад напитков", eur(r.contribDrinks)],
            [
              `Вклад доставки (после себест., ${G(globals, "andreiPct")}% и курьера ${eur(r.courierCost)})`,
              eur(r.contribDelivery),
            ],
            ["Вклад платформ (себест. кассы + комиссия)", eur(r.contribPlatforms)],
            ["Штат", `−${eur(r.staff)}`],
            ["Управляющий (оплачиваемая часть счёта)", `−${eur(p.managerCash)}`],
            ["Фикс. расходы (аренда, коммуналка, бух., лицензиат…)", `−${eur(r.fixed)}`],
            [
              `Маркетинг (${eur(G(globals, "marketingFix"))} фикс + ${eur(G(globals, "marketingAds"))} бюджет)`,
              `−${eur(r.marketing)}`,
            ],
            ["Упаковка / расходники", `−${eur(G(globals, "packaging"))}`],
          ]}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ flex: 1, fontSize: 12, color: "var(--text-3)" }}>
            Полный P&L (с отложенной частью счёта −{eur(accrual)}): <b>{eurSigned(r.cash - accrual)}</b>
          </span>
          <GhostButton onClick={() => setP(defaults)}>Сбросить к плану</GhostButton>
        </div>
      </div>
    </div>
  );
}

// ─── Зачем это производству ──────────────────────────────────────────────────

const KG_PRICE = 10;
const VIENNA_COGS = 10000;
const POINT_REV = 30000;
const POINT_COGS = Math.round(POINT_REV * 0.33);
const FRANCHISE_N = 5;
const SHARED_CENTRAL = [
  { label: "Бухгалтерия", amount: 723 },
  { label: "Юридическое сопровождение", amount: 261 },
  { label: "Маркетинг (фикс + реклама)", amount: 1500 + 900 },
  { label: "Управляющий (оплачиваемая часть)", amount: 2500 },
  { label: "Лицензиат", amount: 1400 },
  { label: "Страховка (можно централизовать)", amount: 250 },
];
const SHARED_TOTAL = SHARED_CENTRAL.reduce((s, x) => s + x.amount, 0);
const tonsOf = (eurCogs: number) => Math.round((eurCogs / KG_PRICE / 1000) * 10) / 10;

function WhyProductionBlock() {
  const viennaT = tonsOf(VIENNA_COGS);
  const twoPointsT = tonsOf(POINT_COGS * 2);
  const franchiseT = tonsOf(POINT_COGS * FRANCHISE_N);
  const totalT = Math.round((viennaT + twoPointsT + franchiseT) * 10) / 10;

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
        <div className="card-title" style={{ marginBottom: 0 }}>
          Пять дверей после отработанного кафе
        </div>
        <span className="fm-pill">для взвешивания решения</span>
      </div>
      <p style={{ fontSize: 13, color: "var(--text-2)", margin: "0 0 16px", lineHeight: 1.45 }}>
        Не оффер и не обещание — карта того, зачем имеет смысл довести одну точку до рабочей
        схемы: производство получает тоннаж, дальше открываются следующие шаги. Цифры —
        ориентиры порядка величины (себестоимость продукта ≈ 33%, ≈ 10 €/кг).
      </p>

      <div className="fm-doors-grid">
        <div className="fm-door">
          <span className="fm-pill active">1 · Тоннаж в Вену</span>
          <div className="fm-door-title">
            ≈ {eur(VIENNA_COGS)} / мес с производства → ≈ {viennaT} т
          </div>
          <div className="fm-door-body">
            При достижении рабочих сценариев кафе + доставка. Прямая загрузка Братиславы —
            даже без новых точек.
          </div>
        </div>
        <div className="fm-door">
          <span className="fm-pill active">2 · Две свои точки</span>
          <div className="fm-door-title">
            2 × ≈ 30–40 тыс. входа · оборот ≈ {eur(POINT_REV)} / точка
          </div>
          <div className="fm-door-body">
            Дверь открыта: сначала одна точка на 2 человека в зале + управляющий. Новые — в
            местах с проходимостью. Ещё ≈ {twoPointsT} т/мес на производство.
          </div>
        </div>
        <div className="fm-door">
          <span className="fm-pill active">3 · Автоматы сейчас</span>
          <div className="fm-door-title">Заморозка в ТЦ и по городу</div>
          <div className="fm-door-body">
            Пока есть живое кафе в Вене — проще юридически и по смыслу: «своё производство,
            своя точка». Автоматы усиливают бренд и сбыт без полного штата кафе.
          </div>
        </div>
        <div className="fm-door">
          <span className="fm-pill active">4 · Франшиза потом</span>
          <div className="fm-door-title">Когда схема и учёт уже рабочие</div>
          <div className="fm-door-body">
            Открыта дверь к продаже франшизы: совместный доход + снова тоннаж. Ориентир: +
            {FRANCHISE_N} франшиз ≈ +{franchiseT} т/мес к производству.
          </div>
        </div>
        <div className="fm-door">
          <span className="fm-pill active">5 · B2B для кафе</span>
          <div className="fm-door-title">
            Канал «как Берёзка» — поставка в чужие кафе
          </div>
          <div className="fm-door-body">
            Рабочая точка в Вене — витрина и доказательство качества: можно развивать B2B в
            HoReCa (заморозка / полуфабрикаты для других кафе), опираясь на уже существующее
            кафе, а не на «пустой» прайс с производства.
          </div>
        </div>
      </div>

      <div style={{ height: 18 }} />
      <div className="card-title">Лестница тоннажа (ориентир)</div>
      <DataTable
        headers={["Источник", "Себест. продукта ≈", "≈ тонн / мес"]}
        columnAlign={["left", "right", "right"]}
        rows={[
          ["Вена — рабочий уровень", eur(VIENNA_COGS), `${viennaT} т`],
          [`+ 2 свои точки (по ${eur(POINT_REV)} оборота)`, eur(POINT_COGS * 2), `${twoPointsT} т`],
          [`+ ${FRANCHISE_N} франшиз (тот же порядок)`, eur(POINT_COGS * FRANCHISE_N), `${franchiseT} т`],
          [
            "Если всё сложилось",
            eur(VIENNA_COGS + POINT_COGS * (2 + FRANCHISE_N)),
            `${totalT} т`,
          ],
        ]}
        rowTone={[undefined, undefined, undefined, "success"]}
      />

      <div style={{ height: 18 }} />
      <div className="card-title">Центральные расходы — на 3 точки</div>
      <p style={{ fontSize: 13, color: "var(--text-3)", margin: "0 0 10px" }}>
        Пока одна точка — всё лежит на ней. Три точки (Вена + две новые): один управляющий на
        всех, в зале по 2 человека на точку; ниже — что делится на три.
      </p>
      <DataTable
        headers={["Статья", "€ / мес", "На 1 точку"]}
        columnAlign={["left", "right", "right"]}
        rows={[
          ...SHARED_CENTRAL.map((x) => [x.label, eur(x.amount), eur(x.amount / 3)]),
          ["Итого централь", eur(SHARED_TOTAL), eur(SHARED_TOTAL / 3)],
        ]}
        rowTone={[undefined, undefined, undefined, undefined, undefined, undefined, "info"]}
      />
      <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 10 }}>
        Эскиз двух новых точек: оборот 2 × {eur(POINT_REV)} = {eur(POINT_REV * 2)}; продукт на
        производство ≈ {eur(POINT_COGS * 2)} (≈ {twoPointsT} т); зал 2 × 2 чел.; управляющий один
        на три адреса; доля централи ≈ {eur((SHARED_TOTAL / 3) * 2)}. Точный P&L — отдельный
        прогон, когда появятся адреса.
      </p>
    </div>
  );
}

// ─── Дашборд ─────────────────────────────────────────────────────────────────

export default function PlanSepFebDashboard() {
  const [fixedVals, setFixedVals] = useJson<Record<string, number>>(K("fixed-costs"), FIXED_DEFAULTS);
  const [customFixed, setCustomFixed] = useJson<CustomRow[]>(K("fixed-custom"), []);
  const [globals, setGlobals] = useJson<Globals>(K("globals"), GLOBAL_DEFAULTS);
  const [novPess] = useJson<Params>(K("scenario-nov-pess"), NOV_PESS);
  const [novOpt] = useJson<Params>(K("scenario-nov-opt"), NOV_OPT);
  const [febPess] = useJson<Params>(K("scenario-feb-pess"), FEB_PESS);
  const [febOpt] = useJson<Params>(K("scenario-feb-opt"), FEB_OPT);

  const otherFixed = sumFixed(fixedVals, customFixed);
  const base = calc(BASELINE, otherFixed, globals);
  const summary = [
    { label: "Сейчас (факт)", r: base },
    { label: "Ноя — песс.", r: calc(novPess, otherFixed, globals) },
    { label: "Ноя — опт.", r: calc(novOpt, otherFixed, globals) },
    { label: "Дек–фев — песс.", r: calc(febPess, otherFixed, globals) },
    { label: "Дек–фев — опт.", r: calc(febOpt, otherFixed, globals) },
  ];

  // Инвестиции по месяцам: сен–окт — линейный переход от точки А к ноябрю, дек–фев — уровень сценария 2
  const path = (nov: number, feb: number) => {
    const step = (nov - base.cash) / 3;
    // дек–фев: среднее = уровень сценария 2, с положительной динамикой
    const amp = Math.max(800, Math.abs(feb) * 0.2);
    return [
      base.cash + step,
      base.cash + 2 * step,
      nov,
      feb - amp,
      feb,
      feb + amp,
    ];
  };
  const pessPath = path(summary[1].r.cash, summary[3].r.cash);
  const optPath = path(summary[2].r.cash, summary[4].r.cash);
  const monthNames = ["Сентябрь", "Октябрь", "Ноябрь", "Декабрь", "Январь", "Февраль"];
  const pathSummary = (cash: number[]) => {
    const invest = cash.filter((x) => x < 0).reduce((s, x) => s - x, 0);
    const profit = cash.filter((x) => x > 0).reduce((s, x) => s + x, 0);
    const net = cash.reduce((s, x) => s + x, 0);
    const lossNames = monthNames.filter((_, i) => cash[i] < 0);
    const profitNames = monthNames.filter((_, i) => cash[i] > 0);
    let cum = 0;
    let recoveredAt: string | null = null;
    for (let i = 0; i < cash.length; i++) {
      cum += cash[i];
      if (cum >= 0 && recoveredAt === null && invest > 0) recoveredAt = monthNames[i];
    }
    return { invest, profit, net, lossNames, profitNames, recoveredAt };
  };
  const pessS = pathSummary(pessPath);
  const optS = pathSummary(optPath);

  const fixedColumns = [FIXED_ITEMS.slice(0, 7), FIXED_ITEMS.slice(7)];
  const globalColumns = [GLOBAL_ITEMS.slice(0, 7), GLOBAL_ITEMS.slice(7)];

  return (
    <main className="fm-main">
      <nav className="fm-nav">
        <a href="/reports/blinhaus-plan-sep-feb" className="fm-nav-primary active">План сен–фев</a>
        <a href="/reports/blinhaus-finmodel">Финмодель</a>
        <a href="/reports/blinhaus-horeca-markup">Наценка и цены</a>
        <a href="/blinhaus-plan-sep-feb.xlsx" className="fm-nav-xlsx" download>
          ⬇ Скачать Excel
        </a>
      </nav>

      <div>
        <h1 className="fm-h1">Кафе BlinHaus Вена: сценарии ноябрь (3 мес) и декабрь–февраль (6 мес)</h1>
        <p className="fm-sub">
          Все поля редактируемые, расчёт на лету (сохраняется в этом браузере). База: факт апр–июнь 2026,
          зарплаты и фикс. расходы со встречи с бухгалтером 13.07.2026.
        </p>
      </div>

      <div style={{ height: 16 }} />

      <Callout tone="info" title="База сценариев — договорённость по трансфертным ценам">
        Сценарии считаются по целевым себестоимостям, согласованным с Анатолием: кухня 30–33% от продажных
        цен (объём и цена производства — его задача), заморозка на доставку — максимум 40%. Напитки считаются
        отдельно: наценка 200% на бутилированные и 700% на кофе/чай ≈ себестоимость 18,5% при доле напитков
        14,6% кассы. Цены меню поднимаются на 20–30% (пельмени 6 → 9 €) — это уже заложено в цифры выручки.
        «Сейчас» (точка А) считается по старым фактическим ценам HoReCa (кухня ~50%, блендед касса 45%,
        наборы 67%) — поэтому разрыв между «сейчас» и сценариями частично создаётся самой сменой правил
        закупки.
      </Callout>

      <div style={{ height: 16 }} />

      <div className="fm-summary-row">
        <div className="fm-summary-group">
          <div className="fm-summary-group-head">
            <span className="fm-summary-group-title">Сейчас</span>
            <span className="fm-summary-group-sub">Точка А · факт</span>
          </div>
          <StatBox
            value={eurSigned(summary[0].r.cash)}
            label="Денежный результат / мес"
            tone={summary[0].r.cash >= 0 ? "success" : summary[0].r.cash > -5000 ? "warning" : "danger"}
          />
        </div>

        <div className="fm-summary-group">
          <div className="fm-summary-group-head">
            <span className="fm-summary-group-title">Первые 3 месяца</span>
            <span className="fm-summary-group-sub">сен–окт–ноя</span>
          </div>
          <div className="fm-summary-pair">
            <div className="fm-summary-variant">
              <span className="fm-summary-label">Оптимизм</span>
              <StatBox value={eurSigned(summary[2].r.cash)} label="Результат / мес" />
            </div>
            <div className="fm-summary-variant">
              <span className="fm-summary-label">Пессимизм</span>
              <StatBox value={eurSigned(summary[1].r.cash)} label="Результат / мес" />
            </div>
          </div>
        </div>

        <div className="fm-summary-group">
          <div className="fm-summary-group-head">
            <span className="fm-summary-group-title">Вторые 3 месяца</span>
            <span className="fm-summary-group-sub">дек–янв–фев</span>
          </div>
          <div className="fm-summary-pair">
            <div className="fm-summary-variant">
              <span className="fm-summary-label">Оптимизм</span>
              <StatBox value={eurSigned(summary[4].r.cash)} label="Результат / мес" />
            </div>
            <div className="fm-summary-variant">
              <span className="fm-summary-label">Пессимизм</span>
              <StatBox value={eurSigned(summary[3].r.cash)} label="Результат / мес" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 20 }} />

      <div className="card">
        <div className="card-title">Деньги на горизонте сен–фев: сначала вложения, потом возврат</div>
        <p style={{ fontSize: 13, color: "var(--text-3)", margin: "0 0 14px" }}>
          Сначала вложить {eur(optS.invest)} ({optS.lossNames.join(", ").toLowerCase()}), затем
          плюсовые месяцы — уже прибыль, не инвестиция.
          {optS.recoveredAt ? ` Накопом отбивается к ${optS.recoveredAt.toLowerCase()}.` : ""}{" "}
          Чистый итог оптимизма за сен–фев: {eurSigned(optS.net)}.
        </p>
        <div className="fm-invest-grid">
          <div className="fm-invest-col fm-invest-col-opt">
            <span className="fm-pill active-ok">Оптимизм</span>
            <StatBox value={`−${eur(optS.invest)}`} label={`Вложить (${optS.lossNames.join("–") || "—"})`} />
            <StatBox value={eurSigned(optS.profit)} label="Потом прибыль" tone="success" />
            <StatBox value={eurSigned(optS.net)} label="Чистый итог сен–фев" tone="success" />
          </div>
          <div className="fm-invest-col fm-invest-col-pess">
            <span className="fm-pill active-warn">Пессимизм</span>
            <StatBox value={`−${eur(pessS.invest)}`} label={`Вложить (${pessS.lossNames.join("–") || "—"})`} />
            <StatBox
              value={pessS.profit > 0 ? eurSigned(pessS.profit) : "нет плюсовых мес."}
              label="Потом прибыль"
              tone="warning"
            />
            <StatBox value={eurSigned(pessS.net)} label="Чистый итог сен–фев" tone="warning" />
          </div>
        </div>
      </div>

      <div style={{ height: 20 }} />

      <WhyProductionBlock />

      <div style={{ height: 20 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 20, alignItems: "start" }}>
        <ScenarioCard
          title="Первые 3 месяца — сен–окт–ноя"
          subtitle="уровень к концу ноября"
          stateKey="scenario-nov"
          months={3}
          pessDefaults={NOV_PESS}
          optDefaults={NOV_OPT}
          fixedVals={fixedVals}
          customFixed={customFixed}
          globals={globals}
        />
        <ScenarioCard
          title="Вторые 3 месяца — дек–янв–фев"
          subtitle="среднее за период"
          stateKey="scenario-feb"
          months={6}
          pessDefaults={FEB_PESS}
          optDefaults={FEB_OPT}
          fixedVals={fixedVals}
          customFixed={customFixed}
          globals={globals}
        />
      </div>

      <div style={{ height: 20 }} />

      <details className="card">
        <summary className="fm-disclosure">
          <span className="fm-disclosure-label">
            Конструктор — зарплаты, маркетинг, курьер, комиссии
          </span>
          <span className="fm-disclosure-hint" />
        </summary>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {globalColumns.map((col, ci) => (
            <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.map((i) => (
                <FieldRow
                  key={i.id}
                  label={i.label}
                  value={G(globals, i.id)}
                  onChange={(v) => setGlobals((prev) => ({ ...prev, [i.id]: v }))}
                  suffix={i.suffix}
                />
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <span style={{ flex: 1, fontSize: 12, color: "var(--text-3)" }}>
            Зарплаты — полная стоимость работодателя (факт). Кто из людей включён — переключается внутри
            каждого сценария; здесь только суммы.
          </span>
          <GhostButton onClick={() => setGlobals(GLOBAL_DEFAULTS)}>Сбросить</GhostButton>
        </div>
      </details>

      <details className="card">
        <summary className="fm-disclosure">
          <span className="fm-disclosure-label">
            Мелкие фиксированные расходы · итого {eur(otherFixed)} / мес
          </span>
          <span className="fm-disclosure-hint" />
        </summary>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {fixedColumns.map((col, ci) => (
            <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.map((i) => (
                <FieldRow
                  key={i.id}
                  label={i.label}
                  value={fixedVals[i.id] ?? i.amount}
                  onChange={(v) => setFixedVals((prev) => ({ ...prev, [i.id]: v }))}
                  suffix="€"
                />
              ))}
            </div>
          ))}
        </div>
        {customFixed.length > 0 ? <Divider /> : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {customFixed.map((row) => (
            <div key={row.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="text"
                value={row.label}
                onChange={(e) =>
                  setCustomFixed((prev) =>
                    prev.map((r) => (r.id === row.id ? { ...r, label: e.target.value } : r)),
                  )
                }
                className="fm-num-input"
                style={{ flex: 1, minWidth: 0, textAlign: "left" }}
              />
              <NumInput
                value={String(row.amount)}
                onChange={(v) =>
                  setCustomFixed((prev) =>
                    prev.map((r) => (r.id === row.id ? { ...r, amount: Number(v) || 0 } : r)),
                  )
                }
              />
              <span style={{ width: 14, fontSize: 13, color: "var(--text-3)" }}>€</span>
              <GhostButton onClick={() => setCustomFixed((prev) => prev.filter((r) => r.id !== row.id))}>
                Убрать
              </GhostButton>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <GhostButton
            onClick={() =>
              setCustomFixed((prev) => [...prev, { id: `c${Date.now()}`, label: "Новая статья", amount: 0 }])
            }
          >
            + Добавить статью расходов
          </GhostButton>
          <span style={{ flex: 1 }} />
          <GhostButton
            onClick={() => {
              setFixedVals(FIXED_DEFAULTS);
              setCustomFixed([]);
            }}
          >
            Сбросить
          </GhostButton>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 10 }}>
          Суммы — со встречи с бухгалтером 13.07.2026 (страховка, банк, WKO, гигиена, форма, ремонт, мусор —
          оценки). Лицензиат и бронь столиков настраиваются внутри каждого сценария.
        </p>
      </details>

      <details className="card">
        <summary className="fm-disclosure">
          <span className="fm-disclosure-label">
            Точка А — факт · {eurSigned(base.cash)} / мес
          </span>
          <span className="fm-disclosure-hint" />
        </summary>
        <DataTable
          headers={["Строка", "€ / мес"]}
          columnAlign={["left", "right"]}
          rows={[
            ["Выручка: кафе 10 597 + доставка 2 116 + платформы 985", eur(base.revenue)],
            [
              "Вклад после себестоимости (кухня 49,8%, напитки 18,5% → блендед 45,2%; наборы 66,8%)",
              eur(base.contribution),
            ],
            ["Штат: Паша + Света + Ира + Наташа", `−${eur(base.staff)}`],
            ["Фикс. расходы, вкл. Фридмана 1 400 и бронь 220", `−${eur(base.fixed)}`],
            ["Маркетинг + упаковка", `−${eur(base.marketing + G(globals, "packaging"))}`],
            ["Денежный результат", eurSigned(base.cash)],
          ]}
          rowTone={[undefined, undefined, undefined, undefined, undefined, "danger"]}
        />
      </details>

      <details className="card" open>
        <summary className="fm-disclosure">
          <span className="fm-disclosure-label">
            По месяцам · опт. итог {eurSigned(optS.net)} · вложить {eur(optS.invest)}
          </span>
          <span className="fm-disclosure-hint" />
        </summary>
        <DataTable
          headers={["Месяц", "Пессимизм", "Оптимизм", "Что это (по опт.)"]}
          columnAlign={["left", "right", "right", "left"]}
          rows={[
            ...monthNames.map((m, i) => [
              m,
              eurSigned(pessPath[i]),
              eurSigned(optPath[i]),
              optPath[i] < 0 ? "инвестиция (минус)" : optPath[i] > 0 ? "прибыль (плюс)" : "ноль",
            ]),
            [
              "Сумма минусов = сколько вложить",
              `−${eur(pessS.invest)}`,
              `−${eur(optS.invest)}`,
              optS.lossNames.length ? `только ${optS.lossNames.join(", ").toLowerCase()}` : "—",
            ],
            [
              "Сумма плюсов = прибыль после",
              pessS.profit > 0 ? eurSigned(pessS.profit) : "—",
              <span key="opt-profit" className="fm-happy-num">{eurSigned(optS.profit)}</span>,
              optS.profitNames.length ? `${optS.profitNames[0]}–февраль` : "—",
            ],
            [
              "Чистый итог за сен–фев",
              eurSigned(pessS.net),
              <span key="opt-net" className="fm-happy-num">{eurSigned(optS.net)}</span>,
              optS.net >= 0 ? "вложения уже отбиты" : "ещё не отбиты",
            ],
          ]}
          rowTone={[
            ...monthNames.map((_, i) =>
              optPath[i] < 0 ? "danger" : optPath[i] > 0 ? "success" : undefined,
            ),
            "danger",
            "success",
            "success",
          ]}
        />
        <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 10 }}>
          Минусовые месяцы — инвестиция (закрывать деньгами); плюсовые — уже прибыль, не
          инвестиция. Сен–окт: переход от точки А к ноябрю; дек–фев: среднее = сценарий 2, с ростом
          месяц к месяцу. Опцион управляющего сюда не входит.
        </p>
      </details>

      <p style={{ fontSize: 12, color: "var(--text-3)" }}>
        Управляющий работает по счетам от своего ИП: из 5 000 € счёта фирма оплачивает 2 500 €, остальные
        2 500 € — отсрочка платежа, копится в счёт выкупа доли. «Денежный результат» — без этой отложенной
        части; «полный P&L» внутри сценария — с ней.
      </p>

      <p className="footer-note">Закрытый раздел gorbenko.at — не для шаринга.</p>
    </main>
  );
}
