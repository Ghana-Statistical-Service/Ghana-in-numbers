"use client";

import { useEffect, useState } from "react";
import { BookOpen, X } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { nationalUnemployment, unemploymentByRegion } from "@/data/youthBulgeData";

type Quarter = "Q2" | "Q3";
type Bracket = "15-24" | "15-35";

function getKey(q: Quarter, b: Bracket): keyof typeof unemploymentByRegion[0] {
  if (q === "Q2" && b === "15-24") return "q2_1524";
  if (q === "Q2" && b === "15-35") return "q2_1535";
  if (q === "Q3" && b === "15-24") return "q3_1524";
  return "q3_1535";
}

function getNational(q: Quarter, b: Bracket): number {
  if (q === "Q2" && b === "15-24") return nationalUnemployment.q2_1524;
  if (q === "Q2" && b === "15-35") return nationalUnemployment.q2_1535;
  if (q === "Q3" && b === "15-24") return nationalUnemployment.q3_1524;
  return nationalUnemployment.q3_1535;
}

export default function UnemploymentPanel() {
  const [mounted, setMounted] = useState(false);
  const [quarter, setQuarter] = useState<Quarter>("Q2");
  const [bracket, setBracket] = useState<Bracket>("15-24");
  const [showWriteUp, setShowWriteUp] = useState(false);

  useEffect(() => setMounted(true), []);

  const dataKey = getKey(quarter, bracket);
  const national = getNational(quarter, bracket);

  const chartData = [...unemploymentByRegion]
    .sort((a, b) => (b[dataKey] as number) - (a[dataKey] as number));

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-0.5">
            <p className="text-xs font-bold" style={{ color: "#DB2988" }}>
              Youth Unemployment Rate by Region — 2025
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
          <p className="text-xs" style={{ color: "#6B7280" }}>
            National average shown as dashed line
          </p>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs font-semibold">
            {(["Q2", "Q3"] as Quarter[]).map((q) => (
              <button
                key={q}
                onClick={() => setQuarter(q)}
                className="px-3 py-1 transition-colors"
                style={{
                  background: quarter === q ? "#DB2988" : "#fff",
                  color: quarter === q ? "#fff" : "#6B7280",
                }}
              >
                {q} 2025
              </button>
            ))}
          </div>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs font-semibold">
            {(["15-24", "15-35"] as Bracket[]).map((b) => (
              <button
                key={b}
                onClick={() => setBracket(b)}
                className="px-3 py-1 transition-colors"
                style={{
                  background: bracket === b ? "#382873" : "#fff",
                  color: bracket === b ? "#fff" : "#6B7280",
                }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showWriteUp && (
        <div
          className="mb-4 p-3 rounded-lg text-xs leading-relaxed"
          style={{ background: "#EFF6FF", color: "#1E40AF" }}
        >
          Youth unemployment in Ghana is high and geographically uneven. At the national level,{" "}
          <strong>30.5% of young people aged 15–24</strong> were unemployed in Q2 2025, rising to{" "}
          <strong>34.4% in Q3</strong>. The burden is concentrated in urbanised southern regions:
          Greater Accra recorded the highest rate at <strong>49.3% (Q3 2025)</strong>, followed by
          Western (46.8%) and Ashanti (41.2%). In contrast, northern regions report lower measured
          unemployment, partly because youth in those areas are more likely to engage in subsistence
          agriculture which counts as employment. Regions above the national average are highlighted
          — policy attention should prioritise urban youth employment pathways.
        </div>
      )}

      <div style={{ height: 420 }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 52, left: 4, bottom: 4 }}
              barCategoryGap="30%"
            >
              <CartesianGrid stroke="#F1F5F9" strokeDasharray="4 4" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 60]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="region"
                width={100}
                tick={{ fontSize: 10, fill: "#374151" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v: unknown) => [`${v}%`, `Ages ${bracket}`]}
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
              />
              <ReferenceLine
                x={national}
                stroke="#94A3B8"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `National ${national}%`,
                  position: "top",
                  fontSize: 9,
                  fill: "#94A3B8",
                  fontWeight: 700,
                }}
              />
              <Bar dataKey={dataKey as string} radius={[0, 3, 3, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.region}
                    fill={
                      (entry[dataKey] as number) >= national
                        ? "#DB2988"
                        : "#F9A8D4"
                    }
                  />
                ))}
                <LabelList
                  dataKey={dataKey as string}
                  position="right"
                  formatter={(v: unknown) => `${v}%`}
                  style={{ fontSize: 10, fontWeight: 700, fill: "#DB2988" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
