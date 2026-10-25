"use client";

import { informalTrade, agricultureEndpointComparisons, agricultureReferenceIndicators } from "@/data/reportAdditions";
import { indicatorExplanations } from "@/data/indicatorExplanations";
import CardExplanation from "@/components/shared/CardExplanation";
import { DataDisclosure, DataTable, EconomicPlot, Metric, palette, PlotCard, number } from "./EconomicVisualPrimitives";

export function InformalTradeVisual() {
  const quarters = informalTrade.slice(0, 4);
  const total = informalTrade[4];
  return <div className="space-y-5" data-economic-visual="informal-trade">
    <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-500">Trade with Togo, Burkina Faso and Côte d’Ivoire</p><span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-500">October 2024 – September 2025</span></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric dark label="Total informal trade" value={number(Number(total[3]), 2)} unit="GH¢ billion" note="Full 12-month survey period" />
      <Metric label="Exports" value={number(Number(total[1]), 2)} unit="GH¢ billion" note="Full 12-month survey period" />
      <Metric label="Imports" value={number(Number(total[2]), 2)} unit="GH¢ billion" note="Full 12-month survey period" />
      <Metric label="Trade balance" value={`+${number(Number(total[4]), 2)}`} unit="GH¢ billion" note="Surplus · Full 12-month survey period" />
    </div>
    <div className="grid gap-5 xl:grid-cols-2">
      <PlotCard title="Exports and imports by quarter" subtitle="Current-price values · GH¢ billion"><EconomicPlot title="Quarterly informal exports and imports" kind="bar" labels={quarters.map(row => String(row[0]))} unit="GH¢ bn" decimals={2} series={[{ name: "Exports", values: quarters.map(row => Number(row[1])), color: palette[0] }, { name: "Imports", values: quarters.map(row => Number(row[2])), color: palette[2] }]} /><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{quarters.map(row => <div key={String(row[0])} className="rounded-lg bg-slate-50 px-2 py-2 text-[10px]"><p className="text-slate-400">{row[0]} total</p><p className="mt-1 font-semibold tabular-nums text-slate-700">{number(Number(row[3]), 2)} GH¢ bn</p></div>)}</div></PlotCard>
      <PlotCard title="A narrower surplus in the final quarter" subtitle="Published quarterly balance · GH¢ billion · Zero separates surplus and deficit"><EconomicPlot title="Quarterly informal trade balance" kind="bar" labels={quarters.map(row => String(row[0]))} unit="GH¢ bn" decimals={2} series={[{ name: "Trade balance", values: quarters.map(row => Number(row[4])), color: palette[1] }]} /><div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500">The published surplus fell from <span className="font-semibold text-slate-700">GH¢0.67 billion</span> in Q2 2025 to <span className="font-semibold text-slate-700">GH¢0.05 billion</span> in Q3 2025.</div></PlotCard>
    </div>
    <p className="text-[11px] leading-relaxed text-slate-500">Surveyed daytime crossings at 321 border points. Rounded quarterly balances are shown as published and can differ from exports minus imports. The 12-month total is separate from the quarterly observations.</p>
    <DataDisclosure><DataTable headings={["Period", "Exports GH¢ bn", "Imports GH¢ bn", "Total GH¢ bn", "Balance GH¢ bn"]} rows={informalTrade} decimals={2} /></DataDisclosure>
  </div>;
}

export function AgricultureReferenceVisual() {
  return <div className="space-y-5" data-economic-visual="agriculture-reference">
    <div className="grid gap-3 sm:grid-cols-3">
      <Metric label="Public agriculture spending" value="~0.2%" unit="of GDP" note="2024 · Public spending relative to the economy" />
      <Metric label="Agriculture Orientation Index" value="0.02" note="2022–2024 · Budget share ÷ agriculture’s GDP share" />
      <Metric dark label="Total fish production" value="722,648" unit="tonnes" note="2025 · Published aggregate total" />
    </div>
    <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-sm font-semibold text-slate-800">Production and livestock: then and now</h3><span className="text-[10px] text-slate-400">Two observations per chart · Each chart uses its own scale</span></div>
    <div className="grid gap-4 md:grid-cols-2">
      {agricultureEndpointComparisons.map((item, index) => {
        const guide = indicatorExplanations.agriculture[index === 0 ? 0 : 2];
        return <article key={item.label} className="rounded-xl border border-slate-200 p-5" data-agriculture-comparison={item.label}>
          <div className="flex items-start justify-between gap-3"><div><h4 className="text-sm font-semibold text-slate-800">{item.label}</h4><p className="mt-1 text-[11px] text-slate-500">{item.unit} · {item.startYear} to {item.endYear}</p></div><CardExplanation title={item.label} meaning={guide.meaning} story={guide.reading} why={guide.why} source={guide.source} /></div>
          <div className="mt-5 space-y-5">{[{ year: item.startYear, amount: item.start, color: "#C4D0E2" }, { year: item.endYear, amount: item.end, color: palette[index] }].map(period => <div key={period.year}>
            <div className="mb-2 flex justify-between text-xs"><span className="text-slate-500">{period.year}</span><span className="font-semibold tabular-nums text-slate-800">{number(period.amount, item.decimals)}</span></div>
            <div className="h-3 overflow-hidden rounded bg-slate-100"><div className="h-full rounded" style={{ width: `${period.amount / Math.max(item.start, item.end) * 100}%`, background: period.color }} /></div>
          </div>)}</div>
          <p className="mt-5 border-t border-slate-100 pt-3 text-[11px] text-slate-500"><span className="font-semibold text-slate-700">{number(item.end / item.start)}×</span> the {item.startYear} level by {item.endYear}</p>
        </article>;
      })}
    </div>
    <p className="text-[11px] leading-relaxed text-slate-500">Tilapia and catfish: published species total of 124,428 tonnes in 2025. The report’s aggregate aquaculture series gives 124,161 tonnes; these series contain small revisions. Animal counts and fish output have different units and are shown separately.</p>
    <DataDisclosure><DataTable headings={["Indicator", "Reference period", "Published value"]} rows={agricultureReferenceIndicators} /></DataDisclosure>
  </div>;
}
