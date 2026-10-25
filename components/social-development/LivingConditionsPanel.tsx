"use client";

import CardExplanation from "@/components/shared/CardExplanation";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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
      <CardExplanation indicator={title === "Access to electricity" ? "electricity" : "water"} />
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
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4" style={{ minHeight: "420px" }}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="min-w-0"><p className="text-gray-800 font-bold text-sm">Housing Deficits</p><CardExplanation indicator="housing" /></div>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
              Estimated shortfall in dwelling units, in millions; 2010 ≈2.8M, 2021 ≈1.8M (pp. 32–33).
            </p>
          </div>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "#FFF1F2", color: "#DC2626" }}>
            1.81M deficit in 2021
          </span>
        </div>
        <div className="h-[335px]">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={housingDeficitData} margin={{ top: 24, right: 18, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 3.2]} unit="M" />
                <Tooltip formatter={(v) => [`${v} million dwelling units`, "Estimated deficit"]} />
                <Bar dataKey="deficit" name="Estimated housing deficit" fill="#EF4444" radius={[5, 5, 0, 0]}>
                  <LabelList dataKey="deficit" position="top" formatter={(v: unknown) => `${v}M`} />
                </Bar>
              </BarChart>
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
            <div className="min-w-0"><p className="text-sm font-bold" style={{ color: "#238313" }}>Use of improved household toilet</p><CardExplanation indicator="toilet" /></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {improvedToiletUseData.map((item) => (
                <div key={item.year} className="rounded-xl bg-white border border-slate-100 p-3 text-center">
                  <p className="text-2xl font-light" style={{ color: "#111827" }}>{item.year}</p>
                  <p className="mt-2 text-4xl font-black leading-none" style={{ color: "#238313" }}>{item.value}%</p><CardExplanation indicator="toilet" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
