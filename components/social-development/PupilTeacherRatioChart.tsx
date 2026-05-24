"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { pupilTeacherRatioData } from "@/data/socialDevelopmentData";

export default function PupilTeacherRatioChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col h-full">
      <div className="flex items-start justify-between gap-4 mb-2 flex-shrink-0">
        <div>
          <p className="text-gray-800 font-bold text-sm">Pupil to Trained Teacher Ratio</p>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            KG, Primary and JHS historical ratios.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0" style={{ minHeight: "260px" }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pupilTeacherRatioData} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 9, fill: "#64748B" }} tickLine={false} axisLine={false} interval={0} />
              <YAxis hide />
              <Tooltip
                formatter={(value, name) => [value, name === "kg" ? "KG" : name === "primary" ? "Primary" : "JHS"]}
                contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }}
              />
              <Legend verticalAlign="top" height={24} iconType="square" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="kg" name="KG" stackId="a" fill="#8BD5EF">
                <LabelList dataKey="kg" position="center" style={{ fontSize: 9, fill: "#1B2A4A", fontWeight: 800 }} />
              </Bar>
              <Bar dataKey="primary" name="Primary" stackId="a" fill="#147EA0">
                <LabelList dataKey="primary" position="center" style={{ fontSize: 9, fill: "#fff", fontWeight: 800 }} />
              </Bar>
              <Bar dataKey="jhs" name="JHS" stackId="a" fill="#0A4D64" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="jhs" position="center" style={{ fontSize: 9, fill: "#fff", fontWeight: 800 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
