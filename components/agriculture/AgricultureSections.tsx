"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard, Stat } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Legend, Segmented } from "@/components/ui/Data";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, num, tick, tickSmall } from "@/components/ui/chart";
import { getGroupExplanation } from "@/data/cardExplanationContent";
import { agricultureSpending, cropSeries, fishQuantity, fishValue, livestockSeries, tilapiaCatfish } from "@/data/publicationAdditions";
import { agricultureData, agricultureTotals } from "@/data/youthBulgeData";

export function SpendingCard() {
  const data = agricultureSpending.map(d => ({ year: d.year, aoi: d.aoi }));
  return (
    <ChartCard title="Agriculture Orientation Index" subtitle="Agriculture’s share of government spending ÷ its share of GDP (1 = proportionate)" period="2013–2024"
      explain={getGroupExplanation("agriculture", "Agriculture Orientation Index", [3])}
      notes="The index never came close to 1: it peaked at 0.066 (printed as 0.07 in the text) in 2018 and was 0.02 in 2022–2024. In 2024 agriculture produced 22% of GDP but received less than one cedi in every hundred government spent. Public spending on agriculture was about 0.2% of GDP in 2024."
      source="Controller and Accountant-General’s Department; GSS · Table 5.2, pp. 40–41 (SDG 2.a.1)"
      footer={<DataDisclosure><DataTable caption="Government spending on agriculture" headings={["Year", "Spending on agriculture (GH¢)", "Total government spending (GH¢)", "Agriculture GVA (GH¢)", "GDP (GH¢)", "GVA share of GDP, printed (%)", "AOI"]} rows={agricultureSpending.map(d => [d.year, d.spend, d.total, d.gva, d.gdp, d.gvaShare, d.aoi])} decimals={[undefined, 0, 0, 0, 0, 1, 3]} minWidth={860} unitNote="AOI = (spending ÷ total spending) ÷ (GVA ÷ GDP); it reproduces from these columns. The printed GVA-share column is about one point higher than GVA ÷ GDP (likely GDP at basic prices). The 2024 GDP here (GH¢1,176.2bn) predates the revised national-accounts figure (GH¢1,182.8bn)." /></DataDisclosure>}>
      <ChartFrame height={240} label="Agriculture Orientation Index, 2013 to 2024: between 0.022 and 0.066, far below 1">
        <LineChart data={data} margin={{ top: 22, right: 20, left: 6, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tickSmall} interval={0} padding={{ left: 24, right: 12 }} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 0.08]} ticks={[0, 0.02, 0.04, 0.06, 0.08]} width={44} />
          <Tooltip content={makeTooltip({ decimals: 3 })} />
          <Line dataKey="aoi" name="AOI" stroke={C.teal} strokeWidth={2.5} dot={{ r: 3.5, fill: C.teal }} isAnimationActive={false}><LabelList dataKey="aoi" position="top" offset={8} formatter={(v: unknown) => Number(v).toFixed(3)} style={{ ...labelStyle, fontSize: 12 }} /></Line>
        </LineChart>
      </ChartFrame>
      <p className="mt-1 text-xs text-subtle">The proportionate level (1.0) is far above this scale.</p>
    </ChartCard>
  );
}

const crops = [
  { key: "cassava", label: "Cassava", color: C.purple },
  { key: "yam", label: "Yam", color: C.teal },
  { key: "plantain", label: "Plantain", color: C.amber },
  { key: "maize", label: "Maize", color: C.blue },
  { key: "cocoyam", label: "Cocoyam", color: C.rose },
  { key: "rice", label: "Rice", color: C.slate },
] as const;

