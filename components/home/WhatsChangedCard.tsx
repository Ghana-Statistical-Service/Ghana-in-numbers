import { TrendingDown } from "lucide-react";

export default function WhatsChangedCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
      <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">
        From the Publication
      </p>

      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#DCFCE7" }}
        >
          <TrendingDown size={17} style={{ color: "#16A34A" }} />
        </div>
        <p className="font-bold leading-snug" style={{ fontSize: "1.05rem", color: "#1B2A4A" }}>
          Inflation Slows to 5.4% at End-2025
        </p>
      </div>

      <p className="text-gray-500 text-xs leading-relaxed">
        Year-on-year inflation fell from 54.1% in December 2022 to 5.4% in
        December 2025, a reduction of 48.7 percentage points. Prices continued
        to rise, but at a slower pace. The annual average for 2025 was 14.6%.
      </p>

      <div className="flex justify-end">
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full"
          style={{ background: "#DCFCE7", color: "#15803D" }}
        >
          ▼ −48.7 pp since Dec 2022
        </span>
      </div>
    </div>
  );
}
