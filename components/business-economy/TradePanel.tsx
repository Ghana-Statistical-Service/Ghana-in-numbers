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
import { Car, Droplets, Fuel, Gem, Package, Wheat } from "lucide-react";
import {
  topExports2025,
  topImports2025,
  tradeGoodsData,
  tradePartnerRegions,
} from "@/data/businessEconomyData";

const exportIcons = [Gem, Wheat, Fuel, Package, Wheat];
const importIcons = [Droplets, Fuel, Car, Fuel, Package];

export default function TradePanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4" style={{ height: "390px" }}>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <p className="text-gray-800 font-bold text-sm">Total Trade of Goods</p>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
              Exports, imports and trade balance in billions.
            </p>
          </div>
          <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "#ECFDF5", color: "#16A34A" }}>
            2025 surplus: 148.3bn
          </span>
        </div>
        <div className="h-[315px]">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tradeGoodsData} margin={{ top: 18, right: 18, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="balance" name="Trade Balance" fill="#C7DCF4" radius={[3, 3, 0, 0]} />
                <Line type="monotone" dataKey="export" name="Export" stroke="#6DBE45" strokeWidth={3} strokeDasharray="8 6" dot={{ r: 4, fill: "#fff", stroke: "#6DBE45", strokeWidth: 3 }} />
                <Line type="monotone" dataKey="import" name="Import" stroke="#2E8BFF" strokeWidth={3} strokeDasharray="2 7" dot={{ r: 4, fill: "#fff", stroke: "#2E8BFF", strokeWidth: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {[{ title: "Top 5 Exports", data: topExports2025, icons: exportIcons, color: "#2E8BFF" }, { title: "Top 5 Imports", data: topImports2025, icons: importIcons, color: "#00A651" }].map((group) => (
          <div key={group.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-gray-800 font-bold text-sm mb-3">{group.title}</p>
            <div className="grid grid-cols-5 gap-2">
              {group.data.map((item, index) => {
                const Icon = group.icons[index];
                return (
                  <div key={item.name} className="rounded-xl border border-slate-100 p-3 text-center" style={{ background: "#FBFCFE" }}>
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full" style={{ background: `${item.color}1F`, color: item.color }}>
                      <Icon size={21} />
                    </div>
                    <p className="mt-2 text-[11px] font-bold leading-tight" style={{ color: "#1B2A4A" }}>{item.name}</p>
                    <p className="mt-1 text-sm font-black" style={{ color: group.color }}>{item.share}%</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-gray-800 font-bold text-sm mb-3">Top 10 Trade Partners by Region</p>
        <div className="grid grid-cols-4 gap-3">
          {tradePartnerRegions.map((region) => (
            <div key={region.region} className="rounded-xl border border-slate-100 p-3" style={{ background: "#FBFCFE" }}>
              <p className="text-xs font-bold" style={{ color: "#1B2A4A" }}>{region.region}</p>
              <div className="mt-3 space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold" style={{ color: "#64748B" }}><span>Export</span><span>{region.export}%</span></div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full" style={{ width: `${region.export}%`, background: region.color }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-semibold" style={{ color: "#64748B" }}><span>Import</span><span>{region.import}%</span></div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full" style={{ width: `${region.import}%`, background: region.color }} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
