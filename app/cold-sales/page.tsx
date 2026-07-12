import { fetchLeadRows } from "../lib/cold-leads";
import { computeColdSalesStats } from "../lib/cold-leads-stats";
import { fetchResistanceLog } from "../lib/resistance";
import ColdSalesOverview from "../components/ColdSalesOverview";
import LeadsTable from "../components/LeadsTable";
import PromoBanner from "../components/PromoBanner";
import ConsultationForm from "../components/ConsultationForm";
import FearCard from "../components/FearCard";

export const revalidate = 60;

export default async function ColdSalesPage() {
  const [rows, resistance] = await Promise.all([fetchLeadRows(), fetchResistanceLog()]);
  const stats = computeColdSalesStats(rows);
  const hasData = stats.total > 0;

  return (
    <main className="dash-main">
      <div className="dash-header">
        <span className="page-label">Gorbenko · публичный трекер</span>
        <span className="badge green">🔴 live</span>
      </div>
      <h1 className="page-title">🎯 100 холодных касаний</h1>
      <p className="page-sub">
        Захожу в бизнесы, наговариваю боту что произошло. Цель — 100 касаний до конца месяца.
        Здесь автоматически считается конверсия в продажу, сколько денег это принесёт в кассу
        и сколько часов на это уходит. Обновляется само, раз в минуту.
      </p>

      <PromoBanner />

      {hasData ? (
        <>
          <ColdSalesOverview stats={stats} />
          <FearCard count={resistance.length} variant="public" />
          <LeadsTable rows={rows} masked />
          <ConsultationForm />
        </>
      ) : (
        <div className="card">
          <div className="card-title">Пока пусто</div>
          <p style={{ color: "var(--text-3)", fontSize: 14 }}>Первое касание скоро появится здесь.</p>
        </div>
      )}

      <p className="footer-note">
        Это публичная версия — без названий бизнесов, контактов и адресов.
        Данные обновляются автоматически каждую минуту.
      </p>
    </main>
  );
}
