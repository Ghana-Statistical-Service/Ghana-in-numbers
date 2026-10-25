"use client";

import CardExplanation from "@/components/shared/CardExplanation";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { womenJudgesData, womenParliamentData } from "@/data/governanceData";

export default function WomenLeadershipPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4" style={{ minHeight: "390px" }}>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <div className="min-w-0"><p className="text-gray-800 font-bold text-sm">Women Representation in Parliament</p><CardExplanation indicator="parliament" /></div>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
              Share of seats held by women across parliamentary terms.
            </p>
          </div>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "#ECFDF5", color: "#00723F" }}>
            14.9% in 2025
          </span>
        </div>

        <div className="h-[315px]">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={womenParliamentData} margin={{ top: 24, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="year"
                  tickFormatter={(_, index) => {
                    const item = womenParliamentData[index];
                    return `${item.year} (${item.parliament})`;
                  }}
                  tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis hide domain={[0, 18]} />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Women representation"]}
                  labelFormatter={(_, payload) => {
                    const item = payload?.[0]?.payload;
                    return item ? `${item.year} (${item.parliament})` : "";
                  }}
                  contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }}
                />
                <Bar dataKey="value" radius={[32, 32, 32, 32]}>
                  {womenParliamentData.map((entry) => (
                    <Cell key={entry.year} fill="#00723F" />
                  ))}
                  <LabelList dataKey="value" position="center" formatter={(v: unknown) => `${v}%`} style={{ fontSize: 13, fill: "#fff", fontWeight: 900 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4" style={{ minHeight: "430px" }}>
        <div className="mb-2">
          <p className="text-gray-800 font-bold text-sm">Percentage of Women Judges</p><CardExplanation indicator="judges" />
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            Supreme Court, Court of Appeal and High Court representation.
          </p>
        </div>

        <div className="h-[360px]">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={womenJudgesData} margin={{ top: 24, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 9 }} interval={0} />
                <YAxis domain={[0, 60]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} width={35} />
                <Tooltip formatter={(v, n) => [`${v}%`, n]} />
                <Legend verticalAlign="top" height={24} wrapperStyle={{ fontSize: 11 }} />
                <Line dataKey="supreme" name="Supreme Court" stroke="#CC0000" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line dataKey="appeal" name="Court of Appeal" stroke="#010101" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line dataKey="high" name="High Court" stroke="#12AEE3" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
