import ClimateMonthlyPanel from "@/components/environment/ClimateMonthlyPanel";
import EnvironmentKPIStrip from "@/components/environment/EnvironmentKPIStrip";
import ForestCarbonPanel from "@/components/environment/ForestCarbonPanel";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function EnvironmentAndClimateChangePage() {
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
                Environment and Climate Change
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                Ghana Statistical Service · Forest reserves, carbon retention, rainfall and temperature
              </p>
            </div>
            <div className="hidden xl:flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full" style={{ background: "#00A651" }} />
              <span className="text-xs font-semibold" style={{ color: "#475569" }}>
                Forest reserve table redesigned as chart
              </span>
            </div>
          </div>

          <EnvironmentKPIStrip />

          <section className="space-y-3">
            <div>
              <p className="text-lg font-bold" style={{ color: "#00A651" }}>Forest reserves and carbon retention</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>
                Protected forest share by region and carbon retained across land-cover classes.
              </p>
            </div>
            <ForestCarbonPanel />
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-lg font-bold" style={{ color: "#00A651" }}>Rainfall and temperature</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>
                Monthly 2024 patterns compared with the 2020-2023 reference period.
              </p>
            </div>
            <ClimateMonthlyPanel />
          </section>

          <p className="text-xs text-right pb-1" style={{ color: "#9CA3AF" }}>
            Source: Ghana In Numbers 2025 reference indicators | Powered by StatsBank | © GSS
          </p>
        </main>
      </div>
    </div>
  );
}
