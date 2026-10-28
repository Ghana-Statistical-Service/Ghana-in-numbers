"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard, Stat } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Legend, Segmented, type TableRow } from "@/components/ui/Data";
import { Grid } from "@/components/ui/Page";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, num, tick, tickSmall } from "@/components/ui/chart";
import { getGroupExplanation } from "@/data/cardExplanationContent";
import { indicatorExplanations } from "@/data/indicatorExplanations";
import { monetaryIndicators } from "@/data/reportAdditions";
import { fiscalNominal as N, fiscalShareOfGdp as P, nominalCreditGrowth } from "@/data/publicationAdditions";

type Basis = "commitment" | "cash";
type Unit = "bn" | "gdp";
const YEARS = N.years;
const bn = (values: number[]) => values.map(v => v / 1000);

export function FiscalSection() {
  const [basis, setBasis] = useState<Basis>("commitment");
  const [unit, setUnit] = useState<Unit>("bn");
  const isCash = basis === "cash";
  const u = unit === "bn" ? " GH¢ bn" : "% of GDP";
  const pick = (nominal: number[], share: number[]) => unit === "bn" ? bn(nominal) : share;
  const revenue = pick(N.revenue.total, P.revenue.total);
  const tax = pick(N.revenue.tax, P.revenue.tax);
  const spending = pick(isCash ? N.expenditure.cash : N.expenditure.commitment, isCash ? P.expenditure.cash : P.expenditure.commitment);
  const overall = pick(isCash ? N.balance.overallCash : N.balance.overallCommitment, isCash ? P.balance.overallCash : P.balance.overallCommitment);
  const primary = pick(isCash ? N.balance.primaryCash : N.balance.primaryCommitment, isCash ? P.balance.primaryCash : P.balance.primaryCommitment);
  const fmt = (v: number) => unit === "bn" ? `${num(v)} GH¢ bn` : `${num(v)}% of GDP`;
  const trend = YEARS.map((year, i) => ({ year, revenue: revenue[i], tax: tax[i], spending: spending[i] }));
  const balances = YEARS.map((year, i) => ({ year, overall: overall[i], primary: primary[i] }));
  const basisLabel = isCash ? "Cash basis" : "Commitment basis";

  const revenueMix = YEARS.map((year, i) => ({ year, _top: 0.001, tax: N.revenue.tax[i] / 1000, nonTax: N.revenue.nonTax[i] / 1000, social: N.revenue.socialContributions[i] / 1000, other: N.revenue.other[i] / 1000, grants: N.revenue.grants[i] / 1000 }));
  const spendMix = YEARS.map((year, i) => ({ year, _top: 0.001, compensation: N.expenditure.compensation[i] / 1000, interest: N.expenditure.interest[i] / 1000, transfers: N.expenditure.grantsToUnits[i] / 1000, capital: N.expenditure.capital[i] / 1000, goods: N.expenditure.goodsServices[i] / 1000, social: N.expenditure.socialBenefits[i] / 1000, other: N.expenditure.other[i] / 1000, claims: N.expenditure.outstandingClaims[i] / 1000 }));
  const revSeries = [{ key: "tax", label: "Tax revenue", color: C.purple }, { key: "nonTax", label: "Non-tax revenue", color: C.blue }, { key: "other", label: "Other revenue", color: C.teal }, { key: "grants", label: "Grants", color: C.amber }, { key: "social", label: "Social contributions", color: C.rose }];
  const spendSeries = [{ key: "compensation", label: "Compensation of employees", color: C.purple }, { key: "interest", label: "Interest payments", color: C.rose }, { key: "transfers", label: "Grants to other government units", color: C.blue }, { key: "capital", label: "Capital expenditure", color: C.teal }, { key: "goods", label: "Goods and services", color: C.amber }, { key: "social", label: "Social benefits", color: "#8E6AC8" }, { key: "other", label: "Other expenditure", color: C.slate }, { key: "claims", label: "Other outstanding expenditure claims", color: C.slateLight }];

  const tableRows: TableRow[] = [
    { cells: ["Total revenue and grants", ...N.revenue.total], emphasis: "subtotal" },
    { cells: ["Tax revenue", ...N.revenue.tax], depth: 1 }, { cells: ["Non-tax revenue", ...N.revenue.nonTax], depth: 1 }, { cells: ["Social contributions", ...N.revenue.socialContributions], depth: 1 }, { cells: ["Other revenue", ...N.revenue.other], depth: 1 }, { cells: ["Grants", ...N.revenue.grants], depth: 1 },
    { cells: ["Total expenditure (cash)", ...N.expenditure.cash], emphasis: "subtotal" },
    { cells: ["Total expenditure (commitment)", ...N.expenditure.commitment], emphasis: "subtotal" },
    { cells: ["Primary expenditure (cash)", ...N.expenditure.primaryCash], depth: 1 }, { cells: ["Primary expenditure (commitment)", ...N.expenditure.primaryCommitment], depth: 1 },
    { cells: ["Compensation of employees", ...N.expenditure.compensation], depth: 1 }, { cells: ["Interest payments", ...N.expenditure.interest], depth: 1 }, { cells: ["Use of goods and services", ...N.expenditure.goodsServices], depth: 1 }, { cells: ["Capital expenditure", ...N.expenditure.capital], depth: 1 }, { cells: ["Grants to other government units", ...N.expenditure.grantsToUnits], depth: 1 }, { cells: ["Social benefits", ...N.expenditure.socialBenefits], depth: 1 }, { cells: ["Other expenditures", ...N.expenditure.other], depth: 1 }, { cells: ["Other outstanding expenditure claims", ...N.expenditure.outstandingClaims], depth: 1 }, { cells: ["Payables/arrears clearance (net)", ...N.expenditure.arrearsClearance], depth: 1 },
    { cells: ["Overall balance (commitment)", ...N.balance.overallCommitment], emphasis: "total" }, { cells: ["Overall balance (cash)", ...N.balance.overallCash], emphasis: "total" }, { cells: ["Primary balance (commitment)", ...N.balance.primaryCommitment], emphasis: "total" }, { cells: ["Primary balance (cash)", ...N.balance.primaryCash], emphasis: "total" },
    ["Nominal GDP", ...N.gdp],
  ];
  const shareRows: TableRow[] = [
    { cells: ["Total revenue and grants", ...P.revenue.total], emphasis: "subtotal" }, { cells: ["Tax revenue", ...P.revenue.tax], depth: 1 }, { cells: ["Non-tax revenue", ...P.revenue.nonTax], depth: 1 }, { cells: ["Social contributions", ...P.revenue.socialContributions], depth: 1 }, { cells: ["Other revenue", ...P.revenue.other], depth: 1 }, { cells: ["Grants", ...P.revenue.grants], depth: 1 },
    { cells: ["Total expenditure (cash)", ...P.expenditure.cash], emphasis: "subtotal" }, { cells: ["Total expenditure (commitment)", ...P.expenditure.commitment], emphasis: "subtotal" },
    { cells: ["Primary expenditure (cash)", ...P.expenditure.primaryCash], depth: 1 }, { cells: ["Primary expenditure (commitment)", ...P.expenditure.primaryCommitment], depth: 1 }, { cells: ["Compensation of employees", ...P.expenditure.compensation], depth: 1 }, { cells: ["Interest payments", ...P.expenditure.interest], depth: 1 }, { cells: ["Use of goods and services", ...P.expenditure.goodsServices], depth: 1 }, { cells: ["Capital expenditure", ...P.expenditure.capital], depth: 1 }, { cells: ["Grants to other government units", ...P.expenditure.grantsToUnits], depth: 1 }, { cells: ["Social benefits", ...P.expenditure.socialBenefits], depth: 1 }, { cells: ["Other expenditures", ...P.expenditure.other], depth: 1 }, { cells: ["Payables/arrears clearance (net)", ...P.expenditure.arrearsClearance], depth: 1 },
    { cells: ["Overall balance (cash)", ...P.balance.overallCash], emphasis: "total" }, { cells: ["Overall balance (commitment)", ...P.balance.overallCommitment], emphasis: "total" }, { cells: ["Primary balance (cash)", ...P.balance.primaryCash], emphasis: "total" }, { cells: ["Primary balance (commitment)", ...P.balance.primaryCommitment], emphasis: "total" },
  ];

  return (
    <div className="space-y-4 lg:space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] border border-line bg-surface px-4 py-3 shadow-card">
        <span className="text-[13px] font-medium text-muted">Show figures</span>
        <Segmented label="Fiscal accounting basis" value={basis} onChange={setBasis} options={[{ value: "commitment", label: "Commitment basis" }, { value: "cash", label: "Cash basis" }]} />
        <Segmented label="Unit" value={unit} onChange={setUnit} options={[{ value: "bn", label: "GH¢ billion" }, { value: "gdp", label: "% of GDP" }]} />
        <span className="text-xs text-subtle sm:ml-auto">Applies to the figures and the first two charts</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Revenue and grants, 2025" value={num(revenue[3])} unit={u.trim()} context="Same on both bases" />
        <Stat label={`Expenditure, 2025 · ${basisLabel.toLowerCase()}`} value={num(spending[3])} unit={u.trim()} context={isCash ? "Payments made, including old bills" : "Obligations incurred in the year"} />
        <Stat tone="brand" label={`Overall balance, 2025 · ${isCash ? "cash" : "commitment"}`} value={`${overall[3] < 0 ? "−" : "+"}${num(Math.abs(overall[3]))}`} unit={u.trim()} context="Negative = deficit" />
        <Stat label={`Primary balance, 2025 · ${isCash ? "cash" : "commitment"}`} value={`${primary[3] < 0 ? "−" : "+"}${num(Math.abs(primary[3]))}`} unit={u.trim()} context="Excludes interest; positive = surplus" />
      </div>

      <Grid cols={2}>
        <ChartCard title="Revenue and expenditure" subtitle={unit === "bn" ? "GH¢ billion, nominal" : "% of GDP"} period={`2022–2025 · ${basisLabel}`}
          explain={getGroupExplanation("fiscal", "Revenue and expenditure", [0, 1])}
          notes={unit === "bn" ? "Revenue more than doubled in cedis since 2022, but stayed within 15.3–15.8% of GDP (switch to % of GDP). Tax revenue is part of the total, not an addition to it." : "Measured against the economy, revenue barely moved while commitment spending fell from 27.5% to 16.6% of GDP."}
          source="Ministry of Finance · Tables 5.9–5.10, pp. 64–65">
          <Legend className="mb-1" items={[{ label: "Revenue and grants", color: C.teal, shape: "line" }, { label: "Tax revenue (included)", color: C.teal, shape: "dash" }, { label: `Expenditure (${basis})`, color: C.purple, shape: "line" }]} />
          <ChartFrame height={250} label={`Revenue, tax revenue and ${basis} expenditure, 2022 to 2025, in ${unit === "bn" ? "billion cedis" : "percent of GDP"}`}>
            <LineChart data={trend} margin={{ top: 20, right: 28, left: -4, bottom: 0 }}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="year" {...axisCommon} tick={tick} padding={{ left: 16, right: 16 }} />
              <YAxis {...axisCommon} tick={tick} width={44} domain={[0, unit === "bn" ? 300 : 30]} tickFormatter={v => unit === "bn" ? `${v}` : `${v}%`} />
              <Tooltip content={makeTooltip({ format: fmt })} />
              <Line dataKey="revenue" name="Revenue and grants" stroke={C.teal} strokeWidth={2.5} dot={{ r: 3.5, fill: C.teal }} isAnimationActive={false}><LabelList dataKey="revenue" position="bottom" offset={9} formatter={(v: unknown) => num(Number(v))} style={{ ...labelStyle, fontSize: 12, fill: "#0B6E64" }} /></Line>
              <Line dataKey="tax" name="Tax revenue (included in total)" stroke={C.teal} strokeWidth={1.75} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
              <Line dataKey="spending" name={`Expenditure (${basis})`} stroke={C.purple} strokeWidth={2.5} dot={{ r: 3.5, fill: C.purple }} isAnimationActive={false}><LabelList dataKey="spending" position="top" offset={9} formatter={(v: unknown) => num(Number(v))} style={{ ...labelStyle, fontSize: 12, fill: C.purple }} /></Line>
            </LineChart>
          </ChartFrame>
        </ChartCard>

        <ChartCard title="Deficits and surpluses" subtitle={unit === "bn" ? "GH¢ billion" : "% of GDP"} period={`2022–2025 · ${basisLabel}`}
          explain={getGroupExplanation("fiscal", "Fiscal balances", [3, 4])}
          notes="Bars below zero are deficits. The overall balance includes interest; the primary balance excludes it. On the commitment basis the deficit narrowed from 6.9% of GDP (2024) to 1.0% (2025), partly because capital spending fell."
          source="Ministry of Finance · Tables 5.9–5.10, pp. 64–65">
          <Legend className="mb-1" items={[{ label: "Overall balance", color: C.purple }, { label: "Primary balance", color: C.teal }]} />
          <ChartFrame height={250} label={`Overall and primary balances, ${basis} basis, 2022 to 2025`}>
            <BarChart data={balances} margin={{ top: 20, right: 8, left: -4, bottom: 0 }} barGap={2}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="year" {...axisCommon} tick={tick} />
              <YAxis {...axisCommon} tick={tick} width={44} domain={unit === "bn" ? [-100, 50] : [-12, 4]} ticks={unit === "bn" ? [-100, -75, -50, -25, 0, 25, 50] : [-12, -8, -4, 0, 4]} tickFormatter={v => unit === "bn" ? `${v}` : `${v}%`} />
              <ReferenceLine y={0} stroke={C.slate} />
              <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ format: v => `${v < 0 ? "Deficit" : "Surplus"} ${fmt(Math.abs(v))}` })} />
              <Bar dataKey="overall" name="Overall balance" fill={C.purple} radius={2} isAnimationActive={false}><LabelList dataKey="overall" content={p => { const { x, y, width, height, value } = p as { x: number; y: number; width: number; height: number; value: number }; const below = value < 0; return <text x={x + width / 2} y={below ? y + Math.abs(height) + 13 : y - 6} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>{num(value)}</text>; }} /></Bar>
              <Bar dataKey="primary" name="Primary balance" fill={C.teal} radius={2} isAnimationActive={false}><LabelList dataKey="primary" content={p => { const { x, y, width, height, value } = p as { x: number; y: number; width: number; height: number; value: number }; const below = value < 0; return <text x={x + width / 2} y={below ? y + Math.abs(height) + 13 : y - 6} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>{num(value)}</text>; }} /></Bar>
            </BarChart>
          </ChartFrame>
        </ChartCard>
      </Grid>

      <Grid cols={2}>
        <ChartCard title="Where the money came from" subtitle="Revenue and grants by source, GH¢ billion" period="2022–2025"
          explain={getGroupExplanation("fiscal", "Revenue, grants and tax revenue", [0])}
          notes="The five sources add up to total revenue and grants. About 82 of every 100 cedis came from taxes in 2025; grants were less than one cedi in a hundred."
          source="Ministry of Finance · Table 5.9, p. 64">
          <Legend className="mb-2" items={revSeries.map(s => ({ label: s.label, color: s.color }))} />
          <ChartFrame height={240} label="Revenue and grants by source, 2022 to 2025">
            <BarChart data={revenueMix} margin={{ top: 22, right: 8, left: -4, bottom: 0 }}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="year" {...axisCommon} tick={tick} />
              <YAxis {...axisCommon} tick={tick} width={44} domain={[0, 250]} ticks={[0, 50, 100, 150, 200, 250]} />
              <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: " GH¢ bn" })} />
              {revSeries.map(s => <Bar key={s.key} dataKey={s.key} name={s.label} stackId="r" fill={s.color} isAnimationActive={false} maxBarSize={64} />)}
              <Bar dataKey="_top" name="_hidden" stackId="r" fill="transparent" isAnimationActive={false} maxBarSize={64} legendType="none"><LabelList content={p => { const { x, y, width, index } = p as { x: number; y: number; width: number; index: number }; return <text x={x + width / 2} y={y - 7} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>{num(N.revenue.total[index] / 1000)}</text>; }} /></Bar>
            </BarChart>
          </ChartFrame>
        </ChartCard>

        <ChartCard title="Where committed spending went" subtitle="Commitment-basis expenditure by item, GH¢ billion" period="2022–2025"
          explain={getGroupExplanation("fiscal", "Compensation, interest and capital expenditure", [2])}
          notes="Items add up to commitment expenditure. In 2025 compensation and interest together took about 57% of revenue and grants, while capital spending fell 31.1% to GH¢20.2 billion (1.4% of GDP)."
          source="Ministry of Finance · Table 5.9, p. 64">
          <Legend className="mb-2" items={spendSeries.map(s => ({ label: s.label, color: s.color }))} />
          <ChartFrame height={240} label="Commitment expenditure by item, 2022 to 2025">
            <BarChart data={spendMix} margin={{ top: 22, right: 8, left: -4, bottom: 0 }}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="year" {...axisCommon} tick={tick} />
              <YAxis {...axisCommon} tick={tick} width={44} domain={[0, 300]} />
              <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: " GH¢ bn" })} />
              {spendSeries.map(s => <Bar key={s.key} dataKey={s.key} name={s.label} stackId="e" fill={s.color} isAnimationActive={false} maxBarSize={64} />)}
              <Bar dataKey="_top" name="_hidden" stackId="e" fill="transparent" isAnimationActive={false} maxBarSize={64} legendType="none"><LabelList content={p => { const { x, y, width, index } = p as { x: number; y: number; width: number; index: number }; return <text x={x + width / 2} y={y - 7} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>{num(N.expenditure.commitment[index] / 1000)}</text>; }} /></Bar>
            </BarChart>
          </ChartFrame>
        </ChartCard>
      </Grid>

      <ChartCard title="From commitments to cash payments" subtitle="Net change in unpaid bills (arrears), GH¢ billion · positive = bills built up, negative = bills cleared" period="2022–2025"
        explain={getGroupExplanation("fiscal", "Cash and commitment expenditure", [1])}
        notes="Cash expenditure = commitment expenditure − net change in unpaid bills. In 2025 the government cleared GH¢29.5 billion of old bills (2.1% of GDP), so cash spending (GH¢268.3 billion) exceeded commitments (GH¢238.7 billion)."
        source="Ministry of Finance · Table 5.9, p. 64"
        footer={<DataDisclosure hint="Tables 5.9 and 5.10"><DataTable caption="Selected fiscal indicators, nominal GH¢ million" headings={["Indicator (GH¢ million)", ...YEARS]} rows={tableRows} decimals={0} minWidth={640} /><DataTable caption="Selected fiscal indicators, percent of GDP" headings={["Indicator (% of GDP)", ...YEARS]} rows={shareRows} decimals={1} minWidth={640} unitNote="Indented rows break down their parent and must not be added to it. Published totals may differ from arithmetic on rounded components." /></DataDisclosure>}>
        <ChartFrame height={190} label="Net change in arrears: 2022 +7.0, 2023 +3.5, 2024 +20.1, 2025 −29.5 billion cedis">
          <BarChart data={YEARS.map((year, i) => ({ year, value: N.expenditure.arrearsClearance[i] / 1000 }))} layout="vertical" margin={{ top: 0, right: 48, left: 0, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid stroke={C.grid} horizontal={false} />
            <XAxis type="number" {...axisCommon} tick={tick} domain={[-35, 25]} ticks={[-30, -20, -10, 0, 10, 20]} />
            <YAxis type="category" dataKey="year" {...axisCommon} tick={{ ...tick, fill: C.ink }} width={44} />
            <ReferenceLine x={0} stroke={C.slate} />
            <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ format: v => v < 0 ? `Cleared GH¢${num(-v)} bn` : `Built up GH¢${num(v)} bn` })} />
            <Bar dataKey="value" name="Net change in unpaid bills" isAnimationActive={false} radius={2}>
              {N.expenditure.arrearsClearance.map((v, i) => <Cell key={i} fill={v < 0 ? C.teal : C.amber} />)}
              <LabelList dataKey="value" position="right" formatter={(v: unknown) => `${Number(v) > 0 ? "+" : "−"}${num(Math.abs(Number(v)))}`} style={labelStyle} />
            </Bar>
          </BarChart>
        </ChartFrame>
      </ChartCard>
    </div>
  );
}

