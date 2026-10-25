"use client";

import CardExplanation from "@/components/shared/CardExplanation";

import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BrickWall, Bus, Factory, Hotel, Pickaxe, Waves, Wifi, Zap } from "lucide-react";
import {
  foodNonFoodInflationData,
  iipSectorData,
  ppiSectorData,
} from "@/data/businessEconomyData";

interface CpiRaw {
  response: { data: Array<{ key: string[]; values: string[] }> };
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const INFLATION_YEARS = ["2014","2015","2016","2017","2018","2019","2020","2021","2022","2023","2024","2025"];

const ppiIcons = { pickaxe: Pickaxe, factory: Factory, zap: Zap, waves: Waves, crane: BrickWall, bus: Bus, hotel: Hotel, wifi: Wifi };

function ghanaMonthlyBy(raw: CpiRaw, indicator: string, year: string) {
  return MONTH_NAMES.map((_, i) => {
    const key = `${year}M${String(i + 1).padStart(2, "0")}`;
    const item = raw.response.data.find(
      (x) => x.key[0] === indicator && x.key[1] === key && x.key[2] === "Ghana"
    );
    return item ? parseFloat(item.values[0]) : null;
  });
}

function buildChartData(raw: CpiRaw, year: string) {
  const yoyVals = ghanaMonthlyBy(raw, "Year-on-year inflation (%)", year);
  const momVals = ghanaMonthlyBy(raw, "Month-on-month inflation (%)", year);
  return MONTH_NAMES.map((month, i) => ({ month, yoy: yoyVals[i], mom: momVals[i] }));
}

export default function PricesIndustryPanel() {
  const [mounted, setMounted] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [chartData, setChartData] = useState<{ month: string; yoy: number | null; mom: number | null }[]>([]);
  const [cpiLoading, setCpiLoading] = useState(true);
  const cpiCache = useRef<CpiRaw | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetch("/data/cpiData.json")
      .then((r) => r.json())
      .then((d: CpiRaw) => {
        cpiCache.current = d;
        setChartData(buildChartData(d, "2025"));
        setCpiLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!cpiCache.current) return;
    setChartData(buildChartData(cpiCache.current, selectedYear));
  }, [selectedYear]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr", height: "360px" }}>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="min-w-0"><p className="text-gray-800 font-bold text-sm">Monthly Consumer Inflation (2014–2025)</p><CardExplanation indicator="inflation" /></div>
              <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                Year-on-year · {selectedYear}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="text-[10px] font-semibold rounded-full border transition-colors"
                  style={{ padding: "1px 6px", background: "#FEF2ED", color: "#9A3412", borderColor: "#FCA58A", outline: "none" }}
                >
                  {INFLATION_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <span className="rounded-lg px-3 py-2 text-white text-center flex-shrink-0 ml-2" style={{ background: "#8B3A16" }}>
              <span className="block text-[11px] font-bold">2025 annual average</span>
              <span className="block text-xl font-black">14.6%</span>
            </span>
          </div>
          <div className="flex-1 min-h-0">
            {mounted && (
              cpiLoading ? (
                <div className="flex h-full items-center justify-center text-xs" style={{ color: "#9CA3AF" }}>Loading…</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 36, left: -16, bottom: 0 }}>
                    <CartesianGrid stroke="#F1E6E0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="yoy" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#9A3412" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(v: unknown, name: unknown) => [`${v}%`, name as string]}
                      contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }}
                    />
                    <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                    <Line yAxisId="yoy" key={`yoy-${selectedYear}`} type="linear" dataKey="yoy" name="Year-on-year" stroke="#9A3412" strokeWidth={2.5} dot={{ r: 2.5, fill: "#fff", stroke: "#9A3412", strokeWidth: 2 }} activeDot={{ r: 4, fill: "#9A3412" }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              )
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <div className="min-w-0"><p className="text-gray-800 font-bold text-sm">Food and Non-food Inflation: Selected Observations</p><CardExplanation indicator="foodInflation" /></div>
          <div className="flex-1 min-h-0 mt-2">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={foodNonFoodInflationData} margin={{ top: 14, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Line type="linear" dataKey="food" name="Food" stroke="#00A651" strokeWidth={2.5} dot={false} />
                  <Line type="linear" dataKey="nonFood" name="Non-food" stroke="#6B2B24" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-3">Food inflation reached 61.0% in January 2023 versus 47.9% for non-food. By December 2025 these rates were 4.9% and 5.8%. These are dated observations, not annual averages. The publication’s local/imported inflation chart has no labelled numeric series.</p>
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: "3fr 2fr" }}>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4" style={{ minHeight: "360px" }}>
          <div className="min-w-0"><p className="text-gray-800 font-bold text-sm mb-2">Industrial Production Growth by Sector (year-end, %)</p><CardExplanation indicator="iip" /></div>
          <div className="h-[300px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={iipSectorData} margin={{ top: 18, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="sector" tick={{ fontSize: 9, fill: "#64748B", fontWeight: 700 }} tickLine={false} axisLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  <Legend verticalAlign="top" height={24} iconType="square" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="y2023" name="2023" fill="#12AEE3" />
                  <Bar dataKey="y2024" name="2024" fill="#1178BA" />
                  <Bar dataKey="y2025" name="2025" fill="#082B73" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="min-w-0"><p className="text-gray-800 font-bold text-sm mb-3">Producer Price Inflation, End-2025 (%)</p><CardExplanation indicator="ppi" /></div>
          <div className="grid grid-cols-2 gap-2">
            {ppiSectorData.map((item) => {
              const Icon = ppiIcons[item.icon as keyof typeof ppiIcons];
              return (
                <div key={item.sector} className="rounded-xl border border-slate-100 p-3" style={{ background: "#FBFCFE" }}>
                  <div className="flex items-center gap-2">
                    <Icon size={22} style={{ color: item.color }} />
                    <p className="text-xl font-black" style={{ color: "#111827" }}>{item.value}%</p>
                  </div>
                  <p className="mt-1 text-[11px] font-bold leading-tight" style={{ color: "#1B2A4A" }}>{item.sector}</p><CardExplanation indicator="ppi" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
