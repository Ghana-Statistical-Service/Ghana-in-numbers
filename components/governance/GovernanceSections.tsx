"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard, Stat } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Legend } from "@/components/ui/Data";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, tick, tickSmall } from "@/components/ui/chart";
import { giftsToOfficialsData, noInfluenceData, noSayData, womenJudgesData, womenParliamentData } from "@/data/governanceData";
import { giftRequests, neverVoted } from "@/data/publicationAdditions";

export function ParliamentCard() {
  const data = womenParliamentData.map(d => ({ ...d, label: `${d.year}` }));
  return (
    <ChartCard title="Women in Parliament" subtitle="Share of parliamentary seats held by women, %" period="1993–2025 (1st–9th Parliaments)" explain={{ indicator: "parliament" }}
      notes="A record 14.9% in 2025, six percentage points above 1993, while women are 50.7% of the population. Each bar is the start of a parliamentary term."
      source="Parliamentary Service of Ghana · Figure 6.1, p. 90"
      footer={<DataDisclosure><DataTable caption="Women in Parliament" headings={["Year", "Parliament", "Women (%)"]} rows={womenParliamentData.map(d => [d.year, d.parliament, d.value])} decimals={[undefined, undefined, 1]} minWidth={320} /></DataDisclosure>}>
      <ChartFrame height={240} label="Women's share of parliamentary seats rose from 8.5% in 1993 to 14.9% in 2025">
        <BarChart data={data} margin={{ top: 22, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="label" {...axisCommon} tick={tick} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} tickFormatter={v => `${v}%`} width={42} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: "%", labelFormat: (l, p) => `${l} · ${String(p?.parliament ?? "")} Parliament` })} />
          <Bar dataKey="value" name="Women’s share of seats" radius={[3, 3, 0, 0]} isAnimationActive={false} maxBarSize={44}>
            {data.map(d => <Cell key={d.year} fill={d.year === "2025" ? C.purple : C.purpleLight} />)}
            <LabelList dataKey="value" position="top" formatter={(v: unknown) => Number(v).toFixed(1)} style={labelStyle} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function JudgesCard() {
  // 2012 is not reported in Figure 6.2; it is kept as a gap rather than joined.
  const data = [...womenJudgesData.slice(0, 4), { year: "2012", supreme: null, appeal: null, high: null }, ...womenJudgesData.slice(4)];
  const s = [{ key: "high", label: "High Court", color: C.teal }, { key: "appeal", label: "Court of Appeal", color: C.blue }, { key: "supreme", label: "Supreme Court", color: C.rose }];
  return (
    <ChartCard title="Women judges by court" subtitle="Women as % of judges in each court" period="2008–2025" explain={{ indicator: "judges" }}
      notes="Each court has its own denominator, so the lines must not be added. 2025: High Court 48.6%, Court of Appeal 40.3%, Supreme Court 25.0% (down from 46.2% in 2023). 2012 is not reported."
      source="Judicial Service of Ghana · Figure 6.2, p. 91"
      footer={<DataDisclosure><DataTable caption="Women judges by court" headings={["Year", "Supreme Court (%)", "Court of Appeal (%)", "High Court (%)"]} rows={data.map(d => [d.year, d.supreme, d.appeal, d.high])} decimals={1} minWidth={420} unitNote="— not reported." /></DataDisclosure>}>
      <Legend className="mb-1" items={s.map(x => ({ label: x.label, color: x.color, shape: "line" as const }))} />
      <ChartFrame height={260} label="Women judges by court, 2008 to 2025">
        <LineChart data={data} margin={{ top: 12, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tickSmall} interval={2} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 60]} ticks={[0, 20, 40, 60]} tickFormatter={v => `${v}%`} width={42} />
          <Tooltip content={makeTooltip({ unit: "%" })} />
          {s.map(x => <Line key={x.key} dataKey={x.key} name={x.label} stroke={x.color} strokeWidth={2.25} dot={{ r: 2.5, fill: x.color }} connectNulls={false} isAnimationActive={false} />)}
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

function PeriodBars({ data, color, max, label }: { data: { period: string; value: number }[]; color: string; max: number; label: string }) {
  return (
    <ChartFrame height={200} label={label}>
      <BarChart data={data} margin={{ top: 22, right: 4, left: -8, bottom: 0 }}>
        <CartesianGrid stroke={C.grid} vertical={false} />
        <XAxis dataKey="period" {...axisCommon} tick={tickSmall} interval={0} />
        <YAxis {...axisCommon} tick={tick} domain={[0, max]} ticks={[0, max / 3, (2 * max) / 3, max]} tickFormatter={v => `${v}%`} width={42} />
        <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: "%" })} />
        <Bar dataKey="value" name="Share" fill={color} radius={[3, 3, 0, 0]} maxBarSize={64} isAnimationActive={false}>
          <LabelList dataKey="value" position="top" formatter={(v: unknown) => `${Number(v).toFixed(1)}%`} style={labelStyle} />
        </Bar>
      </BarChart>
    </ChartFrame>
  );
}

