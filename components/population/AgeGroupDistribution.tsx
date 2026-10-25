"use client";

import CardExplanation from "@/components/shared/CardExplanation";


import { useState, useEffect } from "react";
import { ageGroupDistribution2025 } from "@/data/populationData";


export default function AgeGroupDistribution() {


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
        <CardExplanation indicator="age" />
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
              <CardExplanation indicator="age" />
            </div>
          </div>
        ))}
      </div>
    </div>


    </>
  );
}