/* ── Monetary and financial sector ───────────────────────────────────────── */

type FinRow = { title: string; unit: string; values: number[]; guide: number; common?: boolean };
const rowFrom = (i: number, guide: number, unit: string): FinRow => ({ title: String(monetaryIndicators[i][0]).replace(/ \((GH¢|US\$) bn\)| \(%\)| \(months of import cover\)/g, ""), unit, values: monetaryIndicators[i].slice(1).map(Number), guide });
const groups: { key: string; label: string; note: string; rows: FinRow[]; commonScale?: [number, number] }[] = [
  { key: "money", label: "Money and credit", note: "Each indicator keeps its own unit and scale.", rows: [rowFrom(0, 0, "GH¢ billion"), rowFrom(1, 0, "%"), rowFrom(2, 1, "GH¢ billion"), { title: "Nominal private-sector credit growth", unit: "%", values: nominalCreditGrowth, guide: 1 }, rowFrom(3, 1, "%"), rowFrom(4, 1, "% of GDP"), rowFrom(5, 2, "GH¢ billion"), rowFrom(6, 2, "GH¢ billion")] },
  { key: "rates", label: "Interest rates", note: "End-of-year rates on a common 0–40% scale.", commonScale: [0, 40], rows: [rowFrom(9, 4, "%"), rowFrom(10, 4, "%"), rowFrom(11, 4, "%"), rowFrom(12, 5, "%"), rowFrom(13, 5, "%"), rowFrom(14, 5, "%")] },
  { key: "reserves", label: "External reserves", note: "Separate units and scales.", rows: [rowFrom(7, 3, "US$ billion"), rowFrom(8, 3, "months of imports")] },
  { key: "health", label: "Banking health", note: "Separate scales. ROA is before tax; ROE is after tax.", rows: [rowFrom(15, 6, "%"), rowFrom(16, 6, "%"), rowFrom(17, 7, "%"), rowFrom(18, 7, "%")] },
];

