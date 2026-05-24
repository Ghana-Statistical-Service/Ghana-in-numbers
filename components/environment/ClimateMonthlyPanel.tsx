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
import { CloudRain, ThermometerSun } from "lucide-react";
import { monthlyRainfall2024, monthlyTemperature2024 } from "@/data/environmentData";

export default function ClimateMonthlyPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col" style={{ height: "400px" }}>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <p className="text-gray-800 font-bold text-sm">Monthly Average Rainfall</p>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
              2024 rainfall compared with the 2020-2023 reference pattern.
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "#E0F7FE", color: "#12AEE3" }}>
            <CloudRain size={22} />
          </div>
        </div>
        <div className="flex-1 min-h-0">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRainfall2024} margin={{ top: 20, right: 14, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#111827", fontWeight: 800 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(v) => `${v}`} tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value, name) => [`${value} mm`, name === "value" ? "2024" : "2020-2023"]} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="historic" name="2020-2023" stroke="#D7D7D7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="value" name="2024" stroke="#12AEE3" strokeWidth={4} dot={{ r: 4, fill: "#fff", stroke: "#12AEE3", strokeWidth: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col" style={{ height: "400px" }}>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <p className="text-gray-800 font-bold text-sm">Monthly Average Temperature</p>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
              2024 temperature compared with the 2020-2023 reference pattern.
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "#FEE2E2", color: "#CC0000" }}>
            <ThermometerSun size={22} />
          </div>
        </div>
        <div className="flex-1 min-h-0">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTemperature2024} margin={{ top: 20, right: 14, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#111827", fontWeight: 800 }} tickLine={false} axisLine={false} />
                <YAxis domain={[24, 32]} tickFormatter={(v) => `${v}°`} tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value, name) => [`${value}°C`, name === "value" ? "2024" : "2020-2023"]} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="historic" name="2020-2023" stroke="#D7D7D7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="value" name="2024" stroke="#CC0000" strokeWidth={4} dot={{ r: 4, fill: "#fff", stroke: "#CC0000", strokeWidth: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
