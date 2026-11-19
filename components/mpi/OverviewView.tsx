"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceDot, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Building2, Gauge, Layers, MapPinned, ShieldCheck, Trees, Users } from "lucide-react";
import { ChartCard } from "@/components/ui/Card";
import { DataDisclosure, DataTable, Segmented } from "@/components/ui/Data";
import GhanaMap from "@/components/maps/GhanaMap";
import { Grid } from "@/components/ui/Page";
import { IconTile } from "@/components/ui/Infographic";
import { C, ChartFrame, axisCommon, tick } from "@/components/ui/chart";
import { dimensionOf, dimensions, indicators, national2021, type MpiDistrictFile, type MpiViewId } from "@/data/mpiData";
import { censoredHeadcount, censoredQuarters, dimensionContribution, indicatorContribution, latest, localityQuarterly, localityShareOfPoorQ3, nationalQuarterly, quarterlySources, regionQuarters, regionsQuarterly } from "@/data/mpiQuarterlyData";
import AnnualSections from "./AnnualSections";
import type { Place } from "./PlaceSearch";
import { BarList, CountUp, DimensionLegend, SectionHead, ShareBar, Term, millions, ordinal, pct, people, signedPp } from "./parts";

const src = (ref: string) => `${quarterlySources.report} · ${ref}`;
const GOLD = "#F5C451";

type Nav = { go: (view: MpiViewId) => void; openRegion: (region: string | null, jump?: boolean) => void; openDistrict: (district: string | null, jump?: boolean) => void };

function TrendTooltip({ active, payload }: { active?: boolean; payload?: readonly { payload?: (typeof nationalQuarterly)[number] }[] }) {
  const d = payload?.[0]?.payload;
  if (!active || !d) return null;
  return (
    <div className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] shadow-pop">
      <p className="font-bold text-ink">{d.quarter}</p>
      <p className="tabular text-body"><b className="font-semibold text-ink">{pct(d.incidence)}</b> multidimensionally poor</p>
      <p className="tabular text-muted">{d.low != null ? `95% confidence interval ${d.low.toFixed(1)} to ${d.high!.toFixed(1)}` : "Confidence interval not published"}</p>
      {d.people != null && <p className="tabular text-muted">{d.peopleRounded ? `About ${millions(d.people)}` : people(d.people)} people</p>}
    </div>
  );
}

/** 100 dots, one per person in a hundred. The last dot is part-filled so the picture matches the published decimal. */
function HundredDots({ value }: { value: number }) {
  const whole = Math.floor(value), part = value - whole;
  return (
    <div className="mpi-breathe relative w-[168px] shrink-0">
      <div role="img" aria-label={`${pct(value)} of 100 dots are gold: the share of people who are multidimensionally poor`} className="relative grid grid-cols-10 gap-[5px]">
        {Array.from({ length: 100 }, (_, i) => (
          <span key={i} aria-hidden="true" className={`aspect-square rounded-full ${i <= whole ? "mpi-pop" : ""}`}
            style={{ animationDelay: `${i * 22}ms`, background: i < whole ? GOLD : i === whole && part > 0 ? `linear-gradient(90deg, ${GOLD} ${part * 100}%, rgba(255,255,255,0.2) ${part * 100}%)` : "rgba(255,255,255,0.2)", boxShadow: i < whole ? "0 0 8px rgba(245,196,81,0.55)" : undefined }} />
        ))}
      </div>
    </div>
  );
}

/**
 * Map preview on the national picture: regions (latest quarter of the survey series) or districts (latest year of the annual series).
 * Clicking a place, or a button below, opens the matching tab.
 */
