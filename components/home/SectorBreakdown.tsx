import { ChartCard } from "@/components/ui/Card";
import { sectorShare2025 } from "@/data/businessEconomyData";

const colors = ["#0E8A7E", "#2F6DB5", "#3C2FA3"];

/** The three sector shares form a whole (100% of nominal GDP), so a single stacked bar is a valid composition view. */
export function SectorShareBar({ height = 40 }: { height?: number }) {
  return (
    <div>
      <div className="flex overflow-hidden rounded-md" style={{ height }} role="img" aria-label={`Sectoral share of nominal GDP, 2025: ${sectorShare2025.map(s => `${s.name} ${s.value}%`).join(", ")}`}>
        {sectorShare2025.map((s, i) => (
          <div key={s.name} style={{ width: `${s.value}%`, background: colors[i] }} className="flex items-center justify-center text-[13px] font-semibold text-white">
            <span className="tabular">{s.value}%</span>
          </div>
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-2 text-[13px]">
        {sectorShare2025.map((s, i) => (
          <li key={s.name} className="flex items-start gap-2"><span aria-hidden className="mt-1 h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: colors[i] }} /><span><span className="block font-medium text-ink">{s.name}</span><span className="tabular text-muted">{s.value}% of GDP</span></span></li>
        ))}
      </ul>
    </div>
  );
}

// IBES I, p. 48: share of establishments by broad sector, 2024 (a count of businesses, not output).
const establishments = [{ name: "Agriculture", value: 2.2 }, { name: "Industry", value: 21.1 }, { name: "Services", value: 76.7 }];

export default function SectorBreakdown({ withEstablishments = false }: { withEstablishments?: boolean }) {
  return (
    <ChartCard
      title="Sectoral share of nominal GDP"
      subtitle="Production approach, % of GDP"
      period="2025"
      explain={{ indicator: "sector" }}
      notes={withEstablishments ? "Output shares are not employment shares. The second bar counts establishments (fixed-structure businesses), a different measure: farming is mostly outside establishments." : "Output shares, not shares of employment."}
      source={withEstablishments ? "GSS Annual GDP · p. 37; 2024 IBES I · pp. 48–49" : "GSS Annual GDP; Ghana in Numbers 2025, p. 37"}
    >
      <SectorShareBar />
      {withEstablishments && (
        <div className="mt-6 border-t border-line pt-4">
          <p className="mb-2 text-xs font-medium text-muted">For comparison: share of establishments by sector, 2024 (IBES I)</p>
          <div className="flex h-7 overflow-hidden rounded-md" role="img" aria-label="Share of establishments: agriculture 2.2%, industry 21.1%, services 76.7%">
            {establishments.map((s, i) => <div key={s.name} style={{ width: `${s.value}%`, background: colors[i], opacity: 0.75 }} className="flex items-center justify-center text-[12px] font-semibold text-white">{s.value > 10 ? `${s.value}%` : ""}</div>)}
          </div>
          <p className="tabular mt-2 text-[12.5px] text-body">Agriculture 2.2% · Industry 21.1% · Services 76.7% of establishments</p>
        </div>
      )}
    </ChartCard>
  );
}
