import type { CampaignRow, ClientReport, DailyRow, FunnelWindow, PlatformWeek } from "./types";

const TZ = "Europe/Vienna";

const TERMS: Array<[string, number, number]> = [
  ["damastmesser kaufen", 14, 1860],
  ["messer schleifen wien", 11, 1540],
  ["küchenmesser handgeschmiedet", 9, 1320],
  ["jagdmesser damast", 8, 1180],
  ["messer schärfen lassen", 7, 980],
  ["kochmesser profi", 6, 860],
  ["damast küchenmesser", 6, 740],
  ["messerschmied wien", 5, 690],
  ["handgeschmiedetes messer", 4, 540],
  ["outdoor messer kaufen", 4, 420],
];

const LEAD_DAYS = new Set([3, 8, 14, 18, 22, 26]);
const ORDER_CENTS: Record<number, number> = { 12: 38000, 24: 52000 };

/** Stable 0..1 from the day index. Same index always yields the same value. */
function unit(i: number, salt: number): number {
  let s = (Math.imul(i + 1, 0x9e3779b1) ^ Math.imul(salt, 0x85ebca6b)) >>> 0;
  s = Math.imul(s ^ (s >>> 16), 0x7feb352d);
  s = Math.imul(s ^ (s >>> 15), 0x846ca68b);
  s = (s ^ (s >>> 16)) >>> 0;
  return s / 4294967296;
}

function between(i: number, salt: number, min: number, max: number): number {
  return min + Math.floor(unit(i, salt) * (max - min + 1));
}

function viennaToday(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function addDays(iso: string, delta: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return dt.toISOString().slice(0, 10);
}

function isoWeekStart(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  const dow = dt.getUTCDay();
  const back = dow === 0 ? 6 : dow - 1;
  dt.setUTCDate(dt.getUTCDate() - back);
  return dt.toISOString().slice(0, 10);
}

function roundTo(n: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

type BuiltDay = DailyRow & {
  revenue_cents: number;
  google_conversions: number;
  bucket: 0 | 1 | 2;
};

function buildDays(yesterday: string): BuiltDay[] {
  const days: BuiltDay[] = [];
  for (let i = 0; i < 28; i++) {
    const clicks = between(i, 2, 25, 40);
    const leads = LEAD_DAYS.has(i) ? 1 : 0;
    let intents = between(i, 3, 0, 3);
    const revenue = ORDER_CENTS[i] ?? 0;
    const orders = revenue > 0 ? 1 : 0;
    if ((leads || orders) && intents < 1) intents = 1;
    days.push({
      date: addDays(yesterday, i - 27),
      impressions: clicks * between(i, 4, 22, 38),
      clicks,
      cost_cents: between(i, 1, 2200, 3000),
      contact_intents: intents,
      leads_echt: leads,
      orders,
      revenue_cents: revenue,
      google_conversions: leads > 0 ? 2 : intents > 0 ? 1 : 0,
      bucket: (i % 3) as 0 | 1 | 2,
    });
  }
  return days;
}

function sum(days: BuiltDay[], key: keyof BuiltDay): number {
  return days.reduce((acc, day) => acc + Number(day[key]), 0);
}

function windowOf(days: BuiltDay[], window_days: 7 | 28): FunnelWindow {
  const slice = days.slice(days.length - window_days);
  const clicks = sum(slice, "clicks");
  const cost = sum(slice, "cost_cents");
  const leads = sum(slice, "leads_echt");
  const orders = sum(slice, "orders");
  const revenue = sum(slice, "revenue_cents");
  return {
    window_days,
    date_from: slice[0]?.date ?? "",
    date_to: slice[slice.length - 1]?.date ?? "",
    impressions: sum(slice, "impressions"),
    clicks,
    cost_cents: cost,
    google_conversions: sum(slice, "google_conversions"),
    contact_intents: sum(slice, "contact_intents"),
    leads_echt: leads,
    orders,
    revenue_cents: revenue,
    cpc_cents: clicks >= 1 ? Math.round(cost / clicks) : 0,
    cpl_cents: leads >= 1 ? Math.round(cost / leads) : 0,
    cr1: clicks >= 1 ? roundTo(leads / clicks, 4) : 0,
    cac_cents: orders >= 1 ? Math.round(cost / orders) : 0,
    roas: cost >= 1 ? roundTo(revenue / cost, 2) : 0,
  };
}

function campaignsOf(days: BuiltDay[]): CampaignRow[] {
  const rows: CampaignRow[] = [
    { campaign_id: "gads:1001", name: "Suche AT", clicks: 0, cost_cents: 0, contact_intents: 0, leads_echt: 0, orders: 0 },
    { campaign_id: "gads:1002", name: "Suche DE", clicks: 0, cost_cents: 0, contact_intents: 0, leads_echt: 0, orders: 0 },
    { campaign_id: "gads:1003", name: "Gastro Wien", clicks: 0, cost_cents: 0, contact_intents: 0, leads_echt: 0, orders: 0 },
  ];
  for (const day of days) {
    const clickParts = portion(day.clicks);
    const costParts = portion(day.cost_cents);
    for (let k = 0; k < 3; k++) {
      rows[k].clicks += clickParts[k];
      rows[k].cost_cents += costParts[k];
    }
    rows[day.bucket].contact_intents += day.contact_intents;
    rows[day.bucket].leads_echt += day.leads_echt;
    rows[day.bucket].orders += day.orders;
  }
  return rows.sort((a, b) => b.cost_cents - a.cost_cents);
}

/** 50% / 30% / 20%, remainder on the first campaign so the parts sum to total. */
function portion(total: number): [number, number, number] {
  const a = Math.floor(total * 0.5);
  const b = Math.floor(total * 0.3);
  const c = Math.floor(total * 0.2);
  return [a + (total - a - b - c), b, c];
}

function weeksOf(days: BuiltDay[]): PlatformWeek[] {
  const byWeek = new Map<string, PlatformWeek>();
  for (const day of days) {
    const week_start = isoWeekStart(day.date);
    const row = byWeek.get(week_start) ?? {
      week_start,
      google_conversions: 0,
      our_intents: 0,
      our_leads: 0,
      our_orders: 0,
    };
    row.google_conversions += day.google_conversions;
    row.our_intents += day.contact_intents;
    row.our_leads += day.leads_echt;
    row.our_orders += day.orders;
    byWeek.set(week_start, row);
  }
  return [...byWeek.values()]
    .sort((a, b) => a.week_start.localeCompare(b.week_start))
    .slice(-4)
    .map((row) => ({
      ...row,
      google_conversions: Math.max(row.google_conversions, row.our_leads + 3),
    }));
}

export function demoReport(now = new Date()): ClientReport {
  const yesterday = addDays(viennaToday(now), -1);
  const days = buildDays(yesterday);
  const daily: DailyRow[] = days.map((day) => ({
    date: day.date,
    impressions: day.impressions,
    clicks: day.clicks,
    cost_cents: day.cost_cents,
    contact_intents: day.contact_intents,
    leads_echt: day.leads_echt,
    orders: day.orders,
  }));

  return {
    client: { id: "demo", name: "Demo Werkstatt", tz: TZ },
    standBis: yesterday,
    lastLoad: `${yesterday}T16:40:00.000Z`,
    windows: [windowOf(days, 7), windowOf(days, 28)],
    daily,
    campaigns: campaignsOf(days),
    zeroTerms: TERMS.map(([term, clicks, cost_cents]) => ({ term, clicks, cost_cents })),
    platformVsFact: weeksOf(days),
  };
}
