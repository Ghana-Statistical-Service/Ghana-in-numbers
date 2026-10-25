"use client";

import { useEffect, useMemo, useState } from "react";
import { buildPathD, computeBounds, createProjector, getFeatureName, isValidGeometry, type FeatureCollection } from "@/lib/geojsonToSvg";

const VIEW_W = 400;
const VIEW_H = 500;
export const SEQUENTIAL = ["#EEECFA", "#CDC7EF", "#A49ADF", "#7365C7", "#3C2FA3"];
const DIVERGING_NEG = ["#B65B1C", "#E3A066", "#F6D9BD"];
const DIVERGING_POS = ["#D9D5F3", "#9C93DB", "#3C2FA3"];

let geoCache: Promise<FeatureCollection> | null = null;
export const loadRegions = () => (geoCache ??= fetch("/map/Regions.gh.json").then(r => r.json() as Promise<FeatureCollection>));

export type RegionValue = { region: string; value: number | null; flag?: string };

type Props = {
  data: RegionValue[];
  measure: string;              // e.g. "Share of national population"
  format: (value: number) => string;
  scale?: "sequential" | "diverging";
  /** Diverging scales use symmetric thresholds around zero, e.g. [100000, 300000]. */
  divergingBreaks?: [number, number];
  ranked?: boolean;             // show the ranked list beside the map
  height?: number;
  highlight?: string;           // e.g. "National" reference shown in the list footer
  footnote?: string;
  /** Fixed bar scale for the ranked list, e.g. 100 for shares of a whole; defaults to the largest value. */
  barMax?: number;
};

function quantileBreaks(values: number[], classes: number) {
  const sorted = [...values].sort((a, b) => a - b);
  return Array.from({ length: classes - 1 }, (_, i) => sorted[Math.round(((i + 1) * (sorted.length - 1)) / classes)]);
}

