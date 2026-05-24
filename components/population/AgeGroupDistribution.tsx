"use client";

import { useState, useEffect } from "react";
import { ageGroupDistribution2025 } from "@/data/populationData";

const explanation = {
  what: `This chart shows how Ghana's 33.7 million people (2025 projection) are distributed across broad age groups — children (0–14), working-age adults (15–64), and the elderly (65+). The coloured bar at the top shows each group's share of total population; the cards below give the exact percentages.`,
  story: `Ghana still has a young population: roughly 38% are under 15, reflecting the high birth rates of past decades. The working-age group (15–64) makes up about 58%, while only around 4% are aged 65 or older. Compared to 1984, the under-15 share has been falling gradually as fertility rates drop — a sign of demographic transition in progress.`,
  why: `The age structure shapes what a country needs right now and in the future. A large youth share means heavy demand for schools, healthcare for children, and future jobs. A growing working-age share can produce a "demographic dividend" — more workers, fewer dependants — but only if those workers find productive employment. Policymakers use this breakdown to plan education budgets, pension systems, and social services.`,
};

export default function AgeGroupDistribution() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col h-full">
      <div className="flex items-start justify-between mb-1 flex-shrink-0">
        <div>
          <p className="text-gray-800 font-bold text-sm">
            Population by Age Group{" "}
            <span className="text-gray-400 font-normal">2025</span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
            Distribution across broad age groups
          </p>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
          style={{
            background: open ? "#1B2A4A" : "#EFF6FF",
            color: open ? "#ffffff" : "#2563EB",
            border: "1px solid",
            borderColor: open ? "#1B2A4A" : "#BFDBFE",
          }}
        >
          Explain
        </button>
      </div>

      {/* Proportional bar */}
      <div className="flex h-5 rounded-lg overflow-hidden mb-4 flex-shrink-0">
        {ageGroupDistribution2025.map((g) => (
          <div
            key={g.label}
            style={{ width: `${g.pct}%`, background: g.color }}
            title={`${g.label}: ${g.pct}%`}
          />
        ))}
      </div>

      {/* Group cards */}
      <div className="flex-1 grid grid-cols-2 gap-2 content-start">
        {ageGroupDistribution2025.map((g) => (
          <div
            key={g.label}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5"
            style={{ background: "#F8FAFC" }}
          >
            <div
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ background: g.color }}
            />
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight" style={{ color: "#1B2A4A" }}>
                {g.pct}%
                <span className="font-normal text-xs ml-1" style={{ color: "#6B7280" }}>
                  {g.label}
                </span>
              </p>
              <p className="text-xs leading-tight truncate" style={{ color: "#9CA3AF", fontSize: "0.65rem" }}>
                {g.sublabel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {open && (
      <>
        <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
        <div className="fixed z-40 rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ top: "60px", right: "16px", width: "320px", maxHeight: "calc(100vh - 76px)", background: "#ffffff" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100" style={{ background: "#F8FAFF" }}>
            <p className="text-sm font-bold" style={{ color: "#1B2A4A" }}>What is this chart telling me?</p>
            <button onClick={() => setOpen(false)} className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold" style={{ background: "#E2E8F0", color: "#64748B" }}>✕</button>
          </div>
          <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: "calc(100vh - 140px)" }}>
            <div className="rounded-lg p-3" style={{ background: "#EFF6FF" }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#1D4ED8" }}>📊 What it measures</p>
              <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{explanation.what}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "#F0FDF4" }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#15803D" }}>📖 The story in this chart</p>
              <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{explanation.story}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "#FFFBEB" }}>
              <p className="text-xs font-semibold mb-1.5" style={{ color: "#B45309" }}>💡 Why does it matter?</p>
              <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{explanation.why}</p>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
}