export function CropsCard() {
  return (
    <ChartCard title="Production of major crops" subtitle="Million metric tonnes · each panel has its own scale, starting at zero" period="2013–2024"
      explain={{ indicator: "crops" }}
      notes="2024 is provisional. Quantities harvested, not yields or value. Groundnut, sorghum, cowpea, soyabean and millet are drawn without labels and are excluded, so panel values do not sum to the printed totals (31.5 million tonnes in 2013, 55.4 million in 2024)."
      source="SRID, Ministry of Food and Agriculture (March 2024) · Figure 5.7, p. 44"
      footer={<DataDisclosure><DataTable caption="Production of major crops, million metric tonnes" headings={["Year", ...crops.map(c => c.label), "All crops (printed total)"]} rows={cropSeries.years.map((y, i) => [y.replace("*", " (prov.)"), ...crops.map(c => cropSeries[c.key][i]), cropSeries.total[i]])} decimals={1} minWidth={680} /></DataDisclosure>}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3">
        {crops.map(c => {
          const values = cropSeries[c.key];
          const data = cropSeries.years.map((y, i) => ({ year: y.replace("*", ""), value: values[i] }));
          const max = Math.max(...values);
          return (
            <div key={c.key}>
              <p className="flex items-baseline justify-between text-[13px]"><span className="font-semibold text-ink">{c.label}</span><span className="tabular text-muted">{num(values[0])} → <span className="font-semibold text-ink">{num(values.at(-1)!)}</span></span></p>
              <ChartFrame height={110} label={`${c.label}: ${num(values[0])} million tonnes in 2013 to ${num(values.at(-1)!)} million in 2024`}>
                <LineChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={C.grid} vertical={false} />
                  <XAxis dataKey="year" {...axisCommon} tick={{ ...tickSmall, fontSize: 12 }} ticks={["2013", "2024"]} />
                  <YAxis {...axisCommon} tick={{ ...tickSmall, fontSize: 12 }} domain={[0, Math.ceil(max * 1.15)]} tickCount={3} width={30} />
                  <Tooltip content={makeTooltip({ unit: " Mt" })} />
                  <Line dataKey="value" name={c.label} stroke={c.color} strokeWidth={2.25} dot={false} isAnimationActive={false} />
                </LineChart>
              </ChartFrame>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

const species = [
  { key: "poultry", label: "Poultry", color: C.amber },
  { key: "goats", label: "Goats", color: C.teal },
  { key: "sheep", label: "Sheep", color: C.purple },
  { key: "cattle", label: "Cattle", color: C.blue },
  { key: "pigs", label: "Pigs", color: C.rose },
] as const;

export function LivestockCard() {
  const [view, setView] = useState<"birds" | "animals">("animals");
  const data = livestockSeries.years.map((year, i) => ({ year, poultry: livestockSeries.poultry[i], goats: livestockSeries.goats[i], sheep: livestockSeries.sheep[i], cattle: livestockSeries.cattle[i], pigs: livestockSeries.pigs[i] }));
  const shown = view === "birds" ? species.slice(0, 1) : species.slice(1);
  return (
    <ChartCard title="Livestock population" subtitle="Million animals" period="1990–2024"
      explain={getGroupExplanation("agriculture", "Livestock population", [2])}
      actions={<Segmented label="Livestock type" size="sm" value={view} onChange={setView} options={[{ value: "animals", label: "Goats, sheep, cattle, pigs" }, { value: "birds", label: "Poultry" }]} />}
      notes="Poultry (90.8 million birds in 2024) is shown separately because it is about ten times larger than the other species. Cattle more than doubled (1.1 → 2.4 million), sheep nearly tripled (2.2 → 6.3 million). Counts, not meat output."
      source="SRID, Ministry of Food and Agriculture (March 2024) · Figure 5.8, pp. 44–45"
      footer={<DataDisclosure><DataTable caption="Livestock population, million" headings={["Year", "Poultry", "Goats", "Sheep", "Cattle", "Pigs", "Total (printed)"]} rows={livestockSeries.years.map((y, i) => [y, livestockSeries.poultry[i], livestockSeries.goats[i], livestockSeries.sheep[i], livestockSeries.cattle[i], livestockSeries.pigs[i], livestockSeries.total[i]])} decimals={1} minWidth={560} unitNote="Components are read from the figure labels and sum to the printed totals within 0.1 because of rounding." /></DataDisclosure>}>
      <Legend className="mb-1" items={shown.map(s => ({ label: s.label, color: s.color, shape: "line" as const }))} />
      <ChartFrame height={250} minWidth={520} label={view === "birds" ? "Poultry rose from 10.0 million in 1990 to 90.8 million in 2024" : "Goats, sheep, cattle and pigs, 1990 to 2024"}>
        <LineChart data={data} margin={{ top: 16, right: 24, left: -6, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tickSmall} interval={3} />
          <YAxis {...axisCommon} tick={tick} domain={view === "birds" ? [0, 100] : [0, 10]} width={40} />
          <Tooltip content={makeTooltip({ unit: " million" })} />
          {shown.map(s => <Line key={s.key} dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2.25} dot={false} isAnimationActive={false}><LabelList dataKey={s.key} content={p => { const { x, y, value, index } = p as { x: number; y: number; value: number; index: number }; return index === data.length - 1 ? <text x={x + 4} y={y + 4} fontSize={12} fontWeight={600} fill={s.color}>{num(value)}</text> : null; }} /></Line>)}
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function FishValueCard() {
  const data = fishValue.map(d => ({ ...d, unlabelled: d.aquaculture == null ? +(d.total - d.marine - d.inland).toFixed(2) : null, _top: 0.001 }));
  return (
    <ChartCard title="Value of fish production by source" subtitle="GH¢ billion, current prices" period="2010–2025"
      explain={{ indicator: "fish" }}
      notes={<>Figure 5.6 is captioned “production in hundred thousand metric tonnes”, but its labels are values in GH¢ billion: the totals (1.94 in 2010, 20.44 in 2025) match the value figures in the text. For 2010–2014 the aquaculture segment is not labelled; the hatched part is the remainder of the printed total. Values are nominal, so they rise with prices as well as catch.</>}
      source="Ministry of Fisheries and Aquaculture Development · Figure 5.6 and text, p. 42"
      footer={<DataDisclosure><DataTable caption="Value of fish production, GH¢ billion" headings={["Year", "Marine", "Inland", "Aquaculture", "Total (printed)"]} rows={fishValue.map(d => [d.year, d.marine, d.inland, d.aquaculture, d.total])} decimals={2} minWidth={460} unitNote="n/a: aquaculture not labelled for 2010–2014." /></DataDisclosure>}>
      <Legend className="mb-1" items={[{ label: "Marine", color: C.blue }, { label: "Inland", color: C.teal }, { label: "Aquaculture", color: C.amber }, { label: "Aquaculture, not labelled", color: C.amber, shape: "hatch" }]} />
      <ChartFrame height={260} minWidth={560} label="Value of fish production rose from GH¢1.94 billion in 2010 to GH¢20.44 billion in 2025">
        <BarChart data={data} margin={{ top: 22, right: 6, left: -8, bottom: 0 }}>
          <defs><pattern id="aqua-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="#fff" /><line x1="0" y1="0" x2="0" y2="5" stroke={C.amber} strokeWidth="2.5" /></pattern></defs>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tickSmall} interval={0} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 24]} ticks={[0, 6, 12, 18, 24]} width={36} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ decimals: 2, unit: " GH¢ bn" })} />
          <Bar dataKey="marine" name="Marine" stackId="f" fill={C.blue} isAnimationActive={false} />
          <Bar dataKey="inland" name="Inland" stackId="f" fill={C.teal} isAnimationActive={false} />
          <Bar dataKey="aquaculture" name="Aquaculture" stackId="f" fill={C.amber} isAnimationActive={false} />
          <Bar dataKey="unlabelled" name="Aquaculture (unlabelled remainder)" stackId="f" fill="url(#aqua-hatch)" isAnimationActive={false} />
          <Bar dataKey="_top" name="_hidden" stackId="f" fill="transparent" isAnimationActive={false}>
            <LabelList content={p => { const { x, y, width, index } = p as { x: number; y: number; width: number; index: number }; return <text x={x + width / 2} y={y - 6} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>{num(fishValue[index].total, 1)}</text>; }} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function FishQuantityCard() {
  const sources = [{ key: "marine", label: "Marine", color: C.blue }, { key: "inland", label: "Inland", color: C.teal }, { key: "aquaculture", label: "Aquaculture", color: C.amber }] as const;
  return (
    <ChartCard title="Fish production by source" subtitle="Metric tonnes" period="2010 and 2025"
      explain={{ indicator: "fish" }}
      notes="Only these two years are printed as quantities. Components sum to 722,647 tonnes in 2025 against the published 722,648 (rounding); the published total is kept. Aquaculture grew about twelvefold."
      source="Ministry of Fisheries and Aquaculture Development · p. 42"
      footer={<DataDisclosure><DataTable caption="Fish production, tonnes" headings={["Year", "Marine", "Inland", "Aquaculture", "Total (published)"]} rows={fishQuantity.map(d => [d.year, d.marine, d.inland, d.aquaculture, d.total])} decimals={0} minWidth={440} /></DataDisclosure>}>
      <ul className="space-y-4">
        {sources.map(s => (
          <li key={s.key}>
            <p className="mb-1 text-[13px] font-medium text-ink">{s.label}</p>
            {fishQuantity.map((d, i) => (
              <div key={d.year} className="grid grid-cols-[2.75rem_minmax(0,1fr)_5rem] items-center gap-2 text-[12.5px]">
                <span className="tabular text-muted">{d.year}</span>
                <span className="h-2.5 rounded-sm bg-surface-muted"><span className="block h-full rounded-sm" style={{ width: `${(d[s.key] / 450000) * 100}%`, background: s.color, opacity: i ? 1 : 0.45 }} /></span>
                <span className="tabular text-right font-semibold text-ink">{d[s.key].toLocaleString("en-GB")}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
      <div className="mt-4 grid grid-cols-2 gap-3"><Stat label="Total, 2010" value="412,658" unit="t" /><Stat tone="brand" label="Total, 2025" value="722,648" unit="t" /></div>
    </ChartCard>
  );
}

export function TilapiaCard() {
  const [measure, setMeasure] = useState<"qty" | "value">("qty");
  const data = tilapiaCatfish.map(d => measure === "qty" ? { year: d.year, tilapia: d.tilapia / 1000, catfish: d.catfish / 1000 } : { year: d.year, tilapia: d.tilapiaValue, catfish: d.catfishValue });
  return (
    <ChartCard title="Farmed tilapia and catfish" subtitle={measure === "qty" ? "Thousand metric tonnes" : "GH¢ million, current prices"} period="2013–2025"
      explain={getGroupExplanation("agriculture", "Fish production", [0])}
      actions={<Segmented label="Measure" size="sm" value={measure} onChange={setMeasure} options={[{ value: "qty", label: "Quantity" }, { value: "value", label: "Value" }]} />}
      notes="Combined output rose from 32,512 to 124,428 tonnes (about +283%) and peaked at 132,652 tonnes in 2022. The 2025 species total is 267 tonnes above the aggregate aquaculture series (124,161 t), reflecting revisions, not extra species."
      source="Ministry of Fisheries and Aquaculture Development · Table 5.3, pp. 42–43"
      footer={<DataDisclosure><DataTable caption="Tilapia and catfish production and value" headings={["Year", "Tilapia (t)", "Tilapia (GH¢ m)", "Catfish (t)", "Catfish (GH¢ m)"]} rows={tilapiaCatfish.map(d => [d.year, d.tilapia, d.tilapiaValue, d.catfish, d.catfishValue])} decimals={1} minWidth={460} /></DataDisclosure>}>
      <Legend className="mb-1" items={[{ label: "Tilapia", color: C.purple }, { label: "Catfish", color: C.teal }]} />
      <ChartFrame height={250} minWidth={480} label={`Tilapia and catfish ${measure === "qty" ? "production" : "value"}, 2013 to 2025`}>
        <BarChart data={data} margin={{ top: 12, right: 6, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tickSmall} interval={0} />
          <YAxis {...axisCommon} tick={tick} width={42} domain={measure === "qty" ? [0, 140] : [0, 5000]} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ decimals: 1, unit: measure === "qty" ? " thousand t" : " GH¢ m" })} />
          <Bar dataKey="tilapia" name="Tilapia" stackId="t" fill={C.purple} isAnimationActive={false} />
          <Bar dataKey="catfish" name="Catfish" stackId="t" fill={C.teal} isAnimationActive={false} />
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function YouthAgricultureCard() {
  const data = agricultureData.map(d => ({ ...d, change: (d.y2021 / d.y2010 - 1) * 100 }));
  return (
    <ChartCard title="Young people working in agriculture, forestry and fishing" subtitle="Persons, by sex and age group" period="2010 and 2021 censuses"
      explain={{ indicator: "youthAgriculture" }}
      notes={`Ages 15–24 fell from ${agricultureTotals.total1524_2010.toLocaleString("en-GB")} to ${agricultureTotals.total1524_2021.toLocaleString("en-GB")} (−56%); ages 15–35 from ${agricultureTotals.total1535_2010.toLocaleString("en-GB")} to ${agricultureTotals.total1535_2021.toLocaleString("en-GB")} (−40%). The age bands overlap: 15–24 is inside 15–35. Percentage changes are calculated from the published counts. The publication offers possible explanations (better-paying options, migration to towns, perceptions of farming) without measuring their causes.`}
      source="GSS 2010 and 2021 PHC · Figure 9.3, pp. 114–115"
      footer={<DataDisclosure><DataTable caption="Youth in agriculture" headings={["Group", "2010", "2021", "Change (%)"]} rows={[...data.map(d => [d.group, d.y2010, d.y2021, +d.change.toFixed(1)]), { cells: ["15–24 total", agricultureTotals.total1524_2010, agricultureTotals.total1524_2021, +((agricultureTotals.total1524_2021 / agricultureTotals.total1524_2010 - 1) * 100).toFixed(1)], emphasis: "subtotal" as const }, { cells: ["15–35 total", agricultureTotals.total1535_2010, agricultureTotals.total1535_2021, +((agricultureTotals.total1535_2021 / agricultureTotals.total1535_2010 - 1) * 100).toFixed(1)], emphasis: "subtotal" as const }]} decimals={[undefined, 0, 0, 1]} minWidth={420} /></DataDisclosure>}>
      <Legend className="mb-1" items={[{ label: "2010", color: C.slateLight }, { label: "2021", color: C.teal }]} />
      <ChartFrame height={260} label="Youth in agriculture by sex and age, 2010 and 2021. Females aged 15–24 fell from 387,293 to 138,112.">
        <BarChart data={data} margin={{ top: 22, right: 6, left: 0, bottom: 0 }} barGap={2}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="group" {...axisCommon} tick={tick} />
          <YAxis {...axisCommon} tick={tick} width={44} tickFormatter={v => `${v / 1000}k`} domain={[0, 1200000]} />
          <ReferenceLine y={0} stroke={C.slate} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ format: v => v.toLocaleString("en-GB") })} />
          <Bar dataKey="y2010" name="2010" fill={C.slateLight} radius={[3, 3, 0, 0]} isAnimationActive={false}><LabelList dataKey="y2010" position="top" formatter={(v: unknown) => `${Math.round(Number(v) / 1000)}k`} style={{ ...labelStyle, fontSize: 12 }} /></Bar>
          <Bar dataKey="y2021" name="2021" fill={C.teal} radius={[3, 3, 0, 0]} isAnimationActive={false}><LabelList dataKey="change" position="top" formatter={(v: unknown) => `${Math.round(Number(v))}%`} style={{ ...labelStyle, fontSize: 12, fill: C.negative }} /></Bar>
        </BarChart>
      </ChartFrame>
      <p className="text-xs text-subtle">Labels above 2021 bars show the percentage change from 2010.</p>
    </ChartCard>
  );
}
