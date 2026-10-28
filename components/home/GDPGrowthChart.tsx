"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/ui/Card";
import { ChartFrame, C, axisCommon, labelStyle, makeTooltip, tick } from "@/components/ui/chart";
import { gdpGrowthData as data } from "@/data/dummy";

const status: Record<string, string> = { "2024": "revised", "2025": "provisional" };

export default function GDPGrowthChart() {
  return (
    <ChartCard
      title="Real GDP growth"
      subtitle="Annual change in output at 2013 prices, %"
      period="2017–2025"
      explain={{ indicator: "gdpGrowth" }}
      notes="2024 revised; 2025 provisional (lighter bar). Growth was 6.0% in 2025, 0.2 percentage points above 2024."
      source="GSS Annual GDP 2013–2025; Ghana in Numbers 2025, p. 42"
    >
      <ChartFrame height={220} label="Real GDP growth by year: 2017 8.1%, 2018 6.2%, 2019 6.5%, 2020 0.5%, 2021 5.1%, 2022 3.8%, 2023 3.1%, 2024 5.8% revised, 2025 6.0% provisional">
        <BarChart data={data} margin={{ top: 22, right: 4, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tick} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tickFormatter={v => `${v}%`} width={40} />
          <Tooltip cursor={{ fill: "rgba(60,47,163,0.06)" }} content={makeTooltip({ unit: "%", labelFormat: l => status[l] ? `${l} (${status[l]})` : l })} />
          <Bar dataKey="value" name="Real GDP growth" radius={[4, 4, 0, 0]} isAnimationActive={false} maxBarSize={36}>
            {data.map(d => <Cell key={d.year} fill={d.year === "2025" ? C.purpleLight : C.purple} />)}
            <LabelList dataKey="value" position="top" formatter={(v: unknown) => `${Number(v).toFixed(1)}`} style={labelStyle} />
          </Bar>
        </BarChart>
      </ChartFrame>
    </ChartCard>
  );
}
