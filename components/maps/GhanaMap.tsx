"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildPathD, computeBounds, createProjector, getFeatureName, isValidGeometry, type FeatureCollection, type Geometry, type Position } from "@/lib/geojsonToSvg";

/**
 * Choropleth of Ghana in the style of the GSS Annual Economic Survey dashboard map: a continuous purple ramp,
 * white boundaries, a gold highlight with the place name on hover, a floating value card and a gradient legend
 * that marks the hovered value. Drawn in SVG, so it needs no chart library and works for regions and districts.
 */
export const MAP_RAMP = ["#EEECFA", "#D6D2F2", "#A59BE3", "#5040C9", "#3C2FA3", "#2C2270"];
export const MAP_GOLD = "#C9A227";
const VIEW_W = 400, VIEW_H = 500;
const SOURCES = { regions: "/map/Regions.gh.json", districts: "/map/District.gh.json" } as const;
const cache = new Map<string, Promise<FeatureCollection>>();
const load = (url: string) => { if (!cache.has(url)) cache.set(url, fetch(url).then(r => r.json() as Promise<FeatureCollection>)); return cache.get(url)!; };

const hex = (c: string) => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
/** Position 0 to 1 on the ramp, interpolated between neighbouring stops. */
export function rampColor(t: number) {
  const x = Math.min(1, Math.max(0, t)) * (MAP_RAMP.length - 1);
  const i = Math.min(MAP_RAMP.length - 2, Math.floor(x)), f = x - i;
  const a = hex(MAP_RAMP[i]), b = hex(MAP_RAMP[i + 1]);
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(",")})`;
}

function labelPoint(geometry: Geometry, project: (p: Position) => { x: number; y: number }) {
  const rings = geometry.type === "Polygon" ? [geometry.coordinates[0]] : geometry.coordinates.map(p => p[0]);
  const ring = rings.reduce((a, b) => (b.length > a.length ? b : a));
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  ring.forEach(pt => { const { x, y } = project(pt); minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); });
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

export type MapPlace = { key: string; name: string; value: number | null; lines?: string[]; dimmed?: boolean };

type Props = {
  level: keyof typeof SOURCES;
  /** Looks up the place a boundary shape belongs to. Several shapes may share one place (sub-metros). */
  resolve: (shape: string) => MapPlace | undefined;
  /** Fixed scale ends, so a colour keeps its meaning when the period changes. */
  domain: [number, number];
  label: string;
  format: (value: number) => string;
  ariaLabel: string;
  selected?: string | null;
  onSelect?: (key: string) => void;
  /** Hovered place, shared with a linked list. */
  active?: string | null;
  onActive?: (key: string | null) => void;
  showNames?: boolean;
  focusable?: boolean;
  maxHeight?: number;
};

export default function GhanaMap({ level, resolve, domain, label, format, ariaLabel, selected, onSelect, active, onActive, showNames = true, focusable = false, maxHeight = 520 }: Props) {
  const [geo, setGeo] = useState<FeatureCollection | null>(null);
  const [own, setOwn] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { let live = true; load(SOURCES[level]).then(g => { if (live) setGeo(g); }).catch(() => undefined); return () => { live = false; }; }, [level]);

  const shapes = useMemo(() => {
    const features = (geo?.features ?? []).filter(f => isValidGeometry(f.geometry));
    if (!features.length) return [];
    const project = createProjector(computeBounds(features), VIEW_W, VIEW_H, 10);
    return features.map(f => ({ shape: getFeatureName(f.properties ?? undefined), d: buildPathD(f.geometry as Geometry, project), at: labelPoint(f.geometry as Geometry, project) }));
  }, [geo]);

  const hot = active !== undefined ? active : own;
  const setHot = (key: string | null) => { setOwn(key); onActive?.(key); };
  const [min, max] = domain;
  const pos = (v: number) => (v - min) / (max - min || 1);
  const placed = shapes.map(s => ({ ...s, place: resolve(s.shape) }));
  const hotPlace = hot ? placed.find(s => s.place?.key === hot)?.place : undefined;
  const hotShapes = placed.filter(s => s.place && s.place.key === hot);
  const nameAt = hotShapes.length ? { x: hotShapes.reduce((a, s) => a + s.at.x, 0) / hotShapes.length, y: hotShapes.reduce((a, s) => a + s.at.y, 0) / hotShapes.length } : null;
  const move = (e: React.PointerEvent) => { const r = box.current?.getBoundingClientRect(); if (r) setTip({ x: e.clientX - r.left, y: e.clientY - r.top }); };

  if (!shapes.length) return <div className="animate-pulse rounded-[var(--radius-md)] bg-surface-muted" style={{ height: Math.min(maxHeight, 420) }} />;
  const width = box.current?.clientWidth ?? 400;

  return (
    <div ref={box} className="relative" onPointerLeave={() => { setHot(null); setTip(null); }}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="mx-auto block h-auto w-full" style={{ maxHeight }} role={focusable ? "group" : "img"} aria-label={ariaLabel} onPointerMove={move}>
        <defs><filter id={`lift-${level}`} x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0F172B" floodOpacity="0.3" /></filter></defs>
        {placed.map(({ shape, d, place }) => (
          <path key={shape} d={d} strokeLinejoin="round" stroke="#FFFFFF" strokeWidth={level === "regions" ? 1.2 : 0.5}
            fill={!place || place.value == null ? "#E3E6EE" : place.dimmed ? "#F1F2F6" : rampColor(pos(place.value))}
            tabIndex={focusable && place ? 0 : undefined} role={focusable && place ? "button" : undefined}
            aria-label={focusable && place ? `${place.name}: ${place.value == null ? "not published" : format(place.value)}` : undefined}
            className={`outline-none ${place && onSelect ? "cursor-pointer" : ""}`}
            onPointerEnter={() => place && setHot(place.key)} onFocus={() => place && setHot(place.key)} onBlur={() => setHot(null)}
            onClick={() => place && onSelect?.(place.key)} onKeyDown={e => { if (place && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onSelect?.(place.key); } }} />
        ))}
        {placed.filter(s => s.place && s.place.key === selected && s.place.key !== hot).map(({ shape, d }) => <path key={`s-${shape}`} d={d} fill="none" stroke={MAP_GOLD} strokeWidth={2.5} strokeLinejoin="round" pointerEvents="none" />)}
        {hotShapes.length > 0 && (
          <g pointerEvents="none" filter={`url(#lift-${level})`}>
            {hotShapes.map(({ shape, d }) => <path key={`h-${shape}`} d={d} fill={MAP_GOLD} stroke="#FFFFFF" strokeWidth={level === "regions" ? 1.4 : 0.8} strokeLinejoin="round" />)}
          </g>
        )}
        {showNames && hotPlace && nameAt && (
          <text x={Math.min(VIEW_W - 60, Math.max(60, nameAt.x))} y={nameAt.y} textAnchor="middle" dominantBaseline="middle" pointerEvents="none" fontSize={level === "regions" ? 12.5 : 11} fontWeight={800}
            fill="#1A1343" stroke="#FFFFFF" strokeWidth={3} strokeOpacity={0.55} paintOrder="stroke" style={{ letterSpacing: "0.02em" }}>
            {hotPlace.name.toUpperCase()}
          </text>
        )}
      </svg>

      {/* Gradient legend; the ring marks the hovered value. */}
      <div className="pointer-events-none absolute bottom-1 left-1 flex flex-col items-start text-xs text-muted" aria-hidden="true">
        <span className="tabular mb-1">{format(max)}</span>
        <span className="relative block h-[92px] w-2.5 rounded-full" style={{ background: `linear-gradient(to top, ${MAP_RAMP.join(",")})` }}>
          {hotPlace?.value != null && (
            <span className="absolute left-1/2 flex -translate-x-1/2 translate-y-1/2 items-center" style={{ bottom: `${Math.min(1, Math.max(0, pos(hotPlace.value))) * 100}%` }}>
              <span className="h-3 w-3 shrink-0 rounded-full border-2 border-white bg-brand shadow" />
              <span className="tabular absolute left-5 whitespace-nowrap font-semibold text-ink">{format(hotPlace.value)}</span>
            </span>
          )}
        </span>
        <span className="tabular mt-1">{format(min)}</span>
      </div>

      {hotPlace && tip && (
        <div className="pointer-events-none absolute z-10 w-max max-w-[15rem] rounded-[10px] border border-line bg-surface px-3 py-2 text-[13px] leading-snug text-ink shadow-pop"
          style={{ left: Math.min(Math.max(8, tip.x + 14), Math.max(8, width - 200)), top: Math.max(4, tip.y + 14) }}>
          <p className="font-bold">{hotPlace.name}</p>
          <p className="text-body">{label}: <b className="tabular font-semibold text-ink">{hotPlace.value == null ? "not published" : format(hotPlace.value)}</b></p>
          {hotPlace.lines?.map(line => <p key={line} className="text-body">{line}</p>)}
        </div>
      )}
      {/* Screen-reader and keyboard readout of the highlighted place. */}
      <p className="sr-only" aria-live="polite">{hotPlace ? `${hotPlace.name}: ${label} ${hotPlace.value == null ? "not published" : format(hotPlace.value)}. ${(hotPlace.lines ?? []).join(". ")}` : ""}</p>
    </div>
  );
}
