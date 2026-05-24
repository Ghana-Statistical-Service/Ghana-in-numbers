"use client";

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
  { key: "youth1524", label: "Youth 15–24 (GH)",       color: "#F97316" },
  { key: "youth1535", label: "Youth 15–35 (AU def.)",  color: "#7C3AED" },
];

export default function PopulationSharePanel() {
  const [mounted, setMounted] = useState(false);
  const [showWriteUp, setShowWriteUp] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-0.5">
        <p className="text-xs font-bold" style={{ color: "#7C3AED" }}>
          Age-Group Share of Total Population (%) — 2000–2025
        </p>
        <button
          onClick={() => setShowWriteUp((v) => !v)}
          className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 transition-colors"
          style={{
            background: showWriteUp ? "#EFF6FF" : "#F8FAFC",
            color: showWriteUp ? "#1D4ED8" : "#94A3B8",
            border: "1px solid #E5E7EB",
          }}
        >
          {showWriteUp ? <X size={11} /> : <BookOpen size={11} />}
          {showWriteUp ? "Close" : "Write-up"}
        </button>
      </div>
      <p className="text-xs mb-3" style={{ color: "#6B7280" }}>
        Children (0–14) declining as youth cohorts remain large — the classic bulge dynamic
      </p>

      {showWriteUp && (
        <div
          className="mb-4 p-3 rounded-lg text-xs leading-relaxed"
          style={{ background: "#EFF6FF", color: "#1E40AF" }}
        >
          Ghana&apos;s population is undergoing a structural demographic shift. The share of children (0–14)
          has fallen from <strong>41.8% in 2000</strong> to <strong>33.2% in 2025</strong>, reflecting
          declining fertility rates. However, the youth cohort (15–35, African Union definition) remains
          large at around <strong>30%</strong> of the population — a level sustained for over two decades.
          This prolonged youth bulge represents both a potential demographic dividend and a risk: if
          investments in education, skills, and employment are not made urgently, the large cohort of
          young people entering the labour market each year will not find productive work. The window to
          capture the dividend is narrowing.
        </div>
      )}

      <div style={{ height: 260 }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
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
