import BusinessEconomyKPIStrip from "@/components/business-economy/BusinessEconomyKPIStrip";
import GDPStructurePanel from "@/components/business-economy/GDPStructurePanel";
import { AgriculturePanel, LabourPanel, TourismPanel } from "@/components/business-economy/LabourAgricultureTourismPanel";
import PricesIndustryPanel from "@/components/business-economy/PricesIndustryPanel";
import TradePanel from "@/components/business-economy/TradePanel";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function BusinessAndEconomyPage() {
  return (
    <div className="flex h-full overflow-hidden" style={{ background: "#EEF1F6" }}>
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-5 pt-4 pb-4 space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1
                className="font-bold leading-tight"
                style={{ fontSize: "2.1rem", color: "#1B2A4A" }}
              >
                Business and Economy
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                Ghana Statistical Service · GDP, trade, prices, industry, labour, agriculture and tourism
              </p>
            </div>
            <div className="hidden xl:flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full" style={{ background: "#00A651" }} />
              <span className="text-xs font-semibold" style={{ color: "#475569" }}>
                Indicators scoped to supplied Ghana in Numbers references
              </span>
            </div>
          </div>

          <BusinessEconomyKPIStrip />

          <section className="space-y-3">
            <div>
              <p className="text-lg font-bold" style={{ color: "#00A651" }}>Size and structure of the economy</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>Nominal GDP, sectoral share, GDP per capita and real GDP growth.</p>
            </div>
            <GDPStructurePanel />
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-lg font-bold" style={{ color: "#00A651" }}>Ghana in the global marketplace</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>Goods trade, top commodities and partner-region composition.</p>
            </div>
            <TradePanel />
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-lg font-bold" style={{ color: "#00A651" }}>Prices, inflation and industry</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>Inflation trends, IIP by sector and PPI sector averages.</p>
            </div>
            <PricesIndustryPanel />
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-lg font-bold" style={{ color: "#00A651" }}>Labour market indicators</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>Participation, unemployment and youth NEET rates.</p>
            </div>
            <LabourPanel />
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-lg font-bold" style={{ color: "#00A651" }}>Agriculture</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>Annual fish production and crop production.</p>
            </div>
            <AgriculturePanel />
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-lg font-bold" style={{ color: "#00A651" }}>Tourism flow and expenditure</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>Visitor flows, expenditure and travel purpose for 2023.</p>
            </div>
            <TourismPanel />
          </section>

          <p className="text-xs text-right pb-1" style={{ color: "#9CA3AF" }}>
            Source: Ghana In Numbers 2025 reference indicators | Powered by StatsBank | © GSS
          </p>
        </main>
      </div>
    </div>
  );
}
