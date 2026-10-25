import DashboardShell from "@/components/layout/DashboardShell";
import GovStatMessageModal from "@/components/home/GovStatMessageModal";
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
    <>
      <GovStatMessageModal />
      <DashboardShell>
        <main className="flex-1 overflow-y-auto px-4 md:px-5 pt-4 pb-4 space-y-4">

          {/* Row 1: Title + KPI | Inflation Sparkline */}
          <div className="grid gap-4 items-start md:grid-cols-[1fr_246px]">
            <div className="flex flex-col gap-3">
              <div>
                <h1
                  className="font-bold leading-tight"
                  style={{ fontSize: "2.35rem", color: "#1B2A4A" }}
                >
                  Ghana in Numbers
                </h1>
                <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                  Ghana Statistical Service · Ghana in Numbers 2025 · Reference periods shown by indicator
                </p>
              </div>
              <KPIStrip />

              {/* Insight banner */}
              <div
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 border border-slate-100"
                style={{ background: "linear-gradient(90deg, #F5F7FF 0%, #FFFFFF 100%)" }}
              >
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <div className="w-1 h-2 rounded-full" style={{ background: "#CC0001" }} />
                  <div className="w-1 h-2 rounded-full" style={{ background: "#FFCD00" }} />
                  <div className="w-1 h-2 rounded-full" style={{ background: "#006B3F" }} />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
                  <span className="font-bold" style={{ color: "#1B2A4A" }}>Ghana&apos;s projected 33.7 million people (2025)</span>{" "}
                  live in an economy expanding at{" "}
                  <span className="font-bold" style={{ color: "#2563EB" }}>6.0%</span> — with year-on-year inflation of{" "}
                  <span className="font-bold" style={{ color: "#16A34A" }}>5.4%</span>,
                  in December 2025. National unemployment averaged 12.8% across Q1–Q3 2025.
                </p>
              </div>
            </div>

            {/* Inflation sparkline — stacks below on mobile, side panel on md+ */}
            <div className="md:-mt-4">
              <InflationSparkline />
            </div>
          </div>

          {/* Row 2: Map | GDP + Sector stacked */}
          <div className="grid gap-4 md:grid-cols-[3fr_2fr] md:h-[466px] items-stretch">
            <div className="h-[360px] min-w-0 md:h-full md:min-h-0">
              <ChoroplethMap />
            </div>
            <div className="grid min-w-0 gap-4 grid-rows-[280px_170px]">
              <div className="min-h-0 min-w-0">
                <GDPGrowthChart />
              </div>
              <div className="min-h-0 min-w-0">
                <SectorBreakdown />
              </div>
            </div>
          </div>

          {/* Row 3: Bottom cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <WhatsChangedCard />
            <MostSearchedCard />
            <DataStoryCard />
          </div>
          <p className="text-xs text-right pb-1" style={{ color: "#9CA3AF" }}>
            Powered by StatsBank | © GSS
          </p>
        </main>
      </DashboardShell>
    </>
  );
}
