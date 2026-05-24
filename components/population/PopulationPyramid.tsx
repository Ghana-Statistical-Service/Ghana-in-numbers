"use client";

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

const explanation = {
  what: `This chart shows how many males and females there are in each age group of Ghana's population. Blue bars extend left for males; pink bars extend right for females. Each horizontal band is a 5-year age group, from newborns at the bottom to 80+ at the top.`,
  story: `In 2010, the pyramid had a very wide base — lots of young children — tapering sharply at the top. By 2025, the base is narrowing gradually while the middle is filling out, meaning fewer children relative to working-age adults. This is called a "demographic transition" and is common as countries develop.`,
  why: `The shape of the pyramid tells planners what services a country will need. A wide base means pressure on schools and maternity wards now, and the workforce in 20 years. A widening middle means more workers today — potentially a "demographic dividend" — but also future pressure on pensions and elderly care.`,
};

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
  const [open, setOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

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
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
            style={{
              background: open ? "#1B2A4A" : "#EFF6FF",
              color: open ? "#ffffff" : "#2563EB",
              border: "1px solid",
              borderColor: open ? "#1B2A4A" : "#BFDBFE",
            }}
          >
            Explain
          </button>
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

    {open && (
      <>
        <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
        <div className="fixed z-40 rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ top: "60px", right: "16px", width: "320px", maxHeight: "calc(100vh - 76px)", background: "#ffffff" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100" style={{ background: "#F8FAFF" }}>
            <p className="text-sm font-bold" style={{ color: "#1B2A4A" }}>What is this chart telling me?</p>
            <button onClick={() => setOpen(false)} className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold" style={{ background: "#E2E8F0", color: "#64748B" }}>✕</button>
          </div>
          <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: "calc(100vh - 140px)" }}>
            <div className="rounded-lg p-3" style={{ background: "#EFF6FF" }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#1D4ED8" }}>📊 What it measures</p>
              <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{explanation.what}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "#F0FDF4" }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#15803D" }}>📖 The story in this chart</p>
              <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{explanation.story}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "#FFFBEB" }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#B45309" }}>💡 Why does it matter?</p>
              <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{explanation.why}</p>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
}
