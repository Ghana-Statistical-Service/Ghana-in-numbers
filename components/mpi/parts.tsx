import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { dimensions, type DimensionKey } from "@/data/mpiData";

/* Shared marks for the Multidimensional Poverty views. Rules: docs/mpi-dashboard-guidelines.md §4 and §6. */

export const pct = (v: number) => `${v.toFixed(1)}%`;
export const people = (v: number) => v.toLocaleString("en-GB");
export const millions = (v: number) => `${(v / 1e6).toFixed(2)} million`;
export const signedPp = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toFixed(1)} pp`;
export const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
};

/**
 * A headline figure. It fades and rises into place but always shows the exact published value: a number that
 * counts up would display figures that were never published, and could be captured in a screenshot.
 */
export function CountUp({ value, format }: { value: number; format: (v: number) => string }) {
  return <span className="mpi-rise inline-block">{format(value)}</span>;
}

/** The one sentence a reader should be able to repeat after leaving the view, with the question it answers. */
export function Lead({ children, kicker }: { children: ReactNode; kicker?: string }) {
  return (
    <div className="mpi-rise mb-6 max-w-4xl">
      {kicker && <p className="mpi-kicker mb-2 text-brand">{kicker}</p>}
      <p className="text-[19px] font-semibold leading-snug tracking-tight text-ink sm:text-[22px]">{children}</p>
    </div>
  );
}

/** Numbered section heading with a fading rule. */
export function SectionHead({ step, title, hint }: { step?: number; title: string; hint?: string }) {
  return (
    <div className="mpi-sec">
      {step != null && <span aria-hidden="true" className="mpi-step">{step}</span>}
      <h3 className="text-[17px] font-semibold tracking-tight text-ink">{title}{hint && <span className="ml-2 text-[13px] font-normal text-muted">{hint}</span>}</h3>
    </div>
  );
}

export function Caveat({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="note" className="rounded-[var(--radius-lg)] border border-[#F3D9A4] bg-caution-bg px-4 py-3 text-[13px] leading-relaxed text-body">
      <p className="font-semibold text-caution">{title}</p>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}

export function DimensionLegend({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-body ${className}`}>
      {dimensions.map(d => <li key={d.key} className="flex items-center gap-1.5"><span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: d.color }} />{d.label}</li>)}
    </ul>
  );
}

/**
 * Parts of a whole on a fixed 0 to 100 scale, in the fixed dimension order. A value is printed inside a segment
 * only when it fits; every value is in the accessible label and in the row's own legend or table.
 */
export function ShareBar({ values, label, height = 28, showValues = true }: { values: Record<DimensionKey, number>; label: string; height?: number; showValues?: boolean }) {
  const text = dimensions.map(d => `${d.label} ${pct(values[d.key])}`).join(", ");
  return (
    <div role="img" aria-label={`${label}: ${text}`} className="mpi-grow flex w-full gap-[2px] overflow-hidden rounded-full" style={{ height }}>
      {dimensions.map(d => (
        <span key={d.key} title={`${d.label}: ${pct(values[d.key])}`} className="flex min-w-0 items-center justify-center text-xs font-semibold text-white" style={{ width: `${values[d.key]}%`, background: d.color }}>
          {showValues && values[d.key] >= 9 ? values[d.key].toFixed(1) : ""}
        </span>
      ))}
    </div>
  );
}

export type BarRow = { label: string; value: number; color?: string; sub?: string; emphasis?: boolean; swatchLabel?: string };

/** Sorted horizontal bars from zero with the value printed at the end of every row. Bars grow in once. */
export function BarList({ rows, max, format = pct, labelWidth = "11rem", reference, caption }: { rows: BarRow[]; max: number; format?: (v: number) => string; labelWidth?: string; reference?: { value: number; label: string }; caption: string }) {
  return (
    <div>
      <ol aria-label={caption} className="space-y-1">
        {rows.map((row, index) => (
          <li key={row.label} className="grid items-center gap-x-3 rounded-md px-1.5 py-1 text-[13px] transition-colors hover:bg-surface-muted" style={{ gridTemplateColumns: `minmax(0, ${labelWidth}) minmax(3rem, 1fr) 4.5rem` }}>
            <span className={`min-w-0 leading-snug ${row.emphasis ? "font-semibold text-ink" : "text-body"}`}>
              {row.label}{row.swatchLabel && <span className="sr-only"> ({row.swatchLabel})</span>}
              {row.sub && <span className="block text-xs font-normal text-subtle">{row.sub}</span>}
            </span>
            <span className="relative h-2.5 rounded-full bg-[#EDEFF5]">
              <span aria-hidden="true" className="mpi-grow absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(100, (row.value / max) * 100)}%`, background: row.color ?? (row.emphasis ? "linear-gradient(90deg,#3C2FA3,#5B4BD6)" : "#A9B2C3"), animationDelay: `${Math.min(index, 14) * 35}ms` }} />
              {reference && <span aria-hidden="true" className="absolute -inset-y-1.5 w-0.5 rounded-full bg-[#C9A227]" style={{ left: `${(reference.value / max) * 100}%` }} />}
            </span>
            <span className="tabular text-right font-semibold text-ink">{format(row.value)}</span>
          </li>
        ))}
      </ol>
      {reference && <p className="mt-2 flex items-center gap-2 px-1.5 text-xs text-muted"><span aria-hidden="true" className="h-3.5 w-0.5 rounded-full bg-[#C9A227]" />{reference.label}</p>}
    </div>
  );
}

export function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="mpi-lift inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 text-[13px] font-medium text-brand hover:bg-brand-soft">
      {children}<ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** Official term beside the plain one (guidelines §2.1). */
export function Term({ plain, official }: { plain: string; official: string }) {
  return <>{plain} <span className="font-normal opacity-75">({official})</span></>;
}
