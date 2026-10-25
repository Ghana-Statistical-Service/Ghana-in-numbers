"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard, Stat } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Legend, Segmented } from "@/components/ui/Data";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, num, tick, tickSmall } from "@/components/ui/chart";
import { neetData, neetRegionalData, nationalUnemployment, populationShareData, skillsAlignment, unemploymentByRegion, type NeetDim } from "@/data/youthBulgeData";

export function DefinitionsCard() {
  return (
    <ChartCard title="Who counts as a youth?" subtitle="Two definitions used in the publication" period="2000–2025" explain={{ indicator: "youth" }}
      notes="The age bands overlap (15–24 is inside 15–35), so their shares must not be added. Only the end points shown are printed; intermediate years are described, not tabulated."
      source="Ghana in Numbers 2025, pp. 108–109">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius-md)] border border-line p-4">
          <p className="text-[13.5px] font-semibold text-ink">Ages 15–24 · international definition</p>
          <p className="tabular mt-2 text-2xl font-semibold text-ink">16% <span className="text-[13px] font-normal text-muted">of the population, 2025</span></p>
          <p className="mt-2 text-[13px] leading-relaxed text-body">Steady at about 18% between 2000 and 2025, peaking at 18.9% in 2008: inside the 15–20% band used to define a youth bulge.</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-line p-4">
          <p className="text-[13.5px] font-semibold text-ink">Ages 15–35 · African Union and National Youth Policy</p>
          <p className="tabular mt-2 text-2xl font-semibold text-ink">≈30% <span className="text-[13px] font-normal text-muted">of the population, 2025</span></p>
          <p className="mt-2 text-[13px] leading-relaxed text-body">Averaged 31.9% over the period and peaked at 34.6% in 2000. Easing since 2019, but the number of young people remains very large.</p>
        </div>
      </div>
    </ChartCard>
  );
}

