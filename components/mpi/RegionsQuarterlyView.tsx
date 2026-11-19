"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Card, ChartCard } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Segmented } from "@/components/ui/Data";
import { Grid } from "@/components/ui/Page";
import GhanaMap, { rampColor } from "@/components/maps/GhanaMap";
import { dimensions, type MpiDistrictFile, type MpiViewId } from "@/data/mpiData";
import { nationalQuarterly, quarterlySources, regionDimensionsQ3, regionQuarters, regionsQuarterly as regions, type Quarter } from "@/data/mpiQuarterlyData";
import { BarList, CountUp, DimensionLegend, Lead, SectionHead, ShareBar, ordinal, pct, people } from "./parts";

type Measure = "incidence" | "people" | "intensity";
const measures: { value: Measure; label: string }[] = [
  { value: "incidence", label: "Share who are poor" },
  { value: "people", label: "Number of people" },
  { value: "intensity", label: "How deep" },
];
const measureText: Record<Measure, string> = {
  incidence: "% of the region’s population who are multidimensionally poor (incidence)",
  people: "Number of multidimensionally poor people",
  intensity: "Average share of weighted basic needs that poor people lack (intensity, %)",
};
const short: Record<Measure, string> = { incidence: "Multidimensionally poor", people: "People affected", intensity: "Intensity" };
/** Fixed scale ends per measure, covering every published quarter, so colours keep their meaning across quarters. */
const domains: Record<Measure, [number, number]> = { incidence: [0, 60], people: [0, 1_500_000], intensity: [38, 46] };
const fmt: Record<Measure, (v: number) => string> = { incidence: pct, people: v => people(Math.round(v)), intensity: pct };
const src = (ref: string) => `${quarterlySources.report} · ${ref}`;

