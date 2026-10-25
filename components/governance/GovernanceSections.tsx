"use client";

import { CartesianGrid, LabelList, Line, LineChart, ReferenceArea, Tooltip, XAxis, YAxis } from "recharts";
import { Gavel, Gift, Hand, HandCoins, Megaphone, Vote, type LucideIcon } from "lucide-react";
import { ChartCard } from "@/components/ui/Card";
import { BeforeAfter, ChangeBadge, IconTile, Milestones, Pictogram, StatTile, Takeaway, Waffle, tones, type Tone } from "@/components/ui/Infographic";
import { DataDisclosure, DataTable, Legend } from "@/components/ui/Data";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, tick, tickSmall } from "@/components/ui/chart";
import { giftsToOfficialsData, noInfluenceData, noSayData, rightToVoteKnowledge, womenJudgesData, womenParliamentData } from "@/data/governanceData";
import { giftRequests, neverVoted } from "@/data/publicationAdditions";

/** Illustrative 100-seat hemicycle: seats ordered left to right, the first `highlighted` drawn as women's seats. */
function Hemicycle({ highlighted, label }: { highlighted: number; label: string }) {
  const rows = [52, 64, 76, 88, 100];
  const total = 100;
  const circ = rows.reduce((a, r) => a + r, 0);
  const counts = rows.map(r => Math.round((r / circ) * total));
  counts[counts.length - 1] += total - counts.reduce((a, c) => a + c, 0);
  const seats = rows.flatMap((r, i) => Array.from({ length: counts[i] }, (_, j) => {
    const angle = Math.PI - (Math.PI * (j + 0.5)) / counts[i];
    // Rounded so server and browser render identical attributes (no hydration mismatch).
    return { x: Math.round((110 + r * Math.cos(angle)) * 100) / 100, y: Math.round((108 - r * Math.sin(angle)) * 100) / 100, angle };
  })).sort((a, b) => b.angle - a.angle);
  return (
    <svg viewBox="0 0 220 116" role="img" aria-label={label} className="mx-auto block w-full max-w-[340px]">
      {seats.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4.1} fill={i < highlighted ? tones.purple.fill : "#C9CFDA"} />)}
    </svg>
  );
}

