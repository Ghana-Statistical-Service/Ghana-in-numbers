import DashboardShell from "@/components/layout/DashboardShell";
import CitiesEnvironmentPanel from "@/components/sdg/CitiesEnvironmentPanel";
import HumanDevelopmentPanel from "@/components/sdg/HumanDevelopmentPanel";

export default function ProgressOnSDGsPage() {
  return (
    <DashboardShell>
      <main
        className="flex-1 overflow-y-auto px-5 pt-4 pb-8"
        style={{ background: "#EEF1F6" }}
      >
        {/* Page header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 style={{ color: "#1B2A4A", fontSize: "2.1rem", fontWeight: 900, lineHeight: 1.15 }}>
              Progress on SDGs
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Ghana Statistical Service · Sustainable Development Goals indicators
            </p>
          </div>
          <span
            className="hidden sm:inline-flex rounded-full px-3 py-1 text-xs font-bold mt-1"
            style={{ background: "#EFF6FF", color: "#1D4ED8" }}
          >
            SDG Dashboard
          </span>
        </div>

        <div className="space-y-6">
          {/* Section 1 */}
          <section>
            <p className="text-lg font-bold mb-3" style={{ color: "#1D4ED8" }}>
              Human Development and Basic Needs
            </p>
            <HumanDevelopmentPanel />
          </section>

          {/* Section 2 */}
          <section>
            <p className="text-lg font-bold mb-3" style={{ color: "#1D4ED8" }}>
              Cities, Environment and Sustainability
            </p>
            <CitiesEnvironmentPanel />
          </section>

          {/* Footer */}
          <p className="text-xs text-right" style={{ color: "#94A3B8" }}>
            Source: Ghana Statistical Service — Ghana in Numbers 2025
          </p>
        </div>
      </main>
    </DashboardShell>
  );
}
