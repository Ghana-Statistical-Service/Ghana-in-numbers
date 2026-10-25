"use client";



import { useState, useEffect, useRef } from "react";
import { CartesianGrid, LabelList, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/ui/Card";
import { C, ChartFrame, axisCommon, labelStyle, makeTooltip, tick } from "@/components/ui/chart";
import { tones } from "@/components/ui/Infographic";
import { LifeBySexPair, LifeTrendData } from "./PopulationSections";
import { lifeExpectancyTrend, lifeExpectancyByAge } from "@/data/populationData";

interface EstimateResult {
  cohort: string;
  additionalYears: number;
  sex: "Male" | "Female";
  inputAge: number;
}

function getAgeGroupIndex(age: number): number {
  if (age < 1)  return 0;
  if (age <= 4)  return 1;
  if (age <= 9)  return 2;
  if (age <= 14) return 3;
  if (age <= 19) return 4;
  if (age <= 24) return 5;
  if (age <= 29) return 6;
  if (age <= 34) return 7;
  if (age <= 39) return 8;
  if (age <= 44) return 9;
  if (age <= 49) return 10;
  if (age <= 54) return 11;
  if (age <= 59) return 12;
  if (age <= 64) return 13;
  if (age <= 69) return 14;
  if (age <= 74) return 15;
  if (age <= 79) return 16;
  return 17;
}

function buildResult(age: number, sex: "Male" | "Female"): EstimateResult {
  const idx = getAgeGroupIndex(age);
  const row = lifeExpectancyByAge[idx];
  const additionalYears = sex === "Male" ? row.male : row.female;
  return {
    cohort: row.age,
    additionalYears,
    sex,
    inputAge: age,
  };
}

function StatFeedback({ result }: { result: EstimateResult }) {
  const { cohort, additionalYears, sex, inputAge } = result;
  return <div className="space-y-3 text-xs leading-relaxed text-slate-600">
    <p>Age {inputAge} belongs to the <strong className="text-slate-800">{cohort}</strong> age group in the displayed 2021 life table.</p>
    <p>For <strong>{sex.toLowerCase()}s</strong> in this age group, the table reports <strong className="text-emerald-700">{additionalYears} additional years</strong> of life on average under the measured mortality conditions.</p>
    <p>Life expectancy is a population average. The source does not provide an individual lifespan prediction, a median survival age or percentile ranges for this lookup.</p>
    <p className="text-slate-500">Source: Ghana in Numbers 2025, Figure 3.10, p. 22. The lookup uses a grouped age band rather than an exact-age estimate.</p>
  </div>;
}


export default function LifeExpectancyChart() {
  const first = lifeExpectancyTrend[0], last = lifeExpectancyTrend.at(-1)!;
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"Male" | "Female">("Male");
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) { if (popupRef.current && !popupRef.current.contains(e.target as Node)) setOpen(false); }
    function handleKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("mousedown", handleClick); document.removeEventListener("keydown", handleKey); };
  }, [open]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n = parseInt(age, 10);
    if (isNaN(n) || n < 0 || n > 110) { setError("Enter a whole-number age between 0 and 110."); return; }
    setError("");
    setResult(buildResult(n, sex));
  }

  return (
    <ChartCard
      title="Life expectancy at birth"
      subtitle="Years"
      period="1960–2021"
      explain={{ indicator: "life" }}
      actions={
        <div className="relative" ref={popupRef}>
          <button type="button" aria-expanded={open} aria-controls="life-lookup" onClick={() => { setOpen(v => !v); setResult(null); setAge(""); setError(""); }} className="inline-flex h-8 items-center rounded-md border border-line bg-surface px-2.5 text-[12.5px] font-medium text-body hover:border-brand-line hover:bg-brand-soft hover:text-brand">Age-group lookup</button>
          {open && (
            <div id="life-lookup" className="absolute right-0 top-10 z-20 w-[min(18rem,80vw)] rounded-[var(--radius-lg)] border border-line bg-surface p-4 shadow-pop">
              {!result ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <p className="text-[13px] font-semibold text-ink">Remaining life expectancy, 2021 life table</p>
                  <div className="space-y-1">
                    <label htmlFor="life-age" className="text-xs font-medium text-muted">Current age</label>
                    <input id="life-age" type="number" inputMode="numeric" min={0} max={110} value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 32" className="h-10 w-full rounded-md border border-line-strong px-3 text-sm text-ink" />
                  </div>
                  <fieldset className="space-y-1"><legend className="text-xs font-medium text-muted">Sex</legend>
                    <div className="flex gap-2">{(["Male", "Female"] as const).map(s => <button key={s} type="button" aria-pressed={sex === s} onClick={() => setSex(s)} className={`h-9 flex-1 rounded-md text-[13px] font-medium ${sex === s ? "bg-brand text-white" : "bg-surface-muted text-body"}`}>{s}</button>)}</div>
                  </fieldset>
                  {error && <p role="alert" className="text-xs text-negative">{error}</p>}
                  <button type="submit" className="h-9 w-full rounded-md bg-brand text-[13px] font-semibold text-white hover:bg-brand-hover">Look up</button>
                </form>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between"><p className="text-[13px] font-semibold text-ink">Life-table group average</p><button type="button" onClick={() => setResult(null)} className="rounded px-2 py-0.5 text-xs text-brand hover:bg-brand-soft">Back</button></div>
                  <StatFeedback result={result} />
                </div>
              )}
            </div>
          )}
        </div>
      }
      notes="Survey and census years are unevenly spaced."
      source="GSS 2021 PHC · Figure 3.9, p. 21"
      footer={<LifeTrendData />}
    >
      <ChartFrame height={250} label="Life expectancy at birth rose from 40.3 years in 1960 to 65.1 years in 2021">
        <LineChart data={lifeExpectancyTrend} margin={{ top: 24, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="year" {...axisCommon} tick={tick} padding={{ left: 20, right: 8 }} />
          <YAxis {...axisCommon} tick={tick} domain={[0, 70]} ticks={[0, 20, 40, 60]} width={34} />
          <Tooltip content={makeTooltip({ unit: " years" })} />
          <Line type="linear" dataKey="value" name="Life expectancy" stroke={C.teal} strokeWidth={2.5} dot={{ r: 4, fill: C.teal, stroke: "#fff", strokeWidth: 2 }} isAnimationActive={false}>
            <LabelList dataKey="value" position="top" offset={9} formatter={(v: unknown) => Number(v).toFixed(1)} style={labelStyle} />
          </Line>
        </LineChart>
      </ChartFrame>
      <div className="mt-4 grid gap-3 min-[1440px]:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] min-[1440px]:items-center">
        <p className="rounded-[var(--radius-md)] px-3 py-2.5 text-[13px] leading-relaxed" style={{ background: tones.teal.bg, color: tones.teal.fg }}>
          <strong className="font-semibold">{last.value.toFixed(1)} years</strong> in {last.year}, up <strong className="font-semibold">{(last.value - first.value).toFixed(1)} years</strong> from {first.value.toFixed(1)} in {first.year}. Women live longer than men.
        </p>
        <LifeBySexPair />
      </div>
    </ChartCard>
  );
}
