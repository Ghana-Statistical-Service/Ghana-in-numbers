"use client";

import { useEffect, useState, type ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

/** Hex values mirror the CSS chart tokens in globals.css (SVG attributes cannot read CSS variables reliably in all exporters). */
export const C = {
  purple: "#3C2FA3",
  purpleLight: "#9C93DB",
  purpleFaint: "#D6D2F2",
  teal: "#0E8A7E",
  tealLight: "#7FC7BE",
  amber: "#D17A22",
  amberLight: "#EDB97F",
  blue: "#2F6DB5",
  blueLight: "#93B6E0",
  rose: "#B4436C",
  slate: "#6B7A90",
  slateLight: "#B8C1CF",
  ink: "#0F172B",
  muted: "#4B5A70",
  grid: "#E8EBF2",
  axis: "#64748B",
  positive: "#0E8A7E",
  negative: "#C2562B",
  male: "#2F6DB5",
  female: "#B4436C",
} as const;

export const series = [C.purple, C.teal, C.amber, C.blue, C.rose, C.slate];

export const tick = { fontSize: 12, fill: C.axis } as const;
export const tickSmall = { fontSize: 12, fill: C.axis } as const;
export const axisCommon = { tickLine: false, axisLine: false } as const;
export const labelStyle = { fontSize: 12, fill: C.ink, fontWeight: 600 } as const;

export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export const num = (value: number | null | undefined, decimals = 1) =>
  value === null || value === undefined || Number.isNaN(value) ? "—" : value.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Fixed-height plot area with a text alternative. The height is deliberate per chart; labels wrap outside it,
 * so the card grows with its content instead of clipping.
 */
export function ChartFrame({ height, label, children, minWidth }: { height: number; label: string; children: ReactElement; minWidth?: number }) {
  const mounted = useMounted();
  // The plot keeps at least its deliberate height and grows to fill a card that is taller than its content.
  const plot = (
    <div role="img" aria-label={label} style={{ minHeight: height, minWidth }} className="relative w-full flex-1">
      <div className="absolute inset-0">
        {mounted ? <ResponsiveContainer width="100%" height="100%" minWidth={0}>{children}</ResponsiveContainer> : <div className="h-full animate-pulse rounded-md bg-surface-muted" />}
      </div>
    </div>
  );
  if (!minWidth) return plot;
  return <div className="scroll-hint -mx-1 flex flex-1 flex-col overflow-x-auto px-1" tabIndex={0} aria-label={`${label} (scrolls horizontally)`}>{plot}</div>;
}

type TooltipEntry = { name?: unknown; value?: unknown; color?: string; stroke?: string; fill?: string; dataKey?: unknown; payload?: Record<string, unknown> };

/** Consistent tooltip: period heading, swatch, series name, formatted value with unit. Missing values are labelled. */
export function makeTooltip({ unit = "", decimals = 1, format, labelFormat }: { unit?: string; decimals?: number; format?: (value: number, entry: TooltipEntry) => string; labelFormat?: (label: string, payload?: Record<string, unknown>) => string }) {
  return function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: readonly TooltipEntry[]; label?: string | number }) {
    if (!active || !payload?.length) return null;
    const heading = labelFormat ? labelFormat(String(label ?? ""), payload[0]?.payload) : String(label ?? "");
    return (
      <div className="rounded-[var(--radius-md)] border border-line bg-surface px-3 py-2 text-[12.5px] shadow-pop">
        {heading && <p className="mb-1 font-semibold text-ink">{heading}</p>}
        <ul className="space-y-0.5">
          {payload.filter(entry => entry.name !== "_hidden").map((entry, index) => {
            const raw = entry.value;
            const value = typeof raw === "number" ? (format ? format(raw, entry) : `${num(raw, decimals)}${unit}`) : "Not reported";
            return (
              <li key={`${String(entry.dataKey)}-${index}`} className="flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: entry.color ?? entry.stroke ?? entry.fill }} />
                <span className="text-muted">{String(entry.name ?? "")}</span>
                <span className="tabular ml-auto pl-3 font-semibold text-ink">{value}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
}
