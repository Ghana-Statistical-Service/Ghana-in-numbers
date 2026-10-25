"use client";

import CardExplanation from "@/components/shared/CardExplanation";

import { useEffect, useState } from "react";
import { CartesianGrid, LabelList, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { populationSize } from "@/data/populationData";

const colors = { census: "#382873", estimate: "#0891B2", projection: "#16A34A" };
const names = { census: "Census count", estimate: "Intercensal estimate", projection: "Population projection" };
const chartData = populationSize.map(d => ({ ...d, historical: Number(d.year) <= 2021 ? d.value : null, projected: Number(d.year) >= 2021 ? d.value : null }));

export default function PopulationGrowthChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><div className="min-w-0"><h2 className="text-sm font-bold text-slate-800">Population Size, 2000–2025</h2><CardExplanation indicator="population" /></div><p className="text-xs text-slate-500 mt-1">Population in millions · Annual values from Figure 3.1</p></div>
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">2025 projection: 33.7 million</span>
    </div>
    <div className="overflow-x-auto mt-3">
      <div className="h-[310px] min-w-[760px]">
        {mounted && <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 35, right: 28, left: 10, bottom: 22 }}>
            <CartesianGrid stroke="#E8EEF5" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" interval={0} angle={-45} textAnchor="end" height={45} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis domain={[16, 36]} ticks={[18,22,26,30,34]} label={{ value: "Millions", angle: -90, position: "insideLeft", style: { fontSize: 11 } }} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={55} />
            <Tooltip content={({ active, payload }) => {
              const d = payload?.[0]?.payload as typeof chartData[number] | undefined;
              if (!active || !d) return null;
              return <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs shadow-lg"><p className="font-bold text-slate-800">{d.year} · {d.value.toFixed(1)} million</p><p className="mt-1 text-slate-500">{names[d.kind as keyof typeof names]}</p></div>;
            }} />
            {["2000","2010","2021"].map(year => <ReferenceLine key={year} x={year} stroke="#DDD6FE" strokeDasharray="3 3" />)}
            <Line type="linear" dataKey="historical" stroke="#382873" strokeWidth={3} dot={false} activeDot={false} isAnimationActive={false} />
            <Line type="linear" dataKey="projected" stroke="#16A34A" strokeWidth={3} strokeDasharray="6 4" dot={false} activeDot={false} isAnimationActive={false} />
            <Line dataKey="value" stroke="transparent" isAnimationActive={false} activeDot={{ r: 6 }} dot={({ cx,cy,payload }) => {
              const kind = payload.kind as keyof typeof colors;
              return <circle key={payload.year} cx={cx} cy={cy} r={kind === "census" ? 6 : 4} fill={kind === "census" ? colors.census : "white"} stroke={colors[kind]} strokeWidth={2.5} />;
            }}>
              <LabelList dataKey="value" content={props => {
                const { x,y,value,index } = props as { x:number; y:number; value:number; index:number };
                const d=populationSize[index];
                return <text x={x} y={y+(index%2===0 ? -13 : 20)} textAnchor="middle" fontSize={10} fontWeight={d.kind === "census" ? 800 : 600} fill={colors[d.kind as keyof typeof colors]}>{Number(value).toFixed(1)}</text>;
              }} />
            </Line>
          </LineChart>
        </ResponsiveContainer>}
      </div>
    </div>
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600 mt-2">
      <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#382873]" />Census counts: 2000, 2010, 2021</span>
      <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border-2 border-cyan-600" />Intercensal estimates</span>
      <span className="flex items-center gap-2"><span className="w-5 border-t-2 border-dashed border-green-600" />Projections after 2021</span>
    </div>
    <p className="text-[11px] text-slate-500 mt-3">Source: GSS, 2010 &amp; 2021 PHC; 2021–2050 Population Projections · Ghana in Numbers 2025, p. 12. Values rounded to one decimal million.</p>
  </div>;
}
