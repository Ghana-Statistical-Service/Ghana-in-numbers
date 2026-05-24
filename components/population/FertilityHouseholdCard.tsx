import { fertilityData, householdSizeData } from "@/data/populationData";

interface TimelineItem { year: string; value: number }

function Timeline({ data, color, labelColor }: { data: TimelineItem[]; color: string; labelColor: string }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end justify-around flex-1 px-2">
      {data.map((d, i) => {
        const isLatest = i === data.length - 1;
        const sizePx = 16 + (d.value / max) * 22;
        return (
          <div key={d.year} className="flex flex-col items-center gap-1">
            <span
              className="font-black leading-none"
              style={{
                fontSize: `${sizePx}px`,
                color: isLatest ? labelColor : `${labelColor}99`,
              }}
            >
              {d.value}
            </span>
            <span className="text-xs" style={{ color: "#9CA3AF" }}>{d.year}</span>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: isLatest ? color : `${color}66` }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function FertilityHouseholdCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-gray-100">
        {/* Fertility */}
        <div className="p-4 flex flex-col gap-3">
          <div>
            <p className="text-gray-800 font-bold text-sm">Fertility Rate</p>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
              Avg. Children Ever Born per Woman
            </p>
          </div>
          <div className="flex items-end gap-2 flex-1">
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" className="flex-shrink-0 mb-2">
              <ellipse cx="16" cy="14" rx="8" ry="9" fill="#BBF7D0" stroke="#16A34A" strokeWidth="1.5" />
              <ellipse cx="16" cy="12" rx="4" ry="4" fill="#16A34A" />
              <line x1="16" y1="26" x2="16" y2="38" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <Timeline data={fertilityData} color="#16A34A" labelColor="#15803D" />
          </div>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>
            Decline reflects improving access to family planning and education.
          </p>
        </div>

        {/* Household size */}
        <div className="p-4 flex flex-col gap-3">
          <div>
            <p className="text-gray-800 font-bold text-sm">Average Household Size</p>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
              Persons per household
            </p>
          </div>
          <div className="flex items-end gap-2 flex-1">
            <svg width="36" height="40" viewBox="0 0 36 40" fill="none" className="flex-shrink-0 mb-2">
              <path d="M18 4L2 18H6V36H30V18H34L18 4Z" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" strokeLinejoin="round" />
              <rect x="13" y="24" width="10" height="12" rx="1" fill="#EA580C" />
            </svg>
            <Timeline data={householdSizeData} color="#EA580C" labelColor="#C2410C" />
          </div>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>
            Smaller households reflect urbanisation and changing family structures.
          </p>
        </div>
      </div>
    </div>
  );
}
