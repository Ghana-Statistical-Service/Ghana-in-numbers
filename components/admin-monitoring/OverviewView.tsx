"use client";

import { useState } from "react";
import { ArrowRight, CalendarCheck, Copy, FileStack, Medal, PieChart, Ruler, ScanSearch, ShieldCheck, type LucideIcon } from "lucide-react";
import { ChartCard } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Segmented } from "@/components/ui/Data";
import { Grid } from "@/components/ui/Page";
import { IconTile, type Tone } from "@/components/ui/Infographic";
import { CountUp, SectionHead } from "@/components/mpi/parts";
import { int, pct, perHundred, rate, share, statusOf, statuses, summarise, type CheckId, type Scope, type TabId } from "@/lib/adminMonitoring";
import type { ViewProps } from "./AdminDashboard";
import { Bars, Meter, StatusKey, StatusPill, StatusSplit, Trend } from "./parts";

const GOLD = "#F5C451";
const SOURCE = "GSS, MMDAs Administrative Data Quality Assessment";

/** 100 dots, one per data point in a hundred. The last dot is part-filled so the picture matches the decimal. */
function HundredDots({ value }: { value: number }) {
  const v = Math.min(100, value), whole = Math.floor(v), part = v - whole;
  return (
    <div className="mpi-breathe relative w-[168px] shrink-0">
      <div role="img" aria-label={`${pct(value)} of 100 dots are gold: the share of expected data points that were received`} className="relative grid grid-cols-10 gap-[5px]">
        {Array.from({ length: 100 }, (_, i) => (
          <span key={i} aria-hidden="true" className={`aspect-square rounded-full ${i <= whole ? "mpi-pop" : ""}`}
            style={{ animationDelay: `${i * 14}ms`, background: i < whole ? GOLD : i === whole && part > 0 ? `linear-gradient(90deg, ${GOLD} ${part * 100}%, rgba(255,255,255,0.2) ${part * 100}%)` : "rgba(255,255,255,0.2)", boxShadow: i < whole ? "0 0 8px rgba(245,196,81,0.55)" : undefined }} />
        ))}
      </div>
    </div>
  );
}

type CheckCard = { key: string; icon: LucideIcon; tone: Tone; official: string; question: string; value: number; display: string; sentence: string; action: string; target: [TabId, CheckId?] };

/** The four checks as one row of cards: question, figure, plain reading, what to do next. Shared with the district profile. */
export function FourChecks({ scope, go, compare }: { scope: Scope; go?: (tab: TabId, check?: CheckId) => void; compare?: Scope }) {
  const cards: CheckCard[] = [
    { key: "complete", icon: PieChart, tone: "purple", official: "Completeness", question: "Is anything missing?", value: scope.pctExpected, display: pct(scope.pctExpected), sentence: `of expected data points were received (${int(scope.rec)} of ${int(scope.exp)})`, action: "Fill the gaps", target: ["completeness"] },
    { key: "repeats", icon: Copy, tone: "blue", official: "Uniqueness", question: "Was anything sent more than once?", value: share(scope.rep, scope.rec), display: rate(share(scope.rep, scope.rec)), sentence: `of records are repeat submissions (${int(scope.rep)}); ${int(scope.conf)} data points have conflicting figures`, action: "Reconcile", target: ["checks", "repeats"] },
    { key: "invalid", icon: Ruler, tone: "amber", official: "Validity", question: "Did the values follow the rules?", value: share(scope.invalid, scope.rec), display: rate(share(scope.invalid, scope.rec)), sentence: `of records fail a validity rule (${int(scope.invalid)})`, action: "Review", target: ["checks", "invalid"] },
    { key: "outliers", icon: ScanSearch, tone: "rose", official: "Accuracy", question: "Do any values look unusual?", value: share(scope.out, scope.rec), display: rate(share(scope.out, scope.rec)), sentence: `of records are flagged as possible outliers (${int(scope.out)})`, action: "Verify", target: ["checks", "outliers"] },
  ];
  const fills: Record<string, string> = { purple: "#3C2FA3", blue: "#2F6DB5", amber: "#D17A22", rose: "#B4436C" };
  const reference = compare && [compare.pctExpected, share(compare.rep, compare.rec), share(compare.invalid, compare.rec), share(compare.out, compare.rec)];
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 lg:gap-4">
      {cards.map((c, i) => {
        const body = (
          <>
            <span className="flex items-center gap-2.5">
              <IconTile icon={c.icon} tone={c.tone} size="sm" />
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{c.official}</span>
            </span>
            <span className="mt-3 block text-[15px] font-semibold leading-snug text-ink">{c.question}</span>
            <span className="tabular mt-3 block text-[34px] font-extrabold leading-none tracking-tight text-ink">{c.display}</span>
            <span className="mt-2 block text-[13px] leading-relaxed text-body">{c.sentence}.</span>
            <span className="mt-3 block"><Meter value={c.value} color={fills[c.tone]} delay={i * 60} /></span>
            <span className="mt-1.5 flex justify-between text-xs text-subtle"><span>0%</span>{reference && <span>{compare!.name}: {i === 0 ? pct(reference[i]) : rate(reference[i])}</span>}<span>100%</span></span>
            <span className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3 text-[13px]">
              <span className="text-muted">Next step: <b className="font-semibold text-ink">{c.action}</b></span>
              {go && <span className="inline-flex items-center gap-1 font-semibold text-brand">Details<ArrowRight size={14} aria-hidden="true" /></span>}
            </span>
          </>
        );
        const cls = "flex h-full w-full flex-col rounded-[var(--radius-lg)] border border-line bg-surface p-4 text-left shadow-card sm:p-5";
        return <li key={c.key}>{go ? <button type="button" onClick={() => go(...c.target)} className={`mpi-lift ${cls}`}>{body}</button> : <div className={cls}>{body}</div>}</li>;
      })}
    </ul>
  );
}

