"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import {
  Armchair, ArrowRight, Baby, Backpack, BookOpen, Briefcase, Building2, Earth, GraduationCap, Heart, HeartPulse, Hourglass, House, IdCard,
  Plane, Route, Trees, UserRound, type LucideIcon,
} from "lucide-react";
import { ChartCard, Qualifier, Stat } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Legend, Segmented } from "@/components/ui/Data";
import { IconBarRow, IconTile, Milestones, Pictogram, Takeaway, Waffle, tones, type Tone } from "@/components/ui/Infographic";
import { Grid } from "@/components/ui/Page";
import { C, ChartFrame, axisCommon, makeTooltip, tick, tickSmall } from "@/components/ui/chart";
import RegionalMap from "@/components/maps/RegionalMap";
import {
  ageGroupDistribution2025, fertilityData, householdSizeData, intercensalGrowth, lifeExpectancyByAge, lifeExpectancyTrend,
  populationSize, pyramidData, sexComposition2025, urbanRuralData,
} from "@/data/populationData";
import { REGIONS, internalMigrationFlows, populationDensity, regionalFertility2022, regionalShare, sexCounts2025, urbanRuralCounts } from "@/data/publicationAdditions";
import { emigrantDestinationsData, emigrationData, emigrationReasonsData, immigrationData, internalMigrationData, netMigration2021 } from "@/data/reportAdditions";

const pct = (v: number) => `${v.toFixed(1)}%`;
const range = (s: string) => s.replace(/\s*(→|-)\s*/, "–");

/* ── Population size ─────────────────────────────────────────────────────── */

const kindColor = { census: C.purple, estimate: C.blue, projection: C.amber } as const;
const kindName = { census: "Census count", estimate: "Intercensal estimate", projection: "Projection" } as const;
const sizeData = populationSize.map(d => ({ ...d, historical: Number(d.year) <= 2021 ? d.value : null, projected: Number(d.year) >= 2021 ? d.value : null }));

