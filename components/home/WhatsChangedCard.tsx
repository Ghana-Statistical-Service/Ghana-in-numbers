import { TrendingDown } from "lucide-react";

export default function WhatsChangedCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
      <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">
        This Month&apos;s Headline
      </p>

      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#DCFCE7" }}
        >
          <TrendingDown size={17} style={{ color: "#16A34A" }} />
        </div>
        <p className="font-bold leading-snug" style={{ fontSize: "1.05rem", color: "#1B2A4A" }}>
          Ghana&apos;s Inflation Falls to a 3-Year Low
        </p>
      </div>

      <p className="text-gray-500 text-xs leading-relaxed">
        Year-on-year inflation eased to{" "}
        <span className="font-semibold text-gray-700">3.2%</span> in March 2026,
        down from <span className="font-semibold text-red-500">25.1%</span> in April 2024 —
        a 22-month sustained disinflation of{" "}
        <span className="font-semibold text-green-600">−21.9 percentage points</span>.
      </p>

      <div className="flex justify-end">
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full"
          style={{ background: "#DCFCE7", color: "#15803D" }}
        >
          ▼ −21.9 pp since Apr 2024
        </span>
      </div>
    </div>
  );
}
