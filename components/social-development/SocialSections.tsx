"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import {
  ArrowRight, Backpack, BookOpen, Brain, Building2, Droplet, GraduationCap, HeartCrack, House, Lightbulb, School, ShieldAlert, ShieldPlus, Toilet, Trees,
  UserRound, Users, type LucideIcon,
} from "lucide-react";
import { ChartCard, Qualifier, Stat } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Legend, Segmented } from "@/components/ui/Data";
import { IconTile, Milestones, Pictogram, Takeaway, tones, type Tone } from "@/components/ui/Infographic";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, tick, tickSmall } from "@/components/ui/chart";
import {
  childMarriageData, completionRateData, drinkingWaterData, electricityAccessData, enrolmentRateData, gbvPrevalenceData,
  healthInsuranceCoverageData, housingDeficitData, improvedToiletUseData, pupilTeacherRatioData, teenageMotherhoodData,
} from "@/data/socialDevelopmentData";

const pct = (v: number) => `${v.toFixed(1)}%`;
const signed = (v: number, digits = 1) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(digits)}`;

const levels = [
  { key: "kg", label: "KG", color: C.teal },
  { key: "primary", label: "Primary", color: C.purple },
  { key: "jhs", label: "JHS", color: C.amber },
] as const;

/** Small figure tile: icon, label, big value with unit, period. */
function GlanceTile({ icon, tone = "purple", label, value, unit, period, note }: { icon: LucideIcon; tone?: Tone; label: string; value: string; unit?: string; period: string; note?: string }) {
  return (
    <li className="flex min-w-0 items-start gap-3 rounded-[var(--radius-md)] bg-surface-muted px-3.5 py-3">
      <IconTile icon={icon} tone={tone} />
      <div className="min-w-0">
        <p className="text-[13px] leading-snug text-body">{label}</p>
        <p className="tabular mt-1 flex items-baseline gap-1"><span className="text-[26px] font-bold leading-none tracking-tight" style={{ color: tones[tone].fg }}>{value}</span>{unit && <span className="text-[13px] text-muted">{unit}</span>}</p>
        <p className="mt-1 text-xs font-medium text-ink">{period}</p>
        {note && <p className="text-xs text-muted">{note}</p>}
      </div>
    </li>
  );
}

/* ── Learning and opportunity ────────────────────────────────────────────── */

export function LearningGlanceCard() {
  const enrol = enrolmentRateData.at(-1)!, completion = completionRateData.at(-1)!, ptr = pupilTeacherRatioData.at(-1)!;
  return (
    <ChartCard title="Learning at a glance" subtitle="Latest figure for each indicator" period={`${enrol.year} (enrolment and completion); ${ptr.year} (teachers)`} explain={{ indicator: "enrolment" }}
      source="EMIS · Figures 4.1–4.3, pp. 28–29"
      footer={<DataDisclosure><DataTable caption="Latest learning indicators" headings={["Indicator", "Year", "Value"]} rows={[["Primary net enrolment rate (%)", enrol.year, enrol.primaryNet], ["JHS gross enrolment rate (%)", enrol.year, enrol.jhsGross], ["JHS completion rate (%)", completion.year, completion.jhs], ["Pupils per trained teacher, primary", ptr.year, ptr.primary]]} decimals={1} minWidth={380} /></DataDisclosure>}>
      <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <GlanceTile icon={Backpack} label="Primary net enrolment" value={pct(enrol.primaryNet)} period={enrol.year} />
        <GlanceTile icon={School} tone="amber" label="JHS gross enrolment" value={pct(enrol.jhsGross)} period={enrol.year} />
        <GlanceTile icon={GraduationCap} tone="teal" label="JHS completion" value={pct(completion.jhs)} period={completion.year} />
        <GlanceTile icon={BookOpen} tone="blue" label="Pupils per trained teacher" value={String(ptr.primary)} unit="primary" period={ptr.year} note={`KG ${ptr.kg}, JHS ${ptr.jhs}`} />
      </ul>
    </ChartCard>
  );
}

export function EnrolmentCard() {
  const [mode, setMode] = useState<"net" | "gross">("net");
  const data = enrolmentRateData.map(r => ({ year: r.year, kg: mode === "net" ? r.kgNet : r.kgGross, primary: mode === "net" ? r.primaryNet : r.primaryGross, jhs: mode === "net" ? r.jhsNet : r.jhsGross }));
  return (
    <ChartCard title="School enrolment rates" subtitle={mode === "net" ? "Net enrolment rate (NER), KG, primary and JHS, %" : "Gross enrolment rate (GER), KG, primary and JHS, %"} period="2019/20–2023/24"
      explain={{ indicator: "enrolment" }}
      actions={<Segmented label="Enrolment measure" size="sm" value={mode} onChange={setMode} options={[{ value: "net", label: "NER" }, { value: "gross", label: "GER" }]} />}
      notes={mode === "net" ? "NER counts only pupils of the official age. JHS rose from a low of 44.3% (2021/22) to 59.3% (2023/24)." : "GER counts pupils of all ages against the official-age population, so it can exceed 100% (dashed line)."}
      source="EMIS 2019/20–2023/24 · Figure 4.1, p. 28 (levels as labelled in the figure legend)"
      footer={<DataDisclosure><DataTable caption="Enrolment rates by level" headings={["School year", "KG NER", "Primary NER", "JHS NER", "KG GER", "Primary GER", "JHS GER"]} rows={enrolmentRateData.map(r => [r.year, r.kgNet, r.primaryNet, r.jhsNet, r.kgGross, r.primaryGross, r.jhsGross])} decimals={1} minWidth={620} /></DataDisclosure>}>
      <Legend className="mb-2" items={levels.map(l => ({ label: l.label, color: l.color, shape: "line" as const }))} />
      <ChartFrame height={250} label={`${mode === "net" ? "Net" : "Gross"} enrolment by level, 2019/20 to 2023/24`}>
        <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tickSmall} padding={{ left: 16, right: 16 }} />
          <YAxis {...axisCommon} tick={tick} domain={[0, mode === "net" ? 100 : 130]} ticks={mode === "net" ? [0, 25, 50, 75, 100] : [0, 25, 50, 75, 100, 125]} tickFormatter={v => `${v}%`} width={50} />
          {mode === "gross" && <ReferenceLine y={100} stroke={C.slateLight} strokeDasharray="4 4" />}
          <Tooltip content={makeTooltip({ unit: "%" })} />
          {levels.map(l => <Line key={l.key} type="linear" connectNulls dataKey={l.key} name={l.label} stroke={l.color} strokeWidth={2.5} dot={{ r: 3.5, fill: l.color }} isAnimationActive={false} />)}
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function CompletionCard() {
  const last = completionRateData.at(-1)!, prev = completionRateData.at(-2)!;
  return (
    <ChartCard title="Completion rates" subtitle="Gross completion ratio, primary and JHS, %. Values above 100% are real: the ratio counts completers of any age." period="2019/20–2023/24" explain={{ indicator: "completion" }}
      qualifier={<Qualifier tone="brand">JHS {pct(last.jhs)}</Qualifier>}
      notes={`An administrative ratio: pupils’ varying ages can push it above 100% (dashed line). JHS completion was ${pct(last.jhs)} in ${last.year}, down from ${pct(prev.jhs)} a year earlier.`}
      source="EMIS · Figure 4.2, p. 29"
      footer={<DataDisclosure><DataTable caption="Completion rates" headings={["School year", "Primary (%)", "JHS (%)"]} rows={completionRateData.map(r => [r.year, r.primary, r.jhs])} decimals={1} minWidth={320} /></DataDisclosure>}>
      <Legend className="mb-2" items={[{ label: "Primary", color: C.purple, shape: "line" }, { label: "JHS", color: C.amber, shape: "line" }]} />
      <ChartFrame height={250} label="Completion rates: JHS rose from 77.5% to 88.4%; primary eased from 107.5% to 102.0%">
        <LineChart data={completionRateData} margin={{ top: 18, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tickSmall} padding={{ left: 16, right: 16 }} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 120]} ticks={[0, 25, 50, 75, 100, 120]} tickFormatter={v => `${v}%`} width={50} />
          <ReferenceLine y={100} stroke={C.slateLight} strokeDasharray="4 4" />
          <Tooltip content={makeTooltip({ unit: "%" })} />
          <Line type="linear" connectNulls dataKey="primary" name="Primary" stroke={C.purple} strokeWidth={2.5} dot={{ r: 3.5, fill: C.purple }} isAnimationActive={false} />
          <Line type="linear" connectNulls dataKey="jhs" name="JHS" stroke={C.amber} strokeWidth={2.5} dot={{ r: 3.5, fill: C.amber }} isAnimationActive={false}>
            <LabelList dataKey="jhs" position="bottom" offset={8} formatter={(v: unknown) => Number(v).toFixed(1)} style={{ ...labelStyle, fill: "#9A5512" }} />
          </Line>
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function TeachersCard() {
  return (
    <ChartCard title="Pupil to trained teacher ratio" subtitle="Pupils for each trained teacher, by level" period="2010/11–2020/21" explain={{ indicator: "teachers" }}
      notes="Lower is better. Compare levels separately; the ratios should not be added. KG fell from 96 to 34 pupils per trained teacher."
      source="EMIS · Figure 4.3, p. 29"
      footer={<DataDisclosure><DataTable caption="Pupil to trained teacher ratio" headings={["School year", "KG", "Primary", "JHS"]} rows={pupilTeacherRatioData.map(r => [r.year, r.kg, r.primary, r.jhs])} decimals={0} minWidth={360} /></DataDisclosure>}>
      <Legend className="mb-2" items={levels.map(l => ({ label: l.label, color: l.color, shape: "line" as const }))} />
      <ChartFrame height={250} minWidth={520} label="Pupils per trained teacher by level, 2010/11 to 2020/21">
        <LineChart data={pupilTeacherRatioData} margin={{ top: 12, right: 28, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tickSmall} interval={1} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 100]} width={36} />
          <Tooltip content={makeTooltip({ decimals: 0, unit: " pupils" })} />
          {levels.map(l => <Line key={l.key} type="linear" dataKey={l.key} name={l.label} stroke={l.color} strokeWidth={2.5} dot={{ r: 3, fill: l.color }} isAnimationActive={false} />)}
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

/* ── Health and well-being ───────────────────────────────────────────────── */

export function NhisHeadlineCard() {
  const last = healthInsuranceCoverageData.at(-1)!, prev = healthInsuranceCoverageData.at(-2)!, first = healthInsuranceCoverageData[0];
  const ofThree = Math.round((last.value / 100) * 3);
  return (
    <ChartCard title="Active NHIS membership" subtitle="% of the population with active health insurance" period={last.year} explain={{ indicator: "health" }}
      notes="Active membership able to use services in the year, not everyone ever registered."
      source="National Health Insurance Authority; population denominator from GSS · Figure 4.4, p. 30"
      footer={<DataDisclosure><DataTable caption="Active NHIS coverage, latest and earlier years" headings={["Year", "Coverage (%)"]} rows={[[first.year, first.value], [prev.year, prev.value], [last.year, last.value]]} decimals={1} minWidth={260} /></DataDisclosure>}>
      <div className="flex items-center gap-4">
        <IconTile icon={ShieldPlus} tone="purple" size="lg" />
        <p className="tabular"><span className="block text-[40px] font-bold leading-none tracking-tight" style={{ color: tones.purple.fg }}>{pct(last.value)}</span><span className="mt-1 block text-xs font-semibold text-ink">{last.year}</span></p>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Pictogram total={3} highlighted={ofThree} icon={UserRound} size={34} label={`${ofThree} of 3 people highlighted`} />
        <p className="text-[13px] font-medium text-ink">About {ofThree} in 3 people covered</p>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-body">
        <span className="tabular rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: tones.purple.bg, color: tones.purple.fg }}>{signed(last.value - prev.value)} pp</span>
        <span>since {prev.year}; up from {pct(first.value)} in {first.year}</span>
      </p>
    </ChartCard>
  );
}

export function HealthInsuranceCard() {
  return (
    <ChartCard title="Health insurance coverage" subtitle="Active NHIS members, % of population" period="2010–2025" explain={{ indicator: "health" }}
      notes="Coverage peaked at 58.8% in 2015, fell to 48.3% in 2018, then rose 10.3 percentage points in 2025."
      source="National Health Insurance Authority; population denominator from GSS · Figure 4.4, p. 30"
      footer={<DataDisclosure><DataTable caption="Active health insurance coverage" headings={["Year", "Coverage (%)"]} rows={healthInsuranceCoverageData.map(d => [d.year, d.value])} decimals={1} minWidth={280} /></DataDisclosure>}>
      <ChartFrame height={280} minWidth={600} label="Active NHIS coverage rose from 30.0% in 2010 to 66.2% in 2025">
        <BarChart data={healthInsuranceCoverageData} margin={{ top: 22, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tickSmall} interval={0} padding={{ left: 4, right: 4 }} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 80]} ticks={[0, 20, 40, 60, 80]} tickFormatter={v => `${v}%`} width={46} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: "%" })} />
          <Bar dataKey="value" name="Active coverage" radius={[3, 3, 0, 0]} isAnimationActive={false}>
            {healthInsuranceCoverageData.map(d => <Cell key={d.year} fill={d.year === "2025" ? C.purple : C.purpleLight} />)}
            <LabelList dataKey="value" position="top" formatter={(v: unknown) => Number(v).toFixed(1)} style={{ ...labelStyle, fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function TeenageMotherhoodCard() {
  const series = [{ key: "national", label: "National", color: C.purple }, { key: "rural", label: "Rural", color: C.amber }, { key: "urban", label: "Urban", color: C.teal }] as const;
  const last = teenageMotherhoodData.at(-1)!;
  const tiles: { name: string; value: number; icon: LucideIcon; tone: Tone }[] = [
    { name: "National", value: last.national, icon: Users, tone: "purple" },
    { name: "Rural", value: last.rural, icon: Trees, tone: "amber" },
    { name: "Urban", value: last.urban, icon: Building2, tone: "teal" },
  ];
  return (
    <ChartCard title="Teenage motherhood" subtitle="Girls aged 15–19 who already have a child, %" period="2008–2022" explain={{ indicator: "teenage" }}
      notes="Survey years only (straight lines join them); values between surveys are not available."
      source="Figure 4.5, p. 31 (source line cites GDHS 2008, 2014 and 2022; the figure also plots 2011 and 2017)"
      footer={<DataDisclosure><DataTable caption="Teenage motherhood by locality" headings={["Year", "Rural (%)", "National (%)", "Urban (%)"]} rows={teenageMotherhoodData.map(r => [r.year, r.rural, r.national, r.urban])} decimals={1} minWidth={360} /></DataDisclosure>}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div>
          <p className="mb-2 text-xs font-medium text-muted">{last.year}</p>
          <ul className="grid grid-cols-3 gap-2">
            {tiles.map(t => (
              <li key={t.name} className="flex flex-col items-center rounded-[var(--radius-md)] px-2 py-3 text-center" style={{ background: tones[t.tone].bg }}>
                <t.icon size={26} aria-hidden="true" style={{ color: tones[t.tone].fill }} />
                <span className="tabular mt-1.5 text-[22px] font-bold leading-none" style={{ color: tones[t.tone].fg }}>{pct(t.value)}</span>
                <span className="mt-1 text-xs font-semibold text-ink">{t.name}</span>
              </li>
            ))}
          </ul>
          <Takeaway>Rural girls aged 15–19 are {(last.rural / last.urban).toFixed(1)} times as likely as urban girls to have had a child ({pct(last.rural)} against {pct(last.urban)}).</Takeaway>
        </div>
        <div className="flex min-w-0 flex-col">
          <Legend className="mb-2" items={series.map(s => ({ label: s.label, color: s.color, shape: "line" as const }))} />
          <ChartFrame height={240} label="Teenage motherhood, rural, national and urban, 2008 to 2022">
            <LineChart data={teenageMotherhoodData} margin={{ top: 18, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="year" {...axisCommon} tick={tick} padding={{ left: 16, right: 16 }} />
              <YAxis {...axisCommon} tick={tick} domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} tickFormatter={v => `${v}%`} width={42} />
              <Tooltip content={makeTooltip({ unit: "%" })} />
              {series.map(s => <Line key={s.key} type="linear" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={s.key === "national" ? 3 : 2.25} dot={{ r: 4, fill: s.color, stroke: "#fff", strokeWidth: 1.5 }} isAnimationActive={false} />)}
            </LineChart>
          </ChartFrame>
        </div>
      </div>
    </ChartCard>
  );
}

/* ── Living conditions ───────────────────────────────────────────────────── */

export function HousingCard() {
  const [before, after] = housingDeficitData;
  const change = after.deficit - before.deficit;
  const changePct = (change / before.deficit) * 100;
  return (
    <ChartCard title="Housing deficit" subtitle="Estimated shortfall in dwelling units, million" period="2010 and 2021" qualifier={<Qualifier tone="caution">Estimate</Qualifier>} explain={{ indicator: "housing" }}
      notes={`The deficit is an estimate that depends on occupancy assumptions; it does not measure housing quality, vacancy or affordability. The 2010 figure is printed as about ${before.deficit.toFixed(1)} million.`}
      source="GSS PHC 2010 and 2021 · Figure 4.7, pp. 32–33"
      footer={<DataDisclosure><DataTable caption="Housing indicators" headings={["Indicator", "Value"]} rows={[[`Housing deficit, ${before.year} (million units, estimate)`, before.deficit.toFixed(1)], [`Housing deficit, ${after.year} (million units, estimate)`, after.deficit.toFixed(2)], ["Housing requirement, 2021 (million units)", "11.81"], ["Dwelling units, 2021 (million)", "About 10.0"], ["Households, 2021 (million)", "8.3"], ["Residential structures, 2010 to 2021 (million)", "3.4 to 5.9 (+72.8%)"], ["Vacant dwelling units, 2021", "About one in eight"]]} minWidth={420} /></DataDisclosure>}>
      <div className="flex items-center gap-3 sm:gap-4">
        <IconTile icon={House} tone="amber" size="lg" />
        <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <p className="text-center"><span className="tabular block text-[24px] font-semibold leading-none text-body">{before.deficit.toFixed(1)}M</span><span className="mt-1 block text-xs text-muted">{before.year}</span></p>
          <ArrowRight size={20} aria-hidden="true" className="text-subtle" />
          <p className="text-center"><span className="tabular block text-[30px] font-bold leading-none" style={{ color: tones.amber.fg }}>{after.deficit.toFixed(2)}M</span><span className="mt-1 block text-xs font-semibold text-ink">{after.year}</span></p>
        </div>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-body">
        <span className="tabular rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: tones.amber.bg, color: tones.amber.fg }}>{signed(change, 2)} million ({signed(changePct)}%)</span>
        <span>change in the estimated shortfall</span>
      </p>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
        <Stat label="Dwelling units, 2021" value="10.0" unit="million" context="Approximate; one in eight vacant" />
        <Stat label="Housing requirement, 2021" value="11.81" unit="million units" context="Existing units plus the estimated shortfall" />
        <Stat label="Households, 2021" value="8.3" unit="million" context="Average size 3.6 persons" />
      </div>
    </ChartCard>
  );
}

/** One family of utility cards: icon, milestone figures (latest emphasised), a 10-household pictogram and a takeaway. */
function UtilityCard({ title, subtitle, data, tone, icon, pictoIcon = House, explain, takeaway, notes, source }: {
  title: string; subtitle: string; data: { year: string; value: number }[]; tone: Tone; icon: LucideIcon; pictoIcon?: LucideIcon; explain: string; takeaway: string; notes: string; source: string;
}) {
  const last = data.at(-1)!;
  const inTen = Math.round(last.value / 10);
  return (
    <ChartCard title={title} subtitle={subtitle} period={`${data[0].year}–${last.year}`} explain={{ indicator: explain }} notes={notes} source={source}
      footer={<DataDisclosure><DataTable caption={title} headings={["Year", "% of households"]} rows={data.map(d => [d.year, d.value])} decimals={1} minWidth={260} /></DataDisclosure>}>
      <Milestones data={data} tone={tone} icon={icon} format={pct} unit="per cent of households" />
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Pictogram highlighted={inTen} icon={pictoIcon} tone={tone} label={`${inTen} of 10 households highlighted`} />
        <p className="text-[13px] font-medium text-ink">About {inTen} in 10 households ({last.year})</p>
      </div>
      <Takeaway>{takeaway}</Takeaway>
    </ChartCard>
  );
}

export function ElectricityCard() {
  return <UtilityCard title="Access to electricity" subtitle="% of households with access" data={electricityAccessData} tone="amber" icon={Lightbulb} explain="electricity"
    takeaway="About one household in seven still had no electricity in 2021."
    notes="Census years; values between censuses are not available." source="GSS PHC 2000, 2010 and 2021 · Figure 4.8, p. 33" />;
}

export function WaterCard() {
  return <UtilityCard title="Improved drinking water" subtitle="% of households using an improved source" data={drinkingWaterData} tone="blue" icon={Droplet} pictoIcon={Droplet} explain="water"
    takeaway="More than nine in ten households used an improved source in 2021."
    notes="Source classification, not continuous supply or water quality." source="GSS PHC 2000, 2010 and 2021 · Figure 4.8, p. 33" />;
}

export function ToiletCard() {
  return <UtilityCard title="Use of improved household toilet" subtitle="% of households using an improved facility" data={improvedToiletUseData} tone="teal" icon={Toilet} explain="toilet"
    takeaway="Almost one household in three still lacked an improved toilet in 2022."
    notes="Note the different end year (2022) from the other utilities." source="GSS PHC 2010; survey data 2022 · Figure 4.8, p. 33" />;
}

/* ── Inclusion and protection ────────────────────────────────────────────── */

const violenceIcons: LucideIcon[] = [ShieldAlert, HeartCrack, Brain];

export function ViolenceCard() {
  const data = gbvPrevalenceData.map(d => ({ type: d.type.replace(" Violence", ""), y2016: d.value2016, y2022: d.value2022 }));
  const latest = tones.rose.fg;
  return (
    <ChartCard title="Prevalence of gender-based violence" subtitle="% reporting each form of violence" period="2016 and 2022" explain={{ indicator: "psychological", title: "Gender-based violence" }}
      notes="Each form is measured separately; the shares overlap and must not be added. Psychological violence remained the most common form."
      source="Figure 4.9, p. 34"
      footer={<DataDisclosure><DataTable caption="Gender-based violence prevalence" headings={["Form of violence", "2016 (%)", "2022 (%)", "Change (percentage points)"]} rows={data.map(d => [d.type, d.y2016, d.y2022, +(d.y2022 - d.y2016).toFixed(1)])} decimals={1} minWidth={420} /></DataDisclosure>}>
      <ul className="grid gap-2.5 sm:grid-cols-3">
        {data.map((d, i) => {
          const Icon = violenceIcons[i];
          return (
            <li key={d.type} className="flex flex-col items-center rounded-[var(--radius-md)] border border-line bg-surface-muted/60 p-3 text-center">
              <IconTile icon={Icon} tone="rose" />
              <p className="mt-2 text-[13px] font-semibold text-ink">{d.type}</p>
              <div className="mt-2 grid w-full grid-cols-2 gap-1">
                <p><span className="block text-xs text-muted">2016</span><span className="tabular text-[22px] font-semibold leading-none text-body">{pct(d.y2016)}</span></p>
                <p><span className="block text-xs font-semibold text-ink">2022</span><span className="tabular text-[22px] font-bold leading-none" style={{ color: latest }}>{pct(d.y2022)}</span></p>
              </div>
            </li>
          );
        })}
      </ul>
      <Legend className="mb-3 mt-5" items={[{ label: "2016", color: C.slateLight, shape: "dot" }, { label: "2022", color: C.rose, shape: "dot" }]} />
      <ul className="space-y-4" aria-label="Change in prevalence from 2016 to 2022">
        {data.map(d => (
          <li key={d.type}>
            <div className="mb-1 flex justify-between text-[13px]"><span className="font-medium text-ink">{d.type}</span><span className="tabular text-muted">{pct(d.y2016)} to <span className="font-semibold" style={{ color: latest }}>{pct(d.y2022)}</span> <span>({(d.y2022 - d.y2016).toFixed(1)} pp)</span></span></div>
            <div className="relative h-5">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
              <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-rose-200" style={{ left: `${(d.y2022 / 50) * 100}%`, width: `${((d.y2016 - d.y2022) / 50) * 100}%` }} />
              <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#B8C1CF] shadow" style={{ left: `${(d.y2016 / 50) * 100}%` }} />
              <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow" style={{ left: `${(d.y2022 / 50) * 100}%`, background: C.rose }} />
            </div>
          </li>
        ))}
      </ul>
      <div className="tabular mt-2 flex justify-between text-xs text-muted"><span>0%</span><span>25%</span><span>50%</span></div>
    </ChartCard>
  );
}

export function ChildMarriageCard() {
  const { value2010, value2021, year2010, year2021 } = childMarriageData;
  const inHundred = Math.round(value2021);
  return (
    <ChartCard title="Child marriage among girls" subtitle="Census indicator, %" period={`${year2010} and ${year2021}`} explain={{ indicator: "childMarriage" }}
      notes="Not the SDG measure (women aged 20–24 first married before 18). The regional breakdown in Figure 4.6 is not printed with values."
      source="GSS PHC 2010 and 2021 · Figure 4.6, pp. 31–32"
      footer={<DataDisclosure><DataTable caption="Child marriage, female" headings={["Census year", "%"]} rows={[[year2010, value2010], [year2021, value2021]]} decimals={1} minWidth={240} /></DataDisclosure>}>
      <div className="flex items-center gap-3 rounded-[var(--radius-md)] p-3" style={{ background: tones.rose.bg }}>
        <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white" style={{ color: tones.rose.fill }}><UserRound size={26} aria-hidden="true" /></span>
        <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <p className="text-center"><span className="tabular block text-[24px] font-semibold leading-none text-body">{pct(value2010)}</span><span className="mt-1 block text-xs text-muted">{year2010}</span></p>
          <ArrowRight size={18} aria-hidden="true" className="text-subtle" />
          <p className="text-center"><span className="tabular block text-[30px] font-bold leading-none" style={{ color: tones.rose.fg }}>{pct(value2021)}</span><span className="mt-1 block text-xs font-semibold text-ink">{year2021}</span></p>
        </div>
      </div>
      <div className="mt-4">
        <Pictogram total={100} highlighted={inHundred} icon={UserRound} size={14} tone="rose" label={`${inHundred} of 100 girls highlighted`} />
        <p className="mt-2 text-[13px] font-medium text-ink">About {inHundred} in 100 ({year2021}), {Math.abs(value2021 - value2010).toFixed(1)} percentage points lower than in {year2010}.</p>
      </div>
      <Takeaway>The practice declined between the censuses but has not ended.</Takeaway>
    </ChartCard>
  );
}
