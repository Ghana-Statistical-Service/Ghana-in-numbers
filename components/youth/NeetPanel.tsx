"use client";

import CardExplanation from "@/components/shared/CardExplanation";


import { useEffect, useState } from "react";
import { BookOpen, X } from "lucide-react";
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
import { neetData } from "@/data/youthBulgeData";

export default function NeetPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-0.5">
        <p className="text-xs font-bold" style={{ color: "#382873" }}>
          NEET Rate — Not in Education, Employment or Training (%)
        </p>
        <CardExplanation indicator="neet" />
      </div>
      <p className="text-xs mb-3" style={{ color: "#6B7280" }}>
        Female and urban youth face the highest rates of disengagement
      </p>




      <div style={{ height: 260 }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 1, height: 1 }}>
            <BarChart
              data={neetData}
              margin={{ top: 20, right: 20, left: -16, bottom: 4 }}
              barCategoryGap="30%"
              barGap={4}
            >
              <CartesianGrid stroke="#F1F5F9" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="group"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 30]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v: unknown, name) => [`${v}%`, String(name ?? "")]}
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" iconSize={8} />
              <Bar dataKey="rate1535" name="Ages 15–35" fill="#382873" radius={[3, 3, 0, 0]}>
                <LabelList
                  dataKey="rate1535"
                  position="top"
                  formatter={(v: unknown) => `${v}%`}
                  style={{ fontSize: 10, fontWeight: 700, fill: "#382873" }}
                />
              </Bar>
              <Bar dataKey="rate1524" name="Ages 15–24" fill="#17B8A6" radius={[3, 3, 0, 0]}>
                <LabelList
                  dataKey="rate1524"
                  position="top"
                  formatter={(v: unknown) => `${v}%`}
                  style={{ fontSize: 10, fontWeight: 700, fill: "#17B8A6" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
