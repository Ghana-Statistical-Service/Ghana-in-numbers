"use client";

import Image from "next/image";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard, Qualifier, Stat } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Legend } from "@/components/ui/Data";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, num, tick } from "@/components/ui/chart";
import { coastalDebrisData, foodInsecurityData, maternalMortality, neonatalMortality, povertyData, underFiveMortality, urbanSlums } from "@/data/sdgData";

const sdgTag = (goal: string) => <Qualifier tone="brand">{goal}</Qualifier>;
const label2025 = (y: string) => y === "2025" ? "2025 (Q1–Q3 avg)" : y;

export function PovertyCard() {
  const data = povertyData.map(d => ({ ...d, label: label2025(d.year) }));
  return (
    <ChartCard title="Multidimensional poverty" subtitle="% of the population that is multidimensionally poor" period="2022–2025" qualifier={sdgTag("SDG 1.2.2")} explain={{ indicator: "poverty" }}
      notes="Poverty measured across several deprivations, not income alone. Down 8.2 percentage points since 2022, but nearly one person in four remained poor. A district MPI now covers all 261 districts (June 2024)."
      source="GSS Multidimensional Poverty Index, 2022Q1–2025Q3 · Figure 8.1, p. 101"
      footer={<DataDisclosure><DataTable caption="Multidimensional poverty incidence" headings={["Year", "Incidence (%)"]} rows={data.map(d => [d.label, d.value])} decimals={1} minWidth={260} /></DataDisclosure>}>
      <ChartFrame height={230} label="Multidimensional poverty: 31.2% in 2022, 28.0% in 2023, 25.2% in 2024, 23.0% in 2025">
        <BarChart data={data} margin={{ top: 22, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="label" {...axisCommon} tick={tick} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 40]} ticks={[0, 10, 20, 30, 40]} tickFormatter={v => `${v}%`} width={42} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: "%" })} />
          <Bar dataKey="value" name="Multidimensional poverty" radius={[3, 3, 0, 0]} maxBarSize={64} isAnimationActive={false}>
            {data.map(d => <Cell key={d.year} fill={d.year === "2025" ? C.purple : C.purpleLight} />)}
            <LabelList dataKey="value" position="top" formatter={(v: unknown) => `${num(Number(v))}%`} style={labelStyle} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function FoodInsecurityCard() {
  const data = foodInsecurityData.map(d => ({ ...d, label: label2025(d.year) }));
  return (
    <ChartCard title="Food insecurity" subtitle="Prevalence on the Food Insecurity Experience Scale (FIES), %" period="2022–2025" qualifier={sdgTag("SDG 2.1.2")} explain={{ indicator: "food" }}
      notes="Fell to 37.7% in 2024, then rose to 39.8% (about 13.0 million people) across Q1–Q3 2025. Access to food is measured directly; rising crop output does not by itself mean less hunger."
      source="GSS Food Insecurity Main Report 2025Q3 · Figure 8.2, p. 102"
      footer={<DataDisclosure><DataTable caption="Food insecurity prevalence" headings={["Year", "Prevalence (%)"]} rows={data.map(d => [d.label, d.value])} decimals={1} minWidth={260} /></DataDisclosure>}>
      <ChartFrame height={230} label="Food insecurity: 44.6% in 2022, 40.4% in 2023, 37.7% in 2024, 39.8% in 2025">
        <BarChart data={data} margin={{ top: 22, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="label" {...axisCommon} tick={tick} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 50]} ticks={[0, 10, 20, 30, 40, 50]} tickFormatter={v => `${v}%`} width={42} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: "%" })} />
          <Bar dataKey="value" name="Food insecurity" radius={[3, 3, 0, 0]} maxBarSize={64} isAnimationActive={false}>
            {data.map(d => <Cell key={d.year} fill={d.year === "2025" ? C.amber : C.amberLight} />)}
            <LabelList dataKey="value" position="top" formatter={(v: unknown) => `${num(Number(v))}%`} style={labelStyle} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function MaternalCard() {
  const data = maternalMortality.map(d => ({ ...d, method: d.year === "2007" || d.year === "2017" ? "GMMR survey" : "Census (PHC)" }));
  return (
    <ChartCard title="Maternal mortality ratio" subtitle="Maternal deaths per 100,000 live births" period="2007–2021" qualifier={sdgTag("SDG 3.1.1")} explain={{ indicator: "maternal" }}
      notes="Two sources with different methods: maternal mortality surveys (GMMR, lighter bars) and the census (PHC, darker bars). Compare like with like: the census ratio fell from 485 (2010) to 301 (2021)."
      source="GSS Ghana Maternal Mortality Reports 2007 and 2017; PHC 2010 and 2021 · Figure 8.3, p. 102"
      footer={<DataDisclosure><DataTable caption="Maternal mortality ratio" headings={["Year", "Deaths per 100,000 live births", "Source"]} rows={data.map(d => [d.year, d.value, d.method])} decimals={0} minWidth={360} /></DataDisclosure>}>
      <Legend className="mb-1" items={[{ label: "Census (PHC)", color: C.rose }, { label: "GMMR survey", color: "#DDA3B8" }]} />
      <ChartFrame height={220} label="Maternal mortality ratio: 580 in 2007 (GMMR), 485 in 2010 (PHC), 310 in 2017 (GMMR), 301 in 2021 (PHC)">
        <BarChart data={data} margin={{ top: 22, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tick} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 600]} ticks={[0, 200, 400, 600]} width={42} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ decimals: 0, unit: " per 100,000", labelFormat: (l, p) => `${l} · ${String(p?.method ?? "")}` })} />
          <Bar dataKey="value" name="Maternal mortality ratio" radius={[3, 3, 0, 0]} maxBarSize={64} isAnimationActive={false}>
            {data.map(d => <Cell key={d.year} fill={d.method.startsWith("Census") ? C.rose : "#DDA3B8"} />)}
            <LabelList dataKey="value" position="top" style={labelStyle} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function ChildMortalityCard() {
  const infant = [64, 50, 41, 28];
  const data = underFiveMortality.map((d, i) => ({ year: d.year, underFive: d.value, infant: infant[i], neonatal: neonatalMortality[i].value }));
  const s = [{ key: "underFive", label: "Under five", color: C.rose }, { key: "infant", label: "Infant (under one)", color: C.purple }, { key: "neonatal", label: "Neonatal (first 28 days)", color: C.amber }];
  return (
    <ChartCard title="Child mortality" subtitle="Deaths per 1,000 live births" period="2003–2022 (GDHS)" qualifier={sdgTag("SDG 3.2")} explain={{ indicator: "underFive" }}
      notes="The age ranges overlap (neonatal ⊂ infant ⊂ under five), so the rates must not be added. Survey years are unevenly spaced. Under-five mortality halved from 80 (2008) to 40 (2022)."
      source="GSS Ghana Demographic and Health Surveys 2003–2022 · Figure 8.4, p. 103"
      footer={<DataDisclosure><DataTable caption="Child mortality rates" headings={["GDHS year", "Under five", "Infant", "Neonatal"]} rows={data.map(d => [d.year, d.underFive, d.infant, d.neonatal])} decimals={0} minWidth={360} /></DataDisclosure>}>
      <Legend className="mb-1" items={s.map(x => ({ label: x.label, color: x.color, shape: "line" as const }))} />
      <ChartFrame height={240} label="Under-five mortality fell from 111 to 40, infant from 64 to 28 and neonatal from 43 to 17 deaths per 1,000 live births between 2003 and 2022">
        <LineChart data={data} margin={{ top: 20, right: 24, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tick} padding={{ left: 16, right: 16 }} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 120]} ticks={[0, 40, 80, 120]} width={40} />
          <Tooltip content={makeTooltip({ decimals: 0, unit: " per 1,000" })} />
          {s.map(x => <Line key={x.key} dataKey={x.key} name={x.label} stroke={x.color} strokeWidth={2.5} dot={{ r: 3.5, fill: x.color }} isAnimationActive={false}><LabelList dataKey={x.key} position={x.key === "neonatal" ? "bottom" : "top"} offset={8} style={{ ...labelStyle, fontSize: 12, fill: x.color }} /></Line>)}
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function SlumsCard() {
  return (
    <ChartCard title="Urban population in slums and informal settlements" subtitle="Settlement-level map and national shares" period="2021 census" qualifier={sdgTag("SDG 11.1.1")} explain={{ indicator: "slums" }}
      notes="The household share and the urban-population share have different denominators and are not interchangeable. The map marks settlements, not whole regions: red clusters are slums and informal settlements, green other urban areas, blue water."
      source="GSS 2021 PHC, Slums and Informal Settlements Thematic Report (2025) · Figure 8.5, pp. 103–104">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
        <Image src="/report/slums-2021.png" alt="Map of Ghana marking urban slum and informal settlement clusters in red, other urban areas in green and water in blue (Figure 8.5)" width={624} height={751} className="h-auto w-full rounded-md border border-line object-contain" />
        <div className="grid gap-3">
          <Stat tone="brand" label="Urban residents living in slums" value={num(urbanSlums.urbanSlumPct)} unit="%" context={`Of ${urbanSlums.urbanPopMillions} million urban residents`} />
          <Stat label="Households living in slums" value={num(urbanSlums.householdPct)} unit="%" context={`${urbanSlums.householdCount.toLocaleString("en-GB")} households`} />
        </div>
      </div>
    </ChartCard>
  );
}

export function PlasticCard() {
  const data = [coastalDebrisData[0], coastalDebrisData[1], { year: "2018", value: null as number | null }, coastalDebrisData[2], coastalDebrisData[3]];
  return (
    <ChartCard title="Plastic debris density on the coast" subtitle="Million plastic items per square kilometre" period="2016–2020" qualifier={sdgTag("SDG 14.1.1")} explain={{ indicator: "plastic" }}
      notes="A density, not tonnage. Peaked at 179.76 in 2019 and eased to 152.13 in 2020, still more than four times the 2016 level. 2018 is not reported. (The Executive Summary groups this with nutrient pollution; the indicator shown is plastic debris.)"
      source="GSS/Ghana SDG Indicator Database, from the TIDES database (Ocean Conservancy) · Figure 8.6, pp. 104–105"
      footer={<DataDisclosure><DataTable caption="Plastic debris density" headings={["Year", "Million items per km²"]} rows={data.map(d => [d.year, d.value])} decimals={2} minWidth={260} unitNote="— not reported." /></DataDisclosure>}>
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

export function InstitutionsCard() {
  return (
    <ChartCard title="Bribery incidence and perceptions of government" subtitle="% of respondents" period="2024 and 2025" qualifier={sdgTag("SDG 16.5.1")} explain={{ indicator: "gifts" }}
      notes="The publication reports bribery incidence under SDG 16. The two perception indicators are governance context, not a composite score of institutional performance."
      source="Table 2.1, p. 10; GSS Governance Series Wave 3, pp. 92–93"
      footer={<DataDisclosure><DataTable caption="Institutions indicators" headings={["Indicator", "2024 (%)", "2025 (%)"]} rows={[["Gave a gift to a public official (bribery incidence)", 18.4, 16.8], ["Feel they have no say in government decisions", 42.4, 29.7], ["Feel they have no influence on government actions", 43.2, 33.0]]} decimals={1} minWidth={460} /></DataDisclosure>}>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat tone="brand" label="Bribery incidence" value="16.8" unit="%" context="2025 · 18.4% in 2024" />
        <Stat label="No say in decisions" value="29.7" unit="%" context="2025 · 42.4% in 2024" />
        <Stat label="No influence on action" value="33.0" unit="%" context="2025 · 43.2% in 2024" />
      </div>
    </ChartCard>
  );
}