export function ShareEndpointsCard() {
  const rows = [
    { label: "Children aged 0–14", y2000: populationShareData[0].children, y2025: populationShareData[1].children, color: C.slate },
    { label: "Youth aged 15–35", y2000: populationShareData[0].youth1535, y2025: populationShareData[1].youth1535, color: C.purple },
    { label: "Youth aged 15–24", y2000: null, y2025: populationShareData[1].youth1524, color: C.amber },
  ];
  return (
    <ChartCard title="Fewer children, a large youth population" subtitle="% of the total population" period="2000 and 2025" explain={{ indicator: "youth" }}
      notes="The child share fell from 41.8% to 33.2%. The publication states a youth-to-child ratio of about 0.83 that has “barely moved since 2000”; the 2025 shares shown (30.0 / 33.2) give about 0.90. The 15–24 share for 2000 is described as about 18% but not printed."
      source="pp. 108–109"
      footer={<DataDisclosure><DataTable caption="Population shares by age group" headings={["Age group", "2000 (%)", "2025 (%)"]} rows={rows.map(r => [r.label, r.y2000, r.y2025])} decimals={1} minWidth={320} unitNote="— not printed for that year. 2025 youth shares are approximate (“about”)." /></DataDisclosure>}>
      <Legend className="mb-3" items={[{ label: "2000", color: C.slateLight, shape: "dot" }, { label: "2025", color: C.purple, shape: "dot" }]} />
      <ul className="space-y-5">
        {rows.map(r => (
          <li key={r.label}>
            <div className="mb-1 flex justify-between text-[13px]"><span className="text-ink">{r.label}</span><span className="tabular text-muted">{r.y2000 == null ? "—" : `${r.y2000}%`} → <span className="font-semibold text-ink">{r.y2025}%</span></span></div>
            <div className="relative h-4"><div className="absolute inset-x-0 top-1/2 h-px bg-line" />
              {r.y2000 != null && <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#B8C1CF]" style={{ left: `${(r.y2000 / 50) * 100}%` }} />}
              <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${((r.y2025 ?? 0) / 50) * 100}%`, background: r.color }} />
            </div>
          </li>
        ))}
      </ul>
      <div className="tabular mt-2 flex justify-between text-xs text-subtle"><span>0%</span><span>25%</span><span>50%</span></div>
    </ChartCard>
  );
}

type Quarter = "Q2" | "Q3";
type Band = "15-24" | "15-35";
const key = (q: Quarter, b: Band) => `${q.toLowerCase()}_${b.replace("-", "")}` as "q2_1524" | "q2_1535" | "q3_1524" | "q3_1535";

export function RegionalUnemploymentCard() {
  const [quarter, setQuarter] = useState<Quarter>("Q3");
  const [band, setBand] = useState<Band>("15-24");
  const k = key(quarter, band);
  const national = nationalUnemployment[k];
  const data = [...unemploymentByRegion].sort((a, b) => b[k] - a[k]).map(r => ({ region: r.region, value: r[k] }));
  return (
    <ChartCard title="Youth unemployment by region" subtitle={`Unemployed as % of the labour force aged ${band.replace("-", "–")}`} period={`${quarter} 2025`}
      explain={{ indicator: "unemployment", title: "Quarterly youth unemployment" }}
      actions={<div className="flex flex-wrap gap-2"><Segmented label="Quarter" size="sm" value={quarter} onChange={setQuarter} options={[{ value: "Q2", label: "Q2 2025" }, { value: "Q3", label: "Q3 2025" }]} /><Segmented label="Age group" size="sm" value={band} onChange={setBand} options={[{ value: "15-24", label: "15–24" }, { value: "15-35", label: "15–35" }]} /></div>}
      notes={`Dashed line: national rate (${national}%). Darker bars are at or above it. A share of the labour force, not of all young people. Quarterly rates differ from the Q1–Q3 averages (32.4% and 21.9%).`}
      source="GSS Quarterly Labour Force Survey, Q2 and Q3 2025 · Figure 9.1, p. 111"
      footer={<DataDisclosure><DataTable caption="Youth unemployment by region, 2025" headings={["Region", "Q2 15–24 (%)", "Q2 15–35 (%)", "Q3 15–24 (%)", "Q3 15–35 (%)"]} rows={[{ cells: ["National", nationalUnemployment.q2_1524, nationalUnemployment.q2_1535, nationalUnemployment.q3_1524, nationalUnemployment.q3_1535], emphasis: "total" as const }, ...unemploymentByRegion.map(r => [r.region, r.q2_1524, r.q2_1535, r.q3_1524, r.q3_1535])]} decimals={1} minWidth={520} /></DataDisclosure>}>
      <ChartFrame height={470} label={`Youth unemployment by region, ${quarter} 2025, ages ${band}. National ${national}%.`}>
        <BarChart data={data} layout="vertical" margin={{ top: 16, right: 44, left: 0, bottom: 0 }} barCategoryGap="20%">
          <CartesianGrid stroke={C.grid} horizontal={false} />
          <XAxis type="number" {...axisCommon} tick={tick} domain={[0, 60]} ticks={[0, 20, 40, 60]} tickFormatter={v => `${v}%`} />
          <YAxis type="category" dataKey="region" {...axisCommon} tick={{ ...tickSmall, fill: C.ink }} width={100} />
          <ReferenceLine x={national} stroke={C.ink} strokeDasharray="4 4" label={{ value: `National ${national}%`, position: "top", fontSize: 12, fill: C.ink, fontWeight: 600 }} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: "%" })} />
          <Bar dataKey="value" name={`Ages ${band.replace("-", "–")}`} radius={[0, 3, 3, 0]} isAnimationActive={false}>
            {data.map(d => <Cell key={d.region} fill={d.value >= national ? C.purple : C.purpleLight} />)}
            <LabelList dataKey="value" position="right" formatter={(v: unknown) => num(Number(v))} style={{ ...labelStyle, fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function NeetBreakdownCard() {
  return (
    <ChartCard title="NEET rate by sex and locality" subtitle="% of all people in the age group neither employed nor in education or training" period="Q3 2025" explain={{ indicator: "neet" }}
      notes="Women made up more than 60% of NEET people aged 15–35. Q3 rates (21.5% and 19.5%) differ from the Q1–Q3 averages (19.1% and 17.9%). Close to two million people aged 15–35 were NEET in Q3 2025."
      source="GSS QLFS Q3 2025 · Figure 9.2, p. 112"
      footer={<DataDisclosure><DataTable caption="NEET rate by group, Q3 2025" headings={["Group", "Ages 15–24 (%)", "Ages 15–35 (%)"]} rows={neetData.map(d => [d.group, d.rate1524, d.rate1535])} decimals={1} minWidth={320} /></DataDisclosure>}>
      <Legend className="mb-1" items={[{ label: "Ages 15–24", color: C.amber }, { label: "Ages 15–35", color: C.purple }]} />
      <ChartFrame height={240} label="NEET rates by sex and locality, Q3 2025">
        <BarChart data={neetData} margin={{ top: 22, right: 4, left: -8, bottom: 0 }} barGap={2}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="group" {...axisCommon} tick={tick} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 30]} ticks={[0, 10, 20, 30]} tickFormatter={v => `${v}%`} width={42} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: "%" })} />
          <Bar dataKey="rate1524" name="Ages 15–24" fill={C.amber} radius={[3, 3, 0, 0]} isAnimationActive={false}><LabelList dataKey="rate1524" position="top" formatter={(v: unknown) => num(Number(v))} style={{ ...labelStyle, fontSize: 12 }} /></Bar>
          <Bar dataKey="rate1535" name="Ages 15–35" fill={C.purple} radius={[3, 3, 0, 0]} isAnimationActive={false}><LabelList dataKey="rate1535" position="top" formatter={(v: unknown) => num(Number(v))} style={{ ...labelStyle, fontSize: 12 }} /></Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

const dims: { key: NeetDim; label: string }[] = [{ key: "regional", label: "All" }, { key: "urban", label: "Urban" }, { key: "rural", label: "Rural" }, { key: "male", label: "Male" }, { key: "female", label: "Female" }];

export function NeetRegionalCard() {
  const [dim, setDim] = useState<NeetDim>("regional");
  const rows = neetRegionalData[dim];
  const national = rows.find(r => r.region === "National")!;
  const data = rows.filter(r => r.region !== "National").sort((a, b) => b.r1524 - a.r1524);
  const label = dims.find(d => d.key === dim)!.label;
  return (
    <ChartCard title="NEET rate by region" subtitle={`${label === "All" ? "All young people" : `${label} young people`}, % of the age group`} period="Q3 2025"
      explain={{ indicator: "neet" }}
      actions={<Segmented label="Population group" size="sm" value={dim} onChange={setDim} options={dims.map(d => ({ value: d.key, label: d.label }))} />}
      notes={`National (${label.toLowerCase() === "all" ? "all" : label.toLowerCase()}): ${national.r1524}% for ages 15–24 and ${national.r1535}% for ages 15–35. Regions sorted by the 15–24 rate. These differences describe where NEET rates are higher; they do not establish why.`}
      source="GSS QLFS Q3 2025 · Figure 9.2, p. 112"
      footer={<DataDisclosure><DataTable caption={`NEET rate by region, ${label}, Q3 2025`} headings={["Region", "Ages 15–24 (%)", "Ages 15–35 (%)"]} rows={[{ cells: ["National", national.r1524, national.r1535], emphasis: "total" as const }, ...data.map(r => [r.region, r.r1524, r.r1535])]} decimals={1} minWidth={320} /></DataDisclosure>}>
      <Legend className="mb-1" items={[{ label: "Ages 15–24", color: C.amber }, { label: "Ages 15–35", color: C.purple }]} />
      <ChartFrame height={560} label={`NEET rate by region for ${label.toLowerCase()} young people, Q3 2025`}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }} barCategoryGap="18%" barGap={1}>
          <CartesianGrid stroke={C.grid} horizontal={false} />
          <XAxis type="number" {...axisCommon} tick={tick} domain={[0, 40]} ticks={[0, 10, 20, 30, 40]} tickFormatter={v => `${v}%`} />
          <YAxis type="category" dataKey="region" {...axisCommon} tick={{ ...tickSmall, fill: C.ink }} width={100} />
          <ReferenceLine x={national.r1524} stroke={C.amber} strokeDasharray="4 4" />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: "%" })} />
          <Bar dataKey="r1524" name="Ages 15–24" fill={C.amber} isAnimationActive={false}><LabelList dataKey="r1524" position="right" formatter={(v: unknown) => num(Number(v))} style={{ fontSize: 12, fill: C.muted }} /></Bar>
          <Bar dataKey="r1535" name="Ages 15–35" fill={C.purple} isAnimationActive={false}><LabelList dataKey="r1535" position="right" formatter={(v: unknown) => num(Number(v))} style={{ fontSize: 12, fill: C.muted }} /></Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function SkillsCard() {
  const items = [
    ["Skills match the job", skillsAlignment.wellMatched],
    ["Underqualified for the job", skillsAlignment.underqualified],
    ["Overqualified for the job", skillsAlignment.overqualified],
    ["Education level matches what the job demands", skillsAlignment.educationAligned],
  ] as [string, number][];
  return (
    <ChartCard title="Skills, education and work" subtitle="% of employed young people" period="2022 AHIES / 2025 QLFS"
      explain={{ indicator: "skills" }}
      notes="Separate questions, so the percentages do not form one distribution summing to 100%. More than 70% of all employment in Ghana is informal (all workers, not a youth-only rate); the publication says young people are over-represented in it."
      source="pp. 112–113"
      footer={<DataDisclosure><DataTable caption="Skills and education alignment among employed youth" headings={["Measure", "% of employed youth"]} rows={items} decimals={0} minWidth={320} /></DataDisclosure>}>
      <ul className="space-y-3">
        {items.map(([l, v]) => (
          <li key={l}>
            <div className="mb-1 flex justify-between gap-3 text-[13px]"><span className="text-body">{l}</span><span className="tabular font-semibold text-ink">{v}%</span></div>
            <div className="h-2.5 rounded-sm bg-surface-muted"><div className="h-full rounded-sm" style={{ width: `${v}%`, background: l.startsWith("Education") ? C.teal : C.purple }} /></div>
          </li>
        ))}
      </ul>
      <div className="mt-5"><Stat label="Informal share of all employment" value="Over 70" unit="%" context="Average Q1–Q3 2025 · Table 2.1" /></div>
    </ChartCard>
  );
}
