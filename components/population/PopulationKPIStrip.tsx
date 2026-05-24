import { populationKPIs } from "@/data/populationData";

export default function PopulationKPIStrip() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {populationKPIs.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between overflow-hidden cursor-default transition-shadow hover:shadow-md"
          style={{ height: "112px" }}
        >
          <div className="px-3 pt-3 pb-1 flex flex-col gap-0.5 flex-1">
            <p className="text-xs font-semibold leading-tight" style={{ color: "#6B7280" }}>
              {kpi.label}
            </p>
            <p className="font-bold leading-tight" style={{ fontSize: "2.1rem", color: "#1B2A4A" }}>
              {kpi.value}
              <span
                className="font-semibold ml-1"
                style={{ fontSize: kpi.unit === "yrs" ? "1.0rem" : "1.25rem", color: "#1B2A4A" }}
              >
                {kpi.unit}
              </span>
            </p>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>{kpi.note}</p>
          </div>
          <div className="flex h-2">
            {kpi.stripes.map((s, i) => (
              <div key={i} style={{ width: `${s.pct}%`, background: s.color }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