function PlacePreview({ go, openRegion, openDistrict }: Nav) {
  const [level, setLevel] = useState<"regions" | "districts">("regions");
  const [file, setFile] = useState<MpiDistrictFile | null>(null);
  useEffect(() => {
    if (level !== "districts" || file) return;
    let live = true;
    import("@/data/mpiDistricts.json").then(m => { if (live) setFile(m.default as MpiDistrictFile); }).catch(() => undefined);
    return () => { live = false; };
  }, [level, file]);

  const qi = regionQuarters.length - 1;
  const regionRank = [...regionsQuarterly].sort((a, b) => b.incidence[qi] - a.incidence[qi]).map(r => r.region);
  const yi = file ? file.years.length - 1 : 0;
  const owner = new Map<string, MpiDistrictFile["districts"][number]>();
  file?.districts.forEach(d => (d.shapes ?? [d.name]).forEach(shape => owner.set(shape, d)));
  return (
    <div className="mpi-lift flex min-w-0 flex-col rounded-[var(--radius-lg)] border border-brand-line bg-[linear-gradient(160deg,#FBFAFF,#EEECFA)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <IconTile icon={MapPinned} tone="purple" />
          <div className="min-w-0">
            <h3 className="text-[17px] font-semibold leading-snug text-ink">See your region or district</h3>
            <p className="text-[13px] text-muted">{level === "regions" ? "16 regions · 2025 Q3 · survey estimates" : `261 districts · ${file ? file.years[yi] : "latest year"} · modelled estimates`}</p>
          </div>
        </div>
        <Segmented label="Map level" size="sm" options={[{ value: "regions", label: "Regions" }, { value: "districts", label: "Districts" }]} value={level} onChange={setLevel} />
      </div>

      <div className="mt-3 flex-1 rounded-[var(--radius-md)] bg-white/70 p-2">
        {level === "regions" ? (
          <GhanaMap level="regions" domain={[0, 60]} label="Multidimensionally poor, 2025 Q3" format={pct} focusable maxHeight={400} onSelect={name => openRegion(name)}
            resolve={shape => { const r = regionsQuarterly.find(x => x.region === shape); return r ? { key: r.region, name: r.region, value: r.incidence[qi], lines: [`${ordinal(regionRank.indexOf(r.region) + 1)} highest of 16 regions`, `People affected: ${people(r.people[qi])}`] } : undefined; }}
            ariaLabel="Map of Ghana’s 16 regions shaded by the share of people who are multidimensionally poor, 2025 Q3. Select a region to open the Regions tab." />
        ) : file ? (
          <GhanaMap level="districts" domain={[0, 70]} label={`Multidimensionally poor, ${file.years[yi]}`} format={pct} showNames={false} maxHeight={400} onSelect={name => openDistrict(name)}
            resolve={shape => { const d = owner.get(shape); return d ? { key: d.name, name: d.name, value: d.headcount[yi], lines: [`${d.region} Region`, `${ordinal(d.rank[yi])} highest of 261 districts`] } : undefined; }}
            ariaLabel={`Map of Ghana’s 261 districts shaded by the share of people who are multidimensionally poor, ${file.years[yi]}. Use the Districts tab to search by name.`} />
        ) : <div className="h-[400px] animate-pulse rounded-[var(--radius-md)] bg-surface-muted" aria-busy="true" />}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Stronger colour = a higher share of people who are multidimensionally poor. Hover for numbers; click a {level === "regions" ? "region" : "district"} to open its tab.{" "}
        {level === "regions" ? "Regional figures are quarterly survey estimates; district figures are a separate annual series." : "District figures are modelled annual estimates, a separate series from the regional survey figures."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => go("regions")} className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold ${level === "regions" ? "bg-brand text-white hover:bg-brand-hover" : "border border-brand-line bg-white text-brand hover:bg-brand-soft"}`}>16 regions<ArrowRight size={15} aria-hidden="true" /></button>
        <button type="button" onClick={() => go("districts")} className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold ${level === "districts" ? "bg-brand text-white hover:bg-brand-hover" : "border border-brand-line bg-white text-brand hover:bg-brand-soft"}`}>261 districts<ArrowRight size={15} aria-hidden="true" /></button>
      </div>
    </div>
  );
}

