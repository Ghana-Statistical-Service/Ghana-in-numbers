"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HelpCircle, Map, MapPinned, Sparkles, Users, type LucideIcon } from "lucide-react";
import { mpiViews, type MpiViewId } from "@/data/mpiData";
import OverviewView from "./OverviewView";
import PlaceSearch, { findPlace, type Place } from "./PlaceSearch";

const loading = () => <div className="h-96 animate-pulse rounded-[var(--radius-lg)] bg-surface-muted" aria-busy="true" />;
const RegionsView = dynamic(() => import("./RegionsView"), { loading });
const DistrictsView = dynamic(() => import("./DistrictsView"), { loading });
const GroupsView = dynamic(() => import("./GroupsView"), { loading });
const MethodView = dynamic(() => import("./MethodView"), { loading });

const icons: Record<MpiViewId, LucideIcon> = { overview: Sparkles, regions: Map, districts: MapPinned, groups: Users, method: HelpCircle };
const isView = (id: string | null | undefined): id is MpiViewId => !!id && mpiViews.some(v => v.id === id);

export type MpiState = { view: MpiViewId; region: string | null; district: string | null };
const fromParams = (view?: string | null, region?: string | null, district?: string | null): MpiState => {
  const d = findPlace("district", district), r = findPlace("region", region);
  return { view: isView(view) ? view : d ? "districts" : r ? "regions" : "overview", region: r?.name ?? null, district: d?.name ?? null };
};

/**
 * Five tabs, one question each (guidelines §7), and one selected place shared by all of them.
 * The open tab and the selected region or district live in the address (?view=, ?region=, ?district=) so any view can be shared.
 */
export default function MpiDashboard({ view: initialView, region: initialRegion, district: initialDistrict }: { view?: string; region?: string; district?: string }) {
  const [state, setState] = useState<MpiState>(() => fromParams(initialView, initialRegion, initialDistrict));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  // A link from the site search or StatsChat changes the address without remounting the page.
  useEffect(() => { setState(fromParams(initialView, initialRegion, initialDistrict)); }, [initialView, initialRegion, initialDistrict]);
  // Older links used #districts and similar.
  useEffect(() => { const hash = window.location.hash.slice(1); if (isView(hash) && !initialView) setState(s => ({ ...s, view: hash })); }, [initialView]);

  const current = useRef(state);
  current.current = state;
  const update = useCallback((patch: Partial<MpiState>, scroll = false) => {
    const next = { ...current.current, ...patch };
    current.current = next;
    setState(next);
    // The address is written outside the state update: the router listens to history changes.
    const url = new URL(window.location.href);
    url.hash = "";
    if (next.view === "overview") url.searchParams.delete("view"); else url.searchParams.set("view", next.view);
    if (next.region) url.searchParams.set("region", next.region); else url.searchParams.delete("region");
    if (next.district) url.searchParams.set("district", next.district); else url.searchParams.delete("district");
    window.history.replaceState(null, "", url);
    if (scroll) requestAnimationFrame(() => document.getElementById("mpi-top")?.scrollIntoView({ block: "start" }));
  }, []);

  const go = useCallback((view: MpiViewId) => update({ view }, true), [update]);
  const openRegion = useCallback((region: string | null, jump = true) => update(jump && region ? { view: "regions", region, district: null } : { region, district: null }, jump && !!region), [update]);
  const openDistrict = useCallback((district: string | null, jump = true) => update(jump && district ? { view: "districts", district, region: null } : { district }, jump && !!district), [update]);

  const place: Place | null = findPlace("district", state.district) ?? findPlace("region", state.region);
  const onKey = (event: React.KeyboardEvent, index: number) => {
    const move = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : event.key === "Home" ? -index : event.key === "End" ? mpiViews.length - 1 - index : 0;
    if (!move) return;
    event.preventDefault();
    const next = (index + move + mpiViews.length) % mpiViews.length;
    tabs.current[next]?.focus();
    update({ view: mpiViews[next].id });
  };
  const { view } = state;

  return (
    <div id="mpi-top" className="scroll-mt-2">
      <PlaceSearch place={place} onPick={p => (p.kind === "region" ? openRegion(p.name) : openDistrict(p.name))} onClear={() => update({ region: null, district: null })} />

      <div id="mpi-tabs" className="sticky top-0 z-20 -mx-4 mb-6 bg-canvas/90 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 lg:top-12 lg:-mx-8 lg:px-8">
        <div role="tablist" aria-label="Multidimensional poverty views" className="flex gap-1.5 overflow-x-auto rounded-2xl border border-line bg-surface p-1.5 shadow-card">
          {mpiViews.map((v, index) => {
            const selected = v.id === view;
            const Icon = icons[v.id];
            return (
              <button key={v.id} ref={el => { tabs.current[index] = el; }} role="tab" type="button" id={`mpi-tab-${v.id}`} aria-selected={selected} aria-controls={`mpi-panel-${v.id}`} tabIndex={selected ? 0 : -1}
                onClick={() => go(v.id)} onKeyDown={e => onKey(e, index)}
                className={`flex min-h-[52px] flex-1 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-left transition-all ${selected ? "bg-[linear-gradient(135deg,#241B5A,#3C2FA3)] text-white shadow-[0_8px_18px_-8px_rgba(36,27,90,0.7)]" : "text-muted hover:bg-brand-soft hover:text-ink"}`}>
                <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-white/15 text-[#F5C451]" : "bg-surface-muted text-brand"}`}><Icon size={16} /></span>
                <span>
                  <span className={`block text-xs font-medium ${selected ? "text-white/75" : ""}`}>{v.question}</span>
                  <span className={`block text-[14px] font-semibold ${selected ? "text-white" : "text-ink"}`}>{v.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div role="tabpanel" id={`mpi-panel-${view}`} aria-labelledby={`mpi-tab-${view}`} tabIndex={-1} className="outline-none">
        {view === "overview" && <OverviewView go={go} place={place} openRegion={openRegion} openDistrict={openDistrict} />}
        {view === "regions" && <RegionsView region={state.region} openRegion={openRegion} openDistrict={openDistrict} go={go} />}
        {view === "districts" && <DistrictsView region={state.region} district={state.district} setRegion={region => update({ region, district: null })} openDistrict={openDistrict} />}
        {view === "groups" && <GroupsView />}
        {view === "method" && <MethodView />}
      </div>
    </div>
  );
}
