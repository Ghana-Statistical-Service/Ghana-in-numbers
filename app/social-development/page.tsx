import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import CompletionTrajectoryChart from "@/components/social-development/CompletionTrajectoryChart";
import HealthWellbeingPanel from "@/components/social-development/HealthWellbeingPanel";
import LearningOpportunityChart from "@/components/social-development/LearningOpportunityChart";
import LivingConditionsPanel from "@/components/social-development/LivingConditionsPanel";
import ProtectionPanel from "@/components/social-development/ProtectionPanel";
import PupilTeacherRatioChart from "@/components/social-development/PupilTeacherRatioChart";
import SocialDevelopmentKPIStrip from "@/components/social-development/SocialDevelopmentKPIStrip";

export default function SocialDevelopmentPage() {
  return (
    <div className="flex h-full overflow-hidden" style={{ background: "#EEF1F6" }}>
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-5 pt-4 pb-4 space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1
                className="font-bold leading-tight"
                style={{ fontSize: "2.1rem", color: "#1B2A4A" }}
              >
                Social Development
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                Ghana Statistical Service · Learning, health, living conditions and protection indicators
              </p>
            </div>
            <div className="hidden xl:flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full" style={{ background: "#17B8A6" }} />
              <span className="text-xs font-semibold" style={{ color: "#475569" }}>
                Indicators scoped to supplied Ghana in Numbers references
              </span>
            </div>
          </div>

          <SocialDevelopmentKPIStrip />

          <section className="space-y-3">
            <div>
              <p className="text-lg font-bold" style={{ color: "#00A651" }}>Learning and opportunity</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>Enrolment, completion and trained teacher ratios.</p>
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr", height: "380px" }}>
              <LearningOpportunityChart />
              <CompletionTrajectoryChart />
            </div>
            <div style={{ height: "360px" }}>
              <PupilTeacherRatioChart />
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-lg font-bold" style={{ color: "#00A651" }}>Health and well-being</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>Health insurance coverage and teenage motherhood.</p>
            </div>
            <HealthWellbeingPanel />
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-lg font-bold" style={{ color: "#00A651" }}>Living conditions</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>Housing deficits and household utilities.</p>
            </div>
            <LivingConditionsPanel />
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-lg font-bold" style={{ color: "#00A651" }}>Inclusion and protection</p>
              <p className="text-xs" style={{ color: "#94A3B8" }}>Gender-based violence prevalence and child marriage.</p>
            </div>
            <ProtectionPanel />
          </section>

          <p className="text-xs text-right pb-1" style={{ color: "#9CA3AF" }}>
            Source: Ghana In Numbers 2025 reference indicators | Powered by StatsBank | © GSS
          </p>
        </main>
      </div>
    </div>
  );
}
