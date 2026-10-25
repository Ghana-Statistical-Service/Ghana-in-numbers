"use client";

import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import CardExplanation from "@/components/shared/CardExplanation";
import { regionalPopulationShares2025 as regionalShares, netMigrationChartData as migration, internalMigrationData as internal, immigrationData as immigrants, emigrationData as emigrants, emigrationReasonsData as reasons, emigrantDestinationsData as destinations } from "@/data/reportAdditions";

const grid = <CartesianGrid stroke="#E8EEF5" strokeDasharray="3 3" horizontal={false} />;
const tooltipStyle = { borderRadius:12, border:"1px solid #E2E8F0", fontSize:12 };

const chartIndicators: Record<string, string> = { "Regional Share of Population":"regionalPopulation", "Net Migration by Region":"netMigration", "Internal Migration over Time":"internalMigration", "Census-recorded Ghanaians Abroad":"emigration", "Reasons for Emigrating":"emigrationReasons", "Where Emigrants Live":"emigrantDestinations", "Immigrants as a Share of the Population":"immigration" };

function ChartCard({ title, subtitle, children }: { title:string; subtitle:string; children:ReactNode }) {
  return <article className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm min-w-0">
    <div className="flex items-start justify-between gap-3"><h3 className="text-sm font-bold text-slate-800">{title}</h3><CardExplanation indicator={chartIndicators[title]} title={title} /></div>
    <p className="mt-1 mb-4 text-xs text-slate-500">{subtitle}</p>
    {children}
  </article>;
}

function Chart({ mounted, height=280, children }: { mounted:boolean; height?:number; children:ReactElement }) {
  return <div style={{ height }} role="img" aria-label="Interactive statistical chart; hover or focus on values for details">
    {mounted ? <ResponsiveContainer width="100%" height="100%" minWidth={0}>{children}</ResponsiveContainer> : <div className="h-full rounded-lg bg-slate-50" />}
  </div>;
}