export function ParliamentCard() {
  const data = womenParliamentData.map(d => ({ ...d, yearNum: Number(d.year) }));
  const first = data[0], last = data.at(-1)!;
  const seats = Math.round(last.value);
  return (
    <ChartCard title="Women representation in Parliament" subtitle="Share of parliamentary seats held by women, %" period="1993–2025 (1st–9th Parliaments)" explain={{ indicator: "parliament" }}
      notes={`The seat diagram is illustrative: 100 seats with ${seats} highlighted (${last.value.toFixed(1)}%). The total number of seats is not given in the publication. Women are 50.7% of the population.`}
      source="Parliamentary Service of Ghana · Figure 6.1, p. 90"
      footer={<DataDisclosure><DataTable caption="Women in Parliament" headings={["Year", "Parliament", "Women (%)"]} rows={womenParliamentData.map(d => [d.year, d.parliament, d.value])} decimals={[undefined, undefined, 1]} minWidth={320} /></DataDisclosure>}>
      <div className="grid items-center gap-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Hemicycle highlighted={seats} label={`About ${seats} in 100 seats held by women in the ${last.parliament} Parliament (${last.year})`} />
        <div>
          <p className="tabular text-[34px] font-bold leading-none" style={{ color: tones.purple.fg }}>{last.value.toFixed(1)}%</p>
          <p className="mt-1 text-xs font-semibold text-ink">{last.parliament} Parliament, {last.year}</p>
          <p className="mt-2 text-[13px] font-medium text-ink">About {seats} in 100 seats</p>
          <p className="mt-2"><ChangeBadge good={last.value > first.value}>{last.value - first.value >= 0 ? "+" : "−"}{Math.abs(last.value - first.value).toFixed(1)} pp</ChangeBadge> <span className="text-[13px] text-body">since {first.year}</span></p>
        </div>
      </div>
      <p className="mb-1 mt-5 text-xs font-medium text-muted">Every Parliament, % of seats</p>
      <ChartFrame height={150} label={`Women's share of seats by Parliament, from ${first.value.toFixed(1)}% in ${first.year} to ${last.value.toFixed(1)}% in ${last.year}`}>
        <LineChart data={data} margin={{ top: 20, right: 18, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="yearNum" type="number" domain={[1991, 2027]} ticks={data.map(d => d.yearNum)} {...axisCommon} tick={tickSmall} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 20]} ticks={[0, 10, 20]} tickFormatter={v => `${v}%`} width={42} />
          <Tooltip content={makeTooltip({ unit: "%", labelFormat: (l, p) => `${l} · ${String(p?.parliament ?? "")} Parliament` })} />
          <Line type="linear" dataKey="value" name="Women’s share of seats" stroke={C.purple} strokeWidth={2.25} dot={{ r: 3.5, fill: C.purple }} isAnimationActive={false}>
            <LabelList dataKey="value" position="top" offset={8} formatter={(v: unknown) => Number(v).toFixed(1)} style={labelStyle} />
          </Line>
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function JudgesCard() {
  // 2012 is not reported in Figure 6.2: the time-scaled axis leaves its gap visible instead of joining across it.
  const data = [...womenJudgesData.slice(0, 4), { year: "2012", supreme: null, appeal: null, high: null }, ...womenJudgesData.slice(4)].map(d => ({ ...d, yearNum: Number(d.year) }));
  const last = womenJudgesData.at(-1)!;
  const s = [{ key: "high", label: "High Court", color: C.teal, tone: "teal" as Tone }, { key: "appeal", label: "Court of Appeal", color: C.blue, tone: "blue" as Tone }, { key: "supreme", label: "Supreme Court", color: C.rose, tone: "rose" as Tone }] as const;
  return (
    <ChartCard title="Percentage of women judges" subtitle="Women as % of judges in each court" period="2008–2025" explain={{ indicator: "judges" }}
      notes="Each court has its own denominator, so the lines must not be added. The year axis is spaced by time; the break at 2012 marks a year that is not reported."
      source="Judicial Service of Ghana · Figure 6.2, p. 91"
      footer={<DataDisclosure><DataTable caption="Women judges by court" headings={["Year", "Supreme Court (%)", "Court of Appeal (%)", "High Court (%)"]} rows={data.map(d => [d.year, d.supreme, d.appeal, d.high])} decimals={1} minWidth={420} unitNote="2012 is not reported." /></DataDisclosure>}>
      <ul className="mb-4 grid gap-2 sm:grid-cols-3" aria-label={`Women judges, ${last.year}`}>
        {s.map(x => <StatTile key={x.key} icon={Gavel} tone={x.tone} label={x.label} value={`${last[x.key].toFixed(1)}%`} period={last.year} />)}
      </ul>
      <Legend className="mb-1" items={s.map(x => ({ label: x.label, color: x.color, shape: "line" as const }))} />
      <ChartFrame height={250} label="Women judges by court, 2008 to 2025">
        <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="yearNum" type="number" domain={[2007.5, 2025.5]} ticks={[2008, 2011, 2014, 2017, 2020, 2023, 2025]} {...axisCommon} tick={tickSmall} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 60]} ticks={[0, 20, 40, 60]} tickFormatter={v => `${v}%`} width={42} />
          <ReferenceArea x1={2011.5} x2={2012.5} fill={C.slateLight} fillOpacity={0.25} />
          <Tooltip content={makeTooltip({ unit: "%" })} />
          {s.map(x => <Line key={x.key} type="linear" dataKey={x.key} name={x.label} stroke={x.color} strokeWidth={2.25} dot={{ r: 2.5, fill: x.color }} connectNulls={false} isAnimationActive={false} />)}
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function GiftRequestsCard() {
  const [a, b] = [giftRequests.at(-2)!, giftRequests.at(-1)!];
  const diff = b.value - a.value;
  return (
    <ChartCard title="Direct requests for gifts by public officials" subtitle="% of people directly asked for a gift by an official" period={`${giftRequests[0].period}; ${a.period}; ${b.period}`} explain={{ indicator: "requests" }}
      notes={`Requests refer to periods of different length (a full year in ${giftRequests[0].period}, half-years in 2025), so compare the two half-years. Being asked and actually giving are separate measures.`}
      source="GSS Governance Series Waves 2–3 · Figure 6.3, p. 92"
      footer={<DataDisclosure><DataTable caption="Direct requests for gifts" headings={["Period", "Directly asked for a gift (%)"]} rows={giftRequests.map(d => [d.period, d.value])} decimals={1} minWidth={300} /></DataDisclosure>}>
      <BeforeAfter icon={HandCoins} tone="amber" before={{ value: a.value, label: a.period }} after={{ value: b.value, label: b.period }} format={v => `${v.toFixed(1)}%`}
        change={`${diff >= 0 ? "+" : "−"}${Math.abs(diff).toFixed(1)} pp`} lowerIsBetter changeLabel={diff > 0 ? "worse: more people were asked" : "better: fewer people were asked"} />
      <Takeaway>About {Math.round(b.value / 10)} in 10 people were asked for a gift in the second half of 2025, close to the full-year {giftRequests[0].period} level ({giftRequests[0].value.toFixed(1)}%).</Takeaway>
    </ChartCard>
  );
}

export function GiftsGivenCard() {
  const last = giftsToOfficialsData.at(-1)!;
  const inTen = Math.round(last.value / 10);
  return (
    <ChartCard title="Giving gifts to public officials" subtitle="% of people who gave a gift to a public official" period="2021, 2024 and 2025" explain={{ indicator: "gifts" }}
      notes="SDG 16.5.1 bribery incidence. Lower is better."
      source="GSS Ghana Corruption Survey (2022) and Governance Series Waves 2–3 · Figure 6.4, p. 92"
      footer={<DataDisclosure><DataTable caption="Gave a gift to a public official" headings={["Year", "Gave a gift (%)"]} rows={giftsToOfficialsData.map(d => [d.year, d.value])} decimals={1} minWidth={300} /></DataDisclosure>}>
      <Milestones data={giftsToOfficialsData} tone="teal" icon={Gift} format={v => `${v.toFixed(1)}%`} unit="per cent" />
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Pictogram highlighted={inTen} tone="teal" label={`${inTen} of 10 people highlighted`} />
        <p className="text-[13px] font-medium text-ink">About {inTen} in 10 people ({last.year})</p>
      </div>
      <Takeaway>Reported giving fell by {(giftsToOfficialsData[0].value - last.value).toFixed(1)} percentage points between {giftsToOfficialsData[0].year} and {last.year}: an improvement.</Takeaway>
    </ChartCard>
  );
}

function VoiceCard({ title, subtitle, data, icon, explain, notes, extraNote }: { title: string; subtitle: string; data: { year: string; value: number }[]; icon: LucideIcon; explain: string; notes: string; extraNote?: string }) {
  const first = data[0], last = data.at(-1)!;
  const inTen = Math.round(last.value / 10);
  return (
    <ChartCard title={title} subtitle={subtitle} period={data.map(d => d.year).join(", ")} explain={{ indicator: explain }} notes={notes} source="GSS Governance Series Wave 3 · Figure 6.5, p. 93"
      footer={<DataDisclosure><DataTable caption={title} headings={["Year", "% of respondents"]} rows={data.map(d => [d.year, d.value])} decimals={1} minWidth={260} unitNote={extraNote} /></DataDisclosure>}>
      <Milestones data={data} tone="teal" icon={icon} format={v => `${v.toFixed(1)}%`} unit="per cent" />
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Pictogram highlighted={inTen} tone="teal" label={`${inTen} of 10 people highlighted`} />
        <p className="text-[13px] font-medium text-ink">About {inTen} in 10 people ({last.year})</p>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-body"><ChangeBadge good={last.value < first.value}>{last.value - first.value >= 0 ? "+" : "−"}{Math.abs(last.value - first.value).toFixed(1)} pp</ChangeBadge><span>since {first.year}; lower is better</span></p>
    </ChartCard>
  );
}

export function NoSayCard() {
  return <VoiceCard title="No inclusiveness in decision-making" subtitle="% who feel they have no say in government decisions" data={noSayData} icon={Megaphone} explain="noSay"
    notes="A perception, not a measure of service delivery. The 2013 figure is cited in the text; Figure 6.5 shows 2024 and 2025."
    extraNote="Table 11.1 (p. 134) gives 29.2% for 2025; the figure, chapter text and Table 2.1 give 29.7%." />;
}

export function NoInfluenceCard() {
  return <VoiceCard title="Non-governance responsiveness" subtitle="% who feel they cannot influence government action" data={noInfluenceData} icon={Hand} explain="noInfluence"
    notes="A perception, not a measure of service delivery. Only 2024 and 2025 are reported." />;
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
  const v = rightToVoteKnowledge.value;
  return (
    <ChartCard title="Knowledge of the right to vote" subtitle="% of adults aged 18 and over" period="2024" explain={{ indicator: "vote" }}
      notes="Knowing that voting is a right is not the same as registering or voting; it is not a turnout measure. Each square is 1% of adults."
      source="GSS Governance Series · p. 93"
      footer={<DataDisclosure><DataTable caption="Knowledge of the right to vote" headings={["Year", "% of adults"]} rows={[["2024", v]]} decimals={1} minWidth={220} /></DataDisclosure>}>
      <div className="flex items-center gap-4">
        <IconTile icon={Vote} tone="purple" size="lg" />
        <p className="tabular"><span className="block text-[40px] font-bold leading-none" style={{ color: tones.purple.fg }}>{v.toFixed(1)}%</span><span className="mt-1 block text-xs font-semibold text-ink">2024</span></p>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Waffle value={v} tone="purple" label={`${v.toFixed(1)}% of adults: about ${Math.round(v)} in 100`} />
        <p className="text-[13px] font-medium text-ink">About {Math.round(v)} in 100 adults know voting is a basic democratic right</p>
      </div>
    </ChartCard>
  );
}
