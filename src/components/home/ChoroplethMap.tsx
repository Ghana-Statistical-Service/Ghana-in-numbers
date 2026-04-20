"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildPathD,
  computeBounds,
  createProjector,
  FeatureCollection,
  getFeatureName,
  isValidGeometry,
  stableValue,
} from "@/lib/geojsonToSvg";
import { Bookmark, ArrowUpDown, ChevronDown } from "lucide-react";
import { regionInflationData } from "@/data/dummy";

const VIEW_W = 420;
const VIEW_H = 520;
const COLOR_BUCKETS = ["#EAE6F9", "#D2CAF3", "#B1A2E8", "#7E6AD8", "#3C2FA3"];

const indicators = ["Inflation (CPI)", "Population Density", "Unemployment", "GDP per Capita"];
const years    = ["2026", "2025", "2024", "2023"];
const periods  = ["2026M03", "2026M02", "2026M01", "2025M12"];

const nationalAvg = (
  Object.values(regionInflationData).reduce((a, b) => a + b, 0) /
  Object.values(regionInflationData).length
).toFixed(1);

export default function ChoroplethMap() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [regionsData,   setRegionsData]   = useState<FeatureCollection | null>(null);
  const [districtsData, setDistrictsData] = useState<FeatureCollection | null>(null);
  const [mode,          setMode]          = useState<"Regions" | "Districts">("Regions");
  const [selectedIndicator, setSelectedIndicator] = useState("Inflation (CPI)");
  const [showIndDd,     setShowIndDd]     = useState(false);
  const [selectedYear,  setSelectedYear]  = useState("2026");
  const [selectedPeriod, setSelectedPeriod] = useState("2026M03");
  const [hovered, setHovered] = useState<{ name: string; value: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<string | null>(null);

  // Fetch GeoJSON
  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/map/Regions.gh.json").then((r) => r.json()),
      fetch("/map/District.gh.json").then((r) => r.json()),
    ]).then(([reg, dis]) => {
      if (!active) return;
      setRegionsData(reg as FeatureCollection);
      setDistrictsData(dis as FeatureCollection);
    });
    return () => { active = false; };
  }, []);

  // Active features
  const activeFeatures = useMemo(() => {
    const src = mode === "Regions" ? regionsData : districtsData;
    return (src?.features ?? []).filter((f) => isValidGeometry(f.geometry));
  }, [mode, regionsData, districtsData]);

  // Build SVG paths
  const paths = useMemo(() => {
    if (!activeFeatures.length) return [];
    const bounds   = computeBounds(activeFeatures);
    const project  = createProjector(bounds, VIEW_W, VIEW_H, 18);
    return activeFeatures
      .map((f) => {
        if (!isValidGeometry(f.geometry)) return null;
        return { name: getFeatureName(f.properties ?? undefined), d: buildPathD(f.geometry, project) };
      })
      .filter((x): x is { name: string; d: string } => Boolean(x));
  }, [activeFeatures]);

  // Value map + color fn
  const { valueByName, getColor } = useMemo(() => {
    const map = new Map<string, number>();
    let min = Infinity, max = -Infinity;

    paths.forEach(({ name }) => {
      const v =
        mode === "Regions"
          ? (regionInflationData[name] ?? stableValue(name, 10, 15))
          : stableValue(name, 9, 16);
      map.set(name, v);
      min = Math.min(min, v);
      max = Math.max(max, v);
    });

    if (!Number.isFinite(min)) { min = 10; max = 15; }

    const colorFn = (v: number) => {
      if (max === min) return COLOR_BUCKETS[2];
      const t   = (v - min) / (max - min);
      const idx = Math.min(COLOR_BUCKETS.length - 1, Math.floor(t * COLOR_BUCKETS.length));
      return COLOR_BUCKETS[idx];
    };

    return { valueByName: map, getColor: colorFn };
  }, [paths, mode]);

  // Tooltip position tracking
  const handleMouseMove = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (!hovered) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltipPos({
      x: Math.min(Math.max(12, evt.clientX - rect.left + 14), rect.width  - 155),
      y: Math.min(Math.max(12, evt.clientY - rect.top  + 14), rect.height -  65),
    });
  };

  return (
    <div
      ref={wrapperRef}
      className="rounded-2xl border border-slate-100 bg-white flex flex-col h-full overflow-hidden"
      style={{ boxShadow: "0 12px 30px rgba(15,23,42,0.08)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHovered(null)}
    >
      {/* ── Card header ── */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b border-slate-100">
        <p className="font-bold text-gray-800 text-sm">Current Indicator by Region</p>
        <div className="flex items-center gap-1.5">
          <button className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
            <Bookmark size={15} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowIndDd(!showIndDd)}
              className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ArrowUpDown size={12} style={{ color: "var(--secondary)" }} />
              {selectedIndicator}
              <ChevronDown size={11} className="text-gray-400" />
            </button>
            {showIndDd && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[175px] py-1">
                {indicators.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => { setSelectedIndicator(ind); setShowIndDd(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    {ind}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Map area ── */}
      <div className="relative flex-1 min-h-0">

        {/* National badge — top-left */}
        <div className="absolute left-4 top-4 z-20 flex h-20 w-20 flex-col items-center justify-center rounded-full border border-white/40 bg-white/35 text-center shadow-sm backdrop-blur-md">
          <span className="text-lg font-extrabold leading-none text-slate-800">
            {nationalAvg}%
          </span>
          <span className="mt-1 text-[10px] font-semibold leading-tight text-slate-600">
            National
          </span>
        </div>

        {/* Filter panel — top-right */}
        <div className="absolute right-3 top-4 z-20 flex w-36 flex-col items-stretch gap-1.5 rounded-xl border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur-sm">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 outline-none cursor-pointer"
          >
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600 outline-none cursor-pointer"
          >
            {periods.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* SVG map */}
        {paths.length > 0 ? (
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-full w-full"
            role="img"
            aria-label="Ghana administrative map"
          >
            {paths.map(({ name, d }) => {
              const value     = valueByName.get(name) ?? NaN;
              const fill      = Number.isFinite(value) ? getColor(value) : COLOR_BUCKETS[0];
              const isSelected = selected === name;
              const isHovered  = hovered?.name === name;
              return (
                <path
                  key={name}
                  d={d}
                  fill={fill}
                  stroke={isSelected ? "#241B5A" : "#E2E8F0"}
                  strokeWidth={isSelected ? 1.2 : 0.6}
                  style={{ opacity: isHovered ? 0.85 : 1, cursor: "pointer" }}
                  className="transition-opacity"
                  onMouseEnter={() => setHovered({ name, value })}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(selected === name ? null : name)}
                />
              );
            })}
          </svg>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            Loading map…
          </div>
        )}

        {/* Tooltip */}
        {hovered && (
          <div
            className="pointer-events-none absolute z-50 rounded-xl px-3 py-2 text-white shadow-lg"
            style={{ left: tooltipPos.x, top: tooltipPos.y, minWidth: "130px", background: "#1B2A4A" }}
          >
            <p className="font-bold text-sm flex items-center gap-1.5">
              <span style={{ color: "var(--secondary)" }}>↑</span>
              {hovered.name}
            </p>
            <p className="text-white/70 text-xs mt-0.5">
              Inflation:{" "}
              <span className="text-white font-semibold">
                {Number.isFinite(hovered.value) ? `${hovered.value.toFixed(1)}%` : "N/A"}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* ── Footer: legend + mode toggle ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span>Low</span>
          <div className="flex items-center gap-1">
            {COLOR_BUCKETS.map((color) => (
              <span
                key={color}
                className="h-2.5 w-4 rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span>High</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wide">View</span>
          <div className="flex items-center rounded-full bg-slate-100 p-0.5">
            {(["Regions", "Districts"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setMode(v)}
                className="rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors"
                style={{
                  background: mode === v ? "var(--primary)" : "transparent",
                  color:      mode === v ? "#fff"           : "#94A3B8",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
