export type FunnelWindow = {
  window_days: 7 | 28;
  date_from: string;
  date_to: string;
  impressions: number;
  clicks: number;
  cost_cents: number;
  google_conversions: number;
  contact_intents: number;
  leads_echt: number;
  orders: number;
  revenue_cents: number;
  cpc_cents: number;
  cpl_cents: number;
  cr1: number;
  cac_cents: number;
  roas: number;
};

export type DailyRow = {
  date: string;
  impressions: number;
  clicks: number;
  cost_cents: number;
  contact_intents: number;
  leads_echt: number;
  orders: number;
};

export type CampaignRow = {
  campaign_id: string | null;
  name: string;
  clicks: number;
  cost_cents: number;
  contact_intents: number;
  leads_echt: number;
  orders: number;
};

export type ZeroTerm = {
  term: string;
  clicks: number;
  cost_cents: number;
};

export type PlatformWeek = {
  week_start: string;
  google_conversions: number;
  our_intents: number;
  our_leads: number;
  our_orders: number;
};

export type ClientReport = {
  client: { id: string; name: string; tz: string };
  /** max daily_stats.date as YYYY-MM-DD */
  standBis: string | null;
  /** max load_runs.finished_at where status = 'ok' (ISO timestamp) */
  lastLoad: string | null;
  windows: FunnelWindow[];
  /** 28 days, aggregated over campaigns, missing days zero-filled */
  daily: DailyRow[];
  /** 28d totals */
  campaigns: CampaignRow[];
  /** 28d: cost_cents > 0 and leads = 0, cost desc, max 15 */
  zeroTerms: ZeroTerm[];
  /** last 4 ISO weeks; the most recent 7 days are not comparable (see the page note) */
  platformVsFact: PlatformWeek[];
};
