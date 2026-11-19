"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, MapPin, Search, X } from "lucide-react";
import { Card, ChartCard, Qualifier } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Segmented } from "@/components/ui/Data";
import GhanaMap, { rampColor } from "@/components/maps/GhanaMap";
import { dimensions, fileUrl, indicatorByStatsbank, mpiSources, type DimensionKey, type MpiDistrict, type MpiDistrictFile } from "@/data/mpiData";
import { BarList, Caveat, CountUp, Lead, ShareBar, SourceLink, ordinal, pct } from "./parts";

const PAGE = 15;
const swatch = (v: number) => rampColor(v / 70);

/** Indicator shares added up into their dimension (a sum of published values; guidelines §1.2). */
function dimensionShares(file: MpiDistrictFile, row: number[]): Record<DimensionKey, number> {
  const out: Record<DimensionKey, number> = { health: 0, living: 0, education: 0, employment: 0 };
  file.indicators.forEach((name, i) => { out[indicatorByStatsbank[name].dimension] += row[i]; });
  (Object.keys(out) as DimensionKey[]).forEach(k => { out[k] = Math.round(out[k] * 10) / 10; });
  return out;
}

export default function DistrictsView({ region: regionProp, district, setRegion: setRegionProp, openDistrict }: { region: string | null; district: string | null; setRegion: (region: string | null) => void; openDistrict: (district: string | null, jump?: boolean) => void }) {
  const [file, setFile] = useState<MpiDistrictFile | null>(null);
  const [failed, setFailed] = useState(false);
  const [yi, setYi] = useState(4);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  // The selected place is owned by the dashboard so that every tab and the address agree.
  const selected = district;
  const region = regionProp ?? "All regions";
  const setRegion = (value: string) => setRegionProp(value === "All regions" ? null : value);

  useEffect(() => {
    let live = true;
    import("@/data/mpiDistricts.json").then(m => { if (live) setFile(m.default as MpiDistrictFile); }).catch(() => live && setFailed(true));
    return () => { live = false; };
  }, []);

  const byName = useMemo(() => new Map((file?.districts ?? []).map(d => [d.name, d])), [file]);
  const shapeOwner = useMemo(() => {
    const m = new Map<string, string>();
    file?.districts.forEach(d => (d.shapes ?? [d.name]).forEach(s => m.set(s, d.name)));
    return m;
  }, [file]);

  if (failed) return <Caveat title="District data could not be loaded">Reload the page, or use the StatsBank table and the district fact sheets on statsghana.gov.gh.</Caveat>;
  if (!file) return <div className="h-96 animate-pulse rounded-[var(--radius-lg)] bg-surface-muted" aria-busy="true" aria-label="Loading district estimates" />;

  const year = file.years[yi];
  const regionNames = [...new Set(file.districts.map(d => d.region))].sort();
  const inRegion = (d: MpiDistrict) => region === "All regions" || d.region === region;
  const ranked = [...file.districts].sort((a, b) => a.rank[yi] - b.rank[yi]);
  const scope = ranked.filter(inRegion);
  const q = query.trim().toLowerCase();
  const tableRows = scope.filter(d => !q || d.name.toLowerCase().includes(q));
  const visible = showAll || q ? tableRows : tableRows.slice(0, PAGE);
  const hi = scope[0], lo = scope.at(-1)!;
  const sel = selected ? byName.get(selected) ?? null : null;
  const select = (name: string | null, scroll = false) => {
    openDistrict(name, false);
    if (name && scroll) requestAnimationFrame(() => profileRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };
  return (
    <div>
      {!sel && (
        <Lead kicker="Which districts?">
          All 261 districts have their own estimate. In {year}, the share of people who are multidimensionally poor ranged from {pct(ranked.at(-1)!.headcount[yi])} in {ranked.at(-1)!.name} to {pct(ranked[0].headcount[yi])} in {ranked[0].name}.
        </Lead>
      )}

      <div ref={profileRef} className="scroll-mt-28">{sel && <div className="mb-5"><DistrictProfile file={file} district={sel} yi={yi} onClose={() => select(null)} /></div>}</div>

      <div className="mb-5">
        <Caveat title="Read district figures as estimates, not exact counts">
          The 2021 figures come from the Population and Housing Census. Figures for 2022 to 2025 are modelled (small area estimation) by combining the census with the 2022 to 2024 Annual Household Income and Expenditure Survey and the 2025 Quarterly Labour Force Survey. No margins of error are published, so districts with similar values should be treated as similar, whatever their rank. This annual district series is separate from the quarterly survey series on the other tabs and the two should not be compared.
        </Caveat>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-x-4 gap-y-3">
        <div>
          <p className="mb-1 text-xs font-medium text-muted">Year</p>
          <Segmented label="Year" options={file.years.map((y, i) => ({ value: String(i), label: String(y) }))} value={String(yi)} onChange={v => setYi(Number(v))} />
        </div>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Region</span>
          <select value={region} onChange={e => { setRegion(e.target.value); setShowAll(false); }} className="h-10 rounded-[var(--radius-md)] border border-line-strong bg-surface px-3 text-[13px] font-medium text-body">
            {["All regions", ...regionNames].map(r => <option key={r}>{r}</option>)}
          </select>
        </label>
        <label className="block min-w-[15rem] flex-1 sm:max-w-sm">
          <span className="mb-1 block text-xs font-medium text-muted">Find a district</span>
          <span className="relative block">
            <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
            <input list="mpi-districts" value={query} placeholder="Type a district name"
              onChange={e => { const v = e.target.value; setQuery(v); if (byName.has(v)) select(v); }}
              className="h-10 w-full rounded-[var(--radius-md)] border border-line-strong bg-surface pl-9 pr-9 text-[13px] text-ink placeholder:text-subtle" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear district search" className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface-muted"><X size={15} /></button>}
          </span>
          <datalist id="mpi-districts">{file.districts.map(d => <option key={d.name} value={d.name} />)}</datalist>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-5">
        <ChartCard title="Map of Ghana’s districts" subtitle="Stronger colour = a higher share of people who are multidimensionally poor (incidence). Hover for numbers, click a district to open its profile." period={`${year}${region === "All regions" ? "" : ` · ${region} highlighted`}`} qualifier={<Qualifier tone="caution">Modelled estimate</Qualifier>}
          notes="The colour scale is fixed from 0% to 70%, so a colour means the same in every year. Keyboard users can open a district from the search box or the table. Six metropolitan areas are drawn as their sub-metros and carry the metropolitan estimate. Every value is also in the table below."
          source={mpiSources.ranking}>
          <GhanaMap level="districts" domain={[0, 70]} label={`Multidimensionally poor, ${year}`} format={pct} selected={selected} onSelect={name => select(name, true)} showNames={false}
            resolve={shape => { const d = byName.get(shapeOwner.get(shape) ?? ""); return d ? { key: d.name, name: d.name, value: d.headcount[yi], dimmed: !inRegion(d) && d.name !== selected, lines: [`${d.region} Region`, `${ordinal(d.rank[yi])} highest of 261 districts`] } : undefined; }}
            ariaLabel={`Map of Ghana’s 261 districts shaded by multidimensional poverty incidence in ${year}. Highest: ${ranked[0].name}, ${pct(ranked[0].headcount[yi])}. Lowest: ${ranked.at(-1)!.name}, ${pct(ranked.at(-1)!.headcount[yi])}.`} />
        </ChartCard>

        <div className="min-w-0">
            <Card as="section" className="flex h-full flex-col p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-[15px] font-semibold text-ink"><MapPin size={16} aria-hidden="true" className="text-brand" />{sel ? "Compare with other districts" : "Choose a district to see its profile"}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">Select a district on the map, in the search box or in the table{sel ? " to switch profile" : ""}. {region === "All regions" ? "Across Ghana" : `In ${region} (${scope.length} districts)`}, incidence in {year} ranged from {pct(lo.headcount[yi])} ({lo.name}) to {pct(hi.headcount[yi])} ({hi.name}).</p>
              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                {[{ title: "Highest incidence", list: scope.slice(0, 10) }, { title: "Lowest incidence", list: scope.slice(-10).reverse() }].map(group => (
                  <div key={group.title}>
                    <h4 className="mb-2 text-[13px] font-semibold text-ink">{group.title}, {year}</h4>
                    <ol className="space-y-1">
                      {group.list.map(d => (
                        <li key={d.name}>
                          <button type="button" onClick={() => select(d.name)} className="flex min-h-9 w-full items-center justify-between gap-3 rounded-md px-2 text-left text-[13px] hover:bg-brand-soft">
                            <span className="min-w-0 truncate text-body">{d.name}<span className="block truncate text-xs text-subtle">{d.region}</span></span>
                            <span className="tabular font-semibold text-ink">{pct(d.headcount[yi])}</span>
                          </button>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
              <p className="mt-auto pt-5 text-xs leading-relaxed text-subtle">Districts close together in value are not meaningfully different. Source: {mpiSources.ranking}.</p>
            </Card>
        </div>
      </div>

      <Card as="section" className="mt-4 p-4 sm:p-5 lg:mt-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold text-ink">All districts{region === "All regions" ? "" : ` in ${region}`}, ranked for {year}</h3>
            <p className="mt-1 text-[13px] text-muted">% of the district’s population who are multidimensionally poor (incidence). Rank 1 is the highest incidence of the 261 districts.</p>
          </div>
          <p className="text-xs text-subtle" aria-live="polite">Showing {visible.length} of {tableRows.length} districts</p>
        </div>
        <div role="region" aria-label="District ranking table" tabIndex={0} className="scroll-hint mt-4 overflow-x-auto rounded-[var(--radius-sm)] border border-line">
          <table className="w-full min-w-[680px] border-collapse text-[13px]">
            <thead className="bg-surface-muted text-muted">
              <tr>
                <th scope="col" className="px-3 py-2.5 text-right font-semibold">Rank {year}</th>
                <th scope="col" className="px-3 py-2.5 text-left font-semibold">District</th>
                <th scope="col" className="px-3 py-2.5 text-left font-semibold">Region</th>
                {file.years.map((y, i) => <th key={y} scope="col" aria-sort={i === yi ? "descending" : undefined} className={`px-3 py-2.5 text-right font-semibold ${i === yi ? "text-brand" : ""}`}>{y}</th>)}
              </tr>
            </thead>
            <tbody>
              {visible.map(d => (
                <tr key={d.name} className={`border-t border-line ${d.name === selected ? "bg-brand-soft/70" : "hover:bg-surface-muted/60"}`}>
                  <td className="tabular px-3 py-2 text-right text-muted">{d.rank[yi]}</td>
                  <th scope="row" className="px-3 py-1 text-left font-normal">
                    <button type="button" onClick={() => select(d.name, true)} aria-pressed={d.name === selected} className="min-h-8 rounded text-left font-medium text-brand underline-offset-2 hover:underline">{d.name}</button>
                  </th>
                  <td className="px-3 py-2 text-body">{d.region}</td>
                  {d.headcount.map((v, i) => (
                    <td key={i} className={`tabular whitespace-nowrap px-3 py-2 text-right ${i === yi ? "font-semibold text-ink" : "text-body"}`}>
                      {i === yi && <span aria-hidden="true" className="mr-2 inline-block h-2.5 w-2.5 rounded-[2px] align-middle ring-1 ring-inset ring-black/10" style={{ background: swatch(v) }} />}{v.toFixed(1)}%
                    </td>
                  ))}
                </tr>
              ))}
              {!visible.length && <tr><td colSpan={8} className="px-3 py-6 text-center text-muted">No district matches “{query}”.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          {!q && tableRows.length > PAGE ? <button type="button" onClick={() => setShowAll(v => !v)} className="min-h-9 rounded-full border border-line bg-surface px-4 text-[13px] font-semibold text-brand hover:bg-brand-soft">{showAll ? `Show the first ${PAGE}` : `Show all ${tableRows.length} districts`}</button> : <span />}
          <p className="text-xs text-subtle">Source: {mpiSources.ranking}. Names follow GSS StatsBank.</p>
        </div>
      </Card>

      <div className="mt-5 flex flex-wrap gap-2">
        <SourceLink href={fileUrl(mpiSources.rankingKey)}>District rankings, 2021 to 2025 (PDF)</SourceLink>
        <SourceLink href={mpiSources.statsbankUrl}>District indicator table on StatsBank</SourceLink>
        <SourceLink href={`${mpiSources.reportsUrl}?q=District+Multidimensional`}>All 261 district fact sheets</SourceLink>
      </div>
    </div>
  );
}

function DistrictProfile({ file, district: d, yi, onClose }: { file: MpiDistrictFile; district: MpiDistrict; yi: number; onClose: () => void }) {
  const year = file.years[yi];
  const max = Math.max(...d.headcount, 10);
  const shares = dimensionShares(file, d.contributions[yi]);
  const rows = file.indicators.map((name, i) => ({ ind: indicatorByStatsbank[name], value: d.contributions[yi][i] })).sort((a, b) => b.value - a.value);
  const top = rows.slice(0, 2);
  return (
    <Card as="section" className="mpi-rise flex h-full flex-col overflow-hidden">
      <div className="mpi-hero !rounded-none !px-5 !py-5 !shadow-none">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mpi-kicker text-white/80">District profile · {d.region} Region</p>
            <h3 className="mt-1.5 text-[22px] font-bold leading-tight tracking-tight text-white">{d.name}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label={`Close the profile of ${d.name}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white"><X size={18} /></button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end">
          <div>
            <p className="flex items-baseline gap-1"><span className="mpi-gold text-[52px] font-extrabold leading-none tracking-tight"><CountUp value={d.headcount[yi]} format={v => v.toFixed(1)} /></span><span className="text-[24px] font-bold text-white/80">%</span></p>
            <p className="mt-1.5 text-[13px] text-white/85">multidimensionally poor in {year} · <b className="font-semibold text-white">{ordinal(d.rank[yi])} highest</b> of 261</p>
            <p className="mt-2 inline-flex rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold text-white">{yi === 0 ? "2021 census" : "Modelled estimate"}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/80">2021 census: <b className="font-semibold text-white">{d.census2021.poor.toLocaleString("en-GB")}</b> multidimensionally poor people of {d.census2021.population.toLocaleString("en-GB")} in households.</p>
          </div>
          <div role="img" aria-label={`Incidence in ${d.name}: ${file.years.map((y, i) => `${y} ${pct(d.headcount[i])}`).join(", ")}`} className="flex h-28 items-end gap-2 sm:justify-end">
            {d.headcount.map((v, i) => (
              <div key={i} className="flex h-full w-12 flex-col items-center justify-end">
                <span className={`tabular text-xs ${i === yi ? "font-bold text-white" : "text-white/75"}`}>{v.toFixed(1)}</span>
                <span aria-hidden="true" className="mt-1 w-7 origin-bottom rounded-t-[5px]" style={{ height: `${(v / max) * 68}px`, background: i === yi ? "#F5C451" : "rgba(255,255,255,0.32)" }} />
                <span className={`mt-1 text-xs ${i === yi ? "font-bold text-white" : "text-white/75"}`}>{file.years[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
      <div className="grid gap-x-8 gap-y-5 lg:grid-cols-2">
      <div>
      <h4 className="text-[13px] font-semibold text-ink">Where measured poverty comes from, {year}</h4>
      <p className="mb-2 mt-0.5 text-xs text-muted">% of the district’s MPI score from each area of life (indicator shares added up)</p>
      <ShareBar values={shares} label={`Contribution of each dimension to the MPI of ${d.name}, ${year}`} />
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-body">
        {dimensions.map(dim => <li key={dim.key} className="flex items-center gap-1.5"><span aria-hidden="true" className="h-3 w-3 rounded-[3px]" style={{ background: dim.color }} />{dim.label} <span className="tabular font-semibold text-ink">{pct(shares[dim.key])}</span></li>)}
      </ul>

      <p className="mt-4 rounded-[var(--radius-md)] bg-brand-soft/60 px-3.5 py-3 text-[13px] leading-relaxed text-body">
        In {year}, the largest parts of measured poverty in {d.name} came from <strong className="font-semibold text-ink">{top[0].ind.label.toLowerCase()}</strong> ({pct(top[0].value)}) and <strong className="font-semibold text-ink">{top[1].ind.label.toLowerCase()}</strong> ({pct(top[1].value)}). These are shares of the poverty score, not shares of people.
      </p>
      {yi === 0 && <p className="mt-2 rounded-[var(--radius-sm)] bg-caution-bg px-3 py-2 text-xs leading-relaxed text-caution">In 2021 the health indicator shown as “Nutrition” was child mortality, measured in the census. Nutrition is used from 2022. Do not compare 2021 indicator shares with later years.</p>}

      </div>
      <div>
      <h4 className="mb-2 text-[13px] font-semibold text-ink">The 13 basic needs, {year}</h4>
      <BarList caption={`Contribution of each indicator to the MPI of ${d.name}, ${year}`} max={60} labelWidth="8.5rem"
        rows={rows.map(r => ({ label: r.ind.label, value: r.value, color: dimensions.find(x => x.key === r.ind.dimension)!.color, swatchLabel: dimensions.find(x => x.key === r.ind.dimension)!.label }))} />
      </div>
      </div>
      <div className="mt-auto pt-5">
        <DataDisclosure label="View data for all five years">
          <DataTable caption={`${d.name}: incidence, rank and indicator contributions`} headings={["Measure", ...file.years.map(String)]} decimals={1} minWidth={460}
            rows={[
              { cells: ["Incidence (%)", ...d.headcount], emphasis: "subtotal" as const },
              ["Rank of 261 (1 = highest incidence)", ...d.rank.map(String)],
              ["Multidimensionally poor people (census)", d.census2021.poor.toLocaleString("en-GB"), "", "", "", ""],
              ["Household population (census)", d.census2021.population.toLocaleString("en-GB"), "", "", "", ""],
              ...file.indicators.map((name, i) => [`${indicatorByStatsbank[name].label}, share of MPI (%)`, ...d.contributions.map(y => y[i])]),
            ]}
            unitNote="2021: the Nutrition row is child mortality. Indicator shares add to 100 within rounding." />
        </DataDisclosure>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a href={fileUrl(d.factsheet)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-brand px-4 text-[13px] font-semibold text-white hover:bg-brand-hover">
            <FileText size={15} aria-hidden="true" />Official fact sheet (PDF)<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <p className="min-w-[12rem] flex-1 text-xs leading-relaxed text-subtle">The fact sheet adds the number of poor people for every year, intensity and the share of people lacking each need. Sources: {mpiSources.ranking}; {mpiSources.statsbank}; {mpiSources.census}, Table 7.18.</p>
        </div>
      </div>
      </div>
    </Card>
  );
}
