"use client";

import { useState, useEffect } from "react";

const sectors = [
  { name: "Agriculture", share: 18.4 },
  { name: "Industry",    share: 32.0 },
  { name: "Services",    share: 49.6 },
];

const MAX = 49.6; // widest bar = 100% of available space
const BAR_COLOR = "#17B8A6";

const explanation = {
  what: `This chart divides Ghana's entire economy into three broad groups and shows how much each one contributes to the total economy in 2025.`,
  sectors: [
    { name: "Agriculture (18.4%)", desc: "Farming, fishing, and forestry — things we grow and harvest from the land and sea." },
    { name: "Industry (32.0%)",    desc: "Mining, manufacturing, and construction — things we dig up, make in factories, or build." },
    { name: "Services (49.6%)",    desc: "Banks, shops, transport, hospitals, and government — things people do for each other." },
  ],
  insight: `Services is the largest sector, making up nearly half of Ghana's economy. That means for every GH₵100 the country produces, about GH₵50 comes from services, GH₵32 from industry, and GH₵18 from farming and fishing.`,
};

export default function SectorBreakdown() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-3 py-2.5 flex flex-col h-full overflow-hidden">

        {/* Title row */}
        <div className="flex items-start justify-between flex-shrink-0 mb-1.5">
          <div>
            <p className="text-gray-800 font-bold text-xs leading-tight">
              Sectoral Share of Nominal GDP
            </p>
            <p style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>2025 · Production Approach</p>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs font-semibold px-2 py-0.5 rounded-lg flex-shrink-0 ml-2 transition-colors"
            style={{
              background: open ? "#1B2A4A" : "#F0FDFA",
              color: open ? "#ffffff" : "#0F766E",
              border: "1px solid",
              borderColor: open ? "#1B2A4A" : "#99F6E4",
              fontSize: "0.65rem",
            }}
          >
            Explain
          </button>
        </div>

        {/* Bars */}
        <div className="flex-1 flex flex-col justify-around">
          {sectors.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span
                className="flex-shrink-0 w-16 font-medium"
                style={{ fontSize: "0.70rem", color: "#374151" }}
              >
                {s.name}
              </span>
              <div className="flex-1 h-3.5 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(s.share / MAX) * 100}%`, background: BAR_COLOR }}
                />
              </div>
              <span
                className="flex-shrink-0 font-bold text-right"
                style={{ fontSize: "0.70rem", color: "#1B2A4A", width: "34px" }}
              >
                {s.share}%
              </span>
            </div>
          ))}
        </div>

        <p className="flex-shrink-0 mt-1" style={{ fontSize: "0.60rem", color: "#9CA3AF" }}>
          Source: GSS StatsBank
        </p>
      </div>

      {/* Fixed explain overlay */}
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            className="fixed z-40 rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
            style={{ top: "60px", right: "16px", width: "300px", maxHeight: "calc(100vh - 76px)", background: "#ffffff" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100" style={{ background: "#F0FDFA" }}>
              <p className="text-sm font-bold" style={{ color: "#1B2A4A" }}>What is this chart telling me?</p>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
                style={{ background: "#E2E8F0", color: "#64748B" }}
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: "calc(100vh - 140px)" }}>
              <div className="rounded-lg p-3" style={{ background: "#EFF6FF" }}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: "#1D4ED8" }}>📊 What it measures</p>
                <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{explanation.what}</p>
              </div>

              <div className="rounded-lg p-3" style={{ background: "#F0FDFA" }}>
                <p className="text-xs font-semibold mb-2" style={{ color: "#0F766E" }}>🗂️ The three sectors</p>
                <div className="space-y-2">
                  {explanation.sectors.map((sec) => (
                    <div key={sec.name}>
                      <p className="text-xs font-semibold" style={{ color: "#1B2A4A" }}>{sec.name}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{sec.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg p-3" style={{ background: "#FFFBEB" }}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: "#B45309" }}>💡 The key takeaway</p>
                <p className="text-xs leading-relaxed" style={{ color: "#374151" }}>{explanation.insight}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
