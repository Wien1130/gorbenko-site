"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  STAGE_ORDER,
  STAGE_LABELS,
  STAGE_COLORS,
  CAMPAIGN_GOAL,
  type ColdSalesStats,
} from "../lib/cold-leads-stats";

const tooltipStyle = {
  background: "#1a1a1a",
  border: "1px solid #333",
  borderRadius: 8,
  color: "#eee",
  fontSize: 12,
};

export function StageFunnelChart({ counts }: { counts: ColdSalesStats["counts"] }) {
  const data = STAGE_ORDER.map((s) => ({
    stage: STAGE_LABELS[s],
    count: counts[s],
    fill: STAGE_COLORS[s],
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
        <XAxis type="number" stroke="#66617a" fontSize={11} allowDecimals={false} />
        <YAxis type="category" dataKey="stage" stroke="#a09cc4" fontSize={11} width={140} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function OutcomeDonutChart({ counts }: { counts: ColdSalesStats["counts"] }) {
  const won = counts.won;
  const lost = counts.lost;
  const active = Math.max(
    Object.values(counts).reduce((a, b) => a + b, 0) - won - lost,
    0,
  );
  const data = [
    { name: "Продажа", value: won, fill: "#4ade80" },
    { name: "В работе", value: active, fill: "#60a5fa" },
    { name: "Отказ", value: lost, fill: "#f87171" },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={2}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.fill} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          verticalAlign="bottom"
          height={30}
          formatter={(value) => <span style={{ color: "#ccc", fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({ trend }: { trend: ColdSalesStats["trend"] }) {
  const data = trend.map((t) => ({
    date: new Date(t.date).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
    cumulative: t.cumulative,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
        <XAxis dataKey="date" stroke="#66617a" fontSize={11} />
        <YAxis stroke="#66617a" fontSize={11} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v} касаний`, ""]} />
        <ReferenceLine y={CAMPAIGN_GOAL} stroke="#f87171" strokeDasharray="4 4" label={{ value: "Цель: 100", position: "insideTopRight", fill: "#f87171", fontSize: 11 }} />
        <Area type="monotone" dataKey="cumulative" stroke="#4ade80" strokeWidth={3} fill="url(#fillGreen)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
