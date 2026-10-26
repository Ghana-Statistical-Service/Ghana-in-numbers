"use client";

import { useEffect, useMemo, useState } from "react";
import RegionalMap from "@/components/maps/RegionalMap";
import { ChartCard } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Data";
import { REGIONS } from "@/data/publicationAdditions";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthLabel = (code: string) => { const [y, m] = code.split("M"); return `${MONTHS[+m - 1]} ${y}`; };
type Indicator = "population" | "inflation";
type Raw = { fetchedAt?: string; response: { data: { key: string[]; values: string[] }[] } };

/**
 * Regional overview from locally cached StatsBank extracts. These longer series are dated by fetch and are not
 * replacements for the publication's reference figures shown elsewhere.
 */
export default function ChoroplethMap() {
  const [indicator, setIndicator] = useState<Indicator>("population");
  const [cpi, setCpi] = useState<Record<string, Record<string, number>>>({});
  const [proj, setProj] = useState<Record<string, Record<string, number>>>({});
  const [fetched, setFetched] = useState<{ cpi?: string; proj?: string }>({});
  const [month, setMonth] = useState("2025M12");
  const [year, setYear] = useState("2025");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.all([fetch("/data/cpiData.json").then(r => r.json() as Promise<Raw>), fetch("/data/projectionData.json").then(r => r.json() as Promise<Raw>)])
      .then(([c, p]) => {
        if (!live) return;
        const cm: Record<string, Record<string, number>> = {};
        for (const d of c.response.data) { const [ind, m, region] = d.key; const v = parseFloat(d.values[0]); if (ind.startsWith("Year-on-year") && !Number.isNaN(v)) (cm[m] ??= {})[region] = v; }
        const pm: Record<string, Record<string, number>> = {};
        for (const d of p.response.data) { const [y, region] = d.key; const v = parseInt(d.values[0], 10); if (!Number.isNaN(v)) (pm[y] ??= {})[region] = v; }
        setCpi(cm); setProj(pm); setFetched({ cpi: c.fetchedAt, proj: p.fetchedAt });
      })
      .catch(() => live && setFailed(true));
    return () => { live = false; };
  }, []);

  const months = useMemo(() => Object.keys(cpi).sort().reverse(), [cpi]);
  const years = useMemo(() => Object.keys(proj).sort(), [proj]);
  const source = indicator === "population" ? proj[year] : cpi[month];
  const data = REGIONS.map(region => ({ region, value: source?.[region] ?? null }));
  const national = source?.Ghana;
  const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "";

  const format = indicator === "population" ? (v: number) => v >= 1e6 ? `${(v / 1e6).toFixed(2)}M` : `${Math.round(v / 1000)}k` : (v: number) => `${v.toFixed(1)}%`;

  return (
    <ChartCard
      title="Regional picture"
      subtitle={indicator === "population" ? "Projected population by region" : "Consumer inflation by region, year on year"}
      period={indicator === "population" ? year : monthLabel(month)}
      qualifier={indicator === "population" ? <span className="rounded-full bg-caution-bg px-2 py-0.5 text-xs font-semibold text-caution">Projection</span> : undefined}
      explain={{ indicator: indicator === "population" ? "population" : "inflation" }}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Segmented label="Map indicator" size="sm" value={indicator} onChange={setIndicator} options={[{ value: "population", label: "Population" }, { value: "inflation", label: "Consumer Inflation" }]} />
          {indicator === "population" ? (
            <label className="sr-only" htmlFor="map-year">Projection year</label>
          ) : <label className="sr-only" htmlFor="map-month">Month</label>}
          {indicator === "population"
            ? <select id="map-year" value={year} onChange={e => setYear(e.target.value)} className="h-8 rounded-md border border-line bg-surface px-2 text-[13px] text-body">{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
            : <select id="map-month" value={month} onChange={e => setMonth(e.target.value)} className="h-8 rounded-md border border-line bg-surface px-2 text-[13px] text-body">{months.map(m => <option key={m} value={m}>{monthLabel(m)}</option>)}</select>}
        </div>
      }
      source={indicator === "population" ? `GSS 2021–2050 population projections, StatsBank extract (${fmtDate(fetched.proj)})` : `GSS Consumer Price Index, StatsBank extract (${fmtDate(fetched.cpi)})`}
      notes={indicator === "population" ? "Projections for years after the 2021 census. The publication’s 2025 reference figure is 33.7 million." : "Months after December 2025 come from the cached StatsBank series and fall outside the publication’s reference period."}
    >
      {failed ? <p role="alert" className="rounded-md bg-caution-bg px-3 py-6 text-center text-[13px] text-caution">The regional data could not be loaded. Refresh the page to try again.</p> : (
        <RegionalMap
          data={data}
          measure={indicator === "population" ? "Projected population (people)" : "Year-on-year consumer inflation (%)"}
          format={format}
          height={380}
          highlight={national != null ? `Ghana: ${indicator === "population" ? `${(national / 1e6).toFixed(1)} million` : `${national.toFixed(1)}%`}` : undefined}
        />
      )}
    </ChartCard>
  );
}