export default function MigrationPanel() {
  const [mounted,setMounted] = useState(false);
  useEffect(() => setMounted(true),[]);
  return <section className="space-y-4" aria-labelledby="migration-heading">
    <div><h2 id="migration-heading" className="text-xl font-bold text-slate-800">Migration and Population Distribution</h2><p className="mt-1 text-sm text-slate-500">Where people live, which regions gain population, and why Ghanaians move abroad.</p></div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <ChartCard title="Regional Share of Population" subtitle="2025 projection · Percentage of Ghana’s population">
        <Chart mounted={mounted} height={480}>
          <BarChart data={regionalShares} layout="vertical" margin={{ left:8, right:42 }}>
            {grid}<XAxis type="number" domain={[0,20]} tickFormatter={v=>`${v}%`} tick={{ fontSize:10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${Number(v).toFixed(1)}%`,"Population share"]} />
            <Bar dataKey="value" radius={[0,4,4,0]} isAnimationActive={false}>
              {regionalShares.map((d,i)=><Cell key={d.name} fill={i<2 ? "#382873" : "#8B7DC5"} />)}
              <LabelList dataKey="value" position="right" formatter={(v:unknown)=>`${Number(v).toFixed(1)}%`} style={{ fontSize:10,fill:"#475569" }} />
            </Bar>
          </BarChart>
        </Chart>
      </ChartCard>
      <ChartCard title="Net Migration by Region" subtitle="2021 census · Net persons gained or lost, rounded">
        <div className="flex gap-5 mb-2 text-xs text-slate-600"><span>● <span className="text-violet-800">Net gain</span></span><span>● <span className="text-amber-700">Net loss</span></span></div>
        <Chart mounted={mounted} height={455}>
          <BarChart data={migration} layout="vertical" margin={{ left:6,right:30 }}>
            {grid}<XAxis type="number" domain={[-550000,1250000]} ticks={[-500000,0,500000,1000000]} tickFormatter={v=>v===0?"0":`${v/1000000}M`} tick={{ fontSize:10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize:11 }} axisLine={false} tickLine={false} />
            <ReferenceLine x={0} stroke="#64748B" />
            <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${Number(v)>0?"+":""}${Number(v).toLocaleString()} persons`,"Net migration"]} />
            <Bar dataKey="value" radius={3} isAnimationActive={false}>{migration.map(d=><Cell key={d.name} fill={d.value>=0?"#382873":"#D08A25"} />)}</Bar>
          </BarChart>
        </Chart>
      </ChartCard>
      <ChartCard title="Internal Migration over Time" subtitle="Share enumerated outside their region of birth · Percent">
        <Chart mounted={mounted}>
          <LineChart data={internal} margin={{ top:24,right:24,left:0,bottom:5 }}>
            <CartesianGrid stroke="#E8EEF5" vertical={false} /><XAxis dataKey="year" tickLine={false} axisLine={false} /><YAxis domain={[0,40]} unit="%" tick={{ fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${v}%`,"Internal migrant share"]} />
            <Line dataKey="value" type="linear" stroke="#0891B2" strokeWidth={3} dot={{ r:6,fill:"white",strokeWidth:3 }} isAnimationActive={false}><LabelList dataKey="value" position="top" formatter={(v:unknown)=>`${v}%`} style={{ fontSize:12,fill:"#0E7490",fontWeight:700 }} /></Line>
          </LineChart>
        </Chart>
      </ChartCard>
      <ChartCard title="Census-recorded Ghanaians Abroad" subtitle="Persons · 2010 and 2021 censuses">
        <Chart mounted={mounted}>
          <BarChart data={emigrants} margin={{ top:26,right:20,left:0,bottom:5 }} barSize={80}>
            <CartesianGrid stroke="#E8EEF5" vertical={false} /><XAxis dataKey="year" tickLine={false} axisLine={false} /><YAxis domain={[0,350000]} tickFormatter={v=>`${v/1000}k`} tick={{ fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${Number(v).toLocaleString()} persons`,"Recorded emigrants"]} />
            <Bar dataKey="value" fill="#17B8A6" radius={[6,6,0,0]} isAnimationActive={false}><LabelList dataKey="value" position="top" formatter={(v:unknown)=>Number(v).toLocaleString()} style={{ fontSize:12,fill:"#0F766E",fontWeight:700 }} /></Bar>
          </BarChart>
        </Chart>
      </ChartCard>
      <ChartCard title="Reasons for Emigrating" subtitle="Emigrants aged 15+ · Percent">
        <Chart mounted={mounted}>
          <BarChart data={reasons} layout="vertical" margin={{ left:5,right:48 }}>
            {grid}<XAxis type="number" domain={[0,80]} unit="%" tick={{ fontSize:10 }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={125} tick={{ fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${v}%`,"Share of emigrants aged 15+"]} />
            <Bar dataKey="value" fill="#0891B2" radius={[0,4,4,0]} isAnimationActive={false}><LabelList dataKey="value" position="right" formatter={(v:unknown)=>`${v}%`} style={{ fontSize:11,fill:"#475569" }} /></Bar>
          </BarChart>
        </Chart>
      </ChartCard>
      <ChartCard title="Where Emigrants Live" subtitle="Census-recorded emigrants by destination · Percent">
        <Chart mounted={mounted}>
          <BarChart data={destinations} layout="vertical" margin={{ left:5,right:48 }}>
            {grid}<XAxis type="number" domain={[0,45]} unit="%" tick={{ fontSize:10 }} axisLine={false} tickLine={false} /><YAxis type="category" dataKey="name" width={100} tick={{ fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${v}%`,"Share of recorded emigrants"]} />
            <Bar dataKey="value" fill="#7C6AB5" radius={[0,4,4,0]} isAnimationActive={false}><LabelList dataKey="value" position="right" formatter={(v:unknown)=>`${v}%`} style={{ fontSize:11,fill:"#475569" }} /></Bar>
          </BarChart>
        </Chart>
      </ChartCard>
    </div>
    <ChartCard title="Immigrants as a Share of the Population" subtitle="2010 and 2021 censuses · Percent of Ghana’s total population">
      <Chart mounted={mounted} height={220}>
        <BarChart data={immigrants} margin={{ top:24,right:25,left:0,bottom:5 }} barSize={80}>
          <CartesianGrid stroke="#E8EEF5" vertical={false} /><XAxis dataKey="year" tickLine={false} axisLine={false} /><YAxis domain={[0,2]} unit="%" tick={{ fontSize:11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={v=>[`${v}%`,"Immigrant population share"]} />
          <Bar dataKey="value" fill="#0891B2" radius={[6,6,0,0]} isAnimationActive={false}><LabelList dataKey="value" position="top" formatter={(v:unknown)=>`${Number(v).toFixed(1)}%`} style={{ fontSize:12,fill:"#0E7490",fontWeight:700 }} /></Bar>
        </BarChart>
      </Chart>
    </ChartCard>
  </section>;
}
