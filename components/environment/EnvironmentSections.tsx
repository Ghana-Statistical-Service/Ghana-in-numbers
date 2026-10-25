"use client";

import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Legend } from "@/components/ui/Data";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, num, tick, tickSmall } from "@/components/ui/chart";
import RegionalMap from "@/components/maps/RegionalMap";
import { carbonRetentionData, forestReserveArea2025, forestReserveTotal2025, monthlyRainfall2025, monthlyTemperature2025 } from "@/data/environmentData";
import { REGIONS, carbonStockChange, climateAverages2025, forestShare1990to2021 } from "@/data/publicationAdditions";

export function ForestCard() {
  const data = REGIONS.map(region => ({ region, value: forestReserveArea2025.find(f => f.region === region)?.area ?? null }));
  return (
    <ChartCard title="Forest reserve area by region" subtitle="Designated forest reserve, km²" period="December 2025" explain={{ indicator: "forest" }}
      notes={`Reported total ${forestReserveTotal2025.toLocaleString("en-GB")} km² across 12 regions. Western North, Oti, Savannah and North East are not reported separately (hatched): a missing value is not zero. Reserve area is designated land, not current tree cover. Western, Ashanti and Northern hold about 60.8% of the reported area.`}
      source="Forestry Commission (2025) · Figure 7.1, p. 96"
      footer={<DataDisclosure><DataTable caption="Forest reserve area by region, December 2025" headings={["Region", "Area (km²)"]} rows={[...data].sort((a, b) => (b.value ?? -1) - (a.value ?? -1)).map(d => [d.region, d.value])} decimals={2} minWidth={300} unitNote="— not reported separately in the source. Some smaller regional areas are printed rounded to whole km²." /></DataDisclosure>}>
      <RegionalMap data={data} measure="Forest reserve area (km²)" format={v => v.toLocaleString("en-GB", { maximumFractionDigits: v < 100 ? 2 : 0 })} height={420} highlight={`Reported total: ${forestReserveTotal2025.toLocaleString("en-GB")} km²`} />
    </ChartCard>
  );
}

export function ForestShareCard() {
  return (
    <ChartCard title="An earlier measure: regional share of forest reserves" subtitle="% share, 1990 and 2021, regions cited in the text" period="1990 and 2021"
      explain={{ indicator: "forest", title: "Forest reserve share (earlier series)" }}
      notes="Cited in Table 2.1 and Chapter 11 but replaced in Chapter 7 by the December 2025 area figures above. The definition of the share is not stated and only four regions are printed, so the two measures should not be combined."
      source="Table 2.1, p. 9; Chapter 11, p. 128"
      footer={<DataDisclosure><DataTable caption="Forest reserve share, 1990 and 2021" headings={["Region", "1990 (%)", "2021 (%)"]} rows={forestShare1990to2021.map(r => [r.region, r.y1990, r.y2021])} decimals={1} minWidth={300} /></DataDisclosure>}>
      <Legend className="mb-3" items={[{ label: "1990", color: C.slateLight, shape: "dot" }, { label: "2021", color: C.teal, shape: "dot" }]} />
      <ul className="space-y-4">
        {forestShare1990to2021.map(r => (
          <li key={r.region}>
            <div className="mb-1 flex justify-between text-[13px]"><span className="text-ink">{r.region}</span><span className="tabular text-muted">{r.y1990}% → <span className="font-semibold text-ink">{r.y2021}%</span></span></div>
            <div className="relative h-4"><div className="absolute inset-x-0 top-1/2 h-px bg-line" />
              <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#B8C1CF]" style={{ left: `${(r.y1990 / 20) * 100}%` }} />
              <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ left: `${(r.y2021 / 20) * 100}%`, background: C.teal }} />
            </div>
          </li>
        ))}
      </ul>
      <div className="tabular mt-2 flex justify-between text-xs text-subtle"><span>0%</span><span>10%</span><span>20%</span></div>
    </ChartCard>
  );
}

