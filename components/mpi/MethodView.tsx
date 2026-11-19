"use client";

import { useState } from "react";
import { Briefcase, GraduationCap, HeartPulse, Home, RotateCcw, type LucideIcon } from "lucide-react";
import { Card, ChartCard } from "@/components/ui/Card";
import { Grid } from "@/components/ui/Page";
import { dimensions, fileUrl, indicators, mpiSources, type DimensionKey } from "@/data/mpiData";
import { latest, quarterlySources } from "@/data/mpiQuarterlyData";
import { Caveat, Lead, SectionHead, SourceLink, pct } from "./parts";

const icons: Record<DimensionKey, LucideIcon> = { health: HeartPulse, living: Home, education: GraduationCap, employment: Briefcase };
/** Weights as whole parts of 168 (the common denominator of 1/4, 1/8, 1/12 and 1/28), so the one-third line is exact. */
const PARTS = 168, LINE = 56;
const parts = (weightValue: number) => Math.round(weightValue * PARTS);
const examples: { label: string; keys: string[] }[] = [
  { label: "No health insurance, shared toilet, overcrowded", keys: ["insurance", "toilet", "overcrowding"] },
  { label: "No one employed and no health insurance", keys: ["employment", "insurance"] },
  { label: "All seven living conditions", keys: ["toilet", "overcrowding", "housing", "assets", "fuel", "water", "electricity"] },
];

