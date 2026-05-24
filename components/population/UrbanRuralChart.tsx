"use client";

import { useState, useEffect } from "react";
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
import { urbanRuralData } from "@/data/populationData";

const explanation = {
  what: `This chart shows the share of Ghana's population living in cities and towns (Urban) versus villages and countryside (Rural), at five points in time from 1984 to 2025. The two coloured areas always add up to 100%.`,
  story: `In 1984, only 32 in every 100 Ghanaians lived in an urban area. By 2010, cities and villages were roughly equal (51% urban). By 2025, nearly 59 in every 100 Ghanaians are urban dwellers. Cities like Accra, Kumasi, and Tamale have grown rapidly as people move from villages seeking jobs, education, and services.`,
  why: `Rapid urbanisation means cities need more roads, water, electricity, schools, and housing — fast. At the same time, rural areas may face labour shortages as younger people leave. Policymakers use this data to decide where to build infrastructure and how to balance investment between city and countryside.`,
};

export default function UrbanRuralChart() {
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
            Urban–Rural Distribution{" "}
            <span className="text-gray-400 font-normal">(1984–2025)</span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
            Ghana is becoming more urbanised
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#382873" }} />
              <span className="text-xs" style={{ color: "#6B7280" }}>Urban</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#17B8A6" }} />
              <span className="text-xs" style={{ color: "#6B7280" }}>Rural</span>
            </div>
          </div>
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

      <div className="flex-1 min-h-0" style={{ minHeight: "160px" }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={urbanRuralData} margin={{ top: 24, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="urbanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#382873" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="#382873" stopOpacity={0.65} />
                </linearGradient>
                <linearGradient id="ruralGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#17B8A6" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="#17B8A6" stopOpacity={0.65} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 9, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 9, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip
                formatter={(value, name) => [`${value}%`, name === "urban" ? "Urban" : "Rural"]}
                contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              <Area
                type="monotone"
                dataKey="urban"
                stackId="a"
                stroke="#382873"
                strokeWidth={1.5}
                fill="url(#urbanGrad)"
              >
                <LabelList
                  dataKey="urban"
                  position="top"
                  formatter={(v: unknown) => `${v}%`}
                  style={{ fontSize: "8px", fill: "#ffffff", fontWeight: 700 }}
                  offset={-12}
                />
              </Area>
              <Area
                type="monotone"
                dataKey="rural"
                stackId="a"
                stroke="#17B8A6"
                strokeWidth={1.5}
                fill="url(#ruralGrad)"
              >
                <LabelList
                  dataKey="rural"
                  position="insideBottom"
                  formatter={(v: unknown) => `${v}%`}
                  style={{ fontSize: "8px", fill: "#ffffff", fontWeight: 700 }}
                  offset={8}
                />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <p className="text-xs flex-shrink-0 mt-1" style={{ color: "#9CA3AF" }}>
        * 2025 projected
      </p>
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