export function CarbonCard() {
  const data = carbonRetentionData.map(d => ({ ...d, total: +(d.soil + d.nonSoil).toFixed(1), _top: 0.001 })).filter(d => d.total > 0).sort((a, b) => b.total - a.total);
  return (
    <ChartCard title="Carbon stored by land cover" subtitle="Carbon stock, million tonnes of carbon (Mt C)" period="2021" explain={{ indicator: "carbon" }}
      notes="A stock, not an annual removal rate. Grassland stores 344.0 Mt C (141.2 non-soil + 202.8 soil); the text’s 334.0 is an arithmetic slip. Grassland, open forest, cropland and closed forest hold about 84% of the total. Water and bare land store none."
      source="EPA, GSS and FC (2025), Ghana Ecosystem Services Account 2015–2021 · Figure 7.2, p. 97"
      footer={<DataDisclosure><DataTable caption="Carbon retention by land cover, 2021" headings={["Land cover", "Non-soil (Mt C)", "Soil (Mt C)", "Total (Mt C)"]} rows={carbonRetentionData.map(d => [d.landCover, d.nonSoil, d.soil, +(d.soil + d.nonSoil).toFixed(1)])} decimals={1} minWidth={420} /></DataDisclosure>}>
      <Legend className="mb-2" items={[{ label: "Non-soil (vegetation)", color: C.teal }, { label: "Soil", color: C.amber }]} />
      <ChartFrame height={340} label="Carbon stock by land cover, 2021: grassland 344.0, open forest 236.8, cropland 214.3, closed forest 172.3 million tonnes">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, left: 0, bottom: 0 }} barCategoryGap="22%">
          <CartesianGrid stroke={C.grid} horizontal={false} />
          <XAxis type="number" {...axisCommon} tick={tick} domain={[0, 400]} ticks={[0, 100, 200, 300, 400]} />
          <YAxis type="category" dataKey="landCover" {...axisCommon} tick={{ ...tickSmall, fill: C.ink }} width={108} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: " Mt C" })} />
          <Bar dataKey="nonSoil" name="Non-soil" stackId="c" fill={C.teal} isAnimationActive={false} />
          <Bar dataKey="soil" name="Soil" stackId="c" fill={C.amber} isAnimationActive={false} />
          <Bar dataKey="_top" name="_hidden" stackId="c" fill="transparent" isAnimationActive={false}><LabelList dataKey="total" position="right" formatter={(v: unknown) => num(Number(v))} style={labelStyle} /></Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function CarbonChangeCard() {
  let running = carbonStockChange.start;
  const steps = carbonStockChange.steps.map(([label, change]) => { const start = running; running = +(running + change).toFixed(1); return { label, change, start, end: running }; });
  const lo = 1040, hi = 1400;
  const pct = (v: number) => ((v - lo) / (hi - lo)) * 100;
  return (
    <ChartCard title="How the carbon stock changed, 2015 to 2021" subtitle="Change by land-cover class, Mt C (waterfall)" period="2015–2021"
      explain={{ indicator: "carbon", title: "Carbon stock change" }}
      notes={`Total stock fell from ${num(carbonStockChange.start)} to ${num(carbonStockChange.end)} Mt C. The scale starts at 1,040 Mt C so that the smaller changes are visible; bar lengths show changes, not totals.`}
      source="EPA, GSS and FC (2025) · Figure 7.3, p. 97"
      footer={<DataDisclosure><DataTable caption="Carbon stock change by land cover, 2015 to 2021" headings={["Item", "Change (Mt C)", "Running total (Mt C)"]} rows={[{ cells: ["Total stock, 2015", null, carbonStockChange.start], emphasis: "total" as const }, ...steps.map(s => [s.label, s.change, s.end]), { cells: ["Total stock, 2021", null, carbonStockChange.end], emphasis: "total" as const }]} decimals={1} minWidth={380} /></DataDisclosure>}>
      <ul className="space-y-1.5" aria-label="Carbon stock waterfall from 2015 to 2021">
        {[{ label: "Total 2015", start: lo, end: carbonStockChange.start, change: null as number | null, total: true }, ...steps.map(s => ({ ...s, total: false })), { label: "Total 2021", start: lo, end: carbonStockChange.end, change: null, total: true }].map(s => {
          const a = Math.min(s.start, s.end), b = Math.max(s.start, s.end);
          const color = s.total ? C.slate : (s.change ?? 0) < 0 ? C.negative : C.teal;
          return (
            <li key={s.label} className="grid grid-cols-[7rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-[12.5px]">
              <span className={s.total ? "font-semibold text-ink" : "text-body"}>{s.label}</span>
              <span className="relative h-4 rounded-sm bg-surface-muted"><span className="absolute inset-y-0 rounded-sm" style={{ left: `${pct(a)}%`, width: `${Math.max(0.6, pct(b) - pct(a))}%`, background: color }} /></span>
              <span className="tabular text-right font-semibold text-ink">{s.total ? num(s.end) : `${(s.change ?? 0) > 0 ? "+" : "−"}${num(Math.abs(s.change ?? 0))}`}</span>
            </li>
          );
        })}
      </ul>
      <div className="tabular mt-2 grid grid-cols-[7rem_minmax(0,1fr)_4.25rem] gap-2 text-xs text-subtle"><span /><span className="flex justify-between"><span>1,040</span><span>1,220</span><span>1,400</span></span><span /></div>
      <Legend className="mt-3" items={[{ label: "Decrease", color: C.negative }, { label: "Increase", color: C.teal }, { label: "Total", color: C.slate }]} />
    </ChartCard>
  );
}

