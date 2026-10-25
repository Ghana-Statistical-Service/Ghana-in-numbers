import type { ReactNode } from "react";
import Link from "next/link";

/* Page → statistical section → indicator card. These three components carry the hierarchy on every route. */

export function PageBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  // Bottom padding leaves room for the floating assistant launcher so it never covers the last chart or table.
  return <div className={`mx-auto w-full max-w-[1400px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pt-8 ${className}`}>{children}</div>;
}

export type MetaItem = { label: string; value: string };

export function PageHeader({ eyebrow, title, description, meta, aside }: { eyebrow?: string; title: string; description: string; meta?: MetaItem[]; aside?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-brand">{eyebrow}</p>}
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-ink sm:text-[32px]">{title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{description}</p>
        {meta && meta.length > 0 && (
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
            {meta.map(item => (
              <div key={item.label} className="flex gap-1.5">
                <dt className="text-subtle">{item.label}</dt>
                <dd className="font-medium text-body">{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      {aside}
    </header>
  );
}

/** In-page navigation for long topic pages. Anchors match each Section id. */
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        {items.map(item => (
          <li key={item.id}>
            <Link href={`#${item.id}`} className="inline-flex min-h-9 items-center whitespace-nowrap rounded-full border border-line bg-surface px-3.5 text-[13px] font-medium text-body transition-colors hover:border-brand-line hover:bg-brand-soft hover:text-brand">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** `accent="green"` restores the green topic headings of the original Social Development page (dark green text for AA contrast). */
export function Section({ id, title, description, source, children, className = "", accent = "brand" }: { id: string; title: string; description?: string; source?: string; children: ReactNode; className?: string; accent?: "brand" | "green" }) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-6 [&+&]:mt-12 ${className}`}>
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="max-w-3xl">
          <h2 id={headingId} className={`flex items-center gap-3 text-xl font-semibold tracking-tight ${accent === "green" ? "text-[#0A6B37]" : "text-ink"}`}>
            <span aria-hidden className={`h-5 w-1 rounded-full ${accent === "green" ? "bg-[#00A651]" : "bg-brand"}`} />
            {title}
          </h2>
          {description && <p className="mt-1.5 pl-4 text-sm leading-relaxed text-muted">{description}</p>}
        </div>
        {source && <p className="pl-4 text-xs text-subtle sm:pl-0 sm:text-right">{source}</p>}
      </div>
      {children}
    </section>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 mt-8 text-[15px] font-semibold text-ink first:mt-0">{children}</h3>;
}

/** Responsive grid helpers. Column counts collapse to one column on phones. */
export function Grid({ cols = 2, children, className = "" }: { cols?: 1 | 2 | 3 | 4 | "2-1" | "1-2" | "3-2"; children: ReactNode; className?: string }) {
  const template = {
    1: "grid-cols-1",
    2: "lg:grid-cols-2",
    3: "md:grid-cols-2 xl:grid-cols-3",
    4: "sm:grid-cols-2 xl:grid-cols-4",
    "2-1": "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
    "1-2": "lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]",
    "3-2": "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]",
  }[cols];
  return <div className={`grid grid-cols-1 gap-4 lg:gap-5 ${template} ${className}`}>{children}</div>;
}
