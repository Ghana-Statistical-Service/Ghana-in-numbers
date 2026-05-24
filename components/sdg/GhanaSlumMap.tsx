"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildPathD,
  computeBounds,
  createProjector,
  Feature,
  FeatureCollection,
  getFeatureName,
  isValidGeometry,
} from "@/lib/geojsonToSvg";

// ── Slum status per region ──────────────────────────────────────────────────
// Values will be filled once the user provides the data.
// "slum"     → predominantly slum settlements
// "non-slum" → predominantly non-slum urban areas
// "mixed"    → both present
// null       → no data yet
export type SlumStatus = "slum" | "non-slum" | "mixed" | null;

export const SLUM_DATA: Record<string, SlumStatus> = {
  "Ahafo":         null,
  "Ashanti":       null,
  "Bono":          null,
  "Bono East":     null,
  "Central":       null,
  "Eastern":       null,
  "Greater Accra": null,
  "North East":    null,
  "Northern":      null,
  "Oti":           null,
  "Savannah":      null,
  "Upper East":    null,
  "Upper West":    null,
  "Volta":         null,
  "Western":       null,
  "Western North": null,
};

const STATUS_COLOR: Record<string, string> = {
  "slum":     "#DC2626",
  "non-slum": "#16A34A",
  "mixed":    "#F97316",
  "null":     "#D1D5DB",  // placeholder grey
};

const VIEW_W = 360;
const VIEW_H = 480;

function regionFill(name: string): string {
  const status = SLUM_DATA[name] ?? null;
  return STATUS_COLOR[String(status)];
}

// ── Component ──────────────────────────────────────────────────────────────
export default function GhanaSlumMap({
  slumData = SLUM_DATA,
}: {
  slumData?: Record<string, SlumStatus>;
}) {
  const [geo, setGeo] = useState<FeatureCollection | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch("/map/Regions.gh.json")
      .then((r) => r.json())
      .then((data) => setGeo(data as FeatureCollection))
      .catch(() => null);
  }, []);

  const { features, project } = useMemo(() => {
    if (!geo) return { features: [], project: () => ({ x: 0, y: 0 }) };
    const validFeatures = geo.features.filter((f): f is Feature =>
      isValidGeometry(f.geometry)
    );
    const bounds = computeBounds(validFeatures);
    const project = createProjector(bounds, VIEW_W, VIEW_H, 12);
    return { features: validFeatures, project };
  }, [geo]);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Map SVG */}
      <div className="flex-1 relative min-h-0">
        {!geo && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
            Loading map…
          </div>
        )}

        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full h-full"
          style={{ display: "block" }}
        >
          {features.map((feature) => {
            const name = getFeatureName(feature.properties);
            const status = slumData[name] ?? null;
            const fill = STATUS_COLOR[String(status)];
            const isActive = hovered === name;

            return (
              <path
                key={name}
                d={buildPathD(feature.geometry!, project)}
                fill={fill}
                stroke="#fff"
                strokeWidth={isActive ? 1.8 : 0.8}
                strokeLinejoin="round"
                style={{
                  filter: isActive ? "brightness(0.88)" : undefined,
                  cursor: "pointer",
                  transition: "filter 0.15s",
                }}
                onMouseEnter={(e) => {
                  setHovered(name);
                  const svg = (e.currentTarget as SVGPathElement).ownerSVGElement!;
                  const rect = svg.getBoundingClientRect();
                  const pt = svg.createSVGPoint();
                  pt.x = e.clientX;
                  pt.y = e.clientY;
                  const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
                  setTooltip({ x: svgPt.x, y: svgPt.y });
                }}
                onMouseMove={(e) => {
                  const svg = (e.currentTarget as SVGPathElement).ownerSVGElement!;
                  const pt = svg.createSVGPoint();
                  pt.x = e.clientX;
                  pt.y = e.clientY;
                  const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
                  setTooltip({ x: svgPt.x, y: svgPt.y });
                }}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}

          {/* Tooltip */}
          {hovered && (
            <g
              transform={`translate(${
                tooltip.x > VIEW_W * 0.6 ? tooltip.x - 118 : tooltip.x + 10
              }, ${tooltip.y - 28})`}
              style={{ pointerEvents: "none" }}
            >
              <rect
                width={110}
                height={44}
                rx={6}
                fill="white"
                stroke="#E5E7EB"
                strokeWidth={0.8}
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
              />
              <text
                x={8}
                y={16}
                fontSize={9}
                fontWeight={700}
                fill="#374151"
              >
                {hovered}
              </text>
              <text x={8} y={30} fontSize={8} fill="#6B7280">
                {slumData[hovered] !== null && slumData[hovered] !== undefined
                  ? slumData[hovered]!.charAt(0).toUpperCase() +
                    slumData[hovered]!.slice(1)
                  : "No data yet"}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 px-1">
        {[
          { label: "Slum",        color: "#DC2626" },
          { label: "Non-Slum",   color: "#16A34A" },
          { label: "Mixed",       color: "#F97316" },
          { label: "Water Bodies",color: "#93C5FD" },
          { label: "No data",     color: "#D1D5DB" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm flex-shrink-0 inline-block"
              style={{ background: color }}
            />
            <span className="text-[11px] text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
