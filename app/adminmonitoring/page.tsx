import type { Metadata } from "next";
import DashboardShell from "@/components/layout/DashboardShell";
import OverviewTopBar from "@/components/home/OverviewTopBar";
import AdminDashboard from "@/components/admin-monitoring/AdminDashboard";
import { PageBody, PageHeader } from "@/components/ui/Page";

// Reached by its address only: it is not in the sidebar, the search index or the assistant, and is kept out of search engines.
export const metadata: Metadata = {
  title: "District Administrative Data Monitor | Ghana Statistical Service",
  description: "Completeness, uniqueness, validity and accuracy of administrative data reported by Ghana’s 261 Metropolitan, Municipal and District Assemblies, 2015 to 2025.",
  robots: { index: false, follow: false },
};

export default function AdminMonitoringPage() {
  return (
    <DashboardShell>
      <OverviewTopBar page="District Administrative Data Monitor" regionalTarget="adm-tabs" />
      <PageBody>
        <PageHeader
          eyebrow="Monitoring dashboard · MMDA administrative data"
          title="District Administrative Data Monitor"
          description="How much of the administrative data expected from Ghana’s 261 Metropolitan, Municipal and District Assemblies has been received, and whether what was received can be used. Start with the overview, then open a region or a district."
          meta={[
            { label: "Coverage", value: "261 districts, reporting years 2015 to 2025" },
            { label: "Compiled", value: "16 October 2026" },
            { label: "Source", value: "GSS, MMDAs Administrative Data Quality Assessment and District Completion Factsheets" },
          ]}
        />
        <AdminDashboard />
      </PageBody>
    </DashboardShell>
  );
}
