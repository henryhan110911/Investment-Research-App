"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { FinancialData } from "@/lib/data/a-share";

type Props = {
  data: FinancialData[];
};

export default function GrowthChart({ data }: Props) {
  const chartData = data.map((d) => ({
    year: d.year,
    营收增长: d.revenueGrowth,
    净利润增长: d.netProfitGrowth,
    EPS增长: d.epsGrowth,
    自由现金流增长: d.fcfGrowth,
  }));

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">财务增长趋势</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="year" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#F3F4F6",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="营收增长"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="净利润增长"
            stroke="#8B5CF6"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="EPS增长"
            stroke="#F59E0B"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="自由现金流增长"
            stroke="#3B82F6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-2 text-xs text-slate-400">增长率单位：%</p>
    </div>
  );
}
