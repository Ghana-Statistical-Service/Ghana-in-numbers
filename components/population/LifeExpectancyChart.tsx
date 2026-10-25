"use client";

import CardExplanation from "@/components/shared/CardExplanation";


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
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"Male" | "Female">("Male");
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);


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
            Age-group lookup
          </button>
          <CardExplanation indicator="life" />
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
                Life Expectancy by Age Group
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
                  Life-table Group Average
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


  </>
  );
}
