import { childMarriageData, gbvPrevalenceData } from "@/data/socialDevelopmentData";
import { ShieldAlert, HeartCrack, Brain, UserRoundCheck } from "lucide-react";

const icons = [ShieldAlert, HeartCrack, Brain];

export default function ProtectionPanel() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-gray-800 font-bold text-sm">Inclusion and Protection</p>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            Gender-based violence prevalence and child marriage indicators.
          </p>
        </div>
        <span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "#FFF1F2", color: "#BE123C" }}>
          2016 to 2022
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {gbvPrevalenceData.map((item, index) => {
          const Icon = icons[index];
          return (
            <div key={item.type} className="rounded-xl border border-slate-100 p-4 text-center" style={{ background: "#FBFCFE" }}>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: `${item.color}18`, color: item.color }}>
                <Icon size={24} />
              </div>
              <p className="text-sm font-bold" style={{ color: "#1B2A4A" }}>{item.type}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs font-semibold" style={{ color: "#94A3B8" }}>2016</p>
                  <p className="text-3xl font-black" style={{ color: "#111827" }}>{item.value2016}%</p>
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "#94A3B8" }}>2022</p>
                  <p className="text-3xl font-black" style={{ color: item.color }}>{item.value2022}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-slate-100 p-4 flex items-center justify-between gap-4" style={{ background: "linear-gradient(90deg, #FFF1F2 0%, #FFFFFF 100%)" }}>
        <div>
          <p className="text-sm font-bold" style={{ color: "#1B2A4A" }}>{childMarriageData.label}</p>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            Change between 2010 and 2021.
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-xs font-semibold" style={{ color: "#94A3B8" }}>{childMarriageData.year2010}</p>
            <p className="text-4xl font-black" style={{ color: "#111827" }}>{childMarriageData.value2010}%</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "#EF4444", color: "#fff" }}>
            <UserRoundCheck size={34} />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "#94A3B8" }}>{childMarriageData.year2021}</p>
            <p className="text-4xl font-black" style={{ color: "#111827" }}>{childMarriageData.value2021}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
