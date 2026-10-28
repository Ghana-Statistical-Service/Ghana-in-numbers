"use client";

import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Briefcase, BriefcaseBusiness, Flower2, GraduationCap, UserRoundX, Users, UsersRound, type LucideIcon } from "lucide-react";
import { ChartCard, Stat } from "@/components/ui/Card";
import { StatTile, tones } from "@/components/ui/Infographic";
import { DataDisclosure, DataTable, Legend } from "@/components/ui/Data";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, tick } from "@/components/ui/chart";
import { labourParticipationData, neetData, tourismPurposeData, unemploymentData } from "@/data/businessEconomyData";
import { labourLevels2025, tourismPurposes, tourismSplit } from "@/data/publicationAdditions";

const yearLabel = (y: string) => y === "2025" ? "2025 (Q1–Q3 avg)" : y;

/**
 * Survey series drawn with straight segments and markers. `proportional` spaces years by elapsed time
 * (e.g. 2017 then 2021–2025) instead of one step per observation.
 */
function TrendLines({ data, series, max, label, height = 240, proportional = false }: { data: Record<string, string | number>[]; series: { key: string; label: string; color: string; dashed?: boolean; below?: boolean }[]; max: number; label: string; height?: number; proportional?: boolean }) {
  const rows = data.map(d => ({ ...d, yearNum: Number(d.year) }));
  const yearNums = rows.map(r => r.yearNum);
  return (
    <ChartFrame height={height} label={label}>
      <LineChart data={rows} margin={{ top: 22, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={C.grid} vertical={false} />
        {proportional
          ? <XAxis dataKey="yearNum" type="number" {...axisCommon} tick={tick} domain={[Math.min(...yearNums) - 0.5, Math.max(...yearNums) + 0.5]} ticks={yearNums} allowDecimals={false} />
          : <XAxis dataKey="year" {...axisCommon} tick={tick} padding={{ left: 14, right: 14 }} />}
        <YAxis {...axisCommon} tick={tick} domain={[0, max]} tickFormatter={v => `${v}%`} width={48} />
        <Tooltip content={makeTooltip({ unit: "%", labelFormat: l => yearLabel(String(l)) })} />
        {series.map(s => (
          <Line key={s.key} type="linear" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2.5} strokeDasharray={s.dashed ? "6 4" : undefined} dot={{ r: 3.5, fill: s.color }} isAnimationActive={false}>
            <LabelList dataKey={s.key} position={s.below ? "bottom" : "top"} offset={8} formatter={(v: unknown) => Number(v).toFixed(1)} style={{ ...labelStyle, fontSize: 12, fill: s.color }} />
          </Line>
        ))}
      </LineChart>
    </ChartFrame>
  );
}

export function ParticipationCard() {
  const s = [{ key: "labourForce", label: "Labour-force participation", color: C.purple }, { key: "employmentPopulation", label: "Employment-to-population", color: C.teal, below: true }];
  return (
    <ChartCard title="Labour-force participation and employment" subtitle="% of the working-age population" period="2022–2025" explain={{ indicator: "participation" }}
      notes="2025 is the Q1–Q3 average (QLFS); 2022–2024 are annual (AHIES). Participation includes jobseekers; the employment-to-population ratio counts only people in work."
      source="GSS AHIES 2022–2024; QLFS 2025 · Figure 5.17, p. 60"
      footer={<DataDisclosure><DataTable caption="Labour market participation" headings={["Year", "Participation (%)", "Employment-to-population (%)"]} rows={labourParticipationData.map(d => [yearLabel(d.year), d.labourForce, d.employmentPopulation])} decimals={1} minWidth={380} /></DataDisclosure>}>
      <Legend className="mb-1" items={s.map(x => ({ label: x.label, color: x.color, shape: "line" as const }))} />
      <TrendLines data={labourParticipationData} series={s} max={100} label="Labour-force participation rose from 67.1% in 2022 to 74.5% in 2025; employment-to-population rose from 58.3% to 65.0%" />
    </ChartCard>
  );
}

export function UnemploymentCard() {
  const s = [{ key: "youth1524", label: "Youth 15–24", color: C.amber }, { key: "youth1535", label: "Youth 15–35", color: C.rose }, { key: "national", label: "National", color: C.purple, below: true }];
  return (
    <ChartCard title="Unemployment rate" subtitle="% of the labour force in each group" period="2017, 2021–2025" explain={{ indicator: "unemployment" }}
      notes="A share of each group’s labour force, not of all young people. The year axis is spaced by time: there is no observation between 2017 and 2021. 2025 is the Q1–Q3 average."
      source="GSS AHIES 2022–2024; QLFS 2025 · Figure 5.18, p. 61"
      footer={<DataDisclosure><DataTable caption="Unemployment rate by group" headings={["Year", "Youth 15–24 (%)", "Youth 15–35 (%)", "National (%)"]} rows={unemploymentData.map(d => [yearLabel(d.year), d.youth1524, d.youth1535, d.national])} decimals={1} minWidth={420} /></DataDisclosure>}>
      <Legend className="mb-1" items={s.map(x => ({ label: x.label, color: x.color, shape: "line" as const }))} />
      <TrendLines proportional data={unemploymentData} series={s} max={40} label="Unemployment in 2025: 32.4% for ages 15–24, 21.9% for ages 15–35, 12.8% nationally" />
    </ChartCard>
  );
}

export function NeetCard() {
  const s = [{ key: "youth1524", label: "Youth 15–24", color: C.amber }, { key: "youth1535", label: "Youth 15–35", color: C.rose, below: true }];
  return (
    <ChartCard title="Young people not in employment, education or training" subtitle="NEET, % of all people in the age group" period="2022–2025" explain={{ indicator: "neet" }}
      notes="The denominator is everyone in the age group, unlike unemployment. 2025 is the Q1–Q3 average; the Q3 2025 rate alone was higher (21.5% and 19.5%)."
      source="GSS AHIES 2022–2024; QLFS 2025 · Figure 5.19, p. 61"
      footer={<DataDisclosure><DataTable caption="Youth NEET rate" headings={["Year", "Youth 15–24 (%)", "Youth 15–35 (%)"]} rows={neetData.map(d => [yearLabel(d.year), d.youth1524, d.youth1535])} decimals={1} minWidth={340} /></DataDisclosure>}>
      <Legend className="mb-1" items={s.map(x => ({ label: x.label, color: x.color, shape: "line" as const }))} />
      <TrendLines data={neetData} series={s} max={30} label="Youth NEET rates fell from 22.4% and 21.7% in 2022 to 19.1% and 17.9% in 2025" />
    </ChartCard>
  );
}

export function LabourGlance() {
  const p = labourParticipationData.at(-1)!, u = unemploymentData.at(-1)!, n = neetData.at(-1)!;
  return (
    <ul className="mb-4 grid gap-2.5 sm:grid-cols-2 lg:mb-5 xl:grid-cols-5" aria-label="Labour market, latest values">
      <StatTile icon={Users} label="Labour-force participation" value={`${p.labourForce.toFixed(1)}%`} period={yearLabel(p.year)} />
      <StatTile icon={Briefcase} tone="teal" label="Employment-to-population" value={`${p.employmentPopulation.toFixed(1)}%`} period={yearLabel(p.year)} />
      <StatTile icon={UserRoundX} tone="blue" label="National unemployment" value={`${u.national.toFixed(1)}%`} period={yearLabel(u.year)} />
      <StatTile icon={GraduationCap} tone="amber" label="Youth unemployment, 15–24" value={`${u.youth1524.toFixed(1)}%`} period={yearLabel(u.year)} />
      <StatTile icon={UsersRound} tone="rose" label="NEET, ages 15–24" value={`${n.youth1524.toFixed(1)}%`} period={yearLabel(n.year)} note={`Ages 15–35: ${n.youth1535.toFixed(1)}%`} />
    </ul>
  );
}

export function LabourStats() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Stat label="Persons employed" value={labourLevels2025.employedMillion.toFixed(1)} unit="million" context="Average Q1–Q3 2025 · Table 2.1" />
      <Stat label="In vulnerable employment" value={labourLevels2025.vulnerableEmploymentMillion.toFixed(1)} unit="million" context={`${labourLevels2025.vulnerablePeriod} · Table 2.1`} />
      <Stat label="Informal share of employment" value="Over 70" unit="%" context="All employment, average Q1–Q3 2025" />
    </div>
  );
}

