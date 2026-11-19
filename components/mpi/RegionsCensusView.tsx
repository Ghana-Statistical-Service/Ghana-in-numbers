"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Card, ChartCard } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Segmented } from "@/components/ui/Data";
import { Grid } from "@/components/ui/Page";
import GhanaMap, { rampColor } from "@/components/maps/GhanaMap";
import { dimensions, mpiSources, national2021, regions, type MpiDistrictFile, type MpiViewId } from "@/data/mpiData";
import { BarList, Caveat, CountUp, DimensionLegend, Lead, SectionHead, ShareBar, ordinal, pct, people } from "./parts";

type Measure = "incidence" | "people";
const measures: { value: Measure; label: string }[] = [{ value: "incidence", label: "Share who are poor" }, { value: "people", label: "Number of people" }];
const measureText: Record<Measure, string> = {
  incidence: "% of the region’s household population who were multidimensionally poor (incidence)",
  people: "Number of multidimensionally poor people",
};
const domains: Record<Measure, [number, number]> = { incidence: [0, 60], people: [0, 1_000_000] };
const fmt: Record<Measure, (v: number) => string> = { incidence: pct, people: v => people(Math.round(v)) };
const census = (ref: string) => `${mpiSources.census} · ${ref}`;

export default function RegionsView({ region, openRegion: setRegionPlace, openDistrict, go }: { region: string | null; openRegion: (region: string | null, jump?: boolean) => void; openDistrict: (district: string | null, jump?: boolean) => void; go: (view: MpiViewId) => void }) {
  const openRegion = (name: string | null, jump?: boolean) => {
    setRegionPlace(name, jump);
    if (name) requestAnimationFrame(() => document.getElementById("mpi-profile")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const [measure, setMeasure] = useState<Measure>("incidence");
  const [active, setActive] = useState<string | null>(null);
  const sorted = [...regions].sort((a, b) => b[measure] - a[measure]);
  const [min, max] = domains[measure];
  const format = fmt[measure];
  const byIncidence = [...regions].sort((a, b) => b.incidence - a.incidence);
  const byPeople = [...regions].sort((a, b) => b.people - a.people);
  const hi = byIncidence[0], lo = byIncidence.at(-1)!;

  const resolve = useCallback((shape: string) => {
    const r = regions.find(x => x.region === shape);
    if (!r) return undefined;
    const rank = sorted.findIndex(x => x.region === shape) + 1;
    return { key: r.region, name: r.region, value: r[measure], lines: [`${ordinal(rank)} highest of 16 regions`, measure === "incidence" ? `People affected: ${people(r.people)}` : `Share who are poor: ${pct(r.incidence)}`] };
  }, [measure, sorted]);

  return (
    <div>
      {!region && (
        <Lead kicker="Where?">
          Where a person lives matters. In the 2021 census the share of people who were multidimensionally poor ranged from {pct(lo.incidence)} in {lo.region} to {pct(hi.incidence)} in {hi.region}.
        </Lead>
      )}

      {region && <div id="mpi-profile" className="mb-5 scroll-mt-28"><RegionProfile key={region} name={region} onClose={() => setRegionPlace(null, false)} openDistrict={openDistrict} go={go} /></div>}

      <div className="mb-5">
        <Caveat title="Regional figures are for 2021">
          Regional figures in the annual series are published from the 2021 Population and Housing Census. For 2022 to 2025 the figures are published district by district: open a region to see its districts year by year.
        </Caveat>
      </div>

      <ChartCard title="Map of Ghana" subtitle={<>Stronger colour = {measure === "people" ? "more people affected" : "a higher share of people who were multidimensionally poor"}. Hover for numbers, click a region to open its profile. {measureText[measure]}.</>} period="2021 census"
        actions={<Segmented label="Measure" size="sm" options={measures} value={measure} onChange={setMeasure} />}
        notes="Census figures for the 16 regions: a full count of the household population, not a sample."
        source={census("Table 7.1, p. 29")}
        footer={<DataDisclosure><DataTable caption="Multidimensional poverty by region, 2021" headings={["Region", "Household population", "Multidimensionally poor people", "Incidence (%)", "Urban (%)", "Rural (%)"]} rows={[...byIncidence.map(r => [r.region, r.population, r.people, r.incidence, r.urban, r.rural]), { cells: ["Ghana", national2021.householdPopulation, national2021.people, national2021.incidence, national2021.locality.urban.incidence, national2021.locality.rural.incidence], emphasis: "total" as const }]} decimals={[undefined, 0, 0, 1, 1, 1]} minWidth={680} /></DataDisclosure>}>
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(17rem,1fr)] xl:grid-cols-[minmax(0,460px)_minmax(17rem,1fr)] xl:gap-10">
          <GhanaMap level="regions" resolve={resolve} domain={domains[measure]} label={measure === "incidence" ? "Multidimensionally poor, 2021" : "People affected, 2021"} format={format} active={active} onActive={setActive} focusable selected={region} onSelect={name => openRegion(name === region ? null : name, false)}
            ariaLabel={`Map of Ghana’s 16 regions shaded by ${measureText[measure]}, 2021 census. Highest: ${sorted[0].region}, ${format(sorted[0][measure])}. Lowest: ${sorted.at(-1)!.region}, ${format(sorted.at(-1)![measure])}.`} />
          <div className="min-w-0">
            <p className="mb-2 text-xs font-medium text-muted">Regions ranked, highest first · 2021 census</p>
            <ol className="space-y-[2px]">
              {sorted.map((r, i) => {
                const v = r[measure], on = active === r.region;
                return (
                  <li key={r.region} onPointerEnter={() => setActive(r.region)} onPointerLeave={() => setActive(null)}>
                    <button type="button" aria-pressed={region === r.region} onClick={() => openRegion(region === r.region ? null : r.region, false)}
                      className={`grid w-full grid-cols-[1.25rem_7.25rem_minmax(2.5rem,1fr)_5rem] items-center gap-2 rounded-md px-1.5 py-1 text-left text-[13px] transition-colors ${on ? "bg-[#FBF3D9]" : region === r.region ? "bg-brand-soft" : ""}`}>
                      <span className="tabular text-right text-subtle">{i + 1}</span>
                      <span className={`truncate ${on ? "font-semibold text-ink" : "text-body"}`}>{r.region}</span>
                      <span className="relative h-2.5 rounded-full bg-[#EDEFF5]"><span aria-hidden="true" className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500" style={{ width: `${Math.max(2, ((v - min) / (max - min)) * 100)}%`, background: on ? "#C9A227" : rampColor(Math.max(0.35, (v - min) / (max - min))) }} /></span>
                      <span className="tabular text-right font-semibold text-ink">{format(v)}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 rounded-[var(--radius-md)] bg-brand-soft/60 px-3 py-2 text-[13px] text-body">Ghana, 2021: <b className="font-semibold text-ink">{measure === "people" ? `${people(national2021.people)} people` : pct(national2021.incidence)}</b></p>
          </div>
        </div>
      </ChartCard>

      <SectionHead title="Two ways to see need" hint="The highest share is not always the most people" />
      <Grid cols={2}>
        <ChartCard className="mpi-lift" title="Highest share of people affected" subtitle="% of the region’s household population who were multidimensionally poor (incidence)" period="2021 census"
          notes="A high share means poverty was widespread within the region."
          source={census("Figure 5.3, p. 13; Table 7.1, p. 29")}>
          <BarList caption="Regions ranked by incidence, 2021" max={60} labelWidth="8rem" reference={{ value: national2021.incidence, label: `Ghana: ${pct(national2021.incidence)}` }}
            rows={byIncidence.map((r, i) => ({ label: r.region, value: r.incidence, emphasis: i < 5 }))} />
        </ChartCard>
        <ChartCard className="mpi-lift" title="Largest number of people affected" subtitle="Number of multidimensionally poor people" period="2021 census"
          notes={`Populous regions can have a low share but many people affected. ${byPeople[0].region} had the most (${people(byPeople[0].people)}), followed by ${byPeople[1].region} (${people(byPeople[1].people)}).`}
          source={census("Figure 5.4, p. 14; Table 7.1, p. 29")}>
          <BarList caption="Regions ranked by number of multidimensionally poor people, 2021" max={1e6} labelWidth="8rem" format={v => people(v)}
            rows={byPeople.map((r, i) => ({ label: r.region, value: r.people, emphasis: i < 5 }))} />
        </ChartCard>
      </Grid>

      <SectionHead title="Inside each region" />
      <Grid cols={2}>
        <ChartCard title="Rural areas had the higher rate in every region" subtitle="% of people in urban and rural areas of each region who were multidimensionally poor" period="2021 census"
          notes="The slate dot is urban and the purple dot is rural; the line between them is the gap."
          source={census("Figure 5.5, p. 15")}
          footer={<DataDisclosure><DataTable caption="Incidence by region and type of locality, 2021" headings={["Region", "Urban (%)", "Rural (%)"]} rows={[...regions].sort((a, b) => b.rural - a.rural).map(r => [r.region, r.urban, r.rural])} decimals={1} minWidth={320} /></DataDisclosure>}>
          <ul className="mb-3 flex gap-4 text-[12.5px] text-body"><li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#6B7A90]" />Urban</li><li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-brand" />Rural</li></ul>
          <ol className="space-y-1.5">
            {[...regions].sort((a, b) => b.rural - a.rural).map(r => (
              <li key={r.region} className="grid grid-cols-[minmax(0,7rem)_2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-[13px]">
                <span className="truncate text-body">{r.region}</span>
                <span className="tabular text-right text-muted">{r.urban.toFixed(1)}</span>
                <span role="img" aria-label={`${r.region}: urban ${pct(r.urban)}, rural ${pct(r.rural)}`} className="relative h-3">
                  <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
                  <span aria-hidden="true" className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-line" style={{ left: `${(r.urban / 60) * 100}%`, width: `${((r.rural - r.urban) / 60) * 100}%` }} />
                  <span aria-hidden="true" className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#6B7A90]" style={{ left: `${(r.urban / 60) * 100}%` }} />
                  <span aria-hidden="true" className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand" style={{ left: `${(r.rural / 60) * 100}%` }} />
                </span>
                <span className="tabular font-semibold text-ink">{r.rural.toFixed(1)}</span>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-xs text-muted">Scale: 0% to 60%. Urban value on the left, rural on the right.</p>
        </ChartCard>

        <ChartCard title="What drove poverty differed by region" subtitle="% of each region’s MPI score that comes from each area of life (percentage contribution)" period="2021 census"
          notes="Each bar adds to 100 within rounding. These are shares of the poverty score, not shares of people."
          source={census("Figure 5.7, p. 17")}
          footer={<DataDisclosure><DataTable caption="Contribution of each dimension to regional MPI, 2021" headings={["Region", "Health", "Living conditions", "Education", "Employment"]} rows={byIncidence.map(r => [r.region, r.dims.health, r.dims.living, r.dims.education, r.dims.employment])} decimals={1} minWidth={480} unitNote="% of the regional MPI. Regions are ordered by incidence, highest first." /></DataDisclosure>}>
          <DimensionLegend className="mb-4" />
          <ul className="space-y-1.5">
            {byIncidence.map(r => (
              <li key={r.region} className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] items-center gap-3 text-[13px] text-body">
                <span className="truncate">{r.region}</span>
                <ShareBar values={r.dims} label={r.region} height={22} />
              </li>
            ))}
          </ul>
        </ChartCard>
      </Grid>
    </div>
  );
}

/** Everything published for one region: its 2021 census figures, and its districts for every year of the annual series. */
function RegionProfile({ name, onClose, openDistrict, go }: { name: string; onClose: () => void; openDistrict: (district: string | null, jump?: boolean) => void; go: (view: MpiViewId) => void }) {
  const [file, setFile] = useState<MpiDistrictFile | null>(null);
  const [yi, setYi] = useState(4);
  useEffect(() => { let live = true; import("@/data/mpiDistricts.json").then(m => { if (live) setFile(m.default as MpiDistrictFile); }).catch(() => undefined); return () => { live = false; }; }, []);
  const r = regions.find(x => x.region === name);
  if (!r) return null;
  const rank = [...regions].sort((a, b) => b.incidence - a.incidence).findIndex(x => x.region === name) + 1;
  const districts = (file?.districts ?? []).filter(d => d.region === name).sort((a, b) => b.headcount[yi] - a.headcount[yi]);
  return (
    <Card as="section" className="mpi-rise overflow-hidden">
      <div className="mpi-hero !rounded-none !px-5 !py-5 !shadow-none sm:!px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mpi-kicker text-white/80">Region profile · 2021 census</p>
            <h3 className="mt-1.5 text-[24px] font-bold leading-tight tracking-tight text-white">{name} Region</h3>
          </div>
          <button type="button" onClick={onClose} aria-label={`Close the profile of ${name} Region`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white"><X size={18} /></button>
        </div>
        <div className="mt-4 grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="flex items-baseline gap-1"><span className="mpi-gold text-[56px] font-extrabold leading-none tracking-tight"><CountUp value={r.incidence} format={v => v.toFixed(1)} /></span><span className="text-[24px] font-bold text-white/80">%</span></p>
            <p className="mt-1.5 text-[13px] text-white/85">multidimensionally poor in 2021 · <b className="font-semibold text-white">{ordinal(rank)} highest</b> of 16 regions</p>
          </div>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[["People affected", people(r.people)], ["Household population", people(r.population)], ["Rural areas", pct(r.rural)], ["Urban areas", pct(r.urban)]].map(([k, v]) => (
              <li key={k} className="mpi-glass !px-3 !py-2.5"><p className="text-xs font-semibold text-white/75">{k}</p><p className="mt-0.5 text-[19px] font-extrabold leading-tight text-white">{v}</p></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-2">
        <div>
          <h4 className="text-[13px] font-semibold text-ink">Where measured poverty came from, 2021</h4>
          <p className="mb-2 mt-0.5 text-xs text-muted">% of the region’s MPI score from each area of life (percentage contribution)</p>
          <ShareBar values={r.dims} label={`Contribution of each dimension to the MPI of ${name} Region, 2021`} height={32} />
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px] text-body">
            {dimensions.map(d => <li key={d.key} className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: d.color }} />{d.label}<span className="tabular ml-auto font-semibold text-ink">{pct(r.dims[d.key])}</span></li>)}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-subtle">Shares of the poverty score, not shares of people. Source: {mpiSources.census}, Table 7.1 and Figures 5.5 and 5.7.</p>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-[13px] font-semibold text-ink">Districts in {name} Region{file ? `, ${file.years[yi]}` : ""}</h4>
            {file && <Segmented label="Year" size="sm" options={file.years.map((y, i) => ({ value: String(i), label: String(y) }))} value={String(yi)} onChange={v => setYi(Number(v))} />}
          </div>
          <p className="mb-2 mt-1 text-xs text-muted">% of each district’s population who are multidimensionally poor. 2021 is the census; later years are modelled estimates.</p>
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
