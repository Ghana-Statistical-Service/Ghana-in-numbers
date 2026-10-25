"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpenText, Info, LineChart, Lightbulb, X } from "lucide-react";
import { getCardExplanation } from "@/data/cardExplanationContent";

type Props = {
  indicator?: string;
  label?: string;
  title?: string;
  meaning?: string;
  story?: string;
  source?: string;
  why?: string;
  /** Icon-only trigger for tight spaces such as KPI cards; still has an accessible name. */
  compact?: boolean;
  /** Small inline text link ("Explain") used in the dense overview cards. */
  variant?: "button" | "link";
};

export default function CardExplanation({ indicator, label, title, meaning, story, source, why, compact = false, variant = "button" }: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const resolved = getCardExplanation(indicator, label);
  const content = {
    title: title ?? resolved?.title ?? label ?? "About this indicator",
    meaning: meaning ?? resolved?.meaning,
    story: story ?? resolved?.story,
    source: source ?? resolved?.source,
    why: why ?? resolved?.why,
  };

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!content.meaning || !content.story) return null;
  return <>
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={compact ? `Explain: ${content.title}` : undefined}
      title={compact ? "Explain this indicator" : undefined}
      onClick={event => { event.stopPropagation(); setOpen(true); }}
      className={variant === "link"
        ? "inline-flex min-h-6 shrink-0 items-center gap-1 rounded text-xs font-medium text-brand underline-offset-2 hover:underline"
        : compact
        ? "-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-subtle transition-colors hover:bg-brand-soft hover:text-brand"
        : "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[12.5px] font-medium text-brand transition-colors hover:border-brand-line hover:bg-brand-soft"}
      data-explain-indicator={indicator ?? label}
    >
      <Info size={compact ? 16 : variant === "link" ? 13 : 14} aria-hidden />
      {!compact && (variant === "link" ? <span>Explain</span> : "Explain")}
    </button>
    {open && createPortal(
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onKeyDown={event => {
          if (event.key !== "Tab") return;
          const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, [tabindex="0"]'));
          const first = focusable[0];
          const last = focusable.at(-1);
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }}
        onClick={event => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setOpen(false);
        }}
        className="fixed inset-y-0 left-auto right-0 m-0 flex h-dvh max-h-dvh w-full max-w-full flex-col overflow-hidden border-0 bg-surface p-0 text-body shadow-pop sm:w-[480px]"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand">Understanding the indicator</p>
            <h2 id={titleId} className="text-lg font-semibold leading-snug text-ink">{content.title}</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close explanation" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-muted hover:text-ink"><X size={20} /></button>
        </div>
        <div tabIndex={0} role="region" aria-label="Explanation" className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
          <ExplainBlock icon={<BookOpenText size={16} />} heading="What it measures" text={content.meaning} />
          <ExplainBlock icon={<LineChart size={16} />} heading="The story in this chart" text={content.story} />
          {content.why && <ExplainBlock icon={<Lightbulb size={16} />} heading="Why does it matter?" text={content.why} />}
          {content.source && <p className="border-t border-line pt-4 text-xs text-subtle">Adapted from Ghana in Numbers 2025 · {content.source}</p>}
        </div>
      </dialog>, document.body
    )}
  </>;
}

function ExplainBlock({ icon, heading, text }: { icon: React.ReactNode; heading: string; text: string }) {
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink"><span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-soft text-brand">{icon}</span>{heading}</h3>
      <p className="whitespace-pre-line text-[14.5px] leading-7 text-body">{text}</p>
    </section>
  );
}
