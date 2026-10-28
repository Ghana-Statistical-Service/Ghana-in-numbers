"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Area, AreaChart, LabelList, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, TrendingDown } from "lucide-react";
import CardExplanation from "@/components/shared/CardExplanation";
import { Qualifier } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Data";
import { C, ChartFrame, axisCommon, makeTooltip, tick } from "@/components/ui/chart";
import { SEQUENTIAL, loadRegions } from "@/components/maps/RegionalMap";
import { buildPathD, computeBounds, createProjector, getFeatureName, isValidGeometry, type FeatureCollection } from "@/lib/geojsonToSvg";
import { gdpGrowthData, inflationSparklineData } from "@/data/dummy";
import { sectorShare2025 } from "@/data/businessEconomyData";
import { REGIONS } from "@/data/publicationAdditions";

/*
 * Dense "at a glance" overview, rebuilt on the layout of commit 2593469 (the original deployment) with the
 * redesign's content, badges, tokens and fixes. Designed to fit a 1440×900 or 1280×800 screen without scrolling.
 */

const panel = "min-w-0 rounded-[var(--radius-lg)] border border-line bg-surface shadow-card";

function GlanceKpi({ label, value, unit, period, qualifier, note, explain }: { label: string; value: string; unit: string; period: string; qualifier?: string; note: string; explain: { label?: string; indicator?: string } }) {
  const tight = unit === "%";
  return (
    <article className={`${panel} flex flex-col px-3 pb-2.5 pt-2.5 min-[1440px]:px-3.5`}>
      <div className="flex items-start justify-between gap-1.5">
        <h3 className="text-[13.5px] font-semibold leading-tight text-ink">{label}</h3>
        <CardExplanation {...explain} compact />
      </div>
      <p className="tabular mt-1 flex items-baseline gap-1 text-ink"><span className="text-[26px] font-semibold leading-none tracking-tight min-[1440px]:text-[28px]">{value}</span><span className={`font-medium text-muted ${tight ? "text-lg" : "text-[13px]"}`}>{unit}</span></p>
      <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-body">{period}{qualifier && <Qualifier tone="caution">{qualifier}</Qualifier>}</p>
      <p className="mt-auto pt-1 text-xs leading-snug text-subtle">{note}</p>
    </article>
  );
}

function InflationGlance() {
  const last = inflationSparklineData.at(-1)!;
  return (
    <article className={`${panel} flex flex-col overflow-hidden px-3 pb-2 pt-2.5 min-[1440px]:px-3.5`}>
      <div className="flex items-start justify-between gap-1.5">
        <h3 className="text-[13.5px] font-semibold leading-tight text-ink">Inflation trend</h3>
        <CardExplanation indicator="inflation" compact />
      </div>
      <p className="tabular mt-1 flex items-baseline gap-1.5 text-ink"><span className="text-[26px] font-semibold leading-none tracking-tight min-[1440px]:text-[28px]">{last.value}%</span><TrendingDown size={16} aria-label="down from 23.5% in January 2024" className="text-muted" /></p>
      <p className="mt-1 text-xs font-medium text-body">Dec 2025, y/y</p>
      <div className="mt-1 min-h-0 flex-1">
        <ChartFrame height={44} label="Monthly year-on-year inflation from 23.5% in January 2024 to 5.4% in December 2025">
          <AreaChart data={inflationSparklineData} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
            <defs><linearGradient id="glance-infl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.purple} stopOpacity={0.22} /><stop offset="100%" stopColor={C.purple} stopOpacity={0.02} /></linearGradient></defs>
            <YAxis hide domain={[0, 30]} />
            <XAxis dataKey="month" hide />
            <Tooltip content={makeTooltip({ unit: "%" })} />
            <Area type="monotone" dataKey="value" name="Year-on-year inflation" stroke={C.purple} strokeWidth={2} fill="url(#glance-infl)" dot={false} activeDot={{ r: 3 }} isAnimationActive={false} />
          </AreaChart>
        </ChartFrame>
      </div>
      <p className="text-xs text-subtle">Jan 2024 – Dec 2025</p>
    </article>
  );
}

function Narrative() {
  const b = (t: ReactNode) => <strong className="tabular font-semibold text-ink">{t}</strong>;
  return (
    <p className={`${panel} flex items-center gap-3 px-4 py-2 text-[13px] leading-snug text-body`}>
      <span aria-hidden className="h-6 w-1 shrink-0 rounded-full bg-brand" />
      <span>Ghana&apos;s {b("33.7 million")} people (2025 projection) live in an economy that grew {b("6.0%")} in 2025 (provisional), with year-on-year inflation of {b("5.4%")} in December 2025. National unemployment averaged {b("12.8%")} across Q1–Q3 2025.</span>
    </p>
  );
}

