"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import { Card, ChartCard, Callout } from "@/components/ui/Card";
import { DataDisclosure, DataTable } from "@/components/ui/Data";
import { Grid } from "@/components/ui/Page";
import { Caveat, CountUp, Lead, SectionHead } from "@/components/mpi/parts";
import { districtScope, factsheetSentence, int, longDate, ordinal, pct, rate, rateOf, share, type AdminDetail, type AdminFile, type District, type Scope } from "@/lib/adminMonitoring";
import type { ViewProps } from "./AdminDashboard";
import { FourChecks } from "./OverviewView";
import { CompletionCell, DistrictLink, SortTable, StatusPill, Trend, type Column } from "./parts";

const SOURCE = "GSS, District Completion Factsheets; MMDAs Administrative Data Quality Assessment";

export default function DistrictsView({ file, scope, national, region, openDistrict, district, closeDistrict }: ViewProps & { district: string | null; closeDistrict: () => void }) {
  const [query, setQuery] = useState("");
  const selected = district ? national.districts.find(d => d.name === district) ?? null : null;
  if (selected) return <Profile file={file} district={selected} national={national} onBack={closeDistrict} />;

  const q = query.trim().toLowerCase();
  const rows = scope.districts.filter(d => !q || d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q));
  const columns: Column<District>[] = [
    { key: "rank", label: "Rank", align: "right", sort: d => d.nationalRank, render: d => d.nationalRank },
    { key: "name", label: "District", header: true, sort: d => d.name, render: d => <DistrictLink name={d.name} onOpen={openDistrict} /> },
    ...(region ? [] : [{ key: "region", label: "Region", sort: (d: District) => d.region, render: (d: District) => d.region }]),
    { key: "status", label: "Status", render: d => <StatusPill status={d.status} /> },
    { key: "comp", label: "Years with data", sort: d => d.comp, render: d => <CompletionCell value={d.comp} /> },
    { key: "pct", label: "Points received", align: "right", sort: d => d.pctExpected, render: d => pct(d.pctExpected) },
    { key: "rep", label: "Repeats", align: "right", sort: d => rateOf(d, "repeats"), render: d => rate(rateOf(d, "repeats")) },
    { key: "inv", label: "Fail a rule", align: "right", sort: d => rateOf(d, "invalid"), render: d => rate(rateOf(d, "invalid")) },
    { key: "out", label: "Unusual", align: "right", sort: d => rateOf(d, "outliers"), render: d => rate(rateOf(d, "outliers")) },
    { key: "last", label: "Last sent", align: "right", sort: d => d.last, render: d => d.last ? longDate(d.last) : "Not recorded", hideBelow: "lg" },
  ];

  return (
    <div>
      <Lead kicker="How is my district doing?">
        {region ? `The ${region} Region has ${scope.districts.length} districts.` : "All 261 districts are listed here."} Select a district to open its profile: what it has reported, what is missing and what needs checking.
      </Lead>
      <Card as="section" className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            <h3 className="text-[15px] font-semibold text-ink">{region ? `Districts in the ${region} Region` : "All districts"}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">Rank 1 is the highest overall completion of the 261 districts. Points received is the share of expected data points received. Repeats, Fail a rule and Unusual are shares of the district’s own records. Select a column heading to sort.</p>
          </div>
          <label className="relative block w-full sm:w-72">
            <span className="sr-only">Filter the table by district or region name</span>
            <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter by name" className="h-10 w-full rounded-[var(--radius-md)] border border-line-strong bg-surface pl-9 pr-9 text-[13px] text-ink placeholder:text-subtle" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear the filter" className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-surface-muted"><X size={15} /></button>}
          </label>
        </div>
        <SortTable columns={columns} rows={rows} rowKey={d => d.name} caption="Districts with completeness and quality checks" initial={{ key: "comp", dir: -1 }} pageSize={20} minWidth={region ? 900 : 1000} empty={`No district matches “${query}”.`} />
        <p className="mt-3 text-xs text-subtle">Source: {SOURCE}. Data compiled {longDate(file.compiled)}.</p>
      </Card>
    </div>
  );
}

