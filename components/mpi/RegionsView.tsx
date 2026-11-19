"use client";

import { useState } from "react";
import type { MpiViewId } from "@/data/mpiData";
import RegionsCensusView from "./RegionsCensusView";
import RegionsQuarterlyView from "./RegionsQuarterlyView";
import SeriesSwitch, { type Series } from "./SeriesSwitch";

type Props = { region: string | null; openRegion: (region: string | null, jump?: boolean) => void; openDistrict: (district: string | null, jump?: boolean) => void; go: (view: MpiViewId) => void };

/** Regions in either published series: the quarterly survey (default, latest) or the 2021 census. */
export default function RegionsView(props: Props) {
  const [series, setSeries] = useState<Series>("quarterly");
  return (
    <div>
      <SeriesSwitch value={series} onChange={setSeries} />
      {series === "quarterly" ? <RegionsQuarterlyView {...props} /> : <RegionsCensusView {...props} />}
    </div>
  );
}
