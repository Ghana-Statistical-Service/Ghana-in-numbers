"use client";

import { useId, type ReactNode } from "react";
import { ChevronDown, Table2 } from "lucide-react";

/** "View data" disclosure placed beneath each visual. Native <details> keeps keyboard and screen-reader behaviour. */
export function DataDisclosure({ children, label = "View data", hint = "Published figures" }: { children: ReactNode; label?: string; hint?: string }) {
  return (
    <details className="group mt-4 rounded-[var(--radius-md)] border border-line" data-visual-data>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-[var(--radius-md)] px-3.5 text-[13px] font-medium text-body hover:bg-surface-muted [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2"><Table2 size={16} aria-hidden className="text-brand" />{label}<span className="hidden font-normal text-subtle sm:inline">· {hint}</span></span>
        <ChevronDown size={16} aria-hidden className="text-subtle transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-4 border-t border-line p-3 sm:p-4">{children}</div>
    </details>
  );
}

export type Cell = string | number | null | undefined;
export type TableRow = Cell[] | { cells: Cell[]; depth?: number; emphasis?: "subtotal" | "total"; note?: string };

const fmt = (value: Cell, decimals?: number): React.ReactNode => {
  if (value === "") return "";
  if (value === null || value === undefined) return <abbr title="Not reported" aria-label="Not reported" className="no-underline">n/a</abbr>;
  if (typeof value === "number") return value.toLocaleString("en-GB", decimals === undefined ? { maximumFractionDigits: 2 } : { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return value;
};

/**
 * Accessible data table. Rows can carry depth (parent–child indentation) and subtotal/total emphasis.
 * Missing values render as "n/a" (not reported), never as zero.
 */
export function DataTable({ caption, headings, rows, decimals, minWidth = 520, unitNote }: { caption: string; headings: string[]; rows: TableRow[]; decimals?: number | (number | undefined)[]; minWidth?: number; unitNote?: string }) {
  const id = useId();
  return (
    <div>
      <div role="region" aria-labelledby={id} tabIndex={0} className="scroll-hint overflow-x-auto rounded-[var(--radius-sm)] border border-line">
        <table className="w-full border-collapse text-[13px]" style={{ minWidth }}>
          <caption id={id} className="sr-only">{caption}</caption>
          <thead className="bg-surface-muted text-muted">
            <tr>{headings.map((heading, index) => <th key={heading} scope="col" className={`px-3 py-2.5 align-bottom font-semibold ${index ? "text-right" : "text-left"}`}>{heading}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((raw, rowIndex) => {
              const row = Array.isArray(raw) ? { cells: raw } : raw;
              const depth = row.depth ?? 0;
              const strong = row.emphasis === "subtotal" || row.emphasis === "total";
              return (
                <tr key={rowIndex} className={`border-t border-line ${row.emphasis === "total" ? "bg-brand-soft/60" : row.emphasis === "subtotal" ? "bg-surface-muted/70" : ""}`}>
                  {row.cells.map((value, column) => {
                    const d = Array.isArray(decimals) ? decimals[column] : decimals;
                    return column === 0
                      ? <th key={column} scope="row" className={`px-3 py-2.5 text-left ${strong ? "font-semibold text-ink" : "font-normal text-body"}`} style={{ paddingLeft: 12 + depth * 18 }}>
                          {depth > 0 && <span aria-hidden className="mr-1.5 text-subtle">└</span>}{value}{row.note && <span className="ml-1.5 text-xs font-normal text-subtle">{row.note}</span>}
                        </th>
                      : <td key={column} className={`tabular whitespace-nowrap px-3 py-2.5 text-right ${strong ? "font-semibold text-ink" : "text-body"}`}>{fmt(value, d)}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {unitNote && <p className="mt-2 text-xs text-subtle">{unitNote}</p>}
    </div>
  );
}

/** Segmented control for switches such as nominal/real or cash/commitment. */
export function Segmented<T extends string>({ label, options, value, onChange, size = "md" }: { label: string; options: { value: T; label: string }[]; value: T; onChange: (value: T) => void; size?: "sm" | "md" }) {
  return (
    <div role="group" aria-label={label} className="inline-flex max-w-full flex-wrap gap-0.5 rounded-[var(--radius-md)] bg-surface-muted p-0.5 ring-1 ring-inset ring-line">
      {options.map(option => {
        const selected = option.value === value;
        return (
          <button key={option.value} type="button" aria-pressed={selected} onClick={() => onChange(option.value)}
            className={`rounded-[6px] font-medium transition-colors ${size === "sm" ? "min-h-8 px-2.5 text-xs" : "min-h-9 px-3 text-[13px]"} ${selected ? "bg-surface text-brand shadow-sm ring-1 ring-brand-line" : "text-muted hover:text-ink"}`}>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export type LegendItem = { label: string; color: string; shape?: "dot" | "line" | "dash" | "square" | "hollow" | "hatch" };

export function Legend({ items, className = "" }: { items: LegendItem[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-body ${className}`}>
      {items.map(item => (
        <li key={item.label} className="flex items-center gap-1.5">
          <Swatch color={item.color} shape={item.shape} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export function Swatch({ color, shape = "square" }: { color: string; shape?: LegendItem["shape"] }) {
  if (shape === "line") return <span aria-hidden className="h-[3px] w-4 rounded-full" style={{ background: color }} />;
  if (shape === "dash") return <span aria-hidden className="w-4 border-t-[3px] border-dashed" style={{ borderColor: color }} />;
  if (shape === "dot") return <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />;
  if (shape === "hollow") return <span aria-hidden className="h-2.5 w-2.5 rounded-full border-2 bg-white" style={{ borderColor: color }} />;
  if (shape === "hatch") return <span aria-hidden className="h-3 w-3 rounded-[2px]" style={{ background: `repeating-linear-gradient(45deg, ${color} 0 2px, #fff 2px 4px)` }} />;
  return <span aria-hidden className="h-3 w-3 rounded-[3px]" style={{ background: color }} />;
}
