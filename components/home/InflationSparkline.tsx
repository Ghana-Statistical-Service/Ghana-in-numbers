"use client";

import { CartesianGrid, Line, LineChart, ReferenceDot, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/ui/Card";
import { ChartFrame, C, axisCommon, makeTooltip, tick } from "@/components/ui/chart";
import { inflationSparklineData } from "@/data/dummy";

const first = inflationSparklineData[0];
const last = inflationSparklineData.at(-1)!;

export default function InflationSparkline() {
  return (
    <ChartCard
      title="Consumer inflation"
      subtitle="Year-on-year, % · monthly"
      period="Jan 2024 – Dec 2025"
      explain={{ indicator: "inflation" }}
      notes="Lower inflation means prices are rising more slowly, not that they have fallen. Annual average for 2025: 14.6%."
      source="GSS Consumer Price Index; Ghana in Numbers 2025, pp. 51–53"
    >
      <p className="tabular flex items-baseline gap-2 text-ink"><span className="text-3xl font-semibold tracking-tight">{last.value}%</span><span className="text-[13px] text-muted">December 2025, down from {first.value}% in January 2024</span></p>
      <ChartFrame height={190} label={`Monthly year-on-year inflation from ${first.value}% in January 2024 to ${last.value}% in December 2025`}>
        <LineChart data={inflationSparklineData} margin={{ top: 16, right: 12, left: -8, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="month" {...axisCommon} tick={tick} interval={5} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 30]} ticks={[0, 10, 20, 30]} tickFormatter={v => `${v}%`} width={40} />
          <Tooltip content={makeTooltip({ unit: "%" })} />
          <Line type="monotone" dataKey="value" name="Year-on-year inflation" stroke={C.purple} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
          <ReferenceDot x={last.month} y={last.value} r={4.5} fill={C.purple} stroke="#fff" strokeWidth={2} />
        </LineChart>
      </ChartFrame>
    </ChartCard>
  );
}
