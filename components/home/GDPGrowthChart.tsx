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
import { gdpGrowthData as data } from "@/data/dummy";

const explanation = {
  what: `GDP growth rate measures how much faster (or slower) Ghana's entire economy is producing goods and services compared to the previous year. Think of it like your household income — if it grew by 6% this year, you earned 6% more than last year.`,
  story: `In 2020, Ghana's economy almost stopped growing (0.5%) because COVID-19 shut down businesses, travel, and trade worldwide. From 2021, the economy started recovering, though high inflation in 2022–2023 slowed things down again. By 2025, growth is back at 6.0% — meaning Ghana's economy is now producing GH₵6 more for every GH₵100 it produced in 2024.`,
  why: `A growing GDP generally means more jobs, higher wages, and more money for government services like schools and hospitals. 6% is considered a healthy rate — fast enough to improve living standards, but not so fast it causes runaway prices.`,
};

export default function GDPGrowthChart() {
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

        {/* Header */}
        <div className="flex items-start justify-between mb-1 flex-shrink-0">
          <p className="text-gray-800 font-bold text-sm">
            GDP Growth Rate{" "}
            <span className="text-gray-400 font-normal">(2017 — 2025, Production)</span>
          </p>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ml-2"
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

        {/* Chart — always visible */}
        <div className="flex-1 min-h-0" style={{ minHeight: "180px" }}>
          {mounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={data} margin={{ top: 20, right: 20, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                  domain={[-1, 10]}
                  ticks={[0, 2, 4, 6, 8]}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "GDP Growth"]}
                  contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="url(#gdpGrad)"
                  dot={{ r: 4, fill: "#fff", stroke: "#3B82F6", strokeWidth: 2.5 }}
                  activeDot={{ r: 5, fill: "#3B82F6", strokeWidth: 0 }}
                >
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(v) => `${v}%`}
                    style={{ fontSize: "9px", fill: "#374151", fontWeight: 700 }}
                  />
                </Area>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex justify-end flex-shrink-0 mt-1">
          <span
            className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
            style={{ background: "#F1F5F9", color: "#475569" }}
          >
            ▲ +0.2%
          </span>
        </div>
      </div>

      {/* Fixed explanation overlay — outside the card, on top of the page */}
      {open && (
        <>
          {/* Backdrop — clicking anywhere closes */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div
            className="fixed z-40 rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
            style={{
              top: "60px",
              right: "16px",
              width: "320px",
              maxHeight: "calc(100vh - 76px)",
              background: "#ffffff",
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
              style={{ background: "#F8FAFF" }}
            >
              <p className="text-sm font-bold" style={{ color: "#1B2A4A" }}>
                What is this chart telling me?
              </p>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-colors"
                style={{ background: "#E2E8F0", color: "#64748B" }}
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
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
