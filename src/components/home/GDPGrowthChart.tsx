"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const data = [
  { year: "May",  value: 8 },
  { year: "2019", value: 5.7 },
  { year: "2010", value: 1.8 },
  { year: "2020", value: -1.8 },
  { year: "2021", value: 4.1 },
  { year: "2023", value: 4.9 },
  { year: "2023", value: 6.8 },
];

export default function GDPGrowthChart() {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col h-full"
    >
      <p className="text-gray-800 font-bold text-sm mb-1 flex-shrink-0">
        GDP Growth Rate{" "}
        <span className="text-gray-400 font-normal">(2018 — 2023)</span>
      </p>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
              domain={[-3, 9]}
              ticks={[2, 5, 7, 8]}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "GDP Growth"]}
              contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2.5}
              fill="url(#gdpGrad)"
              dot={{ r: 4, fill: "#fff", stroke: "#3B82F6", strokeWidth: 2.5 }}
              activeDot={{ r: 5, fill: "#3B82F6", strokeWidth: 0 }}
            >
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v) => `${v}%`}
                style={{ fontSize: "9px", fill: "#374151", fontWeight: 700 }}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-end flex-shrink-0 mt-1">
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
          style={{ background: "#F1F5F9", color: "#475569" }}
        >
          ▼ -0.7%
        </span>
      </div>
    </div>
  );
}
