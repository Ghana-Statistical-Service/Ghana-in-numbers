"use client";

import { Segmented } from "@/components/ui/Data";

export type Series = "quarterly" | "census";

/** Chooses which published series a tab shows. The two are never drawn on one chart (guidelines §1). */
export default function SeriesSwitch({ value, onChange }: { value: Series; onChange: (value: Series) => void }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-line bg-surface px-4 py-3 shadow-card">
      <Segmented label="Series" options={[{ value: "quarterly", label: "Quarterly survey, to 2025 Q3" }, { value: "census", label: "2021 census" }]} value={value} onChange={onChange} />
      <p className="min-w-[14rem] flex-1 text-[13px] leading-snug text-muted">
        {value === "quarterly"
          ? "Latest survey estimates, from the quarterly Multidimensional Poverty Report."
          : "A full count of households from the 2021 Population and Housing Census, the base year of the annual district series."}{" "}
        The two series are separate and should not be compared.
      </p>
    </div>
  );
}