export default function OverviewView({ go, place, openRegion, openDistrict }: Nav & { place: Place | null }) {
  const q3 = latest, q2 = nationalQuarterly.at(-2)!;
  const peak = nationalQuarterly.reduce((a, b) => (b.incidence > a.incidence ? b : a));
  const first = nationalQuarterly[0];
  const withPeople = nationalQuarterly.filter(d => d.people != null);
  const loc = localityQuarterly.at(-1)!;
  const dimsQ3 = dimensionContribution.at(-1)!;
  const contributions = indicators.map(i => ({ ...i, value: indicatorContribution[i.key].q3, q2: indicatorContribution[i.key].q2 })).sort((a, b) => b.value - a.value);
  const last = censoredQuarters.length - 1;
  const lacking = indicators.map(i => ({ ...i, value: censoredHeadcount[i.key][last], prev: censoredHeadcount[i.key][last - 1] })).sort((a, b) => b.value - a.value);
  const inFive = Math.round(q3.incidence / 20);

  return (
    <div>
      {place && (
        <div className="mpi-rise mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-line bg-brand-soft/70 px-4 py-3">
          <p className="text-[13.5px] text-body">This tab shows the national picture. You have selected <b className="font-semibold text-ink">{place.name}{place.kind === "region" ? " Region" : ""}</b>.</p>
          <button type="button" onClick={() => (place.kind === "region" ? openRegion(place.name) : openDistrict(place.name))} className="inline-flex min-h-9 items-center gap-2 rounded-full bg-brand px-4 text-[13px] font-semibold text-white hover:bg-brand-hover">Open its profile<ArrowRight size={15} aria-hidden="true" /></button>
        </div>
      )}
      <section className="mpi-hero mpi-rise" aria-labelledby="mpi-hero-title">
        <p className="mpi-kicker text-white/80">Ghana · 2025 Q3 · Official statistics</p>
        <div className="mt-4 grid items-center gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <h2 id="mpi-hero-title" className="max-w-2xl text-[26px] font-bold leading-tight tracking-tight text-white sm:text-[34px]">
              About <span className="mpi-gold">{inFive} in every 5</span> people in Ghana is multidimensionally poor
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/80">They go without several basic needs at the same time: in health, living conditions, education and employment.</p>
            <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-3">
              <p className="flex items-baseline gap-1"><span className="mpi-gold text-[68px] font-extrabold leading-none tracking-tight sm:text-[84px]"><CountUp value={q3.incidence} format={v => v.toFixed(1)} /></span><span className="text-[32px] font-bold text-white/80">%</span></p>
              <p className="pb-2 text-[13px] leading-relaxed text-white/80">
                <span className="block text-[15px] font-semibold text-white"><Term plain="of people are multidimensionally poor" official="incidence, H" /></span>
                95% confidence interval {q3.low!.toFixed(1)}% to {q3.high!.toFixed(1)}% · SDG indicator 1.2.2
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 lg:flex-col lg:items-start">
            <HundredDots value={q3.incidence} />
            <p className="max-w-[11rem] text-xs leading-relaxed text-white/75">Each dot is 1 person in 100. Gold dots are people who are multidimensionally poor.</p>
          </div>
        </div>

        <ul className="mt-7 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Users, k: "People affected", v: people(q3.people!), l: `${people(q2.people! - q3.people!)} fewer than in 2025 Q2 (${people(q2.people!)}).` },
            { icon: Layers, k: <Term plain="How deep" official="intensity, A" />, v: pct(q3.intensity!), l: "The share of weighted basic needs that poor people lack, on average. One third is the line for being counted." },
            { icon: Gauge, k: <Term plain="MPI score" official="adjusted headcount ratio" />, v: q3.mpi!.toFixed(3), l: "Incidence multiplied by intensity. 0 is no poverty; 1 would mean everyone lacks everything." },
          ].map((s, i) => (
            <li key={i} className="mpi-glass">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em] text-white/75"><s.icon size={14} aria-hidden="true" className="mpi-gold" />{s.k}</p>
              <p className="mt-1.5 text-[30px] font-extrabold leading-tight tracking-tight text-white">{s.v}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/80">{s.l}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/15 pt-4">
          <p className="flex max-w-3xl items-start gap-2.5 text-[13px] leading-relaxed text-white/85">
            <ShieldCheck size={16} aria-hidden="true" className="mpi-gold mt-0.5 shrink-0" />
            <span>The measure does not look at income. It checks 13 basic needs; a person is counted when their household lacks at least one third of them, by weight. Quarterly survey series. Source: {src("Tables 6.2 to 6.4")}.</span>
          </p>
          <button type="button" onClick={() => go("method")} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#F5C451] px-4 text-[13px] font-bold text-[#1D1500] transition-transform hover:-translate-y-0.5">How it is measured<ArrowRight size={15} aria-hidden="true" /></button>
        </div>
      </section>

      <SectionHead step={1} title="How has it changed?" hint="2021 census, then the quarterly survey series from 2022" />
      <Grid cols="3-2">
        <ChartCard className="mpi-lift" title="The share of people who are multidimensionally poor has fallen since 2022" subtitle="% of the population, by quarter (incidence)" period="2022 Q1 to 2025 Q3"
          notes={<>Highest in {peak.quarter} ({pct(peak.incidence)}); {pct(q3.incidence)} in {q3.quarter} is the lowest of the {nationalQuarterly.length} published quarters. Quarterly figures move with the season and the survey sample, so read the direction over several quarters rather than one step. The vertical axis starts at zero.</>}
          source={`${src("Figure 4.2, p. 8; Table 6.2, p. 27")}; 2025 Q1: ${quarterlySources.infographic}`}
          footer={<DataDisclosure><DataTable caption="Multidimensional poverty incidence by quarter" headings={["Quarter", "Incidence (%)", "95% interval, low", "95% interval, high", "People"]} rows={[{ cells: ["2021 (census, separate series)", national2021.incidence, null, null, national2021.people], emphasis: "subtotal" as const }, ...nationalQuarterly.map(d => [d.quarter, d.incidence, d.low, d.high, d.people == null ? null : d.peopleRounded ? "7.80 million (rounded)" : d.people])]} decimals={[undefined, 1, 1, 1, 0]} minWidth={560} unitNote="n/a: not published for that quarter. Confidence intervals are published from 2024 Q1. The 2021 row is the Population and Housing Census, not part of the quarterly survey series." /></DataDisclosure>}>
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[var(--radius-md)] border border-brand-line bg-brand-soft/60 px-3.5 py-2.5 text-[13px] text-body">
            <span className="inline-flex items-center gap-2 font-semibold text-ink"><span aria-hidden="true" className="h-3 w-3 rounded-full border-2 border-brand bg-white" />2021 census: {pct(national2021.incidence)}</span>
            <span>({people(national2021.people)} people). The quarterly survey series below starts in 2022 Q1; the census is a different source, so it is shown here and not joined to the line.</span>
          </div>
          <ChartFrame height={290} label={`Area chart: incidence was ${pct(first.incidence)} in ${first.quarter}, peaked at ${pct(peak.incidence)} in ${peak.quarter} and was ${pct(q3.incidence)} in ${q3.quarter}.`}>
            <AreaChart data={nationalQuarterly} margin={{ top: 26, right: 30, bottom: 4, left: -8 }}>
              <defs><linearGradient id="mpi-trend" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.purple} stopOpacity={0.28} /><stop offset="100%" stopColor={C.purple} stopOpacity={0.02} /></linearGradient></defs>
              <CartesianGrid stroke={C.grid} vertical={false} />
              <XAxis dataKey="quarter" {...axisCommon} tick={tick} interval={0} tickFormatter={(q: string) => (q.endsWith("Q1") ? q.slice(0, 4) : "")} />
              <YAxis {...axisCommon} tick={tick} domain={[0, 40]} ticks={[0, 10, 20, 30, 40]} tickFormatter={(v: number) => `${v}%`} width={48} />
              <Tooltip content={<TrendTooltip />} cursor={{ stroke: C.slateLight }} />
              <Area type="monotone" dataKey="incidence" name="Incidence" stroke={C.purple} strokeWidth={2.5} fill="url(#mpi-trend)" dot={{ r: 2.5, fill: C.purple, strokeWidth: 0 }} activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }} animationDuration={900} />
              {[first, peak].map(d => <ReferenceDot key={d.quarter} x={d.quarter} y={d.incidence} r={4.5} fill={C.purple} stroke="#fff" strokeWidth={2} label={{ value: pct(d.incidence), position: d === first ? "bottom" : "top", fontSize: 12, fontWeight: 600, fill: C.ink }} />)}
              <ReferenceDot x={q3.quarter} y={q3.incidence} r={6.5} fill="#C9A227" stroke="#fff" strokeWidth={2.5} label={{ value: pct(q3.incidence), position: "top", fontSize: 13, fontWeight: 800, fill: C.ink }} />
            </AreaChart>
          </ChartFrame>
        </ChartCard>

        <ChartCard className="mpi-lift" title="How many people" subtitle="Number of multidimensionally poor people, by quarter" period="2024 Q1 to 2025 Q3"
          notes="2025 Q1 is published only as a rounded figure."
          source={`${src("Table 6.4, p. 29")}; 2025 Q1: ${quarterlySources.infographic}`}>
          <BarList caption="Number of multidimensionally poor people by quarter" max={10e6} labelWidth="4.5rem" format={v => `${(v / 1e6).toFixed(2)}m`}
            rows={withPeople.map(d => ({ label: d.quarter, value: d.people!, emphasis: d.quarter === q3.quarter, sub: d.peopleRounded ? "rounded" : undefined }))} />
          <p className="mt-4 rounded-[var(--radius-md)] bg-brand-soft/60 px-3.5 py-3 text-[13px] leading-relaxed text-body"><b className="font-semibold text-ink">{people(q2.people! - q3.people!)} fewer people</b> were multidimensionally poor in 2025 Q3 than in Q2. Figures are in millions (m).</p>
        </ChartCard>
      </Grid>

      <SectionHead step={2} title="Where do people who are affected live?" hint="Rural areas have the higher rate" />
      <Grid cols="3-2">
        <ChartCard className="mpi-lift" title="Rural and urban areas" subtitle="% of people in each type of locality who are multidimensionally poor" period="2025 Q3"
          notes={`Urban: a locality with 5,000 or more people. Rural: fewer than 5,000. The gap is ${(loc.rural - loc.urban).toFixed(1)} percentage points. In 2024 Q1 the rates were ${pct(localityQuarterly[0].rural)} rural and ${pct(localityQuarterly[0].urban)} urban.`}
          source={`${src("Tables 6.23 and 6.24, p. 51")}; 2025 Q1: ${quarterlySources.infographic}`}
          footer={<DataDisclosure><DataTable caption="Incidence by type of locality" headings={["Quarter", "Urban (%)", "Rural (%)"]} rows={localityQuarterly.map(d => [d.quarter, d.urban, d.rural])} decimals={1} minWidth={320} /></DataDisclosure>}>
          <div className="grid gap-3 sm:grid-cols-2">
            {[{ icon: Trees, label: "Rural", value: loc.rural, share: localityShareOfPoorQ3.rural, tone: "teal" as const, glow: "#0E8A7E" }, { icon: Building2, label: "Urban", value: loc.urban, share: localityShareOfPoorQ3.urban, tone: "blue" as const, glow: "#2F6DB5" }].map(l => (
              <div key={l.label} className="mpi-glow rounded-[var(--radius-lg)] border border-line bg-surface-muted p-4" style={{ ["--glow" as string]: l.glow }}>
                <div className="flex items-center gap-2.5"><IconTile icon={l.icon} tone={l.tone} size="sm" /><p className="text-[13px] font-semibold text-ink">{l.label}</p></div>
                <p className="mt-3 text-[36px] font-extrabold leading-none tracking-tight text-ink"><CountUp value={l.value} format={pct} /></p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">of {l.label.toLowerCase()} residents are multidimensionally poor</p>
                <span className="mt-3 block h-2 rounded-full bg-white"><span aria-hidden="true" className="mpi-grow block h-full rounded-full" style={{ width: `${l.value}%`, background: l.glow }} /></span>
                <p className="mt-3 border-t border-line pt-2 text-xs leading-relaxed text-body"><span className="font-semibold text-ink">{pct(l.share)}</span> of all multidimensionally poor people live in {l.label.toLowerCase()} areas</p>
              </div>
            ))}
          </div>
        </ChartCard>
        <PlacePreview go={go} openRegion={openRegion} openDistrict={openDistrict} />
      </Grid>

      <SectionHead step={3} title="What is behind it?" hint="Health and living conditions make up most of measured poverty" />
      <ChartCard className="mpi-lift" title="Where measured poverty comes from" subtitle="% of the national MPI score that comes from each area of life (percentage contribution)" period="2025 Q3"
        notes="This is a share of the poverty score, not a share of people. The four shares add to 100."
        source={src("Table 6.6, pp. 33 to 34")}
        footer={<DataDisclosure><DataTable caption="Contribution of each dimension to the national MPI" headings={["Quarter", "Health", "Living conditions", "Education", "Employment"]} rows={dimensionContribution.map(d => [d.quarter, d.health, d.living, d.education, d.employment])} decimals={1} minWidth={460} unitNote="% of the MPI. 2025 Q1 is not published in this table." /></DataDisclosure>}>
        <ShareBar values={dimsQ3} label="Contribution of each dimension to the national MPI, 2025 Q3" height={40} />
        <ul className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {dimensions.map(d => (
            <li key={d.key} className="mpi-glow rounded-[var(--radius-md)] border border-line p-3.5" style={{ ["--glow" as string]: d.color }}>
              <p className="flex items-center gap-2 text-[13px] font-medium text-body"><span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: d.color }} />{d.label}</p>
              <p className="mt-1.5 text-[26px] font-extrabold leading-none tracking-tight text-ink"><CountUp value={dimsQ3[d.key]} format={pct} /></p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] leading-relaxed text-body">Health and living conditions together make up <b className="font-semibold text-ink">{pct(dimsQ3.health + dimsQ3.living)}</b> of measured poverty.</p>
      </ChartCard>

      <Grid cols={2} className="mt-4 lg:mt-5">
        <ChartCard className="mpi-lift" title="The 13 basic needs: how much each adds to poverty" subtitle="% of the national MPI score that comes from each indicator (percentage contribution)" period="2025 Q3"
          notes="An indicator adds more when many poor people lack it and when it carries a larger weight. Read as “26.5% of measured poverty comes from lacking health insurance”, not “26.5% of people”."
          source={src("Table 6.7, p. 37")}
          footer={<DataDisclosure><DataTable caption="Contribution of each indicator to the national MPI" headings={["Indicator", "Dimension", "Weight", "2025 Q2 (%)", "2025 Q3 (%)"]} rows={contributions.map(i => [i.label, dimensionOf(i.dimension).label, i.weight, i.q2, i.value])} decimals={1} minWidth={520} /></DataDisclosure>}>
          <DimensionLegend className="mb-3" />
          <BarList caption="Contribution of each indicator to the national MPI, 2025 Q3" max={30} rows={contributions.map(i => ({ label: i.label, value: i.value, color: dimensionOf(i.dimension).color, swatchLabel: dimensionOf(i.dimension).label }))} />
        </ChartCard>

        <ChartCard className="mpi-lift" title="What poor households go without" subtitle="% of all people in Ghana who are multidimensionally poor and lack each basic need (censored headcount ratio)" period="2025 Q3"
          notes={<>This one is a share of people. Between 2025 Q2 and Q3 the published figure for overcrowding rose from {pct(censoredHeadcount.overcrowding[last - 1])} to {pct(censoredHeadcount.overcrowding[last])} and school lag fell from {pct(censoredHeadcount.lag[last - 1])} to {pct(censoredHeadcount.lag[last])}; the report flags overcrowding as an emerging pressure.</>}
          source={src("Table 6.1, p. 27")}
          footer={<DataDisclosure><DataTable caption="Censored headcount ratios by quarter" headings={["Indicator", ...censoredQuarters]} rows={lacking.map(i => [i.label, ...censoredHeadcount[i.key]])} decimals={1} minWidth={640} unitNote="% of the total population who are multidimensionally poor and deprived in the indicator." /></DataDisclosure>}>
          <DimensionLegend className="mb-3" />
          <BarList caption="Share of the population who are multidimensionally poor and deprived in each indicator, 2025 Q3" max={30}
            rows={lacking.map(i => ({ label: i.label, sub: `${signedPp(i.value - i.prev)} on Q2`, value: i.value, color: dimensionOf(i.dimension).color, swatchLabel: dimensionOf(i.dimension).label }))} />
        </ChartCard>
      </Grid>

      <AnnualSections openDistrict={openDistrict} />
    </div>
  );
}