export function RainfallCard() {
  return (
    <ChartCard title="Monthly rainfall" subtitle="Average rainfall, millimetres" period="2025" explain={{ indicator: "rain" }}
      notes={`Two peaks: 216.7 mm in June and 185.1 mm in October, typical of the two rainy seasons in much of southern Ghana. Monthly average ${climateAverages2025.rainfallMonthlyAverage} mm (dashed). The 2000–2010 and 2011–2024 reference curves in Figure 7.4 are unlabelled and not reproduced.`}
      source="Ghana Meteorological Agency · Figure 7.4, p. 98; Table 2.1"
      footer={<DataDisclosure><DataTable caption="Monthly rainfall, 2025" headings={["Month", "Rainfall (mm)"]} rows={monthlyRainfall2025.map(d => [d.month, d.value])} decimals={1} minWidth={260} /></DataDisclosure>}>
      <ChartFrame height={250} label="Monthly rainfall in 2025, peaking at 216.7 mm in June and 185.1 mm in October">
        <BarChart data={monthlyRainfall2025} margin={{ top: 22, right: 8, left: -6, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="month" {...axisCommon} tick={tick} interval={0} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 250]} ticks={[0, 50, 100, 150, 200, 250]} width={40} />
          <ReferenceLine y={climateAverages2025.rainfallMonthlyAverage} stroke={C.slate} strokeDasharray="4 4" />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: " mm" })} />
          <Bar dataKey="value" name="Rainfall" fill={C.blue} radius={[3, 3, 0, 0]} isAnimationActive={false}><LabelList dataKey="value" position="top" formatter={(v: unknown) => num(Number(v))} style={{ ...labelStyle, fontSize: 12 }} /></Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}

export function TemperatureCard() {
  return (
    <ChartCard title="Monthly temperature" subtitle="Average temperature, °C" period="2025" explain={{ indicator: "temperature" }}
      notes={`Warmest in March (30.4°C), coolest in August (25.4°C); the range across the year is under 5°C. Monthly average ${climateAverages2025.temperatureMonthlyAverage}°C (dashed). The axis starts at 20°C to show the seasonal cycle; one year cannot show a long-term trend.`}
      source="Ghana Meteorological Agency · Figure 7.5, p. 99; Table 2.1"
      footer={<DataDisclosure><DataTable caption="Monthly temperature, 2025" headings={["Month", "Temperature (°C)"]} rows={monthlyTemperature2025.map(d => [d.month, d.value])} decimals={1} minWidth={260} /></DataDisclosure>}>
      <ChartFrame height={250} label="Monthly average temperature in 2025, from 30.4°C in March to 25.4°C in August">
        <LineChart data={monthlyTemperature2025} margin={{ top: 22, right: 16, left: -6, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="month" {...axisCommon} tick={tick} interval={0} />
          <YAxis {...axisCommon} tick={tick} domain={[20, 32]} ticks={[20, 24, 28, 32]} tickFormatter={v => `${v}°`} width={40} />
          <ReferenceLine y={climateAverages2025.temperatureMonthlyAverage} stroke={C.slate} strokeDasharray="4 4" />
          <Tooltip content={makeTooltip({ unit: "°C" })} />
          <Line dataKey="value" name="Temperature" stroke={C.negative} strokeWidth={2.5} dot={{ r: 3.5, fill: C.negative }} isAnimationActive={false}><LabelList dataKey="value" position="top" offset={8} formatter={(v: unknown) => num(Number(v))} style={{ ...labelStyle, fontSize: 12 }} /></Line>
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}
