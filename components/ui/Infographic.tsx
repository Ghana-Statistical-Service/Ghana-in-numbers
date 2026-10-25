import type { ReactNode } from "react";
import { User, type LucideIcon } from "lucide-react";

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
      <ol className="grid flex-1 items-end gap-2" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((d, i) => {
          const latest = i === data.length - 1;
          const size = 22 + (max === min ? 1 : (d.value - min) / (max - min)) * 14;
          return (
            <li key={d.year} className="flex flex-col items-center text-center">
              <span className="tabular font-semibold leading-none tracking-tight" style={{ fontSize: `min(${size + (latest ? 4 : 0)}px, 7vw)`, color: latest ? tones[tone].fg : "#334155", fontWeight: latest ? 700 : 600 }}>
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
