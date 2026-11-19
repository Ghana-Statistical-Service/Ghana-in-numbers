import type { Metadata } from "next";
import DashboardShell from "@/components/layout/DashboardShell";
import OverviewTopBar from "@/components/home/OverviewTopBar";
import MpiDashboard from "@/components/mpi/MpiDashboard";
import { PageBody } from "@/components/ui/Page";

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
      <PageBody className="!pt-4 lg:!pt-5">
        <MpiDashboard view={one(params.view)} region={one(params.region)} district={one(params.district)} />
      </PageBody>
    </DashboardShell>
  );
}
