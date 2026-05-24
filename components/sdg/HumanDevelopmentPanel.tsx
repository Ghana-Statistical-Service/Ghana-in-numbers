"use client";

import { useEffect, useState } from "react";
import {
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  foodInsecurityData,
  maternalMortality,
  neonatalMortality,
  povertyData,
  underFiveMortality,
} from "@/data/sdgData";

export default function HumanDevelopmentPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-4">
      {/* SDG 1 — Poverty */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-bold text-center mb-0.5" style={{ color: "#9B1C1C" }}>
          SDG 1, Indicator 1.1 – Poverty
        </p>
        <p className="text-xs text-center mb-4" style={{ color: "#6B7280" }}>
          The proportion of the population that are Multidimensionally poor
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {povertyData.map((d) => (
            <div
              key={d.year}
              className="rounded-xl p-4 text-center flex flex-col items-center gap-1"
              style={{ background: "#9B1C1C" }}
            >
              <span className="text-white font-black text-3xl">{d.value}%</span>
              <span className="text-white/70 text-sm font-medium">{d.year}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SDG 2 — Food Insecurity */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-bold text-center mb-0.5" style={{ color: "#9B1C1C" }}>
          SDG 2, Indicator 2.1.2 – Food Insecurity (FIES)
        </p>
        <p className="text-xs text-center mb-3" style={{ color: "#6B7280" }}>
          Food Insecure Population (Millions)
        </p>
        <div style={{ height: 170 }}>
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={foodInsecurityData} margin={{ top: 20, right: 20, left: -32, bottom: 4 }}>
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide domain={["auto", "auto"]} />
                <Tooltip
                  formatter={(v: unknown) => [`${v}M`, "Food Insecure Population"]}
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#DC2626"
                  strokeWidth={2}
                  dot={{ r: 5, fill: "#DC2626", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7, fill: "#DC2626", stroke: "#fff", strokeWidth: 2 }}
                >
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(v: unknown) => `${v}`}
                    style={{ fontSize: 12, fontWeight: 700, fill: "#DC2626" }}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* SDG 3 — Mortality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Maternal + Under-Five */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-bold text-center mb-4" style={{ color: "#9B1C1C" }}>
            SDG 3, Indicator 3.1.1 – Maternal &amp; Child Mortality
          </p>
          <div className="space-y-4">
            {/* Maternal Mortality */}
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: "#DC2626" }}>
                Maternal Mortality Ratio
              </p>
              <div className="flex items-center gap-4">
                <span className="text-7xl leading-none flex-shrink-0" aria-hidden>🤰</span>
                <div className="flex items-end gap-6">
                  {maternalMortality.map((d) => (
                    <div key={d.year} className="flex flex-col items-center gap-0.5">
                      <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>{d.year}</span>
                      <span className="font-black text-4xl" style={{ color: "#DC2626" }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>Per 100,000 live births</p>
            </div>

            <div className="border-t border-gray-100" />

            {/* Under-Five Mortality */}
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: "#DC2626" }}>
                Under Five Mortality Rate
              </p>
              <div className="flex items-center gap-4">
                <span className="text-7xl leading-none flex-shrink-0" aria-hidden>👶</span>
                <div className="flex items-end gap-6">
                  {underFiveMortality.map((d) => (
                    <div key={d.year} className="flex flex-col items-center gap-0.5">
                      <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>{d.year}</span>
                      <span className="font-black text-4xl" style={{ color: "#DC2626" }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>Per 1,000 live births</p>
            </div>
          </div>
        </div>

        {/* Neonatal Mortality */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-col items-center gap-1 mb-1">
            <span className="text-7xl leading-none" aria-hidden>🍼</span>
            <p className="text-xs font-bold" style={{ color: "#DC2626" }}>Neonatal mortality rate</p>
          </div>
          <p className="text-[11px] text-center mb-3" style={{ color: "#94A3B8" }}>
            Per 1,000 live births
          </p>
          <div style={{ height: 200 }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={neonatalMortality} margin={{ top: 20, right: 20, left: -32, bottom: 4 }}>
                  <XAxis
                    dataKey="survey"
                    tick={{ fontSize: 9, fill: "#6B7280" }}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                  />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    formatter={(v: unknown) => [`${v}`, "Neonatal mortality rate"]}
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#DC2626"
                    strokeWidth={2}
                    dot={{ r: 5, fill: "#DC2626", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7, fill: "#DC2626", stroke: "#fff", strokeWidth: 2 }}
                  >
                    <LabelList
                      dataKey="value"
                      position="top"
                      style={{ fontSize: 12, fontWeight: 700, fill: "#DC2626" }}
                    />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
