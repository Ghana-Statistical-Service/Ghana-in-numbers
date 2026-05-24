import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import PopulationKPIStrip from "@/components/population/PopulationKPIStrip";
import PopulationGrowthChart from "@/components/population/PopulationGrowthChart";
import InterCensalTable from "@/components/population/InterCensalTable";
import GenderSplitCard from "@/components/population/GenderSplitCard";
import PopulationPyramid from "@/components/population/PopulationPyramid";
import AgeGroupDistribution from "@/components/population/AgeGroupDistribution";
import UrbanRuralChart from "@/components/population/UrbanRuralChart";
import LifeExpectancyChart from "@/components/population/LifeExpectancyChart";
import FertilityHouseholdCard from "@/components/population/FertilityHouseholdCard";

export default function PopulationAndSociety() {
  return (
    <div className="flex h-full overflow-hidden" style={{ background: "#EEF1F6" }}>
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-5 pt-4 pb-4 space-y-4">

          {/* Page header */}
          <div>
            <h1
              className="font-bold leading-tight"
              style={{ fontSize: "2.1rem", color: "#1B2A4A" }}
            >
              Population and Society
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
              Ghana Statistical Service · Population &amp; Housing Census · 2025 Projections
            </p>
          </div>

          {/* Row 1: KPI strip */}
          <PopulationKPIStrip />

          {/* Row 2: Population growth chart | Intercensal table + Gender split */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "3fr 2fr", minHeight: "280px" }}>
            <PopulationGrowthChart />
            <div className="flex flex-col gap-4 h-full">
              <div style={{ flex: 6, minHeight: 0 }}>
                <InterCensalTable />
              </div>
              <div style={{ flex: 4, minHeight: 0 }}>
                <GenderSplitCard />
              </div>
            </div>
          </div>

          {/* Row 3: Population pyramid | Age group distribution — fixed 400px */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "3fr 2fr", height: "400px" }}>
            <PopulationPyramid />
            <AgeGroupDistribution />
          </div>

          {/* Row 4: Urban-rural | Life expectancy — fixed 320px */}
          <div className="grid gap-4" style={{ gridTemplateColumns: "3fr 2fr", height: "320px" }}>
            <UrbanRuralChart />
            <LifeExpectancyChart />
          </div>

          {/* Row 5: Fertility & Household */}
          <FertilityHouseholdCard />

          <p className="text-xs text-right pb-1" style={{ color: "#9CA3AF" }}>
            Source: Ghana Statistical Service — Ghana In Numbers 2025 | Powered by StatsBank | © GSS
          </p>
        </main>
      </div>
    </div>
  );
}
