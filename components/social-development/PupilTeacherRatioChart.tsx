"use client";

import CardExplanation from "@/components/shared/CardExplanation";

import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
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
          <div className="min-w-0"><p className="text-gray-800 font-bold text-sm">Pupil to Trained Teacher Ratio</p><CardExplanation indicator="teachers" /></div>

        </div>
      </div>

      <div className="flex-1 min-h-0" style={{ minHeight: "260px" }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pupilTeacherRatioData} margin={{ top: 12, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 9, fill: "#64748B" }} tickLine={false} axisLine={false} interval={0} />
              <YAxis domain={[0, 110]} tick={{ fontSize: 10 }} width={36} />
              <Tooltip
                formatter={(value, name) => [`${value} pupils per trained teacher`, name]}
                contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }}
              />
              <Legend verticalAlign="top" height={24} iconType="square" wrapperStyle={{ fontSize: 11 }} />
              <Line dataKey="kg" name="KG" stroke="#0EA5E9" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line dataKey="primary" name="Primary" stroke="#147EA0" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line dataKey="jhs" name="JHS" stroke="#0A4D64" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
