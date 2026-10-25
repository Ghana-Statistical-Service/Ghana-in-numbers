"use client";

import CardExplanation from "@/components/shared/CardExplanation";


import { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { pyramidData } from "@/data/populationData";

const YEARS = ["2010", "2021", "2025"] as const;
type Year = typeof YEARS[number];


interface TooltipPayloadItem {
  dataKey: string;
  value: number;
  color: string;
}

function PyramidTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2 text-xs shadow">
      <p className="font-bold mb-1" style={{ color: "#1B2A4A" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === "maleSide" ? "Male" : "Female"}: {Math.abs(p.value).toFixed(2)}M
        </p>
      ))}
    </div>
  );
}

export default function PopulationPyramid() {
  const [mounted, setMounted] = useState(false);
  const [selectedYear, setSelectedYear] = useState<Year>("2025");

  useEffect(() => { setMounted(true); }, []);

  const chartData = useMemo(() => {
    return pyramidData[selectedYear].map((d) => ({
      age: d.age,
      maleSide: -d.male,
      femaleSide: d.female,
    }));
  }, [selectedYear]);

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <p className="text-gray-800 font-bold text-sm">
          Age-Sex Structure{" "}
          <span className="text-gray-400 font-normal">(Millions)</span>
        </p>
        <div className="flex items-center gap-1.5">
          {YEARS.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors"
              style={{
                background: selectedYear === y ? "#1B2A4A" : "#F1F5F9",
                color: selectedYear === y ? "#fff" : "#64748B",
              }}
            >
              {y}
            </button>
          ))}
          <CardExplanation indicator="pyramid" />
        </div>
      </div>


      {/* Legend */}
      <div className="flex gap-4 mb-2 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#2F6FE4" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>Male</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: "#DB2988" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>Female</span>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
              barCategoryGap="15%"
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis
                type="number"
                domain={[-2.5, 2.5]}
                tickFormatter={(v) => `${Math.abs(v)}`}
                tick={{ fontSize: 9, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                ticks={[-2, -1, 0, 1, 2]}
              />
              <YAxis
                type="category"
                dataKey="age"
                tick={{ fontSize: 9, fill: "#6B7280" }}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip content={<PyramidTooltip />} />
              <Bar dataKey="maleSide" name="Male" radius={[0, 2, 2, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.age} fill="#2F6FE4" fillOpacity={0.85} />
                ))}
              </Bar>
              <Bar dataKey="femaleSide" name="Female" radius={[2, 0, 0, 2]}>
                {chartData.map((entry) => (
                  <Cell key={entry.age} fill="#DB2988" fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>


    </>
  );
}
