"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown, Table2 } from "lucide-react";

export const palette = ["#14A998", "#4487DA", "#7B68BC", "#DCA34D"];
export const number = (value: number, decimals = 1) => new Intl.NumberFormat("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);

export function DataDisclosure({ children }: { children: ReactNode }) {
  return <details className="group rounded-xl border border-slate-200" data-visual-data>
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden"><span className="flex items-center gap-2"><Table2 size={15} />View data<span className="font-normal text-slate-400">· Published figures</span></span><ChevronDown size={15} className="transition-transform group-open:rotate-180" /></summary>
    <div className="space-y-5 border-t border-slate-100 p-3 sm:p-4">{children}</div>
  </details>;
}

export function DataTable({ headings, rows, decimals }: { headings: string[]; rows: (string | number)[][]; decimals?: number }) {
  return <div className="overflow-x-auto rounded-lg border border-slate-200"><table className="w-full min-w-[540px] text-xs">
    <caption className="sr-only">Published data: {headings.join(", ")}</caption>
    <thead className="bg-slate-50 text-slate-500"><tr>{headings.map((heading, index) => <th key={heading} scope="col" className={`px-4 py-3 font-semibold ${index ? "text-right" : "text-left"}`}>{heading}</th>)}</tr></thead>
    <tbody>{rows.map((row, index) => <tr key={index} className="border-t border-slate-100 hover:bg-slate-50">{row.map((value, column) => column === 0 ? <th key={column} scope="row" className="px-4 py-3 text-left font-medium text-slate-700">{value}</th> : <td key={column} className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-600">{typeof value === "number" ? value.toLocaleString("en-GB", { minimumFractionDigits: decimals ?? 0, maximumFractionDigits: decimals ?? 2 }) : value}</td>)}</tr>)}</tbody>
  </table></div>;
}

export function Metric({ label, value, unit, note, dark = false }: { label: string; value: string; unit?: string; note: string; dark?: boolean }) {
  return <div className={`min-w-0 rounded-xl px-5 py-4 ${dark ? "bg-[#26345A] text-white" : "border border-slate-200 bg-slate-50/70 text-slate-800"}`}>
    <p className={`text-[10px] font-semibold uppercase tracking-wider ${dark ? "text-slate-300" : "text-slate-500"}`}>{label}</p>
    <p className="mt-2 flex flex-wrap items-baseline gap-x-2"><span className="text-3xl font-bold tracking-tight tabular-nums">{value}</span>{unit && <span className={`text-xs ${dark ? "text-slate-300" : "text-slate-500"}`}>{unit}</span>}</p>
    <p className={`mt-2 text-[11px] leading-relaxed ${dark ? "text-slate-300" : "text-slate-500"}`}>{note}</p>
  </div>;
}

export function PlotCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <div className="min-w-0 rounded-xl border border-slate-200 p-4 sm:p-5"><h3 className="text-sm font-semibold text-slate-800">{title}</h3><p className="mt-1 text-[11px] leading-relaxed text-slate-500">{subtitle}</p>{children}</div>;
}

export function Segments({ label, options, selected, onChange }: { label: string; options: { key: string; label: string }[]; selected: string; onChange: (key: string) => void }) {
  return <div role="group" aria-label={label} className="flex w-fit max-w-full flex-wrap gap-1 rounded-lg bg-slate-100 p-1">{options.map(option => <button key={option.key} type="button" aria-pressed={selected === option.key} onClick={() => onChange(option.key)} className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${selected === option.key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{option.label}</button>)}</div>;
}

type Series = { name: string; values: number[]; color: string };
export function EconomicPlot({ title, labels, series, unit, kind = "line", decimals = 1 }: { title: string; labels: string[]; series: Series[]; unit: string; kind?: "line" | "bar"; decimals?: number }) {
  const id = useId();
  const [active, setActive] = useState<string | null>(null);
  const values = series.flatMap(row => row.values);
  const high = Math.max(0, ...values);
  const low = Math.min(0, ...values);
  const targetStep = (high - low) / 4 || 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(targetStep)));
  const scaled = targetStep / magnitude;
  const step = (scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 2.5 ? 2.5 : scaled <= 5 ? 5 : 10) * magnitude;
  const top = Math.ceil(high / step) * step || step;
  const bottom = Math.floor(low / step) * step;
  const y = (value: number) => 224 - (value - bottom) / (top - bottom) * 188;
  const x = (index: number) => 105 + index * (450 / Math.max(1, labels.length - 1));
  const ticks = Array.from({ length: Math.round((top - bottom) / step) + 1 }, (_, i) => bottom + step * i);
  const barWidth = Math.min(40, 88 / series.length);
  return <div data-economic-chart={title}>
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px]">{series.map(row => <span key={row.name} className="inline-flex items-center gap-1.5 text-slate-600"><span className="h-2 w-2 rounded-full" style={{ background: row.color }} />{row.name}</span>)}</div>
    <p className="mt-3 text-[10px] text-slate-400 sm:hidden">Swipe across the chart to see every period →</p>
    <div className="overflow-x-auto">
      <svg viewBox="0 0 630 275" className="mt-2 w-full min-w-[420px]" role="img" aria-labelledby={id}>
        <title id={id}>{`${title}. ${unit}. ${series.map(row => `${row.name}: ${row.values.map((v, i) => `${labels[i]} ${number(v, decimals)}`).join(", ")}`).join(". ")}`}</title>
        {ticks.map((tick, index) => <g key={index}><line x1={66} x2={603} y1={y(tick)} y2={y(tick)} stroke="#E7EDF4" strokeDasharray="3 5" /><text x={54} y={y(tick) + 4} textAnchor="end" fontSize="10" fill="#94A3B8">{number(tick, decimals)}</text></g>)}
        <line x1={66} x2={603} y1={y(0)} y2={y(0)} stroke="#A6B4C8" />
        {labels.map((label, i) => <text key={label} x={x(i)} y={252} textAnchor="middle" fontSize="11" fill="#64748B">{label}</text>)}
        {series.map((row, seriesIndex) => <g key={row.name}>
          {kind === "line" && <path d={row.values.map((value, index) => `${index ? "L" : "M"}${x(index)},${y(value)}`).join(" ")} fill="none" stroke={row.color} strokeWidth={2.5} strokeLinejoin="round" />}
          {row.values.map((value, index) => {
            const description = `${labels[index]} · ${row.name}: ${number(value, decimals)} ${unit}`;
            const barX = x(index) - series.length * barWidth / 2 + seriesIndex * barWidth;
            return <g key={index} role="graphics-symbol" tabIndex={0} aria-label={description} className="outline-none group" onFocus={() => setActive(description)} onBlur={() => setActive(null)} onMouseEnter={() => setActive(description)} onMouseLeave={() => setActive(null)}>
              <title>{description}</title>
              {kind === "bar" && <text x={barX + barWidth / 2} y={value >= 0 ? y(value) - 8 : y(value) + 14} textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">{number(value, decimals)}</text>}
              {kind === "bar" ? <rect x={barX + 2} y={y(Math.max(0, value))} width={barWidth - 4} height={Math.max(1, Math.abs(y(value) - y(0)))} rx={3} fill={row.color} className="group-focus:stroke-slate-800 group-focus:stroke-2" /> : <><circle cx={x(index)} cy={y(value)} r={12} fill="transparent" /><circle cx={x(index)} cy={y(value)} r={4} fill="white" stroke={row.color} strokeWidth={2.5} className="group-focus:stroke-slate-800" /></>}
            </g>;
          })}
        </g>)}
      </svg>
    </div>
    <p aria-live="polite" className="min-h-10 border-t border-slate-100 pt-3 text-[11px] leading-relaxed text-slate-500">{active ?? `${unit} · Hover or focus on a value for details.`}</p>
  </div>;
}

export function ShareBar({ label, amount, share, color }: { label: string; amount?: string; share: number; color: string }) {
  return <div><div className="mb-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs"><span className="font-medium text-slate-600">{label}</span><span className="font-semibold tabular-nums text-slate-800">{amount && <>{amount}<span className="mx-2 font-normal text-slate-300">/</span></>}{number(share)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${share}%`, background: color }} /></div></div>;
}