export default function OverviewView({ file, all, scope, national, region, go, setRegion, openDistrict }: ViewProps) {
  const [metric, setMetric] = useState<"records" | "share">("share");
  const status = statusOf(scope.completion);
  const where = region ? `the ${region} Region` : "Ghana";
  const n = scope.districts.length;
  const peak = scope.years.reduce((a, b) => (b.pctExpected > a.pctExpected ? b : a));
  const lastYear = scope.years.at(-1)!;
  const areasSorted = [...scope.areas].sort((a, b) => a.completion - b.completion);
  const regionRows = [...new Set(all.map(d => d.region))].map(r => summarise(r, all.filter(d => d.region === r), file)).sort((a, b) => b.completion - a.completion);
  const districtRows = [...scope.districts].sort((a, b) => b.comp - a.comp);

  return (
    <div>
      <section className="mpi-hero mpi-rise" aria-labelledby="adm-hero-title">
        <p className="mpi-kicker text-white/80">{scope.name} · {n} districts · reporting years 2015 to 2025</p>
        <div className="mt-4 grid items-center gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <h2 id="adm-hero-title" className="max-w-2xl text-[26px] font-bold leading-tight tracking-tight text-white sm:text-[34px]">
              Districts in {where} have sent <span className="mpi-gold">{perHundred(scope.pctExpected)}</span> of the data points asked for
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/80">{scope.pctExpected < 50 ? "Missing data is the main gap. " : ""}Of the records that were sent, {rate(share(scope.rep, scope.rec))} are repeats, {rate(share(scope.invalid, scope.rec))} fail a validity rule and {rate(share(scope.out, scope.rec))} are unusual values to verify.</p>
            <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-3">
              <p className="flex items-baseline gap-1"><span className="mpi-gold text-[68px] font-extrabold leading-none tracking-tight sm:text-[84px]"><CountUp value={scope.pctExpected} format={v => v.toFixed(1)} /></span><span className="text-[32px] font-bold text-white/80">%</span></p>
              <p className="pb-2 text-[13px] leading-relaxed text-white/80">
                <span className="block text-[15px] font-semibold text-white">of expected data points received <span className="font-normal opacity-75">(completeness)</span></span>
                {int(scope.rec)} records received of {int(scope.exp)} expected
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 lg:flex-col lg:items-start">
            <HundredDots value={scope.pctExpected} />
            <p className="max-w-[11rem] text-xs leading-relaxed text-white/75">Each dot is 1 in 100 expected data points. Gold dots were received.</p>
          </div>
        </div>

        <ul className="mt-7 grid gap-3 sm:grid-cols-3">
          <li className="mpi-glass">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-white/75"><CalendarCheck size={14} aria-hidden="true" className="mpi-gold" />Years with data <span className="font-normal normal-case tracking-normal">(overall completion)</span></p>
            <p className="mt-1.5 flex flex-wrap items-center gap-2.5 text-[30px] font-extrabold leading-tight tracking-tight text-white"><CountUp value={scope.completion} format={pct} /><StatusPill status={status} onDark /></p>
            <p className="mt-1 text-xs leading-relaxed text-white/80">Average share of the years 2015 to 2025 for which a district reported at least one value, across the 15 thematic areas.</p>
          </li>
          <li className="mpi-glass">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-white/75"><Medal size={14} aria-hidden="true" className="mpi-gold" />Districts rated strong</p>
            <p className="mt-1.5 text-[30px] font-extrabold leading-tight tracking-tight text-white"><CountUp value={scope.byStatus.strong} format={v => int(v)} /> <span className="text-[17px] font-semibold text-white/80">of {n}</span></p>
            <p className="mt-1 text-xs leading-relaxed text-white/80">Have data for 80% or more of the years. {scope.byStatus.moderate} are moderate and {scope.byStatus.low} are low (under 50%).</p>
          </li>
          <li className="mpi-glass">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-white/75"><FileStack size={14} aria-hidden="true" className="mpi-gold" />Submissions received</p>
            <p className="mt-1.5 text-[30px] font-extrabold leading-tight tracking-tight text-white"><CountUp value={scope.sub} format={v => int(v)} /></p>
            <p className="mt-1 text-xs leading-relaxed text-white/80">Separate submission times, covering {int(scope.wb)} workbooks and {int(scope.rec)} records.</p>
          </li>
        </ul>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/15 pt-4">
          <p className="flex max-w-3xl items-start gap-2.5 text-[13px] leading-relaxed text-white/85">
            <ShieldCheck size={16} aria-hidden="true" className="mpi-gold mt-0.5 shrink-0" />
            <span>Two measures of completeness are used. <b className="font-semibold text-white">Data points received</b> counts every cell of the template. <b className="font-semibold text-white">Years with data</b> only asks whether each year has at least one value, so it is usually the higher of the two.</span>
          </p>
          <button type="button" onClick={() => go("method")} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#F5C451] px-4 text-[13px] font-bold text-[#1D1500] transition-transform hover:-translate-y-0.5">How it is assessed<ArrowRight size={15} aria-hidden="true" /></button>
        </div>
      </section>

      <SectionHead step={1} title="The four checks" hint="Each card opens the detail" />
      <FourChecks scope={scope} go={go} compare={region ? national : undefined} />

      <SectionHead step={2} title="How has reporting changed?" hint={`Highest for ${peak.year}`} />
      <Grid cols="3-2">
        <ChartCard className="mpi-lift" title={metric === "share" ? "Share of expected data points received, by reporting year" : "Records received, by reporting year"} subtitle={metric === "share" ? "% of the data points the template expects for each year" : "Number of records reported for each year"} period="Reporting years 2015 to 2025"
          actions={<Segmented label="Measure" size="sm" value={metric} onChange={setMetric} options={[{ value: "share", label: "% of expected" }, { value: "records", label: "Records" }]} />}
          notes={<>This is the year the data describes, not the year it was sent. {peak.year} is the most complete year at {pct(peak.pctExpected)}; {lastYear.year} stands at {pct(lastYear.pctExpected)} and may still be incomplete because districts were still reporting on it when the data was compiled. The vertical axis starts at zero.</>}
          source={SOURCE}
          footer={<DataDisclosure hint="Exact figures"><DataTable caption={`Records by reporting year, ${scope.name}`} headings={["Reporting year", "Records received", "Records expected", "% of expected"]} rows={scope.years.map(y => [String(y.year), y.rec, y.exp, y.pctExpected])} decimals={[undefined, 0, 0, 1]} minWidth={440} /></DataDisclosure>}>
          <Trend data={scope.years.map(y => ({ year: y.year, value: metric === "share" ? y.pctExpected : y.rec, detail: `${int(y.rec)} of ${int(y.exp)} expected` }))}
            name={metric === "share" ? "Received" : "Records"} format={metric === "share" ? pct : int} axis={metric === "share" ? v => `${v.toFixed(0)}%` : v => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(Math.round(v)))} max={metric === "share" ? 100 : undefined}
            label={`Area chart for ${scope.name}: ${pct(scope.years[0].pctExpected)} of expected data points received for ${scope.years[0].year}, ${pct(peak.pctExpected)} for ${peak.year} and ${pct(lastYear.pctExpected)} for ${lastYear.year}.`} />
        </ChartCard>

        <ChartCard className="mpi-lift" title={`${scope.byStatus.strong} of ${n} districts have data for most years`} subtitle="Districts by overall completion (years with data)" period="2015 to 2025"
          notes="Status follows the district factsheets: strong is 80% or more, moderate is 50% to under 80%, low is under 50%." source={SOURCE}>
          <StatusSplit counts={scope.byStatus} total={n} />
          <button type="button" onClick={() => go("districts")} className="mt-5 inline-flex min-h-10 items-center gap-2 self-start rounded-full bg-brand px-4 text-[13px] font-semibold text-white hover:bg-brand-hover">See every district<ArrowRight size={15} aria-hidden="true" /></button>
        </ChartCard>
      </Grid>

      <SectionHead step={3} title="Where are the gaps?" hint={region ? "By district and by thematic area" : "By region and by thematic area"} />
      <Grid cols={2}>
        {region ? (
          <ChartCard className="mpi-lift" title={`Districts in the ${region} Region`} subtitle="Overall completion: % of years with at least one reported value, averaged over 15 thematic areas. Select a district to open its profile." period="2015 to 2025" source={SOURCE}>
            <StatusKey className="mb-3" />
            <Bars caption={`Overall completion by district, ${region} Region`} max={100} marks
              rows={districtRows.map(d => ({ key: d.name, label: d.name, value: d.comp, display: pct(d.comp), color: statuses[d.status].fill, onClick: () => openDistrict(d.name) }))} />
          </ChartCard>
        ) : (
          <ChartCard className="mpi-lift" title={`Completion ranges from ${pct(regionRows.at(-1)!.completion)} in ${regionRows.at(-1)!.name} to ${pct(regionRows[0].completion)} in ${regionRows[0].name}`} subtitle="Average overall completion of each region’s districts. Select a region to filter every tab." period="2015 to 2025"
            notes="The two thin lines on each bar mark 50% and 80%, the limits of the three status levels." source={SOURCE}>
            <StatusKey className="mb-3" />
            <Bars caption="Average overall completion by region" max={100} marks labelWidth="8.5rem"
              rows={regionRows.map(r => ({ key: r.name, label: r.name, sub: `${r.districts.length} districts`, value: r.completion, display: pct(r.completion), color: statuses[statusOf(r.completion)].fill, onClick: () => setRegion(r.name) }))} />
          </ChartCard>
        )}

        <ChartCard className="mpi-lift" title={`${areasSorted[0].area} and ${areasSorted[1].area} have the least complete reporting`} subtitle="Average completion of each of the 15 thematic areas: % of years with at least one reported value" period="2015 to 2025"
          notes="SDGs Budget is scored over 2019 to 2025 because its template starts in 2019." source={SOURCE}
          footer={<DataDisclosure hint="Exact figures"><DataTable caption={`Thematic areas, ${scope.name}`} headings={["Thematic area", "Average completion (%)", "Records", "Districts with no data"]} rows={[...scope.areas].sort((a, b) => b.completion - a.completion).map(a => [a.area, a.completion, a.rec, a.noData])} decimals={[undefined, 1, 0, 0]} minWidth={480} /></DataDisclosure>}>
          <StatusKey className="mb-3" />
          <Bars caption={`Average completion by thematic area, ${scope.name}`} max={100} marks labelWidth="10.5rem"
            rows={[...scope.areas].sort((a, b) => b.completion - a.completion).map(a => ({ key: a.area, label: a.area, sub: a.noData ? `${a.noData} of ${n} districts sent nothing` : undefined, value: a.completion, display: pct(a.completion), color: statuses[statusOf(a.completion)].fill }))} />
        </ChartCard>
      </Grid>
    </div>
  );
}
