const kpiCards = [
  {
    label: "Population",
    value: "34.4",
    unit: "M",
    stripes: [
      { color: "#17B8A6", pct: 55 },
      { color: "#FCD34D", pct: 27 },
      { color: "#EF4444", pct: 18 },
    ],
  },
  {
    label: "GDP Growth",
    value: "6.0",
    unit: "%",
    stripes: [
      { color: "#17B8A6", pct: 38 },
      { color: "#FCD34D", pct: 36 },
      { color: "#F97316", pct: 26 },
    ],
  },
  {
    label: "Inflation (CPI)",
    value: "3.2",
    unit: "%",
    stripes: [
      { color: "#EF4444", pct: 48 },
      { color: "#17B8A6", pct: 32 },
      { color: "#FCD34D", pct: 20 },
    ],
  },
  {
    label: "Unemployment",
    value: "13.0",
    unit: "%",
    stripes: [
      { color: "#8B5CF6", pct: 62 },
      { color: "#FCD34D", pct: 38 },
    ],
  },
  {
    label: "Life Expectancy",
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
    <div className="grid grid-cols-5 gap-3">
      {kpiCards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl px-3 pt-2.5 pb-0 shadow-sm border border-gray-100 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col"
          style={{ height: "112px" }}
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
          {/* Multi-color stripe */}
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
