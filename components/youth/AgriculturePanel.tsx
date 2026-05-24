"use client";

import { useEffect, useState } from "react";
import { BookOpen, X } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { agricultureData, agricultureTotals } from "@/data/youthBulgeData";

const kpis = [
  {
    label: "Youth in agriculture (15–24)",
    y2010: agricultureTotals.total1524_2010,
    y2021: agricultureTotals.total1524_2021,
    pct: "−56%",
  },
  {
    label: "Youth in agriculture (15–35)",
    y2010: agricultureTotals.total1535_2010,
    y2021: agricultureTotals.total1535_2021,
    pct: "−40%",
  },
];

export default function AgriculturePanel() {
  const [mounted, setMounted] = useState(false);
  const [showWriteUp, setShowWriteUp] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-0.5">
        <p className="text-xs font-bold" style={{ color: "#15803D" }}>
          Agriculture, Forestry &amp; Fishing — Youth Engagement (2010 vs 2021)
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
      <p className="text-xs mb-4" style={{ color: "#6B7280" }}>
        A structural shift away from agriculture — youth participation halved in a decade
      </p>

      {/* Write-up */}
      {showWriteUp && (
        <div
          className="mb-4 p-3 rounded-lg text-xs leading-relaxed"
          style={{ background: "#EFF6FF", color: "#1E40AF" }}
        >
          Agriculture, forestry and fishing remain important sources of employment for young people
          in Ghana, although recent census data suggest a noticeable decline in youth participation
          over the last decade. The number of youths aged <strong>15–24</strong> working in
          agriculture fell from <strong>865,855 (2010)</strong> to <strong>381,476 (2021)</strong> —
          a drop of more than <strong>50 percent</strong>. For the broader <strong>15–35</strong>{" "}
          group the decline was from <strong>2,025,551</strong> to <strong>1,222,885</strong>.
          Sex-disaggregated data reveal <strong>male dominance</strong> in both periods, but the
          female share contracted more sharply, especially among 15–24-year-olds (−64%). These
          trends reflect structural shifts driven by urbanisation, migration, and changing
          perceptions of agriculture as a career path. Policies that make agriculture more
          attractive — through mechanisation, agribusiness development, and access to finance —
          will be critical for reversing youth disengagement from the sector.
        </div>
      )}

      {/* KPI drop cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-gray-100 p-3 flex flex-col gap-1"
            style={{ background: "#F0FDF4" }}
          >
            <p className="text-[11px] font-medium" style={{ color: "#15803D" }}>{k.label}</p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm font-semibold" style={{ color: "#6B7280" }}>
                {k.y2010.toLocaleString()}
              </span>
              <span className="text-[10px]" style={{ color: "#94A3B8" }}>2010</span>
              <span className="text-base" style={{ color: "#94A3B8" }}>→</span>
              <span className="text-xl font-black" style={{ color: "#15803D" }}>
                {k.y2021.toLocaleString()}
              </span>
              <span className="text-[10px]" style={{ color: "#94A3B8" }}>2021</span>
            </div>
            <span
              className="text-sm font-black self-start px-2 py-0.5 rounded-full"
              style={{ background: "#FEE2E2", color: "#DC2626" }}
            >
              {k.pct}
            </span>
          </div>
        ))}
      </div>

      {/* Grouped bar chart — by demographic group */}
      <div style={{ height: 280 }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={agricultureData}
              margin={{ top: 16, right: 20, left: -4, bottom: 4 }}
              barCategoryGap="28%"
              barGap={4}
            >
              <CartesianGrid stroke="#F1F5F9" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="group"
                tick={{ fontSize: 10, fill: "#6B7280" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v: unknown) =>
                  [(v as number).toLocaleString(), ""]
                }
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" iconSize={8} />
              <Bar dataKey="y2010" name="2010 Census" fill="#4ADE80" radius={[3, 3, 0, 0]}>
                <LabelList
                  dataKey="y2010"
                  position="top"
                  formatter={(v: unknown) => `${((v as number) / 1000).toFixed(0)}k`}
                  style={{ fontSize: 9, fontWeight: 700, fill: "#15803D" }}
                />
              </Bar>
              <Bar dataKey="y2021" name="2021 Census" fill="#F97316" radius={[3, 3, 0, 0]}>
                <LabelList
                  dataKey="y2021"
                  position="top"
                  formatter={(v: unknown) => `${((v as number) / 1000).toFixed(0)}k`}
                  style={{ fontSize: 9, fontWeight: 700, fill: "#C2410C" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
