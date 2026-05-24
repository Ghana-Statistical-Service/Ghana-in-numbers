"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { enrolmentRateData } from "@/data/socialDevelopmentData";

const seriesMeta = [
  { level: "primary", label: "Primary", color: "#F26B2A" },
  { level: "jhs", label: "JHS", color: "#0F5D7E" },
  { level: "shs", label: "SHS", color: "#276B3A" },
] as const;

type Mode = "net" | "gross";

export default function LearningOpportunityChart() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("net");
  useEffect(() => setMounted(true), []);

  const chartData = useMemo(() => {
    return enrolmentRateData.map((row) => ({
      year: row.year,
      primary: mode === "net" ? row.primaryNet : row.primaryGross,
      jhs: mode === "net" ? row.jhsNet : row.jhsGross,
      shs: mode === "net" ? row.shsNet : row.shsGross,
    }));
  }, [mode]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col h-full">
      <div className="flex items-start justify-between gap-4 mb-2 flex-shrink-0">
        <div>
          <p className="text-gray-800 font-bold text-sm">
            School Enrolment Rates{" "}
            <span className="text-gray-400 font-normal">(Primary, JHS, SHS)</span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            Toggle between net and gross enrolment rates.
          </p>
        </div>
        <div className="flex rounded-full bg-slate-100 p-0.5">
          {(["net", "gross"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className="rounded-full px-3 py-1 text-[11px] font-bold transition-colors"
              style={{
                background: mode === item ? "#1B2A4A" : "transparent",
                color: mode === item ? "#fff" : "#64748B",
              }}
            >
              {item === "net" ? "NER" : "GER"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0" style={{ minHeight: "260px" }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 16, right: 18, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis domain={mode === "net" ? [35, 95] : [75, 130]} ticks={mode === "net" ? [40, 55, 70, 85] : [80, 95, 110, 125]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }}
              />
              <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              {seriesMeta.map((item) => (
                <Line
                  key={item.level}
                  type="monotone"
                  dataKey={item.level}
                  name={item.label}
                  stroke={item.color}
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: "#fff", stroke: item.color, strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: item.color, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
