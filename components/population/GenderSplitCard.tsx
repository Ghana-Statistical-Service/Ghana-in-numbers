export default function GenderSplitCard() {
  const male = 49.3;
  const female = 50.7;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <p className="text-gray-800 font-bold text-sm">
          Population Composition{" "}
          <span className="text-gray-400 font-normal">2025</span>
        </p>
      </div>

      <div className="flex flex-1">
        {/* Male */}
        <div
          className="flex-1 flex flex-col items-center justify-center py-4 gap-1"
          style={{ background: "#EFF6FF" }}
        >
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
            <ellipse cx="16" cy="9" rx="7" ry="7" fill="#2F6FE4" />
            <path d="M4 38c0-7.732 5.373-14 12-14s12 6.268 12 14" fill="#2F6FE4" />
          </svg>
          <p className="text-2xl font-black" style={{ color: "#1D4ED8" }}>{male}%</p>
          <p className="text-xs font-semibold" style={{ color: "#6B7280" }}>Male</p>
        </div>

        {/* Female */}
        <div
          className="flex-1 flex flex-col items-center justify-center py-4 gap-1"
          style={{ background: "#FFF1F2" }}
        >
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
            <ellipse cx="16" cy="9" rx="7" ry="7" fill="#DB2988" />
            <path d="M4 38c0-7.732 5.373-14 12-14s12 6.268 12 14" fill="#DB2988" />
          </svg>
          <p className="text-2xl font-black" style={{ color: "#BE185D" }}>{female}%</p>
          <p className="text-xs font-semibold" style={{ color: "#6B7280" }}>Female</p>
        </div>
      </div>

      {/* Proportional bar */}
      <div className="flex h-2 flex-shrink-0">
        <div style={{ width: `${male}%`, background: "#2F6FE4" }} />
        <div style={{ width: `${female}%`, background: "#DB2988" }} />
      </div>
    </div>
  );
}
