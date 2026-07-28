"use client";

import { usePersistedState } from "../../lib/usePersistedState";
import { eur, parseNum } from "../../lib/finmodel-data";
import { Callout, DataTable, Divider, NumInput, PillToggle, SectionLabel, StatBox } from "./ui";

const K = (k: string) => `blinhaus_finmodel_${k}`;

export default function FinmodelDashboard() {
  const [scenario, setScenario] = usePersistedState(K("v2_scenario"), "current");
  const isLean = scenario === "lean";
  const scenarioLabel = scenario === "current" ? "текущая" : "без директора";

  // ── Revenue ──────────────────────────────────────────────────────────
  const [sCafe, setSCafe] = usePersistedState(K("v4_rev_cafe"), "10597");
  const [sSets, setSSets] = usePersistedState(K("v4_rev_sets"), "2116");
  const [sPlatforms, setSPlatforms] = usePersistedState(K("v4_rev_platforms"), "985");
  const [sCatering, setSCatering] = usePersistedState(K("v2_rev_catering"), "0");
  const [sMisc, setSMisc] = usePersistedState(K("v2_rev_misc"), "0");

  // ── Персонал ────────────────────────────────────────────────────────
  const [sPasha, setSPasha] = usePersistedState(K("v2_staff_pasha"), "2686.68");
  const [sSvitlana, setSSvitlana] = usePersistedState(K("v2_staff_svitlana"), "2296.38");
  const [sIryna, setSIryna] = usePersistedState(K("v2_staff_iryna"), "1922.38");
  const [sNatasha, setSNatasha] = usePersistedState(K("v2_staff_natasha"), "2406.67");

  // ── Маркетинг ───────────────────────────────────────────────────────
  const [sMktContent, setSMktContent] = usePersistedState(K("v2_mkt_content"), "1000");
  const [sMktAdsMgmt, setSMktAdsMgmt] = usePersistedState(K("v2_mkt_ads_mgmt"), "500");
  const [sMktAdspend, setSMktAdspend] = usePersistedState(K("v2_mkt_adspend"), "900");
  const [sMktAndreiPct, setSMktAndreiPct] = usePersistedState(K("v2_mkt_andrei_pct"), "220");

  // ── Директор (опционально) ─────────────────────────────────────────
  const [sDirectorSalary, setSDirectorSalary] = usePersistedState(K("v2_director_salary"), "3500");
  const [directorOn, setDirectorOn] = usePersistedState(K("v2_director_on"), "off");

  // ── Курьер на заказ (опционально) ───────────────────────────────────
  const [sDeliveryRevBase, setSDeliveryRevBase] = usePersistedState(K("v3_delivery_rev_base"), "3000");
  const [sAvgCheck, setSAvgCheck] = usePersistedState(K("v3_delivery_avg_check"), "70");
  const [sCourierFee, setSCourierFee] = usePersistedState(K("v3_delivery_courier_fee"), "6.20");
  const [courierOn, setCourierOn] = usePersistedState(K("v3_courier_on"), "off");

  // ── Фиксированные расходы ────────────────────────────────────────────
  const [sRent, setSRent] = usePersistedState(K("v3_fx_rent"), "1500");
  const [sBetriebskosten, setSBetriebskosten] = usePersistedState(K("v3_fx_betriebskosten"), "749");
  const [sLegalSupport, setSLegalSupport] = usePersistedState(K("v3_fx_legal_support"), "261");
  const [sLicensorFridman, setSLicensorFridman] = usePersistedState(K("v5_fx_licensor_fridman"), "1400");
  const [sAccountant, setSAccountant] = usePersistedState(K("v4_fx_accountant"), "723");
  const [sConnection, setSConnection] = usePersistedState(K("v4_fx_connection"), "143");
  const [sTableBooking, setSTableBooking] = usePersistedState(K("v4_fx_table_booking"), "220");
  const [sInsurance, setSInsurance] = usePersistedState(K("v2_fx_insurance"), "250");
  const [sBank, setSBank] = usePersistedState(K("v2_fx_bank"), "80");
  const [sPos, setSPos] = usePersistedState(K("v4_fx_pos"), "112");
  const [sWko, setSWko] = usePersistedState(K("v2_fx_wko"), "80");
  const [sCleaning, setSCleaning] = usePersistedState(K("v2_fx_cleaning"), "150");
  const [sUniform, setSUniform] = usePersistedState(K("v2_fx_uniform"), "50");
  const [sRepairs, setSRepairs] = usePersistedState(K("v2_fx_repairs"), "150");
  const [sGarbage, setSGarbage] = usePersistedState(K("v2_fx_garbage"), "80");
  const [sMiscFixed, setSMiscFixed] = usePersistedState(K("v3_fx_misc"), "63");

  // ── COGS — из канвы «Наценка и цены», 13-15.07.2026 ────────────────
  const [sProductPctCafe, setSProductPctCafe] = usePersistedState(K("v5_var_product_pct_cafe"), "42.5");
  const [sProductPctDeliverySets, setSProductPctDeliverySets] = usePersistedState(K("v6_var_product_pct_delivery_sets"), "66.8");
  const [sProductPctDeliveryPlatforms, setSProductPctDeliveryPlatforms] = usePersistedState(K("v6_var_product_pct_delivery_platforms"), "66.8");
  const [sBevBottledPct, setSBevBottledPct] = usePersistedState(K("v5_var_bev_bottled_pct"), "1.4");
  const [sBevHotPct, setSBevHotPct] = usePersistedState(K("v5_var_bev_hot_pct"), "1.3");
  const [sPlatformComm, setSPlatformComm] = usePersistedState(K("v2_var_platform_comm"), "30");

  // ── Расчёты ──────────────────────────────────────────────────────────
  const cafe = parseNum(sCafe);
  const sets = parseNum(sSets);
  const platforms = parseNum(sPlatforms);
  const catering = parseNum(sCatering);
  const misc = parseNum(sMisc);
  const totalRevenue = cafe + sets + platforms + catering + misc;

  const pasha = parseNum(sPasha);
  const svitlana = parseNum(sSvitlana);
  const iryna = parseNum(sIryna);
  const natashaFull = parseNum(sNatasha);
  const staffCurrentTotal = pasha + svitlana + iryna + natashaFull;
  const staffLeanTotal = svitlana + iryna + natashaFull;
  const totalStaff = scenario === "current" ? staffCurrentTotal : staffLeanTotal;
  const showPasha = !isLean;

  const mktContent = parseNum(sMktContent);
  const mktAdsMgmt = parseNum(sMktAdsMgmt);
  const mktAdspend = parseNum(sMktAdspend);
  const mktAndreiPct = parseNum(sMktAndreiPct);
  const totalMarketing = mktContent + mktAdsMgmt + mktAdspend + mktAndreiPct;

  const rent = parseNum(sRent);
  const betriebskosten = parseNum(sBetriebskosten);
  const legalSupport = parseNum(sLegalSupport);
  const licensorFridman = parseNum(sLicensorFridman);
  const licensor = legalSupport + licensorFridman;
  const accountant = parseNum(sAccountant);
  const connection = parseNum(sConnection);
  const tableBooking = parseNum(sTableBooking);
  const insurance = parseNum(sInsurance);
  const bank = parseNum(sBank);
  const pos = parseNum(sPos);
  const wko = parseNum(sWko);
  const cleaning = parseNum(sCleaning);
  const uniform = parseNum(sUniform);
  const repairs = parseNum(sRepairs);
  const garbage = parseNum(sGarbage);
  const miscFixed = parseNum(sMiscFixed);
  const totalFixed = rent + betriebskosten + licensor
    + accountant + connection + tableBooking + insurance + bank + pos + wko + cleaning + uniform + repairs + garbage + miscFixed;

  const productPctCafe = Math.min(parseNum(sProductPctCafe), 100) / 100;
  const productPctDeliverySets = Math.min(parseNum(sProductPctDeliverySets), 100) / 100;
  const productPctDeliveryPlatforms = Math.min(parseNum(sProductPctDeliveryPlatforms), 100) / 100;
  const bevBottledPct = Math.min(parseNum(sBevBottledPct), 100) / 100;
  const bevHotPct = Math.min(parseNum(sBevHotPct), 100) / 100;
  const commPct = Math.min(parseNum(sPlatformComm), 100) / 100;
  const packaging = 350;

  const productCostCafe = cafe * productPctCafe;
  const productCostDeliverySets = sets * productPctDeliverySets;
  const productCostDeliveryPlatforms = platforms * productPctDeliveryPlatforms;
  const productCostDelivery = productCostDeliverySets + productCostDeliveryPlatforms;
  const productCost = productCostCafe + productCostDelivery;
  const bevBottledCost = cafe * bevBottledPct;
  const bevHotCost = cafe * bevHotPct;
  const beveragesCost = bevBottledCost + bevHotCost;
  const platformFee = platforms * commPct;
  const totalVariable = productCost + beveragesCost + platformFee + packaging;

  const directorCost = directorOn === "on" ? parseNum(sDirectorSalary) : 0;

  const deliveryRevBase = parseNum(sDeliveryRevBase);
  const avgCheck = parseNum(sAvgCheck);
  const courierFee = parseNum(sCourierFee);
  const deliveryCount = avgCheck > 0 ? deliveryRevBase / avgCheck : 0;
  const courierCostFull = deliveryCount * courierFee;
  const courierCost = courierOn === "on" ? courierCostFull : 0;

  const totalCosts = totalStaff + totalFixed + totalMarketing + totalVariable + directorCost + courierCost;
  const grossProfit = totalRevenue - totalVariable;
  const ebitda = totalRevenue - totalCosts;
  const gpMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const ebitdaMargin = totalRevenue > 0 ? (ebitda / totalRevenue) * 100 : 0;

  const varRatio = totalRevenue > 0 ? totalVariable / totalRevenue : productPctCafe;
  const breakEven = varRatio < 1 ? (totalStaff + totalFixed + totalMarketing + directorCost + courierCost) / (1 - varRatio) : Infinity;
  const revenueGap = breakEven - totalRevenue;

  const sharedBase = totalRevenue - (totalFixed + totalMarketing);
  const cogsSharedPart = beveragesCost + platformFee;
  const ebitdaCurrentScenario = sharedBase - staffCurrentTotal - (productCost + cogsSharedPart + packaging);
  const ebitdaLeanScenario = sharedBase - staffLeanTotal - (productCost + cogsSharedPart + packaging);
  const leanDelta = ebitdaLeanScenario - ebitdaCurrentScenario;

  const profitTone = ebitda >= 0 ? "success" : "danger";

  const costStructure = [
    { label: "ФОТ персонал", val: totalStaff },
    { label: "Аренда", val: rent },
    { label: "Себестоимость продукта", val: productCost },
    { label: "Юридическое сопровождение + лицензиат Фридман", val: licensor },
    { label: "Маркетинг", val: totalMarketing },
    { label: "Прочие фикс. (без аренды/юр./лицензиата)", val: totalFixed - rent - licensor },
    { label: "Напитки + комиссия + упаковка", val: beveragesCost + platformFee + packaging },
    ...(directorCost > 0 ? [{ label: "Операционный управляющий / директор", val: directorCost }] : []),
    ...(courierCost > 0 ? [{ label: "Курьер на заказ", val: courierCost }] : []),
  ].sort((a, b) => b.val - a.val);

  return (
    <main className="fm-main">
      <nav className="fm-nav">
        <a href="/reports/blinhaus-plan-sep-feb" className="fm-nav-primary">План сен–фев</a>
        <a href="/reports/blinhaus-finmodel" className="active">Финмодель</a>
        <a href="/reports/blinhaus-horeca-markup">Наценка и цены</a>
        <a href="/blinhaus-finmodel.xlsx" className="fm-nav-xlsx" download>⬇ Скачать Excel</a>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", justifyContent: "space-between" }}>
        <div>
          <h1 className="fm-h1">BlinHaus Vienna — Финмодель</h1>
          <p className="fm-sub">
            Schönbrunner Str. 129, 1050 Wien · выручка — среднее апр-июнь 2026 по факту, фикс. расходы обновлены на встрече/у бухгалтера 13 июля 2026
          </p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <PillToggle active={scenario === "current"} onClick={() => setScenario("current")}>Текущая (4 чел.)</PillToggle>
          <PillToggle active={scenario === "lean"} onClick={() => setScenario("lean")}>Без директора (3 чел.)</PillToggle>
        </div>
      </div>

      <div style={{ height: 20 }} />

      <div className="fm-grid-4">
        <StatBox value={eur(totalRevenue)} label="Выручка / мес" />
        <StatBox value={eur(totalCosts)} label="Затраты / мес" tone="danger" />
        <StatBox value={eur(ebitda)} label="EBITDA / мес" tone={profitTone} />
        <StatBox
          value={isFinite(breakEven) ? eur(breakEven) : "∞"}
          label="Точка безубыточности"
          tone={ebitda >= 0 ? "success" : "warning"}
        />
      </div>

      <div style={{ height: 20 }} />

      <div className="card">
        <div className="card-title">Два сценария штата (при тех же выручке и фикс. расходах, без директорской надбавки)</div>
        <DataTable
          headers={["Показатель", "Текущая (4 чел.)", "Без директора (3 чел.)"]}
          columnAlign={["left", "right", "right"]}
          rows={[
            ["ФОТ персонал", eur(staffCurrentTotal), eur(staffLeanTotal)],
            [
              <b key="l">EBITDA</b>,
              <b key="c" style={{ color: ebitdaCurrentScenario >= 0 ? "var(--accent)" : "var(--red)" }}>{eur(ebitdaCurrentScenario)}</b>,
              <b key="lean" style={{ color: ebitdaLeanScenario >= 0 ? "var(--accent)" : "var(--red)" }}>{eur(ebitdaLeanScenario)}</b>,
            ],
          ]}
          rowTone={[undefined, "info"]}
        />
        <p style={{ marginTop: 10, fontSize: 13, color: leanDelta >= 0 ? "var(--accent)" : "var(--red)" }}>
          Без директора (Паша убран, Наташа остаётся — без SK-лицензии повар всё равно нужен) меняет EBITDA
          на {leanDelta >= 0 ? "+" : "−"}{eur(Math.abs(leanDelta))}/мес vs текущая модель — но без директорской
          функции и доставки. Их стоимость нужно добавить отдельно (карточка «Операционный управляющий /
          директор» или «Курьер на заказ» ниже), прежде чем сравнивать сценарии по-настоящему.
        </p>
      </div>

      <div className="fm-grid-main">
        {/* Left: Revenue */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SectionLabel>Выручка</SectionLabel>
          <DataTable
            headers={["Канал", "€/мес"]}
            columnAlign={["left", "right"]}
            striped
            rows={[
              ["Кафе (касса, on-site)", <NumInput key="i" value={sCafe} onChange={setSCafe} />],
              ["Доставка наборов заморозки", <NumInput key="i" value={sSets} onChange={setSSets} />],
              ["Foodora / Lieferando / Wolt", <NumInput key="i" value={sPlatforms} onChange={setSPlatforms} />],
              ["Кейтеринг / мероприятия", <NumInput key="i" value={sCatering} onChange={setSCatering} />],
              ["Прочее", <NumInput key="i" value={sMisc} onChange={setSMisc} />],
              [<b key="l">Итого выручка</b>, <b key="v">{eur(totalRevenue)}</b>],
            ]}
            rowTone={[undefined, undefined, undefined, undefined, undefined, "success"]}
          />

          <Divider />

          <SectionLabel>Себестоимость (COGS)</SectionLabel>
          <Callout tone="success" title="Числа из раздела «Наценка и цены», 13-15.07.2026">
            Продукт разделён на кафе и 2 канала доставки — так же, как и в выручке (наборы заморозки vs
            Wolt/Foodora/Lieferando) — у них разная реальная наценка (доставка ~50%, кафе ~135% по факту из меню).
            Напитки разделены на 2 категории — себестоимость выведена из реальных продаж ready2order и заданной
            наценки (200% бутилированные / 700% кофе-чай).
          </Callout>
          <DataTable
            headers={["Статья", "% / сумма"]}
            columnAlign={["left", "right"]}
            striped
            rows={[
              ["Продукт — кафе (себестоимость)", <span key="i" className="fm-inline-input-cell"><NumInput value={sProductPctCafe} onChange={setSProductPctCafe} /><span>% = {eur(productCostCafe)}</span></span>],
              ["Продукт — доставка наборов заморозки", <span key="i" className="fm-inline-input-cell"><NumInput value={sProductPctDeliverySets} onChange={setSProductPctDeliverySets} /><span>% = {eur(productCostDeliverySets)}</span></span>],
              ["Продукт — доставка Wolt/Foodora/Lieferando", <span key="i" className="fm-inline-input-cell"><NumInput value={sProductPctDeliveryPlatforms} onChange={setSProductPctDeliveryPlatforms} /><span>% = {eur(productCostDeliveryPlatforms)}</span></span>],
              ["Напитки — бутилированные (% кафе)", <span key="i" className="fm-inline-input-cell"><NumInput value={sBevBottledPct} onChange={setSBevBottledPct} /><span>% = {eur(bevBottledCost)}</span></span>],
              ["Напитки — кофе/чай (% кафе)", <span key="i" className="fm-inline-input-cell"><NumInput value={sBevHotPct} onChange={setSBevHotPct} /><span>% = {eur(bevHotCost)}</span></span>],
              ["Комиссия платформ", <span key="i" className="fm-inline-input-cell"><NumInput value={sPlatformComm} onChange={setSPlatformComm} /><span>% = {eur(platformFee)}</span></span>],
              ["Упаковка", eur(packaging)],
              [<b key="l">Итого переменные</b>, <b key="v">{eur(totalVariable)}</b>],
            ]}
            rowTone={[undefined, undefined, undefined, undefined, undefined, undefined, undefined, "warning"]}
          />

          <Divider />

          {ebitda >= 0 ? (
            <Callout tone="success" title="Прибыль">
              Плюс {eur(ebitda)}/мес · маржа EBITDA {ebitdaMargin.toFixed(1)} %
            </Callout>
          ) : (
            <Callout tone="warning" title="Убыток">
              Дефицит {eur(Math.abs(ebitda))}/мес.
              {isFinite(breakEven) && revenueGap > 0 && (
                <> Нужно нарастить выручку ещё на {eur(revenueGap)} до {eur(breakEven)}/мес.</>
              )}
            </Callout>
          )}
        </div>

        {/* Right: Costs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SectionLabel>Персонал (стоимость работодателя)</SectionLabel>
          <DataTable
            headers={["Сотрудник / роль", "€/мес"]}
            columnAlign={["left", "right"]}
            striped
            rows={[
              [
                <span key="i" style={{ display: "flex", alignItems: "center", gap: 6, opacity: showPasha ? 1 : 0.4, textDecoration: showPasha ? "none" : "line-through" }}>
                  Pavlo Ryuchuk — директор + доставка{!showPasha && <span className="badge red" style={{ textDecoration: "none" }}>убран</span>}
                </span>,
                showPasha ? <NumInput key="v" value={sPasha} onChange={setSPasha} /> : "—",
              ],
              ["Svitlana Baehtova — зальщик/повар", <NumInput key="i" value={sSvitlana} onChange={setSSvitlana} />],
              ["Sovochenko Iryna — зальщик/сменщик", <NumInput key="i" value={sIryna} onChange={setSIryna} />],
              ["Natalia Ryuchuk — повар", <NumInput key="i" value={sNatasha} onChange={setSNatasha} />],
              [<b key="l">Итого ФОТ</b>, <b key="v">{eur(totalStaff)}</b>],
            ]}
            rowTone={[undefined, undefined, undefined, undefined, "danger"]}
          />

          <SectionLabel>Маркетинг (Андрей)</SectionLabel>
          <DataTable
            headers={["Статья", "€/мес"]}
            columnAlign={["left", "right"]}
            striped
            rows={[
              ["Контент (фото/видео/SMM)", <NumInput key="i" value={sMktContent} onChange={setSMktContent} />],
              ["Ведение таргетированной рекламы", <NumInput key="i" value={sMktAdsMgmt} onChange={setSMktAdsMgmt} />],
              ["Рекламный бюджет Meta (30€/день)", <NumInput key="i" value={sMktAdspend} onChange={setSMktAdspend} />],
              ["10% Андрея с оборота доставки", <NumInput key="i" value={sMktAndreiPct} onChange={setSMktAndreiPct} />],
              [<b key="l">Итого маркетинг</b>, <b key="v">{eur(totalMarketing)}</b>],
            ]}
            rowTone={[undefined, undefined, undefined, undefined, "warning"]}
          />

          <SectionLabel>Операционный управляющий / директор (по документам) — опциональная строка</SectionLabel>
          <div className="card">
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
              Рыночный ориентир: KV-минимум для Restaurantleiter/Betriebsleiter в Вене (Lohngruppe с большой
              ответственностью, 1.5.2025, действует и в 2026 — новый тарифный раунд не согласован) — брутто{" "}
              <b>~2 500–3 000 €/мес</b> (14 зарплат/год), полная стоимость работодателя ≈ 3 200–3 800 €/мес.
              Для сравнения: сегодняшняя полная стоимость Паши как директора+курьера — {eur(pasha)}/мес,
              то есть у нижней границы этого коридора.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 12 }}>
              <span style={{ fontSize: 13 }}>Зарплата операционного управляющего / директора (полная стоимость)</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <NumInput value={sDirectorSalary} onChange={setSDirectorSalary} /><span style={{ fontSize: 12, color: "var(--text-3)" }}>€</span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
              <span style={{ fontSize: 13, color: "var(--text-2)" }}>Учитывать в EBITDA / P&L</span>
              <span style={{ display: "flex", gap: 6 }}>
                <PillToggle active={directorOn === "off"} onClick={() => setDirectorOn("off")}>Нет</PillToggle>
                <PillToggle active={directorOn === "on"} onClick={() => setDirectorOn("on")}>Да</PillToggle>
              </span>
            </div>
          </div>

          <SectionLabel>Курьер на заказ — опциональная строка</SectionLabel>
          <div className="card">
            <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
              Альтернатива зарплате Паши: платим курьеру за каждую доставку отдельно.
              Кол-во доставок/мес = база выручки ÷ средний чек. Ориентир по Вене — обычно <b>6,20–6,50 €</b> за доставку.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 13 }}>База выручки для расчёта доставок</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <NumInput value={sDeliveryRevBase} onChange={setSDeliveryRevBase} /><span style={{ fontSize: 12, color: "var(--text-3)" }}>€</span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 13 }}>Средний чек одной доставки</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <NumInput value={sAvgCheck} onChange={setSAvgCheck} /><span style={{ fontSize: 12, color: "var(--text-3)" }}>€</span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "var(--text-2)" }}>→ Кол-во доставок / мес</span>
                <b>{deliveryCount.toFixed(0)}</b>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 13 }}>Стоимость курьера за 1 доставку</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <NumInput value={sCourierFee} onChange={setSCourierFee} /><span style={{ fontSize: 12, color: "var(--text-3)" }}>€</span>
                </span>
              </div>
              <Divider />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "var(--text-2)" }}>→ Итого затрат на курьера</span>
                <b>{eur(courierCostFull)}</b>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "var(--text-2)" }}>Учитывать в EBITDA / P&L</span>
                <span style={{ display: "flex", gap: 6 }}>
                  <PillToggle active={courierOn === "off"} onClick={() => setCourierOn("off")}>Нет</PillToggle>
                  <PillToggle active={courierOn === "on"} onClick={() => setCourierOn("on")}>Да</PillToggle>
                </span>
              </div>
            </div>
          </div>

          <SectionLabel>Фиксированные расходы</SectionLabel>
          <Callout tone="success" title="Реальные цифры со встречи и от бухгалтера 13.07.2026">
            Аренда, коммунальные, бухгалтерия, связь, бронирование столиков, POS-лицензия, юр. сопровождение
            и расходники ниже — фактические суммы (не оценки). Аренда оказалась вдвое ниже ({eur(1500)} вместо{" "}
            {eur(3800)}). Бухгалтерия — новая договорная цена {eur(723)} (было {eur(588)}). Связь (интернет+телефон)
            {" "}{eur(143)} и бронирование столиков {eur(220)} — новые статьи, ранее не учитывались отдельно.
            POS-лицензия — {eur(112)} за 2 кассовых аппарата (было оценено {eur(60)}). Юридическое сопровождение
            и лицензиат Лев Фридман — это два разных платежа: юрсопровождение — {eur(261)}, лицензиат
            (Фридман не работает в кафе, платят только за лицензию) — {eur(1400)}.
          </Callout>
          <DataTable
            headers={["Статья", "€/мес"]}
            columnAlign={["left", "right"]}
            striped
            rows={[
              ["Аренда (Schönbrunner Str. 129)", <NumInput key="i" value={sRent} onChange={setSRent} />],
              ["Коммунальные услуги (Betriebskosten)", <NumInput key="i" value={sBetriebskosten} onChange={setSBetriebskosten} />],
              ["Юридическое сопровождение (фирма)", <NumInput key="i" value={sLegalSupport} onChange={setSLegalSupport} />],
              [
                "Лицензиат — Лев Фридман (не работает в кафе)",
                <NumInput key="v" value={sLicensorFridman} onChange={setSLicensorFridman} />,
              ],
              ["Бухгалтерия", <NumInput key="i" value={sAccountant} onChange={setSAccountant} />],
              ["Связь (интернет + телефон)", <NumInput key="i" value={sConnection} onChange={setSConnection} />],
              ["Служба онлайн-бронирования столиков", <NumInput key="i" value={sTableBooking} onChange={setSTableBooking} />],
              ["Страховка", <NumInput key="i" value={sInsurance} onChange={setSInsurance} />],
              ["Банк / эквайринг", <NumInput key="i" value={sBank} onChange={setSBank} />],
              ["POS / Registrierkassa (2 кассы)", <NumInput key="i" value={sPos} onChange={setSPos} />],
              ["WKO / Kammerumlage", <NumInput key="i" value={sWko} onChange={setSWko} />],
              ["Чистящие средства / гигиена", <NumInput key="i" value={sCleaning} onChange={setSCleaning} />],
              ["Форма / спецодежда", <NumInput key="i" value={sUniform} onChange={setSUniform} />],
              ["Ремонт и техобслуживание", <NumInput key="i" value={sRepairs} onChange={setSRepairs} />],
              ["Вывоз мусора", <NumInput key="i" value={sGarbage} onChange={setSGarbage} />],
              ["Канцтовары / расходники", <NumInput key="i" value={sMiscFixed} onChange={setSMiscFixed} />],
              [<b key="l">Итого фиксированные</b>, <b key="v">{eur(totalFixed)}</b>],
            ]}
            rowTone={new Array(16).fill(undefined).concat(["warning"]) as any}
          />
        </div>
      </div>

      <div style={{ height: 8 }} />
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>
        P&amp;L — Итоговый расчёт ({scenarioLabel} модель{directorOn === "on" ? " + директор" : ""}{courierOn === "on" ? " + курьер" : ""})
      </h2>
      <div style={{ height: 8 }} />
      <DataTable
        headers={["Строка", "€/мес", "% выручки"]}
        columnAlign={["left", "right", "right"]}
        striped
        stickyHeader
        rows={[
          ["Выручка", eur(totalRevenue), "100 %"],
          [`Себестоимость продукта (кафе ${(productPctCafe * 100).toFixed(0)}% + доставка)`, `− ${eur(productCost)}`, `${totalRevenue > 0 ? ((productCost / totalRevenue) * 100).toFixed(1) : "—"} %`],
          [`Напитки + комиссия платформ + упаковка`, `− ${eur(beveragesCost + platformFee + packaging)}`, `${totalRevenue > 0 ? (((beveragesCost + platformFee + packaging) / totalRevenue) * 100).toFixed(1) : "—"} %`],
          [<b key="l">Валовая прибыль</b>, <b key="v">{eur(grossProfit)}</b>, <b key="m">{gpMargin.toFixed(1)} %</b>],
          [`ФОТ персонал (${scenario === "current" ? "4 чел." : "3 чел., без директора"})`, `− ${eur(totalStaff)}`, `${totalRevenue > 0 ? ((totalStaff / totalRevenue) * 100).toFixed(1) : "—"} %`],
          ["Маркетинг", `− ${eur(totalMarketing)}`, `${totalRevenue > 0 ? ((totalMarketing / totalRevenue) * 100).toFixed(1) : "—"} %`],
          ["Фиксированные расходы (16 статей)", `− ${eur(totalFixed)}`, `${totalRevenue > 0 ? ((totalFixed / totalRevenue) * 100).toFixed(1) : "—"} %`],
          ...(directorOn === "on" ? [["Операционный управляющий / директор", `− ${eur(directorCost)}`, `${totalRevenue > 0 ? ((directorCost / totalRevenue) * 100).toFixed(1) : "—"} %`]] : []),
          ...(courierOn === "on" ? [["Курьер на заказ", `− ${eur(courierCost)}`, `${totalRevenue > 0 ? ((courierCost / totalRevenue) * 100).toFixed(1) : "—"} %`]] : []),
          [
            <b key="l">EBITDA</b>,
            <b key="v" style={{ color: ebitda >= 0 ? "var(--accent)" : "var(--red)" }}>{ebitda >= 0 ? "" : "− "}{eur(Math.abs(ebitda))}</b>,
            <b key="m" style={{ color: ebitda >= 0 ? "var(--accent)" : "var(--red)" }}>{ebitdaMargin.toFixed(1)} %</b>,
          ],
        ] as any}
        rowTone={([
          "success",
          undefined, undefined,
          "info",
          undefined, undefined, undefined,
          ...(directorOn === "on" ? [undefined] : []),
          ...(courierOn === "on" ? [undefined] : []),
          ebitda >= 0 ? "success" : "danger",
        ]) as any}
      />

      <div style={{ height: 20 }} />
      <div className="card">
        <div className="card-title">Структура затрат ({scenarioLabel})</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {costStructure.map(({ label, val }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontSize: 13, color: "var(--text-2)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
              <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 13 }}>{eur(val)}</span>
                <span style={{ fontSize: 13, color: "var(--text-3)" }}>{totalCosts > 0 ? `${((val / totalCosts) * 100).toFixed(0)} %` : "—"}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 20 }} />
      <p style={{ fontSize: 12, color: "var(--text-3)", fontStyle: "italic", lineHeight: 1.6 }}>
        Все поля редактируемые — вводите реальные цифры, модель пересчитывается автоматически.
        Стоимость персонала = полная стоимость для работодателя. Себестоимость продукта (кафе / доставка) и
        напитков (бутилированные / кофе-чай) — единые для обоих сценариев: без словацкой (SK) производственной
        лицензии продукт готовят на месте в любом случае, отдельного «дешёвого» варианта пока нет. Курьер на заказ
        (кол-во доставок = база выручки ÷ средний чек × стоимость доставки) — опциональная строка, как и зарплата
        операционного управляющего / директора, включайте отдельным переключателем «Да/Нет». Данные сохраняются
        в этом браузере между визитами.
      </p>

      <p className="footer-note">Закрытый раздел gorbenko.at — не для шаринга.</p>
    </main>
  );
}
