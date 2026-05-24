import { intercensalGrowth } from "@/data/populationData";

export default function InterCensalTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col h-full">
      <p className="text-gray-800 font-bold text-sm mb-3 flex-shrink-0">
        Intercensal Growth
      </p>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left pb-2 text-xs font-semibold" style={{ color: "#6B7280" }}>Period</th>
              <th className="text-center pb-2 text-xs font-semibold" style={{ color: "#6B7280" }}>Yrs</th>
              <th className="text-center pb-2 text-xs font-semibold" style={{ color: "#1B2A4A" }}>Growth Rate</th>
              <th className="text-center pb-2 text-xs font-semibold" style={{ color: "#17B8A6" }}>Doubling (yrs)</th>
            </tr>
          </thead>
          <tbody>
            {intercensalGrowth.map((row, i) => {
              const isLast = i === intercensalGrowth.length - 1;
              return (
                <tr
                  key={row.period}
                  className={`border-b border-gray-50 ${isLast ? "font-bold" : ""}`}
                >
                  <td className="py-2 text-xs" style={{ color: "#374151" }}>{row.period}</td>
                  <td className="py-2 text-xs text-center" style={{ color: "#6B7280" }}>{row.years}</td>
                  <td className="py-2 text-center">
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded"
                      style={{ background: "#EFF6FF", color: "#1D4ED8" }}
                    >
                      {row.rate}
                    </span>
                  </td>
                  <td className="py-2 text-center">
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded"
                      style={{ background: "#F0FDFA", color: "#0F766E" }}
                    >
                      {row.doublingTime}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: "#9CA3AF" }}>
          Rate of population change between two census periods. Doubling time = estimated years for the population to double at observed growth rates.
        </p>
      </div>
    </div>
  );
}