export function GiftsCard() {
  return (
    <ChartCard title="Gifts to public officials" subtitle="% of people reporting each experience" period="2021–2025" explain={{ indicator: "gifts" }}
      notes="Being asked for a gift and actually giving one are separate measures. Requests refer to periods of different length (a full year in 2024, half-years in 2025). Reported giving fell about 10 percentage points between 2021 and 2025 (SDG 16.5.1 bribery incidence: 16.8%)."
      source="GSS Ghana Corruption Survey (2022) and Governance Series Waves 2–3 · Figures 6.3–6.4, p. 92"
      footer={<DataDisclosure><DataTable caption="Direct requests for gifts" headings={["Period", "Directly asked for a gift (%)"]} rows={giftRequests.map(d => [d.period, d.value])} decimals={1} minWidth={300} /><DataTable caption="Gave a gift to a public official" headings={["Year", "Gave a gift (%)"]} rows={giftsToOfficialsData.map(d => [d.year, d.value])} decimals={1} minWidth={300} /></DataDisclosure>}>
      <div className="grid gap-5 md:grid-cols-2">
        <div><p className="mb-1 text-[13.5px] font-semibold text-ink">Directly asked for a gift by an official</p><PeriodBars data={giftRequests} color={C.amber} max={60} label="Direct requests for gifts: 51.3% in 2024, 38.6% in January–June 2025, 50.5% in July–December 2025" /></div>
        <div><p className="mb-1 text-[13.5px] font-semibold text-ink">Gave a gift to a public official</p><PeriodBars data={giftsToOfficialsData.map(d => ({ period: d.year, value: d.value }))} color={C.purple} max={30} label="Gave a gift to a public official: 26.7% in 2021, 18.4% in 2024, 16.8% in 2025" /></div>
      </div>
    </ChartCard>
  );
}

