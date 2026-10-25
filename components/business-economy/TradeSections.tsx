"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { Bean, BrickWall, Car, Droplet, Fuel, Gem, Nut, Package, type LucideIcon } from "lucide-react";
import { ChartCard, Stat } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Legend, Segmented } from "@/components/ui/Data";
import { Grid } from "@/components/ui/Page";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, num, tick, tickSmall } from "@/components/ui/chart";
import { getGroupExplanation } from "@/data/cardExplanationContent";
import { topExports2025, topImports2025, tradeGoodsData, tradePartnerRegions } from "@/data/businessEconomyData";
import { informalTrade } from "@/data/reportAdditions";
import {
  informalBalanceByNeighbour, informalTopGoods, informalTradeContext, informalTransport, informalWomenTransporters,
  namedExportDestinations2025, tradeFacts2025, tradeGoodsUsd,
} from "@/data/publicationAdditions";

export function MerchandiseTradeCard() {
  const [cur, setCur] = useState<"ghs" | "usd">("ghs");
  const data = cur === "ghs" ? tradeGoodsData : tradeGoodsUsd;
  const unit = cur === "ghs" ? "GH¢ billion" : "US$ billion";
  return (
    <ChartCard title="Merchandise trade" subtitle={`Exports, imports and trade balance, ${unit}, current prices`} period="2014–2025"
      explain={{ indicator: "trade" }}
      actions={<Segmented label="Currency" size="sm" value={cur} onChange={setCur} options={[{ value: "ghs", label: "GH¢" }, { value: "usd", label: "US$" }]} />}
      notes={<>Goods only. The 2025 current-price surplus (GH¢148.3 billion; US$11.5 billion) became a real deficit of GH¢{Math.abs(tradeFacts2025.realMerchandiseBalance)} billion after adjusting for prices, largely because gold prices were high. This differs from national-accounts net exports of goods and services (−GH¢7.6 billion real). Cedi values also move with the exchange rate.</>}
      source="GSS merchandise trade statistics · Figures 5.22–5.23, pp. 81–82; p. 84"
      footer={<DataDisclosure><DataTable caption="Merchandise trade" headings={["Year", "Exports GH¢ bn", "Imports GH¢ bn", "Balance GH¢ bn", "Exports US$ bn", "Imports US$ bn", "Balance US$ bn"]} rows={tradeGoodsData.map((d, i) => [d.year, d.export, d.import, d.balance, tradeGoodsUsd[i].export, tradeGoodsUsd[i].import, tradeGoodsUsd[i].balance])} decimals={1} minWidth={640} unitNote="Published balances may differ from exports minus imports by 0.1 because of rounding." /></DataDisclosure>}>
      <p className="mb-1 text-xs font-medium text-muted">Exports and imports, {unit}</p>
      <Legend className="mb-1" items={[{ label: "Exports", color: C.purple, shape: "line" }, { label: "Imports", color: C.amber, shape: "line" }]} />
      <ChartFrame height={220} label={`Exports and imports in ${unit}, 2014 to 2025`}>
        <LineChart data={data} margin={{ top: 18, right: 24, left: -4, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tickSmall} interval={0} />
          <YAxis {...axisCommon} tick={tick} width={44} domain={[0, cur === "ghs" ? 450 : 35]} />
          <Tooltip content={makeTooltip({ unit: cur === "ghs" ? " GH¢ bn" : " US$ bn" })} />
          <Line dataKey="export" name="Exports" stroke={C.purple} strokeWidth={2.5} dot={{ r: 3, fill: C.purple }} isAnimationActive={false}><LabelList dataKey="export" content={p => { const { x, y, value, index } = p as { x: number; y: number; value: number; index: number }; return index >= data.length - 2 ? <text x={x} y={y - 9} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.purple}>{num(value)}</text> : null; }} /></Line>
          <Line dataKey="import" name="Imports" stroke={C.amber} strokeWidth={2.5} dot={{ r: 3, fill: C.amber }} isAnimationActive={false}><LabelList dataKey="import" content={p => { const { x, y, value, index } = p as { x: number; y: number; value: number; index: number }; return index >= data.length - 2 ? <text x={x} y={y + 16} textAnchor="middle" fontSize={12} fontWeight={600} fill="#9A5512">{num(value)}</text> : null; }} /></Line>
        </LineChart>
      </ChartFrame>
      <p className="mb-1 mt-4 text-xs font-medium text-muted">Trade balance, {unit} · above zero = surplus</p>
      <ChartFrame height={200} label={`Trade balance in ${unit}, 2014 to 2025`}>
        <BarChart data={data} margin={{ top: 16, right: 24, left: -4, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tickSmall} interval={0} />
          <YAxis {...axisCommon} tick={tick} width={44} domain={cur === "ghs" ? [-80, 160] : [-8, 12]} ticks={cur === "ghs" ? [-80, -40, 0, 40, 80, 120, 160] : [-8, -4, 0, 4, 8, 12]} />
          <ReferenceLine y={0} stroke={C.slate} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ format: v => `${v < 0 ? "Deficit" : "Surplus"} ${num(Math.abs(v))} ${cur === "ghs" ? "GH¢" : "US$"} bn` })} />
          <Bar dataKey="balance" name="Trade balance" radius={2} isAnimationActive={false}>
            {data.map(d => <Cell key={d.year} fill={d.balance >= 0 ? C.teal : C.negative} />)}
            <LabelList dataKey="balance" content={p => { const { x, y, width, height, value } = p as { x: number; y: number; width: number; height: number; value: number }; const neg = value < 0; return <text x={x + width / 2} y={neg ? y + Math.abs(height) + 12 : y - 5} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>{num(value)}</text>; }} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

