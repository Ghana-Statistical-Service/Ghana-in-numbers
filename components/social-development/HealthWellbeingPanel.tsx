"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { healthInsuranceCoverageData, teenageMotherhoodData } from "@/data/socialDevelopmentData";

export default function HealthWellbeingPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col" style={{ height: "360px" }}>
        <p className="text-gray-800 font-bold text-sm">Health Insurance Coverage</p>
        <p className="text-xs mt-0.5 mb-2" style={{ color: "#94A3B8" }}>
          Historical coverage values from the supplied reference.
        </p>
        <div className="flex-1 min-h-0">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthInsuranceCoverageData} margin={{ top: 20, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }} tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, "Coverage"]} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                <Bar dataKey="value" fill="#5EC5E8" radius={[5, 5, 0, 0]}>
                  <LabelList dataKey="value" position="top" formatter={(v: unknown) => `${v}%`} style={{ fontSize: 10, fill: "#111827", fontWeight: 800 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col" style={{ height: "360px" }}>
        <p className="text-gray-800 font-bold text-sm">Teenage Motherhood (15-19)</p>
        <p className="text-xs mt-0.5 mb-2" style={{ color: "#94A3B8" }}>
          Rural, national and urban trends.
        </p>
        <div className="flex-1 min-h-0">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={teenageMotherhoodData} margin={{ top: 16, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }} tickLine={false} axisLine={false} />
                <YAxis domain={[5, 20]} ticks={[5, 10, 15, 20]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value, name) => [`${value}%`, name === "rural" ? "Rural" : name === "national" ? "National" : "Urban"]} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="rural" name="Rural" stroke="#2DD4BF" strokeWidth={3} strokeDasharray="2 7" dot={false} />
                <Line type="monotone" dataKey="national" name="National" stroke="#2EA7D4" strokeWidth={4} dot={{ r: 5, fill: "#fff", stroke: "#2EA7D4", strokeWidth: 4 }} />
                <Line type="monotone" dataKey="urban" name="Urban" stroke="#9A1B63" strokeWidth={3} strokeDasharray="2 7" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