export default function RegionalMap({ data, measure, format, scale = "sequential", divergingBreaks, ranked = true, height = 420, highlight, footnote, barMax }: Props) {
  const [geo, setGeo] = useState<FeatureCollection | null>(null);
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => { let live = true; loadRegions().then(g => { if (live) setGeo(g); }).catch(() => undefined); return () => { live = false; }; }, []);

  const paths = useMemo(() => {
    const features = (geo?.features ?? []).filter(f => isValidGeometry(f.geometry));
    if (!features.length) return [];
    const project = createProjector(computeBounds(features), VIEW_W, VIEW_H, 12);
    return features.map(f => ({ name: getFeatureName(f.properties ?? undefined), d: buildPathD(f.geometry as never, project) }));
  }, [geo]);

  const byRegion = useMemo(() => new Map(data.map(d => [d.region, d])), [data]);
  const numeric = data.map(d => d.value).filter((v): v is number => typeof v === "number");

  const { colorOf, legend } = useMemo(() => {
    if (scale === "diverging" && divergingBreaks) {
      const [a, b] = divergingBreaks;
      const colorOf = (v: number) => v < -b ? DIVERGING_NEG[0] : v < -a ? DIVERGING_NEG[1] : v < 0 ? DIVERGING_NEG[2] : v < a ? DIVERGING_POS[0] : v < b ? DIVERGING_POS[1] : DIVERGING_POS[2];
      const legend = [
        { color: DIVERGING_NEG[0], label: `Below −${format(b)}` }, { color: DIVERGING_NEG[1], label: `−${format(b)} to −${format(a)}` }, { color: DIVERGING_NEG[2], label: `−${format(a)} to 0` },
        { color: DIVERGING_POS[0], label: `0 to ${format(a)}` }, { color: DIVERGING_POS[1], label: `${format(a)} to ${format(b)}` }, { color: DIVERGING_POS[2], label: `Above ${format(b)}` },
      ];
      return { colorOf, legend };
    }
    if (!numeric.length) return { colorOf: () => SEQUENTIAL[0], legend: [] as { color: string; label: string }[] };
    const breaks = quantileBreaks(numeric, SEQUENTIAL.length);
    const colorOf = (v: number) => SEQUENTIAL[breaks.filter(b => v > b).length];
    const min = Math.min(...numeric), max = Math.max(...numeric);
    const edges = [min, ...breaks, max];
    const legend = SEQUENTIAL.map((color, i) => ({ color, label: `${format(edges[i])}–${format(edges[i + 1])}` }));
    return { colorOf, legend };
  }, [scale, divergingBreaks, numeric.join(","), format]); // eslint-disable-line react-hooks/exhaustive-deps

  const sorted = [...data].sort((a, b) => (b.value ?? -Infinity) - (a.value ?? -Infinity));
  const maxAbs = barMax ?? (Math.max(...numeric.map(Math.abs), 0) || 1);
  const activeDatum = active ? byRegion.get(active) : null;
  const rank = activeDatum?.value != null ? sorted.findIndex(d => d.region === active) + 1 : null;

  return (
    <div className={`grid gap-5 ${ranked ? "md:grid-cols-[minmax(0,1fr)_minmax(17rem,1fr)] xl:grid-cols-[minmax(0,440px)_minmax(17rem,1fr)] xl:gap-10" : ""}`}>
      <div className="relative min-w-0">
        <div className="pointer-events-none z-10 mb-2 min-h-[58px] rounded-[var(--radius-md)] border border-line bg-surface/95 px-3 py-2 shadow-card md:absolute md:left-0 md:top-0 md:mb-0 md:max-w-[60%]" aria-live="polite">
          {activeDatum ? (
            <>
              <p className="text-[13px] font-semibold text-ink">{activeDatum.region}</p>
              <p className="tabular text-[13px] text-body">{activeDatum.value == null ? "Not reported" : format(activeDatum.value)}{rank ? <span className="text-subtle"> · rank {rank} of {numeric.length}</span> : null}</p>
              {activeDatum.flag && <p className="mt-0.5 text-xs text-caution">{activeDatum.flag}</p>}
            </>
          ) : <p className="text-[12.5px] leading-snug text-muted">Hover or focus on a region to read its value.</p>}
        </div>
        {paths.length ? (
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ maxHeight: height }} className="mx-auto block h-auto w-full" role="group" aria-label={`Map of Ghana's 16 regions: ${measure}`}>
            <defs>
              <pattern id="no-data" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#F4F5F9" /><line x1="0" y1="0" x2="0" y2="6" stroke="#CBD1DD" strokeWidth="2" /></pattern>
            </defs>
            {paths.map(({ name, d }) => {
              const datum = byRegion.get(name);
              const v = datum?.value;
              const isActive = active === name;
              return (
                <path key={name} d={d} tabIndex={0} role="img"
                  aria-label={`${name}: ${v == null ? "not reported" : format(v)}`}
                  fill={v == null ? "url(#no-data)" : colorOf(v)}
                  stroke={isActive ? "#0F172B" : "#FFFFFF"} strokeWidth={isActive ? 1.8 : 0.9} strokeLinejoin="round"
                  className="cursor-pointer outline-none transition-[stroke] focus-visible:stroke-[#0F172B]"
                  onMouseEnter={() => setActive(name)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(name)} onBlur={() => setActive(null)} />
              );
            })}
          </svg>
        ) : <div style={{ height }} className="animate-pulse rounded-[var(--radius-md)] bg-surface-muted" />}
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium text-muted">{measure}</p>
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-body">
            {legend.map(item => <li key={item.color} className="flex items-center gap-1.5"><span aria-hidden className="h-3 w-4 rounded-[2px] ring-1 ring-inset ring-black/5" style={{ background: item.color }} /><span className="tabular">{item.label}</span></li>)}
            {data.some(d => d.value == null) && <li className="flex items-center gap-1.5"><span aria-hidden className="h-3 w-4 rounded-[2px]" style={{ background: "repeating-linear-gradient(45deg,#F4F5F9 0 2px,#CBD1DD 2px 4px)" }} />Not reported</li>}
          </ul>
        </div>
      </div>

      {ranked && (
        <div className="min-w-0">
          <p className="mb-2 text-xs font-medium text-muted">Regions ranked, highest first</p>
          <ol className="space-y-[3px]">
            {sorted.map((d, i) => {
              const v = d.value;
              const width = v == null ? 0 : (Math.abs(v) / maxAbs) * 100;
              const isActive = active === d.region;
              return (
                <li key={d.region}>
                  <div onMouseEnter={() => setActive(d.region)} onMouseLeave={() => setActive(null)}
                    className={`grid w-full grid-cols-[1.25rem_7rem_minmax(2.5rem,1fr)_4.5rem] items-center gap-2 rounded-md px-1.5 py-[3px] text-left text-[12.5px] ${isActive ? "bg-brand-soft" : "hover:bg-surface-muted"}`}>
                    <span className="tabular text-right text-subtle">{v == null ? "–" : i + 1}</span>
                    <span className="truncate text-body">{d.region}{d.flag && <span className="text-caution" title={d.flag}> *</span>}</span>
                    <span className="relative h-2.5 rounded-full bg-surface-muted"><span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${width}%`, background: v == null ? "transparent" : v < 0 ? "#D9823F" : "#7365C7" }} /></span>
                    <span className="tabular text-right font-medium text-ink">{v == null ? <><span aria-hidden className="text-subtle">n/r</span><span className="sr-only">Not reported</span></> : format(v)}</span>
                  </div>
                </li>
              );
            })}
          </ol>
          {data.some(d => d.value == null) && <p className="mt-2 text-xs text-subtle">n/r: not reported separately in the source.</p>}
          {highlight && <p className="mt-2 border-t border-line pt-2 text-[12.5px] text-muted">{highlight}</p>}
          {footnote && <p className="mt-1 text-xs text-subtle">{footnote}</p>}
        </div>
      )}
    </div>
  );
}