const commodityIcons: [RegExp, LucideIcon][] = [[/gold/i, Gem], [/cocoa/i, Bean], [/cashew/i, Nut], [/crude/i, Droplet], [/gas oil|motor spirit/i, Fuel], [/car/i, Car], [/cement|clinker/i, BrickWall]];
const iconFor = (name: string) => commodityIcons.find(([re]) => re.test(name))?.[1] ?? Package;

/** Commodity rows: icon, name, a thin bar on a 0–100% scale (shares of all exports or imports) and the share. */
function ShareList({ items, color, tint }: { items: { name: string; share: number }[]; color: string; tint: string }) {
  return (
    <ul className="space-y-2.5">
      {items.map(i => {
        const Icon = iconFor(i.name);
        return (
          <li key={i.name} className="grid grid-cols-[2rem_minmax(0,1fr)_3.25rem] items-center gap-x-3 text-[13px]">
            <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-md" style={{ background: tint, color }}><Icon size={16} aria-hidden="true" /></span>
            <span className="min-w-0"><span className="block text-body">{i.name}</span><span aria-hidden="true" className="mt-1 block h-1.5 rounded-full bg-surface-muted"><span className="block h-full rounded-full" style={{ width: `${i.share}%`, background: color }} /></span></span>
            <span className="tabular text-right font-semibold text-ink">{i.share.toFixed(1)}%</span>
          </li>
        );
      })}
    </ul>
  );
}

export function CommoditiesCard() {
  return (
    <ChartCard title="Top five export and import commodities" subtitle="% of the value of exports or imports" period="2025"
      explain={{ indicator: "exports" }}
      notes={`Bars are drawn on a 0–100% scale. Exports are concentrated: the top five make up ${tradeFacts2025.top5ExportShare}% (gold bullion alone 62.9%). Imports are spread out: the top five make up ${tradeFacts2025.top5ImportShare}%. Crude oil is 8.3% of exports while refined fuels (gas oil and motor spirit) are 20.4% of imports.`}
      source="GSS · Figure 5.24, pp. 82–83"
      footer={<DataDisclosure><DataTable caption="Top five exports, 2025" headings={["Export", "% of exports"]} rows={topExports2025.map(i => [i.name, i.share])} decimals={1} minWidth={280} /><DataTable caption="Top five imports, 2025" headings={["Import", "% of imports"]} rows={topImports2025.map(i => [i.name, i.share])} decimals={1} minWidth={280} /></DataDisclosure>}>
      <div className="grid gap-6">
        <div><p className="mb-2.5 text-[13.5px] font-semibold text-ink">Exports</p><ShareList items={topExports2025} color={C.purple} tint="#EEECFA" /></div>
        <div><p className="mb-2.5 text-[13.5px] font-semibold text-ink">Imports</p><ShareList items={topImports2025.map(i => ({ ...i, name: i.name.replace("Used cars 1.5-3.0L", "Used cars (1.5–3.0L)") }))} color="#9A5512" tint="#FBEFE2" /></div>
      </div>
    </ChartCard>
  );
}

