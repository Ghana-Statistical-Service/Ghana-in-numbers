"use client";

import { useState } from "react";
import { enterpriseTypes, establishmentSize, fiscalIndicators } from "@/data/reportAdditions";
import { DataDisclosure, DataTable, EconomicPlot, Metric, palette, PlotCard, Segments, ShareBar, number } from "./EconomicVisualPrimitives";

const sizeNames = ["Micro", "Small", "Medium", "Large"];

export function EnterpriseVisual() {
  return <div className="space-y-5" data-economic-visual="enterprises">
    <div className="grid gap-3 sm:grid-cols-3">
      <Metric dark label="Businesses counted" value="2,644,358" note="2024 IBES I · All three business types" />
      <Metric label="Formal establishments" value="7.7%" note="Share of fixed-structure establishments" />
      <Metric label="Using digital finance" value="37.2%" note="Share of fixed-structure establishments" />
    </div>
    <div className="grid gap-5 xl:grid-cols-2">
      <PlotCard title="Businesses with and without walls" subtitle="Counts and shares of all businesses · 2024">
        <div className="mt-6 space-y-6">{enterpriseTypes.slice(0, 3).map((row, index) => <ShareBar key={row[0]} label={row[0]} amount={row[1]} share={parseFloat(row[2])} color={palette[index]} />)}</div>
        <p className="mt-6 text-[10px] leading-relaxed text-slate-400">Shares are published rounded values. Mobile businesses were counted on one day and may be understated.</p>
      </PlotCard>
      <PlotCard title="Small businesses, different employment footprints" subtitle="Share by establishment size · Persons engaged include unpaid workers">
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-500">{sizeNames.map((name, index) => <span key={name} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: palette[index] }} />{name}</span>)}</div>
        {[{ label: "Share of establishments", column: 1 }, { label: "Share of persons engaged", column: 2 }].map(group => <div key={group.label} className="mt-5"><p className="mb-2 text-xs font-medium text-slate-600">{group.label}</p><div className="flex h-9 overflow-hidden rounded-lg bg-slate-100" role="img" aria-label={`${group.label}: ${establishmentSize.map((row, i) => `${sizeNames[i]} ${row[group.column]}`).join(", ")}`}>{establishmentSize.map((row, index) => { const share = parseFloat(row[group.column]); return <div key={row[0]} style={{ width: `${share}%`, background: palette[index] }} className="flex items-center justify-center text-[10px] font-semibold text-white" title={`${row[0]}: ${row[group.column]}`}>{share >= 10 ? row[group.column] : ""}</div>; })}</div></div>)}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{establishmentSize.map((row, i) => <div key={row[0]} className="rounded-lg bg-slate-50 p-2 text-[10px]"><p className="font-semibold text-slate-700">{sizeNames[i]}</p><p className="mt-1 text-slate-500">Businesses <span className="font-medium text-slate-700">{row[1]}</span></p><p className="mt-0.5 text-slate-500">People <span className="font-medium text-slate-700">{row[2]}</span></p></div>)}</div>
      </PlotCard>
    </div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(240px,1fr)]">
      <PlotCard title="Formality rises with establishment size" subtitle="Formal establishments within each size group · These are separate rates, not shares to add together">
        <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">{establishmentSize.map((row, index) => <ShareBar key={row[0]} label={row[0]} share={parseFloat(row[3])} color={palette[index]} />)}</div>
      </PlotCard>
      <div className="flex flex-col justify-center rounded-xl bg-slate-50 p-5"><p className="text-[10px] font-semibold uppercase tracking-widest text-teal-700">Persons engaged</p><p className="mt-2 text-3xl font-bold tracking-tight text-slate-800">6.90 million</p><p className="mt-2 text-xs leading-relaxed text-slate-500">Across establishments in 2024. Micro establishments account for 90.4% of establishments and 41.9% of persons engaged.</p></div>
    </div>
    <DataDisclosure><DataTable headings={["Business type", "Count", "Share of businesses"]} rows={enterpriseTypes} /><DataTable headings={["Size", "Share of establishments", "Share of persons engaged", "Formal within size"]} rows={establishmentSize} /></DataDisclosure>
  </div>;
}