type Raw = { response: { data: { key: string[]; values: string[] }[] } };
function useGlanceRegional() {
  const [geo, setGeo] = useState<FeatureCollection | null>(null);
  const [pop, setPop] = useState<Record<string, number>>({});
  const [cpi, setCpi] = useState<Record<string, number>>({});
  useEffect(() => {
    let live = true;
    loadRegions().then(g => live && setGeo(g)).catch(() => undefined);
    Promise.all([fetch("/data/projectionData.json").then(r => r.json() as Promise<Raw>), fetch("/data/cpiData.json").then(r => r.json() as Promise<Raw>)]).then(([p, c]) => {
      if (!live) return;
      const pm: Record<string, number> = {}; for (const d of p.response.data) if (d.key[0] === "2025") pm[d.key[1]] = parseInt(d.values[0], 10);
      const cm: Record<string, number> = {}; for (const d of c.response.data) if (d.key[1] === "2025M12" && d.key[0].startsWith("Year")) cm[d.key[2]] = parseFloat(d.values[0]);
      setPop(pm); setCpi(cm);
    }).catch(() => undefined);
    return () => { live = false; };
  }, []);
  return { geo, pop, cpi };
}

function GlanceMap() {
  const { geo, pop, cpi } = useGlanceRegional();
  const [ind, setInd] = useState<"population" | "inflation">("population");
  const [active, setActive] = useState<string | null>(null);
  const values = ind === "population" ? pop : cpi;
  const paths = useMemo(() => {
    const f = (geo?.features ?? []).filter(x => isValidGeometry(x.geometry));
    if (!f.length) return [];
    const project = createProjector(computeBounds(f), 400, 500, 10);
    return f.map(x => ({ name: getFeatureName(x.properties ?? undefined), d: buildPathD(x.geometry as never, project) }));
  }, [geo]);
  const nums = REGIONS.map(r => values[r]).filter((v): v is number => Number.isFinite(v)).sort((a, b) => a - b);
  const breaks = nums.length ? [1, 2, 3, 4].map(i => nums[Math.round((i * (nums.length - 1)) / 5)]) : [];
  const color = (v?: number) => v == null || !Number.isFinite(v) ? "#F4F5F9" : SEQUENTIAL[breaks.filter(b => v > b).length];
  const fmt = (v: number) => ind === "population" ? (v >= 1e6 ? `${(v / 1e6).toFixed(2)}M` : `${Math.round(v / 1000)}k`) : `${v.toFixed(1)}%`;
  const national = values.Ghana;
  const edges = nums.length ? [nums[0], ...breaks, nums.at(-1)!] : [];

  return (
    <article className={`${panel} flex min-h-[320px] flex-col p-4 lg:min-h-0`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">Current indicator by region</h3>
          <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">{ind === "population" ? <>Projected population, 2025 <Qualifier tone="caution">Projection</Qualifier></> : "Year-on-year consumer inflation, December 2025"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Segmented label="Map indicator" size="sm" value={ind} onChange={setInd} options={[{ value: "population", label: "Population" }, { value: "inflation", label: "Consumer Inflation" }]} />
          <CardExplanation indicator={ind === "population" ? "population" : "inflation"} variant="link" />
        </div>
      </div>
      <div className="relative mt-2 min-h-0 flex-1">
        <div className="pointer-events-none absolute left-0 top-0 z-10 rounded-[var(--radius-md)] border border-line bg-surface/95 px-3 py-2 shadow-card" aria-live="polite">
          {active ? <><p className="text-xs font-medium text-muted">{active}</p><p className="tabular text-lg font-semibold leading-tight text-ink">{values[active] != null ? fmt(values[active]) : "Not reported"}</p></>
            : <><p className="text-xs font-medium text-muted">Ghana</p><p className="tabular text-lg font-semibold leading-tight text-ink">{national != null ? (ind === "population" ? `${(national / 1e6).toFixed(1)} million` : `${national.toFixed(1)}%`) : "—"}</p></>}
        </div>
        {paths.length ? (
          <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" role="group" aria-label={`Map of Ghana's regions: ${ind === "population" ? "projected population 2025" : "consumer inflation December 2025"}`}>
            {paths.map(({ name, d }) => (
              <path key={name} d={d} tabIndex={0} role="img" aria-label={`${name}: ${values[name] != null ? fmt(values[name]) : "not reported"}`} fill={color(values[name])}
                stroke={active === name ? "#0F172B" : "#FFFFFF"} strokeWidth={active === name ? 1.8 : 0.9} className="cursor-pointer outline-none"
                onMouseEnter={() => setActive(name)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(name)} onBlur={() => setActive(null)} />
            ))}
          </svg>
        ) : <div className="absolute inset-0 animate-pulse rounded-md bg-surface-muted" />}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2">
        <ul className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-body" aria-label="Map legend">
          {edges.length > 1 && SEQUENTIAL.map((c, i) => <li key={c} className="flex items-center gap-1"><span aria-hidden className="h-2.5 w-3.5 rounded-[2px] ring-1 ring-inset ring-black/5" style={{ background: c }} /><span className="tabular">{fmt(edges[i])}–{fmt(edges[i + 1])}</span></li>)}
        </ul>
        <a href="#regional-picture" className="flex items-center gap-1 text-xs font-medium text-brand hover:underline">Regional picture<ArrowRight size={13} aria-hidden /></a>
      </div>
    </article>
  );
}

function GdpGlance() {
  return (
    <article className={`${panel} flex min-h-[200px] flex-col overflow-hidden px-4 pb-2 pt-3 lg:min-h-0 lg:flex-1`}>
      <div className="flex items-start justify-between gap-2">
        <div><h3 className="text-[14px] font-semibold text-ink">GDP growth rate</h3><p className="text-xs text-muted">Real, % · 2025 provisional</p></div>
        <CardExplanation indicator="gdpGrowth" variant="link" />
      </div>
      <ChartFrame height={90} label="Real GDP growth: 2017 8.1%, 2018 6.2%, 2019 6.5%, 2020 0.5%, 2021 5.1%, 2022 3.8%, 2023 3.1%, 2024 5.8%, 2025 6.0% provisional">
        <LineChart data={gdpGrowthData} margin={{ top: 20, right: 18, left: 18, bottom: 6 }}>
          <XAxis dataKey="year" {...axisCommon} tick={tick} interval={0} />
          <YAxis hide domain={[0, 10]} />
          <ReferenceLine y={0} stroke={C.slateLight} />
          <Tooltip content={makeTooltip({ unit: "%", labelFormat: l => l === "2025" ? "2025 (provisional)" : l === "2024" ? "2024 (revised)" : l })} />
          <Line type="monotone" dataKey="value" name="Real GDP growth" stroke={C.purple} strokeWidth={2.25} dot={{ r: 3.5, fill: "#fff", stroke: C.purple, strokeWidth: 2 }} isAnimationActive={false}>
            <LabelList dataKey="value" content={p => { const { x, y, value, index } = p as { x: number; y: number; value: number; index: number }; const below = index % 2 === 1 && Number(value) > 1; return <text x={x} y={below ? y + 19 : y - 9} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ink}>{`${Number(value).toFixed(1)}%`}</text>; }} />
          </Line>
        </LineChart>
      </ChartFrame>
    </article>
  );
}

