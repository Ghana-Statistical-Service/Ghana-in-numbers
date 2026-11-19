"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ClipboardCheck, HelpCircle, MapPinned, PieChart, Search, ShieldCheck, X, type LucideIcon } from "lucide-react";
import { Caveat } from "@/components/mpi/parts";
import { checkOrder, prepare, summarise, tabs, type AdminFile, type CheckId, type District, type Scope, type TabId } from "@/lib/adminMonitoring";
import OverviewView from "./OverviewView";

const loading = () => <div className="h-96 animate-pulse rounded-[var(--radius-lg)] bg-surface-muted" aria-busy="true" />;
const CompletenessView = dynamic(() => import("./CompletenessView"), { loading });
const ChecksView = dynamic(() => import("./ChecksView"), { loading });
const DistrictsView = dynamic(() => import("./DistrictsView"), { loading });
const MethodView = dynamic(() => import("./MethodView"), { loading });

const icons: Record<TabId, LucideIcon> = { overview: ClipboardCheck, completeness: PieChart, checks: ShieldCheck, districts: MapPinned, method: HelpCircle };
const isTab = (id: string | null): id is TabId => tabs.some(t => t.id === id);
const isCheck = (id: string | null): id is CheckId => checkOrder.includes(id as CheckId);

export type ViewProps = {
  file: AdminFile; all: District[]; national: Scope; scope: Scope; region: string | null;
  go: (tab: TabId, check?: CheckId) => void; setRegion: (region: string | null) => void; openDistrict: (name: string) => void;
};

type State = { tab: TabId; region: string | null; district: string | null; check: CheckId };

/**
 * Five tabs, one question each. The tab, region, district and check are kept in the page address, so any view
 * can be shared as a link. The region filter applies to every tab; a district opens as a profile in the Districts tab.
 */
