"use client";

import { Info } from "lucide-react";
import { Card, ChartCard, Stat } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Segmented } from "@/components/ui/Data";
import { Grid } from "@/components/ui/Page";
import { Lead, SectionHead } from "@/components/mpi/parts";
import { checkOrder, checks, countOf, int, rate, rateOf, share, summarise, type CheckId, type District } from "@/lib/adminMonitoring";
import type { ViewProps } from "./AdminDashboard";
import { Bars, DistrictLink, Meter, SortTable, Trend, type Column } from "./parts";

const SOURCE = "GSS, MMDAs Administrative Data Quality Assessment";
const tint: Record<CheckId, string> = { repeats: "#2F6DB5", invalid: "#D17A22", outliers: "#B4436C" };

export default function ChecksView({ file, all, scope, national, region, setRegion, openDistrict, check, setCheck }: ViewProps & { check: CheckId; setCheck: (check: CheckId) => void }) {
  const cfg = checks[check];
  const count = countOf(scope, check), value = share(count, scope.rec);
  const yearKey = check === "repeats" ? "rep" : check === "invalid" ? "invalid" : "out";
  const years = scope.years.map(y => ({ year: y.year, value: share(y[yearKey], y.rec), detail: `${int(y[yearKey])} of ${int(y.rec)} records` }));
  const areaRows = scope.areas.map(a => ({ ...a, count: countOf(a, check), value: rateOf(a, check) })).sort((a, b) => b.value - a.value);
  const places = region
    ? scope.districts.map(d => ({ key: d.name, label: d.name, sub: undefined as string | undefined, count: countOf(d, check), value: rateOf(d, check), onClick: () => openDistrict(d.name) }))
    : [...new Set(all.map(d => d.region))].map(r => { const s = summarise(r, all.filter(d => d.region === r), file); return { key: r, label: r, sub: `${s.districts.length} districts`, count: countOf(s, check), value: rateOf(s, check), onClick: () => setRegion(r) }; });
  places.sort((a, b) => b.value - a.value);
  const shown = places.slice(0, 15);
  const top = (rows: { value: number }[]) => Math.max(...rows.map(r => r.value), 0.1) * 1.05;
  const where = region ? `the ${region} Region` : "Ghana";

  const columns: Column<District>[] = [
    { key: "name", label: "District", header: true, sort: d => d.name, render: d => <DistrictLink name={d.name} onOpen={openDistrict} /> },
    { key: "region", label: "Region", sort: d => d.region, render: d => d.region, hideBelow: "md" },
    { key: "rec", label: "Records checked", align: "right", sort: d => d.rec, render: d => int(d.rec) },
    { key: "count", label: cfg.countLabel, align: "right", sort: d => countOf(d, check), render: d => int(countOf(d, check)) },
    ...(check === "repeats" ? [{ key: "conf", label: "Conflicting figures", align: "right" as const, sort: (d: District) => d.conf, render: (d: District) => int(d.conf) }] : []),
    { key: "rate", label: "Share of records", align: "right", sort: d => rateOf(d, check), render: d => <b className="font-semibold text-ink">{rate(rateOf(d, check))}</b> },
  ];

  return (
    <div>
      <div className="mb-5">
        <p className="mb-1.5 text-xs font-medium text-muted">Choose a check</p>
        <Segmented label="Quality check" value={check} onChange={setCheck} options={checkOrder.map(id => ({ value: id, label: `${checks[id].label} (${checks[id].official.toLowerCase()})` }))} />
      </div>

      <Lead kicker={`${cfg.official}: ${cfg.question}`}>
        In {where}, {int(count)} of the {int(scope.rec)} records received {cfg.noun}. That is {rate(value)}{value >= 0.5 ? `, or about ${Math.round(value)} in every 100` : ", fewer than 1 in every 100"}.
      </Lead>

      <Grid cols="3-2">
        <Card as="section" className="p-4 sm:p-5">
          <h3 className="text-[15px] font-semibold text-ink">{cfg.rateLabel}</h3>
          <p className="mt-1 text-[13px] text-muted">{scope.name}, reporting years 2015 to 2025</p>
          <p className="tabular mt-4 text-[44px] font-extrabold leading-none tracking-tight text-ink">{rate(value)}</p>
          <div className="mt-4"><Meter value={value} color={tint[check]} height={14} /></div>
          <p className="mt-1.5 flex justify-between text-xs text-subtle"><span>0%</span>{region && <span>Ghana: {rate(rateOf(national, check))}</span>}<span>100% of records</span></p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Stat label="Records checked" value={int(scope.rec)} />
            <Stat label={cfg.countLabel} value={int(count)} />
            {check === "repeats" && <Stat label="Conflicting figures" value={int(scope.conf)} context="Data points where the repeats disagree" />}
            {check === "invalid" && <Stat label="Percentages over 100" value={int(scope.invP)} context={`The other ${int(scope.invS)} are small values (1 or 2)`} />}
            {check === "outliers" && <Stat label="Highest share" value={rate(areaRows[0].value)} context={`In ${areaRows[0].area}`} />}
          </div>
        </Card>
        <Card as="section" className="flex flex-col border-brand-line bg-[linear-gradient(160deg,#FBFAFF,#EEECFA)] p-4 sm:p-5">
          <h3 className="flex items-center gap-2 text-[15px] font-semibold text-ink"><Info size={16} aria-hidden="true" className="text-brand" />How this check works</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-body">{cfg.rule}</p>
          <p className="mt-3 rounded-[var(--radius-md)] bg-white/70 px-3.5 py-3 text-[13px] leading-relaxed text-body"><b className="font-semibold text-ink">How to read it: </b>{cfg.reading}</p>
        </Card>
      </Grid>

      <SectionHead step={1} title="Has it changed over the years?" />
      <ChartCard title={`${cfg.rateLabel}, by reporting year`} subtitle="% of the records received for each year" period="Reporting years 2015 to 2025"
        notes="The latest year may still be incomplete. The vertical axis starts at zero." source={SOURCE}
        footer={<DataDisclosure hint="Exact figures"><DataTable caption={`${cfg.countLabel} by reporting year, ${scope.name}`} headings={["Reporting year", "Records checked", cfg.countLabel, "Share of records (%)"]} rows={scope.years.map(y => [String(y.year), y.rec, y[yearKey], share(y[yearKey], y.rec)])} decimals={[undefined, 0, 0, 2]} minWidth={460} /></DataDisclosure>}>
        <Trend data={years} name="Share of records" format={rate} axis={v => `${v.toFixed(1)}%`} height={240}
          label={`Area chart for ${scope.name}: ${cfg.rateLabel.toLowerCase()} was ${rate(years[0].value)} for ${years[0].year} and ${rate(years.at(-1)!.value)} for ${years.at(-1)!.year}.`} />
      </ChartCard>

      <SectionHead step={2} title="Where does it happen most?" hint="Highest share first" />
      <Grid cols={2}>
        <ChartCard title={`${areaRows[0].area} has the highest share`} subtitle={`${cfg.rateLabel}, by thematic area`} period="2015 to 2025" source={SOURCE}
          notes="Bars are scaled to the highest area, not to 100%, so small shares can be compared."
          footer={<DataDisclosure hint="Exact figures"><DataTable caption={`${cfg.countLabel} by thematic area, ${scope.name}`} headings={["Thematic area", "Records checked", cfg.countLabel, "Share of records (%)", ...(check === "repeats" ? ["Conflicting figures"] : check === "invalid" ? ["Small values", "Percentages over 100"] : [])]} rows={areaRows.map(a => [a.area, a.rec, a.count, a.value, ...(check === "repeats" ? [a.conf] : check === "invalid" ? [a.invS, a.invP] : [])])} decimals={[undefined, 0, 0, 2, 0, 0]} minWidth={520} /></DataDisclosure>}>
          <Bars caption={`${cfg.rateLabel} by thematic area, ${scope.name}`} max={top(areaRows)} labelWidth="10.5rem"
            rows={areaRows.map((a, i) => ({ key: a.area, label: a.area, sub: `${int(a.count)} of ${int(a.rec)} records`, value: a.value, display: rate(a.value), emphasis: i === 0 }))} />
        </ChartCard>
        <ChartCard title={`${places[0].label} has the highest share`} subtitle={`${cfg.rateLabel}, by ${region ? "district. Select a district to open its profile." : "region. Select a region to filter every tab."}`} period="2015 to 2025" source={SOURCE}
          notes={`Bars are scaled to the highest place, not to 100%.${places.length > shown.length ? ` The ${shown.length} highest of ${places.length} districts are shown; all are in the table below.` : ""}`}>
          <Bars caption={`${cfg.rateLabel} by ${region ? "district" : "region"}`} max={top(places)} labelWidth="10rem"
            rows={shown.map((p, i) => ({ key: p.key, label: p.label, sub: p.sub, value: p.value, display: rate(p.value), emphasis: i === 0, onClick: p.onClick }))} />
        </ChartCard>
      </Grid>

      <SectionHead step={3} title="Which districts to follow up" hint="Sort by any column" />
      <Card as="section" className="p-4 sm:p-5">
        <h3 className="text-[15px] font-semibold text-ink">{cfg.countLabel} by district{region ? `, ${region} Region` : ""}</h3>
        <p className="mb-4 mt-1 text-[13px] text-muted">Sorted by share of records, highest first. Select a district to open its profile. A high share with few records can come from a handful of entries, so read the count as well.</p>
        <SortTable key={check} columns={columns} rows={scope.districts} rowKey={d => d.name} caption={`${cfg.countLabel} by district`} initial={{ key: "rate", dir: -1 }} pageSize={10} minWidth={620} />
      </Card>
    </div>
  );
}
