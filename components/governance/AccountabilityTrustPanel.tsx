"use client";

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
import { Gift, Vote } from "lucide-react";
import { giftsToOfficialsData, noInfluenceData, noSayData, rightToVoteKnowledge } from "@/data/governanceData";

export default function AccountabilityTrustPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: "3fr 2fr", height: "340px" }}>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="text-gray-800 font-bold text-sm">Giving Gifts to Public Officials</p>
              <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                Reported share giving gifts to public officials.
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "#EEF2FF", color: "#082B73" }}>
              <Gift size={21} />
            </div>
          </div>
          <div className="flex-1 min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={giftsToOfficialsData} margin={{ top: 20, right: 10, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#64748B", fontWeight: 800 }} tickLine={false} axisLine={false} />
                  <YAxis hide domain={[0, 65]} />
                  <Tooltip formatter={(value) => [`${value}%`, "Share"]} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  <Bar dataKey="value" fill="#082B73" radius={[5, 5, 0, 0]}>
                    <LabelList dataKey="value" position="insideTop" formatter={(v: unknown) => `${v}%`} style={{ fontSize: 14, fill: "#fff", fontWeight: 900 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl" style={{ background: "#ECFDF5", color: "#009B4E" }}>
              <Vote size={44} />
            </div>
            <p className="text-gray-800 font-bold text-sm">{rightToVoteKnowledge.label}</p>
            <p className="mt-2 font-black leading-none" style={{ fontSize: "4.25rem", color: "#285F18" }}>
              {rightToVoteKnowledge.value}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="mb-3">
          <p className="text-gray-800 font-bold text-sm">Public Perception on Inclusive and Responsive Decision-Making</p>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            No say in decision-making and no influence on responsiveness.
          </p>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: "3fr 2fr" }}>
          <div className="rounded-xl border border-slate-100 p-3" style={{ background: "#FBFCFE", height: "260px" }}>
            <p className="text-2xl font-light mb-1" style={{ color: "#111827" }}>No say</p>
            {mounted && (
              <ResponsiveContainer width="100%" height="82%">
                <BarChart data={noSayData} margin={{ top: 20, right: 8, left: -16, bottom: 0 }}>
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#111827", fontWeight: 800 }} tickLine={false} axisLine={false} />
                  <YAxis hide domain={[0, 70]} />
                  <Tooltip formatter={(value) => [`${value}%`, "No inclusiveness in decision making"]} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  <Bar dataKey="value" fill="#C85017" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="value" position="insideTop" formatter={(v: unknown) => `${v}%`} style={{ fontSize: 13, fill: "#fff", fontWeight: 900 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            <p className="text-xs" style={{ color: "#64748B" }}>No inclusiveness in decision making</p>
          </div>

          <div className="rounded-xl border border-slate-100 p-3" style={{ background: "#FBFCFE", height: "260px" }}>
            <p className="text-2xl font-light mb-1" style={{ color: "#111827" }}>No influence</p>
            {mounted && (
              <ResponsiveContainer width="100%" height="82%">
                <BarChart data={noInfluenceData} margin={{ top: 20, right: 8, left: -16, bottom: 0 }}>
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#111827", fontWeight: 800 }} tickLine={false} axisLine={false} />
                  <YAxis hide domain={[0, 55]} />
                  <Tooltip formatter={(value) => [`${value}%`, "Non-governance responsiveness"]} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  <Bar dataKey="value" fill="#CC0000" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="value" position="insideTop" formatter={(v: unknown) => `${v}%`} style={{ fontSize: 13, fill: "#fff", fontWeight: 900 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            <p className="text-xs" style={{ color: "#64748B" }}>Non-governance responsiveness</p>
          </div>
        </div>
      </div>
    </div>
  );
}