function SectorGlance() {
  return (
    <article className={`${panel} flex flex-col justify-between px-4 py-3`}>
      <div className="flex items-start justify-between gap-2">
        <div><h3 className="text-[14px] font-semibold text-ink">Sectoral share of nominal GDP</h3><p className="text-xs text-muted">2025 · % of GDP, sums to 100%</p></div>
        <CardExplanation indicator="sector" variant="link" />
      </div>
      <ul className="mt-1.5 space-y-1">
        {sectorShare2025.map(s => (
          <li key={s.name} className="grid grid-cols-[5.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-[13px]">
            <span className="text-body">{s.name}</span>
            {/* Scaled to the full 0–100% track, not to the largest sector. */}
            <span className="h-2.5 rounded-full bg-surface-muted"><span className="block h-full rounded-full bg-brand" style={{ width: `${s.value}%` }} /></span>
            <span className="tabular text-right font-semibold text-ink">{s.value.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

const selected = [
  { name: "Urban population", period: "2025, projection", value: "58.7%", href: "/population-and-society#urbanisation" },
  { name: "Active NHIS coverage", period: "2025", value: "66.2%", href: "/social-development#health" },
  { name: "Fiscal balance", period: "2025, commitment", value: "−1.0% of GDP", href: "/business-and-economy#fiscal", wide: true },
  { name: "Food insecurity", period: "Q1–Q3 2025", value: "39.8%", href: "/progress-on-sdgs#poverty-food" },
];

function BottomRow() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <article className={`${panel} flex flex-col px-4 py-3`}>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">From the publication</p>
        <p className="mt-1 flex items-center gap-2 text-[14.5px] font-semibold leading-snug text-ink"><TrendingDown size={18} aria-hidden className="shrink-0 text-brand" />Inflation slowed to 5.4%</p>
        <p className="mt-1 text-[13px] leading-snug text-body">December 2025, down from 54.1% in December 2022. Prices kept rising, but more slowly.</p>
        <Link href="/business-and-economy#prices" className="mt-auto flex items-center gap-1 pt-1.5 text-xs font-medium text-brand hover:underline">Prices and inflation<ArrowRight size={13} aria-hidden /></Link>
      </article>
      <article className={`${panel} flex flex-col px-4 py-3`}>
        <h3 className="text-[14px] font-semibold text-ink">Selected national indicators</h3>
        <ul className="mt-1.5 divide-y divide-line">
          {selected.map(s => (
            <li key={s.name} className={"wide" in s ? "hidden min-[1440px]:list-item" : ""}><Link href={s.href} className="flex items-baseline justify-between gap-2 py-1 text-[13px] hover:text-brand"><span className="min-w-0 whitespace-nowrap"><span className="text-body">{s.name}</span> <span className="text-xs text-subtle">· {s.period}</span></span><span className="tabular shrink-0 font-semibold text-ink">{s.value}</span></Link></li>
          ))}
        </ul>
      </article>
      <Link href="/youth-bulge" className="on-dark group flex flex-col rounded-[var(--radius-lg)] bg-nav px-4 py-3 text-white shadow-card transition-colors hover:bg-[#2C2270]">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/75">Data story</p>
        <h3 className="mt-0.5 text-[14.5px] font-semibold leading-snug text-white">Ghana&apos;s youth dividend</h3>
        <p className="mt-1 text-[13px] leading-snug text-white/85">~35% of Ghana&apos;s projected 33.7 million people are aged 15–35: an opportunity that depends on skills and jobs.</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-1.5 text-[13px] font-semibold text-white">Explore data story<ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" /></span>
      </Link>
    </div>
  );
}

export default function AtAGlance() {
  return (
    <section aria-labelledby="glance-title" className="mx-auto flex w-full max-w-[1400px] flex-col gap-2.5 px-4 pb-3 pt-3 sm:px-5 min-[1440px]:gap-3 min-[1440px]:pb-4 min-[1440px]:pt-4 lg:h-[calc(100dvh-48px)] lg:min-h-[680px]">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
        <h1 id="glance-title" className="text-2xl font-semibold leading-tight tracking-tight text-ink min-[1440px]:text-[26px]">Ghana at a glance</h1>
        <p className="text-xs text-muted">Ghana Statistical Service · <span className="font-medium text-body">Ghana in Numbers 2025</span> (published 2026) · Reference periods by indicator, to 2025</p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <GlanceKpi label="Population" value="33.7" unit="million" period="2025" qualifier="Projection" note="30.8 million at the 2021 census" explain={{ label: "Population" }} />
        <GlanceKpi label="GDP growth" value="6.0" unit="%" period="2025" qualifier="Provisional" note="5.8% in 2024 (revised)" explain={{ label: "GDP Growth" }} />
        <GlanceKpi label="Inflation (CPI)" value="5.4" unit="%" period="Dec 2025, y/y" note="Annual average 14.6% in 2025" explain={{ label: "Consumer Inflation" }} />
        <GlanceKpi label="Unemployment" value="12.8" unit="%" period="Q1–Q3 2025 avg" note="Share of the labour force" explain={{ label: "Unemployment" }} />
        <GlanceKpi label="Life expectancy" value="65.1" unit="years" period="At birth, 2021" note="Women 66.8, men 63.3 years" explain={{ label: "Life Expectancy" }} />
        <InflationGlance />
      </div>

      <Narrative />

      <div className="grid min-h-0 grid-cols-1 gap-3 lg:flex-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <GlanceMap />
        <div className="flex min-h-0 flex-col gap-3">
          <GdpGlance />
          <SectorGlance />
        </div>
      </div>

      <BottomRow />
    </section>
  );
}