function WorkedExample() {
  const [picked, setPicked] = useState<Set<string>>(new Set(examples[0].keys));
  const score = indicators.filter(i => picked.has(i.key)).reduce((sum, i) => sum + parts(i.weightValue), 0);
  const scorePct = (score / PARTS) * 100;
  const poor = score >= LINE;
  const toggle = (key: string) => setPicked(prev => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  return (
    <ChartCard title="Try it: when is a household counted?" subtitle="Tick what a household goes without. The weights add up to a deprivation score." period="Official weights, Table 4.1"
      notes="An illustration of the counting rule using the official weights. It does not use or produce any statistic."
      source={`${mpiSources.census} · Table 4.1, p. 10`}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="grid gap-4 sm:grid-cols-2">
          {dimensions.map(dim => (
            <fieldset key={dim.key} className="min-w-0">
              <legend className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold text-ink"><span aria-hidden="true" className="h-3 w-3 rounded-[3px]" style={{ background: dim.color }} />{dim.label}</legend>
              {indicators.filter(i => i.dimension === dim.key).map(i => (
                <label key={i.key} className="flex min-h-9 cursor-pointer items-start gap-2.5 rounded-md px-1.5 py-1.5 text-[13px] leading-snug text-body hover:bg-surface-muted">
                  <input type="checkbox" checked={picked.has(i.key)} onChange={() => toggle(i.key)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#3C2FA3]" />
                  <span>{i.plain}<span className="tabular text-subtle"> · weight {i.weight}</span></span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>
        <div className="flex flex-col rounded-[var(--radius-md)] bg-surface-muted p-4" aria-live="polite">
          <p className="text-[13px] font-medium text-muted">Deprivation score</p>
          <p className="mt-1 flex items-baseline gap-1 text-ink"><span className="text-[40px] font-semibold leading-none tracking-tight">{scorePct.toFixed(1)}</span><span className="text-[20px] font-medium text-muted">%</span></p>
          <div className="relative mt-4 h-4 rounded-[4px] bg-white ring-1 ring-inset ring-line" role="img" aria-label={`Deprivation score ${scorePct.toFixed(1)}% against the one-third line`}>
            <div className="flex h-full gap-[2px] overflow-hidden rounded-[4px]">
              {indicators.filter(i => picked.has(i.key)).map(i => <span key={i.key} title={i.label} style={{ width: `${(parts(i.weightValue) / PARTS) * 100}%`, background: dimensions.find(d => d.key === i.dimension)!.color }} />)}
            </div>
            <span aria-hidden="true" className="absolute -inset-y-1.5 w-0.5 bg-ink" style={{ left: `${(LINE / PARTS) * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted">The dark line marks one third (33.3%).</p>
          <p className={`mt-4 rounded-[var(--radius-sm)] px-3 py-2.5 text-[13px] font-semibold leading-snug ${poor ? "bg-nav text-white" : "bg-white text-ink ring-1 ring-inset ring-line"}`}>
            {poor ? "At or above one third: everyone in this household is counted as multidimensionally poor." : "Below one third: this household is not counted as multidimensionally poor, although it still goes without some basic needs."}
          </p>
          <p className="mt-3 text-xs font-medium text-muted">Examples</p>
          <div className="mt-1.5 flex flex-col items-start gap-1.5">
            {examples.map(e => <button key={e.label} type="button" onClick={() => setPicked(new Set(e.keys))} className="min-h-8 rounded-full border border-line bg-white px-3 text-left text-xs font-medium text-brand hover:border-brand-line hover:bg-brand-soft">{e.label}</button>)}
            <button type="button" onClick={() => setPicked(new Set())} className="inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-muted hover:bg-white"><RotateCcw size={13} aria-hidden="true" />Clear</button>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

export default function MethodView() {
  return (
    <div>
      <Lead kicker="How is it measured?">
        Multidimensional poverty is not about income. It asks whether a household goes without basic needs in health, living conditions, education and employment, and counts people who lack at least one third of them.
      </Lead>

      <SectionHead step={1} title="Thirteen basic needs in four areas of life" />
      <Grid cols={4}>
        {dimensions.map(dim => {
          const Icon = icons[dim.key];
          const list = indicators.filter(i => i.dimension === dim.key);
          return (
            <Card key={dim.key} as="section" className="mpi-lift overflow-hidden"><span aria-hidden="true" className="block h-1.5" style={{ background: dim.color }} /><div className="p-4">
              <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-white" style={{ background: dim.color }}><Icon size={18} /></span>
                <div><h4 className="text-[15px] font-semibold leading-tight text-ink">{dim.label}</h4><p className="text-xs text-muted">{list.length} {list.length === 1 ? "indicator" : "indicators"} · weight {dim.weight}</p></div>
              </div>
              <ul className="mt-3 space-y-2">
                {list.map(i => (
                  <li key={i.key} className="text-[13px] leading-snug">
                    <details className="group">
                      <summary className="cursor-pointer list-none rounded px-1 py-0.5 hover:bg-surface-muted [&::-webkit-details-marker]:hidden">
                        <span className="font-medium text-ink">{i.label}</span><span className="tabular text-subtle"> · {i.weight}</span>
                        <span className="block text-body">{i.plain}</span>
                        <span className="text-xs font-medium text-brand group-open:hidden">Official definition</span>
                      </summary>
                      <p className="mt-1 rounded-[var(--radius-sm)] bg-surface-muted px-2 py-1.5 text-xs leading-relaxed text-muted">{i.cutoff}</p>
                    </details>
                  </li>
                ))}
              </ul>
              </div>
            </Card>
          );
        })}
      </Grid>
      <p className="mt-3 text-xs leading-relaxed text-subtle">Each area of life counts for a quarter. Within an area the indicators share the weight equally, so one living-conditions indicator (1/28) counts for less than health insurance (1/8) or employment (1/4). Weights: {mpiSources.census}, Table 4.1, p. 10. Definitions: {mpiSources.factsheets}.</p>

      <SectionHead step={2} title="Add up what a household lacks" />
      <WorkedExample />

      <SectionHead step={3} title="Three numbers describe the result" />
      <Grid cols={3}>
        {[
          { name: "Incidence (H)", plain: "How many people?", value: pct(latest.incidence), text: "The share of the population who are multidimensionally poor. Also called the headcount ratio." },
          { name: "Intensity (A)", plain: "How deep?", value: pct(latest.intensity!), text: "The average share of the weighted basic needs that multidimensionally poor people lack. It cannot be below 33.3%." },
          { name: "MPI", plain: "Both together", value: latest.mpi!.toFixed(3), text: `Incidence multiplied by intensity: ${(latest.incidence / 100).toFixed(3)} × ${(latest.intensity! / 100).toFixed(3)} = ${latest.mpi!.toFixed(3)}. It falls when fewer people are poor or when poor people lack fewer things.` },
        ].map(n => (
          <Card key={n.name} className="mpi-lift mpi-glow p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">{n.plain}</p>
            <h4 className="mt-1 text-[15px] font-semibold text-ink">{n.name}</h4>
            <p className="mt-2 text-[32px] font-extrabold leading-none tracking-tight text-brand">{n.value}</p>
            <p className="mt-1 text-xs font-medium text-ink">Ghana, 2025 Q3</p>
            <p className="mt-2 text-[13px] leading-relaxed text-body">{n.text}</p>
          </Card>
        ))}
      </Grid>

      <Grid cols={2} className="mt-8">
        <ChartCard title="Words used on this page" subtitle="Plain wording beside the official term" source={`${mpiSources.census}, section 2, pp. 3 to 6`}>
          <dl className="divide-y divide-line">
            <div className="grid gap-x-5 gap-y-0.5 py-2.5 sm:grid-cols-[13rem_minmax(0,1fr)]"><dt className="text-[13.5px] font-semibold text-ink">Multidimensionally poor</dt><dd className="text-[13.5px] leading-relaxed text-body">Deprived in at least one third of the weighted indicators.</dd></div>
            <div className="grid gap-x-5 gap-y-0.5 py-2.5 sm:grid-cols-[13rem_minmax(0,1fr)]"><dt className="text-[13.5px] font-semibold text-ink">Deprived</dt><dd className="text-[13.5px] leading-relaxed text-body">Below the official cut-off for an indicator, for example having no electric power.</dd></div>
            <div className="grid gap-x-5 gap-y-0.5 py-2.5 sm:grid-cols-[13rem_minmax(0,1fr)]"><dt className="text-[13.5px] font-semibold text-ink">Incidence, headcount ratio (H)</dt><dd className="text-[13.5px] leading-relaxed text-body">Share of the population who are multidimensionally poor.</dd></div>
            <div className="grid gap-x-5 gap-y-0.5 py-2.5 sm:grid-cols-[13rem_minmax(0,1fr)]"><dt className="text-[13.5px] font-semibold text-ink">Intensity (A)</dt><dd className="text-[13.5px] leading-relaxed text-body">Average share of weighted indicators in which poor people are deprived.</dd></div>
            <div className="grid gap-x-5 gap-y-0.5 py-2.5 sm:grid-cols-[13rem_minmax(0,1fr)]"><dt className="text-[13.5px] font-semibold text-ink">MPI, adjusted headcount ratio (M0)</dt><dd className="text-[13.5px] leading-relaxed text-body">Incidence multiplied by intensity, from 0 to 1.</dd></div>
            <div className="grid gap-x-5 gap-y-0.5 py-2.5 sm:grid-cols-[13rem_minmax(0,1fr)]"><dt className="text-[13.5px] font-semibold text-ink">Censored headcount ratio</dt><dd className="text-[13.5px] leading-relaxed text-body">Share of the whole population who are poor and deprived in an indicator.</dd></div>
            <div className="grid gap-x-5 gap-y-0.5 py-2.5 sm:grid-cols-[13rem_minmax(0,1fr)]"><dt className="text-[13.5px] font-semibold text-ink">Uncensored headcount ratio</dt><dd className="text-[13.5px] leading-relaxed text-body">Share of the whole population deprived in an indicator, poor or not.</dd></div>
            <div className="grid gap-x-5 gap-y-0.5 py-2.5 sm:grid-cols-[13rem_minmax(0,1fr)]"><dt className="text-[13.5px] font-semibold text-ink">Percentage contribution</dt><dd className="text-[13.5px] leading-relaxed text-body">Share of the MPI score that comes from an indicator or dimension. Shares add to 100.</dd></div>
            <div className="grid gap-x-5 gap-y-0.5 py-2.5 sm:grid-cols-[13rem_minmax(0,1fr)]"><dt className="text-[13.5px] font-semibold text-ink">Small area estimation</dt><dd className="text-[13.5px] leading-relaxed text-body">A statistical model that combines census and survey data to estimate figures for districts.</dd></div>
          </dl>
        </ChartCard>
        <div className="flex min-w-0 flex-col gap-4">
          <Caveat title="Two series, not to be mixed">
            <ul className="list-disc space-y-1 pl-4">
              <li><strong className="font-semibold">Quarterly survey series</strong> (national, regional, household groups, 2022 Q1 to 2025 Q3): sample surveys of households, the Annual Household Income and Expenditure Survey and, for 2025, the Quarterly Labour Force Survey.</li>
              <li><strong className="font-semibold">Annual series</strong>: the 2021 Population and Housing Census (a full count, published for Ghana, regions, household groups and districts) and, for 2022 to 2025, small area estimates for the 261 districts that combine the census with those surveys. Incidence uses the Elbers, Lanjouw and Lanjouw method; intensity uses a Fay-Herriot Bayesian approach. No margins of error are published.</li>
              <li>Figures from one series are never compared with, or subtracted from, figures from the other.</li>
            </ul>
          </Caveat>
          <Caveat title="What the figures cannot tell you">
            <ul className="list-disc space-y-1 pl-4">
              <li>Ghana’s MPI is a national measure with its own indicators and weights. It is not comparable with other countries’ MPIs.</li>
              <li>It is not a measure of income or consumption poverty. A household can be poor on one measure and not the other.</li>
              <li>The household is assessed as a unit: everyone in it shares the same result.</li>
              <li>The second health indicator was mortality in 2021 and is child nutrition from 2022, so indicator shares for 2021 are not compared with later years.</li>
              <li>Contribution figures are shares of the poverty score, not shares of people.</li>
            </ul>
          </Caveat>
          <Card className="p-4">
            <h4 className="text-[15px] font-semibold text-ink">Go to the official sources</h4>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">Every figure on this page is published by the Ghana Statistical Service. Nothing is modelled or forecast by the dashboard.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <SourceLink href={fileUrl(quarterlySources.reportKey)}>Quarterly report, 2024 Q1 to 2025 Q3 (PDF)</SourceLink>
              <SourceLink href={fileUrl(quarterlySources.infographicKey)}>2025 infographic (PDF)</SourceLink>
              <SourceLink href={fileUrl(mpiSources.censusKey)}>Multidimensional Poverty Report, 2021 census (PDF)</SourceLink>
              <SourceLink href={fileUrl(mpiSources.rankingKey)}>District rankings, 2021 to 2025 (PDF)</SourceLink>
              <SourceLink href={`${mpiSources.reportsUrl}?q=District+Multidimensional`}>261 district fact sheets</SourceLink>
              <SourceLink href={mpiSources.statsbankUrl}>StatsBank MPI tables</SourceLink>
              <SourceLink href={mpiSources.reportsUrl}>All administrative data reports</SourceLink>
            </div>
          </Card>
        </div>
      </Grid>
    </div>
  );
}
