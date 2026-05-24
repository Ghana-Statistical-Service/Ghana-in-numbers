"use client";

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
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  nominalGdpData,
  nominalGdpPerCapitaData,
  realGdpData,
  sectorShare2025,
} from "@/data/businessEconomyData";

export default function GDPStructurePanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: "3fr 2fr", height: "380px" }}>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <div className="mb-2">
            <p className="text-gray-800 font-bold text-sm">Overall GDP (Nominal)</p>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
              Overall GDP and non-oil nominal GDP in billion Ghana cedis.
            </p>
          </div>
          <div className="flex-1 min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={nominalGdpData} margin={{ top: 18, right: 18, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="overall" name="Overall GDP" stroke="#00A3FF" strokeWidth={3} dot={{ r: 3, fill: "#fff", stroke: "#00A3FF", strokeWidth: 2.5 }} />
                  <Line type="monotone" dataKey="nonOil" name="Non-oil" stroke="#111827" strokeWidth={2.5} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <p className="text-gray-800 font-bold text-sm">Sectoral Share of Nominal GDP, 2025</p>
          <div className="flex-1 min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sectorShare2025} innerRadius={62} outerRadius={105} paddingAngle={1} dataKey="value" nameKey="name">
                    {sectorShare2025.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Share"]} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "2fr 3fr", height: "360px" }}>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <p className="text-gray-800 font-bold text-sm">Nominal GDP per Capita</p>
          <div className="flex-1 min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nominalGdpPerCapitaData} margin={{ top: 20, right: 8, left: -16, bottom: 0 }}>
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(value) => [`GH¢ ${Number(value).toLocaleString()}`, "GDP per capita"]} contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  <Bar dataKey="value" fill="#F8E5D4" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="value" position="insideBottom" formatter={(v: unknown) => Number(v).toLocaleString()} style={{ fontSize: 9, fill: "#9A4D0A", fontWeight: 800 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <p className="text-gray-800 font-bold text-sm">Real GDP and Growth Rate</p>
          <div className="flex-1 min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={realGdpData} margin={{ top: 20, right: 18, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#16A34A" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Bar yAxisId="right" dataKey="growth" name="Real GDP growth rate" fill="#CFFAD1" radius={[3, 3, 0, 0]} />
                  <Line yAxisId="left" type="monotone" dataKey="real" name="Real GDP" stroke="#006FC9" strokeWidth={3} dot={{ r: 4, fill: "#fff", stroke: "#006FC9", strokeWidth: 2.5 }} />
                  <Line yAxisId="left" type="monotone" dataKey="nonOil" name="Non-oil" stroke="#111827" strokeWidth={2.5} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
