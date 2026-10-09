"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import type { DayStats } from "../../lib/crm/types";

const AXIS = { stroke: "#666", fontSize: 11 };
const TOOLTIP = { contentStyle: { background: "#111", border: "1px solid #333", borderRadius: 8, fontSize: 12 } };

function short(day: string): string {
  return new Date(day + "T12:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "numeric" });
}

export default function DayCharts({ days }: { days: DayStats[] }) {
  const data = days.map((d) => ({
    ...d,
    label: short(d.day),
    perHour: d.hours > 0.05 ? Math.round((d.visits / d.hours) * 10) / 10 : 0,
  }));
  const totalHours = days.reduce((s, d) => s + d.hours, 0);
  const totalVisits = days.reduce((s, d) => s + d.visits, 0);
  const totalEmails = days.reduce((s, d) => s + d.emails, 0);
  const workDays = days.filter((d) => d.hours > 0 || d.visits > 0).length;

  return (
    <div>
      <div className="crm-stats-mini">
        <div className="crm-stat"><b>{totalVisits}</b><span>точек</span></div>
        <div className="crm-stat"><b>{totalHours.toFixed(1)}</b><span>часов</span></div>
        <div className="crm-stat"><b>{totalHours > 0.05 ? (totalVisits / totalHours).toFixed(1) : "—"}</b><span>точек/час</span></div>
        <div className="crm-stat"><b>{totalEmails}</b><span>писем</span></div>
      </div>
      <div className="crm-sub" style={{ marginBottom: 12 }}>
        {workDays} рабочих дн. · до цели 100: {Math.max(100 - totalVisits, 0)}
        {workDays > 0 && totalVisits > 0 ? ` · при текущем темпе ещё ~${Math.ceil(Math.max(100 - totalVisits, 0) / (totalVisits / workDays))} дн.` : ""}
      </div>

      {data.length === 0 ? (
        <div className="crm-chart-card"><div className="crm-sub">Графики появятся после первого рабочего дня.</div></div>
      ) : (
        <>
          <div className="crm-chart-card">
            <div className="crm-chart-title">Точек по дням</div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={data}>
                <CartesianGrid stroke="#222" vertical={false} />
                <XAxis dataKey="label" {...AXIS} />
                <YAxis allowDecimals={false} {...AXIS} width={28} />
                <Tooltip {...TOOLTIP} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="visits" name="новые точки" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="followups" name="повторные" stackId="a" fill="#facc15" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="crm-chart-card">
            <div className="crm-chart-title">Часов в работе</div>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={data}>
                <CartesianGrid stroke="#222" vertical={false} />
                <XAxis dataKey="label" {...AXIS} />
                <YAxis {...AXIS} width={28} />
                <Tooltip {...TOOLTIP} />
                <Bar dataKey="hours" name="часы" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="crm-chart-card">
            <div className="crm-chart-title">Точек в час (темп)</div>
            <ResponsiveContainer width="100%" height={170}>
              <LineChart data={data}>
                <CartesianGrid stroke="#222" vertical={false} />
                <XAxis dataKey="label" {...AXIS} />
                <YAxis {...AXIS} width={28} />
                <Tooltip {...TOOLTIP} />
                <Line type="monotone" dataKey="perHour" name="точек/час" stroke="#60a5fa" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="crm-chart-card">
            <div className="crm-chart-title">По дням</div>
            <table className="crm-day-table">
              <thead>
                <tr><th>День</th><th>Часы</th><th>Точки</th><th>Повт.</th><th>Письма</th><th>/час</th></tr>
              </thead>
              <tbody>
                {[...data].reverse().map((d) => (
                  <tr key={d.day}>
                    <td>{new Date(d.day + "T12:00:00").toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "short" })}</td>
                    <td>{d.hours.toFixed(1)}</td>
                    <td>{d.visits}</td>
                    <td>{d.followups}</td>
                    <td>{d.emails}</td>
                    <td>{d.perHour || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