export function PartnersCard() {
  return (
    <ChartCard title="Trade by continent" subtitle="% of exports and of imports" period="2025"
      explain={{ indicator: "partner" }}
      notes={`Bars are drawn on a 0–100% scale. Ghana exported to ${tradeFacts2025.exportPartners} partners and imported from ${tradeFacts2025.importPartners}. Trade with Africa ran a surplus: GH¢${tradeFacts2025.africaExports}bn exported, GH¢${tradeFacts2025.africaImports}bn imported. South America, Oceania and unknown destinations are small and not labelled in the source.`}
      source="GSS · Figure 5.25, pp. 83–84"
      footer={<DataDisclosure><DataTable caption="Trade by continent, 2025" headings={["Continent", "% of exports", "% of imports"]} rows={tradePartnerRegions.map(r => [r.region, r.export, r.import])} decimals={1} minWidth={320} /><DataTable caption="Named export destinations, 2025" headings={["Destination", "Exports (GH¢ bn)"]} rows={namedExportDestinations2025.map(d => [d.name, d.value])} decimals={1} minWidth={300} unitNote="Destinations named in the text; the publication does not print a complete top-ten country list." /></DataDisclosure>}>
      <Legend className="mb-2" items={[{ label: "Exports", color: C.purple }, { label: "Imports", color: C.amber }]} />
      <ul className="space-y-3">
        {tradePartnerRegions.map(r => (
          <li key={r.region} className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-3 text-[13px]">
            <span className="font-medium text-ink">{r.region}</span>
            <div className="space-y-1">
              {[{ v: r.export, c: C.purple }, { v: r.import, c: C.amber }].map((s, i) => (
                <div key={i} className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-2"><span className="h-2.5 rounded-sm bg-surface-muted"><span className="block h-full rounded-sm" style={{ width: `${s.v}%`, background: s.c }} /></span><span className="tabular text-right text-[12.5px] font-semibold text-ink">{s.v.toFixed(1)}%</span></div>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-line pt-4">
        <p className="mb-2 text-[13px] font-semibold text-ink">Largest named export destinations, GH¢ billion</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {namedExportDestinations2025.map(d => <li key={d.name} className="rounded-md bg-surface-muted px-3 py-2"><span className="tabular block text-[15px] font-semibold text-ink">{d.value.toFixed(1)}</span><span className="block text-xs text-muted">{d.name}</span></li>)}
        </ul>
      </div>
    </ChartCard>
  );
}

/* ── Informal cross-border trade ─────────────────────────────────────────── */

export function InformalTradeSection() {
  const quarters = informalTrade.slice(0, 4).map(r => ({ quarter: String(r[0]), exports: Number(r[1]), imports: Number(r[2]), balance: Number(r[4]) }));
  const neighbours = informalBalanceByNeighbour.map(r => ({ ...r }));
  const total = informalTrade[4];
  return (
    <div className="space-y-4 lg:space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat tone="brand" label="Informal trade, Oct 2024 – Sep 2025" value={num(Number(total[3]), 2)} unit="GH¢ billion" context="5.6% of all Ghana’s trade" />
        <Stat label="Informal exports" value={num(Number(total[1]), 2)} unit="GH¢ billion" context="Full 12-month survey period" />
        <Stat label="Informal imports" value={num(Number(total[2]), 2)} unit="GH¢ billion" context="Full 12-month survey period" />
        <Stat label="Informal trade balance" value={`+${num(Number(total[4]), 2)}`} unit="GH¢ billion" context="Surplus; 1.4× formal trade with the three neighbours" />
      </div>
      <Grid cols={2}>
        <ChartCard title="Informal exports and imports by quarter" subtitle="GH¢ billion" period="Q4 2024 – Q3 2025"
          explain={getGroupExplanation("informalTrade", "Informal cross-border trade", [0])}
          notes="Only four quarters have been observed; Q4 2024 was the survey’s first quarter, so read the rise into 2025 with care. The survey period is not calendar-year 2025."
          source="GSS ICBT Survey · Table 5.11, p. 85"
          footer={<DataDisclosure><DataTable caption="Informal and formal trade by quarter" headings={["Period", "Informal exports", "Informal imports", "Informal total", "Informal balance", "Formal total (all partners)", "Informal share of all trade (%)"]} rows={informalTrade.map((r, i) => ({ cells: [r[0], r[1], r[2], r[3], r[4], informalTradeContext[i].formalTotal, informalTradeContext[i].informalShare], emphasis: i === 4 ? "total" as const : undefined }))} decimals={[undefined, 2, 2, 2, 2, 1, 1]} minWidth={720} unitNote="GH¢ billion unless stated. Rounded quarterly balances are shown as published and can differ from exports minus imports (e.g. Q4 2024: 3.95 − 3.53 = 0.42, published 0.41)." /></DataDisclosure>}>
          <Legend className="mb-1" items={[{ label: "Exports", color: C.purple }, { label: "Imports", color: C.amber }]} />
          <ChartFrame height={230} label="Informal exports and imports by quarter">
            <BarChart data={quarters} margin={{ top: 20, right: 8, left: -8, bottom: 0 }} barGap={2}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="quarter" {...axisCommon} tick={tick} />
              <YAxis {...axisCommon} tick={tick} width={36} domain={[0, 7]} />
              <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ decimals: 2, unit: " GH¢ bn" })} />
              <Bar dataKey="exports" name="Exports" fill={C.purple} radius={[2, 2, 0, 0]} isAnimationActive={false}><LabelList dataKey="exports" position="top" formatter={(v: unknown) => num(Number(v), 2)} style={{ ...labelStyle, fontSize: 12 }} /></Bar>
              <Bar dataKey="imports" name="Imports" fill={C.amber} radius={[2, 2, 0, 0]} isAnimationActive={false}><LabelList dataKey="imports" position="top" formatter={(v: unknown) => num(Number(v), 2)} style={{ ...labelStyle, fontSize: 12 }} /></Bar>
            </BarChart>
          </ChartFrame>
        </ChartCard>

        <ChartCard title="Informal trade balance with each neighbour" subtitle="GH¢ million · above zero = Ghana sells more" period="Q4 2024 – Q3 2025"
          explain={getGroupExplanation("informalTrade", "Informal trade balance and share", [1])}
          notes="Surpluses with Burkina Faso (+GH¢2.8bn over 12 months) and Côte d’Ivoire (+GH¢2.0bn) offset a widening deficit with Togo (−GH¢3.2bn). The three add up to the quarterly balance; the surplus nearly vanished in Q3 2025 (GH¢49–50 million)."
          source="GSS ICBT Survey · Figure 5.26, p. 86"
          footer={<DataDisclosure><DataTable caption="Informal trade balance by neighbour, GH¢ million" headings={["Quarter", "Burkina Faso", "Côte d’Ivoire", "Togo", "Sum"]} rows={neighbours.map(r => [r.quarter, r.burkina, r.coteDIvoire, r.togo, r.burkina + r.coteDIvoire + r.togo])} decimals={0} minWidth={420} /></DataDisclosure>}>
          <Legend className="mb-1" items={[{ label: "Burkina Faso", color: C.teal }, { label: "Côte d’Ivoire", color: C.blue }, { label: "Togo", color: C.negative }]} />
          <ChartFrame height={230} label="Informal trade balance by neighbour and quarter">
            <BarChart data={neighbours} margin={{ top: 20, right: 8, left: -4, bottom: 0 }} barGap={2}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="quarter" {...axisCommon} tick={tick} />
              <YAxis {...axisCommon} tick={tick} width={44} domain={[-1200, 1000]} ticks={[-1000, -500, 0, 500, 1000]} />
              <ReferenceLine y={0} stroke={C.slate} />
              <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ format: v => `${v > 0 ? "+" : "−"}GH¢${Math.abs(v).toLocaleString("en-GB")} million` })} />
              <Bar dataKey="burkina" name="Burkina Faso" fill={C.teal} radius={2} isAnimationActive={false} />
              <Bar dataKey="coteDIvoire" name="Côte d’Ivoire" fill={C.blue} radius={2} isAnimationActive={false} />
              <Bar dataKey="togo" name="Togo" fill={C.negative} radius={2} isAnimationActive={false} />
            </BarChart>
          </ChartFrame>
        </ChartCard>
      </Grid>
      <Grid cols={3}>
        <ChartCard title="What crosses the border" subtitle="Top five goods, GH¢ million" period="Oct 2024 – Sep 2025"
          explain={getGroupExplanation("informalTrade", "Informal cross-border trade", [0])}
          notes={`Drinks and fuel go out; food and household goods come in. Top five: ${informalTopGoods.exportTop5Share}% of informal exports and ${informalTopGoods.importTop5Share}% of imports. Weedicide is a minimum (earlier quarters unpublished).`}
          source="GSS ICBT Survey · Table 5.12, p. 86">
          {[{ label: "Exports", rows: informalTopGoods.exports, color: C.purple }, { label: "Imports", rows: informalTopGoods.imports, color: C.amber }].map(g => (
            <div key={g.label} className="mb-4 last:mb-0">
              <p className="mb-2 text-[13px] font-semibold text-ink">{g.label}</p>
              <ul className="space-y-1.5">{g.rows.map(([name, v]) => <li key={name} className="grid grid-cols-[8.5rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-[12.5px]"><span className="text-body">{name}</span><span className="h-2.5 rounded-sm bg-surface-muted"><span className="block h-full rounded-sm" style={{ width: `${(v / 1400) * 100}%`, background: g.color }} /></span><span className="tabular text-right font-semibold text-ink">{v.toLocaleString("en-GB")}</span></li>)}</ul>
            </div>
          ))}
        </ChartCard>
        <ChartCard title="How informal trade moves" subtitle="Value carried by means of transport, GH¢ billion (% of total)" period="Oct 2024 – Sep 2025"
          explain={getGroupExplanation("informalTrade", "Informal cross-border trade", [0])}
          notes="Tricycles and motorbikes carried 62% of the value. Upper East is the export gateway (GH¢5.3bn) and Volta the import gateway (GH¢6.1bn)."
          source="GSS ICBT Survey · Figure 5.27a, p. 87">
          <ul className="space-y-2">{informalTransport.map(([mode, v, s]) => <li key={mode} className="grid grid-cols-[5.5rem_minmax(0,1fr)_5rem] items-center gap-2 text-[12.5px]"><span className="text-body">{mode}</span><span className="h-3 rounded-sm bg-surface-muted"><span className="block h-full rounded-sm" style={{ width: `${(v / 14) * 100}%`, background: mode === "All others" ? C.slateLight : C.teal }} /></span><span className="tabular text-right font-semibold text-ink">{v.toFixed(1)} <span className="font-normal text-subtle">({s}%)</span></span></li>)}</ul>
        </ChartCard>
        <ChartCard title="Women as transporters" subtitle="% of transporters who are women" period="Q4 2024 – Q3 2025"
          explain={getGroupExplanation("informalTrade", "Informal cross-border trade", [0])}
          notes="About two in three export transporters are men; women make up about four in ten import transporters."
          source="GSS ICBT Survey · Figure 5.27b, p. 87"
          footer={<DataDisclosure><DataTable caption="Women as % of transporters" headings={["Quarter", "Exports (%)", "Imports (%)"]} rows={informalWomenTransporters.map(r => [r.quarter, r.exports, r.imports])} decimals={0} minWidth={280} /></DataDisclosure>}>
          <Legend className="mb-1" items={[{ label: "Exports", color: C.purple }, { label: "Imports", color: C.amber }]} />
          <ChartFrame height={190} label="Women as a share of transporters by quarter">
            <BarChart data={informalWomenTransporters} margin={{ top: 18, right: 4, left: 0, bottom: 0 }} barGap={2}>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="quarter" {...axisCommon} tick={tickSmall} />
              <YAxis {...axisCommon} tick={tick} width={40} domain={[0, 60]} ticks={[0, 25, 50]} tickFormatter={v => `${v}%`} />
              <ReferenceLine y={50} stroke={C.slateLight} strokeDasharray="4 4" label={{ value: "half", position: "insideTopRight", fontSize: 12, fill: C.axis }} />
              <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ decimals: 0, unit: "%" })} />
              <Bar dataKey="exports" name="Exports" fill={C.purple} radius={[2, 2, 0, 0]} isAnimationActive={false}><LabelList dataKey="exports" position="top" style={{ ...labelStyle, fontSize: 12 }} /></Bar>
              <Bar dataKey="imports" name="Imports" fill={C.amber} radius={[2, 2, 0, 0]} isAnimationActive={false}><LabelList dataKey="imports" position="top" style={{ ...labelStyle, fontSize: 12 }} /></Bar>
            </BarChart>
          </ChartFrame>
        </ChartCard>
      </Grid>
      <p className="text-xs leading-relaxed text-subtle">Observed 6 a.m.–6 p.m. on 10–14 days a month at 321 border points; other days estimated. Night trade, hawked food and illegal goods are excluded, so the true value is likely higher.</p>
    </div>
  );
}
