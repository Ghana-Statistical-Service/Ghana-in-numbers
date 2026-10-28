"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

/** The Government Statistician's preface to the final edition (p. vii), shown once per browser on the overview (dismissal remembered in localStorage). A native modal dialog provides focus containment and Escape. */
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
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand">Preface · Ghana in Numbers 2025</p>
            <h2 id="gs-message-title" className="mt-1 text-2xl font-semibold leading-tight text-ink">Message from the Government Statistician</h2>
          </div>
          <button type="button" onClick={close} aria-label="Close message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-muted hover:text-ink"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <div className="flow-root space-y-3 text-[14.5px] leading-relaxed text-body">
            <div className="mb-4 flex justify-center sm:float-left sm:mb-3 sm:mr-6 sm:block">
              <Image src="/gs.jpg" alt="Dr Alhassan Iddrisu, Government Statistician" width={200} height={248} className="h-auto w-[150px] rounded-lg object-cover sm:w-[190px]" style={{ objectPosition: "center top" }} />
            </div>
            <p>Ghana in Numbers asks a simple question: what do the official statistics tell us about Ghana, and how can people use them to make decisions?</p>
            <p>The report shows a country of 33.7 million people in 2025. Life expectancy rose from about 40 years in 1960 to 65.1 years in 2021, and nominal GDP per person in 2025 was about nine times its 2013 level. The first Integrated Business Establishment Survey counted 2,644,363 businesses in 2024, three in ten of them working without a building; nine in ten establishments were micro businesses with one to five people, and only 7.7 percent were formal. In public finance, the commitment-basis overall deficit narrowed from 6.9 percent of GDP in 2024 to 1.0 percent in 2025, while the primary balance moved from a deficit of 2.9 percent to a surplus of 2.5 percent. Inflation fell from 54.1 percent in December 2022 to 5.4 percent in December 2025, and lending to businesses and families grew by 13.1 percent after allowing for inflation. However, this lending was 7.4 percent of GDP, and 18.9 percent of bank loans were not being repaid on time. Other chapters show that close to two million people aged 15 to 35 were neither employed nor enrolled in education or training in the third quarter of 2025, more than seven in ten jobs were informal, and about 13 million people faced food insecurity in 2025. The report presents these figures together so readers can see both the changes and the remaining gaps.</p>
            <p>We built it for the general reader, not the specialist. Every indicator is given three ways, the number, the trend behind it, and what it means, so that a district officer, a journalist, a student, a business owner, or a minister can reason from the same evidence. You do not need to be a statistician to use this book. That is deliberate.</p>
            <p>It also marks how the Service itself is changing. We are shortening the distance between collecting data and publishing it, releasing more data openly through Stats Bank, the GSS website, and the GSS Stats App, and strengthening the wider National Statistical System so that Ghana reasons from one consistent set of numbers. Producing statistics is no longer the finish line. Use is.</p>
            <p>This is a first edition, not the last word. Where the evidence is thin, we say so plainly rather than fill the gap with confidence we have not earned. Read it, cite it, argue with it, and tell us what is missing. A statistic changes nothing until someone acts on it, and this volume will be judged not by the copies we distribute but by the decisions it improves.</p>
          </div>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
            <div>
              <p className="text-sm font-semibold tracking-wide text-ink">DR ALHASSAN IDDRISU</p>
              <p className="mt-0.5 text-[13px] text-muted">Government Statistician, Ghana Statistical Service</p>
              <p className="mt-0.5 text-xs text-muted">Preface to Ghana in Numbers 2025, p. vii</p>
            </div>
            <button type="button" onClick={close} className="h-10 rounded-[var(--radius-md)] bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-hover">Enter dashboard</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
