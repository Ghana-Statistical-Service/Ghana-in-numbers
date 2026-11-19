"use client";

import { useEffect, useState } from "react";
import { Building2, Layers, Trees, Users } from "lucide-react";
import { ChartCard } from "@/components/ui/Card";
import { DataDisclosure, DataTable } from "@/components/ui/Data";
import { Grid } from "@/components/ui/Page";
import { IconTile } from "@/components/ui/Infographic";
import { bandOf, deprivation2021, dimensionOf, dimensions, dimensions2021, incidenceBands, indicatorByStatsbank, indicators, mpiSources, national2021, type MpiDistrictFile } from "@/data/mpiData";
import { BarList, CountUp, DimensionLegend, SectionHead, ShareBar, Term, pct, people } from "./parts";

const census = (ref: string) => `${mpiSources.census} · ${ref}`;

/**
 * The annual series on the national picture: the 2021 census figures and the district estimates for 2021 to 2025.
 * Kept in its own block, under its own heading, so it is never read as part of the quarterly survey series above it.
 */
export default function AnnualSections({ openDistrict }: { openDistrict: (district: string | null, jump?: boolean) => void }) {
  const [file, setFile] = useState<MpiDistrictFile | null>(null);
  useEffect(() => { let live = true; import("@/data/mpiDistricts.json").then(m => { if (live) setFile(m.default as MpiDistrictFile); }).catch(() => undefined); return () => { live = false; }; }, []);

  const n = national2021;
  const last = file ? file.years.length - 1 : 4;
  const year = file?.years[last] ?? 2025;
  const ds = file?.districts ?? [];
  const byLatest = [...ds].sort((a, b) => b.headcount[last] - a.headcount[last]);
  const lower = ds.filter(d => d.headcount[last] < d.headcount[0]).length;
  const higher = ds.filter(d => d.headcount[last] > d.headcount[0]).length;
  const higher2022 = ds.filter(d => d.headcount[1] > d.headcount[0]).length;
  const bands = (file?.years ?? []).map((y, yi) => ({ year: y, counts: incidenceBands.map((_, b) => ds.filter(d => bandOf(d.headcount[yi]) === b).length) }));
  // The indicator with the largest published share of each district's MPI in the latest year.
  const leaders = new Map<string, number>();
  ds.forEach(d => { const row = d.contributions[last]; const top = file!.indicators[row.indexOf(Math.max(...row))]; leaders.set(top, (leaders.get(top) ?? 0) + 1); });
  const leaderRows = [...leaders.entries()].sort((a, b) => b[1] - a[1]);
  // Lowest and highest published share of each indicator across the districts (a range, never an average).
  const spread = (file?.indicators ?? []).map((name, k) => { const values = ds.map(d => d.contributions[last][k]); return { ind: indicatorByStatsbank[name], min: Math.min(...values), max: Math.max(...values) }; }).sort((a, b) => b.max - a.max);
  const lacking = indicators.map(i => ({ ...i, value: deprivation2021[i.key] })).sort((a, b) => b.value - a.value);

  return (
    <div>
      <SectionHead step={4} title="The annual series" hint="2021 census, and district estimates for every year to 2025" />
      <div className="mb-4 rounded-2xl border border-brand-line bg-[linear-gradient(160deg,#FBFAFF,#EEECFA)] p-4 sm:p-5 lg:mb-5">
        <p className="text-[13.5px] leading-relaxed text-body"><b className="font-semibold text-ink">A separate series from the quarterly figures above.</b> The 2021 Population and Housing Census counted every household; from it, estimates are made each year for all 261 districts. Do not compare these figures with the quarterly survey figures.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Users, k: <Term plain="Multidimensionally poor, 2021" official="incidence, H" />, v: pct(n.incidence), l: `${people(n.people)} people: ${people(n.sex.female.people)} female and ${people(n.sex.male.people)} male.` },
            { icon: Layers, k: <Term plain="How deep, 2021" official="intensity, A" />, v: pct(n.intensity), l: "The share of weighted basic needs that poor people lacked, on average." },
            { icon: Building2, k: `Districts, ${year}`, v: file ? `${pct(byLatest.at(-1)!.headcount[last])} to ${pct(byLatest[0].headcount[last])}` : "…", l: file ? `Lowest: ${byLatest.at(-1)!.name}. Highest: ${byLatest[0].name}. Modelled estimates.` : "Loading district estimates." },
          ].map((s, i) => (
            <li key={i} className="rounded-[var(--radius-lg)] border border-line bg-white p-4">
              <p className="flex items-center gap-2 text-[13px] font-medium text-body"><IconTile icon={s.icon} tone="purple" size="sm" /><span>{s.k}</span></p>
              <p className="mt-2 text-[28px] font-extrabold leading-tight tracking-tight text-ink"><CountUp value={0} format={() => s.v} /></p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{s.l}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-subtle">Source: {census("Figure 5.1, p. 11")}; {mpiSources.ranking}.</p>
      </div>

      <Grid cols="3-2">
        <ChartCard className="mpi-lift" title="Districts by share of people who are multidimensionally poor" subtitle="Number of districts in each band of incidence (% of the district’s population who are multidimensionally poor)" period={file ? `${file.years[0]} to ${year}` : "2021 to 2025"}
          notes="Each bar is all 261 districts. 2021 is the census; 2022 to 2025 are modelled small area estimates with no published margins of error, so read the overall shift, not single districts."
          source={mpiSources.ranking}
          footer={file && <DataDisclosure><DataTable caption="Number of districts by band of incidence and year" headings={["Year", ...incidenceBands.map(b => b.label)]} rows={bands.map(b => [String(b.year), ...b.counts])} decimals={0} minWidth={560} unitNote="Counts of the 261 districts, from the published district incidence." /></DataDisclosure>}>
          {file ? (
            <>
              <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-body">{incidenceBands.map(b => <li key={b.label} className="flex items-center gap-1.5"><span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: b.color }} />{b.label}</li>)}</ul>
              <ol className="space-y-2">
                {bands.map(b => (
                  <li key={b.year} className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-3">
                    <span className={`text-[13px] ${b.year === year ? "font-bold text-ink" : "text-body"}`}>{b.year}</span>
                    <div role="img" aria-label={`${b.year}: ${incidenceBands.map((band, i) => `${b.counts[i]} districts ${band.label.toLowerCase()}`).join(", ")}`} className="mpi-grow flex h-8 gap-[2px] overflow-hidden rounded-full">
                      {b.counts.map((c, i) => c > 0 && <span key={i} title={`${incidenceBands[i].label}: ${c} districts`} className={`flex min-w-0 items-center justify-center text-xs font-semibold ${i < 2 ? "text-[#1A1343]" : "text-white"}`} style={{ width: `${(c / 261) * 100}%`, background: incidenceBands[i].color }}>{c >= 12 ? c : ""}</span>)}
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 rounded-[var(--radius-md)] bg-brand-soft/60 px-3.5 py-3 text-[13px] leading-relaxed text-body">The published estimate for {year} is lower than the 2021 census figure in <b className="font-semibold text-ink">{lower} of 261 districts</b>{higher ? <> and higher in {higher}</> : null}. In 2022 the published estimate was higher than in 2021 in {higher2022} districts.</p>
            </>
          ) : <div className="h-64 animate-pulse rounded-[var(--radius-md)] bg-surface-muted" aria-busy="true" />}
        </ChartCard>
        <ChartCard className="mpi-lift" title={`Highest and lowest districts, ${year}`} subtitle="% of the district’s population who are multidimensionally poor (incidence)" period={`${year} · modelled estimates`}
          notes="Districts close together in value are not meaningfully different. Select a district to open its profile."
          source={mpiSources.ranking}>
          {file ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {[{ title: "Highest incidence", list: byLatest.slice(0, 6) }, { title: "Lowest incidence", list: byLatest.slice(-6).reverse() }].map(group => (
                <div key={group.title}>
                  <h4 className="mb-1.5 text-[13px] font-semibold text-ink">{group.title}</h4>
                  <ol className="space-y-0.5">
                    {group.list.map(d => (
                      <li key={d.name}><button type="button" onClick={() => openDistrict(d.name)} className="flex min-h-9 w-full items-center justify-between gap-3 rounded-md px-2 text-left text-[13px] hover:bg-brand-soft">
                        <span className="min-w-0 truncate font-medium text-brand">{d.name}<span className="block truncate text-xs font-normal text-subtle">{d.region}</span></span>
                        <span className="tabular font-semibold text-ink">{pct(d.headcount[last])}</span>
                      </button></li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          ) : <div className="h-64 animate-pulse rounded-[var(--radius-md)] bg-surface-muted" aria-busy="true" />}
        </ChartCard>
      </Grid>

      <Grid cols={2} className="mt-4 lg:mt-5">
        <ChartCard className="mpi-lift" title="Rural and urban areas in 2021" subtitle="% of people in each type of locality who were multidimensionally poor" period="2021 census"
          notes={`The gap was ${(n.locality.rural.incidence - n.locality.urban.incidence).toFixed(1)} percentage points. How deep poverty is (intensity) was about the same: ${pct(n.locality.rural.intensity)} rural and ${pct(n.locality.urban.intensity)} urban.`}
          source={census("Figure 5.2, p. 12")}>
          <div className="grid gap-3">
            {[{ icon: Trees, label: "Rural", value: n.locality.rural.incidence, tone: "teal" as const, glow: "#0E8A7E" }, { icon: Building2, label: "Urban", value: n.locality.urban.incidence, tone: "blue" as const, glow: "#2F6DB5" }].map(l => (
              <div key={l.label} className="mpi-glow rounded-[var(--radius-lg)] border border-line bg-surface-muted p-4" style={{ ["--glow" as string]: l.glow }}>
                <div className="flex items-center gap-2.5"><IconTile icon={l.icon} tone={l.tone} size="sm" /><p className="text-[13px] font-semibold text-ink">{l.label}</p></div>
                <p className="mt-3 text-[36px] font-extrabold leading-none tracking-tight text-ink"><CountUp value={l.value} format={pct} /></p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">of {l.label.toLowerCase()} residents were multidimensionally poor</p>
                <span className="mt-3 block h-2 rounded-full bg-white"><span aria-hidden="true" className="mpi-grow block h-full rounded-full" style={{ width: `${l.value}%`, background: l.glow }} /></span>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard className="mpi-lift" title="Where measured poverty came from in 2021" subtitle="% of the national MPI score that comes from each area of life (percentage contribution)" period="2021 census"
          notes="This is a share of the poverty score, not a share of people. The four shares add to 100."
          source={census("Figure 5.6, p. 16")}>
          <ShareBar values={dimensions2021} label="Contribution of each dimension to the national MPI, 2021" height={40} />
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {dimensions.map(d => (
              <li key={d.key} className="mpi-glow rounded-[var(--radius-md)] border border-line p-3.5" style={{ ["--glow" as string]: d.color }}>
                <p className="flex items-center gap-2 text-[13px] font-medium text-body"><span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: d.color }} />{d.label}</p>
                <p className="mt-1.5 text-[26px] font-extrabold leading-none tracking-tight text-ink"><CountUp value={dimensions2021[d.key]} format={pct} /></p>
              </li>
            ))}
          </ul>
        </ChartCard>

      </Grid>

      <Grid cols={2} className="mt-4 lg:mt-5">
        <ChartCard className="mpi-lift" title={`How much each basic need adds, across the districts, ${year}`} subtitle="Lowest and highest share of a district’s MPI score that comes from each indicator (percentage contribution)" period={`${year} · 261 districts · modelled estimates`}
          notes="Each bar runs from the district with the lowest share to the district with the highest. A share of the poverty score, not a share of people. Open a district to see its 13 shares."
          source={mpiSources.statsbank}
          footer={file && <DataDisclosure><DataTable caption={`Range of indicator contributions across districts, ${year}`} headings={["Indicator", "Dimension", "Lowest (%)", "Highest (%)", "Districts where it is the largest share"]} rows={spread.map(r => [r.ind.label, dimensionOf(r.ind.dimension).label, r.min, r.max, leaders.get(r.ind.statsbank) ?? 0])} decimals={[undefined, undefined, 1, 1, 0]} minWidth={620} /></DataDisclosure>}>
          {file ? (
            <>
              <DimensionLegend className="mb-3" />
              <ol className="space-y-1.5">
                {spread.map(r => (
                  <li key={r.ind.key} className="grid grid-cols-[minmax(0,8.5rem)_minmax(3rem,1fr)_7.5rem] items-center gap-3 text-[13px]">
                    <span className="text-body">{r.ind.label}<span className="sr-only"> ({dimensionOf(r.ind.dimension).label})</span></span>
                    <span role="img" aria-label={`${r.ind.label}: ${pct(r.min)} to ${pct(r.max)}`} className="relative h-2.5 rounded-full bg-[#EDEFF5]">
                      <span aria-hidden="true" className="mpi-grow absolute inset-y-0 rounded-full" style={{ left: `${(r.min / 50) * 100}%`, width: `${Math.max(1.5, ((r.max - r.min) / 50) * 100)}%`, background: dimensionOf(r.ind.dimension).color }} />
                    </span>
                    <span className="tabular text-right font-semibold text-ink">{r.min.toFixed(1)} to {r.max.toFixed(1)}%</span>
                  </li>
                ))}
              </ol>
              <p className="mt-2 text-xs text-muted">Scale: 0% to 50% of the district’s MPI score.</p>
              <p className="mt-3 rounded-[var(--radius-md)] bg-brand-soft/60 px-3.5 py-3 text-[13px] leading-relaxed text-body">In {year}, <b className="font-semibold text-ink">{indicatorByStatsbank[leaderRows[0][0]].label.toLowerCase()}</b> is the largest part of measured poverty in {leaderRows[0][1]} of 261 districts.</p>
            </>
          ) : <div className="h-40 animate-pulse rounded-[var(--radius-md)] bg-surface-muted" aria-busy="true" />}
        </ChartCard>
        <ChartCard className="mpi-lift" title="What households went without in 2021" subtitle="% of the household population deprived in each basic need, whether multidimensionally poor or not (uncensored headcount ratio)" period="2021 census"
          notes="This one is a share of people. In the 2021 census the second health indicator was mortality (a child under 5 or a pregnant mother died in the household); from 2022 it is child nutrition."
          source={census("Figure 5.8, p. 18")}
          footer={<DataDisclosure><DataTable caption="Deprivation in each indicator, 2021" headings={["Indicator", "Dimension", "Weight", "Deprived (%)"]} rows={lacking.map(i => [i.key === "nutrition" ? "Mortality" : i.label, dimensionOf(i.dimension).label, i.weight, i.value])} decimals={1} minWidth={460} /></DataDisclosure>}>
          <DimensionLegend className="mb-3" />
          <div>
            {[lacking].map((half, h) => (
              <BarList key={h} caption="Share of the household population deprived in each indicator, 2021" max={100}
                rows={half.map(i => ({ label: i.key === "nutrition" ? "Mortality" : i.label, value: i.value, color: dimensionOf(i.dimension).color, swatchLabel: dimensionOf(i.dimension).label }))} />
            ))}
          </div>
        </ChartCard>
      </Grid>
    </div>
  );
}
