"use client";

import {
  BarChart,
  Bar,
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

export default function RevenueChart({ data }: Props) {
  const chartData = data.map((d) => ({
    year: d.year,
    营收: d.revenue,
    毛利润: d.grossProfit,
    净利润: d.netProfit,
  }));

  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">年度营收趋势</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
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
          <Bar dataKey="营收" fill="#10B981" />
          <Bar dataKey="毛利润" fill="#8B5CF6" />
          <Bar dataKey="净利润" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-2 text-xs text-slate-400">金额单位：亿元</p>
    </div>
  );
}
