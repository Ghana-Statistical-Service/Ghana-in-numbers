"use client";

import { useEffect, useState } from "react";
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
import { carbonRetentionData, forestReserveData, forestReserveYears } from "@/data/environmentData";

// --- colour palette (16 distinct hues) ---
const COLORS: Record<string, string> = {
  "Ahafo":         "#16A34A",
  "Ashanti":       "#2563EB",
  "Bono":          "#DC2626",
  "Bono East":     "#9333EA",
  "Central":       "#EA580C",
  "Eastern":       "#0891B2",
  "Greater Accra": "#DB2777",
  "Northern":      "#65A30D",
  "North East":    "#D97706",
  "Oti":           "#0F766E",
  "Savannah":      "#7C3AED",
  "Upper East":    "#B91C1C",
  "Upper West":    "#1D4ED8",
  "Volta":         "#059669",
  "Western":       "#92400E",
  "Western North": "#374151",
};

type WideRow = Record<string, string | number>;

const CHART_DATA: WideRow[] = forestReserveYears.map((yr) => {
  const key = `y${yr}` as keyof (typeof forestReserveData)[0];
  const row: WideRow = { year: yr };
  forestReserveData.forEach((r) => { row[r.region] = r[key] as number; });
  return row;
});

const REGIONS = forestReserveData.map((r) => r.region);

type TooltipEntry = { dataKey?: string | number; value?: number };

function ForestTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const sorted = [...payload]
    .filter((p) => p.value !== undefined)
    .sort((a, b) => (b.value as number) - (a.value as number));

  return (
    <div
      className="rounded-xl shadow-xl border border-gray-100 bg-white overflow-hidden"
      style={{ minWidth: 180, maxHeight: 340, overflowY: "auto" }}
    >
      <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
        <span className="text-xs font-bold text-gray-700">{label}</span>
      </div>
      <div className="px-3 py-2 space-y-1">
        {sorted.map((p) => (
          <div key={String(p.dataKey)} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: COLORS[String(p.dataKey)] ?? "#999" }}
              />
              <span className="text-[11px] text-gray-600 truncate">{p.dataKey}</span>
            </div>
            <span className="text-[11px] font-semibold tabular-nums text-gray-800">
              {(p.value as number).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ForestCarbonPanel() {
  const [mounted, setMounted] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [hiddenRegions, setHiddenRegions] = useState<Set<string>>(new Set());

  useEffect(() => setMounted(true), []);

  const toggleRegion = (region: string) => {
    setHiddenRegions((prev) => {
      const next = new Set(prev);
      next.has(region) ? next.delete(region) : next.add(region);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Side-by-side row */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4" style={{ minHeight: 460 }}>

        {/* Forest reserve multi-line chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-gray-800 font-bold text-sm">
                Proportion of Forest Reserves, 1990–2021
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                All 16 regions — hover for values, click legend to hide/show.
              </p>
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-bold flex-shrink-0"
              style={{ background: "#ECFDF5", color: "#00723F" }}
            >
              % of land
            </span>
          </div>

          {/* Chart area */}
          <div className="flex-1 min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={CHART_DATA}
                  margin={{ top: 8, right: 16, left: -8, bottom: 4 }}
                  onMouseLeave={() => setActiveRegion(null)}
                >
                  <CartesianGrid stroke="#F1F5F9" strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11, fill: "#94A3B8" }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content={(props: any) => <ForestTooltip {...props} />}
                    cursor={{ stroke: "#E2E8F0", strokeWidth: 1.5 }}
                  />
                  {REGIONS.map((region) => {
                    const isHidden = hiddenRegions.has(region);
                    const isActive = activeRegion === region;
                    const isDimmed = activeRegion !== null && !isActive;
                    return (
                      <Line
                        key={region}
                        type="monotone"
                        dataKey={region}
                        stroke={COLORS[region]}
                        strokeWidth={isActive ? 2.5 : 1.5}
                        strokeOpacity={isHidden ? 0 : isDimmed ? 0.12 : 1}
                        dot={false}
                        activeDot={
                          isHidden
                            ? false
                            : { r: 4, fill: COLORS[region], strokeWidth: 2, stroke: "#fff" }
                        }
                        hide={false}
                        onMouseEnter={() => setActiveRegion(region)}
                        onMouseLeave={() => setActiveRegion(null)}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Custom legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 pt-3 border-t border-gray-100">
            {REGIONS.map((region) => {
              const isHidden = hiddenRegions.has(region);
              return (
                <button
                  key={region}
                  onClick={() => toggleRegion(region)}
                  onMouseEnter={() => setActiveRegion(region)}
                  onMouseLeave={() => setActiveRegion(null)}
                  className="flex items-center gap-1.5 transition-opacity"
                  style={{ opacity: isHidden ? 0.35 : 1 }}
                >
                  <span
                    className="w-3 h-0.5 flex-shrink-0 rounded-full inline-block"
                    style={{ background: COLORS[region] }}
                  />
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: isHidden ? "#94A3B8" : "#475569" }}
                  >
                    {region}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Carbon Retention */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <div className="mb-2">
            <p className="text-gray-800 font-bold text-sm">Carbon Retention</p>
            <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
              Soil and non-soil carbon stored by land-cover type, million tonnes.
            </p>
          </div>
          <div className="flex-1 min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={carbonRetentionData}
                  margin={{ top: 18, right: 16, left: -12, bottom: 0 }}
                >
                  <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="landCover"
                    tick={{ fontSize: 9, fill: "#475569", fontWeight: 700 }}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }}
                  />
                  <Legend verticalAlign="top" height={24} iconType="square" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="nonSoil" name="Non-soil" stackId="a" fill="#12AEE3" />
                  <Bar dataKey="soil" name="Soil" stackId="a" fill="#C85017" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Footnote */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
          Forest reserve share shows the proportion of land set aside and protected as forest.
          Carbon retention shows how much carbon is stored by nature instead of being released as
          climate-warming gas.
        </p>
      </div>
    </div>
  );
}
