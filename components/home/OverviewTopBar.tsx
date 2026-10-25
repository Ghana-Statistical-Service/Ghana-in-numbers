"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronRight, HelpCircle, Home, Search, Share2, X } from "lucide-react";
import { useOpenSearch } from "@/components/layout/DashboardShell";

/** Slim sticky bar following the original layout (commit 2593469). Every control is functional. `page` names the breadcrumb; `regionalTarget` is the id the "Regional" option scrolls to. */
export default function OverviewTopBar({ page = "Overview", regionalTarget = "regional-picture" }: { page?: string; regionalTarget?: string }) {
  const openSearch = useOpenSearch();
  const [levelOpen, setLevelOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDialogElement>(null);
  const [isMac, setIsMac] = useState(false);
  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  useEffect(() => {
    if (!levelOpen) return;
    const onDown = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node)) setLevelOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLevelOpen(false); };
    document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [levelOpen]);

  useEffect(() => { if (helpOpen) helpRef.current?.showModal(); }, [helpOpen]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2500); return () => clearTimeout(t); }, [toast]);

  async function share() {
    const url = window.location.href.split("#")[0];
    try {
      if (navigator.share) { await navigator.share({ title: "Ghana in Numbers", text: "Ghana at a glance: official statistics from the Ghana Statistical Service", url }); return; }
      await navigator.clipboard.writeText(url);
      setToast("Link copied to the clipboard");
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") setToast("Could not share. Copy the address from your browser.");
    }
  }

  function goRegional() {
    setLevelOpen(false);
    const target = document.getElementById(regionalTarget);
    // Pages without a regional view send readers to the overview's regional picture.
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.assign("/#regional-picture");
  }

  const iconBtn = "flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:bg-surface-muted hover:text-ink";

  return (
    <>
      <header className="sticky top-0 z-30 hidden h-12 shrink-0 items-center gap-3 border-b border-line bg-surface/95 px-5 backdrop-blur lg:flex">
        <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1.5 text-[13px]">
          <Link href="/" className="flex items-center gap-1.5 rounded text-muted hover:text-ink"><Home size={15} aria-hidden /><span>Home</span></Link>
          <ChevronRight size={14} aria-hidden className="text-subtle" />
          <span aria-current="page" className="truncate font-medium text-ink">{page}</span>
        </nav>

        <div className="flex items-center gap-2">
          <span className="flex h-8 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-[13px] font-medium text-body" title="Country covered by the publication">
            <span aria-hidden className="flex h-3.5 w-5 flex-col overflow-hidden rounded-[2px] ring-1 ring-black/10"><span className="flex-1 bg-[#CE1126]" /><span className="flex-1 bg-[#FCD116]" /><span className="flex-1 bg-[#006B3F]" /></span>
            Ghana
          </span>

          <div ref={menuRef} className="relative">
            <button type="button" aria-haspopup="menu" aria-expanded={levelOpen} onClick={() => setLevelOpen(v => !v)} className="flex h-8 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-[13px] font-medium text-body hover:bg-surface-muted">
              <span aria-hidden className="h-3 w-3 rounded-[3px] bg-brand" />
              <span><span className="sr-only">Geography level: </span>National</span>
              <ChevronDown size={14} aria-hidden className="text-subtle" />
            </button>
            {levelOpen && (
              <ul role="menu" aria-label="Geography level" className="absolute right-0 top-10 z-40 w-64 rounded-[var(--radius-md)] border border-line bg-surface p-1 shadow-pop">
                <li role="none"><button role="menuitemradio" aria-checked="true" type="button" onClick={() => setLevelOpen(false)} className="flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left text-[13px] hover:bg-surface-muted"><Check size={15} aria-hidden className="mt-0.5 text-brand" /><span><span className="block font-medium text-ink">National</span><span className="block text-xs text-muted">Headline figures for Ghana</span></span></button></li>
                <li role="none"><button role="menuitemradio" aria-checked="false" type="button" onClick={goRegional} className="flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left text-[13px] hover:bg-surface-muted"><span className="w-[15px]" /><span><span className="block font-medium text-ink">Regional</span><span className="block text-xs text-muted">Go to the regional picture for all 16 regions</span></span></button></li>
              </ul>
            )}
          </div>

          <button type="button" onClick={openSearch} className={iconBtn} aria-label={`Search indicators (${isMac ? "⌘K" : "Ctrl+K"})`} title={`Search (${isMac ? "⌘K" : "Ctrl+K"})`}><Search size={15} /></button>
          <button type="button" onClick={share} className={iconBtn} aria-label="Share this page" title="Share this page"><Share2 size={15} /></button>
          <button type="button" onClick={() => setHelpOpen(true)} className="flex h-8 items-center gap-1.5 rounded-lg bg-brand px-3 text-[13px] font-semibold text-white hover:bg-brand-hover"><HelpCircle size={15} aria-hidden />Help</button>
        </div>
      </header>

      {toast && <div role="status" className="fixed left-1/2 top-16 z-50 -translate-x-1/2 rounded-[var(--radius-md)] bg-ink px-4 py-2 text-[13px] font-medium text-white shadow-pop">{toast}</div>}

      {helpOpen && (
        <dialog ref={helpRef} aria-labelledby="help-title" onCancel={e => { e.preventDefault(); setHelpOpen(false); }} onClose={() => setHelpOpen(false)}
          onClick={e => { if (e.target === e.currentTarget) setHelpOpen(false); }}
          className="m-auto max-h-[85dvh] w-[min(560px,calc(100vw-24px))] overflow-y-auto rounded-[var(--radius-xl)] border-0 bg-surface p-0 text-body shadow-pop">
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
            <h2 id="help-title" className="text-lg font-semibold text-ink">Using Ghana in Numbers</h2>
            <button type="button" onClick={() => setHelpOpen(false)} aria-label="Close help" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface-muted hover:text-ink"><X size={18} /></button>
          </div>
          <div className="space-y-4 px-6 py-5 text-[14px] leading-relaxed">
            <section><h3 className="font-semibold text-ink">Reading a figure</h3><p className="mt-1">Every value shows its unit and reference period. Badges mark projections, provisional and estimated figures. Periods differ between indicators, so compare like with like.</p></section>
            <section><h3 className="font-semibold text-ink">Explain and View data</h3><p className="mt-1"><strong>Explain</strong> opens what the indicator measures, the story in the chart and why it matters. <strong>View data</strong> under each chart lists the exact published figures.</p></section>
            <section><h3 className="font-semibold text-ink">Finding indicators</h3><p className="mt-1">Use the search in the sidebar or press <kbd className="rounded border border-line px-1 font-sans text-xs">{isMac ? "⌘" : "Ctrl"}</kbd> + <kbd className="rounded border border-line px-1 font-sans text-xs">K</kbd>. Topic pages follow the chapters of the publication.</p></section>
            <section><h3 className="font-semibold text-ink">Ask StatsChat</h3><p className="mt-1">The button at the bottom-right answers questions from the dashboard’s published data and cites its sources. Check the cited unit and period.</p></section>
            <section><h3 className="font-semibold text-ink">Source</h3><p className="mt-1">Ghana Statistical Service, <em>Ghana in Numbers 2025</em>. More data: <a href="https://statsghana.gov.gh/" target="_blank" rel="noreferrer" className="font-medium text-brand underline-offset-2 hover:underline">statsghana.gov.gh</a> and StatsBank.</p></section>
          </div>
        </dialog>
      )}
    </>
  );
}
