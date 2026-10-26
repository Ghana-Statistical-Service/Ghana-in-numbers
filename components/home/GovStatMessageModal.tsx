"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

/** Shown once per browser on the overview (dismissal remembered in localStorage). A native modal dialog provides focus containment and Escape. */
export default function GovStatMessageModal() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try { if (!localStorage.getItem("gin-gs-message")) setOpen(true); } catch { /* storage unavailable: do not interrupt */ }
  }, []);

  useEffect(() => { if (open) ref.current?.showModal(); }, [open]);

  const close = useCallback(() => {
    ref.current?.close();
    setOpen(false);
    try { localStorage.setItem("gin-gs-message", "1"); } catch { /* ignore */ }
  }, []);

  if (!open) return null;

  return (
    <dialog
      ref={ref}
      aria-labelledby="gs-message-title"
      onCancel={event => { event.preventDefault(); close(); }}
      onClick={event => { if (event.target === event.currentTarget) close(); }}
      className="m-auto max-h-[90dvh] w-[min(680px,calc(100vw-24px))] overflow-hidden rounded-[var(--radius-xl)] border-0 bg-surface p-0 text-body shadow-pop"
    >
      <div className="flex max-h-[90dvh] flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand">Ghana in Numbers 2025</p>
            <h2 id="gs-message-title" className="mt-1 text-2xl font-semibold leading-tight text-ink">Message from the Government Statistician</h2>
          </div>
          <button type="button" onClick={close} aria-label="Close message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-muted hover:text-ink"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <div className="flow-root space-y-3 text-[14.5px] leading-relaxed text-body">
            <div className="mb-4 flex justify-center sm:float-left sm:mb-3 sm:mr-6 sm:block">
              <Image src="/gs.jpg" alt="Dr Alhassan Iddrisu, Government Statistician" width={200} height={248} className="h-auto w-[150px] rounded-lg object-cover sm:w-[190px]" style={{ objectPosition: "center top" }} />
            </div>
            <p>
              Ghana in Numbers brings together Ghana&apos;s official statistics in a single document
              to advance the understanding of statistics and guide evidence-based decision-making.
            </p>
            <p>
              This dashboard presents the publication in an accessible format, enabling
              policymakers, businesses, researchers, students, and the wider public to examine
              key national indicators, understand trends, and assess their implications.
            </p>
            <p>
              The evidence records important gains in health, economic activity, and
              macroeconomic stability. It also highlights persistent challenges, including
              youth disengagement from employment, education and training, widespread informal
              employment, and food insecurity.
            </p>
            <p>
              By bringing together these figures, trends, and their significance, Ghana in
              Numbers provides a common basis for public discussion, policy formulation,
              planning, and accountability. Presenting these developments together supports a
              balanced assessment of national progress and the areas requiring sustained attention.
            </p>
            <p>
              This initiative reflects the Ghana Statistical Service&apos;s commitment to more
              timely publication, wider access to official data through the StatsBank and other
              digital platforms, and a stronger National Statistical System. The value of this
              work lies in the extent to which reliable evidence informs decisions and action.
            </p>
            <p>
              As this first edition develops, the service will continue to acknowledge
              limitations in the available evidence and welcome feedback to guide future
              improvements. Users are encouraged to engage critically with the statistics and
              apply them responsibly. The enduring contribution of Ghana in Numbers will be
              measured by the decisions it improves and the development outcomes it supports.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
            <div>
              <p className="text-sm font-semibold tracking-wide text-ink">DR ALHASSAN IDDRISU</p>
              <p className="mt-0.5 text-[13px] text-muted">Government Statistician, Ghana Statistical Service</p>
            </div>
            <button type="button" onClick={close} className="h-10 rounded-[var(--radius-md)] bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-hover">Enter dashboard</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
