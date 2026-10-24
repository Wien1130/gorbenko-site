import { unstable_cache } from "next/cache";
import { getAnalyticsSql } from "./db";
import type { CampaignRow, ClientReport, DailyRow, FunnelWindow, PlatformWeek, ZeroTerm } from "./types";

function num(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "bigint") return Number(v);
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function asDate(v: unknown): string | null {
  if (v == null) return null;
  if (v instanceof Date) {
    return Number.isNaN(v.getTime()) ? null : v.toISOString().slice(0, 10);
  }
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  return null;
}

function asIso(v: unknown): string | null {
  if (v == null) return null;
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v.toISOString();
  if (typeof v === "string" && v) {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  return null;
}

function asText(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s : null;
}

function mapWindow(row: Record<string, unknown>): FunnelWindow | null {
  const window_days = num(row.window_days);
  if (window_days !== 7 && window_days !== 28) return null;
  const date_from = asDate(row.date_from);
  const date_to = asDate(row.date_to);
  if (!date_from || !date_to) return null;
  return {
    window_days,
    date_from,
    date_to,
    impressions: num(row.impressions),
    clicks: num(row.clicks),
    cost_cents: num(row.cost_cents),
    google_conversions: num(row.google_conversions),
    contact_intents: num(row.contact_intents),
    leads_echt: num(row.leads_echt),
    orders: num(row.orders),
    revenue_cents: num(row.revenue_cents),
    cpc_cents: num(row.cpc_cents),
    cpl_cents: num(row.cpl_cents),
    cr1: num(row.cr1),
    cac_cents: num(row.cac_cents),
    roas: num(row.roas),
  };
}

async function fetchClientReport(clientId: string): Promise<ClientReport | null> {
  const sql = getAnalyticsSql();
  if (!sql) return null;

  const [clientRows, windowRows, dailyRows, campaignRows, termRows, weekRows, standRows, loadRows] =
    await Promise.all([
      sql`select client_id, name, tz from clients where client_id = ${clientId} limit 1`,
      sql`
        select window_days,
               to_char(date_from, 'YYYY-MM-DD') as date_from,
               to_char(date_to, 'YYYY-MM-DD') as date_to,
               impressions, clicks, cost_cents, google_conversions,
               contact_intents, leads_echt, orders, revenue_cents,
               cpc_cents, cpl_cents, cr1, cac_cents, roas
        from v_funnel_window
        where client_id = ${clientId}
        order by window_days
      `,
      sql`
        with bounds as (
          select (now() at time zone c.tz)::date - 1 as date_to,
                 (now() at time zone c.tz)::date - 28 as date_from
          from clients c
          where c.client_id = ${clientId}
        ),
        days as (
          select generate_series(b.date_from, b.date_to, interval '1 day')::date as date
          from bounds b
        )
        select to_char(d.date, 'YYYY-MM-DD') as date,
               coalesce(sum(f.impressions), 0) as impressions,
               coalesce(sum(f.clicks), 0) as clicks,
               coalesce(sum(f.cost_cents), 0) as cost_cents,
               coalesce(sum(f.contact_intents), 0) as contact_intents,
               coalesce(sum(f.leads_echt), 0) as leads_echt,
               coalesce(sum(f.orders), 0) as orders
        from days d
        left join v_funnel f
          on f.client_id = ${clientId}
         and f.date = d.date
        group by d.date
        order by d.date
      `,
      sql`
        select f.campaign_id,
               coalesce(max(f.name), 'Ohne Kampagne') as name,
               coalesce(sum(f.clicks), 0) as clicks,
               coalesce(sum(f.cost_cents), 0) as cost_cents,
               coalesce(sum(f.contact_intents), 0) as contact_intents,
               coalesce(sum(f.leads_echt), 0) as leads_echt,
               coalesce(sum(f.orders), 0) as orders
        from v_funnel f
        join clients c on c.client_id = f.client_id
        where f.client_id = ${clientId}
          and f.date between (now() at time zone c.tz)::date - 28
                          and (now() at time zone c.tz)::date - 1
        group by f.campaign_id
        order by sum(f.cost_cents) desc, coalesce(max(f.name), '')
      `,
      sql`
        select term,
               coalesce(sum(clicks), 0) as clicks,
               coalesce(sum(cost_cents), 0) as cost_cents
        from v_search_terms_28d
        where client_id = ${clientId}
        group by term
        having coalesce(sum(cost_cents), 0) > 0
           and coalesce(sum(leads), 0) = 0
        order by sum(cost_cents) desc
        limit 15
      `,
      sql`
        with b as (
          select (now() at time zone tz)::date - 1 as yday
          from clients
          where client_id = ${clientId}
        ),
        weeks as (
          select generate_series(
                   (date_trunc('week', yday::timestamp))::date - 21,
                   (date_trunc('week', yday::timestamp))::date,
                   interval '7 days'
                 )::date as week_start
          from b
        )
        select to_char(w.week_start, 'YYYY-MM-DD') as week_start,
               coalesce(sum(f.google_conversions), 0) as google_conversions,
               coalesce(sum(f.our_intents), 0) as our_intents,
               coalesce(sum(f.our_leads), 0) as our_leads,
               coalesce(sum(f.our_orders), 0) as our_orders
        from weeks w
        left join v_platform_vs_fact f
          on f.client_id = ${clientId}
         and f.date >= w.week_start
         and f.date < w.week_start + 7
         and f.date <= (select yday from b)
        group by w.week_start
        order by w.week_start
      `,
      sql`
        select to_char(max(date), 'YYYY-MM-DD') as stand_bis
        from daily_stats
        where client_id = ${clientId}
      `,
      sql`
        select max(finished_at) as last_load
        from load_runs
        where client_id = ${clientId}
          and status = 'ok'
      `,
    ]);

  const client = clientRows[0];
  if (!client) return null;

  const windows = windowRows
    .map((row) => mapWindow(row as Record<string, unknown>))
    .filter((row): row is FunnelWindow => row !== null)
    .sort((a, b) => a.window_days - b.window_days);

  const daily: DailyRow[] = [];
  for (const row of dailyRows) {
    const date = asDate(row.date);
    if (!date) continue;
    daily.push({
      date,
      impressions: num(row.impressions),
      clicks: num(row.clicks),
      cost_cents: num(row.cost_cents),
      contact_intents: num(row.contact_intents),
      leads_echt: num(row.leads_echt),
      orders: num(row.orders),
    });
  }

  const campaigns: CampaignRow[] = campaignRows.map((row) => ({
    campaign_id: asText(row.campaign_id),
    name: asText(row.name) ?? "Ohne Kampagne",
    clicks: num(row.clicks),
    cost_cents: num(row.cost_cents),
    contact_intents: num(row.contact_intents),
    leads_echt: num(row.leads_echt),
    orders: num(row.orders),
  }));

  const zeroTerms: ZeroTerm[] = [];
  for (const row of termRows) {
    const term = asText(row.term);
    if (!term) continue;
    zeroTerms.push({ term, clicks: num(row.clicks), cost_cents: num(row.cost_cents) });
  }

  const platformVsFact: PlatformWeek[] = [];
  for (const row of weekRows) {
    const week_start = asDate(row.week_start);
    if (!week_start) continue;
    platformVsFact.push({
      week_start,
      google_conversions: num(row.google_conversions),
      our_intents: num(row.our_intents),
      our_leads: num(row.our_leads),
      our_orders: num(row.our_orders),
    });
  }

  return {
    client: {
      id: asText(client.client_id) ?? clientId,
      name: asText(client.name) ?? clientId,
      tz: asText(client.tz) ?? "Europe/Vienna",
    },
    standBis: asDate(standRows[0]?.stand_bis),
    lastLoad: asIso(loadRows[0]?.last_load),
    windows,
    daily,
    campaigns,
    zeroTerms,
    platformVsFact,
  };
}

export async function loadClientReport(clientId: string): Promise<ClientReport | null> {
  if (!process.env.ANALYTICS_DATABASE_URL) return null;
  try {
    return await unstable_cache(fetchClientReport, ["analytics-os-report", clientId], { revalidate: 900 })(clientId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[analytics-os] loadClientReport failed:", message);
    return null;
  }
}
