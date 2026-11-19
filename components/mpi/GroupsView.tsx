"use client";

import { useState } from "react";
import GroupsCensusView from "./GroupsCensusView";
import GroupsQuarterlyView from "./GroupsQuarterlyView";
import SeriesSwitch, { type Series } from "./SeriesSwitch";

/** Who is affected, in either published series: the quarterly survey (default, latest) or the 2021 census. */
export default function GroupsView() {
  const [series, setSeries] = useState<Series>("quarterly");
  return (
    <div>
      <SeriesSwitch value={series} onChange={setSeries} />
      {series === "quarterly" ? <GroupsQuarterlyView /> : <GroupsCensusView />}
    </div>
  );
}
