"use client";

import { useId, useMemo, useRef, useState } from "react";
import { MapPin, MapPinned, Search, X } from "lucide-react";
import { regions } from "@/data/mpiData";
import places from "@/data/mpiPlaces.json";

export type Place = { kind: "region" | "district"; name: string; region: string };
const all: Place[] = [
  ...regions.map(r => ({ kind: "region" as const, name: r.region, region: r.region })),
  ...(places as string[][]).map(([name, region]) => ({ kind: "district" as const, name, region })),
];
export const findPlace = (kind: Place["kind"], name: string | null | undefined) => (name ? all.find(p => p.kind === kind && p.name.toLowerCase() === name.toLowerCase()) ?? null : null);
const fold = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** One search box for all 16 regions and 261 districts. Picking a place makes the dashboard about that place. */
export default function PlaceSearch({ place, onPick, onClear }: { place: Place | null; onPick: (place: Place) => void; onClear: () => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();

  const matches = useMemo(() => {
    const q = fold(query);
    if (!q) return all.filter(p => p.kind === "region");
    const words = q.split(" ");
    return all
      .map(p => { const name = fold(p.name); return { p, score: name.startsWith(q) ? 0 : words.every(w => name.includes(w)) ? 1 : words.every(w => fold(`${p.name} ${p.region}`).includes(w)) ? 2 : 9 }; })
      .filter(m => m.score < 9).sort((a, b) => a.score - b.score || (a.p.kind === b.p.kind ? a.p.name.localeCompare(b.p.name) : a.p.kind === "region" ? -1 : 1))
      .slice(0, 8).map(m => m.p);
  }, [query]);

  const pick = (p: Place) => { onPick(p); setQuery(""); setOpen(false); input.current?.blur(); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setCursor(c => Math.min(matches.length - 1, c + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor(c => Math.max(0, c - 1)); }
    else if (e.key === "Enter" && open && matches[cursor]) { e.preventDefault(); pick(matches[cursor]); }
    else if (e.key === "Escape") { setOpen(false); }
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative min-w-[16rem] flex-1 sm:max-w-xl">
        <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand" />
        <input ref={input} type="text" role="combobox" aria-expanded={open} aria-controls={listId} aria-autocomplete="list" aria-label="Find a region or district"
          aria-activedescendant={open && matches[cursor] ? `${listId}-${cursor}` : undefined}
          value={query} placeholder="Find your region or district, for example Karaga or Volta"
          onChange={e => { setQuery(e.target.value); setOpen(true); setCursor(0); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 120)} onKeyDown={onKey}
          className="h-12 w-full rounded-2xl border border-brand-line bg-surface pl-11 pr-4 text-[14px] text-ink shadow-card placeholder:text-subtle focus:border-brand" />
        {open && (
          <ul id={listId} role="listbox" aria-label="Regions and districts" className="absolute inset-x-0 top-[54px] z-40 max-h-[22rem] overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 shadow-pop">
            {!query && <li role="presentation" className="px-3 pb-1 pt-1.5 text-xs font-medium text-muted">Regions · type a name to search all 261 districts</li>}
            {matches.map((p, i) => (
              <li key={`${p.kind}-${p.name}`} id={`${listId}-${i}`} role="option" aria-selected={i === cursor}
                onMouseDown={e => { e.preventDefault(); pick(p); }} onMouseEnter={() => setCursor(i)}
                className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 py-1.5 text-[13.5px] ${i === cursor ? "bg-brand-soft" : ""}`}>
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-brand">{p.kind === "region" ? <MapPinned size={16} /> : <MapPin size={16} />}</span>
                <span className="min-w-0"><span className="block truncate font-medium text-ink">{p.name}</span><span className="block text-xs text-muted">{p.kind === "region" ? "Region · survey figures, 2021 census and its districts" : `District · ${p.region} Region`}</span></span>
              </li>
            ))}
            {!matches.length && <li role="presentation" className="px-3 py-3 text-[13px] text-muted">No region or district matches “{query}”.</li>}
          </ul>
        )}
      </div>
      {place && (
        <p className="mpi-rise inline-flex min-h-10 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#241B5A,#3C2FA3)] py-1 pl-4 pr-1.5 text-[13px] font-semibold text-white">
          <span className="text-white/75">Showing</span>{place.name}{place.kind === "region" ? " Region" : ""}
          <button type="button" onClick={onClear} aria-label={`Clear ${place.name} and show all of Ghana`} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"><X size={15} /></button>
        </p>
      )}
    </div>
  );
}
