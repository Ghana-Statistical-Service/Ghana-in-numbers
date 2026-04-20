"use client";

import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { inflationSparklineData } from "@/data/dummy";

export default function InflationSparkline() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full">
      <p className="text-gray-700 font-semibold text-sm mb-3">Inflation Rate</p>

      <p className="font-bold leading-none" style={{ fontSize: "2.8rem", color: "#1B2A4A" }}>
        12.8%
      </p>

      <div className="flex items-center gap-1 mt-2 mb-4">
        <span className="text-gray-500 text-sm">▼</span>
        <span className="text-gray-500 text-xs">Down from 13.5%</span>
      </div>

      <div className="flex-1 min-h-0" style={{ minHeight: "80px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={inflationSparklineData}
            margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
          >
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <YAxis domain={[12.4, 14.2]} hide />
            <Tooltip
              formatter={(value) => [`${value}%`, "Inflation"]}
              contentStyle={{
                fontSize: "11px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2.5}
              fill="url(#waveGrad)"
              dot={false}
              activeDot={{ r: 5, fill: "#3B82F6", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-end mt-2">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded"
          style={{ background: "#EFF6FF", color: "#3B82F6" }}
        >
          ▼ -0.7%
        </span>
      </div>
    </div>
  );
}
