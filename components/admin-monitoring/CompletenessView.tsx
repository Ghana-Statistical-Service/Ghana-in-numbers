"use client";

import { useMemo } from "react";
import { CalendarCheck, Grid3x3 } from "lucide-react";
import { Card, ChartCard } from "@/components/ui/Card";
import { DataDisclosure, DataTable } from "@/components/ui/Data";
import { Grid } from "@/components/ui/Page";
import { IconTile } from "@/components/ui/Infographic";
import GhanaMap from "@/components/maps/GhanaMap";
import { Lead, SectionHead } from "@/components/mpi/parts";
import { int, ordinal, pct, statusOf, statusOrder, statuses, type District, type StatusId } from "@/lib/adminMonitoring";
import type { ViewProps } from "./AdminDashboard";
import { Meter, StatusKey, StatusPill } from "./parts";

const SOURCE = "GSS, MMDAs Administrative Data Quality Assessment; District Completion Factsheets";

export function useShapeOwner(all: District[]) {
  return useMemo(() => { const m = new Map<string, District>(); all.forEach(d => d.shapes.forEach(s => m.set(s, d))); return m; }, [all]);
}

function DistrictList({ title, hint, list, onOpen }: { title: string; hint: string; list: District[]; onOpen: (name: string) => void }) {
  return (
    <div>
      <h4 className="text-[13px] font-semibold text-ink">{title}</h4>
      <p className="mb-2 text-xs text-muted">{hint}</p>
      <ol className="space-y-0.5">
        {list.map(d => (
          <li key={d.name}>
            <button type="button" onClick={() => onOpen(d.name)} className="flex min-h-10 w-full items-center justify-between gap-3 rounded-md px-2 text-left text-[13px] hover:bg-brand-soft">
              <span className="min-w-0 truncate text-body">{d.name}<span className="block truncate text-xs text-subtle">{d.region}</span></span>
              <span className="tabular flex shrink-0 items-center gap-2 font-semibold text-ink"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: statuses[d.status].fill }} />{pct(d.comp)}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function CompletenessView({ all, scope, national, region, openDistrict }: ViewProps) {
  const owner = useShapeOwner(all);
  const n = scope.districts.length;
  const ranked = [...scope.districts].sort((a, b) => a.comp - b.comp || a.name.localeCompare(b.name));
  const lowest = ranked.slice(0, 11), highest = [...ranked].reverse().slice(0, 11);
  const areaRows = scope.areas.map((a, i) => {
    const counts: Record<StatusId, number> = { strong: 0, moderate: 0, low: 0 };
    scope.districts.forEach(d => { counts[statusOf(d.a[i][1])] += 1; });
    return { ...a, counts };
  }).sort((a, b) => b.completion - a.completion);
  const weakest = areaRows.at(-1)!;

  return (
    <div>
      <Lead kicker="Is anything missing?">
        Yes. {scope.name === "Ghana" ? "Across Ghana" : `In the ${region} Region`}, {pct(scope.pctExpected)} of the expected data points were received. On average a district has at least one value for {pct(scope.completion)} of the years in each thematic area.
      </Lead>

      <Grid cols={2}>
        <Card as="section" className="p-4 sm:p-5">
          <div className="flex items-center gap-3"><IconTile icon={Grid3x3} tone="purple" /><div><h3 className="text-[15px] font-semibold text-ink">Data points received</h3><p className="text-xs text-muted">Official term: % of expected records</p></div></div>
          <p className="tabular mt-4 text-[40px] font-extrabold leading-none tracking-tight text-ink">{pct(scope.pctExpected)}</p>
          <div className="mt-3"><Meter value={scope.pctExpected} color="#3C2FA3" height={12} /></div>
          <p className="mt-3 text-[13px] leading-relaxed text-body"><b className="font-semibold text-ink">{int(scope.rec)}</b> records were received out of <b className="font-semibold text-ink">{int(scope.exp)}</b> expected. Every cell of the reporting template counts, so this is the strictest measure.</p>
          {region && <p className="mt-2 text-xs text-subtle">Ghana: {pct(national.pctExpected)}</p>}
        </Card>
        <Card as="section" className="p-4 sm:p-5">
          <div className="flex items-center gap-3"><IconTile icon={CalendarCheck} tone="teal" /><div><h3 className="text-[15px] font-semibold text-ink">Years with data</h3><p className="text-xs text-muted">Official term: overall completion</p></div></div>
          <p className="mt-4 flex flex-wrap items-center gap-3"><span className="tabular text-[40px] font-extrabold leading-none tracking-tight text-ink">{pct(scope.completion)}</span><StatusPill status={statusOf(scope.completion)} /></p>
          <div className="mt-3"><Meter value={scope.completion} color={statuses[statusOf(scope.completion)].fill} marks height={12} /></div>
          <p className="mt-3 text-[13px] leading-relaxed text-body">For each thematic area, the share of the years 2015 to 2025 with at least one reported value, averaged over the 15 areas{n > 1 ? ` and over ${n} districts` : ""}. A year counts even if only one figure was sent for it.</p>
          {region && <p className="mt-2 text-xs text-subtle">Ghana: {pct(national.completion)}</p>}
        </Card>
      </Grid>

      <SectionHead step={1} title="Which districts are behind?" hint="Shaded by years with data" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-5">
        <ChartCard title="Map of overall completion" subtitle="Stronger colour = data for more of the years. Hover for figures, select a district to open its profile." period={`2015 to 2025${region ? ` · ${region} Region highlighted` : ""}`}
          notes="The scale runs from 0% to 100%. Six metropolitan areas are drawn as their sub-metros and carry the metropolitan figure. Every value is also in the Districts tab." source={SOURCE}>
          <GhanaMap level="districts" domain={[0, 100]} label="Years with data" format={pct} onSelect={openDistrict} showNames={false}
            resolve={shape => { const d = owner.get(shape); return d ? { key: d.name, name: d.name, value: d.comp, dimmed: !!region && d.region !== region, lines: [`${d.region} Region · ${statuses[d.status].label}`, `${pct(d.pctExpected)} of expected data points received`, `${ordinal(d.nationalRank)} of 261 districts`] } : undefined; }}
            ariaLabel={`Map of Ghana’s 261 districts shaded by overall completion. Lowest in view: ${lowest[0].name}, ${pct(lowest[0].comp)}. Highest: ${highest[0].name}, ${pct(highest[0].comp)}.`} />
        </ChartCard>
        <Card as="section" className="flex flex-col p-4 sm:p-5">
          <h3 className="text-[15px] font-semibold text-ink">{scope.byStatus.low} of {n} districts have data for fewer than half of the years</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">Overall completion{region ? ` in the ${region} Region` : ""}, 2015 to 2025. Select a district to see which areas and years are missing.</p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <DistrictList title="Where to follow up first" hint="Lowest overall completion" list={lowest} onOpen={openDistrict} />
            <DistrictList title="Most complete" hint="Highest overall completion" list={highest} onOpen={openDistrict} />
          </div>
          <p className="mt-auto pt-5 text-xs leading-relaxed text-subtle">Districts with the same score share a rank. Source: {SOURCE}.</p>
        </Card>
      </div>

      <SectionHead step={2} title="Which thematic areas are behind?" hint={`${weakest.area} is the least complete`} />
      <ChartCard title="How many districts are strong, moderate or low in each thematic area" subtitle={`Each bar is ${n} districts, split by their completion in that area`} period="2015 to 2025"
        notes="Read across a row: a long rose section means many districts have data for fewer than half of the years in that area. SDGs Budget is scored over 2019 to 2025." source={SOURCE}
        footer={<DataDisclosure hint="Exact figures"><DataTable caption={`Completion by thematic area, ${scope.name}`} headings={["Thematic area", "Average completion (%)", "Strong", "Moderate", "Low", "No data at all", "Records"]} rows={areaRows.map(a => [a.area, a.completion, a.counts.strong, a.counts.moderate, a.counts.low, a.noData, a.rec])} decimals={[undefined, 1, 0, 0, 0, 0, 0]} minWidth={640} unitNote="Strong, Moderate, Low and No data are numbers of districts. Districts with no data are included in Low." /></DataDisclosure>}>
        <StatusKey className="mb-4" />
        <ol className="space-y-1.5">
          {areaRows.map(a => (
            <li key={a.area} className="grid items-center gap-x-3 gap-y-1 text-[13px] sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_7.5rem]">
              <span className="min-w-0 font-medium text-ink">{a.area}</span>
              <span role="img" aria-label={`${a.area}: ${statusOrder.map(s => `${a.counts[s]} ${statuses[s].label.toLowerCase()}`).join(", ")}`} className="mpi-grow flex h-6 gap-[2px] overflow-hidden rounded-md">
                {statusOrder.filter(s => a.counts[s] > 0).map(s => <span key={s} className="flex min-w-0 items-center justify-center text-xs font-bold text-white" style={{ width: `${(a.counts[s] / n) * 100}%`, background: statuses[s].fill }}>{a.counts[s] / n >= 0.09 ? a.counts[s] : ""}</span>)}
              </span>
              <span className="tabular text-xs text-muted sm:text-right"><b className="text-[13px] font-semibold text-ink">{pct(a.completion)}</b> average</span>
            </li>
          ))}
        </ol>
      </ChartCard>
    </div>
  );
}
