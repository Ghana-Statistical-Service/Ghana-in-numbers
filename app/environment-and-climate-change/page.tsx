import { CloudRain, Leaf, Sun, Thermometer, Trees } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import OverviewTopBar from "@/components/home/OverviewTopBar";
import { CarbonCard, CarbonChangeCard, CarbonTopCard, ForestCard, ForestHeadlineCard, ForestShareCard, RainfallCard, TemperatureCard } from "@/components/environment/EnvironmentSections";
import { KpiCard, KpiGrid } from "@/components/ui/Card";
import { Grid, PageBody, PageHeader, Section, SectionNav } from "@/components/ui/Page";

export default function EnvironmentAndClimateChangePage() {
  return (
    <DashboardShell>
      <OverviewTopBar page="Environment and Climate Change" />
      <PageBody>
        <PageHeader
          eyebrow="Chapter 7"
          title="Environment and Climate Change"
          description="Where Ghana’s forest reserves are, how much carbon its land stores and how that stock changed, and the 2025 pattern of rainfall and temperature."
          meta={[{ label: "Sources", value: "Forestry Commission, EPA–GSS–FC ecosystem accounts, GMet" }, { label: "Latest", value: "December 2025 (forests); 2021 (carbon)" }]}
        />

        <KpiGrid>
          <KpiCard icon={Trees} label="Forest reserve area" value="24,133.53" unit="km²" period="Dec 2025, 12 regions" explain={{ label: "Forest Reserve Area" }} note="Western holds 29.5%" />
          <KpiCard icon={Leaf} label="Grassland carbon" value="344.0" unit="Mt C" period="2021" explain={{ label: "Grassland Carbon" }} note="Largest store of any land cover" />
          <KpiCard icon={CloudRain} label="Peak rainfall" value="216.7" unit="mm" period="June 2025" explain={{ label: "Peak Rainfall" }} note="Monthly average 99.3 mm" />
          <KpiCard icon={Thermometer} label="Peak temperature" value="30.4" unit="°C" period="March 2025" explain={{ label: "Peak Temperature" }} note="Monthly average 28.2°C" />
          <KpiCard icon={Sun} label="Lowest rainfall" value="11.1" unit="mm" period="January 2025" explain={{ label: "Lowest Rainfall" }} note="The driest month" />
        </KpiGrid>

        <SectionNav items={[{ id: "forests", label: "Forest reserves" }, { id: "carbon", label: "Carbon" }, { id: "climate", label: "Rainfall and temperature" }]} />

        <Section id="forests" accent="green" title="Forest reserves and carbon retention" description="Three regions hold about 60% of the reported reserve area; vegetation and soils hold carbon that would otherwise reach the atmosphere, and the stock fell between 2015 and 2021." source="§7.1–7.2 · pp. 92–93">
          <Grid cols="2-1"><ForestCard /><ForestHeadlineCard /></Grid>
          <Grid cols="1-2" className="mt-4 lg:mt-5"><ForestShareCard /><div id="carbon" className="flex min-w-0 scroll-mt-16 flex-col"><CarbonTopCard /></div></Grid>
          <Grid cols={2} className="mt-4 lg:mt-5"><CarbonCard /><CarbonChangeCard /></Grid>
        </Section>

        <Section id="climate" accent="green" title="Rainfall and temperature" description="Two rainfall peaks and a narrow temperature range shape the farming calendar." source="§7.3–7.4 · pp. 94–95">
          <Grid cols={2}><RainfallCard /><TemperatureCard /></Grid>
        </Section>
      </PageBody>
    </DashboardShell>
  );
}
