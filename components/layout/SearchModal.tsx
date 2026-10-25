"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, FileText, Hash, Search, TrendingUp, X } from "lucide-react";
import { querySearch, type SearchItem } from "@/lib/searchIndex";
import { navGroups } from "@/lib/navigation";

const kindIcon = { Page: FileText, Section: Hash, Indicator: TrendingUp };
const suggestions = ["Inflation", "Unemployment", "Fiscal balance", "Fertility", "NEET", "Forest", "Poverty", "Trade"];

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(() => querySearch(query), [query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    setQuery(""); setActiveIndex(0);
    dialog.showModal();
    inputRef.current?.focus();
    return () => { dialog.close(); if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, [isOpen]);

  useEffect(() => setActiveIndex(0), [query]);

  function go(item: SearchItem) {
    onClose();
    router.push(item.href);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    else if (event.key === "Enter" && results[activeIndex]) { event.preventDefault(); go(results[activeIndex]); }
  }

  if (!isOpen) return null;

  const activeId = results[activeIndex] ? `${listId}-${activeIndex}` : undefined;
  return (
    <dialog
      ref={dialogRef}
      aria-label="Search Ghana in Numbers"
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      className="m-0 mx-auto mt-[max(16px,10vh)] max-h-[min(640px,80dvh)] w-[min(640px,calc(100vw-24px))] overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface p-0 text-body shadow-pop"
    >
      <div className="flex max-h-[min(640px,80dvh)] flex-col">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={18} aria-hidden className="shrink-0 text-subtle" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="Search indicators, topics and sections"
            value={query}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search indicators, topics and sections"
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-subtle [&::-webkit-search-cancel-button]:hidden"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="flex h-9 w-9 items-center justify-center rounded-lg text-subtle hover:bg-surface-muted hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {query.trim() === "" ? (
            <div className="space-y-5 p-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">Try</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map(term => <button key={term} type="button" onClick={() => { setQuery(term); inputRef.current?.focus(); }} className="rounded-full border border-line px-3 py-1.5 text-sm text-body hover:border-brand-line hover:bg-brand-soft hover:text-brand">{term}</button>)}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">Topics</p>
                <ul className="grid gap-1 sm:grid-cols-2">
                  {navGroups.flatMap(group => group.items).map(item => (
                    <li key={item.href}><button type="button" onClick={() => { onClose(); router.push(item.href); }} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-body hover:bg-surface-muted hover:text-ink"><item.icon size={16} aria-hidden className="text-brand" />{item.label}</button></li>
                  ))}
                </ul>
              </div>
            </div>
          ) : results.length === 0 ? (
            <p role="status" className="px-4 py-10 text-center text-sm text-muted">No indicators or sections match “{query}”. Try a broader term, such as “inflation” or “population”.</p>
          ) : (
            <ul id={listId} role="listbox" aria-label="Search results" className="p-2">
              {results.map((item, index) => {
                const Icon = kindIcon[item.kind];
                const active = index === activeIndex;
                return (
                  <li key={item.id} id={`${listId}-${index}`} role="option" aria-selected={active} onMouseEnter={() => setActiveIndex(index)} onClick={() => go(item)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${active ? "bg-brand-soft" : ""}`}>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${active ? "bg-white text-brand" : "bg-surface-muted text-muted"}`}><Icon size={16} aria-hidden /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">{item.title}</span>
                      <span className="block truncate text-xs text-muted">{item.kind} · {item.category}{item.period ? ` · ${item.period}` : ""}</span>
                    </span>
                    {item.value && <span className="tabular shrink-0 text-sm font-semibold text-ink">{item.value}</span>}
                    {active && <CornerDownLeft size={14} aria-hidden className="shrink-0 text-brand" />}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-subtle sm:flex">
          <span><kbd className="rounded border border-line px-1 font-sans">↑</kbd> <kbd className="rounded border border-line px-1 font-sans">↓</kbd> move</span>
          <span><kbd className="rounded border border-line px-1 font-sans">Enter</kbd> open</span>
          <span><kbd className="rounded border border-line px-1 font-sans">Esc</kbd> close</span>
        </div>
      </div>
    </dialog>
  );
}
