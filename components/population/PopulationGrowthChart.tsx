"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LabelList,
} from "recharts";
import { populationSize } from "@/data/populationData";

const SHOW_LABEL_YEARS = new Set(["2000", "2005", "2010", "2015", "2021", "2025*"]);

const explanation = {
  what: `This chart counts how many people live in Ghana each year from 2000 to 2025. Each dot on the line is one year's population figure — like reading the total number of people on a national census or estimate sheet.`,
  story: `Ghana's population has grown from about 18.9 million in 2000 to 33.7 million in 2025 — nearly doubling in 25 years. The vertical dashed lines mark the two recent national censuses (2010 and 2021), when the government physically counted every person. The growth is real but gradually slowing: the rate was 2.7% per year in the 1980s and is now around 2.1%.`,
  why: `Every additional person creates demand for food, schools, hospitals, roads, and jobs. Knowing how many people there are — and how fast that number is growing — is the foundation of every government plan, from how many teachers to train to how many hospital beds to build.`,
};

export default function PopulationGrowthChart() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col h-full">
      <div className="flex items-start justify-between mb-1 flex-shrink-0">
        <div>
          <p className="text-gray-800 font-bold text-sm">
            Population Size{" "}
            <span className="text-gray-400 font-normal">(2000 — 2025)</span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
            Ghana has experienced sustained population growth over the period.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: "#F0FDF4", color: "#16A34A" }}
          >
            33.7M in 2025
          </span>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
            style={{
              background: open ? "#1B2A4A" : "#F0FDF4",
              color: open ? "#ffffff" : "#16A34A",
              border: "1px solid",
              borderColor: open ? "#1B2A4A" : "#BBF7D0",
            }}
          >
            Explain
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0" style={{ minHeight: "200px" }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={populationSize} margin={{ top: 24, right: 16, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 9, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tickFormatter={(v) => `${v}M`}
                tick={{ fontSize: 9, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                domain={[16, 36]}
                ticks={[18, 22, 26, 30, 34]}
              />
              <Tooltip
                formatter={(value) => [`${value}M`, "Population"]}
                contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              <ReferenceLine x="2010" stroke="#E2E8F0" strokeDasharray="4 2" label={{ value: "Census", position: "top", fontSize: 8, fill: "#94A3B8" }} />
              <ReferenceLine x="2021" stroke="#E2E8F0" strokeDasharray="4 2" label={{ value: "Census", position: "top", fontSize: 8, fill: "#94A3B8" }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#17B8A6"
                strokeWidth={2.5}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const isLast = payload.year === "2025*";
                  return (
                    <circle
                      key={payload.year}
                      cx={cx}
                      cy={cy}
                      r={isLast ? 5 : 3}
                      fill={isLast ? "#17B8A6" : "#fff"}
                      stroke="#17B8A6"
                      strokeWidth={isLast ? 0 : 2}
                    />
                  );
                }}
                activeDot={{ r: 5, fill: "#17B8A6", strokeWidth: 0 }}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  content={(props) => {
                    const { x, y, value, index } = props as { x: number; y: number; value: number; index: number };
                    const year = populationSize[index]?.year;
                    if (!SHOW_LABEL_YEARS.has(year)) return null;
                    return (
                      <text x={x} y={y - 6} textAnchor="middle" fontSize={8} fontWeight={700} fill="#1B2A4A">
                        {value}
                      </text>
                    );
                  }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="text-xs flex-shrink-0 mt-1" style={{ color: "#9CA3AF" }}>
        * 2025 projected population
      </p>
    </div>

    {open && (
      <>
        <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
        <div className="fixed z-40 rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ top: "60px", right: "16px", width: "320px", maxHeight: "calc(100vh - 76px)", background: "#ffffff" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100" style={{ background: "#F0FDF4" }}>
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
