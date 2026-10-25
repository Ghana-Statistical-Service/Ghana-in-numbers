import CardExplanation from "@/components/shared/CardExplanation";
const kpiCards = [
  {
    label: "Population",
    note: "2025 projection",
    value: "33.7",
    unit: "M",
    stripes: [
      { color: "#17B8A6", pct: 55 },
      { color: "#FCD34D", pct: 27 },
      { color: "#EF4444", pct: 18 },
    ],
  },
  {
    label: "GDP Growth",
    note: "2025 · provisional",
    value: "6.0",
    unit: "%",
    stripes: [
      { color: "#17B8A6", pct: 38 },
      { color: "#FCD34D", pct: 36 },
      { color: "#F97316", pct: 26 },
    ],
  },
  {
    label: "Consumer Inflation",
    note: "December 2025 · year on year",
    value: "5.4",
    unit: "%",
    stripes: [
      { color: "#EF4444", pct: 48 },
      { color: "#17B8A6", pct: 32 },
      { color: "#FCD34D", pct: 20 },
    ],
  },
  {
    label: "Unemployment",
    note: "Q1–Q3 2025 average",
    value: "12.8",
    unit: "%",
    stripes: [
      { color: "#8B5CF6", pct: 62 },
      { color: "#FCD34D", pct: 38 },
    ],
  },
  {
    label: "Life Expectancy",
    note: "At birth · 2021",
    value: "65.1",
    unit: "Years",
    stripes: [
      { color: "#3B82F6", pct: 53 },
      { color: "#FCD34D", pct: 30 },
      { color: "#17B8A6", pct: 17 },
    ],
  },
];

export default function KPIStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {kpiCards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl px-3 pt-2.5 pb-0 shadow-sm border border-gray-100 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col"
          style={{ minHeight: "132px" }}
        >
          <div>
            <p
              className="font-bold mb-1 leading-none"
              style={{ fontSize: "1.08rem", color: "#1B2A4A" }}
            >
              {card.label}
            </p>
            <div className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="font-bold leading-none" style={{ fontSize: "2.35rem", color: "#1B2A4A" }}>
                {card.value}
              </span>
              <span
                className="font-bold leading-none"
                style={{
                  fontSize: card.unit === "Years" ? "1.05rem" : "1.35rem",
                  color: "#1B2A4A",
                }}
              >
                {card.unit}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{card.note}</p>
          <CardExplanation label={card.label} />
          {/* Decorative stripe */}
          <div className="flex mt-auto h-2 rounded-b overflow-hidden -mx-3">
            {card.stripes.map((stripe, i) => (
              <div
                key={i}
                style={{ width: `${stripe.pct}%`, background: stripe.color }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
