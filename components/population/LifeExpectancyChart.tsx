"use client";

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { lifeExpectancyTrend, lifeExpectancyByAge } from "@/data/populationData";

interface EstimateResult {
  cohort: string;
  additionalYears: number;
  projectedAge: number;
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
    projectedAge: Math.round(age + additionalYears),
    sex,
    inputAge: age,
  };
}

function StatFeedback({ result }: { result: EstimateResult }) {
  const { cohort, additionalYears, projectedAge, sex, inputAge } = result;
  const sexAdj = sex === "Male" ? "males" : "females";
  const pronoun = sex === "Male" ? "he" : "she";
  const upper = Math.round(projectedAge + 4);
  const lower = Math.round(projectedAge - 4);
  const peerAdj = sex === "Male" ? "male" : "female";

  return (
    <div className="space-y-2 text-xs" style={{ color: "#374151" }}>
      <p>
        Based on Ghana&apos;s{" "}
        <span className="font-semibold">2021 abridged life table</span>, a{" "}
        <span className="font-semibold" style={{ color: "#1B2A4A" }}>
          {sex.toLowerCase()} aged {inputAge}
        </span>{" "}
        falls within the{" "}
        <span className="font-semibold" style={{ color: "#16A34A" }}>
          {cohort}
        </span>{" "}
        age cohort.
      </p>
      <p>
        A {peerAdj} who survives to this age is{" "}
        <span className="font-semibold">statistically expected</span> to live an additional{" "}
        <span className="font-bold text-sm" style={{ color: "#16A34A" }}>
          {additionalYears} years
        </span>
        , placing{" "}
        <span className="font-semibold">median projected longevity</span> at approximately{" "}
        <span className="font-bold text-sm" style={{ color: "#1B2A4A" }}>
          {projectedAge} years
        </span>{" "}
        of age.
      </p>
      <p style={{ color: "#6B7280" }}>
        By definition, 50% of {sexAdj} in this cohort are likely to live{" "}
        <span className="font-semibold">beyond age {projectedAge}</span>, while the remaining 50%
        will not reach this threshold. The interquartile survival range for this group is
        broadly estimated at{" "}
        <span className="font-semibold">
          {lower}–{upper} years
        </span>
        .
      </p>
      <p style={{ color: "#6B7280" }}>
        Conditional on {pronoun} reaching age {inputAge},{" "}
        {pronoun === "he" ? "his" : "her"} probability of surviving to age{" "}
        <span className="font-semibold">{Math.round(projectedAge - 5)}</span> exceeds{" "}
        <span className="font-semibold">50%</span> under current Ghanaian mortality patterns.
        These estimates assume no change in prevailing age-specific death rates and are
        derived from national averages — individual outcomes depend on health status,
        socioeconomic factors, and access to healthcare.
      </p>
    </div>
  );
}

const explainContent = {
  what: `This chart shows the average number of years a baby born in Ghana is expected to live, if the health conditions of that era remained constant. Each dot is a different decade or census year, showing how survival has changed over time.`,
  story: `In 1960, a Ghanaian baby was expected to live just 40.3 years — a reflection of high childhood disease, limited healthcare, and poor nutrition. Over the decades, vaccines, clean water, hospitals, and better food have pushed that figure to 65.1 years by 2021. That is nearly 25 extra years of life gained in six decades.`,
  why: `Life expectancy is one of the most powerful summaries of a country's health system. A rising figure means fewer children are dying young and adults are surviving longer. It also signals to planners that the country will need more elderly care, pensions, and long-term health services in coming decades.`,
};

