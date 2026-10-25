"use client";

import { useId, useState } from "react";
import { monetaryIndicators } from "@/data/reportAdditions";
import { indicatorExplanations } from "@/data/indicatorExplanations";
import CardExplanation from "@/components/shared/CardExplanation";
import { DataDisclosure, DataTable, number, palette, Segments } from "./EconomicVisualPrimitives";

const groups = [
  { key: "money", label: "Money & credit", rows: [0, 1, 2, 3, 4, 5, 6], note: "Banking volumes, monetary growth and credit · Each indicator retains its own unit and scale" },
  { key: "rates", label: "Interest rates", rows: [9, 10, 11, 12, 13, 14], note: "Year-end borrowing rates · Common 0–40% scale for comparison" },
  { key: "reserves", label: "External reserves", rows: [7, 8], note: "Reserve holdings and import cover · Separate units and scales" },
  { key: "health", label: "Banking health", rows: [15, 16, 17, 18], note: "Capital, loan quality and profitability · Separate scales; ROA is before tax and ROE after tax" },
];
const guideIndex = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7];

function FinancialTrend({ row, commonRateScale }: { row: number; commonRateScale: boolean }) {
  const id = useId();
  const [active, setActive] = useState<number | null>(null);
  const source = monetaryIndicators[row];
  const title = String(source[0]);
  const values = source.slice(1).map(Number);
  const unit = title.includes("US$") ? "US$ billion" : title.includes("GH¢") ? "GH¢ billion" : title.includes("months") ? "months" : "%";
  const shortTitle = title.replace(/ \(GH¢ bn\)| \(US\$ bn\)| \(%\)| \(months of import cover\)/g, "");
  const delta = values[3] - values[2];
  const max = commonRateScale ? 40 : Math.max(0, ...values) * 1.12;
  const min = Math.min(0, ...values) * 1.12;
  const y = (value: number) => 102 - (value - min) / (max - min || 1) * 82;
  const color = palette[row % palette.length];
  const guide = indicatorExplanations.finance[guideIndex[row]];
  return <article className="min-w-0 rounded-xl border border-slate-200 p-5" data-finance-indicator={row}>
    <div className="flex items-start justify-between gap-2"><h3 className="min-h-9 text-xs font-semibold leading-relaxed text-slate-600">{shortTitle}</h3><CardExplanation title={shortTitle} meaning={guide.meaning} story={guide.reading} why={guide.why} source={guide.source} /></div>
    <div className="mt-2 flex flex-wrap items-baseline gap-x-2"><span className="text-3xl font-bold tracking-tight tabular-nums text-slate-800">{number(values[3])}</span><span className="text-xs text-slate-500">{unit}</span><span className="ml-auto rounded bg-slate-50 px-1.5 py-1 text-[10px] text-slate-400">2025</span></div>
    <p className="mt-2 text-[10px] text-slate-500">{delta < 0 ? "−" : "+"}{number(Math.abs(delta))} {unit === "%" ? "percentage points" : unit} from 2024</p>
    <svg className="mt-3 w-full" viewBox="0 0 320 133" role="img" aria-labelledby={id}>
      <title id={id}>{`${shortTitle}, ${unit}. ${values.map((v, i) => `${2022 + i}: ${number(v)}`).join(", ")}`}</title>
      <line x1={15} x2={305} y1={y(0)} y2={y(0)} stroke="#DCE4EE" strokeDasharray={min < 0 ? "3 4" : undefined} />
      <path d={`${values.map((v, i) => `${i ? "L" : "M"}${20 + i * 93.3},${y(v)}`).join(" ")} L300,${y(0)} L20,${y(0)} Z`} fill={color} fillOpacity={0.06} />
      <path d={values.map((v, i) => `${i ? "L" : "M"}${20 + i * 93.3},${y(v)}`).join(" ")} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
      {values.map((v, i) => <g key={i} tabIndex={0} role="graphics-symbol" aria-label={`${2022 + i}: ${number(v)} ${unit}`} className="outline-none group" onFocus={() => setActive(i)} onBlur={() => setActive(null)} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}><title>{`${2022 + i}: ${number(v)} ${unit}`}</title><circle cx={20 + i * 93.3} cy={y(v)} r={12} fill="transparent" /><circle cx={20 + i * 93.3} cy={y(v)} r={i === 3 ? 4.5 : 3} stroke={color} strokeWidth={2} fill={i === 3 ? color : "white"} className="group-focus:stroke-slate-800" /><text x={20 + i * 93.3} y={126} textAnchor="middle" fontSize="9" fill="#94A3B8">{2022 + i}</text></g>)}
    </svg>
    <p aria-live="polite" className="min-h-5 border-t border-slate-100 pt-2 text-[10px] text-slate-500">{active === null ? `2022: ${number(values[0])} → 2025: ${number(values[3])} ${unit}` : `${2022 + active}: ${number(values[active])} ${unit}`}</p>
  </article>;
}

export default function FinanceVisual() {
  const [selected, setSelected] = useState("money");
  const group = groups.find(item => item.key === selected)!;
  return <div className="space-y-5" data-economic-visual="finance">
    <Segments label="Financial indicator group" selected={selected} onChange={setSelected} options={groups} />
    <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-sm font-semibold text-slate-800">{group.label} <span className="ml-1 font-normal text-slate-400">2022–2025</span></h3><span className="text-[10px] text-slate-400">End-period unless stated</span></div>
    <p className="text-[11px] text-slate-500">{group.note}</p>
    <div className={`grid gap-4 md:grid-cols-2 ${selected === "reserves" || selected === "health" ? "" : "xl:grid-cols-3"}`}>{group.rows.map(row => <FinancialTrend key={row} row={row} commonRateScale={selected === "rates"} />)}</div>
    <DataDisclosure><DataTable headings={["Indicator (end-period unless stated)", "2022", "2023", "2024", "2025"]} rows={monetaryIndicators} decimals={1} /></DataDisclosure>
  </div>;
}
