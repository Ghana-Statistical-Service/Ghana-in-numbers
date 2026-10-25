import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import CardExplanation from "@/components/shared/CardExplanation";

export type ExplainProps = { indicator?: string; label?: string; title?: string; meaning?: string; story?: string; why?: string; source?: string };

export function Card({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "article" | "section" }) {
  return <Tag className={`min-w-0 rounded-[var(--radius-lg)] border border-line bg-surface shadow-card ${className}`}>{children}</Tag>;
}

/** Qualifiers such as "Provisional" or "Projection" travel with the value they qualify. */
export function Qualifier({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "caution" | "brand" }) {
  const cls = { neutral: "bg-surface-muted text-muted ring-line", caution: "bg-caution-bg text-caution ring-[#F3D9A4]", brand: "bg-brand-soft text-brand ring-brand-line" }[tone];
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}>{children}</span>;
}

/**
 * Indicator card: title → what is measured (unit) → period → figure → reading notes and source.
 * `explain` opens the right-hand Explain panel; essential chart-reading notes stay visible in `notes`.
 */
export function ChartCard({
  title, subtitle, period, qualifier, explain, explainCompact = false, actions, children, notes, source, footer, className = "", id,
}: {
  title: string; subtitle?: ReactNode; period?: string; qualifier?: ReactNode; explain?: ExplainProps; explainCompact?: boolean; actions?: ReactNode;
  children: ReactNode; notes?: ReactNode; source?: string; footer?: ReactNode; className?: string; id?: string;
}) {
  return (
    <Card as="article" className={`flex flex-col p-4 sm:p-5 ${className}`}>
      <div id={id} className={`flex items-start justify-between gap-x-4 gap-y-2 ${actions ? "flex-wrap" : ""}`}>
        <div className={`min-w-0 flex-1 ${actions ? "basis-56" : ""}`}>
          <h3 className="text-[15px] font-semibold leading-snug text-ink">{title}</h3>
          {subtitle && <p className="mt-1 text-[13px] leading-snug text-muted">{subtitle}</p>}
          {(period || qualifier) && (
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] leading-snug">
              {period && <span className="font-medium text-body">{period}</span>}
              {qualifier}
            </p>
          )}
        </div>
        {(actions || explain) && (
          <div className="flex flex-wrap items-center gap-2">
            {actions}
            {explain && <CardExplanation {...explain} compact={explainCompact} title={explain.title ?? (explain.indicator || explain.label ? undefined : title)} />}
          </div>
        )}
      </div>
      <div className="mt-4 flex min-h-0 flex-1 flex-col">{children}</div>
      {(notes || source) && (
        <div className="mt-4 space-y-1.5 border-t border-line pt-3 text-xs leading-relaxed text-subtle">
          {notes && <div className="text-muted">{notes}</div>}
          {source && <p>Source: {source}</p>}
        </div>
      )}
      {footer && <div className="mt-4">{footer}</div>}
    </Card>
  );
}

/** Headline value. Value and unit sit on the same baseline so the unit cannot drift away from the number. */
export function KpiCard({
  label, value, unit, period, qualifier, explain, note, emphasis = false, icon: Icon,
}: {
  label: string; value: string; unit?: string; period: string; qualifier?: string; explain?: ExplainProps; note?: string; emphasis?: boolean; icon?: LucideIcon;
}) {
  const tight = unit === "%" || unit === "°C";
  return (
    <Card className={`flex flex-col p-4 ${emphasis ? "border-brand-line bg-[linear-gradient(180deg,#FBFAFF,#FFFFFF)]" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-start gap-2 text-[13px] font-medium leading-snug text-muted">
          {Icon && <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand"><Icon size={16} aria-hidden="true" /></span>}
          <span className={Icon ? "pt-1" : ""}>{label}</span>
        </p>
        {explain && <CardExplanation {...explain} compact />}
      </div>
      <p className="tabular mt-2 flex flex-wrap items-baseline gap-x-1 text-ink">
        <span className="text-[30px] font-semibold leading-none tracking-tight">{value}</span>
        {unit && <span className={`font-medium text-muted ${tight ? "-ml-0.5 text-[20px]" : "text-[15px]"}`}>{unit}</span>}
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-3">
        <span className="text-[12.5px] font-medium text-body">{period}</span>
        {qualifier && <Qualifier tone={/provisional|projection|projected|estimate/i.test(qualifier) ? "caution" : "neutral"}>{qualifier}</Qualifier>}
      </div>
      {note && <p className="mt-1.5 text-xs leading-relaxed text-subtle">{note}</p>}
    </Card>
  );
}

export function KpiGrid({ children, cols = 5 }: { children: ReactNode; cols?: 3 | 4 | 5 }) {
  const c = { 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 xl:grid-cols-4", 5: "sm:grid-cols-3 xl:grid-cols-5" }[cols];
  return <div className={`mb-10 grid grid-cols-2 gap-3 lg:gap-4 ${c}`}>{children}</div>;
}

/** Compact figure used inside cards: label, value with unit, short context. */
export function Stat({ label, value, unit, context, tone = "default" }: { label: string; value: string; unit?: string; context?: ReactNode; tone?: "default" | "brand" }) {
  return (
    <div className={`min-w-0 rounded-[var(--radius-md)] px-4 py-3 ${tone === "brand" ? "bg-nav text-white" : "bg-surface-muted"}`}>
      <p className={`text-xs font-medium ${tone === "brand" ? "text-white/80" : "text-muted"}`}>{label}</p>
      <p className="tabular mt-1 flex flex-wrap items-baseline gap-x-1">
        <span className={`text-2xl font-semibold tracking-tight ${tone === "brand" ? "text-white" : "text-ink"}`}>{value}</span>
        {unit && <span className={`text-[13px] ${tone === "brand" ? "text-white/80" : "text-muted"}`}>{unit}</span>}
      </p>
      {context && <p className={`mt-1 text-xs leading-relaxed ${tone === "brand" ? "text-white/80" : "text-subtle"}`}>{context}</p>}
    </div>
  );
}

export function Callout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-brand-line bg-brand-soft/60 px-4 py-3 text-[13px] leading-relaxed text-body">
      {title && <p className="mb-0.5 font-semibold text-ink">{title}</p>}
      {children}
    </div>
  );
}