/* ── Tourism ─────────────────────────────────────────────────────────────── */

const purposeIcons: Record<string, LucideIcon> = { "Funeral": Flower2, "Visiting friends & relatives": Users, "Business & professional": BriefcaseBusiness };

const flowColor = { Domestic: C.purple, Inbound: C.teal, Outbound: C.amber } as Record<string, string>;

export function TourismCard() {
  const visitors = tourismSplit.map(t => ({ flow: t.flow, overnight: t.overnight / 1e6, sameDay: t.sameDay / 1e6 }));
  const spend = tourismSplit.map(t => ({ flow: t.flow, overnight: t.overnightSpend, sameDay: t.sameDaySpend }));
  return (
    <ChartCard title="Tourism flows and spending" subtitle="Visitors (million) and expenditure (GH¢ billion), by type of trip" period="2023"
      explain={{ indicator: "tourism" }}
      notes={<>Same-day and overnight flows are counted separately and are not unique people. The GH¢22.01 billion headline is domestic plus inbound spending; outbound spending (GH¢3.46 billion) is residents’ spending abroad.</>}
      source="GSS DOTS and GITS 2023 · Figures 5.20–5.21, Table 5.8, pp. 62, 63"
      footer={<DataDisclosure><DataTable caption="Tourism flows and expenditure, 2023" headings={["Flow", "Overnight visitors", "Same-day visitors", "Total visitors", "Overnight spend (GH¢ bn)", "Same-day spend (GH¢ bn)", "Total spend (GH¢ bn)"]} rows={tourismSplit.map(t => [t.flow, t.overnight, t.sameDay, t.totalVisitors, t.overnightSpend, t.sameDaySpend, t.totalSpend])} minWidth={760} unitNote="Domestic overnight and same-day counts are printed rounded to 0.1 million." /></DataDisclosure>}>
      <div className="grid gap-3 sm:grid-cols-3">
        {tourismSplit.map(t => <Stat key={t.flow} label={`${t.flow} visitors`} value={t.totalVisitors.toLocaleString("en-GB")} context={`GH¢${t.totalSpend.toFixed(2)} billion spent`} />)}
      </div>
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <div>
          <p className="mb-1 text-[13.5px] font-semibold text-ink">Visitors, million</p>
          <Legend className="mb-1" items={[{ label: "Overnight", color: C.purple }, { label: "Same day", color: C.purpleFaint }]} />
          <ChartFrame height={170} label="Visitors by flow: domestic 15.4 million, inbound 0.9 million, outbound 0.5 million">
            <BarChart data={visitors} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }} barCategoryGap="28%">
              <CartesianGrid stroke={C.grid} horizontal={false} />
              <XAxis type="number" {...axisCommon} tick={tick} domain={[0, 16]} />
              <YAxis type="category" dataKey="flow" {...axisCommon} tick={{ ...tick, fill: C.ink }} width={74} />
              <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ format: v => `${(v * 1e6).toLocaleString("en-GB", { maximumFractionDigits: 0 })}` })} />
              <Bar dataKey="overnight" name="Overnight" stackId="v" fill={C.purple} isAnimationActive={false} />
              <Bar dataKey="sameDay" name="Same day" stackId="v" fill={C.purpleFaint} isAnimationActive={false} />
            </BarChart>
          </ChartFrame>
        </div>
        <div>
          <p className="mb-1 text-[13.5px] font-semibold text-ink">Expenditure, GH¢ billion</p>
          <Legend className="mb-1" items={[{ label: "Overnight", color: C.teal }, { label: "Same day", color: C.tealLight }]} />
          <ChartFrame height={170} label="Expenditure by flow: inbound GH¢15.42 billion, domestic GH¢6.59 billion, outbound GH¢3.46 billion">
            <BarChart data={spend} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }} barCategoryGap="28%">
              <CartesianGrid stroke={C.grid} horizontal={false} />
              <XAxis type="number" {...axisCommon} tick={tick} domain={[0, 16]} />
              <YAxis type="category" dataKey="flow" {...axisCommon} tick={{ ...tick, fill: C.ink }} width={74} />
              <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ format: v => `GH¢${v.toLocaleString("en-GB", { maximumFractionDigits: 3 })} bn` })} />
              <Bar dataKey="overnight" name="Overnight" stackId="s" fill={C.teal} isAnimationActive={false} />
              <Bar dataKey="sameDay" name="Same day" stackId="s" fill={C.tealLight} isAnimationActive={false} />
            </BarChart>
          </ChartFrame>
        </div>
      </div>
      <div className="mt-5 grid gap-4 border-t border-line pt-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div>
          <p className="mb-2 text-[13.5px] font-semibold text-ink">Main purpose of domestic trips</p>
          <p className="mb-2 text-xs text-muted">% of domestic trips; bars on a 0–100% scale</p>
          <ul className="space-y-2">
            {tourismPurposeData.map(p => {
              const Icon = purposeIcons[p.purpose] ?? Users;
              return (
                <li key={p.purpose} className="grid grid-cols-[2rem_minmax(0,1fr)_3.25rem] items-center gap-x-3 text-[13px]">
                  <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: tones.purple.bg, color: tones.purple.fg }}><Icon size={16} aria-hidden="true" /></span>
                  <span className="min-w-0"><span className="block text-body">{p.purpose}</span><span aria-hidden="true" className="mt-1 block h-1.5 rounded-full bg-surface-muted"><span className="block h-full rounded-full" style={{ width: `${p.share}%`, background: flowColor.Domestic }} /></span></span>
                  <span className="tabular text-right font-semibold text-ink">{p.share.toFixed(1)}%</span>
                </li>
              );
            })}
          </ul>
        </div>
        <dl className="space-y-1.5 text-[13px] leading-relaxed">
          <div><dt className="inline font-semibold text-ink">Domestic: </dt><dd className="inline text-body">{tourismPurposes.domestic}.</dd></div>
          <div><dt className="inline font-semibold text-ink">Inbound: </dt><dd className="inline text-body">{tourismPurposes.inbound}.</dd></div>
          <div><dt className="inline font-semibold text-ink">Outbound: </dt><dd className="inline text-body">{tourismPurposes.outbound}.</dd></div>
        </dl>
      </div>
    </ChartCard>
  );
}
