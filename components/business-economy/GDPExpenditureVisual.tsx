"use client";

import { useId, useState } from "react";
import { gdpExpenditure2025 } from "@/data/reportAdditions";
import { ChartCard, Stat } from "@/components/ui/Card";
import { DataDisclosure, Segmented } from "@/components/ui/Data";
import GDPExpenditureTable from "./GDPExpenditureTable";
import { getGroupExplanation } from "@/data/cardExplanationContent";

const format = new Intl.NumberFormat("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const colors = { consumption: "#0E8A7E", investment: "#2F6DB5", exports: "#3C2FA3", imports: "#D17A22", total: "#241B5A" };
const components = [
  { label: "Consumption", row: 1, color: colors.consumption, sign: 1 },
  { label: "Investment", row: 5, color: colors.investment, sign: 1 },
  { label: "Exports", row: 7, color: colors.exports, sign: 1 },
  { label: "Imports", row: 8, color: colors.imports, sign: -1 },
];

/**
 * Waterfall of 2025 GDP by expenditure (Table 5.1, p. 39): consumption + investment + exports − imports = GDP.
 * Consumption sub-items are shown separately and are already included in the consumption bar.
 */
export default function GDPExpenditureVisual() {
  const [basis, setBasis] = useState<"nominal" | "real">("nominal");
  const [active, setActive] = useState<number | null>(null);
  const titleId = useId();
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
    { label: "Non-profit institutions (NPISH)", row: 4, color: colors.exports },
  ];
  const priceLabel = basis === "nominal" ? "current prices" : "2013 prices";

  return (
    <ChartCard
      title="GDP by expenditure"
      subtitle={`GH¢ billion, ${priceLabel}`}
      period="2025"
      explain={getGroupExplanation("expenditure", "GDP by expenditure")}
      actions={<Segmented label="GDP price basis" size="sm" value={basis} onChange={v => { setBasis(v); setActive(null); }} options={[{ value: "nominal", label: "Nominal" }, { value: "real", label: "Real (2013 prices)" }]} />}
      notes={<>Expenditure levels, not contributions to growth. Domestic demand grew 8.9% in real terms, led by household consumption (+10.5%); real imports grew faster (+19.3%) than exports (+8.2%), leaving real net exports at −GH¢7.6 billion while the nominal balance was +GH¢112.9 billion. Published components may not sum exactly to totals because of rounding.</>}
      source="GSS Quarterly GDP, Expenditure Approach (September 2026) · Table 5.1, p. 39"
      footer={<DataDisclosure hint="All expenditure items, with real growth"><GDPExpenditureTable /></DataDisclosure>}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat tone="brand" label="GDP at market prices" value={format.format(gdp)} unit="GH¢ billion" context="Real growth 6.0% (provisional)" />
        <Stat label="Domestic demand" value={format.format(value(0))} unit="GH¢ billion" context="Consumption + investment" />
        <Stat label="Net exports of goods and services" value={`${value(6) < 0 ? "−" : "+"}${format.format(Math.abs(value(6)))}`} unit="GH¢ billion" context="Exports − imports (national accounts)" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <div className="min-w-0">
          <div className="scroll-hint -mx-1 overflow-x-auto px-1" tabIndex={0} aria-label="GDP expenditure waterfall (scrolls horizontally on small screens)">
            <svg viewBox="0 0 700 340" className="w-full min-w-[540px]" role="img" aria-labelledby={`${titleId}-t ${titleId}-d`}>
              <title id={`${titleId}-t`}>{`GDP expenditure waterfall, 2025, ${priceLabel}`}</title>
              <desc id={`${titleId}-d`}>{`Consumption ${format.format(value(1))}, plus investment ${format.format(value(5))}, plus exports ${format.format(value(7))}, minus imports ${format.format(value(8))}. Published GDP ${format.format(gdp)} billion Ghana cedis.`}</desc>
              {ticks.map(t => <g key={t}><line x1={62} x2={680} y1={y(t)} y2={y(t)} stroke={t === 0 ? "#CBD1DD" : "#E8EBF2"} /><text x={52} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#64748B">{t.toLocaleString("en-GB")}</text></g>)}
              {bars.map((bar, index) => {
                const x = 84 + index * 122;
                const top = y(Math.max(bar.start, bar.end));
                const bottom = y(Math.min(bar.start, bar.end));
                const label = `${bar.total ? "" : bar.sign < 0 ? "−" : "+"}${format.format(Math.abs(bar.amount))}`;
                return (
                  <g key={bar.label} tabIndex={0} role="graphics-symbol" aria-label={`${bar.label}: ${label} billion Ghana cedis${bar.sign < 0 ? ", subtracted" : ""}`}
                    onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(index)} onBlur={() => setActive(null)} className="outline-none">
                    {index < bars.length - 1 && <line x1={x + 72} x2={x + 122} y1={y(bar.end)} y2={y(bar.end)} stroke="#8A97AB" strokeDasharray="3 3" />}
                    <rect x={x - 9} y={36} width={90} height={252} rx={8} fill={active === index ? "#EEECFA" : "transparent"} />
                    <rect x={x} y={top} width={72} height={Math.max(2, bottom - top)} rx={4} fill={bar.color} stroke={active === index ? "#0F172B" : "none"} strokeWidth={1.5} />
                    <text x={x + 36} y={top - 9} textAnchor="middle" fontSize="13" fontWeight="600" fill="#0F172B">{label}</text>
                    <text x={x + 36} y={306} textAnchor="middle" fontSize="12.5" fontWeight={bar.total ? "700" : "500"} fill="#0F172B">{bar.label}</text>
                    <text x={x + 36} y={324} textAnchor="middle" fontSize="12" fill="#4B5A70">{bar.total ? "Total" : bar.sign < 0 ? "Subtract" : "Add"}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="min-h-6 text-[13px] text-muted" aria-live="polite">
            {selected ? <><span className="font-semibold text-ink">{selected.label}</span> · {format.format(Math.abs(selected.amount))} GH¢ billion{selected.total ? ", published total" : selected.sign < 0 ? ", subtracted" : ", added"}</> : "Consumption + investment + exports − imports = GDP"}
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">Inside consumption</p>
          <p className="mt-1.5 text-[15px] font-semibold leading-snug text-ink">Households account for <span className="tabular">{(value(2) / consumption * 100).toFixed(1)}%</span> of consumption</p>
          <p className="mt-1 text-xs text-muted">GH¢ billion and share of consumption, {priceLabel}</p>
          <ul className="mt-4 space-y-3.5">
            {breakdown.map(item => {
              const share = value(item.row) / consumption * 100;
              return (
                <li key={item.label}>
                  <div className="mb-1 flex justify-between gap-3 text-[13px]"><span className="text-body">{item.label}</span><span className="tabular font-semibold text-ink">{format.format(value(item.row))} <span className="font-normal text-subtle">· {share.toFixed(1)}%</span></span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full" style={{ width: `${share}%`, background: item.color }} /></div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-subtle">These items are already included in the consumption bar; do not add them again.</p>
        </div>
      </div>
    </ChartCard>
  );
}
