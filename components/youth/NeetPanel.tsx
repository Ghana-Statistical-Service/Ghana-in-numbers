"use client";

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
  const [showWriteUp, setShowWriteUp] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-0.5">
        <p className="text-xs font-bold" style={{ color: "#382873" }}>
          NEET Rate — Not in Education, Employment or Training (%)
        </p>
        <button
          onClick={() => setShowWriteUp((v) => !v)}
          className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 transition-colors"
          style={{
            background: showWriteUp ? "#EFF6FF" : "#F8FAFC",
            color: showWriteUp ? "#1D4ED8" : "#94A3B8",
            border: "1px solid #E5E7EB",
          }}
        >
          {showWriteUp ? <X size={11} /> : <BookOpen size={11} />}
          {showWriteUp ? "Close" : "Write-up"}
        </button>
      </div>
      <p className="text-xs mb-3" style={{ color: "#6B7280" }}>
        Female and urban youth face the highest rates of disengagement
      </p>

      {showWriteUp && (
        <div
          className="mb-4 p-3 rounded-lg text-xs leading-relaxed"
          style={{ background: "#EFF6FF", color: "#1E40AF" }}
        >
          The NEET indicator — young people <strong>Not in Education, Employment or Training</strong> —
          captures those most at risk of long-term economic exclusion. Nationally,{" "}
          <strong>21.5% of youth aged 15–24</strong> and <strong>19.5% of those aged 15–35</strong> are
          NEET. Females face a significantly higher rate (23.7%, ages 15–24) than males (19.2%),
          reflecting barriers to both labour force participation and educational continuation among young
          women. Contrary to expectations, urban youth (21.8%) have a marginally higher NEET rate than
          rural youth (21.1%), suggesting that urban migration by youth who fail to find work or enrol in
          training is a growing challenge.
        </div>
      )}

      <div style={{ height: 260 }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
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
