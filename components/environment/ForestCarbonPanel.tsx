"use client";

import CardExplanation from "@/components/shared/CardExplanation";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { carbonRetentionData, forestReserveArea2025, forestReserveTotal2025 } from "@/data/environmentData";

export default function ForestCarbonPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="min-w-0"><h3 className="font-bold text-sm text-slate-800">Forest Reserve Area, December 2025</h3><CardExplanation indicator="forest" /></div>
          <p className="text-xs text-slate-500 mt-1">Reported national total: {forestReserveTotal2025.toLocaleString()} km². Source: Forestry Commission, p. 96.</p>
          <div className="h-[440px] mt-3">
            {mounted && <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forestReserveArea2025} layout="vertical" margin={{ left: 15, right: 20 }}>
                <CartesianGrid stroke="#EEF2F7" horizontal={false} />
                <XAxis type="number" unit=" km²" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="region" width={95} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} km²`, "Forest reserve area"]} />
                <Bar dataKey="area" fill="#00A651" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>}
          </div>

        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="min-w-0"><h3 className="font-bold text-sm text-slate-800">Carbon Retention, 2021</h3><CardExplanation indicator="carbon" /></div>
          <p className="text-xs text-slate-500 mt-1">Stored soil and non-soil carbon, million tonnes of carbon (Mt C).</p>
          <div className="h-[440px] mt-3">
            {mounted && <ResponsiveContainer width="100%" height="100%">
              <BarChart data={carbonRetentionData} margin={{ top: 15, bottom: 55, left: -10 }}>
                <CartesianGrid stroke="#EEF2F7" vertical={false} />
                <XAxis dataKey="landCover" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v, n) => [`${v} Mt C`, n]} />
                <Legend verticalAlign="top" />
                <Bar dataKey="nonSoil" name="Non-soil" stackId="carbon" fill="#12AEE3" />
                <Bar dataKey="soil" name="Soil" stackId="carbon" fill="#C85017" />
              </BarChart>
            </ResponsiveContainer>}
          </div>

        </div>
      </div>
    </div>
  );
}
