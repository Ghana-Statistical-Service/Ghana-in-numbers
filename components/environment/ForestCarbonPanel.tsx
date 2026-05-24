"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { carbonRetentionData, forestReserveTop2021 } from "@/data/environmentData";

export default function ForestCarbonPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 3fr", height: "420px" }}>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <p className="text-gray-800 font-bold text-sm">Proportion of Forest Reserves, 2021</p>
              <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                Top regions by forest reserve share, replacing the table with a chart.
              </p>
            </div>
            <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "#ECFDF5", color: "#00723F" }}>
              Regional %
            </span>
          </div>

          <div className="flex-1 min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forestReserveTop2021} layout="vertical" margin={{ top: 12, right: 22, left: 36, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="region" tick={{ fontSize: 10, fill: "#475569", fontWeight: 700 }} tickLine={false} axisLine={false} width={86} />
                  <Tooltip formatter={(value, name) => [name === "change" ? `${Number(value).toFixed(1)} pp` : `${value}%`, name === "change" ? "Change since 1990" : "2021 share"]} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {forestReserveTop2021.map((entry) => (
                      <Cell key={entry.region} fill={entry.change >= 0 ? "#8BD56D" : "#00723F"} />
                    ))}
                    <LabelList dataKey="value" position="right" formatter={(v: unknown) => `${v}%`} style={{ fontSize: 10, fill: "#1B2A4A", fontWeight: 800 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <div className="mb-2">
            <p className="text-gray-800 font-bold text-sm">Carbon Retention</p>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
              Soil and non-soil carbon retained by land-cover category, in million tonnes.
            </p>
          </div>
          <div className="flex-1 min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carbonRetentionData} margin={{ top: 18, right: 16, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="landCover" tick={{ fontSize: 9, fill: "#475569", fontWeight: 700 }} tickLine={false} axisLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  <Legend verticalAlign="top" height={24} iconType="square" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="nonSoil" name="Non-soil" stackId="a" fill="#12AEE3" />
                  <Bar dataKey="soil" name="Soil" stackId="a" fill="#C85017" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
          Forest reserve share shows the proportion of land set aside and protected as forest. Carbon retention shows how much carbon is stored by nature instead of being released as climate-warming gas.
        </p>
      </div>
    </div>
  );
}
