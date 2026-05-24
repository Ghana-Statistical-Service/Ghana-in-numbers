"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { coastalDebrisData, urbanSlums } from "@/data/sdgData";
import GhanaSlumMap from "./GhanaSlumMap";

export default function CitiesEnvironmentPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-4">
      {/* SDG 11 — Urban Slums */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-bold mb-0.5" style={{ color: "#1D4ED8" }}>
          SDG 11, Indicator 11.1.1 – Urban population in slums or informal settlements
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Real SVG map */}
          <div className="min-h-[320px] flex flex-col">
            <GhanaSlumMap />
          </div>

          {/* Stat block */}
          <div className="flex flex-col justify-center gap-4">
            <div>
              <p className="text-3xl font-black text-gray-800">
                {urbanSlums.householdPct}%{" "}
                <span className="text-lg font-bold text-gray-500">
                  ({urbanSlums.householdCount.toLocaleString()})
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">Households living in slums</p>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Of the{" "}
                <span className="font-semibold text-gray-800">
                  {urbanSlums.urbanPopMillions} million
                </span>{" "}
                people who live in urban areas ~{" "}
                <span className="font-black text-lg" style={{ color: "#DC2626" }}>
                  {urbanSlums.urbanSlumPct}%
                </span>{" "}
                are found in slums
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SDG 14 — Coastal Eutrophication */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-bold mb-0.5" style={{ color: "#1D4ED8" }}>
          SDG 14, Indicator 14.1.1 – Coastal eutrophication and plastic debris density
        </p>
        <div style={{ height: 260 }}>
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={coastalDebrisData}
                margin={{ top: 28, right: 20, left: 20, bottom: 4 }}
              >
                <CartesianGrid stroke="#F1F5F9" strokeDasharray="4 4" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: "#6B7280", fontWeight: 700 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  label={{
                    value: "Millions",
                    angle: -90,
                    position: "insideLeft",
                    offset: -8,
                    style: { fontSize: 11, fill: "#94A3B8" },
                  }}
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(v: unknown) => [`${v}M`, "Plastic debris / eutrophication"]}
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {coastalDebrisData.map((entry) => (
                    <Cell
                      key={entry.year}
                      fill={entry.value === Math.max(...coastalDebrisData.map((d) => d.value)) ? "#3B82F6" : "#93C5FD"}
                    />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    style={{ fontSize: 11, fontWeight: 700, fill: "#1D4ED8" }}
                    formatter={(v: unknown) => `${v}`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
