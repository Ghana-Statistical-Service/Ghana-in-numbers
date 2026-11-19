"use client";

import { useState, type ReactNode } from "react";
import { Area, AreaChart, CartesianGrid, ReferenceDot, Tooltip, XAxis, YAxis } from "recharts";
import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, ChevronRight, MinusCircle, type LucideIcon } from "lucide-react";
import { C, ChartFrame, axisCommon, tick } from "@/components/ui/chart";
import { statusOf, statusOrder, statuses, type StatusId } from "@/lib/adminMonitoring";

/* Shared marks for the administrative data monitor. Colour has two jobs only: status (teal, amber, rose, always
   with its word and icon) and emphasis (brand purple against slate). */

const statusIcon: Record<StatusId, LucideIcon> = { strong: CheckCircle2, moderate: MinusCircle, low: AlertCircle };

export function StatusPill({ status, onDark = false }: { status: StatusId; onDark?: boolean }) {
  const s = statuses[status], Icon = statusIcon[status];
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold" style={onDark ? { background: "rgba(255,255,255,0.16)", color: "#fff" } : { background: s.bg, color: s.fg }}>
      <Icon size={13} aria-hidden="true" />{s.label}
    </span>
  );
}

/** Explains the three status words wherever status colour is used. */
export function StatusKey({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-body ${className}`}>
      {statusOrder.map(id => <li key={id} className="flex items-center gap-1.5"><span aria-hidden="true" className="h-3 w-3 rounded-[3px]" style={{ background: statuses[id].fill }} /><span className="font-semibold text-ink">{statuses[id].label}</span>{statuses[id].range.toLowerCase()}</li>)}
    </ul>
  );
}

/** A 0 to 100 track. Completion meters carry the two status lines at 50 and 80. */
export function Meter({ value, color, marks = false, height = 10, delay = 0 }: { value: number; color: string; marks?: boolean; height?: number; delay?: number }) {
  return (
    <span aria-hidden="true" className="relative block w-full rounded-full bg-[#EDEFF5]" style={{ height }}>
      <span className="mpi-grow absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color, animationDelay: `${delay}ms` }} />
      {marks && [50, 80].map(m => <span key={m} className="absolute -inset-y-1 w-px bg-[#8E9AAE]" style={{ left: `${m}%` }} />)}
    </span>
  );
}

export type BarRow = { key: string; label: string; sub?: string; value: number; display: string; color?: string; onClick?: () => void; emphasis?: boolean };

/** Sorted horizontal bars from zero, value printed on every row. A row with `onClick` is a real button. */
export function Bars({ rows, max, caption, labelWidth = "11rem", marks = false, valueWidth = "4.25rem" }: { rows: BarRow[]; max: number; caption: string; labelWidth?: string; marks?: boolean; valueWidth?: string }) {
  const grid = { gridTemplateColumns: `minmax(0, ${labelWidth}) minmax(3rem, 1fr) ${valueWidth}` };
  return (
    <ol aria-label={caption} className="space-y-0.5">
      {rows.map((row, index) => {
        const inner = (
          <>
            <span className={`min-w-0 leading-snug ${row.emphasis ? "font-semibold text-ink" : "text-body"}`}>
              <span className={row.onClick ? "group-hover:text-brand group-hover:underline" : ""}>{row.label}</span>
              {row.sub && <span className="block text-xs font-normal text-subtle">{row.sub}</span>}
            </span>
            <Meter value={max ? (row.value / max) * 100 : 0} color={row.color ?? (row.emphasis ? "linear-gradient(90deg,#3C2FA3,#5B4BD6)" : "#7F8BA3")} marks={marks} delay={Math.min(index, 14) * 30} />
            <span className="tabular flex items-center justify-end gap-1 text-right font-semibold text-ink">{row.display}{row.onClick && <ChevronRight size={14} aria-hidden="true" className="text-subtle group-hover:text-brand" />}</span>
          </>
        );
        return (
          <li key={row.key}>
            {row.onClick
              ? <button type="button" onClick={row.onClick} className="group grid min-h-9 w-full items-center gap-x-3 rounded-md px-1.5 py-1 text-left text-[13px] transition-colors hover:bg-brand-soft" style={grid}>{inner}</button>
              : <div className="grid min-h-8 items-center gap-x-3 rounded-md px-1.5 py-1 text-[13px]" style={grid}>{inner}</div>}
          </li>
        );
      })}
    </ol>
  );
}

/** Districts by status: one bar on a 0 to 100 scale and the three counts in words. */
export function StatusSplit({ counts, total, unit = "districts" }: { counts: Record<StatusId, number>; total: number; unit?: string }) {
  const text = statusOrder.map(id => `${counts[id]} ${statuses[id].label.toLowerCase()}`).join(", ");
  return (
    <div>
      <div role="img" aria-label={`Of ${total} ${unit}: ${text}`} className="mpi-grow flex h-9 w-full gap-[2px] overflow-hidden rounded-full">
        {statusOrder.filter(id => counts[id] > 0).map(id => (
          <span key={id} className="flex min-w-0 items-center justify-center text-[13px] font-bold text-white" style={{ width: `${(counts[id] / total) * 100}%`, background: statuses[id].fill }}>{counts[id] / total >= 0.08 ? counts[id] : ""}</span>
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-3">
        {statusOrder.map(id => (
          <li key={id} className="min-w-0">
            <StatusPill status={id} />
            <p className="tabular mt-2 text-[26px] font-extrabold leading-none tracking-tight text-ink">{counts[id]}</p>
            <p className="mt-1 text-xs leading-snug text-muted">{unit} at {statuses[id].range.toLowerCase()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type TrendPoint = { year: number; value: number; detail?: string };

/** One series by reporting year, from zero. The highest year and the latest year are labelled on the chart. */
export function Trend({ data, format, axis, name, label, height = 270, max }: { data: TrendPoint[]; format: (v: number) => string; axis: (v: number) => string; name: string; label: string; height?: number; max?: number }) {
  const peak = data.reduce((a, b) => (b.value > a.value ? b : a));
  const last = data.at(-1)!;
  const top = max ?? Math.max(...data.map(d => d.value), 0.0001) * 1.22;
  const Tip = ({ active, payload }: { active?: boolean; payload?: readonly { payload?: TrendPoint }[] }) => {
    const d = payload?.[0]?.payload;
    if (!active || !d) return null;
    return (
      <div className="rounded-[10px] border border-line bg-surface px-3 py-2 text-[12.5px] shadow-pop">
        <p className="font-bold text-ink">{d.year}</p>
        <p className="tabular text-body">{name}: <b className="font-semibold text-ink">{format(d.value)}</b></p>
        {d.detail && <p className="tabular text-muted">{d.detail}</p>}
      </div>
    );
  };
  return (
    <ChartFrame height={height} label={label}>
      <AreaChart data={data} margin={{ top: 26, right: 34, bottom: 4, left: 0 }}>
        <defs><linearGradient id="adm-trend" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.purple} stopOpacity={0.26} /><stop offset="100%" stopColor={C.purple} stopOpacity={0.02} /></linearGradient></defs>
        <CartesianGrid stroke={C.grid} vertical={false} />
        <XAxis dataKey="year" {...axisCommon} tick={tick} interval={0} tickFormatter={(y: number) => (y % 2 ? String(y) : "")} />
        <YAxis {...axisCommon} tick={tick} domain={[0, top]} {...(max ? { ticks: Array.from({ length: Math.floor(max / 25) + 1 }, (_, i) => i * 25) } : { tickCount: 5 })} tickFormatter={axis} width={54} />
        <Tooltip content={<Tip />} cursor={{ stroke: C.slateLight }} />
        <Area type="monotone" dataKey="value" name={name} stroke={C.purple} strokeWidth={2.5} fill="url(#adm-trend)" dot={{ r: 2.5, fill: C.purple, strokeWidth: 0 }} activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }} animationDuration={700} />
        {peak.year !== last.year && <ReferenceDot x={peak.year} y={peak.value} r={4.5} fill={C.purple} stroke="#fff" strokeWidth={2} label={{ value: format(peak.value), position: "top", fontSize: 12, fontWeight: 700, fill: C.ink }} />}
        <ReferenceDot x={last.year} y={last.value} r={5.5} fill="#fff" stroke={C.purple} strokeWidth={2.5} label={{ value: format(last.value), position: "top", fontSize: 12, fontWeight: 700, fill: C.ink }} />
      </AreaChart>
    </ChartFrame>
  );
}

/** Completion value with its meter and status word, used in tables. */
export function CompletionCell({ value }: { value: number }) {
  const s = statuses[statusOf(value)];
  return (
    <span className="flex w-full min-w-[9.5rem] items-center gap-2.5">
      <span className="tabular w-12 shrink-0 text-right font-semibold text-ink">{value.toFixed(1)}%</span>
      <Meter value={value} color={s.fill} marks height={8} />
    </span>
  );
}

export type Column<T> = { key: string; label: string; align?: "left" | "right"; sort?: (row: T) => number | string; render: (row: T) => ReactNode; header?: boolean; hideBelow?: "md" | "lg" };

/** Sortable table with a "show all" control. Sorting is on real buttons and announced with aria-sort. */
export function SortTable<T>({ columns, rows, rowKey, caption, initial, pageSize = 15, minWidth = 640, selectedKey, empty = "Nothing to show." }: {
  columns: Column<T>[]; rows: T[]; rowKey: (row: T) => string; caption: string; initial: { key: string; dir: 1 | -1 }; pageSize?: number; minWidth?: number; selectedKey?: string | null; empty?: string;
}) {
  const [sort, setSort] = useState(initial);
  const [all, setAll] = useState(false);
  const col = columns.find(c => c.key === sort.key);
  const sorted = col?.sort ? [...rows].sort((a, b) => { const x = col.sort!(a), y = col.sort!(b); return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * sort.dir; }) : rows;
  const visible = all ? sorted : sorted.slice(0, pageSize);
  const hide = (c: Column<T>) => (c.hideBelow === "md" ? "hidden md:table-cell" : c.hideBelow === "lg" ? "hidden lg:table-cell" : "");
  return (
    <div>
      <div role="region" aria-label={caption} tabIndex={0} className="scroll-hint overflow-x-auto rounded-[var(--radius-sm)] border border-line">
        <table className="w-full border-collapse text-[13px]" style={{ minWidth }}>
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-surface-muted text-muted">
            <tr>
              {columns.map(c => {
                const active = sort.key === c.key;
                return (
                  <th key={c.key} scope="col" aria-sort={active ? (sort.dir > 0 ? "ascending" : "descending") : undefined} className={`px-3 py-1.5 align-bottom font-semibold ${c.align === "right" ? "text-right" : "text-left"} ${hide(c)}`}>
                    {c.sort ? (
                      <button type="button" onClick={() => setSort(s => (s.key === c.key ? { key: c.key, dir: s.dir > 0 ? -1 : 1 } : { key: c.key, dir: typeof c.sort!(rows[0]) === "number" ? -1 : 1 }))}
                        className={`inline-flex min-h-8 items-center gap-1 whitespace-nowrap rounded text-left hover:text-ink ${active ? "text-brand" : ""}`}>
                        {c.label}{active ? (sort.dir > 0 ? <ArrowUp size={13} aria-hidden="true" /> : <ArrowDown size={13} aria-hidden="true" />) : <ArrowUpDown size={13} aria-hidden="true" className="opacity-50" />}
                      </button>
                    ) : <span className="inline-flex min-h-8 items-center">{c.label}</span>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visible.map(row => (
              <tr key={rowKey(row)} className={`border-t border-line ${rowKey(row) === selectedKey ? "bg-brand-soft/70" : "hover:bg-surface-muted/60"}`}>
                {columns.map(c => c.header
                  ? <th key={c.key} scope="row" className={`px-3 py-1.5 text-left font-normal ${hide(c)}`}>{c.render(row)}</th>
                  : <td key={c.key} className={`px-3 py-2 ${c.align === "right" ? "tabular whitespace-nowrap text-right" : ""} text-body ${hide(c)}`}>{c.render(row)}</td>)}
              </tr>
            ))}
            {!visible.length && <tr><td colSpan={columns.length} className="px-3 py-6 text-center text-muted">{empty}</td></tr>}
          </tbody>
        </table>
      </div>
      {sorted.length > pageSize && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => setAll(v => !v)} className="min-h-9 rounded-full border border-line bg-surface px-4 text-[13px] font-semibold text-brand hover:bg-brand-soft">{all ? `Show the first ${pageSize}` : `Show all ${sorted.length}`}</button>
          <p className="text-xs text-subtle" aria-live="polite">Showing {visible.length} of {sorted.length}</p>
        </div>
      )}
    </div>
  );
}

/** Link-styled button that opens a district profile. */
export function DistrictLink({ name, onOpen }: { name: string; onOpen: (name: string) => void }) {
  return <button type="button" onClick={() => onOpen(name)} className="min-h-8 whitespace-nowrap rounded text-left font-medium text-brand underline-offset-2 hover:underline">{name}</button>;
}

/** Plain definition of a term, kept beside the figure it explains. */
export function Explain({ term, children }: { term: string; children: ReactNode }) {
  return <p className="text-[13px] leading-relaxed text-body"><b className="font-semibold text-ink">{term}: </b>{children}</p>;
}
