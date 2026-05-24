import DashboardShell from "@/components/layout/DashboardShell";
import AgriculturePanel from "@/components/youth/AgriculturePanel";

export default function AgricultureForestryFishingPage() {
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
              Agriculture, Forestry &amp; Fishing
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Ghana Statistical Service · Thematic Deep Dive — 2010 vs 2021
            </p>
          </div>
          <span
            className="hidden sm:inline-flex rounded-full px-3 py-1 text-xs font-bold mt-1"
            style={{ background: "#F0FDF4", color: "#15803D" }}
          >
            Thematic Deep Dive
          </span>
        </div>

        <div className="space-y-6">
          <section>
            <AgriculturePanel />
          </section>

          <p className="text-xs text-right" style={{ color: "#94A3B8" }}>
            Source: Ghana Statistical Service — 2010 &amp; 2021 Population and Housing Census
          </p>
        </div>
      </main>
    </DashboardShell>
  );
}
