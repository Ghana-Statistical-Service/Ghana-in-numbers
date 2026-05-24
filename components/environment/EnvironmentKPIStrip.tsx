import { environmentKPIs } from "@/data/environmentData";

export default function EnvironmentKPIStrip() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {environmentKPIs.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          style={{ minHeight: "118px" }}
        >
          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold leading-tight" style={{ color: "#64748B" }}>{item.label}</p>
              <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
            </div>
            <p className="mt-1 font-black leading-none" style={{ fontSize: "2rem", color: "#1B2A4A" }}>
              {item.value}
              <span className="ml-1 text-base font-bold">{item.unit}</span>
            </p>
            <p className="mt-2 text-[11px] leading-tight" style={{ color: "#94A3B8" }}>{item.note}</p>
          </div>
          <div className="h-1.5" style={{ background: item.color }} />
        </div>
      ))}
    </div>
  );
}