export default function LifeExpectancyChart() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [explainOpen, setExplainOpen] = useState(false);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"Male" | "Female">("Male");
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!explainOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setExplainOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [explainOpen]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n = parseInt(age, 10);
    if (isNaN(n) || n < 0 || n > 110) {
      setError("Please enter a valid age between 0 and 110.");
      return;
    }
    setError("");
    setResult(buildResult(n, sex));
  }

  function handleOpen() {
    setOpen((v) => !v);
    setResult(null);
    setAge("");
    setError("");
  }

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col h-full relative">
      <div className="flex items-start justify-between mb-1 flex-shrink-0">
        <div>
          <p className="text-gray-800 font-bold text-sm">
            Life Expectancy at Birth{" "}
            <span className="text-gray-400 font-normal">(1960–2021)</span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
            Improvements in survival and longevity over time
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleOpen}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
            style={{
              background: open ? "#1B2A4A" : "#F0FDF4",
              color: open ? "#ffffff" : "#15803D",
              border: "1px solid",
              borderColor: open ? "#1B2A4A" : "#BBF7D0",
            }}
          >
            My estimate
          </button>
          <button
            onClick={() => setExplainOpen((v) => !v)}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors"
            style={{
              background: explainOpen ? "#1B2A4A" : "#EFF6FF",
              color: explainOpen ? "#ffffff" : "#2563EB",
              border: "1px solid",
              borderColor: explainOpen ? "#1B2A4A" : "#BFDBFE",
            }}
          >
            Explain
          </button>
        </div>
      </div>

      {/* Popup form */}
      {open && (
        <div
          ref={popupRef}
          className="absolute right-4 top-12 z-20 rounded-xl shadow-lg border border-gray-200 p-4 w-72"
          style={{ background: "#ffffff" }}
        >
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-xs font-bold" style={{ color: "#1B2A4A" }}>
                Personal Life Expectancy Estimate
              </p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                Based on Ghana&apos;s 2021 abridged life table (GSS).
              </p>

              <div className="space-y-1">
                <label className="text-xs font-semibold" style={{ color: "#374151" }}>
                  Current age
                </label>
                <input
                  type="number"
                  min={0}
                  max={110}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 32"
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-400"
                  style={{ color: "#1B2A4A" }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold" style={{ color: "#374151" }}>
                  Sex
                </label>
                <div className="flex gap-2">
                  {(["Male", "Female"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSex(s)}
                      className="flex-1 text-xs py-1.5 rounded-lg font-semibold transition-colors"
                      style={{
                        background: sex === s ? "#1B2A4A" : "#F1F5F9",
                        color: sex === s ? "#ffffff" : "#64748B",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-xs" style={{ color: "#DC2626" }}>{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-1.5 rounded-lg text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "#16A34A" }}
              >
                Calculate
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold" style={{ color: "#1B2A4A" }}>
                  Statistical Estimate
                </p>
                <button
                  onClick={() => setResult(null)}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ color: "#9CA3AF", background: "#F1F5F9" }}
                >
                  ← Back
                </button>
              </div>
              <StatFeedback result={result} />
            </div>
          )}
        </div>
      )}

      <div className="flex-1 min-h-0" style={{ minHeight: "160px" }}>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lifeExpectancyTrend} margin={{ top: 20, right: 16, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 9, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${v}`}
                tick={{ fontSize: 9, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
                domain={[35, 70]}
                ticks={[40, 50, 60, 70]}
              />
              <Tooltip
                formatter={(value) => [`${value} years`, "Life Expectancy"]}
                contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#16A34A"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#fff", stroke: "#16A34A", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#16A34A", strokeWidth: 0 }}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  style={{ fontSize: "8px", fill: "#374151", fontWeight: 700 }}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div
        className="flex-shrink-0 mt-2 rounded-lg px-3 py-2"
        style={{ background: "#F0FDF4" }}
      >
        <p className="text-xs" style={{ color: "#15803D" }}>
          <span className="font-bold">65.1 years</span> in 2021 — up{" "}
          <span className="font-bold">+24.8 years</span> from 40.3 in 1960.
          Female life expectancy (66.8 yrs) exceeds male (63.3 yrs).
        </p>
      </div>
    </div>

    {explainOpen && (
      <>
        <div className="fixed inset-0 z-30" onClick={() => setExplainOpen(false)} />
        <div className="fixed z-40 rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ top: "60px", right: "16px", width: "320px", maxHeight: "calc(100vh - 76px)", background: "#ffffff" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100" style={{ background: "#F8FAFF" }}>
            <p className="text-sm font-bold" style={{ color: "#1B2A4A" }}>What is this chart telling me?</p>
            <button onClick={() => setExplainOpen(false)} className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold" style={{ background: "#E2E8F0", color: "#64748B" }}>✕</button>
          </div>
          <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: "calc(100vh - 140px)" }}>
            <div className="rounded-lg p-3" style={{ background: "#EFF6FF" }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#1D4ED8" }}>📊 What it measures</p>
              <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{explainContent.what}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "#F0FDF4" }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#15803D" }}>📖 The story in this chart</p>
              <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{explainContent.story}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "#FFFBEB" }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#B45309" }}>💡 Why does it matter?</p>
              <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{explainContent.why}</p>
            </div>
          </div>
        </div>
      </>
    )}
  </>
  );
}