function FinanceTile({ row, scale }: { row: FinRow; scale?: [number, number] }) {
  const guide = indicatorExplanations.finance[row.guide];
  const data = row.values.map((value, i) => ({ year: String(2022 + i), value }));
  const delta = row.values[3] - row.values[2];
  const min = Math.min(0, ...row.values), max = Math.max(...row.values);
  const domain: [number, number] = scale ?? [min < 0 ? Math.floor(min * 1.2) : 0, Math.ceil(max * 1.15)];
  const pp = row.unit.startsWith("%");
  return (
    <ChartCard title={row.title} subtitle={row.unit} period="2022–2025" explainCompact
      explain={{ title: row.title, meaning: guide.meaning, story: guide.reading, why: guide.why, source: guide.source }}>
      <p className="tabular flex flex-wrap items-baseline gap-x-2"><span className="text-2xl font-semibold tracking-tight text-ink">{num(row.values[3])}</span><span className="text-[13px] text-muted">{row.unit} in 2025</span></p>
      <p className="tabular mt-0.5 text-xs text-muted">{delta < 0 ? "−" : "+"}{num(Math.abs(delta))} {pp ? "percentage points" : row.unit} from 2024</p>
      <ChartFrame height={120} label={`${row.title}: ${data.map(d => `${d.year} ${num(d.value)}`).join(", ")}`}>
        <LineChart data={data} margin={{ top: 18, right: 18, left: 18, bottom: 0 }}>
          <XAxis dataKey="year" {...axisCommon} tick={tickSmall} />
          <YAxis hide domain={domain} />
          {min < 0 && <ReferenceLine y={0} stroke={C.slateLight} strokeDasharray="3 3" />}
          <Tooltip content={makeTooltip({ unit: pp ? "%" : ` ${row.unit}` })} />
          <Line dataKey="value" name={row.title} stroke={C.purple} strokeWidth={2.25} dot={{ r: 3, fill: C.purple }} isAnimationActive={false}>
            <LabelList dataKey="value" position="top" offset={7} formatter={(v: unknown) => num(Number(v))} style={{ ...labelStyle, fontSize: 12 }} />
          </Line>
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function FinanceSection() {
  const [selected, setSelected] = useState("money");
  const group = groups.find(g => g.key === selected)!;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented label="Financial indicator group" value={selected} onChange={setSelected} options={groups.map(g => ({ value: g.key, label: g.label }))} />
        <p className="text-xs text-subtle">{group.note}</p>
      </div>
      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${group.rows.length > 2 ? "xl:grid-cols-4" : ""}`}>
        {group.rows.map(row => <FinanceTile key={row.title} row={row} scale={group.commonScale} />)}
      </div>
      <DataDisclosure hint="Table 5.11, all 20 indicators">
        <DataTable caption="Monetary and financial indicators, 2022–2025" headings={["Indicator (end of period unless stated)", "2022", "2023", "2024", "2025"]}
          rows={[...monetaryIndicators.slice(0, 3).map(r => r as TableRow), ["Nominal private-sector credit growth (%)", ...nominalCreditGrowth], ...monetaryIndicators.slice(3).map(r => r as TableRow)]} decimals={1} minWidth={560}
          unitNote="Source: Bank of Ghana · Table 5.11, p. 70. The nominal credit-growth row (31.8, 10.7, 26.3, 19.2) is published in Table 5.11 and Table 2.1." />
      </DataDisclosure>
    </div>
  );
}
