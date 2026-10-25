"use client";

import CardExplanation from "@/components/shared/CardExplanation";


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


export default function UrbanRuralChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
          <CardExplanation indicator="urban" />
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


    </>
  );
}
