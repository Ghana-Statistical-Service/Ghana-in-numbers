import { socialDevelopmentKPIs } from "@/data/socialDevelopmentData";

export default function SocialDevelopmentKPIStrip() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {socialDevelopmentKPIs.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
          style={{ minHeight: "118px" }}
        >
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold leading-tight" style={{ color: "#64748B" }}>
                {item.label}
              </p>
              <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: item.accent }} />
            </div>
            <p className="mt-1 font-black leading-none" style={{ fontSize: "2rem", color: "#1B2A4A" }}>
              {item.value}
              <span className="ml-1 text-base font-bold">{item.unit}</span>
            </p>
            <p className="mt-1 text-[11px] leading-tight" style={{ color: "#94A3B8" }}>
              {item.note}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-3 py-1.5">
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "72%", background: item.accent }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
