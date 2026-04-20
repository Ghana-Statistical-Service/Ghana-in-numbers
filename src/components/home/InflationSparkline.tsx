"use client";

import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { inflationSparklineData } from "@/data/dummy";

const highlightedIndexes = new Set([5, 13]);

function TrendDot(props: { cx?: number; cy?: number; index?: number }) {
  const { cx, cy, index } = props;

  if (cx == null || cy == null || index == null || !highlightedIndexes.has(index)) {
    return null;
  }

  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="#FFFFFF" stroke="#2F6FE4" strokeWidth={3.5} />
      <circle cx={cx} cy={cy} r={2.75} fill="#2F6FE4" />
    </g>
  );
}

export default function InflationSparkline() {
  const values = inflationSparklineData.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const domainPadding = Math.max((maxValue - minValue) * 0.18, 0.18);
  const lowerBound = minValue - domainPadding;
  const upperBound = maxValue + domainPadding;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="px-3.5 pt-3.5 pb-3 border-b border-gray-100">
        <p className="font-semibold" style={{ fontSize: "0.96rem", color: "#374151" }}>
          Inflation Rate
        </p>
      </div>

      <div className="flex-1 flex flex-col px-3.5 pt-3 pb-0 relative">
        <p className="font-bold leading-none" style={{ fontSize: "2.55rem", color: "#1B2A4A" }}>
          12.8%
        </p>

        <div className="flex items-center gap-1.5 mt-2">
          <span className="font-semibold leading-none" style={{ fontSize: "0.88rem", color: "#1B2A4A" }}>
            ▼
          </span>
          <span className="text-sm" style={{ fontSize: "0.88rem", color: "#6B7280" }}>
            Down from 13.5%
          </span>
        </div>

        <div className="relative mt-2 flex-1 min-h-0" style={{ minHeight: "130px" }}>
          <div className="absolute inset-y-0 -left-3.5 -right-3.5">
            <ResponsiveContainer width="100%" height="100%">
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
          </div>

          <div
            className="absolute bottom-3.5 right-4 rounded-lg border border-slate-100 bg-white px-2 py-1.5 shadow-sm"
            style={{ boxShadow: "0 10px 24px rgba(15, 23, 42, 0.10)" }}
          >
            <span className="text-xs font-semibold" style={{ color: "#475569" }}>
              ▼ -0.7%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
