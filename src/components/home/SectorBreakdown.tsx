const data = [
  { sector: "Agriculture", segs: [{ pct: 60, color: "#2E8B6E" }, { pct: 24, color: "#3B82F6" }, { pct: 16, color: "#E07B54" }] },
  { sector: "Industry",    segs: [{ pct: 42, color: "#2E8B6E" }, { pct: 12, color: "#3B82F6" }, { pct: 30, color: "#F5B942" }] },
  { sector: "Services",    segs: [{ pct: 28, color: "#2E8B6E" }, { pct: 18, color: "#F5B942" }] },
];

export default function SectorBreakdown() {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between h-full"
    >
      <p className="text-gray-800 font-bold text-sm flex-shrink-0">Sector Breakdown</p>
      <div className="space-y-2.5 flex-1 flex flex-col justify-center">
        {data.map((row) => (
          <div key={row.sector} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-20 flex-shrink-0">{row.sector}</span>
            <div className="flex-1 flex h-4 overflow-hidden rounded-sm">
              {row.segs.map((seg, i) => (
                <div
                  key={i}
                  style={{
                    width: `${seg.pct}%`,
                    background: seg.color,
                    marginRight: i < row.segs.length - 1 ? "2px" : 0,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
