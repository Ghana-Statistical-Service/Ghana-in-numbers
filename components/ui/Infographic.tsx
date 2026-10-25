import type { ReactNode } from "react";
import { ArrowRight, User, type LucideIcon } from "lucide-react";

/**
 * Icon-led figures: a meaningful icon, big numbers, short labels and a one-line takeaway.
 * Icons are decorative (aria-hidden); every figure is also present as text or in an accessible label.
 * Foreground colours are darkened variants of the chart palette so text meets WCAG AA on white and on the tint.
 */
export const tones = {
  purple: { fg: "#3C2FA3", bg: "#EEECFA", fill: "#3C2FA3", faint: "#D6D2F2" },
  teal: { fg: "#0B6E65", bg: "#E6F4F2", fill: "#0E8A7E", faint: "#C5E5E1" },
  amber: { fg: "#9A5512", bg: "#FBEFE2", fill: "#D17A22", faint: "#F3D8BA" },
  blue: { fg: "#245A96", bg: "#E8F0FA", fill: "#2F6DB5", faint: "#C9DBF0" },
  rose: { fg: "#963558", bg: "#F8E9EF", fill: "#B4436C", faint: "#ECCAD7" },
} as const;
export type Tone = keyof typeof tones;

export function IconTile({ icon: Icon, tone = "purple", size = "md" }: { icon: LucideIcon; tone?: Tone; size?: "sm" | "md" | "lg" }) {
  const box = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" }[size];
  const px = { sm: 16, md: 20, lg: 24 }[size];
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-[var(--radius-md)] ${box}`} style={{ background: tones[tone].bg, color: tones[tone].fg }}>
      <Icon size={px} aria-hidden="true" />
    </span>
  );
}

/** One-line takeaway under an icon figure. */
export function Takeaway({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[13px] leading-relaxed text-body">{children}</p>;
}

/**
 * Milestone figures: one big number per year, sized by value. The latest year is emphasised in the tone colour;
 * earlier years stay dark slate so they keep AA contrast.
 */
export function Milestones({ data, tone = "purple", format = v => v.toFixed(1), unit, icon }: { data: { year: string; value: number }[]; tone?: Tone; format?: (v: number) => string; unit?: string; icon?: LucideIcon }) {
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-3 sm:gap-4">
      {icon && <div className="mb-7 hidden min-[420px]:block"><IconTile icon={icon} tone={tone} size="lg" /></div>}
      <ol className="grid min-w-0 flex-1 items-end gap-2" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`, containerType: "inline-size" }}>
        {data.map((d, i) => {
          const latest = i === data.length - 1;
          const size = 22 + (max === min ? 1 : (d.value - min) / (max - min)) * 14;
          return (
            <li key={d.year} className="flex flex-col items-center text-center">
              <span className="tabular font-semibold leading-none tracking-tight" style={{ fontSize: `min(${size + (latest ? 4 : 0)}px, ${(30 / data.length).toFixed(1)}cqi)`, color: latest ? tones[tone].fg : "#334155", fontWeight: latest ? 700 : 600 }}>
                {format(d.value)}
              </span>
              {unit && <span className="sr-only"> {unit}</span>}
              <span className={`mt-1.5 text-xs ${latest ? "font-semibold text-ink" : "text-muted"}`}>{d.year}</span>
              <span aria-hidden="true" className="mt-1.5 h-2 w-2 rounded-full" style={{ background: latest ? tones[tone].fill : tones[tone].faint }} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** A row of person icons, `highlighted` of `total` coloured in. */
export function Pictogram({ total = 10, highlighted, tone = "purple", label, icon: Icon = User, size = 26 }: { total?: number; highlighted: number; tone?: Tone; label: string; icon?: LucideIcon; size?: number }) {
  return (
    <div role="img" aria-label={label} className={total === 100 ? "grid w-fit grid-cols-10 gap-0.5" : "flex flex-wrap gap-1"}>
      {Array.from({ length: total }, (_, i) => (
        <Icon key={i} size={size} aria-hidden="true" strokeWidth={2.25} style={{ color: i < highlighted ? tones[tone].fill : "#8E9AAE" }} />
      ))}
    </div>
  );
}

/** 10 × 10 grid of squares: one square per 1%. A fractional share fills part of the last square. */
export function Waffle({ value, tone = "purple", label }: { value: number; tone?: Tone; label: string }) {
  const whole = Math.floor(value);
  const part = value - whole;
  return (
    <div role="img" aria-label={label} className="grid w-full max-w-[150px] grid-cols-10 gap-[3px]">
      {Array.from({ length: 100 }, (_, i) => (
        <span key={i} aria-hidden="true" className="aspect-square rounded-[2px]"
          style={{ background: i < whole ? tones[tone].fill : i === whole && part > 0 ? `linear-gradient(90deg, ${tones[tone].fill} ${part * 100}%, #E3E6EE ${part * 100}%)` : "#E3E6EE" }} />
      ))}
    </div>
  );
}

/** Icon, label, thin bar scaled to `max` (100 for shares of a whole) and the value. */
export function IconBarRow({ icon, label, value, tone = "purple", max = 100, format = v => `${v.toFixed(1)}%` }: { icon: LucideIcon; label: string; value: number; tone?: Tone; max?: number; format?: (v: number) => string }) {
  return (
    <li className="grid grid-cols-[2rem_minmax(0,1fr)_3.5rem] items-center gap-x-3 gap-y-1">
      <IconTile icon={icon} tone={tone} size="sm" />
      <div className="min-w-0">
        <p className="text-[13px] text-body">{label}</p>
        <span aria-hidden="true" className="mt-1 block h-1.5 rounded-full bg-surface-muted"><span className="block h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: tones[tone].fill }} /></span>
      </div>
      <span className="tabular text-right text-[15px] font-semibold text-ink">{format(value)}</span>
    </li>
  );
}

/** Small figure tile: icon, label, big value with unit, period and an optional note. Render inside a <ul>. */
export function StatTile({ icon, tone = "purple", label, value, unit, period, note }: { icon: LucideIcon; tone?: Tone; label: string; value: string; unit?: string; period: string; note?: string }) {
  return (
    <li className="flex min-w-0 items-start gap-3 rounded-[var(--radius-md)] bg-surface-muted px-3.5 py-3">
      <IconTile icon={icon} tone={tone} />
      <div className="min-w-0">
        <p className="text-[13px] leading-snug text-body">{label}</p>
        <p className="tabular mt-1 flex flex-wrap items-baseline gap-x-1"><span className="text-[24px] font-bold leading-none tracking-tight" style={{ color: tones[tone].fg }}>{value}</span>{unit && <span className="text-[13px] text-muted">{unit}</span>}</p>
        <p className="mt-1 text-xs font-medium text-ink">{period}</p>
        {note && <p className="text-xs text-muted">{note}</p>}
      </div>
    </li>
  );
}

/** Change badge: green when the change is an improvement, rose when it is a deterioration, neutral otherwise. */
export function ChangeBadge({ children, good }: { children: ReactNode; good?: boolean | null }) {
  const t = good == null ? { bg: "#EEF0F4", fg: "#334155" } : good ? { bg: tones.teal.bg, fg: tones.teal.fg } : { bg: tones.rose.bg, fg: tones.rose.fg };
  return <span className="tabular inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: t.bg, color: t.fg }}>{children}</span>;
}

/**
 * Before and after figures for a two-observation series, with an icon and a computed change badge.
 * `lowerIsBetter` decides whether a fall is shown as an improvement.
 */
export function BeforeAfter({ icon, tone = "purple", label, before, after, format, change, lowerIsBetter, changeLabel = "change" }: {
  icon: LucideIcon; tone?: Tone; label?: string; before: { value: number; label: string }; after: { value: number; label: string };
  format: (v: number) => string; change: string; lowerIsBetter?: boolean; changeLabel?: string;
}) {
  const diff = after.value - before.value;
  const good = lowerIsBetter == null || diff === 0 ? null : lowerIsBetter ? diff < 0 : diff > 0;
  return (
    <div className="min-w-0">
      {label && <p className="mb-2 text-[13.5px] font-semibold text-ink">{label}</p>}
      <div className="flex items-center gap-3">
        <IconTile icon={icon} tone={tone} size="lg" />
        <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
          <p className="text-center"><span className="tabular block text-[22px] font-semibold leading-none text-body">{format(before.value)}</span><span className="mt-1 block text-xs text-muted">{before.label}</span></p>
          <ArrowRight size={18} aria-hidden="true" className="text-subtle" />
          <p className="text-center"><span className="tabular block text-[26px] font-bold leading-none" style={{ color: tones[tone].fg }}>{format(after.value)}</span><span className="mt-1 block text-xs font-semibold text-ink">{after.label}</span></p>
        </div>
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-body"><ChangeBadge good={good}>{change}</ChangeBadge><span>{changeLabel}</span></p>
    </div>
  );
}
