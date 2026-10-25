"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard, Qualifier, Stat } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Segmented } from "@/components/ui/Data";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, tick, tickSmall } from "@/components/ui/chart";
import { Ship, Store, TrendingUp, Wallet } from "lucide-react";
import { StatTile } from "@/components/ui/Infographic";
import { nominalGdpData, nominalGdpPerCapitaData, realGdpData, tradeGoodsData } from "@/data/businessEconomyData";
import { enterpriseTypes } from "@/data/reportAdditions";
import { gdpPerCapitaUsd, nominalGdpUsd, nonOilGdpGrowth2025 } from "@/data/publicationAdditions";

type Currency = "ghs" | "usd";
const statusLabel = (year: string) => year.endsWith("**") ? `${year.replace(/\*/g, "")} (provisional)` : year.endsWith("*") ? `${year.replace(/\*/g, "")} (revised)` : year;
const cleanYear = (y: string) => y.replace(/\*/g, "");
const currencyOptions = [{ value: "ghs" as Currency, label: "GH¢" }, { value: "usd" as Currency, label: "US$" }];

export function NominalGdpCard() {
  const [cur, setCur] = useState<Currency>("ghs");
  const data = (cur === "ghs" ? nominalGdpData.map(d => ({ year: d.year, value: d.overall })) : nominalGdpUsd).map(d => ({ ...d, label: cleanYear(d.year) }));
  return (
    <ChartCard title="Nominal GDP" subtitle={cur === "ghs" ? "GH¢ billion, current prices" : "US$ billion, current prices"} period="2013–2025"
      qualifier={<Qualifier tone="caution">2024 revised · 2025 provisional</Qualifier>}
      explain={{ indicator: "nominalGdp" }}
      actions={<Segmented label="Currency" size="sm" value={cur} onChange={setCur} options={currencyOptions} />}
      notes={cur === "ghs" ? "Rising prices account for much of the elevenfold increase in cedi terms; real GDP shows the change in volume." : "Converted at market exchange rates: currency movements can make the economy look larger or smaller in dollars (US$64.83bn in 2013 to US$114.21bn in 2025)."}
      source="GSS Annual GDP 2013–2025 · Figures 5.1–5.2, p. 36"
      footer={<DataDisclosure><DataTable caption="Nominal GDP" headings={["Year", "GH¢ billion", "US$ billion"]} rows={nominalGdpData.map((d, i) => [statusLabel(d.year), d.overall, nominalGdpUsd[i].value])} decimals={1} minWidth={360} unitNote="Figure 5.1 also plots non-oil GDP without value labels; it is not reproduced." /></DataDisclosure>}>
      <ChartFrame height={250} label={cur === "ghs" ? "Nominal GDP rose from GH¢124.5 billion in 2013 to GH¢1,434.1 billion in 2025" : "Nominal GDP in US dollars was US$64.8 billion in 2013 and US$114.2 billion in 2025"}>
        <BarChart data={data} margin={{ top: 22, right: 4, left: -4, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="label" {...axisCommon} tick={tickSmall} interval={0} />
          <YAxis {...axisCommon} tick={tick} width={48} tickFormatter={v => v.toLocaleString("en-GB")} domain={cur === "ghs" ? [0, 1600] : [0, 125]} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: cur === "ghs" ? " GH¢ bn" : " US$ bn", labelFormat: (_l, p) => statusLabel(String(p?.year ?? "")) })} />
          <Bar dataKey="value" name="Nominal GDP" radius={[3, 3, 0, 0]} isAnimationActive={false}>
            {data.map(d => <Cell key={d.year} fill={d.year.includes("*") ? C.purpleLight : C.purple} />)}
            <LabelList dataKey="value" position="top" formatter={(v: unknown) => Number(v).toLocaleString("en-GB", { maximumFractionDigits: cur === "ghs" && Number(v) > 999 ? 0 : 1 })} style={{ ...labelStyle, fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function RealGdpCard() {
  const data = realGdpData.map(d => ({ ...d, label: cleanYear(d.year) }));
  return (
    <ChartCard title="Real GDP and growth" subtitle="Two panels: level at 2013 prices (GH¢ billion) and annual growth (%)" period="2013–2025"
      qualifier={<Qualifier tone="caution">2024 revised · 2025 provisional</Qualifier>}
      explain={{ indicator: "realGdp" }}
      notes={`Real GDP rose 68.4% between 2013 and 2025. Growth was 6.0% in 2025; non-oil GDP grew ${nonOilGdpGrowth2025}% (Table 2.1).`}
      source="GSS Annual GDP 2013–2025 · Figure 5.5, p. 38"
      footer={<DataDisclosure><DataTable caption="Real GDP and growth" headings={["Year", "Real GDP (GH¢ bn, 2013 prices)", "Growth (%)"]} rows={realGdpData.map(d => [statusLabel(d.year), d.real, d.growth])} decimals={1} minWidth={420} /></DataDisclosure>}>
      <p className="mb-1 text-xs font-medium text-muted">Real GDP, GH¢ billion (2013 prices)</p>
      <ChartFrame height={170} label="Real GDP rose from GH¢124.5 billion in 2013 to GH¢209.6 billion in 2025">
        <LineChart data={data} margin={{ top: 20, right: 16, left: -4, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="label" {...axisCommon} tick={tickSmall} interval={1} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 250]} ticks={[0, 100, 200]} width={40} />
          <Tooltip content={makeTooltip({ unit: " GH¢ bn", labelFormat: (_l, p) => statusLabel(String(p?.year ?? "")) })} />
          <Line dataKey="real" name="Real GDP" stroke={C.blue} strokeWidth={2.5} dot={{ r: 3, fill: C.blue }} isAnimationActive={false}>
            <LabelList dataKey="real" content={p => { const { x, y, value, index } = p as { x: number; y: number; value: number; index: number }; return index === 0 || index === data.length - 1 ? <text x={x} y={y - 9} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>{value.toFixed(1)}</text> : null; }} />
          </Line>
        </LineChart>
      </ChartFrame>
      <p className="mb-1 mt-3 text-xs font-medium text-muted">Real GDP growth, %</p>
      <ChartFrame height={150} label="Real GDP growth by year, 2013 to 2025">
        <BarChart data={data} margin={{ top: 18, right: 16, left: -4, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="label" {...axisCommon} tick={tickSmall} interval={1} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 10]} ticks={[0, 5, 10]} tickFormatter={v => `${v}%`} width={40} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: "%", labelFormat: (_l, p) => statusLabel(String(p?.year ?? "")) })} />
          <Bar dataKey="growth" name="Real growth" radius={[3, 3, 0, 0]} isAnimationActive={false}>
            {data.map(d => <Cell key={d.year} fill={d.year.includes("*") ? C.tealLight : C.teal} />)}
            <LabelList dataKey="growth" position="top" formatter={(v: unknown) => Number(v).toFixed(1)} style={{ ...labelStyle, fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function PerCapitaCard() {
  const [cur, setCur] = useState<Currency>("ghs");
  const data = (cur === "ghs" ? nominalGdpPerCapitaData : gdpPerCapitaUsd).map(d => ({ ...d, label: cleanYear(d.year) }));
  return (
    <ChartCard title="GDP per capita" subtitle={cur === "ghs" ? "GH¢ per person, current prices" : "US$ per person, current prices"} period="2013–2025"
      qualifier={<Qualifier tone="caution">2024 revised · 2025 provisional</Qualifier>}
      explain={{ indicator: "perCapita" }}
      actions={<Segmented label="Currency" size="sm" value={cur} onChange={setCur} options={currencyOptions} />}
      notes={cur === "ghs" ? "About nine times the 2013 level in cedis; prices also rose, so purchasing power grew far less. An average of output, not household income." : "In dollars, output per person moved between US$1,756 (2015) and US$3,385 (2025)."}
      source="GSS Annual GDP 2013–2025 · Figures 5.3–5.4, pp. 37–38"
      footer={<DataDisclosure><DataTable caption="GDP per capita" headings={["Year", "GH¢", "US$"]} rows={nominalGdpPerCapitaData.map((d, i) => [statusLabel(d.year), d.value, gdpPerCapitaUsd[i].value])} decimals={[undefined, 1, 0]} minWidth={340} unitNote="Figure 5.3 is captioned in thousand US$ but its axis and the text are in thousand GH¢; the GH¢ reading is used. Intermediate GH¢ values are labelled in thousands (one decimal)." /></DataDisclosure>}>
      <ChartFrame height={260} minWidth={620} label={`GDP per capita by year in ${cur === "ghs" ? "Ghana cedis" : "US dollars"}`}>
        <BarChart data={data} margin={{ top: 22, right: 22, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="label" {...axisCommon} tick={tickSmall} interval={0} />
          <YAxis {...axisCommon} tick={tick} width={48} tickFormatter={v => cur === "ghs" ? `${v / 1000}k` : v.toLocaleString("en-GB")} domain={cur === "ghs" ? [0, 45000] : [0, 4000]} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ format: v => `${cur === "ghs" ? "GH¢" : "US$"}${v.toLocaleString("en-GB", { maximumFractionDigits: 1 })}`, labelFormat: (_l, p) => statusLabel(String(p?.year ?? "")) })} />
          <Bar dataKey="value" name="Per capita" radius={[3, 3, 0, 0]} isAnimationActive={false}>
            {data.map(d => <Cell key={d.year} fill={d.year.includes("*") ? C.amberLight : C.amber} />)}
            <LabelList dataKey="value" position="top" formatter={(v: unknown) => Math.round(Number(v)).toLocaleString("en-GB")} style={{ ...labelStyle, fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ChartFrame>
      <p className="text-xs text-muted">Bar labels in whole {cur === "ghs" ? "cedis" : "US dollars"} per person. 2013 is GH¢4,710; 2014–2024 are printed rounded to the nearest GH¢100.</p>
    </ChartCard>
  );
}

export function OutputStats() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Stat label="Nominal GDP, 2025 (provisional)" value="1,434.1" unit="GH¢ billion" context="About GH¢1.4 trillion; US$114.2 billion" />
      <Stat label="Real GDP growth, 2025 (provisional)" value="6.0" unit="%" context="5.8% in 2024 (revised)" />
      <Stat label="Non-oil GDP growth, 2025" value={nonOilGdpGrowth2025.toFixed(1)} unit="%" context="Table 2.1, p. 7" />
    </div>
  );
}

/** Headline icon row under the KPI strip; every value is read from the data files. */
export function EconomyGlanceCard() {
  const pc = nominalGdpPerCapitaData.at(-1)!, real = realGdpData.at(-1)!, trade = tradeGoodsData.at(-1)!;
  const businesses = enterpriseTypes.find(r => r[0] === "All businesses")?.[1] ?? "";
  return (
    <ChartCard title="Economy at a glance" subtitle="Latest figure for each indicator" period={`${cleanYear(pc.year)} (output and trade); 2024 (businesses)`}
      qualifier={<Qualifier tone="caution">2025 provisional</Qualifier>} explain={{ indicator: "nominalGdp" }}
      source="GSS Annual GDP; merchandise trade statistics; 2024 IBES I · pp. 37–38, 46, 81"
      footer={<DataDisclosure><DataTable caption="Economy at a glance" headings={["Indicator", "Year", "Value"]} rows={[["GDP per capita (GH¢)", statusLabel(pc.year), Math.round(pc.value)], ["Real GDP growth (%)", statusLabel(real.year), real.growth], ["Goods trade balance (GH¢ billion)", trade.year, trade.balance], ["Businesses counted", "2024", businesses]]} decimals={[undefined, undefined, 1]} minWidth={380} /></DataDisclosure>}>
      <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile icon={Wallet} tone="amber" label="GDP per capita" value={`GH¢${Math.round(pc.value).toLocaleString("en-GB")}`} period={statusLabel(pc.year)} />
        <StatTile icon={TrendingUp} tone="teal" label="Real GDP growth" value={`${real.growth.toFixed(1)}%`} period={statusLabel(real.year)} />
        <StatTile icon={Ship} tone="blue" label="Goods trade surplus" value={`GH¢${trade.balance.toFixed(1)}`} unit="billion" period={`${trade.year}, current prices`} />
        <StatTile icon={Store} tone="purple" label="Businesses counted" value={String(businesses)} period="2024 IBES I census" />
      </ul>
    </ChartCard>
  );
}
