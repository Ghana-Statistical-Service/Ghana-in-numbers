"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { year: "2021", value: 11.7 },
  { year: "2050", value: 17.7 },
];

export default function YouthProjectionChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ height: 200 }} />;

  return (
    <div style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 28, right: 16, left: -16, bottom: 4 }} barCategoryGap="40%">
          <CartesianGrid stroke="#E0F2FE" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 13, fill: "#0369A1", fontWeight: 700 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 22]}
            tickFormatter={(v) => `${v}M`}
            tick={{ fontSize: 10, fill: "#94A3B8" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(v: unknown) => [`${v}M`, "Youth population"]}
            contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            <Cell fill="#93C5FD" />
            <Cell fill="#0369A1" />
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v: unknown) => `${v}M`}
              style={{ fontSize: 13, fontWeight: 900, fill: "#0369A1" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
