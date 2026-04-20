import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import KPIStrip from "@/components/home/KPIStrip";
import ChoroplethMap from "@/components/home/ChoroplethMap";
import InflationSparkline from "@/components/home/InflationSparkline";
import GDPGrowthChart from "@/components/home/GDPGrowthChart";
import SectorBreakdown from "@/components/home/SectorBreakdown";
import WhatsChangedCard from "@/components/home/WhatsChangedCard";
import MostSearchedCard from "@/components/home/MostSearchedCard";
import DataStoryCard from "@/components/home/DataStoryCard";

export default function Home() {
  return (
    <div className="flex h-full overflow-hidden" style={{ background: "#EEF1F6" }}>
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-5 pt-4 pb-4 space-y-4">

          {/* Row 1: [Title + KPI Strip] | [Inflation Sparkline] */}
          <div className="grid items-start gap-4" style={{ gridTemplateColumns: "1fr 246px" }}>
            <div className="flex flex-col gap-3">
              <div>
                <h1
                  className="font-bold leading-tight"
                  style={{ fontSize: "2.35rem", color: "#1B2A4A" }}
                >
                  Ghana in Numbers
                </h1>
                <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                  Key indicators updated from official sources
                </p>
              </div>
              <KPIStrip />
            </div>
            <div style={{ marginTop: "-16px" }}>
              <InflationSparkline />
            </div>
          </div>

          {/* Row 2: Map 60% | [GDP 70% + Sector 30% stacked] 40% — fixed 400px row */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "3fr 2fr", height: "400px" }}>
            <ChoroplethMap />
            <div className="flex flex-col gap-4 h-full">
              <div style={{ flex: 7, minHeight: 0 }}>
                <GDPGrowthChart />
              </div>
              <div style={{ flex: 3, minHeight: 0 }}>
                <SectorBreakdown />
              </div>
            </div>
          </div>

          {/* Row 3: Bottom cards */}
          <div className="grid grid-cols-3 gap-4">
            <WhatsChangedCard />
            <MostSearchedCard />
            <DataStoryCard />
          </div>

          <p className="text-xs text-right pb-1" style={{ color: "#9CA3AF" }}>
            Powered by StatsBank | © GSS
          </p>
        </main>
      </div>
    </div>
  );
}