export function VoiceCard() {
  const rows = [
    { label: "Feel they have no say in government decisions", points: noSayData.map(d => ({ year: d.year, value: d.value })), color: C.rose },
    { label: "Feel they cannot influence government action", points: noInfluenceData.map(d => ({ year: d.year, value: d.value })), color: C.blue },
  ];
  return (
    <ChartCard title="Feeling heard by government" subtitle="% of respondents · lower is better" period="2013, 2024 and 2025" explain={{ indicator: "noSay" }}
      notes="Perceptions, not measures of service delivery. Both fell by about 10 percentage points in a year; no say had halved since 2013 (59.9%). The 2013 figure is cited in the text; Figure 6.5 shows 2024 and 2025."
      source="GSS Governance Series Wave 3 · Figure 6.5, p. 93"
      footer={<DataDisclosure><DataTable caption="No say and no influence" headings={["Indicator", "2013", "2024", "2025"]} rows={[["No say in government decisions (%)", 59.9, 42.4, 29.7], ["No influence on government action (%)", null, 43.2, 33.0]]} decimals={1} minWidth={420} unitNote="— not reported. Table 11.1 (p. 134) gives 29.2% for no say; the figure, chapter text and Table 2.1 give 29.7%." /></DataDisclosure>}>
      <ul className="space-y-6">
        {rows.map(r => (
          <li key={r.label}>
            <p className="mb-2 text-[13px] font-medium text-ink">{r.label}</p>
            <div className="relative h-7">
              <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
              {r.points.map((p, i) => (
                <span key={p.year} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${(p.value / 70) * 100}%` }}>
                  <span className="block h-4 w-4 rounded-full border-2 border-white shadow" style={{ background: r.color, opacity: i === r.points.length - 1 ? 1 : 0.4 }} />
                </span>
              ))}
            </div>
            <p className="tabular mt-1 flex flex-wrap gap-x-4 text-[12.5px] text-muted">{r.points.map((p, i) => <span key={p.year} className={i === r.points.length - 1 ? "font-semibold text-ink" : ""}>{p.year}: {p.value.toFixed(1)}%</span>)}</p>
          </li>
        ))}
      </ul>
      <div className="tabular mt-3 flex justify-between text-xs text-subtle"><span>0%</span><span>35%</span><span>70%</span></div>
    </ChartCard>
  );
}

export function VotingCard() {
  const data = [...neverVoted].sort((a, b) => b.district - a.district);
  return (
    <ChartCard title="People who have never voted, by region" subtitle="% of respondents who have never voted in each type of election" period="Governance Series Wave 1"
      explain={{ indicator: "vote" }}
      notes="Almost every adult knows voting is a right (98.1%, 2024), but knowing the right and using it differ. Never voting is more common in district elections than in national ones. * In the district-election map, four labels conflict with their shading (Bono East 0.5%, Greater Accra 4.0%, Oti 8.5% and Upper West 7.7% are shaded above 10%); labels are shown as printed. The wave’s reference period and national totals are not printed."
      source="GSS Governance Series Wave 1 · Figure 6.6, p. 94"
      footer={<DataDisclosure><DataTable caption="Never voted by region" headings={["Region", "National elections (%)", "District elections (%)", "Note"]} rows={neverVoted.map(r => [r.region, r.national, r.district, r.flag ?? ""])} decimals={[undefined, 1, 1]} minWidth={560} /></DataDisclosure>}>
      <Legend className="mb-3" items={[{ label: "National elections", color: C.purple, shape: "dot" }, { label: "District elections", color: C.amber, shape: "dot" }]} />
      <ul className="space-y-[7px]" aria-label="Never voted by region, national and district elections">
        {data.map(r => (
          <li key={r.region} className="grid grid-cols-[7.5rem_minmax(0,1fr)_6.5rem] items-center gap-2 text-[12.5px]">
            <span className="text-body">{r.region}{r.flag && <span className="text-caution" title={r.flag}> *</span>}</span>
            <span className="relative h-4">
              <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
              <span className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded bg-line-strong" style={{ left: `${(Math.min(r.national, r.district) / 10) * 100}%`, width: `${(Math.abs(r.district - r.national) / 10) * 100}%` }} />
              <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${(r.national / 10) * 100}%`, background: C.purple }} />
              <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${(r.district / 10) * 100}%`, background: C.amber }} />
            </span>
            <span className="tabular text-right text-muted"><span className="text-ink">{r.national.toFixed(1)}</span> · <span className="font-semibold text-ink">{r.district.toFixed(1)}</span></span>
          </li>
        ))}
      </ul>
      <div className="tabular mt-2 grid grid-cols-[7.5rem_minmax(0,1fr)_6.5rem] gap-2 text-xs text-subtle"><span /><span className="flex justify-between"><span>0%</span><span>5%</span><span>10%</span></span><span className="text-right">nat. · dist.</span></div>
    </ChartCard>
  );
}

export function VoteKnowledge() {
  return (
    <ChartCard title="Knowledge of the right to vote" subtitle="% of adults aged 18 and over" period="2024" explain={{ indicator: "vote" }}
      notes="Knowing that voting is a right is not the same as registering or voting; it is not a turnout measure."
      source="GSS Governance Series · p. 93">
      <Stat label="Know that voting is a basic democratic right" value="98.1" unit="%" context="Almost every adult" />
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-surface-muted" role="img" aria-label="98.1%"><div className="h-full rounded-full bg-brand" style={{ width: "98.1%" }} /></div>
    </ChartCard>
  );
}
