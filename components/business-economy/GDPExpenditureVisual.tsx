"use client";

import { useId, useState } from "react";
import { ChevronDown, Table2 } from "lucide-react";
import { gdpExpenditure2025 } from "@/data/reportAdditions";
import GDPExpenditureTable from "./GDPExpenditureTable";

const format = new Intl.NumberFormat("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const colors = { consumption: "#14A998", investment: "#4487DA", exports: "#7B68BC", imports: "#DCA34D", total: "#26345A" };
const components = [
  { label: "Consumption", row: 1, color: colors.consumption, sign: 1 },
  { label: "Investment", row: 5, color: colors.investment, sign: 1 },
  { label: "Exports", row: 7, color: colors.exports, sign: 1 },
  { label: "Imports", row: 8, color: colors.imports, sign: -1 },
];

export default function GDPExpenditureVisual() {
  const [basis, setBasis] = useState<"nominal" | "real">("nominal");
  const [active, setActive] = useState<number | null>(null);
  const gradientId = useId();
  const column = basis === "nominal" ? 1 : 2;
  const value = (row: number) => Number(gdpExpenditure2025[row][column]);
  const gdp = value(9);
  const consumption = value(1);
  let running = 0;
  const bars = components.map(component => {
    const amount = value(component.row) * component.sign;
    const start = running;
    running += amount;
    return { ...component, amount, start, end: running, total: false };
  });
  bars.push({ label: "GDP", row: 9, color: colors.total, sign: 1, amount: gdp, start: 0, end: gdp, total: true });
  const axisMax = basis === "nominal" ? 2000 : 300;
  const ticks = basis === "nominal" ? [0, 500, 1000, 1500, 2000] : [0, 75, 150, 225, 300];
  const y = (amount: number) => 284 - (amount / axisMax) * 224;
  const selected = active === null ? null : bars[active];
  const breakdown = [
    { label: "Households", row: 2, color: colors.consumption },
    { label: "Government", row: 3, color: colors.investment },
    { label: "Non-profit institutions", row: 4, color: colors.exports },
  ];

  return <div className="space-y-5" data-gdp-expenditure-visual>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-medium text-slate-500">The spending behind Ghana’s economy</p>
      <div className="inline-flex rounded-lg bg-slate-100 p-1" role="group" aria-label="GDP price basis">
        {(["nominal", "real"] as const).map(option => <button key={option} type="button" aria-pressed={basis === option} onClick={() => { setBasis(option); setActive(null); }} className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${basis === option ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{option === "nominal" ? "Nominal · current prices" : "Real · 2013 prices"}</button>)}
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl bg-[#26345A] px-5 py-4 text-white">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-300">GDP at market prices</p>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2"><span className="text-3xl font-bold tracking-tight tabular-nums" data-gdp-total>{format.format(gdp)}</span><span className="text-xs text-slate-300">GH¢ billion</span></p>
        <p className="mt-2 text-[11px] text-slate-300">2025 · Real GDP growth <span className="font-semibold text-white">6.0%</span></p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-5 py-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Domestic demand</p>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2"><span className="text-3xl font-bold tracking-tight tabular-nums text-slate-800">{format.format(value(0))}</span><span className="text-xs text-slate-500">GH¢ billion</span></p>
        <p className="mt-2 text-[11px] text-slate-500">Consumption + investment</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-5 py-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Net exports</p>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2"><span className="text-3xl font-bold tracking-tight tabular-nums text-slate-800">{value(6) < 0 ? "−" : "+"}{format.format(Math.abs(value(6)))}</span><span className="text-xs text-slate-500">GH¢ billion</span></p>
        <p className="mt-2 text-[11px] text-slate-500">Exports − imports · goods and services</p>
      </div>
    </div>

    <div className="grid gap-5 xl:grid-cols-[minmax(0,2.1fr)_minmax(250px,1fr)]">
      <div className="min-w-0 rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-800">How expenditure adds up</h3>
          <span className="text-[11px] text-slate-500">GH¢ billion · {basis === "nominal" ? "current prices" : "2013 prices"}</span>
        </div>
        <p className="mt-3 text-[10px] text-slate-400 sm:hidden">Swipe across the chart to see all five components →</p>
        <div className="overflow-x-auto mt-2">
          <svg viewBox="0 0 700 355" className="w-full min-w-[560px]" role="img" aria-labelledby={`${gradientId}-title ${gradientId}-description`}>
            <title id={`${gradientId}-title`}>{`GDP expenditure waterfall, 2025, ${basis} prices`}</title>
            <desc id={`${gradientId}-description`}>{`Consumption ${format.format(value(1))}, plus investment ${format.format(value(5))}, plus exports ${format.format(value(7))}, minus imports ${format.format(value(8))}. Published GDP: ${format.format(gdp)} billion Ghana cedis. Small differences are due to rounding.`}</desc>
            <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3D4F7B" /><stop offset="100%" stopColor="#26345A" /></linearGradient></defs>
            {ticks.map(tick => <g key={tick}><line x1={62} x2={680} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? "#CBD5E1" : "#E8EDF3"} strokeDasharray={tick === 0 ? undefined : "3 5"} /><text x={49} y={y(tick) + 4} textAnchor="end" fontSize="10" fill="#94A3B8">{tick.toLocaleString("en-GB")}</text></g>)}
            {bars.map((bar, index) => {
              const x = 84 + index * 122;
              const top = y(Math.max(bar.start, bar.end));
              const bottom = y(Math.min(bar.start, bar.end));
              const label = `${bar.total ? "" : bar.sign < 0 ? "−" : "+"}${format.format(Math.abs(bar.amount))}`;
              return <g key={bar.label} tabIndex={0} role="graphics-symbol" aria-label={`${bar.label}: ${label} billion Ghana cedis${bar.sign < 0 ? ", subtracted" : ""}`} onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(index)} onBlur={() => setActive(null)} className="outline-none group">
                <title>{`${bar.label}: ${label} GH¢ billion`}</title>
                {index < bars.length - 1 && <line x1={x + 72} x2={x + 122} y1={y(bar.end)} y2={y(bar.end)} stroke="#9AA8BD" strokeWidth="1" strokeDasharray="3 3" />}
                <rect x={x - 9} y={42} width={90} height={245} rx={10} fill={active === index ? "#F1F5F9" : "transparent"} />
                <rect x={x} y={top} width={72} height={Math.max(2, bottom - top)} rx={5} fill={bar.total ? `url(#${gradientId})` : bar.color} className="group-focus:stroke-slate-800 group-focus:stroke-2" />
                <text x={x + 36} y={top - 11} textAnchor="middle" fontSize="12" fontWeight="700" fill={bar.total ? colors.total : "#334155"}>{label}</text>
                <text x={x + 36} y={307} textAnchor="middle" fontSize="11" fontWeight={bar.total ? "700" : "500"} fill="#334155">{bar.label}</text>
                <text x={x + 36} y={325} textAnchor="middle" fontSize="9" fill="#94A3B8">{bar.total ? "TOTAL OUTPUT" : bar.sign < 0 ? "SUBTRACT" : "ADD"}</text>
              </g>;
            })}
          </svg>
        </div>
        <div className="min-h-10 border-t border-slate-100 pt-3 text-xs text-slate-500" aria-live="polite">
          {selected ? <><span className="font-semibold text-slate-700">{selected.label}</span> · {format.format(Math.abs(selected.amount))} GH¢ billion{selected.total ? " total output" : selected.sign < 0 ? " subtracted from expenditure" : " added to expenditure"}</> : <span>Consumption + investment + exports − imports = GDP</span>}
        </div>
      </div>

      <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-teal-700">Inside consumption</p>
        <h3 className="mt-2 text-lg font-bold leading-snug text-slate-800">Households account for<br /><span className="text-teal-700">{(value(2) / consumption * 100).toFixed(1)}%</span> of consumption</h3>
        <p className="mt-2 text-xs text-slate-500">Share of consumption · {basis === "nominal" ? "current" : "2013"} prices</p>
        <div className="mt-6 space-y-5">
          {breakdown.map(item => {
            const share = value(item.row) / consumption * 100;
            return <div key={item.label}>
              <div className="mb-2 flex justify-between gap-3 text-xs"><span className="font-medium text-slate-600">{item.label}</span><span className="font-semibold tabular-nums text-slate-800">{format.format(value(item.row))} <span className="font-normal text-slate-400">/ {share.toFixed(1)}%</span></span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/70"><div className="h-full rounded-full" style={{ width: `${share}%`, background: item.color }} /></div>
            </div>;
          })}
        </div>
        <p className="mt-auto pt-5 text-[10px] leading-relaxed text-slate-500">Amounts in GH¢ billion. Non-profit institutions serve households (NPISH). These components are already included in the consumption bar.</p>
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-[11px] text-slate-500">
      <span>2025 expenditure levels · Growth rates are available in View data.</span>
      <span>Published figures are rounded; components may not sum exactly.</span>
    </div>
    <details className="group rounded-xl border border-slate-200" data-expenditure-data>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden"><span className="flex items-center gap-2"><Table2 size={15} />View data<span className="font-normal text-slate-400">· All expenditure items</span></span><ChevronDown size={15} className="transition-transform group-open:rotate-180" /></summary>
      <div className="border-t border-slate-100 p-3 sm:p-4"><GDPExpenditureTable /></div>
    </details>
  </div>;
}
