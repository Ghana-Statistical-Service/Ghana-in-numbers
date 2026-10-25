"use client";

import CardExplanation from "@/components/shared/CardExplanation";

import { useState, useEffect } from "react";

const sectors = [
  { name: "Agriculture", share: 22.8 },
  { name: "Industry",    share: 31.3 },
  { name: "Services",    share: 45.9 },
];

const MAX = 45.9; // widest bar = 100% of available space
const BAR_COLOR = "#17B8A6";


export default function SectorBreakdown() {


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
          <CardExplanation indicator="sector" />
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

    </>
  );
}