export function FiscalVisual() {
  const [basis, setBasis] = useState("commitment");
  const cash = basis === "cash";
  const values = (row: number) => fiscalIndicators[row].slice(1).map(v => Number(v) / 1000);
  const latest = (row: number) => values(row)[3];
  const spending = cash ? 2 : 3;
  const overall = cash ? 7 : 8;
  const primary = cash ? 9 : 10;
  const selectedSpending = [4, 5, 6];
  const maxSpending = Math.max(...selectedSpending.map(latest));
  return <div className="space-y-5" data-economic-visual="fiscal">
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-500">Government income, spending and the financing gap</p><Segments label="Fiscal accounting basis" selected={basis} onChange={setBasis} options={[{ key: "commitment", label: "Commitment basis" }, { key: "cash", label: "Cash basis" }]} /></div>
    <div className="grid gap-3 sm:grid-cols-3">
      <Metric label="Revenue & grants" value={number(latest(0))} unit="GH¢ billion" note="2025 · Both accounting bases" />
      <Metric label="Expenditure" value={number(latest(spending))} unit="GH¢ billion" note={`2025 · ${cash ? "Cash payments" : "Commitments incurred"}`} />
      <Metric dark label="Overall balance" value={number(latest(overall))} unit="GH¢ billion" note={`2025 · ${cash ? "Cash" : "Commitment"} basis · Negative = deficit`} />
    </div>
    <div className="grid gap-5 xl:grid-cols-2">
      <PlotCard title="Revenue and expenditure" subtitle={`${cash ? "Cash" : "Commitment"} basis · Nominal GH¢ billion · 2022–2025`}><EconomicPlot title={`${basis} revenue and expenditure`} labels={["2022", "2023", "2024", "2025"]} unit="GH¢ bn" series={[{ name: "Revenue & grants", values: values(0), color: palette[0] }, { name: "Tax revenue (included in total)", values: values(1), color: palette[1] }, { name: "Expenditure", values: values(spending), color: palette[2] }]} /></PlotCard>
      <PlotCard title="Deficits and surpluses" subtitle={`${cash ? "Cash" : "Commitment"} basis · Overall balance includes interest; primary balance excludes it`}><EconomicPlot key={basis} title={`${basis} fiscal balances`} kind="bar" labels={["2022", "2023", "2024", "2025"]} unit="GH¢ bn" series={[{ name: "Overall balance", values: values(overall), color: palette[2] }, { name: "Primary balance", values: values(primary), color: palette[0] }]} /></PlotCard>
    </div>
    <PlotCard title="Selected spending commitments, 2025" subtitle="Nominal GH¢ billion · Selected items, not an exhaustive breakdown · Commitment basis in both views">
      <div className="mt-5 grid gap-6 md:grid-cols-3">{selectedSpending.map((row, i) => <div key={row}><div className="mb-3 flex justify-between gap-2 text-xs"><span className="text-slate-600">{fiscalIndicators[row][0]}</span><span className="font-semibold tabular-nums text-slate-800">{number(latest(row))}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${latest(row) / maxSpending * 100}%`, background: palette[i] }} /></div></div>)}</div>
    </PlotCard>
    <p className="text-[11px] leading-relaxed text-slate-500">Charts convert the published GH¢ million figures to GH¢ billion. Cash includes payments of earlier obligations; commitment spending records obligations incurred. Published balances may differ from arithmetic on rounded figures.</p>
    <DataDisclosure><DataTable headings={["Indicator (nominal GH¢ million)", "2022", "2023", "2024", "2025"]} rows={fiscalIndicators} /></DataDisclosure>
  </div>;
}
