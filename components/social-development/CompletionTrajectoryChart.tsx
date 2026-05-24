"use client";

import { useEffect, useState } from "react";
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
import { completionRateData } from "@/data/socialDevelopmentData";

export default function CompletionTrajectoryChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col h-full">
      <div className="flex items-start justify-between gap-4 mb-2 flex-shrink-0">
        <div>
          <p className="text-gray-800 font-bold text-sm">
            Completion Rates{" "}
            <span className="text-gray-400 font-normal">(Primary and JHS)</span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            Tracks progression through the education pipeline.
          </p>
        </div>
        <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "#F0FDFA", color: "#0F766E" }}>
          JHS 86.4%
        </span>
      </div>

      <div className="flex-1 min-h-0" style={{ minHeight: "210px" }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={completionRateData} margin={{ top: 18, right: 18, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis domain={[70, 112]} ticks={[75, 85, 95, 105]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value, name) => [`${value}%`, name === "primary" ? "Primary" : "JHS"]}
                contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }}
              />
              <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="primary" name="Primary" stroke="#F26B2A" strokeWidth={3} dot={{ r: 4, fill: "#fff", stroke: "#F26B2A", strokeWidth: 2.5 }} />
              <Line type="monotone" dataKey="jhs" name="JHS" stroke="#0F5D7E" strokeWidth={3} dot={{ r: 4, fill: "#fff", stroke: "#0F5D7E", strokeWidth: 2.5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
