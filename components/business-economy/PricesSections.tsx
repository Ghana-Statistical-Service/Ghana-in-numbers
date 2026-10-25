"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, ReferenceDot, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Legend, Segmented } from "@/components/ui/Data";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, tick, tickSmall } from "@/components/ui/chart";
import { foodNonFoodInflationData, iipSectorData } from "@/data/businessEconomyData";
import { localImportedInflation, pbciCombined, ppiBySector } from "@/data/publicationAdditions";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
type Point = { code: string; label: string; yoy: number | null; mom: number | null };

/** Monthly CPI inflation for the publication period (Figure 5.11) from the cached StatsBank extract. */
export function CpiCard() {
  const [points, setPoints] = useState<Point[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [measure, setMeasure] = useState<"yoy" | "mom">("yoy");
  useEffect(() => {
    let live = true;
    fetch("/data/cpiData.json").then(r => r.json()).then((raw: { response: { data: { key: string[]; values: string[] }[] } }) => {
      if (!live) return;
      const map = new Map<string, Point>();
      for (const d of raw.response.data) {
        const [ind, code, region] = d.key;
        if (region !== "Ghana" || code < "2014M01" || code > "2025M12") continue;
        const p = map.get(code) ?? { code, label: `${MONTHS[+code.slice(5) - 1]} ${code.slice(0, 4)}`, yoy: null, mom: null };
        const v = parseFloat(d.values[0]);
        if (ind.startsWith("Year")) p.yoy = Number.isNaN(v) ? null : v; else p.mom = Number.isNaN(v) ? null : v;
        map.set(code, p);
      }
      setPoints([...map.values()].sort((a, b) => a.code.localeCompare(b.code)));
    }).catch(() => live && setFailed(true));
    return () => { live = false; };
  }, []);
  const yearTicks = points?.filter(p => p.code.endsWith("M01")).map(p => p.label);

  return (
    <ChartCard title="Consumer price inflation" subtitle={measure === "yoy" ? "Year-on-year change in the CPI, % · monthly" : "Month-on-month change in the CPI, % · monthly"} period="Jan 2014 – Dec 2025"
      explain={{ indicator: "inflation" }}
      actions={<Segmented label="Inflation measure" size="sm" value={measure} onChange={setMeasure} options={[{ value: "yoy", label: "Year on year" }, { value: "mom", label: "Month on month" }]} />}
      notes={<>Year-on-year inflation peaked at 54.1% in December 2022 and fell to 5.4% in December 2025. The 2025 annual average was 14.6%. Lower inflation means prices rose more slowly; it does not mean they fell. {measure === "mom" && "Negative month-on-month values mean the index fell from the previous month."}</>}
      source="GSS Consumer Price Index (StatsBank extract) · Figure 5.11, p. 51"
      footer={points && <DataDisclosure hint="Monthly values, Ghana"><DataTable caption="Monthly CPI inflation, Ghana" headings={["Month", "Year on year (%)", "Month on month (%)"]} rows={[...points].reverse().map(p => [p.label, p.yoy, p.mom])} decimals={1} minWidth={360} /></DataDisclosure>}>
      {failed ? <p role="alert" className="rounded-md bg-caution-bg px-3 py-6 text-center text-[13px] text-caution">Monthly CPI data could not be loaded. Refresh to try again.</p> : !points ? <div className="h-[300px] animate-pulse rounded-md bg-surface-muted" /> : (
        <ChartFrame height={300} minWidth={600} label="Monthly year-on-year inflation, 2014 to 2025, peaking at 54.1% in December 2022 and ending at 5.4% in December 2025">
          <LineChart data={points} margin={{ top: 20, right: 24, left: -6, bottom: 0 }}>
            <CartesianGrid stroke={C.grid} vertical={false} />
            <XAxis dataKey="label" {...axisCommon} tick={tickSmall} ticks={yearTicks} tickFormatter={l => String(l).slice(4)} />
            <YAxis {...axisCommon} tick={tick} domain={measure === "yoy" ? [0, 60] : [-2, 10]} ticks={measure === "yoy" ? [0, 10, 20, 30, 40, 50, 60] : [-2, 0, 2, 4, 6, 8, 10]} tickFormatter={v => `${v}%`} width={44} />
            {measure === "mom" && <ReferenceLine y={0} stroke={C.slate} />}
            <Tooltip content={makeTooltip({ unit: "%" })} />
            <Line dataKey={measure} name={measure === "yoy" ? "Year on year" : "Month on month"} stroke={C.purple} strokeWidth={2} dot={false} isAnimationActive={false} connectNulls={false} />
            {measure === "yoy" && <ReferenceDot x="Dec 2022" y={54.1} r={4} fill={C.purple} stroke="#fff" strokeWidth={2} label={{ value: "54.1% · Dec 2022", position: "right", fontSize: 12, fill: C.ink, fontWeight: 600 }} />}
            {measure === "yoy" && <ReferenceDot x="Dec 2025" y={5.4} r={4} fill={C.purple} stroke="#fff" strokeWidth={2} label={{ value: "5.4%", position: "top", fontSize: 12, fill: C.ink, fontWeight: 600 }} />}
          </LineChart>
        </ChartFrame>
      )}
    </ChartCard>
  );
}

function DatedPairs({ rows, a, b }: { rows: { period: string; a: number; b: number; note?: string }[]; a: { label: string; color: string }; b: { label: string; color: string } }) {
  const max = 70;
  return (
    <div>
      <Legend className="mb-3" items={[{ label: a.label, color: a.color, shape: "dot" }, { label: b.label, color: b.color, shape: "dot" }]} />
      <ul className="space-y-3.5">
        {rows.map(r => (
          <li key={r.period} className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-3">
            <span className="tabular text-[13px] font-medium text-ink">{r.period}</span>
            <div>
              {[{ v: r.a, c: a.color, l: a.label }, { v: r.b, c: b.color, l: b.label }].map(s => (
                <div key={s.l} className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-2">
                  <span className="h-2.5 rounded-sm bg-surface-muted"><span className="block h-full rounded-sm" style={{ width: `${(s.v / max) * 100}%`, background: s.c }} /></span>
                  <span className="tabular text-right text-[12.5px] font-semibold text-ink">{s.v.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FoodLocalCard() {
  return (
    <ChartCard title="What drove inflation" subtitle="Year-on-year inflation for selected dated months, %" period="2022–2025"
      explain={{ indicator: "foodInflation" }}
      notes="Only the dated values printed in the publication are shown; the full monthly series behind Figures 5.12–5.13 is not labelled. Local inflation’s own peak was 51.9% at the end of 2022."
      source="GSS CPI · Figures 5.12–5.13 and pp. 52–53"
      footer={<DataDisclosure><DataTable caption="Food and non-food inflation" headings={["Month", "Food (%)", "Non-food (%)"]} rows={foodNonFoodInflationData.map(d => [d.year, d.food, d.nonFood])} decimals={1} minWidth={320} /><DataTable caption="Local and imported inflation" headings={["Month", "Local (%)", "Imported (%)", "Source"]} rows={localImportedInflation.map(d => [d.period, d.local, d.imported, d.source])} decimals={[undefined, 1, 1]} minWidth={460} /></DataDisclosure>}>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[13.5px] font-semibold text-ink">Food and non-food</p>
          <DatedPairs rows={foodNonFoodInflationData.map(d => ({ period: d.year, a: d.food, b: d.nonFood }))} a={{ label: "Food", color: C.teal }} b={{ label: "Non-food", color: C.slate }} />
          <p className="mt-3 text-xs leading-relaxed text-subtle">Food led the 2022–23 surge, which weighs most on households that spend a large share of their budget on food.</p>
        </div>
        <div>
          <p className="mb-2 text-[13.5px] font-semibold text-ink">Locally produced and imported goods</p>
          <DatedPairs rows={localImportedInflation.map(d => ({ period: d.period, a: d.local, b: d.imported }))} a={{ label: "Local", color: C.purple }} b={{ label: "Imported", color: C.amber }} />
          <p className="mt-3 text-xs leading-relaxed text-subtle">Imported inflation peaked higher (62.4%, January 2023); since 2024 local inflation has stayed above imported.</p>
        </div>
      </div>
    </ChartCard>
  );
}

export function PbciCard() {
  return (
    <ChartCard title="Building cost inflation" subtitle="Prime Building Cost Index, combined, year-on-year %" period="Jan 2024 – Mar 2026"
      explain={{ title: "Prime Building Cost Index", meaning: "The Prime Building Cost Index tracks the cost of putting up a building, combining labour, materials and plant. Building cost inflation is the year-on-year percentage change in that index.", story: "Building cost inflation climbed from 6.3% in January 2024 to 22.6% in December 2024 and peaked at 24.4% in April 2025, when a project costing GH¢1 million in 2024 cost almost a quarter more. It then fell to 4.4% by December 2025 and 2.2% by March 2026.", why: "Slower growth in construction costs eases pressure on schools, clinics, roads and housing projects, making project budgets and investment planning more predictable. It does not mean building costs fell.", source: "pp. 54" }}
      notes="Months after December 2025 are outside the main reference period but are printed in the publication. Labour, materials and plant components are drawn without labels and are not reproduced."
      source="GSS PBCI annexes 2024–2026 · Figure 5.14, p. 54"
      footer={<DataDisclosure><DataTable caption="Prime Building Cost Index, combined" headings={["Month", "Year on year (%)"]} rows={pbciCombined.map(d => [d.month, d.value])} decimals={1} minWidth={280} /></DataDisclosure>}>
      <ChartFrame height={240} minWidth={520} label="Building cost inflation peaked at 24.4% in April 2025 and fell to 2.2% in March 2026">
        <LineChart data={pbciCombined} margin={{ top: 22, right: 20, left: -6, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="month" {...axisCommon} tick={tickSmall} interval={5} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 30]} ticks={[0, 10, 20, 30]} tickFormatter={v => `${v}%`} width={40} />
          <ReferenceLine x="Dec 2025" stroke={C.slateLight} strokeDasharray="3 3" />
          <Tooltip content={makeTooltip({ unit: "%" })} />
          <Line dataKey="value" name="Combined index" stroke={C.teal} strokeWidth={2.5} dot={{ r: 2.5, fill: C.teal }} isAnimationActive={false} />
          <ReferenceDot x="Apr 2025" y={24.4} r={4} fill={C.teal} stroke="#fff" strokeWidth={2} label={{ value: "24.4%", position: "top", fontSize: 12, fill: C.ink, fontWeight: 600 }} />
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

const years = [{ key: "y2023", label: "2023", color: C.slateLight }, { key: "y2024", label: "2024", color: C.purpleLight }, { key: "y2025", label: "2025", color: C.purple }] as const;

function SectorBars({ data, height, domain, ticks, label }: { data: Record<string, number | string>[]; height: number; domain: [number, number]; ticks: number[]; label: string }) {
  return (
    <ChartFrame height={height} label={label}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }} barCategoryGap="22%" barGap={1}>
        <CartesianGrid stroke={C.grid} horizontal={false} />
        <XAxis type="number" {...axisCommon} tick={tick} domain={domain} ticks={ticks} tickFormatter={v => `${v}%`} />
        <YAxis type="category" dataKey="sector" {...axisCommon} tick={{ ...tickSmall, fill: C.ink }} width={150} />
        <ReferenceLine x={0} stroke={C.slate} />
        <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: "%" })} />
        {years.map(y => (
          <Bar key={y.key} dataKey={y.key} name={y.label} fill={y.color} isAnimationActive={false} radius={1}>
            {y.key === "y2025" && <LabelList dataKey="y2025" position="right" formatter={(v: unknown) => `${Number(v).toFixed(1)}`} style={{ ...labelStyle, fontSize: 12 }} />}
          </Bar>
        ))}
      </BarChart>
    </ChartFrame>
  );
}

export function PpiCard() {
  return (
    <ChartCard title="Producer price inflation by sector" subtitle="Year-on-year, end of year, %" period="2023–2025"
      explain={{ indicator: "ppi" }}
      notes="Labels show 2025. Negative values (accommodation and food, transport) mean producer prices were below the same point a year earlier, not below 2023 levels. Table 2.1 lists different sector values; the detailed figure is used."
      source="GSS Producer Price Index · Figure 5.15, p. 55"
      footer={<DataDisclosure><DataTable caption="Producer price inflation by sector" headings={["Sector", "2023 (%)", "2024 (%)", "2025 (%)"]} rows={ppiBySector.map(d => [d.sector, d.y2023, d.y2024, d.y2025])} decimals={1} minWidth={420} /></DataDisclosure>}>
      <Legend className="mb-2" items={years.map(y => ({ label: y.label, color: y.color }))} />
      <SectorBars data={ppiBySector} height={430} domain={[-10, 50]} ticks={[-10, 0, 10, 20, 30, 40, 50]} label="Producer price inflation by sector, 2023 to 2025. All industries: 16.4%, 26.1%, 1.9%." />
    </ChartCard>
  );
}

export function IipCard() {
  const data = iipSectorData.map(d => ({ ...d, sector: d.sector.replace("Mining and Quarrying", "Mining and quarrying") }));
  return (
    <ChartCard title="Industrial production growth by sector" subtitle="Index of Industrial Production, year-on-year at end of period, %" period="2023–2025"
      explain={{ indicator: "iip" }}
      notes="Measures the volume produced, not prices. Labels show 2025: manufacturing and electricity grew while mining and water contracted. Table 2.1 gives −1.1% for water in 2025; the detailed figure’s −2.1% is used."
      source="GSS Index of Industrial Production · Figure 5.16, pp. 56–57"
      footer={<DataDisclosure><DataTable caption="Industrial production growth" headings={["Sector", "2023 (%)", "2024 (%)", "2025 (%)"]} rows={data.map(d => [d.sector, d.y2023, d.y2024, d.y2025])} decimals={1} minWidth={420} /></DataDisclosure>}>
      <Legend className="mb-2" items={years.map(y => ({ label: y.label, color: y.color }))} />
      <SectorBars data={data} height={300} domain={[-8, 8]} ticks={[-8, -4, 0, 4, 8]} label="Industrial production growth by sector, 2023 to 2025. All industries 1.9% in 2025." />
    </ChartCard>
  );
}
