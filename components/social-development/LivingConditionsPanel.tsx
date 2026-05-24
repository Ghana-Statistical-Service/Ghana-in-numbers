"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  drinkingWaterData,
  electricityAccessData,
  housingDeficitData,
  improvedToiletUseData,
} from "@/data/socialDevelopmentData";

function UtilityBars({ data, color, title }: { data: { year: string; value: number }[]; color: string; title: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="rounded-xl border border-slate-100 p-3" style={{ background: "#FBFCFE" }}>
      <p className="text-sm font-bold mb-2" style={{ color }}>{title}</p>
      <div className="h-40">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 18, right: 4, left: 0, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fontSize: 9, fill: "#64748B" }} tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, title]} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="center" formatter={(v: unknown) => `${v}%`} style={{ fontSize: 10, fill: "#111827", fontWeight: 800 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default function LivingConditionsPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4" style={{ height: "420px" }}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-gray-800 font-bold text-sm">Housing Deficits</p>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
              Population, housing demand, supply and deficit.
            </p>
          </div>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "#FFF1F2", color: "#DC2626" }}>
            1.81M deficit in 2021
          </span>
        </div>
        <div className="h-[335px]">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={housingDeficitData} margin={{ top: 16, right: 18, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="housingSupply" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8FD14F" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#8FD14F" stopOpacity={0.65} />
                  </linearGradient>
                  <linearGradient id="housingDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FB7185" stopOpacity={0.78} />
                    <stop offset="100%" stopColor="#FB7185" stopOpacity={0.48} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#00A3FF" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Area yAxisId="right" type="monotone" dataKey="supply" name="Housing Supply" stroke="#8FD14F" fill="url(#housingSupply)" strokeWidth={2} />
                <Area yAxisId="right" type="monotone" dataKey="demand" name="Housing Demand" stroke="#0EA5E9" fill="url(#housingDemand)" strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="population" name="Population" stroke="#082B73" strokeWidth={3} dot={{ r: 4, fill: "#fff", stroke: "#082B73", strokeWidth: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="deficit" name="Housing Deficit" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 4, fill: "#fff", stroke: "#EF4444", strokeWidth: 2.5 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-gray-800 font-bold text-sm mb-3">Utilities</p>
        <div className="grid grid-cols-3 gap-4">
          <UtilityBars data={electricityAccessData} color="#F6B800" title="Access to electricity" />
          <UtilityBars data={drinkingWaterData} color="#12AEE3" title="Improved drinking water" />
          <div className="rounded-xl border border-slate-100 p-4 flex flex-col justify-center" style={{ background: "#FBFCFE" }}>
            <p className="text-sm font-bold" style={{ color: "#238313" }}>Use of improved household toilet</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {improvedToiletUseData.map((item) => (
                <div key={item.year} className="rounded-xl bg-white border border-slate-100 p-3 text-center">
                  <p className="text-2xl font-light" style={{ color: "#111827" }}>{item.year}</p>
                  <p className="mt-2 text-4xl font-black leading-none" style={{ color: "#238313" }}>{item.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
