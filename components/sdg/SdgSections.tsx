"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Baby, Building2, HeartPulse, Maximize2, Milk, Scale, ShoppingBasket, Trees, User, UserRound, Users, Waves, X, type LucideIcon } from "lucide-react";
import { ChangeBadge, IconTile, Milestones, Pictogram, Takeaway, tones, type Tone } from "@/components/ui/Infographic";
import { giftsToOfficialsData } from "@/data/governanceData";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard, Qualifier } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Legend } from "@/components/ui/Data";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, num, tick, tickSmall } from "@/components/ui/chart";
import RegionalMap from "@/components/maps/RegionalMap";
import { REGIONS, giniConsumption, povertyByGroup, povertyByRegionQ3, povertyDrivers, povertyGhanaQ3, povertyQuarterly } from "@/data/publicationAdditions";
import { coastalDebrisData, foodInsecurityData, infantMortality, maternalMortality, neonatalMortality, povertyData, underFiveMortality, urbanSlums } from "@/data/sdgData";

const sdgTag = (goal: string) => <Qualifier tone="brand">{goal}</Qualifier>;
const label2025 = (y: string) => y === "2025" ? "2025 (Q1–Q3 avg)" : y;

const pct = (v: number) => `${v.toFixed(1)}%`;
const signedPp = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(1)} pp`;

export function PovertyCard() {
  const data = povertyData.map(d => ({ year: label2025(d.year), value: d.value }));
  const first = povertyData[0], last = povertyData.at(-1)!;
  const inTen = Math.round(last.value / 10);
  return (
    <ChartCard title="Multidimensional poverty" subtitle="% of the population that is multidimensionally poor" period="2022–2025" qualifier={sdgTag("SDG 1.2.2")} explain={{ indicator: "poverty" }}
      notes="Poverty measured across several deprivations, not income alone. A district MPI now covers all 261 districts (June 2024)."
      source="GSS Multidimensional Poverty Index, 2022Q1–2025Q3 · Figure 8.1, p. 97"
      footer={<DataDisclosure><DataTable caption="Multidimensional poverty incidence" headings={["Year", "Incidence (%)"]} rows={data.map(d => [d.year, d.value])} decimals={1} minWidth={260} /></DataDisclosure>}>
      <Milestones data={data} tone="teal" icon={Users} format={pct} unit="per cent" />
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Pictogram highlighted={inTen} tone="teal" label={`${inTen} of 10 people highlighted`} />
        <p className="text-[13px] font-medium text-ink">About {inTen} in 10 people (2025)</p>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-body"><ChangeBadge good={last.value < first.value}>{signedPp(last.value - first.value)}</ChangeBadge><span>since {first.year}: improving, though nearly one person in four remained poor</span></p>
    </ChartCard>
  );
}

export function FoodInsecurityCard() {
  const data = foodInsecurityData.map(d => ({ year: label2025(d.year), value: d.value }));
  const last = foodInsecurityData.at(-1)!, prev = foodInsecurityData.at(-2)!;
  const inTen = Math.round(last.value / 10);
  return (
    <ChartCard title="Food insecurity" subtitle="Prevalence on the Food Insecurity Experience Scale (FIES), %" period="2022–2025" qualifier={sdgTag("SDG 2.1.2")} explain={{ indicator: "food" }}
      notes="Access to food is measured directly; rising crop output does not by itself mean less hunger. 2025 is the Q1–Q3 average."
      source="GSS Food Insecurity Main Report 2025Q3 · Figure 8.5, p. 101"
      footer={<DataDisclosure><DataTable caption="Food insecurity prevalence" headings={["Year", "Prevalence (%)"]} rows={data.map(d => [d.year, d.value])} decimals={1} minWidth={260} /></DataDisclosure>}>
      <Milestones data={data} tone="amber" icon={ShoppingBasket} format={pct} unit="per cent" />
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Pictogram highlighted={inTen} tone="amber" label={`${inTen} of 10 people highlighted`} />
        <p className="text-[13px] font-medium text-ink">About {inTen} in 10 people (2025): about 13.0 million people</p>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-body"><ChangeBadge good={last.value < prev.value}>{signedPp(last.value - prev.value)}</ChangeBadge><span>2025 against {prev.year}: rose again after three years of decline</span></p>
    </ChartCard>
  );
}

/** Mortality milestone card: older years neutral, latest year green (improvement). */
function MortalityCard({ title, subtitle, period, goal, explain, icon, data, unit, notes, source, caption }: {
  title: string; subtitle: string; period: string; goal: string; explain: string; icon: LucideIcon; data: { year: string; value: number }[]; unit: string; notes: string; source: string; caption: string;
}) {
  const first = data[0], last = data.at(-1)!;
  const change = ((last.value - first.value) / first.value) * 100;
  return (
    <ChartCard title={title} subtitle={subtitle} period={period} qualifier={sdgTag(goal)} explain={{ indicator: explain }} notes={notes} source={source}
      footer={<DataDisclosure><DataTable caption={caption} headings={["Year", unit]} rows={data.map(d => [d.year, d.value])} decimals={0} minWidth={260} /></DataDisclosure>}>
      <Milestones data={data} tone="teal" icon={icon} format={v => v.toLocaleString("en-GB")} unit={unit} />
      <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-body"><ChangeBadge good={last.value < first.value}>{change >= 0 ? "+" : "−"}{Math.abs(change).toFixed(1)}%</ChangeBadge><span>{first.year.split(" ")[0]} to {last.year.split(" ")[0]}; lower is better</span></p>
    </ChartCard>
  );
}

export function MaternalCard() {
  const data = maternalMortality.map(d => ({ year: `${d.year} ${d.year === "2007" || d.year === "2017" ? "GMMR" : "PHC"}`, value: d.value }));
  return <MortalityCard title="Maternal mortality ratio" subtitle="Maternal deaths per 100,000 live births" period="2007–2021" goal="SDG 3.1.1" explain="maternal" icon={HeartPulse} data={data} unit="Deaths per 100,000 live births"
    caption="Maternal mortality ratio" source="GSS Ghana Maternal Mortality Reports 2007 and 2017; PHC 2010 and 2021 · Figure 8.6, p. 102"
    notes="Two sources with different methods: GMMR surveys (2007, 2017) and the census (PHC, 2010 and 2021). Compare like with like: the census ratio fell from 485 (2010) to 301 (2021)." />;
}

export function UnderFiveCard() {
  return <MortalityCard title="Under-five mortality" subtitle="Deaths before age five per 1,000 live births" period="2003–2022 (GDHS)" goal="SDG 3.2.1" explain="underFive" icon={Users} data={underFiveMortality} unit="Deaths per 1,000 live births"
    caption="Under-five mortality rate" source="GSS GDHS 2003–2022 · Figure 8.7, p. 102" notes="Survey years are unevenly spaced. Halved from 80 (2008) to 40 (2022)." />;
}

export function InfantCard() {
  return <MortalityCard title="Infant mortality" subtitle="Deaths before the first birthday per 1,000 live births" period="2003–2022 (GDHS)" goal="SDG 3.2" explain="infant" icon={Milk} data={infantMortality} unit="Deaths per 1,000 live births"
    caption="Infant mortality rate" source="GSS GDHS 2003–2022 · Figure 8.7, p. 102" notes="Infant deaths occur before the first birthday; they are part of under-five deaths." />;
}

export function NeonatalCard() {
  const data = neonatalMortality.map(d => ({ year: d.survey.replace(" GDHS", ""), value: d.value }));
  return <MortalityCard title="Neonatal mortality" subtitle="Deaths in the first 28 days per 1,000 live births" period="2003–2022 (GDHS)" goal="SDG 3.2.2" explain="neonatal" icon={Baby} data={data} unit="Deaths per 1,000 live births"
    caption="Neonatal mortality rate" source="GSS GDHS 2003–2022 · Figure 8.7, p. 102" notes="Neonatal deaths are part of infant deaths." />;
}

export function ChildMortalityCard() {
  const data = underFiveMortality.map((d, i) => ({ year: d.year, underFive: d.value, infant: infantMortality[i].value, neonatal: neonatalMortality[i].value }));
  const s = [{ key: "underFive", label: "Under five", color: C.rose }, { key: "infant", label: "Infant (under one)", color: C.purple }, { key: "neonatal", label: "Neonatal (first 28 days)", color: C.amber }];
  return (
    <ChartCard title="Child survival: the three rates together" subtitle="Deaths per 1,000 live births" period="2003–2022 (GDHS)" qualifier={sdgTag("SDG 3.2")} explain={{ indicator: "underFive" }}
      notes="The age ranges overlap (neonatal ⊂ infant ⊂ under five), so the rates must not be added. Survey years are unevenly spaced. Under-five mortality halved from 80 (2008) to 40 (2022)."
      source="GSS Ghana Demographic and Health Surveys 2003–2022 · Figure 8.7, p. 102"
      footer={<DataDisclosure><DataTable caption="Child mortality rates" headings={["GDHS year", "Under five", "Infant", "Neonatal"]} rows={data.map(d => [d.year, d.underFive, d.infant, d.neonatal])} decimals={0} minWidth={360} /></DataDisclosure>}>
      <Legend className="mb-1" items={s.map(x => ({ label: x.label, color: x.color, shape: "line" as const }))} />
      <ChartFrame height={240} label="Under-five mortality fell from 111 to 40, infant from 64 to 28 and neonatal from 43 to 17 deaths per 1,000 live births between 2003 and 2022">
        <LineChart data={data} margin={{ top: 20, right: 24, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tick} padding={{ left: 16, right: 16 }} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 120]} ticks={[0, 40, 80, 120]} width={40} />
          <Tooltip content={makeTooltip({ decimals: 0, unit: " per 1,000" })} />
          {s.map(x => <Line key={x.key} type="linear" dataKey={x.key} name={x.label} stroke={x.color} strokeWidth={2.5} dot={{ r: 3.5, fill: x.color }} isAnimationActive={false}><LabelList dataKey={x.key} position={x.key === "neonatal" ? "bottom" : "top"} offset={8} style={{ ...labelStyle, fontSize: 12, fill: x.color }} /></Line>)}
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function SlumsCard() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (open) ref.current?.showModal(); }, [open]);
  return (
    <ChartCard title="Urban population in slums and informal settlements" subtitle="Settlement-level map and national shares" period="2021 census" qualifier={sdgTag("SDG 11.1.1")} explain={{ indicator: "slums" }}
      notes="The people share (urban residents) and the household share have different denominators and are not interchangeable. The map marks settlements, not whole regions: red clusters are slums and informal settlements, green other urban areas, blue water. The map is reproduced from the publication at its printed resolution."
      source="GSS 2021 PHC, Slums and Informal Settlements Thematic Report (2025) · Figure 8.8, p. 103"
      footer={<DataDisclosure><DataTable caption="Slums and informal settlements, 2021" headings={["Measure", "Value"]} rows={[["Urban residents living in slums (% of people)", urbanSlums.urbanSlumPct], ["Households living in slums (% of households)", urbanSlums.householdPct], ["Households living in slums (number)", urbanSlums.householdCount]]} decimals={[undefined, 1]} minWidth={360} /></DataDisclosure>}>
      <div className="grid gap-5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-start">
        <button type="button" onClick={() => setOpen(true)} className="group relative block overflow-hidden rounded-md border border-line text-left" aria-label="Enlarge the slum and informal settlement map">
          <Image src="/report/slums-2021.png" alt="Map of Ghana marking urban slum and informal settlement clusters in red, other urban areas in green and water in blue (Figure 8.8)" width={624} height={751} className="h-auto w-full object-contain" />
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-surface/95 px-2 py-1 text-xs font-medium text-brand shadow-card"><Maximize2 size={13} aria-hidden="true" />Enlarge map</span>
        </button>
        <div className="grid gap-3">
          <div className="rounded-[var(--radius-md)] bg-nav p-4 text-white">
            <p className="text-xs font-medium text-white/85">People: urban residents living in slums</p>
            <p className="tabular mt-1 text-[36px] font-bold leading-none">{num(urbanSlums.urbanSlumPct)}%</p>
            <p className="mt-1 text-xs text-white/85">of people living in urban areas</p>
          </div>
          <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
            <p className="text-xs font-medium text-muted">Households: share living in slums</p>
            <p className="tabular mt-1 text-[28px] font-bold leading-none text-ink">{num(urbanSlums.householdPct)}%</p>
            <p className="tabular mt-1 text-xs text-body">{urbanSlums.householdCount.toLocaleString("en-GB")} households</p>
          </div>
          <Takeaway>About 3 in 10 urban residents live in slums or informal settlements.</Takeaway>
        </div>
      </div>
      {open && (
        <dialog ref={ref} aria-label="Slum and informal settlement map, enlarged" onClose={() => setOpen(false)} onCancel={() => setOpen(false)} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
          className="m-auto max-h-[95dvh] w-[min(900px,calc(100vw-16px))] overflow-auto rounded-[var(--radius-lg)] border-0 bg-surface p-3 shadow-pop">
          <div className="mb-2 flex items-center justify-between gap-3"><p className="text-[13px] font-semibold text-ink">Figure 8.8: urban slums and informal settlements, 2021</p><button type="button" onClick={() => setOpen(false)} aria-label="Close map" className="flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-surface-muted"><X size={18} /></button></div>
          <Image src="/report/slums-2021.png" alt="Enlarged map of Ghana marking urban slum and informal settlement clusters (Figure 8.8)" width={624} height={751} className="mx-auto h-auto w-full max-w-[860px]" />
        </dialog>
      )}
    </ChartCard>
  );
}

export function PlasticHeadlineCard() {
  const first = coastalDebrisData[0], last = coastalDebrisData.at(-1)!;
  const peak = coastalDebrisData.reduce((a, b) => (b.value > a.value ? b : a));
  return (
    <ChartCard title="Plastic debris at a glance" subtitle="Million plastic items per square kilometre (unit as printed)" period={`${first.year}–${last.year}`} qualifier={sdgTag("SDG 14.1.1")} explain={{ indicator: "plastic" }}
      notes="Unit as printed in Figure 8.9 and the text (p. 104). Lower is better."
      source="GSS/Ghana SDG Indicator Database, TIDES (Ocean Conservancy) · Figure 8.9, p. 104">
      <div className="flex items-center gap-4">
        <IconTile icon={Waves} tone="blue" size="lg" />
        <p className="tabular"><span className="block text-[34px] font-bold leading-none" style={{ color: tones.blue.fg }}>{num(last.value, 2)}</span><span className="mt-1 block text-xs font-semibold text-ink">{last.year}</span></p>
      </div>
      <p className="mt-4 text-[13px] text-body">Peak {num(peak.value, 2)} in {peak.year}; {(last.value / first.value).toFixed(1)} times the {first.year} level ({num(first.value, 2)}).</p>
      <p className="mt-3"><ChangeBadge good={last.value < first.value}>{last.value >= first.value ? "Worse" : "Better"} than {first.year}</ChangeBadge></p>
    </ChartCard>
  );
}

export function PlasticCard() {
  const data = [coastalDebrisData[0], coastalDebrisData[1], { year: "2018", value: null as number | null }, coastalDebrisData[2], coastalDebrisData[3]];
  return (
    <ChartCard title="Plastic debris density on the coast" subtitle="Million plastic items per square kilometre" period="2016–2020" qualifier={sdgTag("SDG 14.1.1")} explain={{ indicator: "plastic" }}
      notes="A density, not tonnage. Peaked at 179.76 in 2019 and eased to 152.13 in 2020, still more than four times the 2016 level. 2018 is not reported. (The Executive Summary groups this with nutrient pollution; the indicator shown is plastic debris.)"
      source="GSS/Ghana SDG Indicator Database, from the TIDES database (Ocean Conservancy) · Figure 8.9, p. 104"
      footer={<DataDisclosure><DataTable caption="Plastic debris density" headings={["Year", "Million items per km²"]} rows={data.map(d => [d.year, d.value])} decimals={2} minWidth={260} unitNote="n/a: not reported." /></DataDisclosure>}>
      <ChartFrame height={230} label="Plastic debris density: 33.58 in 2016, 56.88 in 2017, 179.76 in 2019, 152.13 in 2020 million items per square kilometre; 2018 not reported">
        <BarChart data={data} margin={{ top: 22, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tick} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 200]} ticks={[0, 50, 100, 150, 200]} width={42} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ decimals: 2, unit: " million/km²" })} />
          <Bar dataKey="value" name="Plastic debris density" fill={C.blue} radius={[3, 3, 0, 0]} maxBarSize={64} isAnimationActive={false}>
            <LabelList dataKey="value" position="top" formatter={(v: unknown) => (v == null ? "" : num(Number(v), 2))} style={labelStyle} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

type Status = { goal: string; color: string; name: string; latest: string; period: string; good: boolean | null; href: string };
const goalColor: Record<string, string> = { "1": "#E5243B", "2": "#DDA63A", "3": "#4C9F38", "11": "#FD9D24", "14": "#0A97D9", "16": "#00689D" };

/** One compact card per indicator: goal badge, name, latest value and a status computed from first and latest values (lower is better for all of these). */
export function SdgSummary() {
  const st = (first: number, last: number) => (last === first ? null : last < first);
  const items: Status[] = [
    { goal: "1.2.2", color: goalColor["1"], name: "Multidimensional poverty", latest: pct(povertyData.at(-1)!.value), period: "2025", good: st(povertyData[0].value, povertyData.at(-1)!.value), href: "#poverty-food" },
    { goal: "2.1.2", color: goalColor["2"], name: "Food insecurity", latest: pct(foodInsecurityData.at(-1)!.value), period: "2025", good: st(foodInsecurityData[0].value, foodInsecurityData.at(-1)!.value), href: "#poverty-food" },
    { goal: "3.1.1", color: goalColor["3"], name: "Maternal mortality (census)", latest: String(maternalMortality.at(-1)!.value), period: "2021, per 100,000", good: st(maternalMortality[1].value, maternalMortality.at(-1)!.value), href: "#mortality" },
    { goal: "3.2.1", color: goalColor["3"], name: "Under-five mortality", latest: String(underFiveMortality.at(-1)!.value), period: "2022, per 1,000", good: st(underFiveMortality[0].value, underFiveMortality.at(-1)!.value), href: "#mortality" },
    { goal: "3.2", color: goalColor["3"], name: "Infant mortality", latest: String(infantMortality.at(-1)!.value), period: "2022, per 1,000", good: st(infantMortality[0].value, infantMortality.at(-1)!.value), href: "#mortality" },
    { goal: "3.2.2", color: goalColor["3"], name: "Neonatal mortality", latest: String(neonatalMortality.at(-1)!.value), period: "2022, per 1,000", good: st(neonatalMortality[0].value, neonatalMortality.at(-1)!.value), href: "#mortality" },
    { goal: "11.1.1", color: goalColor["11"], name: "Urban residents in slums", latest: pct(urbanSlums.urbanSlumPct), period: "2021", good: null, href: "#cities" },
    { goal: "14.1.1", color: goalColor["14"], name: "Coastal plastic debris", latest: num(coastalDebrisData.at(-1)!.value, 2), period: "2020, million items/km²", good: st(coastalDebrisData[0].value, coastalDebrisData.at(-1)!.value), href: "#cities" },
    { goal: "16.5.1", color: goalColor["16"], name: "Bribery incidence", latest: pct(giftsToOfficialsData.at(-1)!.value), period: "2025", good: st(giftsToOfficialsData[0].value, giftsToOfficialsData.at(-1)!.value), href: "#institutions" },
  ];
  return (
    <section id="sdg-summary" aria-labelledby="sdg-summary-heading" className="mb-10 scroll-mt-16">
      <h2 id="sdg-summary-heading" className="sr-only">SDG summary</h2>
      <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 min-[1440px]:grid-cols-5">
        {items.map(i => (
          <li key={i.goal + i.name}>
            <a href={i.href} className="flex h-full flex-col rounded-[var(--radius-md)] border border-line bg-surface p-3 shadow-card hover:border-brand-line">
              <span className="flex items-center gap-2 text-xs font-semibold text-ink"><span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: i.color }} />SDG {i.goal}</span>
              <span className="mt-1.5 text-[13px] leading-snug text-body">{i.name}</span>
              <span className="tabular mt-1 text-[22px] font-bold leading-none text-ink">{i.latest}</span>
              <span className="mt-1 text-xs text-muted">{i.period}</span>
              <span className="mt-2"><ChangeBadge good={i.good}>{i.good == null ? "One year only" : i.good ? "Improving" : "Worsening"}</ChangeBadge></span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted">Status compares the first and latest values shown on this page; lower is better for every indicator here. Maternal mortality compares census to census (2010 and 2021).</p>
    </section>
  );
}

/* ── Poverty detail added in the final edition (Figures 8.2–8.4, Tables 8.1–8.2) ── */

const groupIcons: Record<string, LucideIcon> = { Rural: Trees, Urban: Building2, "Male-headed": User, "Female-headed": UserRound };

export function PovertyGroupsCard() {
  const rural = povertyByGroup.find(g => g.group === "Rural")!, urban = povertyByGroup.find(g => g.group === "Urban")!;
  return (
    <ChartCard title="Who is multidimensionally poor" subtitle="% of each group, Q3 2025 (Q2 2025 in brackets)" period="Q3 2025" qualifier={sdgTag("SDG 1.2.2")} explain={{ indicator: "poverty" }}
      notes={`Rural poverty is ${(rural.q3 / urban.q3).toFixed(1)} times the urban rate. Female-headed households, slightly less likely to be poor than male-headed ones in Q2, are now level with them.`}
      source="GSS Multidimensional Poverty Report (2024Q1–2025Q3) · Figure 8.2, p. 98"
      footer={<DataDisclosure><DataTable caption="Multidimensional poverty by group" headings={["Group", "Q2 2025 (%)", "Q3 2025 (%)"]} rows={povertyByGroup.map(g => [g.group, g.q2, g.q3])} decimals={1} minWidth={300} /></DataDisclosure>}>
      <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {povertyByGroup.map(g => {
          const Icon = groupIcons[g.group] ?? Users;
          const tone: Tone = g.kind === "Locality" ? "teal" : "purple";
          return (
            <li key={g.group} className="flex flex-col items-center rounded-[var(--radius-md)] px-2 py-3 text-center" style={{ background: tones[tone].bg }}>
              <Icon size={24} aria-hidden="true" style={{ color: tones[tone].fill }} />
              <span className="tabular mt-1.5 text-[24px] font-bold leading-none" style={{ color: tones[tone].fg }}>{pct(g.q3)}</span>
              <span className="mt-1 text-xs font-semibold text-ink">{g.group}</span>
              <span className="tabular text-xs text-muted">Q2: {pct(g.q2)}</span>
            </li>
          );
        })}
      </ul>
      <Takeaway>Almost one in three rural residents is poor, compared with one in seven in towns and cities.</Takeaway>
    </ChartCard>
  );
}

export function PovertyRegionsCard() {
  const data = REGIONS.map(region => ({ region, value: povertyByRegionQ3[region] }));
  return (
    <ChartCard title="Multidimensional poverty by region" subtitle="% of the population that is multidimensionally poor" period="Q3 2025" qualifier={sdgTag("SDG 1.2.2")} explain={{ indicator: "poverty" }}
      notes={`Ghana: ${pct(povertyGhanaQ3)}. More than half of people in North East and Savannah are poor, against fewer than one in ten in Greater Accra. Upper West saw the sharpest rise in the latest quarter, from about 25% to 35%. Bars are drawn on a 0–100% scale.`}
      source="GSS Multidimensional Poverty Report (2024Q1–2025Q3) · Figure 8.3, p. 98"
      footer={<DataDisclosure><DataTable caption="Multidimensional poverty by region, Q3 2025" headings={["Region", "Poor (%)"]} rows={[...REGIONS].sort((a, b) => povertyByRegionQ3[b] - povertyByRegionQ3[a]).map(r => [r, povertyByRegionQ3[r]])} decimals={1} minWidth={280} /></DataDisclosure>}>
      <RegionalMap data={data} measure="Multidimensionally poor, Q3 2025 (%)" format={v => `${v.toFixed(1)}%`} barMax={100} height={420} />
    </ChartCard>
  );
}

const driverParts = [
  { key: "health", label: "Health", color: C.purple },
  { key: "living", label: "Living conditions", color: C.amber },
  { key: "education", label: "Education", color: C.blue },
  { key: "employment", label: "Employment", color: C.teal },
] as const;

export function PovertyDriversCard() {
  return (
    <ChartCard title="What drives multidimensional poverty in each region" subtitle="% contribution of each dimension, Q3 2025 (each bar sums to 100%)" period="Q3 2025" qualifier={sdgTag("SDG 1.2.2")} explain={{ indicator: "poverty" }}
      notes="Lack of health insurance and poor nutrition account for the largest share almost everywhere, most of all in Ahafo. Housing, water, sanitation and energy weigh most in Western North, Oti and North East; a lack of work matters most in Greater Accra and Ashanti. The employment share is not labelled for six regions; there it is 100% minus the other three (marked * in the table)."
      source="GSS Multidimensional Poverty Report (2024Q1–2025Q3) · Figure 8.4, p. 100"
      footer={<DataDisclosure><DataTable caption="Contribution to multidimensional poverty, Q3 2025" headings={["Area", "Health (%)", "Living conditions (%)", "Education (%)", "Employment (%)"]} rows={povertyDrivers.map(d => [d.area, d.health, d.living, d.education, d.employmentDerived ? `${d.employment.toFixed(1)}*` : d.employment])} decimals={1} minWidth={520} unitNote="* Derived as 100 minus the three labelled shares." /></DataDisclosure>}>
      <Legend className="mb-2" items={driverParts.map(p => ({ label: p.label, color: p.color }))} />
      <ChartFrame height={520} minWidth={520} label="Contribution of health, living conditions, education and employment to multidimensional poverty by region, Q3 2025">
        <BarChart data={povertyDrivers} layout="vertical" stackOffset="expand" margin={{ top: 0, right: 12, left: 0, bottom: 0 }} barCategoryGap="18%">
          <CartesianGrid stroke={C.grid} horizontal={false} />
          <XAxis type="number" {...axisCommon} tick={tick} domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]} tickFormatter={v => `${Math.round(v * 100)}%`} />
          <YAxis type="category" dataKey="area" {...axisCommon} tick={{ ...tickSmall, fill: C.ink }} width={100} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: "%" })} />
          {driverParts.map(p => <Bar key={p.key} dataKey={p.key} name={p.label} stackId="d" fill={p.color} isAnimationActive={false} />)}
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

const quarterlySeries = [
  { key: "incidence", label: "Poverty incidence (H)", color: C.purple },
  { key: "noHealthInsurance", label: "No health insurance", color: C.blue },
  { key: "noImprovedToilet", label: "No improved toilet", color: C.teal },
  { key: "overcrowding", label: "Overcrowding", color: C.amber },
  { key: "schoolLag", label: "School lag", color: C.rose },
  { key: "nutrition", label: "Nutrition", color: C.slate },
] as const;

export function PovertyQuarterlyCard() {
  return (
    <ChartCard title="Poverty and selected deprivations by quarter" subtitle="% of the population that is poor and deprived in each indicator" period="2022 Q1–2025 Q3" qualifier={sdgTag("SDG 1.2.2")} explain={{ indicator: "poverty" }}
      notes="The decline has not been steady: poverty peaked at 32.4% in Q2 2022, rose again to 28.5% in Q2 2024 and fell to 21.9% by Q3 2025. Fewer poor people now lack health insurance or a decent toilet and far fewer children fall behind in school, but overcrowded housing nearly doubled between Q2 and Q3 2025."
      source="GSS Multidimensional Poverty Report (2024Q1–2025Q3) · Table 8.1, p. 99"
      footer={<DataDisclosure><DataTable caption="Multidimensional poverty and selected deprivations, by quarter" headings={["Quarter", "Incidence (%)", "No health insurance (%)", "No improved toilet (%)", "Nutrition (%)", "Overcrowding (%)", "School lag (%)"]} rows={povertyQuarterly.map(q => [q.quarter, q.incidence, q.noHealthInsurance, q.noImprovedToilet, q.nutrition, q.overcrowding, q.schoolLag])} decimals={1} minWidth={640} /></DataDisclosure>}>
      <Legend className="mb-2" items={quarterlySeries.map(x => ({ label: x.label, color: x.color, shape: "line" as const }))} />
      <ChartFrame height={280} minWidth={460} label="Quarterly multidimensional poverty incidence fell from 28.3% in 2022 Q1 to 21.9% in 2025 Q3">
        <LineChart data={povertyQuarterly} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="quarter" {...axisCommon} tick={tickSmall} interval={2} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 35]} ticks={[0, 10, 20, 30]} tickFormatter={v => `${v}%`} width={42} />
          <Tooltip content={makeTooltip({ unit: "%" })} />
          {quarterlySeries.map(x => <Line key={x.key} type="linear" dataKey={x.key} name={x.label} stroke={x.color} strokeWidth={x.key === "incidence" ? 3 : 1.75} dot={{ r: x.key === "incidence" ? 3 : 2, fill: x.color }} isAnimationActive={false} />)}
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function InequalityCard() {
  const g = giniConsumption;
  return (
    <ChartCard title="Inequality in consumption" subtitle="Gini coefficient (0 = everyone consumes the same, 100 = maximum inequality)" period="2005/06–2016/17" explain={{ indicator: "poverty", title: "Inequality (Gini coefficient)" }}
      notes={`The latest official measure (GLSS 7). Inequality was highest where poverty was deepest: Upper West (${g.highest.value}) and Northern (${g.second.value}). In the Upper West the richest 10% consumed almost three times as much as the poorest 40%, against about 1.4 times in Greater Accra. Lower is more equal.`}
      source="GSS, GLSS 7 Poverty Trends in Ghana 2005–2017 · Table 8.2, p. 100"
      footer={<DataDisclosure><DataTable caption="Gini coefficient of consumption" headings={["Measure", "Value"]} rows={[...g.national.map(n => [`Ghana, ${n.period}`, n.value]), ["Rural, 2005/06", g.rural.from], ["Rural, 2016/17", g.rural.to], ["Urban, 2005/06", g.urban.from], ["Urban, 2016/17", g.urban.to], [`${g.highest.region} (highest), 2016/17`, g.highest.value], [`${g.second.region}, 2016/17`, g.second.value], [`${g.lowest.region} (lowest), 2016/17`, g.lowest.value]]} decimals={1} minWidth={320} /></DataDisclosure>}>
      <Milestones data={g.national.map(n => ({ year: n.period, value: n.value }))} tone="amber" icon={Scale} format={v => v.toFixed(1)} unit="Gini points" />
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <p className="rounded-[var(--radius-md)] bg-surface-muted px-3.5 py-3 text-[13px] text-body"><span className="block text-xs font-medium text-muted">Rural, 2005/06 to 2016/17</span><span className="tabular text-[20px] font-bold" style={{ color: tones.amber.fg }}>{g.rural.from} → {g.rural.to}</span> <ChangeBadge good={false}>wider</ChangeBadge></p>
        <p className="rounded-[var(--radius-md)] bg-surface-muted px-3.5 py-3 text-[13px] text-body"><span className="block text-xs font-medium text-muted">Urban, 2005/06 to 2016/17</span><span className="tabular text-[20px] font-bold" style={{ color: tones.teal.fg }}>{g.urban.from} → {g.urban.to}</span> <ChangeBadge good>narrower</ChangeBadge></p>
      </div>
      <Takeaway>Inequality rose, mainly in rural areas; growth between 2013 and 2017 mostly benefited the middle of the distribution.</Takeaway>
    </ChartCard>
  );
}
