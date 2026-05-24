"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { inflationSparklineData } from "@/data/dummy";

const highlightedIndexes = new Set([5, 13]);

const explanation = {
  what: `Inflation tells you how much more expensive things are getting. If inflation is 3.2%, it means something that cost GH₵100 last year now costs GH₵103.20. It's the rate at which your money is losing its buying power.`,
  story: `A year ago, Ghana had very high inflation — prices were rising at over 25% per year. That means groceries, transport, and rent were getting dramatically more expensive every month. Since then, the government and Bank of Ghana have taken steps to cool down the economy, and inflation has fallen sharply to just 3.2% as of March 2026. This is one of the fastest inflation drops in Ghana's recent history.`,
  why: `Low, stable inflation (around 5–8%) is considered healthy. It means prices are rising slowly enough that wages can keep up, businesses can plan ahead, and savings don't evaporate. At 3.2%, Ghana is now well within a comfortable zone — your GH₵100 today will only be worth GH₵96.80 a year from now, assuming inflation stays here.`,
};

function TrendDot(props: { cx?: number; cy?: number; index?: number }) {
  const { cx, cy, index } = props;
  if (cx == null || cy == null || index == null || !highlightedIndexes.has(index)) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="#FFFFFF" stroke="#2F6FE4" strokeWidth={3.5} />
      <circle cx={cx} cy={cy} r={2.75} fill="#2F6FE4" />
    </g>
  );
}

export default function InflationSparkline() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const values = inflationSparklineData.map((p) => p.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const domainPadding = Math.max((maxValue - minValue) * 0.18, 0.18);
  const lowerBound = minValue - domainPadding;
  const upperBound = maxValue + domainPadding;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="px-3.5 pt-3.5 pb-3 border-b border-gray-100 flex items-center justify-between">
          <p className="font-semibold" style={{ fontSize: "0.96rem", color: "#374151" }}>
            Inflation Rate
          </p>
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

        {/* Chart body — always visible */}
        <div className="flex-1 flex flex-col px-3.5 pt-3 pb-0 relative">
          <p className="font-bold leading-none" style={{ fontSize: "2.55rem", color: "#1B2A4A" }}>
            3.2%
          </p>

          <div className="flex items-center gap-1.5 mt-2">
            <span className="font-semibold leading-none" style={{ fontSize: "0.88rem", color: "#1B2A4A" }}>▼</span>
            <span className="text-sm" style={{ fontSize: "0.88rem", color: "#6B7280" }}>Down from 3.3%</span>
          </div>

          <div className="relative mt-2 flex-1 min-h-0" style={{ minHeight: "130px" }}>
            <div className="absolute inset-y-0 -left-3.5 -right-3.5" style={{ minHeight: "130px" }}>
              {mounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={inflationSparklineData} margin={{ top: 18, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.08} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={[lowerBound, upperBound]} hide />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#2F6FE4"
                      strokeWidth={3.5}
                      fill="url(#waveGrad)"
                      dot={TrendDot}
                      activeDot={false}
                      isAnimationActive={false}
                      baseValue={lowerBound}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            <div
              className="absolute bottom-3.5 right-4 rounded-lg border border-slate-100 bg-white px-2 py-1.5 shadow-sm"
              style={{ boxShadow: "0 10px 24px rgba(15,23,42,0.10)" }}
            >
              <span className="text-xs font-semibold" style={{ color: "#475569" }}>▼ -0.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed explanation overlay — outside the card, on top of the page */}
      {open && (
        <>
          {/* Backdrop — clicking anywhere closes */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />

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
