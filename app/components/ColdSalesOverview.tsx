import { CAMPAIGN_GOAL, CAMPAIGN_MAX_DAYS, type ColdSalesStats } from "../lib/cold-leads-stats";
import { StageFunnelChart, OutcomeDonutChart, TrendChart } from "./ColdSalesCharts";

export default function ColdSalesOverview({
  stats,
  planMatchPct,
}: {
  stats: ColdSalesStats;
  planMatchPct?: number | null;
}) {
  const pct = Math.min((stats.total / CAMPAIGN_GOAL) * 100, 100);

  return (
    <>
      <div className="stat-grid">
        <div className="stat-box">
          <div className="stat-label">Касаний</div>
          <div className="stat-val">{stats.total}/{CAMPAIGN_GOAL}</div>
          <div className="stat-note">
            день {stats.daysElapsed}/{CAMPAIGN_MAX_DAYS}
            {stats.followups ? ` · +${stats.followups} follow-up` : ""}
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Темп нужен</div>
          <div className="stat-val">{stats.pace}</div>
          <div className="stat-note">касаний/день</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Конверсия дальше</div>
          <div className="stat-val">{stats.toMeetingRate}%</div>
          <div className="stat-note">в встречу и дальше</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Часов потрачено</div>
          <div className="stat-val">{stats.hours}</div>
          <div className="stat-note">суммарно</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">В кассу</div>
          <div className="stat-val">{stats.revenue.toLocaleString("ru-RU")}€</div>
          <div className="stat-note">{stats.hours > 0 ? `${stats.perHour}€/час` : "—"}</div>
        </div>
        {planMatchPct !== undefined && planMatchPct !== null && (
          <div className="stat-box">
            <div className="stat-label">План vs факт</div>
            <div className="stat-val">{planMatchPct}%</div>
            <div className="stat-note">среднее совпадение по дням</div>
          </div>
        )}
      </div>

      <div className="progress-wrap">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-caption">{stats.total} из {CAMPAIGN_GOAL} касаний · осталось {Math.max(CAMPAIGN_GOAL - stats.total, 0)}</div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-title">Воронка по стадиям</div>
          <StageFunnelChart counts={stats.counts} />
        </div>
        <div className="card">
          <div className="card-title">Итог по всем касаниям</div>
          <OutcomeDonutChart counts={stats.counts} />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Динамика — накопительно по дням</div>
        <TrendChart trend={stats.trend} />
      </div>
    </>
  );
}
