import type { Metadata } from "next";
import DashboardShell from "@/components/layout/DashboardShell";
import OverviewTopBar from "@/components/home/OverviewTopBar";
import MpiDashboard from "@/components/mpi/MpiDashboard";
import { PageBody, PageHeader } from "@/components/ui/Page";

export const metadata: Metadata = {
  title: "Multidimensional Poverty | Ghana in Numbers",
  description: "Ghana’s Multidimensional Poverty Index for the country, its 16 regions and 261 districts: how many people are poor, where, who, and what drives it. Official statistics from the Ghana Statistical Service.",
};

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** ?view=, ?region= and ?district= open a tab and a place directly, so links from search and StatsChat land on the right profile. */
export default async function MultidimensionalPovertyPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return (
    <DashboardShell>
      <OverviewTopBar page="Multidimensional Poverty" regionalTarget="mpi-tabs" />
      <PageBody>
        <PageHeader
          eyebrow="Thematic dashboard · SDG 1.2.2"
          title="Multidimensional Poverty"
          description="Poverty is more than a lack of money. This page shows how many people in Ghana go without several basic needs at once in health, living conditions, education and employment, where they live, and which needs matter most."
          meta={[
            { label: "Source", value: "Ghana Statistical Service: MPI reports and StatsBank" },
            { label: "Latest", value: "2025 Q3 (national, regional); 2025 (districts)" },
            { label: "Also", value: "2021 census (national, regional, household groups)" },
            { label: "Status", value: "Official statistics, as published" },
          ]}
        />
        <MpiDashboard view={one(params.view)} region={one(params.region)} district={one(params.district)} />
      </PageBody>
    </DashboardShell>
  );
}