export function PopulationSizeCard() {
  return (
    <ChartCard
      title="Population size"
      subtitle="Million people"
      period="2000–2025"
      explain={{ indicator: "population" }}
      notes="Filled markers are census counts (2000, 2010, 2021); hollow markers are intercensal estimates; the dashed segment shows projections from the 2021 census. Values rounded to one decimal."
      source="GSS 2010 and 2021 PHC; 2021–2050 Population Projections · Figure 3.1, p. 12"
      footer={<DataDisclosure><DataTable caption="Population, million, 2000–2025" headings={["Year", "Population (million)", "Type"]} rows={populationSize.map(d => [d.year, d.value, kindName[d.kind as keyof typeof kindName]])} decimals={1} minWidth={360} /></DataDisclosure>}
    >
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <p className="tabular flex flex-wrap items-baseline gap-x-2"><span className="text-3xl font-semibold tracking-tight text-ink">33.7 million</span><span className="text-[13px] text-muted">projected for 2025, up from 18.9 million in 2000</span></p>
        <Legend items={[{ label: "Census count", color: C.purple, shape: "dot" }, { label: "Intercensal estimate", color: C.blue, shape: "hollow" }, { label: "Projection", color: C.amber, shape: "dash" }]} />
      </div>
      <ChartFrame height={300} label="Ghana's population rose from 18.9 million in 2000 to 24.7 million in 2010, 30.8 million in 2021 and a projected 33.7 million in 2025">
        <LineChart data={sizeData} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tick} interval={4} padding={{ left: 16, right: 8 }} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 40]} ticks={[0, 10, 20, 30, 40]} width={36} />
          <Tooltip content={makeTooltip({ unit: " million", labelFormat: (l, p) => `${l} · ${kindName[(p?.kind as keyof typeof kindName) ?? "estimate"]}` })} />
          {["2000", "2010", "2021"].map(y => <ReferenceLine key={y} x={y} stroke={C.purpleFaint} />)}
          <Line dataKey="historical" name="Population" stroke={C.purple} strokeWidth={2.5} dot={false} activeDot={false} isAnimationActive={false} />
          <Line dataKey="projected" name="_hidden" stroke={C.amber} strokeWidth={2.5} strokeDasharray="6 4" dot={false} activeDot={false} isAnimationActive={false} />
          <Line dataKey="value" name="_hidden" stroke="transparent" isAnimationActive={false} activeDot={{ r: 5 }}
            dot={({ cx, cy, payload }) => <circle key={payload.year} cx={cx} cy={cy} r={payload.kind === "census" ? 5 : 3.5} fill={payload.kind === "census" ? C.purple : "#fff"} stroke={kindColor[payload.kind as keyof typeof kindColor]} strokeWidth={2} />}>
            <LabelList dataKey="value" content={props => {
              const { x, y, value, index } = props as { x: number; y: number; value: number; index: number };
              const d = populationSize[index];
              if (!["2000", "2005", "2010", "2015", "2021", "2025"].includes(d.year)) return null;
              return <text x={x} y={y - 11} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>{value.toFixed(1)}</text>;
            }} />
          </Line>
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function IntercensalCard() {
  const first = intercensalGrowth[0], last = intercensalGrowth.at(-1)!;
  return (
    <ChartCard
      title="Intercensal growth"
      subtitle="Average annual growth rate and years to double at that rate"
      period="1984–2021"
      explain={{ indicator: "growth" }}
      notes="Doubling time assumes each period’s growth rate stays unchanged; it is an illustration, not a forecast."
      source="GSS 2021–2050 Population Projections · Table 3.1, p. 13"
      footer={<DataDisclosure><DataTable caption="Intercensal growth rate and doubling time" headings={["Period", "Years", "Growth rate (%)", "Doubling time (years)"]} rows={intercensalGrowth.map(r => [range(r.period), r.years, parseFloat(r.rate), r.doublingTime])} decimals={[undefined, 0, 1, 1]} minWidth={420} /></DataDisclosure>}
    >
      <table className="w-full text-[13px]">
        <caption className="sr-only">Intercensal growth rate and doubling time, 1984–2021</caption>
        <thead>
          <tr className="border-b border-line text-xs text-muted">
            <th scope="col" className="pb-2 text-left font-medium">Period</th>
            <th scope="col" className="pb-2 text-center font-medium">Years</th>
            <th scope="col" className="pb-2 text-center font-medium">Growth rate</th>
            <th scope="col" className="pb-2 text-center font-medium"><span className="inline-flex items-center gap-1"><Hourglass size={14} aria-hidden="true" style={{ color: tones.teal.fg }} />Doubling time</span></th>
          </tr>
        </thead>
        <tbody>
          {intercensalGrowth.map((r, i) => {
            const latest = i === intercensalGrowth.length - 1;
            return (
              <tr key={r.period} className={`border-b border-line/70 last:border-0 ${latest ? "font-semibold" : ""}`}>
                <th scope="row" className={`py-2.5 text-left tabular ${latest ? "font-semibold text-ink" : "font-normal text-body"}`}>{range(r.period)}</th>
                <td className="tabular py-2.5 text-center text-muted">{r.years}</td>
                <td className="py-2.5 text-center"><span className="tabular inline-block rounded-md px-2 py-0.5 font-semibold" style={{ background: tones.purple.bg, color: tones.purple.fg }}>{pct(parseFloat(r.rate))}</span></td>
                <td className="py-2.5 text-center"><span className="tabular inline-block rounded-md px-2 py-0.5 font-semibold" style={{ background: tones.teal.bg, color: tones.teal.fg }}>{r.doublingTime.toFixed(1)} yrs</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Takeaway>Growth slowed from {pct(parseFloat(first.rate))} to {pct(parseFloat(last.rate))} a year, so doubling time lengthened from {first.doublingTime.toFixed(1)} to {last.doublingTime.toFixed(1)} years. The population still grows by roughly half a million to 700,000 people a year.</Takeaway>
    </ChartCard>
  );
}

/* ── Composition ─────────────────────────────────────────────────────────── */

export function PyramidCard() {
  const [year, setYear] = useState<"2010" | "2021" | "2025">("2025");
  const data = useMemo(() => pyramidData[year].map(d => ({ age: d.age, male: -d.male, female: d.female })), [year]);
  return (
    <ChartCard
      title="Age–sex structure"
      subtitle="Population by five-year age group, million"
      period={year}
      qualifier={year === "2025" ? <Qualifier tone="caution">Projection</Qualifier> : <Qualifier>Census</Qualifier>}
      explain={{ indicator: "pyramid" }}
      actions={<Segmented label="Pyramid year" size="sm" value={year} onChange={setYear} options={[{ value: "2010", label: "2010" }, { value: "2021", label: "2021" }, { value: "2025", label: "2025" }]} />}
      notes="Bars extend left for males and right for females; both sides are positive counts."
      source="GSS 2010 and 2021 PHC; 2021–2050 Population Projections · Figure 3.2, p. 14"
      footer={<DataDisclosure><DataTable caption={`Population by age and sex, ${year}, million`} headings={["Age group", "Male (million)", "Female (million)"]} rows={[...pyramidData[year]].reverse().map(d => [d.age, d.male, d.female])} decimals={2} minWidth={360} /></DataDisclosure>}
    >
      <Legend className="mb-2" items={[{ label: "Male", color: C.male }, { label: "Female", color: C.female }]} />
      <ChartFrame height={380} label={`Population pyramid for ${year}, in million people by age and sex`}>
        <BarChart data={data} layout="vertical" stackOffset="sign" margin={{ top: 0, right: 8, left: 0, bottom: 0 }} barCategoryGap="12%">
          <CartesianGrid stroke={C.grid} horizontal={false} />
          <XAxis type="number" {...axisCommon} tick={tick} domain={[-2.5, 2.5]} ticks={[-2, -1, 0, 1, 2]} tickFormatter={v => `${Math.abs(v)}`} />
          <YAxis type="category" dataKey="age" {...axisCommon} tick={tickSmall} width={42} />
          <ReferenceLine x={0} stroke={C.slateLight} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ format: v => `${Math.abs(v).toFixed(2)} million`, labelFormat: l => `Age ${l}` })} />
          <Bar dataKey="male" name="Male" stackId="p" fill={C.male} isAnimationActive={false} />
          <Bar dataKey="female" name="Female" stackId="p" fill={C.female} isAnimationActive={false} />
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

/** Two tinted panels with an icon, a large figure and a short label, joined by a bar scaled to 100%. Used for male/female, urban/rural and similar pairs. */
function SplitPanels({ items, label }: { items: { icon: LucideIcon; tone: Tone; value: string; share?: number; name: string; detail?: string }[]; label: string }) {
  return (
    <div>
      <div className="grid grid-cols-2 overflow-hidden rounded-t-[var(--radius-md)]">
        {items.map(it => (
          <div key={it.name} className="flex flex-col items-center px-3 py-4 text-center" style={{ background: tones[it.tone].bg }}>
            <it.icon size={34} aria-hidden="true" strokeWidth={2} style={{ color: tones[it.tone].fill }} />
            <p className="tabular mt-1.5 text-[30px] font-bold leading-none tracking-tight" style={{ color: tones[it.tone].fg }}>{it.value}</p>
            <p className="mt-1.5 text-[13px] font-semibold text-ink">{it.name}</p>
            {it.detail && <p className="tabular text-xs text-muted">{it.detail}</p>}
          </div>
        ))}
      </div>
      {items.every(it => it.share != null) && (
        <div className="flex h-2 overflow-hidden rounded-b-[var(--radius-md)]" role="img" aria-label={label}>
          {items.map(it => <span key={it.name} style={{ width: `${it.share}%`, background: tones[it.tone].fill }} />)}
        </div>
      )}
    </div>
  );
}

export function SexSplitCard() {
  const male = sexComposition2025[0].value, female = sexComposition2025[1].value;
  const gap = sexCounts2025.female - sexCounts2025.male;
  return (
    <ChartCard
      title="Population composition"
      subtitle="% of total population, by sex"
      period="2025"
      qualifier={<Qualifier tone="caution">Projection</Qualifier>}
      explain={{ indicator: "composition" }}
      source="GSS 2021–2050 Population Projections · Figure 3.3, p. 15; Table 2.1, p. 6"
      footer={<DataDisclosure><DataTable caption="Population by sex, 2025" headings={["Sex", "Share (%)", "Million"]} rows={[["Male", male, sexCounts2025.male], ["Female", female, sexCounts2025.female]]} decimals={1} minWidth={320} /></DataDisclosure>}
    >
      <SplitPanels label={`Males ${pct(male)}, females ${pct(female)}`} items={[
        { icon: UserRound, tone: "blue", value: pct(male), share: male, name: "Male", detail: `${sexCounts2025.male.toFixed(1)} million` },
        { icon: UserRound, tone: "rose", value: pct(female), share: female, name: "Female", detail: `${sexCounts2025.female.toFixed(1)} million` },
      ]} />
      <Takeaway>A small female majority: about {gap.toFixed(1)} million more females than males.</Takeaway>
    </ChartCard>
  );
}

const ageColors = ["#1F1654", "#3C2FA3", "#6A5CC4", "#9C93DB", "#C7C1EC", "#E6E3F7"];
const ageIcons: LucideIcon[] = [Baby, Backpack, BookOpen, GraduationCap, Briefcase, Armchair];

export function AgeGroupCard() {
  const total = ageGroupDistribution2025.reduce((s, g) => s + g.pct, 0);
  return (
    <ChartCard
      title="Population by age group"
      subtitle="% of total population"
      period="2025"
      qualifier={<Qualifier tone="caution">Projection</Qualifier>}
      explain={{ indicator: "age" }}
      notes={`Age groups span different numbers of years and differ from the 15–24 and 15–35 youth definitions. Shares total ${total.toFixed(1)}% because of rounding.`}
      source="GSS 2021–2050 Population Projections · Figure 3.3, p. 15"
      footer={<DataDisclosure><DataTable caption="Population by age group, 2025" headings={["Age group", "Share (%)"]} rows={ageGroupDistribution2025.map(g => [`${range(g.label)} (${g.sublabel.toLowerCase()})`, g.pct])} decimals={1} minWidth={320} /></DataDisclosure>}
    >
      <div className="flex h-9 overflow-hidden rounded-md" role="img" aria-label={`Age groups, 2025: ${ageGroupDistribution2025.map(g => `ages ${range(g.label)} ${pct(g.pct)}`).join(", ")}`}>
        {ageGroupDistribution2025.map((g, i) => <div key={g.label} style={{ width: `${g.pct}%`, background: ageColors[i] }} className={`flex items-center justify-center text-xs font-semibold ${i < 4 ? "text-white" : "text-ink"}`}>{g.pct >= 9 ? pct(g.pct) : ""}</div>)}
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
        {ageGroupDistribution2025.map((g, i) => (
          <li key={g.label} className="flex items-center gap-2.5 rounded-[var(--radius-md)] border-l-4 bg-surface-muted px-2.5 py-2" style={{ borderLeftColor: ageColors[i] === "#E6E3F7" ? "#C7C1EC" : ageColors[i] }}>
            <IconTile icon={ageIcons[i]} tone="purple" size="sm" />
            <span className="min-w-0 text-[13px] leading-tight">
              <span className="tabular font-semibold text-ink">{pct(g.pct)}</span> <span className="text-body">ages {range(g.label)}</span>
              <span className="block text-xs text-muted">{g.sublabel}</span>
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}

/* ── Urbanisation ────────────────────────────────────────────────────────── */

export function UrbanRuralCard() {
  const latest = urbanRuralData.at(-1)!;
  const latestCounts = urbanRuralCounts.at(-1)!;
  const data = urbanRuralData.map(d => ({ year: d.year.replace("*", ""), urban: d.urban, rural: d.rural }));
  const countsFor = (year: string) => urbanRuralCounts.find(c => c.year === year);
  const edgeAnchor = (index: number) => index === 0 ? "start" : index === data.length - 1 ? "end" : "middle";
  return (
    <ChartCard
      title="Urban–rural distribution"
      subtitle="% of total population"
      period="1984–2025"
      explain={{ indicator: "urban" }}
      notes="Census years 1984–2021; 2025 is a projection. Years are unevenly spaced. Ghana became more urban than rural around 2010. A falling rural share does not mean fewer rural residents."
      source="GSS 2010 and 2021 PHC; 2021–2050 Population Projections · Figure 3.5, p. 17; p. 17 text"
      footer={<DataDisclosure><DataTable caption="Urban and rural population" headings={["Year", "Urban (%)", "Rural (%)", "Urban (million)", "Rural (million)"]} rows={urbanRuralData.map(d => { const c = urbanRuralCounts.find(x => d.year.startsWith(x.year)); return [d.year.replace("*", " (projection)"), d.urban, d.rural, c?.urban ?? "Not printed", c?.rural ?? "Not printed"]; })} decimals={[undefined, 1, 1, 2, 2]} minWidth={480} unitNote="Counts for 1984 are not printed in the publication." /></DataDisclosure>}
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-stretch">
        <div className="flex flex-col">
          <p className="mb-2 flex items-center gap-2 text-xs font-medium text-muted">2025 <Qualifier tone="caution">Projection</Qualifier></p>
          <SplitPanels label={`2025: urban ${pct(latest.urban)}, rural ${pct(latest.rural)}`} items={[
            { icon: Building2, tone: "purple", value: pct(latest.urban), share: latest.urban, name: "Urban", detail: `${latestCounts.urban.toFixed(2)} million` },
            { icon: Trees, tone: "teal", value: pct(latest.rural), share: latest.rural, name: "Rural", detail: `${latestCounts.rural.toFixed(2)} million` },
          ]} />
          <Takeaway>Close to six in ten people are projected to live in towns and cities, up from about three in ten in 1984.</Takeaway>
        </div>
        <div className="flex min-w-0 flex-col">
          <Legend className="mb-2" items={[{ label: "Urban", color: C.purple }, { label: "Rural", color: C.tealLight }]} />
          <ChartFrame height={260} minWidth={440} label={`Urban share rose from ${pct(urbanRuralData[0].urban)} in 1984 to ${pct(latest.urban)} in 2025; rural share fell from ${pct(urbanRuralData[0].rural)} to ${pct(latest.rural)}`}>
            <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="year" {...axisCommon} tick={tick} tickFormatter={y => y === "2025" ? "2025 (proj.)" : y} />
              <YAxis {...axisCommon} tick={tick} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={v => `${v}%`} width={44} />
              <Tooltip content={makeTooltip({ format: v => pct(v), labelFormat: l => { const c = countsFor(l); return c ? `${l} · ${c.urban.toFixed(2)}M urban, ${c.rural.toFixed(2)}M rural` : l; } })} />
              <Area type="linear" dataKey="urban" name="Urban" stackId="u" stroke={C.purple} strokeWidth={1.5} fill={C.purple} fillOpacity={0.9} isAnimationActive={false}>
                <LabelList dataKey="urban" content={p => { const { x, y, value, index } = p as { x: number; y: number; value: number; index: number }; return <text x={x + (index === 0 ? 6 : index === data.length - 1 ? -6 : 0)} y={y + 20} textAnchor={edgeAnchor(index)} fontSize={12} fontWeight={600} fill="#fff">{pct(value)}</text>; }} />
              </Area>
              <Area type="linear" dataKey="rural" name="Rural" stackId="u" stroke={C.teal} strokeWidth={1.5} fill={C.tealLight} fillOpacity={0.9} isAnimationActive={false}>
                <LabelList dataKey="rural" content={p => { const { x, y, value, index } = p as { x: number; y: number; value: number; index: number }; return <text x={x + (index === 0 ? 6 : index === data.length - 1 ? -6 : 0)} y={y + 20} textAnchor={edgeAnchor(index)} fontSize={12} fontWeight={600} fill={C.ink}>{pct(value)}</text>; }} />
              </Area>
            </AreaChart>
          </ChartFrame>
        </div>
      </div>
    </ChartCard>
  );
}

/* ── Regional distribution ───────────────────────────────────────────────── */

type RegionalView = "share2025" | "share2021" | "share2010" | "density2021" | "density2010" | "tfr" | "net";
const regionalViews: Record<RegionalView, { label: string; measure: string; period: string; source: string; get: (r: typeof REGIONS[number]) => number; fmt: (v: number) => string; note: string; explain: string; diverging?: [number, number]; barMax?: number }> = {
  share2025: { label: "Share 2025", measure: "Share of national population (%)", period: "2025 projection", source: "Figure 3.6, p. 18; Table 2.1, p. 6", get: r => regionalShare[r].y2025, fmt: v => `${v.toFixed(1)}%`, note: "Greater Accra and Ashanti together hold more than a third of the population. Bars are drawn on a 0–100% scale.", explain: "regionalPopulation", barMax: 100 },
  share2021: { label: "Share 2021", measure: "Share of national population (%)", period: "2021 census", source: "Figure 3.6, p. 18", get: r => regionalShare[r].y2021, fmt: v => `${v.toFixed(1)}%`, note: "Greater Accra (17.7%) edged past Ashanti (17.6%) to become the most populous region. Bars are drawn on a 0–100% scale.", explain: "regionalPopulation", barMax: 100 },
  share2010: { label: "Share 2010", measure: "Share of national population (%)", period: "2010 census", source: "Figure 3.6, p. 18", get: r => regionalShare[r].y2010, fmt: v => `${v.toFixed(1)}%`, note: "Ashanti (19.4%) was the largest region in 2010. Bars are drawn on a 0–100% scale.", explain: "regionalPopulation", barMax: 100 },
  density2021: { label: "Density 2021", measure: "Persons per km²", period: "2021 census", source: "Figure 3.4, p. 16", get: r => populationDensity[r].y2021, fmt: v => v >= 1000 ? Math.round(v).toLocaleString("en-GB") : v.toFixed(1), note: "Density is people per square kilometre of land, not a population share.", explain: "regionalPopulation" },
  density2010: { label: "Density 2010", measure: "Persons per km²", period: "2010 census", source: "Figure 3.4, p. 16", get: r => populationDensity[r].y2010, fmt: v => v >= 1000 ? Math.round(v).toLocaleString("en-GB") : v.toFixed(1), note: "Every region became more densely populated between the censuses.", explain: "regionalPopulation" },
  tfr: { label: "Fertility 2022", measure: "Total fertility rate (children per woman)", period: "2022 GDHS", source: "Figure 3.7, p. 19", get: r => regionalFertility2022[r], fmt: v => v.toFixed(1), note: "National rate: 3.9. Rates range from 2.9 in Greater Accra to 6.6 in North East.", explain: "fertility" },
  net: { label: "Net migration 2021", measure: "Net lifetime migrants (persons)", period: "2021 census", source: "Figure 3.11, p. 23", get: r => Number(netMigration2021.find(([n]) => n === r)?.[1]), fmt: v => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(Math.round(v / 1000)).toLocaleString("en-GB")}k`, note: "Purple regions gained population through migration; orange regions lost it. Six regions gained, ten lost.", explain: "netMigration", diverging: [100000, 300000] },
};

export function RegionalCard() {
  const [view, setView] = useState<RegionalView>("share2025");
  const v = regionalViews[view];
  const data = REGIONS.map(region => ({ region, value: v.get(region) }));
  return (
    <ChartCard
      title="Regional share of population"
      subtitle={v.measure}
      period={v.period}
      qualifier={view === "share2025" ? <Qualifier tone="caution">Projection</Qualifier> : undefined}
      explain={{ indicator: v.explain }}
      notes={v.note}
      source={`GSS PHC 2010 and 2021; GDHS 2022; 2021–2050 Population Projections · ${v.source}`}
      footer={<DataDisclosure><DataTable caption="Regional population indicators" minWidth={760} headings={["Region", "Share 2010 (%)", "Share 2021 (%)", "Share 2025 (%)", "Density 2010", "Density 2021", "TFR 2022", "Net migration 2021"]}
        rows={REGIONS.map(r => [r, regionalShare[r].y2010, regionalShare[r].y2021, regionalShare[r].y2025, populationDensity[r].y2010, populationDensity[r].y2021, regionalFertility2022[r], Number(netMigration2021.find(([n]) => n === r)?.[1])])} decimals={[undefined, 1, 1, 1, 1, 1, 1, 0]} unitNote="Density in persons per km². Net migration rounded to the nearest thousand in the source." /></DataDisclosure>}
    >
      <div className="mb-4">
        <label htmlFor="regional-view" className="mb-1.5 block text-xs font-medium text-muted">Show</label>
        <select id="regional-view" value={view} onChange={e => setView(e.target.value as RegionalView)} className="h-10 w-full max-w-xs rounded-[var(--radius-md)] border border-line-strong bg-surface px-3 text-sm text-ink">
          <optgroup label="Population share"><option value="share2025">Share of population, 2025 (projection)</option><option value="share2021">Share of population, 2021</option><option value="share2010">Share of population, 2010</option></optgroup>
          <optgroup label="Density"><option value="density2021">Population density, 2021</option><option value="density2010">Population density, 2010</option></optgroup>
          <optgroup label="Fertility and migration"><option value="tfr">Total fertility rate, 2022</option><option value="net">Net migration, 2021</option></optgroup>
        </select>
      </div>
      <RegionalMap key={view} data={data} measure={v.measure} format={v.fmt} scale={v.diverging ? "diverging" : "sequential"} divergingBreaks={v.diverging} barMax={v.barMax} height={430} />
    </ChartCard>
  );
}

/* ── Fertility and households ────────────────────────────────────────────── */

export function FertilityCard() {
  const first = fertilityData[0], last = fertilityData.at(-1)!;
  return (
    <ChartCard title="Fertility rate" subtitle="Total fertility rate, children per woman" period="1988–2022" explain={{ indicator: "fertility" }}
      notes="Survey years are unevenly spaced; values are not available between them."
      source="GDHS 1988, 1993, 2014 and 2022 · Figure 3.7, p. 19"
      footer={<DataDisclosure><DataTable caption="Total fertility rate" headings={["Survey year", "Children per woman"]} rows={fertilityData.map(d => [d.year, d.value])} decimals={1} minWidth={280} /></DataDisclosure>}>
      <Milestones data={fertilityData} tone="teal" icon={Baby} unit="children per woman" />
      <Takeaway>Women are having fewer children: {last.value.toFixed(1)} per woman in {last.year}, down from {first.value.toFixed(1)} in {first.year}.</Takeaway>
    </ChartCard>
  );
}

export function HouseholdCard() {
  const peak = householdSizeData.reduce((a, b) => (b.value > a.value ? b : a));
  const last = householdSizeData.at(-1)!;
  return (
    <ChartCard title="Average household size" subtitle="Persons per household" period="1984–2021" explain={{ indicator: "household" }}
      notes="An average across households: smaller households mean more homes are needed for the same population."
      source="GSS PHC · Figure 3.8, p. 20"
      footer={<DataDisclosure><DataTable caption="Average household size" headings={["Census year", "Persons per household"]} rows={householdSizeData.map(d => [d.year, d.value])} decimals={1} minWidth={280} /></DataDisclosure>}>
      <Milestones data={householdSizeData} tone="amber" icon={House} unit="persons per household" />
      <Takeaway>Households are getting smaller: {last.value.toFixed(1)} persons in {last.year}, down from a peak of {peak.value.toFixed(1)} in {peak.year}.</Takeaway>
    </ChartCard>
  );
}

/* ── Life expectancy ─────────────────────────────────────────────────────── */

export function LifeByAgeCard() {
  const data = lifeExpectancyByAge.map(r => ({ age: r.age, male: r.male, female: r.female }));
  return (
    <ChartCard title="Remaining life expectancy by age and sex" subtitle="Additional years expected at each age" period="2021"
      explain={{ indicator: "life", title: "Life expectancy at a given age" }}
      notes="Women can expect 66.8 years at birth and men 63.3. The gap narrows with age: at 60, about 16.0 more years for women and 15.7 for men."
      source="GSS 2021 PHC · Figure 3.10, p. 22"
      footer={<DataDisclosure><DataTable caption="Life expectancy by age and sex, 2021" headings={["Age group", "Male (years)", "Female (years)"]} rows={data.map(d => [d.age, d.male, d.female])} decimals={1} minWidth={320} /></DataDisclosure>}>
      <Legend className="mb-2" items={[{ label: "Male", color: C.male, shape: "line" }, { label: "Female", color: C.female, shape: "line" }]} />
      <ChartFrame height={260} label="Remaining life expectancy by age group for males and females in 2021">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="age" {...axisCommon} tick={tickSmall} interval={2} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 70]} ticks={[0, 20, 40, 60]} width={34} />
          <Tooltip content={makeTooltip({ unit: " years", labelFormat: l => `Age ${l}` })} />
          <Line dataKey="male" name="Male" stroke={C.male} strokeWidth={2.5} dot={false} isAnimationActive={false} />
          <Line dataKey="female" name="Female" stroke={C.female} strokeWidth={2.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function LifeTrendData() {
  return <DataDisclosure><DataTable caption="Life expectancy at birth" headings={["Year", "Years"]} rows={lifeExpectancyTrend.map(d => [d.year, d.value])} decimals={1} minWidth={260} /></DataDisclosure>;
}

/** Female and male life expectancy at birth, 2021, as a compact icon pair. */
export function LifeBySexPair() {
  const items = [{ name: "Women", value: 66.8, tone: "rose" as Tone }, { name: "Men", value: 63.3, tone: "blue" as Tone }];
  return (
    <ul className="grid grid-cols-2 gap-2" aria-label="Life expectancy at birth by sex, 2021">
      {items.map(it => (
        <li key={it.name} className="flex items-center gap-2 rounded-[var(--radius-md)] px-2.5 py-2" style={{ background: tones[it.tone].bg }}>
          <UserRound size={22} aria-hidden="true" style={{ color: tones[it.tone].fill }} />
          <span className="leading-tight"><span className="tabular block text-lg font-bold" style={{ color: tones[it.tone].fg }}>{it.value.toFixed(1)} <span className="text-xs font-medium text-body">years</span></span><span className="text-xs text-body">{it.name}</span></span>
        </li>
      ))}
    </ul>
  );
}

/* ── Migration ───────────────────────────────────────────────────────────── */

export function MigrationFlowsCard() {
  const data = REGIONS.map(r => ({ region: r, in: internalMigrationFlows[r].in, out: -internalMigrationFlows[r].out, net: internalMigrationFlows[r].in - internalMigrationFlows[r].out }))
    .sort((a, b) => b.net - a.net);
  return (
    <ChartCard title="Migrants into and out of each region" subtitle="Lifetime internal migrants, persons" period="2021 census"
      explain={{ indicator: "internalMigration", title: "Inter-regional migration" }}
      notes="In-migrants were born elsewhere in Ghana and counted in the region; out-migrants were born in the region and counted elsewhere. Net = in − out, matching the net-migration figures. Regions sorted by net gain."
      source="GSS 2021 PHC · Figure 3.13, p. 24 (totals labelled in the chart)"
      footer={<DataDisclosure><DataTable caption="Lifetime internal migrants by region, 2021" headings={["Region", "In-migrants", "Out-migrants", "Net"]} rows={data.map(d => [d.region, d.in, -d.out, d.net])} decimals={0} minWidth={420} /></DataDisclosure>}>
      <Legend className="mb-2" items={[{ label: "In-migrants", color: C.purple }, { label: "Out-migrants", color: C.amber }]} />
      <ChartFrame height={470} label="Lifetime in-migrants and out-migrants by region, 2021. Greater Accra received 1,492,378 and sent 386,377.">
        <BarChart data={data} layout="vertical" stackOffset="sign" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barCategoryGap="18%">
          <CartesianGrid stroke={C.grid} horizontal={false} />
          <XAxis type="number" {...axisCommon} tick={tick} domain={[-800000, 1600000]} ticks={[-500000, 0, 500000, 1000000, 1500000]} tickFormatter={v => v === 0 ? "0" : `${v < 0 ? "−" : ""}${Math.abs(v) / 1e6}M`} />
          <YAxis type="category" dataKey="region" {...axisCommon} tick={tickSmall} width={96} />
          <ReferenceLine x={0} stroke={C.slate} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ format: v => Math.abs(v).toLocaleString("en-GB") })} />
          <Bar dataKey="in" name="In-migrants" stackId="m" fill={C.purple} isAnimationActive={false} />
          <Bar dataKey="out" name="Out-migrants" stackId="m" fill={C.amber} isAnimationActive={false} />
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function NetMigrationCard() {
  const data = netMigration2021.map(([name, value]) => ({ name: String(name), value: Number(value) }));
  return (
    <ChartCard title="Net migration by region" subtitle="Net lifetime migrants, persons (rounded)" period="2021 census" explain={{ indicator: "netMigration" }}
      notes="Bars right of zero are net gains; bars left of zero are net losses. A loss does not mean nobody moved in."
      source="GSS 2021 PHC · Figure 3.11, p. 23"
      footer={<DataDisclosure><DataTable caption="Net migration by region, 2021" headings={["Region", "Net migration (persons)"]} rows={data.map(d => [d.name, d.value])} decimals={0} minWidth={300} /></DataDisclosure>}>
      <Legend className="mb-2" items={[{ label: "Net gain", color: C.purple }, { label: "Net loss", color: C.amber }]} />
      <ChartFrame height={470} label="Net migration by region, 2021: Greater Accra +1,106,000; Volta −435,000">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 56, left: 0, bottom: 0 }} barCategoryGap="18%">
          <CartesianGrid stroke={C.grid} horizontal={false} />
          <XAxis type="number" {...axisCommon} tick={tick} domain={[-1000000, 1200000]} ticks={[-500000, 0, 500000, 1000000]} tickFormatter={v => v === 0 ? "0" : `${v < 0 ? "−" : ""}${Math.abs(v) / 1e6}M`} />
          <YAxis type="category" dataKey="name" {...axisCommon} tick={tickSmall} width={96} />
          <ReferenceLine x={0} stroke={C.slate} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ format: v => `${v > 0 ? "+" : "−"}${Math.abs(v).toLocaleString("en-GB")} persons` })} />
          <Bar dataKey="value" name="Net migration" isAnimationActive={false} radius={2}>
            {data.map(d => <Cell key={d.name} fill={d.value >= 0 ? C.purple : C.amber} />)}
            <LabelList dataKey="value" position="right" formatter={(v: unknown) => `${Number(v) > 0 ? "+" : "−"}${Math.abs(Number(v) / 1000).toLocaleString("en-GB")}k`} style={{ fontSize: 12, fill: C.muted }} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function MigrationStats() {
  return (
    <Grid cols={4} className="mb-4 lg:mb-5">
      <Stat label="Enumerated outside region of birth" value="27.0" unit="%" context="2021, down from 34.7% in 2010 · Figure 3.12" />
      <Stat label="Ghanaians recorded abroad" value="293,416" context="2021, up from 250,624 in 2010 · Figure 3.14" />
      <Stat label="Emigrants who left for work" value="73.4" unit="%" context="Emigrants aged 15+, 2021 · Figure 3.15" />
      <Stat label="Immigrants in the population" value="1.0" unit="%" context="2021, down 0.6 percentage points from 2010 · Figure 3.17" />
    </Grid>
  );
}

export function InternalMigrationCard() {
  const last = internalMigrationData.at(-1)!;
  const inTen = Math.round(last.value / 10);
  return (
    <ChartCard title="Internal migration over time" subtitle="% of people enumerated outside their region of birth" period="2000, 2010 and 2021 censuses" explain={{ indicator: "internalMigration" }}
      notes="Lifetime migration: region of birth compared with region of enumeration. It does not count every move a person made."
      source="GSS PHC 2000, 2010 and 2021 · Figure 3.12, p. 24"
      footer={<DataDisclosure><DataTable caption="Internal migrants, % of population" headings={["Census year", "Enumerated outside region of birth (%)"]} rows={internalMigrationData.map(d => [d.year, d.value])} decimals={1} minWidth={300} /></DataDisclosure>}>
      <Milestones data={internalMigrationData} tone="purple" icon={Route} format={pct} unit="per cent" />
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Pictogram highlighted={inTen} label={`${inTen} of 10 people highlighted`} />
        <p className="text-[13px] font-medium text-ink">About {inTen} in 10 Ghanaians live outside their region of birth ({last.year}).</p>
      </div>
    </ChartCard>
  );
}

export function EmigrantsAbroadCard() {
  const [before, after] = emigrationData;
  const change = after.value - before.value;
  const changePct = (change / before.value) * 100;
  const sign = change >= 0 ? "+" : "−";
  return (
    <ChartCard title="Census-recorded Ghanaians abroad" subtitle="Persons reported as living abroad" period="2010 and 2021 censuses" explain={{ indicator: "emigration" }}
      notes="Census reporting by household members does not capture every Ghanaian abroad."
      source="GSS 2010 and 2021 PHC · Figure 3.14, p. 25"
      footer={<DataDisclosure><DataTable caption="Census-recorded emigrants" headings={["Census year", "Persons"]} rows={emigrationData.map(d => [d.year, d.value])} decimals={0} minWidth={260} /></DataDisclosure>}>
      <div className="flex items-center gap-3 sm:gap-4">
        <IconTile icon={Plane} tone="teal" size="lg" />
        <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <p className="text-center"><span className="tabular block text-[22px] font-semibold leading-none text-body">{before.value.toLocaleString("en-GB")}</span><span className="mt-1 block text-xs text-muted">{before.year}</span></p>
          <ArrowRight size={20} aria-hidden="true" className="text-subtle" />
          <p className="text-center"><span className="tabular block text-[28px] font-bold leading-none" style={{ color: tones.teal.fg }}>{after.value.toLocaleString("en-GB")}</span><span className="mt-1 block text-xs font-semibold text-ink">{after.year}</span></p>
        </div>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-body">
        <span className="tabular rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: tones.teal.bg, color: tones.teal.fg }}>{sign}{Math.abs(change).toLocaleString("en-GB")} ({sign}{Math.abs(changePct).toFixed(1)}%)</span>
        <span>change between the two censuses</span>
      </p>
    </ChartCard>
  );
}

export function ImmigrantsCard() {
  const [before, after] = immigrationData;
  const diff = after.value - before.value;
  return (
    <ChartCard title="Immigrants as a share of the population" subtitle="% of Ghana’s total population" period="2010 and 2021 censuses" explain={{ indicator: "immigration" }}
      notes="Each square is 1% of the population. A population share is not the number of people arriving in a year."
      source="GSS 2010 and 2021 PHC · Figure 3.17, p. 26"
      footer={<DataDisclosure><DataTable caption="Immigrants, % of population" headings={["Census year", "Immigrants (%)"]} rows={immigrationData.map(d => [d.year, d.value])} decimals={1} minWidth={260} /></DataDisclosure>}>
      <div className="flex items-start gap-3 sm:gap-4">
        <IconTile icon={IdCard} tone="blue" size="lg" />
        <div className="grid flex-1 grid-cols-2 gap-4">
          {immigrationData.map((d, i) => {
            const latest = i === immigrationData.length - 1;
            return (
              <figure key={d.year} className="min-w-0">
                <Waffle value={d.value} tone="blue" label={`${d.year}: ${pct(d.value)} of the population`} />
                <figcaption className="mt-2">
                  <span className="tabular block text-[22px] font-bold leading-none" style={{ color: latest ? tones.blue.fg : "#334155" }}>{pct(d.value)}</span>
                  <span className={`text-xs ${latest ? "font-semibold text-ink" : "text-muted"}`}>{d.year}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
      <Takeaway>About 1 in 100 people in {after.year}, {Math.abs(diff).toFixed(1)} percentage points {diff < 0 ? "lower" : "higher"} than in {before.year}.</Takeaway>
    </ChartCard>
  );
}

const reasonIcons: Record<string, LucideIcon> = { "Employment": Briefcase, "Education / training": GraduationCap, "Marriage / family": Heart, "Settlement": House, "Other / health": HeartPulse };

export function EmigrationReasonsCard() {
  return (
    <ChartCard title="Reasons for emigrating" subtitle="% of census-recorded emigrants aged 15 and over" period="2021 census" explain={{ indicator: "emigrationReasons" }}
      notes="Bars are drawn on a 0–100% scale. Shares may not total 100% because of rounding."
      source="GSS 2021 PHC · Figure 3.15, p. 25"
      footer={<DataDisclosure><DataTable caption="Reasons for emigrating" headings={["Reason", "% of emigrants aged 15+"]} rows={emigrationReasonsData.map(r => [r.name, r.value])} decimals={1} minWidth={300} /></DataDisclosure>}>
      <ul className="space-y-3">
        {emigrationReasonsData.map(r => <IconBarRow key={r.name} icon={reasonIcons[r.name] ?? Briefcase} label={r.name.replace(" / ", " or ")} value={r.value} tone="teal" />)}
      </ul>
      <Takeaway>Work dominates: about three in four emigrants left for employment.</Takeaway>
    </ChartCard>
  );
}

export function EmigrantDestinationsCard() {
  return (
    <ChartCard title="Where emigrants live" subtitle="% of census-recorded emigrants, by destination" period="2021 census" explain={{ indicator: "emigrantDestinations" }}
      notes="ECOWAS and Other Africa are separate categories. Bars are drawn on a 0–100% scale. Shares may not total 100% because of rounding."
      source="GSS 2021 PHC · Figure 3.16, pp. 25–26"
      footer={<DataDisclosure><DataTable caption="Destinations of emigrants" headings={["Destination", "% of emigrants"]} rows={emigrantDestinationsData.map(r => [r.name, r.value])} decimals={1} minWidth={300} /></DataDisclosure>}>
      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
        {emigrantDestinationsData.map((d, i) => (
          <li key={d.name} className="flex flex-col rounded-[var(--radius-md)] border border-line bg-surface-muted/60 p-3">
            <span className="flex items-center gap-2">
              <Earth size={18} aria-hidden="true" style={{ color: tones.purple.fill }} />
              <span className="text-[13px] font-medium text-body">{d.name}</span>
            </span>
            <span className="tabular mt-2 text-[24px] font-bold leading-none" style={{ color: i === 0 ? tones.purple.fg : C.ink }}>{pct(d.value)}</span>
            <span aria-hidden="true" className="mt-2.5 block h-1.5 rounded-full bg-[#E3E6EE]"><span className="block h-full rounded-full" style={{ width: `${d.value}%`, background: tones.purple.fill }} /></span>
          </li>
        ))}
      </ul>
      <Takeaway>Europe is the most common destination, followed by the Americas and ECOWAS countries.</Takeaway>
    </ChartCard>
  );
}