export default function RegionsQuarterlyView({ region, openRegion: setRegionPlace, openDistrict, go }: { region: string | null; openRegion: (region: string | null, jump?: boolean) => void; openDistrict: (district: string | null, jump?: boolean) => void; go: (view: MpiViewId) => void }) {
  const openRegion = (name: string | null, jump?: boolean) => {
    setRegionPlace(name, jump);
    if (name) requestAnimationFrame(() => document.getElementById("mpi-profile")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const [quarter, setQuarter] = useState<Quarter>("2025 Q3");
  const [measure, setMeasure] = useState<Measure>("incidence");
  const [active, setActive] = useState<string | null>(null);
  const qi = regionQuarters.indexOf(quarter);
  const last = regionQuarters.length - 1;
  const national = nationalQuarterly.find(d => d.quarter === quarter)!;
  const sorted = [...regions].sort((a, b) => b[measure][qi] - a[measure][qi]);
  const [min, max] = domains[measure];
  const format = fmt[measure];

  const resolve = useCallback((shape: string) => {
    const r = regions.find(x => x.region === shape);
    if (!r) return undefined;
    const rank = sorted.findIndex(x => x.region === shape) + 1;
    return { key: r.region, name: r.region, value: r[measure][qi], lines: [`${ordinal(rank)} highest of 16 regions`, measure === "incidence" ? `People affected: ${people(r.people[qi])}` : `Share who are poor: ${pct(r.incidence[qi])}`] };
  }, [measure, qi, sorted]);

  const byIncidence = [...regions].sort((a, b) => b.incidence[last] - a.incidence[last]);
  const byPeople = [...regions].sort((a, b) => b.people[last] - a.people[last]);
  const hi = byIncidence[0], lo = byIncidence.at(-1)!;
  const strongerColour = measure === "people" ? "more people affected" : measure === "incidence" ? "a higher share of people who are multidimensionally poor" : "deeper poverty";
  const nationalValue = measure === "people" ? `${people(national.people!)} people` : measure === "incidence" ? pct(national.incidence) : pct(national.intensity!);

  return (
    <div>
      {!region && (
        <Lead kicker="Where?">
          Where a person lives matters. In 2025 Q3 the share of people who are multidimensionally poor ranged from {pct(lo.incidence[last])} in {lo.region} to {pct(hi.incidence[last])} in {hi.region}. The regions with the highest share are not always the ones with the most people affected.
        </Lead>
      )}

      {region && <div id="mpi-profile" className="mb-5 scroll-mt-28"><RegionProfile key={region} name={region} qi={qi} quarter={quarter} onClose={() => setRegionPlace(null, false)} openDistrict={openDistrict} go={go} /></div>}

      <ChartCard title="Map of Ghana" subtitle={<>Stronger colour = {strongerColour}. Hover for numbers, click a region to open its profile. {measureText[measure]}.</>} period={quarter}
        actions={<div className="flex flex-wrap gap-2">
          <Segmented label="Measure" size="sm" options={measures} value={measure} onChange={setMeasure} />
          <Segmented label="Quarter" size="sm" options={regionQuarters.map(q => ({ value: q, label: q }))} value={quarter} onChange={setQuarter} />
        </div>}
        notes="Survey estimates for the 16 regions. Margins of error are not published by region, so small differences between regions or quarters should not be read as real differences. 2025 Q1 is not published by region. The colour scale is fixed, so a colour means the same in every quarter."
        source={src("Tables 6.3 and 6.4, pp. 28 to 29")}
        footer={<DataDisclosure><DataTable caption={`Multidimensional poverty by region: ${measureText[measure]}`} headings={["Region", ...regionQuarters]} rows={[...regions.map(r => [r.region, ...r[measure]]), { cells: ["Ghana", ...regionQuarters.map(q => { const n = nationalQuarterly.find(d => d.quarter === q)!; return measure === "people" ? n.people : measure === "incidence" ? n.incidence : n.intensity; })], emphasis: "total" as const }]} decimals={measure === "people" ? 0 : 1} minWidth={620} /></DataDisclosure>}>
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(17rem,1fr)] xl:grid-cols-[minmax(0,460px)_minmax(17rem,1fr)] xl:gap-10">
          <GhanaMap level="regions" resolve={resolve} domain={domains[measure]} label={short[measure]} format={format} active={active} onActive={setActive} focusable selected={region} onSelect={name => openRegion(name === region ? null : name, false)}
            ariaLabel={`Map of Ghana’s 16 regions shaded by ${measureText[measure]}, ${quarter}. Highest: ${sorted[0].region}, ${format(sorted[0][measure][qi])}. Lowest: ${sorted.at(-1)!.region}, ${format(sorted.at(-1)![measure][qi])}.`} />
          <div className="min-w-0">
            <p className="mb-2 text-xs font-medium text-muted">Regions ranked, highest first · {quarter}</p>
            <ol className="space-y-[2px]">
              {sorted.map((r, i) => {
                const v = r[measure][qi], on = active === r.region;
                const rowTone = on ? "bg-[#FBF3D9]" : region === r.region ? "bg-brand-soft" : "";
                return (
                  <li key={r.region} onPointerEnter={() => setActive(r.region)} onPointerLeave={() => setActive(null)}>
                    <button type="button" aria-pressed={region === r.region} onClick={() => openRegion(region === r.region ? null : r.region, false)}
                      className={`grid w-full grid-cols-[1.25rem_7.25rem_minmax(2.5rem,1fr)_5rem] items-center gap-2 rounded-md px-1.5 py-1 text-left text-[13px] transition-colors ${rowTone}`}>
                      <span className="tabular text-right text-subtle">{i + 1}</span>
                      <span className={`truncate ${on ? "font-semibold text-ink" : "text-body"}`}>{r.region}</span>
                      <span className="relative h-2.5 rounded-full bg-[#EDEFF5]"><span aria-hidden="true" className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500" style={{ width: `${Math.max(2, ((v - min) / (max - min)) * 100)}%`, background: on ? "#C9A227" : rampColor(Math.max(0.35, (v - min) / (max - min))) }} /></span>
                      <span className="tabular text-right font-semibold text-ink">{format(v)}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 rounded-[var(--radius-md)] bg-brand-soft/60 px-3 py-2 text-[13px] text-body">Ghana, {quarter}: <b className="font-semibold text-ink">{nationalValue}</b></p>
            {measure === "intensity" && <p className="mt-2 text-xs text-muted">Intensity varies little between regions (the scale runs from {pct(min)} to {pct(max)}).</p>}
          </div>
        </div>
      </ChartCard>

      <SectionHead title="Two ways to see need" hint="The highest share is not always the most people" />
      <Grid cols={2}>
        <ChartCard className="mpi-lift" title="Highest share of people affected" subtitle="% of the region’s population who are multidimensionally poor (incidence)" period="2025 Q3"
          notes="A high share means poverty is widespread within the region."
          source={src("Table 6.3, p. 28")}>
          <BarList caption="Regions ranked by incidence, 2025 Q3" max={60} labelWidth="8rem" reference={{ value: nationalQuarterly.at(-1)!.incidence, label: `Ghana: ${pct(nationalQuarterly.at(-1)!.incidence)}` }}
            rows={byIncidence.map((r, i) => ({ label: r.region, value: r.incidence[last], emphasis: i < 5 }))} />
        </ChartCard>
        <ChartCard className="mpi-lift" title="Largest number of people affected" subtitle="Number of multidimensionally poor people" period="2025 Q3"
          notes={`Populous regions can have a low share but many people affected. ${byPeople[0].region} and ${byPeople[1].region} each have more than 800,000 multidimensionally poor people.`}
          source={src("Table 6.4, p. 29")}>
          <BarList caption="Regions ranked by number of multidimensionally poor people, 2025 Q3" max={1.2e6} labelWidth="8rem" format={v => people(v)}
            rows={byPeople.map((r, i) => ({ label: r.region, value: r.people[last], emphasis: i < 5 }))} />
        </ChartCard>
      </Grid>

      <SectionHead title="What is behind it, region by region" />
      <ChartCard title="What drives poverty differs by region" subtitle="% of each region’s MPI score that comes from each area of life (percentage contribution)" period="2025 Q3"
        notes="Each bar adds to 100. These are shares of the poverty score, not shares of people. In Greater Accra, employment makes up about a third of measured poverty; in Northern, Savannah, Oti and North East it is under 4%."
        source={src("Table 6.6, p. 34")}
        footer={<DataDisclosure><DataTable caption="Contribution of each dimension to regional MPI, 2025 Q3" headings={["Region", "Health", "Living conditions", "Education", "Employment"]} rows={byIncidence.map(r => { const d = regionDimensionsQ3[r.region]; return [r.region, d.health, d.living, d.education, d.employment]; })} decimals={1} minWidth={480} unitNote="% of the regional MPI. Regions are ordered by incidence, highest first." /></DataDisclosure>}>
        <DimensionLegend className="mb-4" />
        <ul className="space-y-1.5">
          {byIncidence.map(r => (
            <li key={r.region} className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] items-center gap-3 text-[13px] text-body">
              <span className="truncate">{r.region}</span>
              <ShareBar values={regionDimensionsQ3[r.region]} label={r.region} height={22} />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">Regions are ordered by incidence, highest first. Values are printed where they fit; all values are in the table below.</p>
      </ChartCard>
    </div>
  );
}

/** Everything published for one region in the quarterly series, and its districts from the separate annual series. */
function RegionProfile({ name, qi, quarter, onClose, openDistrict, go }: { name: string; qi: number; quarter: Quarter; onClose: () => void; openDistrict: (district: string | null, jump?: boolean) => void; go: (view: MpiViewId) => void }) {
  const [file, setFile] = useState<MpiDistrictFile | null>(null);
  useEffect(() => { let live = true; import("@/data/mpiDistricts.json").then(m => { if (live) setFile(m.default as MpiDistrictFile); }).catch(() => undefined); return () => { live = false; }; }, []);
  const r = regions.find(x => x.region === name);
  if (!r) return null;
  const rank = [...regions].sort((a, b) => b.incidence[qi] - a.incidence[qi]).findIndex(x => x.region === name) + 1;
  const max = Math.max(...r.incidence, 10);
  const dims = regionDimensionsQ3[name];
  const yi = file ? file.years.length - 1 : 0;
  const districts = (file?.districts ?? []).filter(d => d.region === name).sort((a, b) => b.headcount[yi] - a.headcount[yi]);
  return (
    <Card as="section" className="mpi-rise overflow-hidden">
      <div className="mpi-hero !rounded-none !px-5 !py-5 !shadow-none sm:!px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mpi-kicker text-white/80">Region profile · quarterly survey estimates</p>
            <h3 className="mt-1.5 text-[24px] font-bold leading-tight tracking-tight text-white">{name} Region</h3>
          </div>
          <button type="button" onClick={onClose} aria-label={`Close the profile of ${name} Region`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white"><X size={18} /></button>
        </div>
        <div className="mt-4 grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="flex items-baseline gap-1"><span className="mpi-gold text-[56px] font-extrabold leading-none tracking-tight"><CountUp value={r.incidence[qi]} format={v => v.toFixed(1)} /></span><span className="text-[24px] font-bold text-white/80">%</span></p>
            <p className="mt-1.5 text-[13px] text-white/85">multidimensionally poor in {quarter} · <b className="font-semibold text-white">{ordinal(rank)} highest</b> of 16 regions</p>
          </div>
          <ul className="grid grid-cols-3 gap-2.5">
            {[["People affected", people(r.people[qi])], ["How deep (intensity)", pct(r.intensity[qi])], ["MPI score", r.mpi[qi].toFixed(3)]].map(([k, v]) => (
              <li key={k} className="mpi-glass !px-3 !py-2.5"><p className="text-xs font-semibold text-white/75">{k}</p><p className="mt-0.5 text-[19px] font-extrabold leading-tight text-white">{v}</p></li>
            ))}
          </ul>
          <div role="img" aria-label={`Incidence in ${name}: ${regionQuarters.map((q, i) => `${q} ${pct(r.incidence[i])}`).join(", ")}`} className="flex h-28 items-end gap-1.5">
            {r.incidence.map((v, i) => (
              <div key={regionQuarters[i]} className="flex h-full w-12 flex-col items-center justify-end">
                <span className={`tabular text-xs ${i === qi ? "font-bold text-white" : "text-white/75"}`}>{v.toFixed(1)}</span>
                <span aria-hidden="true" className="mt-1 w-7 rounded-t-[5px]" style={{ height: `${(v / max) * 62}px`, background: i === qi ? "#F5C451" : "rgba(255,255,255,0.32)" }} />
                <span className={`mt-1 whitespace-nowrap text-xs ${i === qi ? "font-bold text-white" : "text-white/75"}`}>{regionQuarters[i].replace("20", "’")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-2">
        <div>
          <h4 className="text-[13px] font-semibold text-ink">Where measured poverty comes from, 2025 Q3</h4>
          <p className="mb-2 mt-0.5 text-xs text-muted">% of the region’s MPI score from each area of life (percentage contribution)</p>
          <ShareBar values={dims} label={`Contribution of each dimension to the MPI of ${name} Region, 2025 Q3`} height={32} />
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px] text-body">
            {dimensions.map(d => <li key={d.key} className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: d.color }} />{d.label}<span className="tabular ml-auto font-semibold text-ink">{pct(dims[d.key])}</span></li>)}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-subtle">Shares of the poverty score, not shares of people. Regional margins of error are not published. Source: {quarterlySources.report}, Tables 6.3, 6.4 and 6.6.</p>
        </div>
        <div>
          <h4 className="text-[13px] font-semibold text-ink">Districts in {name} Region{file ? `, ${file.years[yi]}` : ""}</h4>
          <p className="mb-2 mt-0.5 text-xs text-muted">% of each district’s population who are multidimensionally poor. Modelled annual estimates: a separate series, not comparable with the regional figure above.</p>
          {file ? (
            <ol className="max-h-[17rem] space-y-0.5 overflow-y-auto pr-1">
              {districts.map(d => (
                <li key={d.name}>
                  <button type="button" onClick={() => openDistrict(d.name)} className="grid min-h-9 w-full grid-cols-[minmax(0,1fr)_5rem_3.5rem] items-center gap-3 rounded-md px-2 text-left text-[13px] hover:bg-brand-soft">
                    <span className="truncate font-medium text-brand">{d.name}</span>
                    <span className="h-2 rounded-full bg-[#EDEFF5]"><span aria-hidden="true" className="block h-full rounded-full" style={{ width: `${(d.headcount[yi] / 70) * 100}%`, background: rampColor(Math.max(0.35, d.headcount[yi] / 70)) }} /></span>
                    <span className="tabular text-right font-semibold text-ink">{pct(d.headcount[yi])}</span>
                  </button>
                </li>
              ))}
            </ol>
          ) : <div className="h-40 animate-pulse rounded-[var(--radius-md)] bg-surface-muted" aria-busy="true" />}
          <button type="button" onClick={() => go("districts")} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-brand px-4 text-[13px] font-semibold text-white hover:bg-brand-hover">Open {districts.length || "the"} districts on the map<ArrowRight size={15} aria-hidden="true" /></button>
        </div>
      </div>
    </Card>
  );
}
