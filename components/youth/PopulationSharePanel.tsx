"use client";

import CardExplanation from "@/components/shared/CardExplanation";


import { useEffect, useState } from "react";
import { BookOpen, X } from "lucide-react";
import {
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { populationShareData } from "@/data/youthBulgeData";

const LINES = [
  { key: "children",  label: "Children 0–14",         color: "#94A3B8" },
  { key: "youth1524", label: "Youth 15–24 (international)",       color: "#F97316" },
  { key: "youth1535", label: "Youth 15–35 (AU def.)",  color: "#7C3AED" },
];

export default function PopulationSharePanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-0.5">
        <p className="text-xs font-bold" style={{ color: "#7C3AED" }}>
          Age-Group Share of Total Population (%) — Documented Endpoints
        </p>
        <CardExplanation indicator="youth" />
      </div>
      <p className="text-xs mb-3" style={{ color: "#6B7280" }}>
        2000 and 2025 observations; the 15–24 share is 16% in 2025 (p. 108).
      </p>




      <div style={{ height: 260 }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 1 }}>
            <LineChart
              data={populationShareData}
              margin={{ top: 16, right: 48, left: -16, bottom: 4 }}
            >
              <CartesianGrid stroke="#F1F5F9" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[10, 50]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v: unknown, name) => [`${v}%`, String(name ?? "")]}
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                iconType="circle"
                iconSize={8}
              />
              {LINES.map(({ key, label, color }) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={label}
                  stroke={color}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: color, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: color, stroke: "#fff", strokeWidth: 2 }}
                >
                  <LabelList
                    dataKey={key}
                    position="right"
                    formatter={(v: unknown) => `${v}%`}
                    style={{ fontSize: 10, fontWeight: 700, fill: color }}
                  />
                </Line>
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