export default function AdminDashboard() {
  const [file, setFile] = useState<AdminFile | null>(null);
  const [failed, setFailed] = useState(false);
  const [state, setState] = useState<State>({ tab: "overview", region: null, district: null, check: "repeats" });
  const [query, setQuery] = useState("");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    let live = true;
    import("@/data/adminMonitoring.json").then(m => { if (live) setFile(m.default as unknown as AdminFile); }).catch(() => live && setFailed(true));
    const read = () => {
      const q = new URLSearchParams(window.location.search);
      const tab = q.get("tab"), check = q.get("check");
      const next: State = { tab: isTab(tab) ? tab : q.get("district") ? "districts" : "overview", region: q.get("region"), district: q.get("district"), check: isCheck(check) ? check : "repeats" };
      current.current = next;
      setState(next);
    };
    read();
    window.addEventListener("popstate", read);
    return () => { live = false; window.removeEventListener("popstate", read); };
  }, []);

  const current = useRef(state);
  const update = useCallback((patch: Partial<State>, scroll = true) => {
    const next = { ...current.current, ...patch };
    current.current = next;
    setState(next);
    const q = new URLSearchParams();
    if (next.tab !== "overview") q.set("tab", next.tab);
    if (next.region) q.set("region", next.region);
    if (next.district) q.set("district", next.district);
    if (next.tab === "checks") q.set("check", next.check);
    const s = q.toString();
    window.history.pushState(null, "", `${window.location.pathname}${s ? `?${s}` : ""}`);
    if (scroll) requestAnimationFrame(() => document.getElementById("adm-tabs")?.scrollIntoView({ block: "start" }));
  }, []);

  const all = useMemo(() => (file ? prepare(file) : []), [file]);
  const national = useMemo(() => (file ? summarise("Ghana", all, file) : null), [file, all]);
  const regions = useMemo(() => [...new Set(all.map(d => d.region))].sort(), [all]);
  // A region or district in the address that does not exist is ignored rather than shown as an empty page.
  const region = state.region && regions.includes(state.region) ? state.region : null;
  const district = state.district && all.some(d => d.name === state.district) ? state.district : null;
  const scope = useMemo(() => (!file || !national ? null : region ? summarise(`${region} Region`, all.filter(d => d.region === region), file) : national), [file, national, all, region]);

  const go = useCallback((tab: TabId, check?: CheckId) => update({ tab, district: null, ...(check ? { check } : {}) }), [update]);
  const setRegion = useCallback((r: string | null) => update({ region: r, district: null }, false), [update]);
  const openDistrict = useCallback((name: string) => update({ tab: "districts", district: name }), [update]);

  if (failed) return <Caveat title="The monitoring data could not be loaded">Reload the page. If the problem continues, contact the Ghana Statistical Service data team.</Caveat>;
  if (!file || !national || !scope) return <div className="h-[32rem] animate-pulse rounded-[var(--radius-lg)] bg-surface-muted" aria-busy="true" aria-label="Loading the monitoring data" />;

  const onKey = (event: React.KeyboardEvent, index: number) => {
    const move = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : event.key === "Home" ? -index : event.key === "End" ? tabs.length - 1 - index : 0;
    if (!move) return;
    event.preventDefault();
    const next = (index + move + tabs.length) % tabs.length;
    tabRefs.current[next]?.focus();
    go(tabs[next].id);
  };
  const props: ViewProps = { file, all, national, scope, region, go, setRegion, openDistrict };
  const control = "h-10 rounded-[var(--radius-md)] border border-line-strong bg-surface text-[13px] text-ink";

  return (
    <div>
      <div id="adm-tabs" className="z-20 -mx-4 mb-6 bg-canvas/90 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 lg:sticky lg:top-12 lg:-mx-8 lg:px-8">
        <div role="tablist" aria-label="Administrative data monitor views" className="flex gap-1.5 overflow-x-auto rounded-2xl border border-line bg-surface p-1.5 shadow-card">
          {tabs.map((t, index) => {
            const selected = t.id === state.tab, Icon = icons[t.id];
            return (
              <button key={t.id} ref={el => { tabRefs.current[index] = el; }} role="tab" type="button" id={`adm-tab-${t.id}`} aria-selected={selected} aria-controls={`adm-panel-${t.id}`} tabIndex={selected ? 0 : -1}
                onClick={() => go(t.id)} onKeyDown={e => onKey(e, index)}
                className={`flex min-h-[52px] flex-1 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-left transition-all ${selected ? "bg-[linear-gradient(135deg,#241B5A,#3C2FA3)] text-white shadow-[0_8px_18px_-8px_rgba(36,27,90,0.7)]" : "text-muted hover:bg-brand-soft hover:text-ink"}`}>
                <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-white/15 text-[#F5C451]" : "bg-surface-muted text-brand"}`}><Icon size={16} /></span>
                <span>
                  <span className={`block text-xs font-medium ${selected ? "text-white/75" : ""}`}>{t.question}</span>
                  <span className={`block text-[14px] font-semibold ${selected ? "text-white" : "text-ink"}`}>{t.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {state.tab !== "method" && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            <label className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-muted">Showing</span>
              <select value={region ?? ""} onChange={e => setRegion(e.target.value || null)} className={`${control} px-3 font-semibold`}>
                <option value="">All 16 regions (261 districts)</option>
                {regions.map(r => <option key={r} value={r}>{r} Region ({all.filter(d => d.region === r).length} districts)</option>)}
              </select>
            </label>
            {region && <button type="button" onClick={() => setRegion(null)} className="inline-flex min-h-9 items-center gap-1 rounded-full border border-line bg-surface px-3 text-[13px] font-medium text-brand hover:bg-brand-soft"><X size={14} aria-hidden="true" />Back to all regions</button>}
            <label className="relative ml-auto block w-full sm:w-72">
              <span className="sr-only">Open a district profile</span>
              <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
              <input list="adm-districts" value={query} placeholder="Open a district profile"
                onChange={e => { const v = e.target.value; const hit = all.find(d => d.name.toLowerCase() === v.trim().toLowerCase()); if (hit) { setQuery(""); openDistrict(hit.name); } else setQuery(v); }}
                className={`${control} w-full pl-9 pr-3 placeholder:text-subtle`} />
              <datalist id="adm-districts">{all.map(d => <option key={d.name} value={d.name}>{d.region}</option>)}</datalist>
            </label>
          </div>
        )}
      </div>

      <div role="tabpanel" id={`adm-panel-${state.tab}`} aria-labelledby={`adm-tab-${state.tab}`} tabIndex={-1} className="outline-none">
        {state.tab === "overview" && <OverviewView {...props} />}
        {state.tab === "completeness" && <CompletenessView {...props} />}
        {state.tab === "checks" && <ChecksView {...props} check={state.check} setCheck={check => update({ check }, false)} />}
        {state.tab === "districts" && <DistrictsView {...props} district={district} closeDistrict={() => update({ district: null })} />}
        {state.tab === "method" && <MethodView national={national} compiled={file.compiled} />}
      </div>
    </div>
  );
}
