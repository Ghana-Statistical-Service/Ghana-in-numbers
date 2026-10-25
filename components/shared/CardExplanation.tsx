"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { getCardExplanation } from "@/data/cardExplanationContent";

type Props = {
  indicator?: string;
  label?: string;
  title?: string;
  meaning?: string;
  story?: string;
  source?: string;
  why?: string;
};

export default function CardExplanation({ indicator, label, title, meaning, story, source, why }: Props) {
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.close();
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!content.meaning || !content.story) return null;
  return <>
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={event => { event.stopPropagation(); setOpen(true); }}
      className="my-0.5 inline-flex w-fit self-start shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] leading-4 font-medium text-blue-700 transition-colors hover:bg-blue-50 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      data-explain-indicator={indicator ?? label}
    >Explain</button>
    {open && createPortal(
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-modal="true"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onKeyDown={event => {
          if (event.key !== "Tab") return;
          const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, [tabindex="0"]'));
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onClick={event => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setOpen(false);
        }}
        className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-dvh w-full max-w-full sm:w-[480px] flex flex-col overflow-hidden border-0 bg-white p-0 text-slate-700 shadow-2xl backdrop:bg-slate-950/20"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 p-5">
          <div><p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Understanding the indicator</p><h2 id={titleId} className="text-lg font-bold text-slate-800">{content.title}</h2></div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close explanation" className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-blue-600"><X size={18} /></button>
        </div>
        <div tabIndex={0} role="region" aria-label="Explanation content" className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 pb-8 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600">
          <section className="rounded-xl bg-blue-50 p-4"><h3 className="mb-2 text-sm font-bold text-blue-900">What it measures</h3><p className="text-sm leading-7 whitespace-pre-line">{content.meaning}</p></section>
          <section className="rounded-xl bg-emerald-50 p-4"><h3 className="mb-2 text-sm font-bold text-emerald-900">The story in this chart</h3><p className="text-sm leading-7 whitespace-pre-line">{content.story}</p></section>
          {content.why && <section className="rounded-xl bg-amber-50 p-4"><h3 className="mb-2 text-sm font-bold text-amber-900">Why does it matter?</h3><p className="text-sm leading-7 whitespace-pre-line">{content.why}</p></section>}
          {content.source && <p className="text-xs text-slate-500">Adapted from Ghana in Numbers 2025 · {content.source}.</p>}
        </div>
      </dialog>, document.body
    )}
  </>;
}
