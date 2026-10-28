"use client";

import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard, Stat } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Legend } from "@/components/ui/Data";
import { Grid } from "@/components/ui/Page";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, tick, tickSmall } from "@/components/ui/chart";
import { getGroupExplanation } from "@/data/cardExplanationContent";
import { enterpriseTypes, establishmentSize } from "@/data/reportAdditions";
import { businessConditionsByRegion, enterpriseFacts, establishmentsByStart, managementBySize, openSpaceVsMobile } from "@/data/publicationAdditions";

const sizeColors = [C.purple, C.blue, C.teal, C.amber];
const typeColors = [C.purple, C.teal, C.amber];

export function EnterpriseStats() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Stat tone="brand" label="Businesses counted" value="2,644,363" context="2024 IBES I census: establishments, open-space and mobile" />
      <Stat label="Persons engaged in establishments" value="6.90" unit="million" context={`${enterpriseFacts.persons2014} million in 2014; about 36% unpaid`} />
      <Stat label="Formal establishments" value="7.7" unit="%" context={`${enterpriseFacts.newFormal}% of those started 2015–2023`} />
      <Stat label="Establishments using digital finance" value="37.2" unit="%" context="Mobile money, transfers, cards" />
    </div>
  );
}

export function BusinessTypesCard() {
  return (
    <ChartCard title="Businesses with and without walls" subtitle="Number and share of all businesses" period="2024"
      explain={getGroupExplanation("enterprises", "Businesses and establishments", [0])}
      notes="Seven in ten businesses work inside a fixed structure. Mobile businesses were counted on a single day and are likely understated. Establishments rose from 638,235 in 2014 to 1,867,690 in 2024, partly because the 2024 census counted more widely."
      source="GSS 2024 IBES I · Table 5.4, p. 49"
      footer={<DataDisclosure><DataTable caption="Businesses by type, 2024" headings={["Business type", "Number", "Share of all businesses"]} rows={enterpriseTypes.map((r, i) => i === 3 ? { cells: r, emphasis: "total" as const } : r)} minWidth={420} /></DataDisclosure>}>
      <div className="flex h-10 overflow-hidden rounded-md" role="img" aria-label="Fixed-structure establishments 70.6%, open-space businesses 26.3%, mobile businesses 3.1%">
        {enterpriseTypes.slice(0, 3).map((r, i) => <div key={r[0]} style={{ width: r[2], background: typeColors[i] }} className="flex items-center justify-center text-[12.5px] font-semibold text-white">{parseFloat(r[2]) > 5 ? r[2] : ""}</div>)}
      </div>
      <ul className="mt-4 space-y-3">
        {enterpriseTypes.slice(0, 3).map((r, i) => (
          <li key={r[0]} className="flex items-start justify-between gap-3 text-[13px]">
            <span className="flex items-start gap-2"><span aria-hidden className="mt-1 h-2.5 w-2.5 rounded-[2px]" style={{ background: typeColors[i] }} /><span className="text-body">{r[0]}</span></span>
            <span className="tabular text-right"><span className="font-semibold text-ink">{r[1]}</span> <span className="text-subtle">· {r[2]}</span></span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}

export function SizeCard() {
  const groups = [{ label: "Share of establishments", col: 1 }, { label: "Share of persons engaged", col: 2 }];
  return (
    <ChartCard title="Small firms, different employment footprints" subtitle="Share by establishment size, %" period="2024"
      explain={getGroupExplanation("enterprises", "Establishment size and persons engaged", [1])}
      notes="Size is persons engaged, including owners and unpaid workers: micro 1–5, small 6–30, medium 31–100, large over 100. Just 4,874 large firms engage about 1.5 million people."
      source="GSS 2024 IBES I · Figure 5.10, p. 50"
      footer={<DataDisclosure><DataTable caption="Establishments and persons engaged by size" headings={["Size", "Share of establishments", "Share of persons engaged", "Formal within size"]} rows={establishmentSize} minWidth={480} /></DataDisclosure>}>
      <Legend className="mb-3" items={establishmentSize.map((r, i) => ({ label: r[0].split(" (")[0], color: sizeColors[i] }))} />
      {groups.map(g => (
        <div key={g.label} className="mb-4">
          <p className="mb-1.5 text-xs font-medium text-muted">{g.label}</p>
          <div className="flex h-9 overflow-hidden rounded-md" role="img" aria-label={`${g.label}: ${establishmentSize.map(r => `${r[0]} ${r[g.col]}`).join(", ")}`}>
            {establishmentSize.map((r, i) => { const s = parseFloat(r[g.col]); return <div key={r[0]} style={{ width: `${s}%`, background: sizeColors[i] }} className="flex items-center justify-center text-[12px] font-semibold text-white">{s >= 8 ? r[g.col] : ""}</div>; })}
          </div>
        </div>
      ))}
      <p className="text-[13px] leading-relaxed text-body">Micro establishments are <span className="tabular font-semibold text-ink">90.4%</span> of establishments but engage <span className="tabular font-semibold text-ink">41.9%</span> of people; large firms are <span className="tabular font-semibold text-ink">0.3%</span> of establishments and engage <span className="tabular font-semibold text-ink">21.7%</span>.</p>
    </ChartCard>
  );
}

export function FormalityCard() {
  return (
    <ChartCard title="Formality and management by size" subtitle="% of establishments within each size group" period="2024"
      explain={getGroupExplanation("enterprises", "Formality and digital finance", [2])}
      notes="Rates within each size group, not shares of all establishments; they should not be added across groups. The remainder of each management bar is jointly managed by women and men."
      source="GSS 2024 IBES I · Table 5.5, p. 51"
      footer={<DataDisclosure><DataTable caption="Formality and management by size" headings={["Size", "Formal (%)", "Managed by women only (%)", "Managed by men only (%)", "Jointly managed (%)"]} rows={managementBySize.map(r => ({ cells: [r.size, r.formal, r.women, r.men, +(100 - r.women - r.men).toFixed(1)], emphasis: r.size === "All sizes" ? "total" as const : undefined }))} decimals={1} minWidth={560} unitNote="Jointly managed share derived as the remainder of 100%." /></DataDisclosure>}>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[13.5px] font-semibold text-ink">Formal (registered)</p>
          <ul className="space-y-2.5">
            {managementBySize.map((r, i) => (
              <li key={r.size} className="grid grid-cols-[4.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-[13px]">
                <span className={r.size === "All sizes" ? "font-semibold text-ink" : "text-body"}>{r.size}</span>
                <span className="h-3 rounded-sm bg-surface-muted"><span className="block h-full rounded-sm" style={{ width: `${r.formal}%`, background: r.size === "All sizes" ? C.ink : sizeColors[i] }} /></span>
                <span className="tabular text-right font-semibold text-ink">{r.formal.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-[13.5px] font-semibold text-ink">Who manages the establishment</p>
          <Legend className="mb-2" items={[{ label: "Women only", color: C.rose }, { label: "Men only", color: C.blue }, { label: "Jointly", color: C.slateLight }]} />
          <ul className="space-y-2.5">
            {managementBySize.map(r => (
              <li key={r.size} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 text-[13px]">
                <span className={r.size === "All sizes" ? "font-semibold text-ink" : "text-body"}>{r.size}</span>
                <span className="flex h-4 overflow-hidden rounded-sm" role="img" aria-label={`${r.size}: women only ${r.women}%, men only ${r.men}%`}>
                  <span style={{ width: `${r.women}%`, background: C.rose }} /><span style={{ width: `${r.men}%`, background: C.blue }} /><span style={{ width: `${100 - r.women - r.men}%`, background: C.slateLight }} />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-xs leading-relaxed text-subtle">Women manage 59.4% of micro establishments alone, but only 5.8% of large ones.</p>
        </div>
      </div>
    </ChartCard>
  );
}

export function StartYearCard() {
  const data = establishmentsByStart.map(([period, value]) => ({ period, value }));
  return (
    <ChartCard title="Establishments operating in 2024, by year started" subtitle="Number of establishments" period="2024"
      explain={getGroupExplanation("enterprises", "Businesses and establishments", [0])}
      notes="Counts only businesses still open in 2024, so it shows survivors rather than how many started in each period. Seven in ten started between 2015 and 2023."
      source="GSS 2024 IBES I · Figure 5.9, p. 50"
      footer={<DataDisclosure><DataTable caption="Establishments by period started" headings={["Period started", "Establishments"]} rows={data.map(d => [d.period, d.value])} decimals={0} minWidth={300} /></DataDisclosure>}>
      <ChartFrame height={230} label="Establishments operating in 2024 by period started: 1,325,880 started in 2015–2023">
        <BarChart data={data} margin={{ top: 22, right: 4, left: 4, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="period" {...axisCommon} tick={tickSmall} interval={0} />
          <YAxis {...axisCommon} tick={tick} width={44} tickFormatter={v => v === 0 ? "0" : `${v / 1e6}M`} domain={[0, 1500000]} ticks={[0, 500000, 1000000, 1500000]} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ format: v => v.toLocaleString("en-GB") })} />
          <Bar dataKey="value" name="Establishments" fill={C.purple} radius={[3, 3, 0, 0]} isAnimationActive={false}>
            <LabelList dataKey="value" position="top" formatter={(v: unknown) => Number(v).toLocaleString("en-GB")} style={{ ...labelStyle, fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function RegionalConditionsCard() {
  return (
    <ChartCard title="The same country, different business conditions" subtitle="Highest and lowest region against the national figure, %" period="2024"
      explain={getGroupExplanation("enterprises", "Formality and digital finance", [2])}
      notes="Only the highest and lowest regions are published for each indicator. A business in Greater Accra is about seven times as likely to be formal as one in North East."
      source="GSS 2024 IBES I · Table 5.6, p. 51"
      footer={<DataDisclosure><DataTable caption="Business conditions by region" headings={["Indicator", "Lowest region", "Lowest (%)", "Ghana (%)", "Highest region", "Highest (%)"]} rows={businessConditionsByRegion.map(r => [r.indicator, r.low[0], r.low[1], r.ghana, r.high[0], r.high[1]])} decimals={[undefined, undefined, 1, 1, undefined, 1]} minWidth={640} /></DataDisclosure>}>
      <Legend className="mb-3" items={[{ label: "Lowest region", color: C.amber, shape: "dot" }, { label: "Ghana", color: C.ink, shape: "dot" }, { label: "Highest region", color: C.purple, shape: "dot" }]} />
      <ul className="space-y-5">
        {businessConditionsByRegion.map(r => (
          <li key={r.indicator}>
            <p className="mb-1.5 text-[13px] font-medium text-ink">{r.indicator}</p>
            <div className="relative h-6">
              <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
              <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-line" style={{ left: `${r.low[1]}%`, width: `${r.high[1] - r.low[1]}%` }} />
              {[{ v: r.low[1], c: C.amber }, { v: r.ghana, c: C.ink }, { v: r.high[1], c: C.purple }].map((p, i) => <span key={i} className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow" style={{ left: `${p.v}%`, background: p.c }} />)}
            </div>
            <p className="tabular mt-1 flex flex-wrap justify-between gap-x-3 text-xs text-muted"><span>{r.low[0]} {r.low[1]}%</span><span className="font-semibold text-ink">Ghana {r.ghana}%</span><span>{r.high[0]} {r.high[1]}%</span></p>
          </li>
        ))}
      </ul>
      <div className="tabular mt-3 flex justify-between text-xs text-subtle"><span>0%</span><span>50%</span><span>100%</span></div>
    </ChartCard>
  );
}

export function WithoutWallsCard() {
  return (
    <ChartCard title="Businesses without walls: open-space and mobile" subtitle="Profile of the 776,668 businesses working outside a building" period="2024"
      explain={getGroupExplanation("enterprises", "Businesses and establishments", [0])}
      notes={`Mostly women, mostly Ghanaian, mostly selling food. Six in ten mobile operators (${enterpriseFacts.mobileYouth.toLocaleString("en-GB")}) are aged 15–35, and ${enterpriseFacts.mobileChildren.toLocaleString("en-GB")} are children aged 10–14. Daily sales are money taken in, not profit.`}
      source="GSS 2024 IBES I · Table 5.7, p. 52">
      <div className="scroll-hint overflow-x-auto rounded-[var(--radius-sm)] border border-line" tabIndex={0} role="region" aria-label="Open-space and mobile businesses compared">
        <table className="w-full min-w-[520px] text-[13px]">
          <caption className="sr-only">Open-space and mobile businesses side by side, 2024</caption>
          <thead className="bg-surface-muted text-muted"><tr><th scope="col" className="px-3 py-2.5 text-left font-semibold">Feature</th><th scope="col" className="px-3 py-2.5 text-left font-semibold">Open-space businesses</th><th scope="col" className="px-3 py-2.5 text-left font-semibold">Mobile businesses</th></tr></thead>
          <tbody>{openSpaceVsMobile.map(r => <tr key={r[0]} className="border-t border-line"><th scope="row" className="px-3 py-2.5 text-left font-medium text-ink">{r[0]}</th><td className="tabular px-3 py-2.5 text-body">{r[1]}</td><td className="tabular px-3 py-2.5 text-body">{r[2]}</td></tr>)}</tbody>
        </table>
      </div>
    </ChartCard>
  );
}

export function EnterpriseGrid() {
  return (
    <>
      <EnterpriseStats />
      <Grid cols={2} className="mt-4 lg:mt-5"><BusinessTypesCard /><SizeCard /></Grid>
      <Grid cols={2} className="mt-4 lg:mt-5"><FormalityCard /><RegionalConditionsCard /></Grid>
      <Grid cols={2} className="mt-4 lg:mt-5"><StartYearCard /><WithoutWallsCard /></Grid>
    </>
  );
}