type CellState = "data" | "missing" | "na";

function Profile({ file, district: d, national, onBack }: { file: AdminFile; district: District; national: Scope; onBack: () => void }) {
  const [detail, setDetail] = useState<AdminDetail | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    import("@/data/adminMonitoringDetail.json").then(m => { if (live) setDetail(m.default as unknown as AdminDetail); }).catch(() => live && setFailed(true));
    return () => { live = false; };
  }, []);

  const scope = districtScope(d, file);
  const mine = detail?.[d.name];
  const areas = file.areas.map((area, i) => {
    const [rec, completion, rep, invS, invP, out, conf, missing, future] = d.a[i];
    const gaps = new Set(missing ? missing.split(",").map(Number) : []);
    const cells = file.years.map((year, j) => { const records = mine?.iy[i][j] ?? 0; const state: CellState = records > 0 ? "data" : gaps.has(year) ? "missing" : "na"; return { year, records, state }; });
    return { area, rec, completion, rep, invalid: invS + invP, out, conf, future, gaps: gaps.size, cells };
  });
  const noData = areas.filter(a => a.rec === 0);
  const timed = mine?.subs.filter(s => s[0] !== "No timestamp") ?? [];
  const untimed = mine?.subs.find(s => s[0] === "No timestamp");

  return (
    <div>
      <button type="button" onClick={onBack} className="mb-4 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 text-[13px] font-semibold text-brand hover:bg-brand-soft"><ArrowLeft size={15} aria-hidden="true" />All districts</button>

      <section className="mpi-hero mpi-rise" aria-labelledby="adm-profile-title">
        <p className="mpi-kicker text-white/80">District profile · {d.region} Region</p>
        <div className="mt-3 grid items-end gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <h2 id="adm-profile-title" className="text-[26px] font-bold leading-tight tracking-tight text-white sm:text-[32px]">{d.name}</h2>
            <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-3">
              <p className="flex items-baseline gap-1"><span className="mpi-gold text-[60px] font-extrabold leading-none tracking-tight sm:text-[72px]"><CountUp value={d.comp} format={v => v.toFixed(1)} /></span><span className="text-[28px] font-bold text-white/80">%</span></p>
              <div className="pb-1.5 text-[13px] leading-relaxed text-white/80">
                <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-white">of years have data <span className="font-normal opacity-75">(overall completion)</span><StatusPill status={d.status} onDark /></p>
                <p><b className="font-semibold text-white">{ordinal(d.nationalRank)}</b> of 261 districts in Ghana · <b className="font-semibold text-white">{ordinal(d.regionRank)}</b> of {d.regionCount} in the {d.region} Region · Ghana average {pct(national.completion)}</p>
              </div>
            </div>
          </div>
          <ul className="grid grid-cols-3 gap-3 lg:w-[26rem]">
            {[
              { k: "Data points received", v: pct(d.pctExpected), l: `${int(d.rec)} of ${int(d.exp)}` },
              { k: "Submissions", v: int(d.sub), l: `${int(d.wb)} workbooks` },
              { k: "Last submission", v: d.last ? d.last.slice(0, 4) : "n/a", l: d.last ? longDate(d.last) : "Not recorded" },
            ].map(s => (
              <li key={s.k} className="mpi-glass !p-3">
                <p className="text-xs font-semibold text-white/75">{s.k}</p>
                <p className="tabular mt-1 text-[22px] font-extrabold leading-tight tracking-tight text-white">{s.v}</p>
                <p className="mt-0.5 text-xs text-white/80">{s.l}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-4"><Callout title="Factsheet summary">{factsheetSentence(d, file.areas)}</Callout></div>

      <SectionHead step={1} title="The four checks for this district" hint="Compared with Ghana" />
      <FourChecks scope={scope} compare={national} />

      <SectionHead step={2} title="What has been reported, and what is missing" hint={noData.length ? `${noData.length} of 15 areas have no data` : "Every area has some data"} />
      <Card as="section" className="p-4 sm:p-5">
        <h3 className="text-[15px] font-semibold text-ink">Thematic areas by reporting year</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">Each square is one year for one thematic area. A filled square means at least one value was reported for that year. Hover or focus a square for the number of records.</p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px] text-body">
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-4 w-4 rounded-[4px] bg-brand" />Data reported</li>
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-4 w-4 rounded-[4px] border-2 border-dashed border-[#B4436C] bg-[#F8E9EF]" />Missing year</li>
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="h-4 w-4 rounded-[4px] bg-[#E3E6EE]" />Not expected</li>
        </ul>
        {failed ? <div className="mt-4"><Caveat title="The year-by-year detail could not be loaded">Reload the page to see records by year and the submissions list.</Caveat></div>
          : !mine ? <div className="mt-4 h-96 animate-pulse rounded-[var(--radius-md)] bg-surface-muted" aria-busy="true" aria-label="Loading records by year" />
          : (
            <div role="region" aria-label="Thematic areas by reporting year" tabIndex={0} className="scroll-hint mt-4 overflow-x-auto rounded-[var(--radius-sm)] border border-line">
              <table className="w-full min-w-[860px] border-collapse text-[13px]">
                <caption className="sr-only">{d.name}: records reported for each thematic area and year, with completion and conflicting figures</caption>
                <thead className="bg-surface-muted text-muted">
                  <tr>
                    <th scope="col" className="px-3 py-2.5 text-left font-semibold">Thematic area</th>
                    {file.years.map(y => <th key={y} scope="col" className="px-0.5 py-2.5 text-center text-xs font-semibold"><span aria-hidden="true">’{String(y).slice(2)}</span><span className="sr-only">{y}</span></th>)}
                    <th scope="col" className="px-3 py-2.5 text-left font-semibold">Years with data</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-semibold">Conflicting figures</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-semibold">2026 to 2030 data found</th>
                  </tr>
                </thead>
                <tbody>
                  {areas.map(a => (
                    <tr key={a.area} className="border-t border-line">
                      <th scope="row" className="px-3 py-1.5 text-left font-medium text-ink">{a.area}{a.rec === 0 && <span className="block text-xs font-normal text-[#963558]">No data reported</span>}</th>
                      {a.cells.map(c => {
                        const text = c.state === "data" ? `${int(c.records)} records` : c.state === "missing" ? "Missing" : "Not expected";
                        return (
                          <td key={c.year} className="px-0.5 py-1.5 text-center">
                            <span tabIndex={0} title={`${a.area}, ${c.year}: ${text}`} className={`mx-auto block h-7 w-7 rounded-[5px] ${c.state === "data" ? "bg-brand" : c.state === "missing" ? "border-2 border-dashed border-[#B4436C] bg-[#F8E9EF]" : "bg-[#E3E6EE]"}`}><span className="sr-only">{text}</span></span>
                          </td>
                        );
                      })}
                      <td className="px-3 py-1.5"><CompletionCell value={a.completion} /></td>
                      <td className={`tabular px-3 py-1.5 text-right ${a.conf ? "font-semibold text-ink" : "text-subtle"}`}>{a.conf ? int(a.conf) : "None"}</td>
                      <td className="tabular px-3 py-1.5 text-right text-body">{a.future ? a.future.split(",").join(", ") : <span className="text-subtle">None</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        <div className="mt-3 space-y-1 text-xs leading-relaxed text-subtle">
          <p>SDGs Budget is expected from 2019 only. Conflicting figures are data points where repeat submissions gave different values; they do not change completion. Values entered for 2026 to 2030 are planning years and are left out of the score.</p>
          <p>Source: {SOURCE}.</p>
        </div>
        {mine && (
          <DataDisclosure label="View records by area and year" hint="Exact counts">
            <DataTable caption={`${d.name}: records by thematic area and reporting year`} headings={["Thematic area", ...file.years.map(String), "Total"]} rows={areas.map(a => [a.area, ...a.cells.map(c => (c.state === "na" ? "" : c.records)), a.rec])} decimals={0} minWidth={860} unitNote="0 marks a missing year. A blank cell is a year that was not expected." />
            <DataTable caption={`${d.name}: quality checks by thematic area`} headings={["Thematic area", "Records", "Repeat submissions", "Fail a rule", "Possible outliers", "Conflicting figures"]} rows={areas.map(a => [a.area, a.rec, a.rep, a.invalid, a.out, a.conf])} decimals={0} minWidth={620} />
          </DataDisclosure>
        )}
      </Card>

      <SectionHead step={3} title="When the data was sent" hint={d.first ? `First submission ${longDate(d.first)}` : undefined} />
      <Grid cols="3-2">
        <ChartCard title="Share of expected data points received, by reporting year" subtitle="% of the data points the template expects for each year" period="Reporting years 2015 to 2025" notes="This is the year the data describes, not the year it was sent. Values above 100% can occur where repeat submissions are counted. The vertical axis starts at zero." source={SOURCE}
          footer={<DataDisclosure hint="Exact figures"><DataTable caption={`${d.name}: records by reporting year`} headings={["Reporting year", "Records received", "Records expected", "% of expected"]} rows={scope.years.map(y => [String(y.year), y.rec, y.exp, y.pctExpected])} decimals={[undefined, 0, 0, 1]} minWidth={440} /></DataDisclosure>}>
          <Trend data={scope.years.map(y => ({ year: y.year, value: y.pctExpected, detail: `${int(y.rec)} of ${int(y.exp)} expected` }))} name="Received" format={pct} axis={v => `${v.toFixed(0)}%`} max={Math.max(100, Math.ceil(Math.max(...scope.years.map(y => y.pctExpected)) * 1.1 / 25) * 25)} height={250}
            label={`Area chart for ${d.name}: share of expected data points received by reporting year, from ${pct(scope.years[0].pctExpected)} for 2015 to ${pct(scope.years.at(-1)!.pctExpected)} for 2025.`} />
        </ChartCard>
        <Card as="section" className="flex flex-col p-4 sm:p-5">
          <h3 className="text-[15px] font-semibold text-ink">{int(d.sub)} {d.sub === 1 ? "submission" : "submissions"}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">Each time the district sent workbooks, newest first, with the template version used.</p>
          {!mine ? <div className="mt-4 h-40 animate-pulse rounded-[var(--radius-md)] bg-surface-muted" aria-busy="true" /> : (
            <div role="region" aria-label="Submissions" tabIndex={0} className="mt-4 max-h-[22rem] overflow-auto rounded-[var(--radius-sm)] border border-line">
              <table className="w-full border-collapse text-[13px]">
                <caption className="sr-only">Submissions from {d.name}</caption>
                <thead className="sticky top-0 bg-surface-muted text-muted"><tr><th scope="col" className="px-3 py-2.5 text-left font-semibold">Sent</th><th scope="col" className="px-3 py-2.5 text-left font-semibold">Template</th><th scope="col" className="px-3 py-2.5 text-right font-semibold">Records</th></tr></thead>
                <tbody>
                  {timed.map(s => <tr key={s[0]} className="border-t border-line"><th scope="row" className="tabular whitespace-nowrap px-3 py-2 text-left font-normal text-body">{longDate(s[0])}<span className="ml-1.5 text-xs text-subtle">{s[0].slice(11)}</span></th><td className="px-3 py-2 text-body">{s[1]}</td><td className="tabular px-3 py-2 text-right font-semibold text-ink">{int(s[3])}</td></tr>)}
                  {untimed && <tr className="border-t border-line bg-surface-muted/60"><th scope="row" className="px-3 py-2 text-left font-normal text-body">No matched time</th><td className="px-3 py-2 text-body">{untimed[1]}</td><td className="tabular px-3 py-2 text-right font-semibold text-ink">{int(untimed[3])}</td></tr>}
                </tbody>
              </table>
            </div>
          )}
          {untimed && <p className="mt-3 text-xs leading-relaxed text-subtle">{int(untimed[3])} records ({pct(share(untimed[3], d.rec))}) could not be matched to a submission time. They are counted as records but not as a submission.</p>}
        </Card>
      </Grid>
    </div>
  );
}
